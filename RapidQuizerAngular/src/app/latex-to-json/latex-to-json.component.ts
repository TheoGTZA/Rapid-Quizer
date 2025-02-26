import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-latex-to-json',
  templateUrl: './latex-to-json.component.html',
  styleUrls: ['./latex-to-json.component.css'],
  imports: [NgIf, NgFor, FormsModule, HttpClientModule]
})
export class LatexToJsonComponent {
  file: any;
  categories: any[] = [];
  selectedCategory: number;


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get('/categories').subscribe((data: any[]) => {
      this.categories = data;
    });
  }

  getFile(event: any) {
    let fileDrop: any = event.target.files[0];
    console.log('File selected:', fileDrop);

    // Vérification de l'extension du fichier drop
    const file_ext: string = fileDrop.name.split('.')[fileDrop.name.split('.').length-1];
    if(file_ext == "tex") {
      this.file = fileDrop;
    }
    else {
      console.error("Le fichier n'est pas au format LaTeX !");
    }
  }

  async uploadFile() {
    if (!this.file) {
      console.error('No file selected');
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
      const response = await fetch('/upload', { // On utilise /upload au lieu de http://localhost:8080/upload car on est dans le même serveur(proxy.conf.json)
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
}
