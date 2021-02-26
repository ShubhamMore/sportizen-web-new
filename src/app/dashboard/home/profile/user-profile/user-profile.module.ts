import { DashboardFeedModule } from './../../content/dashboard-feed/dashboard-feed.module';
import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [SharedModule, DashboardFeedModule, UserProfileRoutingModule],
})
export class UserProfileModule {}
