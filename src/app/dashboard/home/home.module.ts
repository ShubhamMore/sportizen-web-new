import { SharedModule } from './../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DashboardSideNavComponent } from './dashboard-side-nav/dashboard-side-nav.component';

@NgModule({
  declarations: [HomeComponent, DashboardSideNavComponent],
  imports: [SharedModule, HomeRoutingModule],
})
export class HomeModule {}
