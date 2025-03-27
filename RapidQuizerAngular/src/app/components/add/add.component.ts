import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { firstValueFrom } from 'rxjs';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  imports: [FormsModule, HttpClientModule, NgForOf]
})
export class AddComponent {
  file: any;
  categories: any[] = [];
  selectedCategory: number;
  newCategory: { name: string; parentId: number | null } = { name: '', parentId: null };
  fileError: string | null = null;
  newData : { question: string; answers: string[]; correct: boolean[]} = {question: '', answers: [], correct: []};
  nbAnswers: number = 4;
  inputs: number[] = [];


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    this.updateNbInputs();
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<Category[]>('/api/categories', this.httpOptions).subscribe({
      next: (data: Category[]) => {
        console.log('Categories loaded:', data);
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }


  getFile(event: any) {
    let fileDrop = event.target.files[0];

    const file_ext: string = fileDrop.name.split('.')[fileDrop.name.split('.').length-1];
    if(file_ext == "tex") {
      this.file = fileDrop;
      this.fileError = null;
      console.log('File selected:', this.file);
    }
    else {
      this.fileError = "Le fichier doit être au format LaTeX (.tex)";
      console.error("Le fichier n'est pas au format LaTeX !");
    }
  }

  async uploadFile() {
    if (!this.file || !this.selectedCategory) {
      console.error('File and category are required');
      return;
    }

    if (!this.selectedCategory) {
      console.error('No category selected');
      return;
    }

    let formData = new FormData();
    formData.append('file', this.file);
    formData.append('category', this.selectedCategory.toString());

    console.log('FormData content:', formData.get('file'));

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('Content-Type');
      let result;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = await response.text();
      }
      console.log('Response JSON:', result);

      if (response.ok) {
        this.file = undefined;
        console.log('File cleared after successful upload');
      }

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  async createCategory(): Promise<void> {
    if (!this.newCategory.name) {
      console.error('Category name is required');
      return;
    }

    try {
      const categoryToCreate = {
        name: this.newCategory.name,
        parent: this.newCategory.parentId ? { id: this.newCategory.parentId } : null
      };

      console.log('Sending category:', categoryToCreate); // Pour déboguer

      const response = await firstValueFrom(
        this.http.post<Category>('/api/categories', categoryToCreate, this.httpOptions)
      );

      console.log('Category created:', response);
      await this.loadCategories();
      this.newCategory = { name: '', parentId: null };
    } catch (error) {
      console.error('Error creating category:', error);
    }
  }

  updateNbInputs() {
    this.inputs = Array(this.nbAnswers).fill(0);
    this.newData.correct = Array(this.nbAnswers).fill(false);
  }

  onInputChange(event: Event) {
    const textArea = event.target as HTMLAreaElement;

    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
  }

  async uploadQuestionAnswers() {

    if (!this.newData.question) {
      console.error("Enter a question");
      return;
    }

    if (!this.selectedCategory) {
      console.error('No category selected');
      return;
    }

    let formData = new FormData();
    formData.append('question', this.newData.question);
    formData.append(`answers`, JSON.stringify(this.newData.answers));
    formData.append('category', this.selectedCategory.toString());
    formData.append('correct', JSON.stringify(this.newData.correct));

    console.log('FormData content:', formData.get(`answers`));

    try {
      const response = await fetch('/api/uploadqa', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('Content-Type');
      let result;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = await response.text();
      }
      console.log('Response JSON:', result);

      if (response.ok) {
        this.newData.question = null;
        this.newData.answers = [];
        console.log('Question and answers cleared after successful upload');
      }

    } catch (error) {
      console.error('Error uploading q/a:', error);
    }
  }

}
