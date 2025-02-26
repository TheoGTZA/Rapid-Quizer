import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../models/category';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-latex-to-json',
  templateUrl: './latex-to-json.component.html',
  styleUrls: ['./latex-to-json.component.css'],
  imports: [FormsModule, HttpClientModule],
})
export class LatexToJsonComponent {
  file: any;
  categories: any[] = [];
  selectedCategory: number;
  newCategory: { name: string; parentId: number | null } = { name: '', parentId: null };

  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };
  
  constructor(private http: HttpClient) {}

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
    this.file = event.target.files[0];
    console.log('File selected:', this.file);
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

}