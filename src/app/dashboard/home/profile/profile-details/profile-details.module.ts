import { SharedModule } from './../../../../@shared/shared.module';
import { DashboardFeedModule } from './../../content/dashboard-feed/dashboard-feed.module';
import { ProfileCommonModule } from './../@shared/profile-common.module';
import { NgModule } from '@angular/core';

import { ProfileDetailsRoutingModule } from './profile-details-routing.module';
import { ProfileDetailsComponent } from './profile-details.component';

@NgModule({
  declarations: [ProfileDetailsComponent],
  imports: [SharedModule, ProfileCommonModule, DashboardFeedModule, ProfileDetailsRoutingModule],
})
export class ProfileDetailsModule {}
