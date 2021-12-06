import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {generateRoutes, TuiAddonDocModule} from '@taiga-ui/addon-doc';
import {TuiEditorNewModule, TuiEditorSocketModule} from '@taiga-ui/addon-editor';
import {
    TuiButtonModule,
    TuiLinkModule,
    TuiNotificationModule,
    TuiSvgModule,
} from '@taiga-ui/core';

import {InheritedDocumentationModule} from '../abstract/inherited-documentation/inherited-documentation.module';
import {ExampleEditorNewComponent} from './editor-new.component';
import {TuiEditorNewExample1} from './examples/1';
import {TuiEditorNewExample2} from './examples/2';
import {ExampleSmilesToolModule} from './examples/2/smiles-tool/smiles-tool.module';
import {TuiEditorNewExample3} from './examples/3';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TuiEditorNewModule,
        TuiEditorSocketModule,
        TuiNotificationModule,
        TuiButtonModule,
        InheritedDocumentationModule,
        TuiAddonDocModule,
        TuiLinkModule,
        TuiSvgModule,
        ExampleSmilesToolModule,
        RouterModule.forChild(generateRoutes(ExampleEditorNewComponent)),
    ],
    declarations: [
        ExampleEditorNewComponent,
        TuiEditorNewExample1,
        TuiEditorNewExample2,
        TuiEditorNewExample3,
    ],
    exports: [ExampleEditorNewComponent],
})
export class ExampleTuiEditorNewModule {}
