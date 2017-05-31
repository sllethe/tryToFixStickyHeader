import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StickyHeaderComponent, StickyHeaderDirective} from './sticky-header';


@NgModule({
    imports: [CommonModule],
    declarations: [StickyHeaderComponent, StickyHeaderDirective],
    exports: [StickyHeaderComponent, StickyHeaderDirective]
})
export class MdStickyHeaderModule {}


export * from './sticky-header';
