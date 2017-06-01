import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StickyParentDirective, StickyHeaderDirective} from './sticky-header-dr';


@NgModule({
    imports: [CommonModule],
    declarations: [StickyParentDirective, StickyHeaderDirective],
    exports: [StickyParentDirective, StickyHeaderDirective]
})
export class MdStickyHeaderModule {}


export * from './sticky-header-dr';
