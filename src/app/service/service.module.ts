import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorMapperService } from './color-mapper.service';
import { ImageEditorService } from './image-editor.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ColorMapperService,
    ImageEditorService
  ]
})
export class ServiceModule { }
