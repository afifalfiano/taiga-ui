import {Component, Inject, Renderer2} from '@angular/core';
import {changeDetection} from '@demo/emulate/change-detection';
import {encapsulation} from '@demo/emulate/encapsulation';
import {TUI_DEFAULT_RENDERER} from '@taiga-ui/cdk/tokens';

@Component({
    selector: 'tui-token-example-1',
    templateUrl: './index.html',
    changeDetection,
    encapsulation,
})
export class TuiTokensExample1 {
    constructor(@Inject(TUI_DEFAULT_RENDERER) private readonly renderer: Renderer2) {}

    style = this.renderer.createElement('style');
}
