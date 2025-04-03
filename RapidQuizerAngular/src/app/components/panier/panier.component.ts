import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PanierService } from '../../services/panier.service';
import { LatexRenderService } from '../../services/latex-render.service';
import { Question } from '../../models/question';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {jsPDF} from 'jspdf';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit, AfterViewInit {
  cartQuestions: Question[] = [];
  showAnswers: boolean = false;
  showAnswersMap: Map<number, boolean> = new Map();// Map pour stocker la visibilité des réponses

  constructor(private panierService: PanierService,
              private latexService: LatexRenderService
  ) {}

  ngOnInit(): void {
    this.loadCartQuestions();
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderMath(), 0);
  }

  // Utiliser directement cleanLatex du service
  renderLatex(text: string): string {
    return this.latexService.cleanLatex(text);
  }

  // Utiliser le service pour le rendu MathJax
  renderMath() {
    this.latexService.resetMathRendered();
    this.latexService.renderMath();
  }

  loadCartQuestions(): void {
    this.cartQuestions = this.panierService.getCartQuestions();
    // Rafraîchir le rendu LaTeX après le chargement des questions
    // Utiliser setTimeout pour s'assurer que le DOM est mis à jour
    setTimeout(() => {
      this.renderMath();
    }, 0);
  }

  toggleAnswers(): void {
    this.showAnswers = !this.showAnswers;
    setTimeout(() => {
      this.renderMath();
    }, 100);
  }

  toggleAnswerForQuestion(questionId: number): void {
    const currentState = this.showAnswersMap.get(questionId) || false;
    this.showAnswersMap.set(questionId, !currentState);
    setTimeout(() => {
      this.renderMath();
    }, 100);
  }

  isAnswerVisible(questionId: number): boolean {
    return this.showAnswersMap.get(questionId) || false;
  }

  removeQuestion(questionId: number): void {
    this.panierService.removeQuestionFromCart(questionId);
    this.loadCartQuestions();
  }

  clearCart(): void {
    this.panierService.clearCart();
    this.loadCartQuestions();
  }

  generateTEX() {
    let latex : string = "";
    latex += `\\documentclass[a4paper]{article}\n%-------------------------::== package ==::---------------------------
    \\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}\n\\usepackage{alltt}\n\\usepackage{multicol}
    \\usepackage{amsmath,amssymb}\n\\usepackage{color}\n\\usepackage{graphicx}\n
    %rajouter completemulti pour compléter les questions multiples avec "Aucune de ces réponses"
    \\usepackage[francais,bloc]{automultiplechoice}\n\\usepackage{tikz}\n\\usepackage{hyperref}\n\\usepackage{ulem} % strike text
    % fp is needed by AMC for numerical question with float. Need to be commented for amc2moodle usage (fp is not yet supported)
    \\usepackage{fp}\n\\def\\multiSymbole{}\n
    % -----------------------::== newcommand ==::--------------------------\n\\newcommand{\\feedback}[1]{}
    \\usepackage{mathrsfs}\n\\usepackage{textcomp}\n\n\n\n\n`;

    latex += `\\begin{document}\n\n`;

    for (let i : number = 0 ; i < this.cartQuestions.length ; i++) {
      latex += `\\element{${this.cartQuestions[i].category.name}}{\n\\begin{questionmult}{Question ${i+1}}
      ${this.cartQuestions[i].text}\n\\begin{reponses}\n`;
      for (let j : number = 0 ; j < this.cartQuestions[i].answers.length ; j++) {
        if (this.cartQuestions[i].answers[j].correct) {
          latex += `\\bonne{${this.cartQuestions[i].answers[j].text}}\n`;
        }
        else latex += `\\mauvaise{${this.cartQuestions[i].answers[j].text}}\n`;
      }
      latex += `\\end{reponses}\n\\end{questionmult}}\n\n`;
    }

    latex += "\\end{document}";

    const blob = new Blob([latex], {type: "text/plain:charset=utf-8"});
    saveAs(blob, "qcm.tex")
  }

  //generatePDF() {
  //  const pdf = new jsPDF();
  //
  //  pdf.text("pdf-text", 10, 10);
  //  pdf.save("file.pdf");
  //}
}
