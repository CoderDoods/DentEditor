import { InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Save Image.
 */
export class SaveImageCommand {
  static readonly type = '[Image] SaveCommand';
}

export const SAVE_IMAGE_COMMAND = new InjectionToken<SaveImageCommand>(SaveImageCommand.type);
export const SAVE_IMAGE_COMMAND_VALUE = new Subject<SaveImageCommand>();


/**
 * Delete Image.
 */
export class DeleteImageCommand {
  static readonly type = '[Image] DeleteCommand';
}

export const DELETE_IMAGE_COMMAND = new InjectionToken<DeleteImageCommand>(DeleteImageCommand.type);
export const DELETE_IMAGE_COMMAND_VALUE = new Subject<DeleteImageCommand>();


/**
 * Revert Image.
 */
export class RevertImageCommand {
  static readonly type = '[Image] RevertCommand';
}

export const REVERT_IMAGE_COMMAND = new InjectionToken<RevertImageCommand>(RevertImageCommand.type);
export const REVERT_IMAGE_COMMAND_VALUE = new Subject<RevertImageCommand>();


/**
 * Reset Image.
 */
export class ResetImageCommand {
  static readonly type = '[Image] ResetCommand';
}

export const RESET_IMAGE_COMMAND = new InjectionToken<ResetImageCommand>(ResetImageCommand.type);
export const RESET_IMAGE_COMMAND_VALUE = new Subject<ResetImageCommand>();
