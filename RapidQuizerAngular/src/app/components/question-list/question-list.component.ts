import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/question';
import { Category } from '../../models/category';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../services/questionsService';
import * as katex from 'katex';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css'
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;

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
        console.log('All questions loaded:', data);
      },
      error: (error) => {
        console.error('Error loading questions:', error);
      }
    });
  }

  onCategoryChange(event: any) {
    this.selectedCategoryId = event.target.value ? Number(event.target.value) : null;
    if (this.selectedCategoryId) {
      this.questionService.getQuestionsByCategory(this.selectedCategoryId).subscribe({
        next: (data) => {
          this.questions = data;
        },
        error: (error) => {
          console.error('Error loading questions for category:', error);
        }
      });
    } else {
      this.loadQuestions();
    }
  }


  getFilteredQuestions(): Question[] {
    return this.questions;
  }

  ngAfterViewChecked() {
    this.renderMath();
  }

  cleanLatex(text: string): string {
    // Nettoie le texte des guillemets et retours à la ligne
    text = text
      .replace(/^"|"$/g, '')
      .replace(/\n/g, ' ')
      .trim();
  
    // Gestion des expressions mathématiques
    return text.split(/(\$[^\$]+\$)/g)
      .map(segment => {
        if (segment.trim() === '') return '';
        if (segment.startsWith('$') && segment.endsWith('$')) {
          // Enlève les $ et renvoie juste l'expression mathématique
          return segment.slice(1, -1);
        } else {
          // Nettoie le texte des espaces multiples
          return `\\text{${segment.replace(/\s+/g, ' ').trim()}}`;
        }
      })
      .filter(Boolean) // Supprime les segments vides
      .join(' ');
  }
  
  renderMath() {
    const elements = document.getElementsByClassName('math');
    Array.from(elements).forEach((element: HTMLElement) => {
      if (element && element.textContent) {
        try {
          const processedText = this.cleanLatex(element.textContent);
          katex.render(processedText, element, {
            throwOnError: false,
            strict: false,
            trust: true,
            displayMode: true, // Changed to true for better rendering
            macros: {
              "\\mathbb": "\\mathbb",
              "\\R": "\\mathbb{R}"
            }
          });
        } catch (e) {
          console.error('KaTeX rendering error:', e);
          console.log('Problematic text:', element.textContent);
        }
      }
    });
  }
}