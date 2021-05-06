import { DashboardFeedModule } from './../../content/dashboard-feed/dashboard-feed.module';
import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';
import { ImageModule } from './../../../../image/image.module';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [SharedModule, ImageModule, DashboardFeedModule, UserProfileRoutingModule],
})
export class UserProfileModule {}
