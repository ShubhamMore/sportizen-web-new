import { DashboardFeedModule } from './../../content/dashboard-feed/dashboard-feed.module';
import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { ProfileCommonModule } from './../@shared/profile-common.module';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [SharedModule, ProfileCommonModule, DashboardFeedModule, UserProfileRoutingModule],
})
export class UserProfileModule {}
