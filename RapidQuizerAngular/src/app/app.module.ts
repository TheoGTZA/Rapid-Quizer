import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LatexToJsonComponent } from './latex-to-json/latex-to-json.component';

@NgModule({
  declarations: [
    AppComponent,
    LatexToJsonComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }