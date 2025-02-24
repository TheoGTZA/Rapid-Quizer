import { Component } from '@angular/core';

@Component({
  selector: 'app-latex-to-json',
  templateUrl: './latex-to-json.component.html',
  styleUrls: ['./latex-to-json.component.css']
})
export class LatexToJsonComponent {
  file: any;

  getFile(event: any) {
    this.file = event.target.files[0];
    console.log('File selected:', this.file);
  }

  async uploadFile() {
    if (!this.file) {
      console.error('No file selected');
      return;
    }

    let formData = new FormData();
    formData.append('file', this.file);

    console.log('FormData content:', formData.get('file'));

    try {
      const response = await fetch('/upload', { // On utilise /upload au lieu de http://localhost:8080/upload car on est dans le même serveur(proxy.conf.json)
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response JSON:', result);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
}