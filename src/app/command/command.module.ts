import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SAVE_IMAGE_COMMAND,
  SAVE_IMAGE_COMMAND_VALUE,
  DELETE_IMAGE_COMMAND,
  DELETE_IMAGE_COMMAND_VALUE,
  REVERT_IMAGE_COMMAND,
  REVERT_IMAGE_COMMAND_VALUE,
  RESET_IMAGE_COMMAND,
  RESET_IMAGE_COMMAND_VALUE,
} from './command';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: SAVE_IMAGE_COMMAND, useValue: SAVE_IMAGE_COMMAND_VALUE },
    { provide: DELETE_IMAGE_COMMAND, useValue: DELETE_IMAGE_COMMAND_VALUE },
    { provide: REVERT_IMAGE_COMMAND, useValue: REVERT_IMAGE_COMMAND_VALUE },
    { provide: RESET_IMAGE_COMMAND, useValue: RESET_IMAGE_COMMAND_VALUE },
  ]
})
export class CommandModule { }
