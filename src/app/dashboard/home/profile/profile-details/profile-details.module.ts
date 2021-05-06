import { SharedModule } from './../../../../@shared/shared.module';
import { DashboardFeedModule } from './../../content/dashboard-feed/dashboard-feed.module';
import { NgModule } from '@angular/core';

import { ProfileDetailsRoutingModule } from './profile-details-routing.module';
import { ProfileDetailsComponent } from './profile-details.component';
import { ImageModule } from './../../../../image/image.module';

@NgModule({
  declarations: [ProfileDetailsComponent],
  imports: [SharedModule, ImageModule, DashboardFeedModule, ProfileDetailsRoutingModule],
})
export class ProfileDetailsModule {}
