import { Tool, ToolType } from '../shared/models/tool';
import { State, StateContext, Action } from '@ngxs/store';

export class UpdateToolSelection {
  static readonly type = '[Tool] UpdateToolSelection';

  constructor(public tool: Tool) {
  }
}

export class UpdateColorSelection {
  static readonly type = '[Tool] UpdateColorSelection';

  constructor(public color: string) {
  }
}

export class UpdateImageLoaded {
  static readonly type = '[Tool] UpdateImageSelection';

  constructor(public isImageLoaded: boolean) {
  }
}

@State<ToolSelectionViewModel>({
  name: 'toolSelection',
  defaults: {
    colors: [
      '#DBCFB5',
      '#E0CFB2',
      '#D6C5A4',
      '#DADCE1'
    ],
    selectedTool: { type: ToolType.Pen, size: 2 },
    selectedColor: '#DBCFB5',
    isImageLoaded: false
  }
})
export class ToolState {
  @Action(UpdateToolSelection)
  updateTool(context: StateContext<ToolSelectionViewModel>, action: UpdateToolSelection) {
    if (action.tool === context.getState().selectedTool) {
      return;
    }
    context.patchState({ selectedTool: action.tool });
  }

  @Action(UpdateColorSelection)
  updateColor(context: StateContext<ToolSelectionViewModel>, action: UpdateColorSelection) {
    if (action.color === context.getState().selectedColor) {
      return;
    }

    context.patchState({ selectedColor: action.color });
  }

  @Action(UpdateImageLoaded)
  updateImage(context: StateContext<ToolSelectionViewModel>, action: UpdateImageLoaded) {
    if (action.isImageLoaded === context.getState().isImageLoaded) {
      return;
    }

    context.patchState({ isImageLoaded: action.isImageLoaded });
  }
}

export class ToolSelectionViewModel {
  colors: string[];
  selectedTool: Tool;
  selectedColor: string;
  isImageLoaded: boolean;
}
