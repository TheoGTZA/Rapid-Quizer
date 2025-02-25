import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 

import { AppComponent } from './app.component';
import { LatexToJsonComponent } from './latex-to-json/latex-to-json.component';

@NgModule({
  declarations: [
    AppComponent,
    LatexToJsonComponent
  ],
  imports: [
    BrowserModule,
    CommonModule, 
    FormsModule, 
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }