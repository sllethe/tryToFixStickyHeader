import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here

import { AppComponent }  from './app.component';
import { StickyHeaderComponent } from './sticky-header';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule // <-- import the FormsModule before binding with [(ngModel)]
  ],
  declarations: [
    AppComponent,
    StickyHeaderComponent,
  ],
  exports: [StickyHeaderComponent],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
