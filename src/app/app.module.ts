import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksPanelComponent } from './tasks-panel/tasks-panel.component';
import { PanelModule } from 'primeng/panel';
import {CheckboxModule} from 'primeng/checkbox';
import { ComputerStatsComponent } from './computer-stats/computer-stats.component';
import { NetworkStatsComponent } from './network-stats/network-stats.component';
import { AppsComponent } from './apps/apps.component';

@NgModule({
  declarations: [
    AppComponent,
    TasksPanelComponent,
    ComputerStatsComponent,
    NetworkStatsComponent,
    AppsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PanelModule,
    CheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
