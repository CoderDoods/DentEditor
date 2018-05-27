import { Component, OnInit, ViewChild, ElementRef, Inject, InjectionToken, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import {
  SaveImageCommand,
  SAVE_IMAGE_COMMAND,
  DeleteImageCommand,
  DELETE_IMAGE_COMMAND,
  ResetImageCommand,
  RESET_IMAGE_COMMAND,
  RevertImageCommand,
  REVERT_IMAGE_COMMAND
} from '../../command/command';
import { Store, Select } from '@ngxs/store';
import { RevertTask, ResetTask } from '../../state/task.state';
import { UpdateImageLoaded } from '../../state/tool.state';
import { ColorMapperService } from '../../service/color-mapper.service';
import { Tool } from '../../shared/models/tool';

@Component({
  selector: 'app-editor-pane',
  templateUrl: './editor-pane.component.html',
  styleUrls: ['./editor-pane.component.css']
})
export class EditorPaneComponent implements OnInit, OnDestroy, AfterViewInit {
  @Select(state => state.toolSelection.selectedTool) selectedTool$: Observable<Tool>;
  @Select(state => state.toolSelection.selectedColor) selectedColor$: Observable<string>;
  isImageInputVisible = true;

  @ViewChild('canvas') private canvasElementRef: ElementRef<HTMLCanvasElement>;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private image: File;
  private imageData: ImageData;
  private color = 'black';
  private colorHsl: {
    hue: number,
    saturation: number,
    lightness: number,
  };
  private lineWidth = 2;

  private current: Point = { x: 0, y: 0 };
  private previous: Point = { x: 0, y: 0 };
  private shouldDraw = false;

  private subscriptions: Subscription[];
  constructor(
    private store: Store,
    private colorMapperService: ColorMapperService,
    @Inject(SAVE_IMAGE_COMMAND) private saveImageCommand: Observable<SaveImageCommand>,
    @Inject(DELETE_IMAGE_COMMAND) private deleteImageCommand: Observable<DeleteImageCommand>,
    @Inject(RESET_IMAGE_COMMAND) private resetImageCommand: Observable<ResetImageCommand>,
    @Inject(REVERT_IMAGE_COMMAND) private revertImageCommand: Observable<RevertImageCommand>) {
  }

  ngOnInit() {
    this.subscriptions = [
      this.saveImageCommand.subscribe(() => this.save()),
      this.deleteImageCommand.subscribe(() => this.unload()),
      this.resetImageCommand.subscribe(() => this.reset()),
      this.revertImageCommand.subscribe(() => this.revert()),
      this.selectedColor$.subscribe((color: string) => this.changeColor(color)),
      this.selectedTool$.subscribe((tool: Tool) => this.changeTool(tool)),

    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasElementRef.nativeElement;
    this.context = this.canvasElementRef.nativeElement.getContext('2d');
  }

  onFileChange(event: Event) {
    this.load((event.target as HTMLInputElement).files[0]);
  }

  load(file: File) {
    const reader = new FileReader();
    reader.onload = () => this.createImage(reader.result);
    reader.readAsDataURL(file);
    this.image = file;
  }

  unload() {
    this.context
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.image = null;
    this.isImageInputVisible = true;
    this.store.dispatch(new UpdateImageLoaded(false));
  }

  reset() {
    const image = this.image;
    this.unload();
    this.load(image);
    this.store.dispatch(new ResetTask());
  }

  revert() {
    this.store.dispatch(new RevertTask());
  }

  save() {
    // This is how you can retrieve image canvas
    // this.canvas.toDataURL('image/png');
  }

  changeColor(color: string) {
    this.color = color;
    const rgb = this.colorMapperService.hexToRgb(color);
    this.colorHsl = this.colorMapperService.rgbToHsl(rgb);
  }

  changeTool(tool: Tool) {
    this.lineWidth = tool.size || this.lineWidth;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  protected draw() {
    this.drawDot(this.current.x, this.current.y);

    // Dead code - will be removed.
    // const [left, right] = [this.current, this.previous].sort(p => p.x);
    // let delta = (right.y - left.y) / (right.x - left.x);
    // if (delta === Number.POSITIVE_INFINITY || delta === Number.NEGATIVE_INFINITY || Number.isNaN(delta)) {
    //   delta = 0;
    // }
    // const y = left.y;
    // let counter = 0;
    // for (let x = left.x; x <= right.x; x += this.lineWidth, counter += this.lineWidth) {
    //   this.drawDot(x, y + counter * delta);
    // }

    // const startX = this.currentX >= this.previousX ? this.previousX : this.currentX;
    // const endX = this.currentX >= this.previousX ? this.currentX : this.previousX;
    // const deltaX = Math.abs(this.currentX - this.previousX);
    // const deltaY = Math.abs(this.currentY - this.previousY);
    // const acceleration = deltaX - deltaY;

    // TODO: Draw a line when user is moving on the canvas.
    // this.context.beginPath();
    // this.context.moveTo(this.previousX, this.previousY);
    // this.context.lineTo(this.currentX, this.currentY);
    // this.context.strokeStyle = this.color;
    // this.context.lineWidth = this.lineWidth;
    // this.context.stroke();
    // this.context.closePath();
  }

  private getIndexAt(imgData: ImageData, x: number, y: number) {
    return 4 * y * imgData.width + x * 4;
  }

  protected drawDot(x: number, y: number) {
    this.imageData =
      this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = this.imageData.data;

    const startX = Math.max(x - this.lineWidth, 0);
    const endX = Math.min(x + this.lineWidth, this.imageData.width);

    const startY = Math.max(y - this.lineWidth, 0);
    const endY = Math.min(y + this.lineWidth, this.imageData.height);

    for (let row = startX; row <= endX; row += 1) {
      for (let col = startY; col <= endY; col += 1) {
        if (this.isInRange(x, y, row, col, this.lineWidth)) {
          const index = this.getIndexAt(this.imageData, row, col);
          const red = data[index + 0];
          const green = data[index + 1];
          const blue = data[index + 2];
          const alpha = data[index + 3];
          const hsl = this.colorMapperService.rgbToHsl({ red, green, blue });
          const hue = hsl.hue * 360;
          const newRgb = this.colorMapperService
            .hslToRgb(Object.assign(hsl, { saturation: 1 - this.colorHsl.saturation }));
          data[index + 0] = newRgb.red;
          data[index + 1] = newRgb.green;
          data[index + 2] = newRgb.blue;
        }
      }
    }

    this.context.putImageData(this.imageData, 0, 0);
  }

  private isInRange(ax, ay, bx, by, radius) {
    return Math.pow(bx - ax, 2) + Math.pow(by - ay, 2) <= Math.pow(radius, 2);
  }

  private handleMouseDown(e) {
    this.previous = Object.assign({}, this.current);
    this.current.x = e.clientX - this.canvas.offsetLeft;
    this.current.y = e.clientY - this.canvas.offsetTop;

    this.shouldDraw = true;
    this.drawDot(this.current.x, this.current.y);
  }

  private handleMouseOut(e) {
    this.shouldDraw = false;
  }

  private handleMouseMove(e) {
    if (this.shouldDraw) {
      this.previous = Object.assign({}, this.current);
      this.current.x = e.clientX - this.canvas.offsetLeft;
      this.current.y = e.clientY - this.canvas.offsetTop;
      this.draw();
    }
  }

  private createImage = (result: any) => {
    const image = new Image();
    image.onload = () => {
      this.drawImage(image);
      this.isImageInputVisible = false;
      this.store.dispatch(new UpdateImageLoaded(true));
    };

    image.src = result;
  }

  private drawImage(image: HTMLImageElement) {
    this.canvas.width = image.width;
    this.canvas.height = image.height;
    this.context.drawImage(image, 0, 0);
  }
}

class Point {
  x: number;
  y: number;
}
