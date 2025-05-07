import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/question';
import { Category } from '../../models/category';
import { CategoryTree } from '../../models/CategoryTree';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../services/questionsService';
import {PanierService} from '../../services/panier.service';
import { LatexRenderService } from '../../services/latex-render.service';
import { AuthService } from '../../auth/services/auth.service';

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



export class QuestionListComponent implements OnInit, AfterViewInit {
  questionsPublic: Question[] = [];
  questionsPersonal: Question[] = [];
  questions: Question[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  loading = false;
  categoriesTree: CategoryTree[] = [];
  expandedCategories: Set<number> = new Set();
  isSidebarVisible: boolean = true;
  itemsPerPage: number = 8;
  currentPage: number = 1;

  constructor(private questionService: QuestionService,
              private panierService: PanierService,
              private latexService: LatexRenderService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadQuestions();
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderMath(), 0);
  }

  renderLatex(text: string): string {
  return this.latexService.cleanLatex(text);
  }

  renderMath() {
    this.latexService.renderMath();
  }


  loadCategories() {
    this.questionService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.categoriesTree = this.buildCategoryTree(data);
        console.log('Arbre de catégories', this.categoriesTree);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  buildCategoryTree(categories: Category[]): CategoryTree[] {
    const categoryMap = new Map<number, CategoryTree>();
    const roots: CategoryTree[] = [];


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


    categories.forEach(cat => {
      const node = categoryMap.get(cat.id);
      if (!node) return;

      if (cat.parent) {
        const parentNode = categoryMap.get(cat.parent.id);
        if (parentNode) {
          node.level = parentNode.level + 1;
          parentNode.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        node.level = 0;
        roots.push(node);
      }
    });

    const sortChildren = (node: CategoryTree) => {
      node.children.sort((a, b) => a.name.localeCompare(b.name));
      node.children.forEach(child => sortChildren(child));
    };

    roots.sort((a, b) => a.name.localeCompare(b.name));
    roots.forEach(root => sortChildren(root));

    return roots;
  }

  toggleCategory(categoryId: number, event: Event): void {
    event.stopPropagation(); // Empêche le déclenchement de la sélection de la catégorie
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

  shuffleArray<T>(array: T[]): T[] {
    // copie pour ne pas modifier l'Array originel
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  loadQuestions() {
    this.questionService.getQuestionsPublic().subscribe({
      next: (data) => {
        this.questionsPublic = data;
        this.questions = [...this.questionsPersonal, ...this.questionsPublic];
        this.questions = this.shuffleArray(this.questions);
        this.latexService.resetMathRendered();
        setTimeout(() => this.renderMath(), 100);
      },
      error: (error) => {
        console.error('Error loading questions:', error);
      }
    });
    try {
      this.questionService.getQuestionsPersonal().subscribe({
        next: (data) => {
          this.questionsPersonal = data;
          this.questions = [...this.questionsPersonal, ...this.questionsPublic];
          this.questions = this.shuffleArray(this.questions);
          this.latexService.resetMathRendered();
          setTimeout(() => this.renderMath(), 100);
        },
        error: (error) => {
          console.error('Error loading questions:', error);
        }
      });
    } catch (e) {
    }

  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1;
    this.loading = true;

    if (categoryId) {
      this.questionService.getQuestionsByCategoryPublic(categoryId).subscribe({
        next: (data) => {
          this.questionsPublic = data;
          this.questions = [...this.questionsPersonal, ...this.questionsPublic];
          this.questions = this.shuffleArray(this.questions);
          this.latexService.resetMathRendered();
          requestAnimationFrame(() => {
            this.renderMath();
            this.loading = false;
          });
        },
        error: (error) => {
          console.error('Error loading questions for category:', error);
          this.loading = false;
        }
      });
      this.questionService.getQuestionsByCategoryPersonal(categoryId).subscribe({
        next: (data) => {
          this.questionsPersonal = data;
          this.questions = [...this.questionsPersonal, ...this.questionsPublic];
          this.questions = this.shuffleArray(this.questions);
          this.latexService.resetMathRendered();
          requestAnimationFrame(() => {
            this.renderMath();
            this.loading = false;
          });
        },
        error: (error) => {
          console.error('Error loading questions for category:', error);
          this.loading = false;
        }
      });
    } else {
      this.loadQuestions();
      this.loading = false;
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
      this.latexService.resetMathRendered();
      setTimeout(() => this.renderMath(), 100);
    }
  }

  getPaginationArray(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }



  selectQuestion(question: Question): void {
    this.panierService.addQuestionsToCart(question);
  }

  renderMathContent() {
    if (window.MathJax) {
      try {
        window.MathJax.typesetClear?.();
        window.MathJax.typesetPromise?.()
          .then(() => {
            console.log('MathJax rendering successful');
            this.loading = false;
          })
          .catch(err => {
            console.error('MathJax error:', err);
            this.loading = false;
          });
      } catch (e) {
        console.error('Error during MathJax processing:', e);
        this.loading = false;
      }
    }
  }

}
