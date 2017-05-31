"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var StickyHeaderComponent = (function () {
    function StickyHeaderComponent(element) {
        this.element = element;
        this.zIndex = 10;
        this.width = 'auto'; //sticky's width
        this.offsetTop = 0; //sticky距离页面顶端多远
        this.offsetBottom = 0; //?
        this.start = 0;
        this.stickClass = 'sticky';
        this.endStickClass = 'sticky-end';
        this.mediaQuery = ''; //?
        this.parentMode = true;
        this.activated = new core_1.EventEmitter();
        this.deactivated = new core_1.EventEmitter();
        this.onScrollBind = this.onScroll.bind(this);
        this.onResizeBind = this.onResize.bind(this);
        this.isStuck = false;
        this.elem = element.nativeElement;
    }
    StickyHeaderComponent.prototype.ngOnInit = function () {
        window.addEventListener('scroll', this.onScrollBind);
        window.addEventListener('resize', this.onResizeBind);
    };
    StickyHeaderComponent.prototype.ngAfterViewInit = function () {
        // define scroll container as parent element
        this.container = this.elem.parentNode;
        this.stickyParent = document.querySelector('sticky-parent');
        console.log('+++++++++++++++');
        console.log('this.container' + this.container);
        console.log('this.elem' + this.elem);
        console.log('+++++++++++++++');
        console.log('this.stickyParent' + this.stickyParent);
        this.originalCss = {
            zIndex: this.getCssValue(this.elem, 'zIndex'),
            position: this.getCssValue(this.elem, 'position'),
            top: this.getCssValue(this.elem, 'top'),
            right: this.getCssValue(this.elem, 'right'),
            left: this.getCssValue(this.elem, 'left'),
            bottom: this.getCssValue(this.elem, 'bottom'),
            width: this.getCssValue(this.elem, 'width'),
        };
        console.log('this.zIndex : ' + this.zIndex);
        console.log('this.top : ' + this.originalCss.top);
        console.log('this.right : ' + this.originalCss.right);
        if (this.width == 'auto') {
            this.width = this.originalCss.width;
        }
        this.defineDimensions();
        this.sticker();
    };
    StickyHeaderComponent.prototype.ngOnDestroy = function () {
        window.removeEventListener('scroll', this.onScrollBind);
        window.removeEventListener('resize', this.onResizeBind);
    };
    StickyHeaderComponent.prototype.onScroll = function () {
        this.defineDimensions();
        this.sticker();
    };
    StickyHeaderComponent.prototype.onResize = function () {
        this.defineDimensions();
        this.sticker();
        if (this.isStuck) {
            this.unstuckElement();
            this.stuckElement();
        }
    };
    StickyHeaderComponent.prototype.defineDimensions = function () {
        var containerTop = this.getBoundingClientRectValue(this.container, 'top');
        this.windowHeight = window.innerHeight;
        this.elemHeight = this.getCssNumber(this.elem, 'height');
        this.containerHeight = this.getCssNumber(this.container, 'height');
        this.containerStart = containerTop + this.scrollbarYPos() - this.offsetTop + this.start;
        if (this.parentMode) {
            this.scrollFinish = this.containerStart - this.start - this.offsetBottom + (this.containerHeight - this.elemHeight);
        }
        else {
            this.scrollFinish = document.body.offsetHeight;
        }
    };
    StickyHeaderComponent.prototype.resetElement = function () {
        this.elem.classList.remove(this.stickClass);
        Object.assign(this.elem.style, this.originalCss);
    };
    StickyHeaderComponent.prototype.stuckElement = function () {
        this.isStuck = true;
        this.elem.classList.remove(this.endStickClass);
        this.elem.classList.add(this.stickClass);
        var elementLeft = this.getBoundingClientRectValue(this.elem, 'left');
        this.elem.style.zIndex = this.zIndex;
        this.elem.style.position = 'fixed';
        this.elem.style.top = this.offsetTop + 'px';
        this.elem.style.right = 'auto';
        this.elem.style.left = elementLeft + 'px';
        this.elem.style.bottom = 'auto';
        this.elem.style.width = this.width;
        this.activated.next(this.elem);
    };
    StickyHeaderComponent.prototype.unstuckElement = function () {
        this.isStuck = false;
        this.elem.classList.add(this.endStickClass);
        this.container.style.position = 'relative';
        this.elem.style.position = 'absolute';
        this.elem.style.top = 'auto';
        this.elem.style.right = 0;
        this.elem.style.left = 'auto';
        this.elem.style.bottom = this.offsetBottom + 'px';
        this.elem.style.width = this.width;
        this.deactivated.next(this.elem);
    };
    StickyHeaderComponent.prototype.matchMediaQuery = function () {
        if (!this.mediaQuery)
            return true;
        return (window.matchMedia('(' + this.mediaQuery + ')').matches ||
            window.matchMedia(this.mediaQuery).matches);
    };
    StickyHeaderComponent.prototype.sticker = function () {
        // check media query
        if (this.isStuck && !this.matchMediaQuery()) {
            this.resetElement();
            return;
        }
        // detecting when a container's height changes
        var currentContainerHeight = this.getCssNumber(this.container, 'height');
        if (currentContainerHeight !== this.containerHeight) {
            this.defineDimensions();
        }
        var position = this.scrollbarYPos();
        // unstick
        if (this.isStuck && (position < this.containerStart || position > this.scrollFinish) || position > this.scrollFinish) {
            this.resetElement();
            if (position > this.scrollFinish)
                this.unstuckElement();
            this.isStuck = false;
        }
        else if (this.isStuck === false && position > this.containerStart && position < this.scrollFinish) {
            this.stuckElement();
        }
    };
    StickyHeaderComponent.prototype.scrollbarYPos = function () {
        return window.pageYOffset || document.documentElement.scrollTop; //
        //In Javascript window.pageYOffset and document.documentElement.scrollTop both measures
        // the distance of an window top to its topmost visible content in pixel
    };
    StickyHeaderComponent.prototype.getBoundingClientRectValue = function (element, property) {
        var result = 0;
        if (element.getBoundingClientRect) {
            var rect = element.getBoundingClientRect();
            console.log("element.getBoundingClientRect(): " + rect.height);
            result = (typeof rect[property] !== 'undefined') ? rect[property] : 0;
        }
        console.log('current element: ' + element);
        return result;
    };
    StickyHeaderComponent.prototype.getCssValue = function (element, property) {
        var result = '';
        if (typeof window.getComputedStyle !== 'undefined') {
            result = window.getComputedStyle(element, null).getPropertyValue(property);
        }
        else if (typeof element.currentStyle !== 'undefined') {
            result = element.currentStyle[property];
        }
        return result;
    };
    StickyHeaderComponent.prototype.getCssNumber = function (element, property) {
        return parseInt(this.getCssValue(element, property), 10) || 0;
    };
    return StickyHeaderComponent;
}());
__decorate([
    core_1.Input('sticky-zIndex'),
    __metadata("design:type", Number)
], StickyHeaderComponent.prototype, "zIndex", void 0);
__decorate([
    core_1.Input('sticky-width'),
    __metadata("design:type", String)
], StickyHeaderComponent.prototype, "width", void 0);
__decorate([
    core_1.Input('sticky-offset-top'),
    __metadata("design:type", Number)
], StickyHeaderComponent.prototype, "offsetTop", void 0);
__decorate([
    core_1.Input('sticky-offset-bottom'),
    __metadata("design:type", Number)
], StickyHeaderComponent.prototype, "offsetBottom", void 0);
__decorate([
    core_1.Input('sticky-start'),
    __metadata("design:type", Number)
], StickyHeaderComponent.prototype, "start", void 0);
__decorate([
    core_1.Input('sticky-class'),
    __metadata("design:type", String)
], StickyHeaderComponent.prototype, "stickClass", void 0);
__decorate([
    core_1.Input('sticky-end-class'),
    __metadata("design:type", String)
], StickyHeaderComponent.prototype, "endStickClass", void 0);
__decorate([
    core_1.Input('sticky-media-query'),
    __metadata("design:type", String)
], StickyHeaderComponent.prototype, "mediaQuery", void 0);
__decorate([
    core_1.Input('sticky-parent'),
    __metadata("design:type", Boolean)
], StickyHeaderComponent.prototype, "parentMode", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], StickyHeaderComponent.prototype, "activated", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], StickyHeaderComponent.prototype, "deactivated", void 0);
StickyHeaderComponent = __decorate([
    core_1.Directive({
        selector: '[sticky-parent]',
    }),
    core_1.Component({
        moduleId: module.id,
        selector: 'sticky',
        template: '<ng-content></ng-content>',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], StickyHeaderComponent);
exports.StickyHeaderComponent = StickyHeaderComponent;
//# sourceMappingURL=sticky-header.js.map