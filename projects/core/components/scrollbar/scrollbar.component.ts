import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Inject,
    Input,
} from '@angular/core';
import {CSS, USER_AGENT} from '@ng-web-apis/common';
import {getElementOffset, isFirefox, TUI_IS_IOS, tuiDefaultProp} from '@taiga-ui/cdk';
import {TUI_SCROLL_INTO_VIEW, TUI_SCROLLABLE} from '@taiga-ui/core/constants';
import {TUI_SCROLL_REF} from '@taiga-ui/core/tokens';

export function scrollRefFactory({
    browserScrollRef,
}: TuiScrollbarComponent): ElementRef<HTMLElement> {
    return browserScrollRef;
}

// @dynamic
@Component({
    selector: 'tui-scrollbar',
    templateUrl: './scrollbar.template.html',
    styleUrls: ['./scrollbar.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_SCROLL_REF,
            deps: [TuiScrollbarComponent],
            useFactory: scrollRefFactory,
        },
    ],
})
export class TuiScrollbarComponent {
    @Input()
    @tuiDefaultProp()
    hidden = false;

    readonly browserScrollRef = new ElementRef(this.elementRef.nativeElement);

    private delegated = false;

    private readonly isLegacy: boolean =
        !this.cssRef.supports('position', 'sticky') ||
        (isFirefox(this.userAgent) && !this.cssRef.supports('scrollbar-width', 'none'));

    constructor(
        /**
         * TODO: remove "any" in new TS version; https://github.com/ng-web-apis/common/pull/6
         */
        @Inject(CSS) private readonly cssRef: any,
        @Inject(ElementRef) private readonly elementRef: ElementRef<HTMLElement>,
        @Inject(USER_AGENT) private readonly userAgent: string,
        @Inject(TUI_IS_IOS) private readonly isIos: boolean,
    ) {}

    get showScrollbars(): boolean {
        return !this.hidden && !this.isIos && (!this.isLegacy || this.delegated);
    }

    @HostBinding('class._legacy')
    get showNative(): boolean {
        return this.isLegacy && !this.hidden && !this.delegated;
    }

    @HostListener(`${TUI_SCROLLABLE}.stop`, ['$event.detail'])
    onScrollable(element: HTMLElement) {
        this.delegated = true;
        this.browserScrollRef.nativeElement = element;
    }

    @HostListener(`${TUI_SCROLL_INTO_VIEW}.stop`, ['$event.detail'])
    scrollIntoView(detail: HTMLElement) {
        if (this.delegated) {
            return;
        }

        const {nativeElement} = this.browserScrollRef;
        const {offsetTop, offsetLeft} = getElementOffset(nativeElement, detail);

        nativeElement.scrollTop =
            offsetTop + detail.offsetHeight / 2 - nativeElement.clientHeight / 2;
        nativeElement.scrollLeft =
            offsetLeft + detail.offsetWidth / 2 - nativeElement.clientWidth / 2;
    }
}
