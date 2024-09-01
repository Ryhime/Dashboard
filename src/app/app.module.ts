import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksPanelComponent } from './tasks-panel/tasks-panel.component';
import { PanelModule } from 'primeng/panel';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {ChartModule} from 'primeng/chart';
import { ComputerStatsComponent } from './computer-stats/computer-stats.component';
import { NetworkStatsComponent } from './network-stats/network-stats.component';
import { AppsComponent } from './apps/apps.component';
import { CommonModule } from '@angular/common';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    TasksPanelComponent,
    ComputerStatsComponent,
    NetworkStatsComponent,
    AppsComponent,
    TitleBarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PanelModule,
    CheckboxModule,
    CommonModule,
    ButtonModule,
    HttpClientModule,
    ChartModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
