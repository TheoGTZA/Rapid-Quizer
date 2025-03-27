import { Component, OnInit } from '@angular/core';
import { PanierService } from '../../services/panier.service';
import { Question } from '../../models/question';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
  cartQuestions: Question[] = [];

  constructor(private panierService: PanierService) {}

  ngOnInit(): void {
    this.loadCartQuestions();
  }

  loadCartQuestions(): void {
    this.cartQuestions = this.panierService.getCartQuestions();
  }

  removeQuestion(questionId: number): void {
    this.panierService.removeQuestionFromCart(questionId);
    this.loadCartQuestions();
  }

  clearCart(): void {
    this.panierService.clearCart();
    this.loadCartQuestions();
  }
}
