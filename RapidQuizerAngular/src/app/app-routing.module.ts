import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LatexToJsonComponent } from './components/latex-to-json/latex-to-json.component';
import {PanierComponent} from './components/panier/panier.component';
import { LoginComponent } from './auth/components/login-component/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { AuthGuard } from './auth/guards/auth/auth-guard.guard';

const routes: Routes = [
  { path: '', component: LatexToJsonComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'panier', component: PanierComponent },
  { path: '**', redirectTo: '' },
  {path: 'add', component: LatexToJsonComponent, canActivate: [AuthGuard]}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
