import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-latex-to-json',
  templateUrl: './latex-to-json.component.html',
  styleUrls: ['./latex-to-json.component.css']
})
export class LatexToJsonComponent {
}
