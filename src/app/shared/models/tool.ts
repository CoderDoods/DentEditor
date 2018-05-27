export interface Tool {
  type: ToolType;
  size: number;
}

export enum ToolType {
  Pen,
  Circle
}
