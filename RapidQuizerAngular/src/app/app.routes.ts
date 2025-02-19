import { Routes } from '@angular/router';
import { LatexToJsonComponent } from './latex-to-json/latex-to-json.component';

export const routes: Routes = [
  { path: 'latex-to-json', component: LatexToJsonComponent },
  { path: '', redirectTo: '/latex-to-json', pathMatch: 'full' }
];