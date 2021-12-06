import {Component, Inject, Input, Optional} from '@angular/core';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';

import {TuiTreeChildrenDirective} from '../../directives/tree-children.directive';
import {TuiTreeContext} from '../../misc/tree.interfaces';
import {TUI_TREE_NODE} from '../../misc/tree.tokens';

@Component({
    selector: 'tui-tree[value]',
    templateUrl: 'tree.template.html',
    styleUrls: ['tree.style.less'],
    providers: [
        {
            provide: TUI_TREE_NODE,
            useExisting: TuiTreeComponent,
        },
    ],
    host: {
        role: 'tree',
    },
})
export class TuiTreeComponent<T> {
    @Input()
    value!: T;

    constructor(
        @Optional()
        @Inject(TuiTreeChildrenDirective)
        readonly directive: TuiTreeChildrenDirective<T> | null,
    ) {}

    get children(): readonly T[] {
        return (
            this.directive?.childrenHandler(this.value) ??
            TuiTreeChildrenDirective.defaultHandler(this.value)
        );
    }

    @Input()
    content: PolymorpheusContent<TuiTreeContext<T>> = ({$implicit}) => String($implicit);
}
