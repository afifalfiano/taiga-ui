import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    HostBinding,
    Inject,
    Input,
    Optional,
    Self,
    ViewChild,
} from '@angular/core';
import {NgControl} from '@angular/forms';
import {
    AbstractTuiNullableControl,
    TUI_DEFAULT_IDENTITY_MATCHER,
    TUI_FOCUSABLE_ITEM_ACCESSOR,
    tuiDefaultProp,
    TuiFocusableElementAccessor,
    TuiIdentityMatcher,
    TuiNativeFocusableElement,
} from '@taiga-ui/cdk';
import {
    TuiAppearance,
    TuiHorizontalDirection,
    TuiModeDirective,
    TuiSizeL,
    TuiSizeS,
} from '@taiga-ui/core';
import {TuiRadioComponent} from '@taiga-ui/kit/components/radio';

@Component({
    selector: 'tui-radio-block',
    templateUrl: './radio-block.template.html',
    styleUrls: ['./radio-block.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_FOCUSABLE_ITEM_ACCESSOR,
            useExisting: forwardRef(() => TuiRadioBlockComponent),
        },
    ],
})
export class TuiRadioBlockComponent<T>
    extends AbstractTuiNullableControl<T>
    implements TuiFocusableElementAccessor
{
    @Input()
    item?: T;

    @Input()
    @tuiDefaultProp()
    identityMatcher: TuiIdentityMatcher<T> = TUI_DEFAULT_IDENTITY_MATCHER;

    @Input()
    @HostBinding('attr.data-tui-host-align')
    @tuiDefaultProp()
    contentAlign: TuiHorizontalDirection = 'right';

    @Input()
    @HostBinding('attr.data-tui-host-size')
    @tuiDefaultProp()
    size: TuiSizeS | TuiSizeL = 'l';

    @Input()
    @HostBinding('class._hidden_radio')
    @tuiDefaultProp()
    hideRadio = false;

    @Input()
    @tuiDefaultProp()
    pseudoDisabled = false;

    @ViewChild(TuiRadioComponent)
    private readonly radio?: TuiRadioComponent<T>;

    constructor(
        @Optional()
        @Self()
        @Inject(NgControl)
        control: NgControl | null,
        @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
        @Optional()
        @Inject(TuiModeDirective)
        private readonly modeDirective: TuiModeDirective | null,
    ) {
        super(control, changeDetectorRef);
    }

    get nativeFocusableElement(): TuiNativeFocusableElement | null {
        return this.radio ? this.radio.nativeFocusableElement : null;
    }

    get focused(): boolean {
        return !!this.radio && this.radio.focused;
    }

    @HostBinding('class._disabled')
    get computedDisabled(): boolean {
        return this.disabled || this.pseudoDisabled;
    }

    @HostBinding('class._active')
    get checked(): boolean {
        return this.value === this.item && this.hideRadio;
    }

    get checkboxSize(): TuiSizeL {
        return this.size === 'l' ? 'l' : 'm';
    }

    get appearance(): TuiAppearance {
        if (!this.modeDirective || !this.modeDirective.mode) {
            return this.checked
                ? TuiAppearance.WhiteblockActive
                : TuiAppearance.Whiteblock;
        }

        return this.checked ? TuiAppearance.Primary : TuiAppearance.Secondary;
    }

    onFocused(focused: boolean) {
        this.updateFocused(focused);
    }

    onHovered(hovered: boolean) {
        this.updateHovered(hovered);
    }

    onPressed(pressed: boolean) {
        this.updatePressed(pressed);
    }

    onFocusVisible(focusVisible: boolean) {
        this.updateFocusVisible(focusVisible);
    }

    onModelChange(value: T) {
        this.updateValue(value);
    }
}
