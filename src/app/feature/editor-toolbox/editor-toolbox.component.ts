import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColorMapperService } from '../../service/color-mapper.service';
import { ImageEditorService } from '../../service/image-editor.service';
import { ToolType, Tool } from '../../shared/models/tool';
import { Select } from '@ngxs/store';
import { TaskState, ToolState } from '../../state';
import { Observable, Subscription } from 'rxjs';
import { Task } from '../../shared/models/task';

@Component({
  selector: 'app-editor-toolbox',
  templateUrl: './editor-toolbox.component.html',
  styleUrls: ['./editor-toolbox.component.css']
})
export class EditorToolboxComponent implements OnInit, OnDestroy {
  @Select(TaskState) tasks$: Observable<Task[]>;
  @Select(state => state.toolSelection.selectedTool) selectedTool$: Observable<Tool>;
  @Select(state => state.toolSelection.selectedColor) selectedColor$: Observable<string>;
  @Select(state => state.toolSelection.colors) colors$: Observable<string[]>;
  @Select(state => state.toolSelection.isImageLoaded) isImageLoaded$: Observable<boolean>;

  selectedColor = {
    hex: '',
    rgb: { red: 0, green: 0, blue: 0 },
    hsl: { hue: 0, saturation: 0, lightness: 0 }
  };
  selectedTool: ToolType;
  shouldToolboxBeHidden = false;
  isImageLoaded: boolean;

  private subscriptions: Subscription[] = [];

  get isPenSelected() {
    return this.selectedTool !== null && this.selectedTool as ToolType === ToolType.Pen;
  }

  get isCircleSelected() {
    return this.selectedTool !== null && this.selectedTool as ToolType === ToolType.Circle;
  }

  constructor(private colorMapperService: ColorMapperService,
    private imageEditorService: ImageEditorService) {
  }

  ngOnInit() {
    this.subscriptions = [
      this.selectedTool$.subscribe((tool: Tool) => this.selectedTool = tool.type),
      this.selectedColor$.subscribe((color: string) => this.handleColorChange(color)),
      this.isImageLoaded$.subscribe((isImageLoaded: boolean) => this.isImageLoaded = isImageLoaded)
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  showOrHide() {
    this.shouldToolboxBeHidden = !this.shouldToolboxBeHidden;
  }

  selectPen() {
    if (this.selectedTool !== ToolType.Pen) {
      this.imageEditorService.selectTool({ type: ToolType.Pen, size: 2 });
    }
  }

  selectCircle() {
    if (this.selectedTool !== ToolType.Circle) {
      this.imageEditorService.selectTool({ type: ToolType.Circle, size: 12 });
    }
  }

  selectColor(color: string) {
    if (this.selectedColor.hex !== color) {
      this.imageEditorService.selectColor(color);
    }
  }

  saveImage() {
    this.imageEditorService.save();
  }

  deleteImage() {
    this.imageEditorService.delete();
  }

  revert() {
    this.imageEditorService.revert();
  }

  reset() {
    this.imageEditorService.reset();
  }

  private formatAsPercentage(number: number) {
    return Math.round(number * 100);
  }

  private handleColorChange(color: string) {
    this.selectedColor.hex = color;
    this.selectedColor.rgb = this.colorMapperService.hexToRgb(color);
    const hsl = this.colorMapperService.rgbToHsl(this.selectedColor.rgb);
    hsl.hue = this.formatAsPercentage(hsl.hue);
    hsl.saturation = this.formatAsPercentage(hsl.saturation);
    hsl.lightness = this.formatAsPercentage(hsl.lightness);
    this.selectedColor.hsl = hsl;
  }
}
