import { Routes } from '@angular/router';
import { LatexToJsonComponent } from './components/latex-to-json/latex-to-json.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { AddComponent } from './components/add/add.component';
import {PanierComponent} from './components/panier/panier.component';

export const routes: Routes = [
  { path: 'latex-to-json', component: LatexToJsonComponent },
  { path: '', redirectTo: '/latex-to-json', pathMatch: 'full' },
  { path: 'questions', component: QuestionListComponent },
  { path: 'add', component: AddComponent },
  { path: 'panier', component: PanierComponent }
];
