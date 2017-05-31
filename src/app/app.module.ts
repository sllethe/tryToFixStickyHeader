import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here

import { AppComponent }  from './app.component';
import { StickyHeaderDirective, StickyParentDirective } from './sticky-header-dr';

export {StickyHeaderDirective};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule // <-- import the FormsModule before binding with [(ngModel)]
  ],
  declarations: [
    AppComponent,
    StickyHeaderDirective,
    StickyParentDirective,
  ],
  exports: [StickyHeaderDirective, StickyParentDirective],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
