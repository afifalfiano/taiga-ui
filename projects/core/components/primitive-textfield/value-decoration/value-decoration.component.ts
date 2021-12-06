import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    ViewChild,
} from '@angular/core';
import {MutationObserverDirective} from '@ng-web-apis/mutation-observer';
import {
    TUI_TEXTFIELD_WATCHED_CONTROLLER,
    TuiTextfieldController,
} from '@taiga-ui/core/directives';
import {defer, EMPTY} from 'rxjs';
import {distinctUntilChanged, map, startWith} from 'rxjs/operators';

import {TuiPrimitiveTextfieldComponent} from '../primitive-textfield.component';

@Component({
    selector: 'tui-value-decoration',
    templateUrl: 'value-decoration.template.html',
    styleUrls: ['value-decoration.style.less'],
    // It follows Change Detection of PrimitiveTextfield
    changeDetection: ChangeDetectionStrategy.Default,
})
export class TuiValueDecorationComponent {
    @ViewChild('pre', {read: ElementRef, static: true})
    private readonly pre?: ElementRef<HTMLElement>;

    @ViewChild(MutationObserverDirective, {static: true})
    private readonly directive?: MutationObserverDirective;

    readonly pre$ = defer(() => this.directive?.waMutationObserver ?? EMPTY).pipe(
        map(() => this.pre?.nativeElement.offsetWidth ?? 0),
        startWith(0),
        distinctUntilChanged(),
    );

    constructor(
        @Inject(TuiPrimitiveTextfieldComponent)
        private readonly textfield: TuiPrimitiveTextfieldComponent,
        @Inject(TUI_TEXTFIELD_WATCHED_CONTROLLER)
        private readonly controller: TuiTextfieldController,
    ) {}

    get value(): string {
        return this.textfield.value;
    }

    get filler(): string {
        return this.focused
            ? this.exampleText || this.textfield.filler.slice(this.value.length)
            : '';
    }

    get prefix(): string {
        return this.decorationsVisible ? this.textfield.prefix : '';
    }

    get postfix(): string {
        return this.decorationsVisible ? this.computedPostfix : '';
    }

    private get exampleText(): string {
        return !this.value && this.focused ? this.controller.exampleText : '';
    }

    private get decorationsVisible(): boolean {
        return !!this.value || this.focused;
    }

    private get focused(): boolean {
        return this.textfield.computedFocused && !this.textfield.readOnly;
    }

    private get computedPostfix(): string {
        return this.textfield.postfix && (this.filler || this.value)
            ? ` ${this.textfield.postfix}`
            : this.textfield.postfix;
    }
}
