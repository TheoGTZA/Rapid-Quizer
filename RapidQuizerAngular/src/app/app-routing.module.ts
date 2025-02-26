import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LatexToJsonComponent } from './latex-to-json/latex-to-json.component';

const routes: Routes = [
  { path: '', component: LatexToJsonComponent },
  // Les requêtes API seront gérées par le proxy, pas besoin de les router ici
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }