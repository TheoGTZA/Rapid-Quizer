import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LatexToJsonComponent } from './components/latex-to-json/latex-to-json.component';
import {PanierComponent} from './components/panier/panier.component';

const routes: Routes = [
  { path: '', component: LatexToJsonComponent }
  // Les requêtes API seront gérées par le proxy, pas besoin de les router ici
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
