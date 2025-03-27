import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LatexToJsonComponent } from './components/latex-to-json/latex-to-json.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {PanierComponent} from './components/panier/panier.component';

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AppComponent,
    LatexToJsonComponent,
    NavbarComponent,
    PanierComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
