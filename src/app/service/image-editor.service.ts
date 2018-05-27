import { Injectable } from '@angular/core';
import { Tool } from '../shared/models/tool';
import { Store } from '@ngxs/store';
import { UpdateColorSelection, UpdateToolSelection } from '../state/tool.state';
import {
  SaveImageCommand,
  SAVE_IMAGE_COMMAND_VALUE,
  DeleteImageCommand,
  DELETE_IMAGE_COMMAND_VALUE,
  ResetImageCommand,
  RESET_IMAGE_COMMAND_VALUE,
  RevertImageCommand,
  REVERT_IMAGE_COMMAND_VALUE,
} from '../command/command';

@Injectable({
  providedIn: 'root'
})
export class ImageEditorService {
  constructor(private store: Store) {
  }

  save() {
    SAVE_IMAGE_COMMAND_VALUE.next(new SaveImageCommand());
  }

  delete() {
    DELETE_IMAGE_COMMAND_VALUE.next(new DeleteImageCommand());
  }

  reset() {
    RESET_IMAGE_COMMAND_VALUE.next(new ResetImageCommand());
  }

  revert() {
    REVERT_IMAGE_COMMAND_VALUE.next(new RevertImageCommand());
  }

  selectTool(tool: Tool) {
    this.store.dispatch(new UpdateToolSelection(tool));
  }

  selectColor(color: string) {
    this.store.dispatch(new UpdateColorSelection(color));
  }
}
