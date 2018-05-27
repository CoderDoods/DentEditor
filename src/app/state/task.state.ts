import { State, Action, StateContext } from '@ngxs/store';
import { Task } from '../shared/models/task';

export class AddTask {
  static readonly type = '[Task] Add';

  constructor(public task: Task) { }
}

export class RevertTask {
  static readonly type = '[Task] RevertLast';
}

export class ResetTask {
  static readonly type = '[Task] Reset';
}

@State<Task[]>({
  name: 'tasks',
  defaults: [
  ]
})
export class TaskState {
  @Action(AddTask)
  add(context: StateContext<Task[]>, action: AddTask) {
    const state = context.getState().slice();
    state.push(action.task);

    context.setState(state);
  }

  @Action(RevertTask)
  revert(context: StateContext<Task[]>, action: RevertTask) {
    const state = context.getState().slice();
    state.pop();
    context.setState(state);
  }

  @Action(ResetTask)
  reset(context: StateContext<Task[]>, action: ResetTask) {
    context.setState([]);
  }
}
