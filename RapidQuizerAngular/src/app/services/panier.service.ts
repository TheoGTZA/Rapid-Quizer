import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Question} from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  totalAmount : number=0;
  cartQuestions = [];

  constructor(private router : Router) { }

  addQuestionsToCart = (question : Question) => {
    let productExists = false;
    for (let i in this.cartQuestions) {
      if (this.cartQuestions[i].id === question.id) {
        productExists = true;
      }
    }
    if (!productExists) {
      this.cartQuestions.push({
        id: question.id,
        text: question.text,
        category: question.category,
        answers: question.answers
      });
      this.totalAmount ++;
      console.log("Product added to the cart");
    }
    else{
      console.log("Product already exists in the cart");
    }
  }

  getCartQuestions(): Question[] {
    return this.cartQuestions;
  }

  removeQuestionFromCart(questionId: number): void {
    this.cartQuestions = this.cartQuestions.filter(q => q.id !== questionId);
    this.totalAmount--;
  }

  clearCart(): void {
    this.cartQuestions = [];
    this.totalAmount = 0;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }


}
