import { SharedModule } from './../@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './header/header.component';
import { SearchBarComponent } from './header/search-bar/search-bar.component';

@NgModule({
  declarations: [DashboardComponent, HeaderComponent, SearchBarComponent],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
