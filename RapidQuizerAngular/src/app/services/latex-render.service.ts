import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class LatexRenderService {
  private loading = false;
  private mathRendered = false;

  constructor(private sanitizer: DomSanitizer) {}

  cleanLatex(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/\\begin\{multicols\}\{\d+\}/g, '')
      .replace(/\\end\{multicols\}/g, '')
      .replace(/\\begin\{center\}/g, '')
      .replace(/\\end\{center\}/g, '')
      .replace(/\\begin\{(reponses|choices)\}/g, '')
      .replace(/\\end\{(reponses|choices)\}/g, '')
      .replace(/\\includegraphics\{([^}]+)\}/g, '<img src="assets/images/$1.png" alt="$1" class="latex-image">')
      .replace(/\\par/g, '<br>')
      .replace(/\\(bonne|mauvaise|correctchoice|wrongchoice)\{([^}]+)\}/g, '$2')
      .replace(/^"|"$/g, '')
      .replace(/\n/g, ' ')
      .replace(/\\lbrace/g, '\\{')
      .replace(/\\rbrace/g, '\\}')
      .replace(/\\mathbb\{([^}]+)\}/g, '\\mathbb{$1}')
      .replace(/\s+/g, ' ')
      .trim();
  }

  renderMath(): Promise<void> {
    if (!this.mathRendered && window.MathJax && window.MathJax.typesetPromise) {
      try {
        this.mathRendered = true;
        this.loading = true;

        return window.MathJax.typesetPromise()
          .then(() => {
            requestAnimationFrame(() => {
              this.loading = false;
            });
          })
          .catch((err: any) => {
            console.error('MathJax error:', err);
            this.mathRendered = false;
            this.loading = false;
            throw err;
          });
      } catch (e) {
        console.error('Error during MathJax rendering:', e);
        this.mathRendered = false;
        this.loading = false;
        return Promise.reject(e);
      }
    }
    return Promise.resolve();
  }

  resetMathRendered() {
    this.mathRendered = false;
  }

  isLoading(): boolean {
    return this.loading;
  }
}