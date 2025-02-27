import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/question';
import { Category } from '../../models/category';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../services/questionsService';

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
}