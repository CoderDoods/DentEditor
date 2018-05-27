import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorToolboxComponent } from './editor-toolbox/editor-toolbox.component';
import { EditorPaneComponent } from './editor-pane/editor-pane.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EditorToolboxComponent,
    EditorPaneComponent
  ],
  exports: [
    EditorToolboxComponent,
    EditorPaneComponent
  ]
})
export class FeatureModule { }
