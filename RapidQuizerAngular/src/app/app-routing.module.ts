import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LatexToJsonComponent } from './components/latex-to-json/latex-to-json.component';
import {PanierComponent} from './components/panier/panier.component';
import { LoginComponent } from './auth/components/login-component/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { AuthGuard } from './auth/guards/auth/auth-guard.guard';
import { AddComponent } from './components/add/add.component';

const routes: Routes = [
  { path: '', component: LatexToJsonComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'add', component: AddComponent, canActivate: [AuthGuard] },  
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
