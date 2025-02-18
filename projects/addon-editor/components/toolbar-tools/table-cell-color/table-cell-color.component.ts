import {ChangeDetectionStrategy, Component, Inject, Input} from '@angular/core';
import {TuiEditor} from '@taiga-ui/addon-editor/abstract';
import {defaultEditorColors, EDITOR_BLANK_COLOR} from '@taiga-ui/addon-editor/constants';
import {TuiTiptapEditorService} from '@taiga-ui/addon-editor/directives';
import {TUI_EDITOR_TOOLBAR_TEXTS} from '@taiga-ui/addon-editor/tokens';
import {tuiDefaultProp} from '@taiga-ui/cdk';
import {LanguageEditor} from '@taiga-ui/i18n';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';

@Component({
    selector: 'tui-table-cell-color',
    templateUrl: './table-cell-color.template.html',
    styleUrls: ['../tools-common.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiTableCellColorComponent {
    @Input()
    @tuiDefaultProp()
    colors: ReadonlyMap<string, string> = defaultEditorColors;

    readonly cellColorText$ = this.texts$.pipe(map(texts => texts.cellColor));

    readonly isActive$ = this.editor.isActive$('table');

    readonly cellColor$ = this.editor.stateChange$.pipe(
        map(() => this.editor.getCellColor() || EDITOR_BLANK_COLOR),
        distinctUntilChanged(),
    );

    isBlankColor(color: string): boolean {
        return color === EDITOR_BLANK_COLOR;
    }

    setCellColor(color: string) {
        this.editor.setCellColor(color);
    }

    constructor(
        @Inject(TuiTiptapEditorService) readonly editor: TuiEditor,
        @Inject(TUI_EDITOR_TOOLBAR_TEXTS)
        readonly texts$: Observable<LanguageEditor['toolbarTools']>,
    ) {}
}
