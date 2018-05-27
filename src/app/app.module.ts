import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FeatureModule } from './feature/feature.module';
import { ServiceModule } from './service/service.module';
import { NgxsModule } from '@ngxs/store';
import { TaskState, ToolState } from './state';
import { CommandModule } from './command/command.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FeatureModule,
    ServiceModule,
    NgxsModule.forRoot([TaskState, ToolState]),
    CommandModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
