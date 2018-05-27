import { CommandModule } from './command.module';

describe('CommandModule', () => {
  let commandModule: CommandModule;

  beforeEach(() => {
    commandModule = new CommandModule();
  });

  it('should create an instance', () => {
    expect(commandModule).toBeTruthy();
  });
});
