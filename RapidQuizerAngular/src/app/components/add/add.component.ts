import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { firstValueFrom } from 'rxjs';
import {CommonModule, NgForOf} from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  imports: [FormsModule, HttpClientModule, NgForOf, CommonModule]
})
export class AddComponent {
  file: any;
  categories: any[] = [];
  selectedCategory: number;
  newCategory: { name: string; parentId: number | null } = { name: '', parentId: null };
  fileError: string | null = null;
  newData : { question: string; answers: string[]; correct: boolean[], isPersonal: boolean} = {question: '', answers: [], correct: [], isPersonal: true};
  nbAnswers: number = 4;
  inputs: number[] = [];
  canChooseQuestionType: boolean = false;
  canCreateCategory: boolean = false;
  private apiUrl = 'http://localhost:8080';

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
  }


  constructor(private http: HttpClient, private authService: AuthService) {
    this.updateNbInputs();
  }

  ngOnInit() {
    this.loadCategories();
    const userRole = this.authService.getUserRole();
    this.canChooseQuestionType = userRole === 'ADMIN' || userRole === 'CONTRIBUTOR';
    this.canCreateCategory = userRole === 'ADMIN';
  }

  loadCategories() {
    console.log('Loading categories...');
    console.log('Auth token:', this.authService.getToken()); // Debug token


    this.http.get<Category[]>(
      `${this.apiUrl}/api/categories`,
      this.getHttpOptions()
    ).subscribe({
      next: (data: Category[]) => {
        console.log('Categories loaded successfully:', data);
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        if (error.status === 403) {
          console.error('Authorization error - check your token');
        }
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

    const userRole = this.authService.getUserRole();
    if (userRole === 'USER') {
      this.newData.isPersonal = true;
    }


    let formData = new FormData();
    formData.append('file', this.file);
    formData.append('category', this.selectedCategory.toString());
    formData.append('isPersonal', this.newData.isPersonal.toString());

    console.log('FormData content:', formData.get('file'));

    try {
      const response = await fetch(`${this.apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${this.authService.getToken()}`
        }
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

      console.log('Attempting to create category:', categoryToCreate);

      const result = await firstValueFrom(
        this.http.post<Category>(
          `${this.apiUrl}/api/categories`,
          categoryToCreate,
          this.getHttpOptions()
        )
      );

      console.log('Category created successfully:', result);
      await this.loadCategories();
      this.newCategory = { name: '', parentId: null };
    } catch (error: any) {
      console.error('Error creating category:', error);
      if (error.status === 403) {
        console.error('Authorization error - make sure you have ADMIN role');
      }
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

    const userRole = this.authService.getUserRole();
    if (userRole === 'USER') {
      this.newData.isPersonal = true;
    }

    try {
      const formData = new FormData();
      formData.append('question', this.newData.question);
      formData.append('answers', JSON.stringify(this.newData.answers));
      formData.append('category', this.selectedCategory.toString());
      formData.append('correct', JSON.stringify(this.newData.correct));
      formData.append('isPersonal', this.newData.isPersonal.toString());

      console.log('Is Personal:', this.newData.isPersonal);
      console.log('Sending question data:', formData);

      const result = await firstValueFrom(
        this.http.post(
          `${this.apiUrl}/api/uploadqa`,
          formData,
          {
            headers: new HttpHeaders({
              'Authorization': `Bearer ${this.authService.getToken()}`
            }),
            responseType: 'text'
          }
        )
      );

      console.log('Response:', result);

      this.newData = {
        question: '',
        answers: [],
        correct: [],
        isPersonal: false
      };
      this.updateNbInputs();

    } catch (error) {
      console.error('Error uploading question:', error);
    }
  }


}
