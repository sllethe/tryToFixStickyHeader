import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StickyHeaderComponent} from './sticky-header';


@NgModule({
    imports: [CommonModule],
    declarations: [StickyHeaderComponent],
    exports: [StickyHeaderComponent]
})
export class MdStickyHeaderModule {}


export * from './sticky-header';
