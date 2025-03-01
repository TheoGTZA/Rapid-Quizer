import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/question';
import { Category } from '../../models/category';
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

  constructor(private questionService: QuestionService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadQuestions();
  }

  loadCategories() {
    this.questionService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
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

  onCategoryChange(event: any) {
    this.selectedCategoryId = event.target.value ? Number(event.target.value) : null;
    this.mathRendered = false;
    this.loading = true; // Activer l'état de chargement
  
    if (this.selectedCategoryId) {
      this.questionService.getQuestionsByCategory(this.selectedCategoryId).subscribe({
        next: (data) => {
          // Pré-traitement des questions avant affichage
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
    return this.questions;
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