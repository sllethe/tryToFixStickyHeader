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
var StickyParentDirective = (function () {
    function StickyParentDirective(element) {
        this.element = element;
        this.pelem = element.nativeElement;
    }
    StickyParentDirective.prototype.ngOnInit = function () {
        this.pelem.classList.add('sticky-parent');
    };
    StickyParentDirective.prototype.ngAfterViewInit = function () {
    };
    StickyParentDirective.prototype.ngOnDestroy = function () {
        this.pelem.classList.remove('sticky-parent');
    };
    return StickyParentDirective;
}());
StickyParentDirective = __decorate([
    core_1.Directive({
        selector: '[md-sticky-viewport]',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], StickyParentDirective);
exports.StickyParentDirective = StickyParentDirective;
var StickyHeaderDirective = (function () {
    function StickyHeaderDirective(element) {
        this.element = element;
        this.zIndex = 10;
        this.width = 'auto'; //sticky's width
        this.offsetTop = 0; //sticky距离页面顶端多远
        this.offsetBottom = 0;
        this.start = 0;
        this.stickClass = 'sticky';
        this.endStickClass = 'sticky-end';
        this.mediaQuery = '';
        this.parentMode = true;
        this.activated = new core_1.EventEmitter();
        this.deactivated = new core_1.EventEmitter();
        this.onScrollBind = this.onScroll.bind(this);
        this.onResizeBind = this.onResize.bind(this);
        this.isStuck = false;
        this.elem = element.nativeElement;
    }
    StickyHeaderDirective.prototype.ngOnInit = function () {
    };
    StickyHeaderDirective.prototype.ngAfterViewInit = function () {
        // define scroll container as parent element
        this.container = this.elem.parentNode;
        //this.container = document.querySelector('.sticky-parent');
        this.stickyParent = document.querySelector('.sticky-parent');
        while (!this.container.classList.contains('sticky-parent')) {
            this.container = this.elem.parentNode;
        }
        console.log('original container: ' + this.container);
        console.log('original container class: ' + this.container.classList.contains('sticky-parent'));
        console.log('my stickyParent: ' + this.stickyParent);
        console.log('this is: ' + this);
        this.originalCss = {
            zIndex: this.getCssValue(this.elem, 'zIndex'),
            position: this.getCssValue(this.elem, 'position'),
            top: this.getCssValue(this.elem, 'top'),
            right: this.getCssValue(this.elem, 'right'),
            left: this.getCssValue(this.elem, 'left'),
            bottom: this.getCssValue(this.elem, 'bottom'),
            width: this.getCssValue(this.elem, 'width'),
        };
        console.log('===================');
        console.log('this element this.zIndex : ' + this.zIndex);
        console.log('this element originalCss.top : ' + this.originalCss.top);
        console.log('this element originalCss.right : ' + this.originalCss.right);
        this.attach();
        this.attachDocument();
        if (this.width == 'auto') {
            this.width = this.originalCss.width;
        }
        this.defineDimensions();
        this.sticker();
    };
    StickyHeaderDirective.prototype.ngOnDestroy = function () {
        this.detach();
        this.detachDocument();
    };
    StickyHeaderDirective.prototype.attach = function () {
        window.addEventListener('scroll', this.onScrollBind);
        window.addEventListener('resize', this.onResizeBind);
    };
    StickyHeaderDirective.prototype.attachDocument = function () {
        document.addEventListener('scroll', this.onScrollBind);
        document.addEventListener('resize', this.onResizeBind);
    };
    StickyHeaderDirective.prototype.detach = function () {
        window.removeEventListener('scroll', this.onScrollBind);
        window.removeEventListener('resize', this.onResizeBind);
    };
    StickyHeaderDirective.prototype.detachDocument = function () {
        document.removeEventListener('scroll', this.onScrollBind);
        document.removeEventListener('resize', this.onResizeBind);
    };
    StickyHeaderDirective.prototype.onScroll = function () {
        this.defineDimensions();
        this.sticker();
    };
    StickyHeaderDirective.prototype.onResize = function () {
        this.defineDimensions();
        this.sticker();
        if (this.isStuck) {
            this.unstuckElement();
            this.stuckElement();
        }
    };
    //getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。
    // getBoundingClientRect是DOM元素到浏览器可视范围的距离（不包含文档卷起的部分）。
    // 该函数返回一个Object对象，该对象有6个属性：top,lef,right,bottom,width,height；
    // 这里的top、left和css中的理解很相似，width、height是元素自身的宽高，
    // 但是right，bottom和css中的理解有点不一样。right是指元素右边界距窗口最左边的距离，
    // bottom是指元素下边界距窗口最上面的距离。
    StickyHeaderDirective.prototype.defineDimensions = function () {
        var containerTop = this.getBoundingClientRectValue(this.container, 'top');
        this.windowHeight = window.innerHeight;
        this.elemHeight = this.getCssNumber(this.elem, 'height');
        this.containerHeight = this.getCssNumber(this.container, 'height');
        this.containerStart = containerTop + this.scrollbarYPos() - this.offsetTop + this.start;
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.log('containerTop: ' + containerTop);
        console.log('this.windowHeight: ' + this.windowHeight);
        console.log('this.elemHeight: ' + this.elemHeight);
        console.log('this.scrollbarYPos(): ' + this.scrollbarYPos());
        console.log('this.containerHeight: ' + this.containerHeight);
        console.log('this.containerStart: ' + this.containerStart);
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        if (this.parentMode) {
            this.scrollFinish = this.containerStart - this.start - this.offsetBottom + (this.containerHeight - this.elemHeight);
        }
        else {
            this.scrollFinish = document.body.offsetHeight;
        }
    };
    StickyHeaderDirective.prototype.resetElement = function () {
        this.elem.classList.remove(this.stickClass);
        Object.assign(this.elem.style, this.originalCss);
    };
    StickyHeaderDirective.prototype.stuckElement = function () {
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
    StickyHeaderDirective.prototype.unstuckElement = function () {
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
    StickyHeaderDirective.prototype.matchMediaQuery = function () {
        console.log('[][][][][]this.mediaQuery is : ' + this.mediaQuery);
        if (!this.mediaQuery) {
            console.log('!this.mediaQuery成立');
            console.log('matchMedia.media: ' + window.matchMedia(this.mediaQuery).matches);
            return true;
        }
        return (window.matchMedia('(' + this.mediaQuery + ')').matches ||
            window.matchMedia(this.mediaQuery).matches);
    };
    StickyHeaderDirective.prototype.sticker = function () {
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
    StickyHeaderDirective.prototype.scrollbarYPos = function () {
        return window.pageYOffset || document.documentElement.scrollTop; //
        //In Javascript window.pageYOffset and document.documentElement.scrollTop both measures
        // the distance of an window top to its topmost visible content in pixel
    };
    StickyHeaderDirective.prototype.getBoundingClientRectValue = function (element, property) {
        var result = 0;
        if (element.getBoundingClientRect) {
            var rect = element.getBoundingClientRect();
            console.log("element.getBoundingClientRect(): " + rect.height);
            result = (typeof rect[property] !== 'undefined') ? rect[property] : 0;
        }
        console.log('current element: ' + element);
        return result;
    };
    StickyHeaderDirective.prototype.getCssValue = function (element, property) {
        var result = '';
        if (typeof window.getComputedStyle !== 'undefined') {
            result = window.getComputedStyle(element, null).getPropertyValue(property);
        }
        else if (typeof element.currentStyle !== 'undefined') {
            result = element.currentStyle[property];
        }
        return result;
    };
    StickyHeaderDirective.prototype.getCssNumber = function (element, property) {
        return parseInt(this.getCssValue(element, property), 10) || 0;
    };
    return StickyHeaderDirective;
}());
__decorate([
    core_1.Input('sticky-zIndex'),
    __metadata("design:type", Number)
], StickyHeaderDirective.prototype, "zIndex", void 0);
__decorate([
    core_1.Input('sticky-width'),
    __metadata("design:type", String)
], StickyHeaderDirective.prototype, "width", void 0);
__decorate([
    core_1.Input('sticky-offset-top'),
    __metadata("design:type", Number)
], StickyHeaderDirective.prototype, "offsetTop", void 0);
__decorate([
    core_1.Input('sticky-offset-bottom'),
    __metadata("design:type", Number)
], StickyHeaderDirective.prototype, "offsetBottom", void 0);
__decorate([
    core_1.Input('sticky-start'),
    __metadata("design:type", Number)
], StickyHeaderDirective.prototype, "start", void 0);
__decorate([
    core_1.Input('sticky-class'),
    __metadata("design:type", String)
], StickyHeaderDirective.prototype, "stickClass", void 0);
__decorate([
    core_1.Input('sticky-end-class'),
    __metadata("design:type", String)
], StickyHeaderDirective.prototype, "endStickClass", void 0);
__decorate([
    core_1.Input('sticky-media-query'),
    __metadata("design:type", String)
], StickyHeaderDirective.prototype, "mediaQuery", void 0);
__decorate([
    core_1.Input('sticky-parent'),
    __metadata("design:type", Boolean)
], StickyHeaderDirective.prototype, "parentMode", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], StickyHeaderDirective.prototype, "activated", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], StickyHeaderDirective.prototype, "deactivated", void 0);
StickyHeaderDirective = __decorate([
    core_1.Directive({
        selector: '[md-sticky]',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], StickyHeaderDirective);
exports.StickyHeaderDirective = StickyHeaderDirective;
//# sourceMappingURL=sticky-header-dr.js.map