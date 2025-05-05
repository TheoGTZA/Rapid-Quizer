import { Routes } from '@angular/router';
import { LatexToJsonComponent } from './components/latex-to-json/latex-to-json.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { AddComponent } from './components/add/add.component';
import {PanierComponent} from './components/panier/panier.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { LoginComponent } from './auth/components/login-component/login.component';
import { AuthGuard } from './auth/guards/auth/auth-guard.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/latex-to-json', pathMatch: 'full' },
  { path: 'latex-to-json', component: LatexToJsonComponent },
  { path: 'questions', component: QuestionListComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add', component: AddComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/latex-to-json' } 
];
