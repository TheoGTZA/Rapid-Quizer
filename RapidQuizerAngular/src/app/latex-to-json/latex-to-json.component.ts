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
    console.log(this.file);
  }

  //Pas le bakc end donc fonctionne pas
  /*async uploadFile() {
    let formData = new FormData();
    formData.set('file', this.file);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }*/
}