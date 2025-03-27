import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/question';
import { Category } from '../../models/category';
import { CategoryTree } from '../../models/CategoryTree';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../services/questionsService';

declare global {
  interface Window {
    MathJax: any;
  }
}

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css'
})



export class QuestionListComponent implements OnInit, AfterViewChecked {
  private mathRendered = false;
  questions: Question[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  loading = false;
  categoriesTree: CategoryTree[] = [];
  expandedCategories: Set<number> = new Set();
  isSidebarVisible: boolean = true;
  itemsPerPage: number = 8;
  currentPage: number = 1;

  constructor(private questionService: QuestionService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadQuestions();
  }

  loadCategories() {
    this.questionService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.categoriesTree = this.buildCategoryTree(data);
        console.log('Category Tree:', this.categoriesTree);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }
  
  buildCategoryTree(categories: Category[]): CategoryTree[] {
    const categoryMap = new Map<number, CategoryTree>();
    const roots: CategoryTree[] = [];
  
    // First pass: create CategoryTree objects
    for (const cat of categories) {
      const node: CategoryTree = {
        id: cat.id,
        name: cat.name,
        parentId: cat.parent?.id || null,
        children: [],
        level: 0
      };
      categoryMap.set(cat.id, node);
    }
  
    // Second pass: build the tree structure
    categories.forEach(cat => {
      const node = categoryMap.get(cat.id);
      if (!node) return;
  
      if (cat.parent) {
        const parentNode = categoryMap.get(cat.parent.id);
        if (parentNode) {
          // Set the level based on parent's level
          node.level = parentNode.level + 1;
          // Add to parent's children
          parentNode.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        // This is a root node
        node.level = 0;
        roots.push(node);
      }
    });
  
    // Sort children arrays by name
    const sortChildren = (node: CategoryTree) => {
      node.children.sort((a, b) => a.name.localeCompare(b.name));
      node.children.forEach(child => sortChildren(child));
    };
  
    // Sort roots and all children
    roots.sort((a, b) => a.name.localeCompare(b.name));
    roots.forEach(root => sortChildren(root));
  
    // Debug logging
    console.log('Category Map:', Array.from(categoryMap.entries()));
    console.log('Roots with nested children:', JSON.stringify(roots, null, 2));
  
    return roots;
  }

  toggleCategory(categoryId: number, event: Event): void {
    event.stopPropagation(); // Prevent triggering category selection
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
  }

  isCategoryExpanded(categoryId: number): boolean {
    return this.expandedCategories.has(categoryId);
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  loadQuestions() {
    this.questionService.getQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        this.mathRendered = false;
        setTimeout(() => this.renderMath(), 100); // Délai plus long pour assurer la mise à jour du DOM
      },
      error: (error) => {
        console.error('Error loading questions:', error);
      }
    });
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1; // Remettre à la première page lors du changement de catégorie
    this.mathRendered = false;
    this.loading = true;
  
    if (categoryId) {
      this.questionService.getQuestionsByCategory(categoryId).subscribe({
        next: (data) => {
          this.questions = data;
          requestAnimationFrame(() => {
            if (window.MathJax) {
              window.MathJax.typesetClear();
              this.renderMath();
              this.loading = false;
            }
          });
        },
        error: (error) => {
          console.error('Error loading questions for category:', error);
          this.loading = false;
        }
      });
    } else {
      this.loadQuestions();
    }
  }


  getFilteredQuestions(): Question[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.questions.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.questions.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.mathRendered = false;
      setTimeout(() => this.renderMath(), 100);
    }
  }

  getPaginationArray(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  cleanLatex(text: string): string {
    if (!text) return '';

    return text
      // Nettoyer les environnements LaTeX
      .replace(/\\begin\{multicols\}\{\d+\}/g, '')
      .replace(/\\end\{multicols\}/g, '')
      .replace(/\\begin\{center\}/g, '')
      .replace(/\\end\{center\}/g, '')
      .replace(/\\begin\{(reponses|choices)\}/g, '')
      .replace(/\\end\{(reponses|choices)\}/g, '')
      // Gestion des images et paragraphes
      //A revoir ca
      .replace(/\\includegraphics\{([^}]+)\}/g, '<img src="assets/images/$1.png" alt="$1" class="latex-image">')
      .replace(/\\par/g, '<br>')
      // Nettoyer les commandes de réponse
      .replace(/\\(bonne|mauvaise|correctchoice|wrongchoice)\{([^}]+)\}/g, '$2')
      // Nettoyer les autres éléments LaTeX
      .replace(/^"|"$/g, '')
      .replace(/\n/g, ' ')
      .replace(/\\lbrace/g, '\\{')
      .replace(/\\rbrace/g, '\\}')
      .replace(/\\mathbb\{([^}]+)\}/g, '\\mathbb{$1}')
      .replace(/\s+/g, ' ')
      .trim();
  }

  renderMath() {
    if (!this.mathRendered && window.MathJax && window.MathJax.typesetPromise) {
      try {
        this.mathRendered = true;
        window.MathJax.typesetPromise()
          .then(() => {
            requestAnimationFrame(() => {
              this.loading = false;
            });
          })
          .catch((err: any) => {
            console.error('MathJax error:', err);
            this.mathRendered = false;
            this.loading = false;
          });
      } catch (e) {
        console.error('Error during MathJax rendering:', e);
        this.mathRendered = false;
        this.loading = false;
      }
    }
  }

  ngOnChanges() {
    this.mathRendered = false;
  }

  ngAfterViewChecked() {
    // Ne rien faire ici car nous gérons maintenant le rendu avec setTimeout
  }
}