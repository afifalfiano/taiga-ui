import {Directive, ElementRef, Inject, Output} from '@angular/core';
import {WINDOW} from '@ng-web-apis/common';
import {typedFromEvent} from '@taiga-ui/cdk';
import {EMPTY, merge, Observable} from 'rxjs';
import {filter, startWith, switchMap} from 'rxjs/operators';

import {TuiSheetComponent} from '../../components/sheet/sheet.component';
import {
    TUI_SHEET_DRAGGED,
    TUI_SHEET_SCROLL,
} from '../../components/sheet/sheet.providers';
import {TUI_SHEET_CLOSE} from '../../components/sheet-heading/sheet-heading.component';

// @dynamic
@Directive({
    selector: 'tui-sheet[close]',
})
export class TuiSheetCloseDirective {
    @Output()
    readonly close: Observable<unknown> = merge(
        typedFromEvent(this.elementRef.nativeElement, TUI_SHEET_CLOSE),
        this.dragged$.pipe(
            startWith(false),
            switchMap(dragged =>
                dragged
                    ? EMPTY
                    : this.scroll$.pipe(
                          startWith(this.elementRef.nativeElement.scrollTop),
                      ),
            ),
            filter(y => this.sheet.item?.closeable && this.shouldClose(y)),
        ),
    );

    constructor(
        @Inject(TUI_SHEET_DRAGGED) private readonly dragged$: Observable<boolean>,
        @Inject(TUI_SHEET_SCROLL) private readonly scroll$: Observable<number>,
        @Inject(WINDOW) private readonly windowRef: Window,
        @Inject(ElementRef) private readonly elementRef: ElementRef<HTMLElement>,
        @Inject(TuiSheetComponent) private readonly sheet: TuiSheetComponent<unknown>,
    ) {}

    private shouldClose(scrollTop: number): boolean {
        const min = Math.min(
            this.elementRef.nativeElement.scrollHeight - this.windowRef.innerHeight,
            this.sheet.stops[0] || Infinity,
        );

        return scrollTop < min / 2;
    }
}
