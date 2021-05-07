import { NgModule } from '@angular/core';

import { ProfileDashboardComponent } from './profile-dashboard.component';
import { ProfileDashboardStoryComponent } from './profile-dashboard-story/profile-dashboard-story.component';
import { ProfileDashboardGalleryComponent } from './profile-dashboard-gallery/profile-dashboard-gallery.component';
import { ProfileDashboardConnectionsComponent } from './profile-dashboard-connections/profile-dashboard-connections.component';
import { SharedModule } from './../../../../../@shared/shared.module';
import { DashboardFeedModule } from './../../../content/dashboard-feed/dashboard-feed.module';
import { ProfileDashboardRoutingModule } from './profile-dashboard-routing.module';
import { ImageModule } from './../../../../../image/image.module';

@NgModule({
  declarations: [
    ProfileDashboardComponent,
    ProfileDashboardStoryComponent,
    ProfileDashboardGalleryComponent,
    ProfileDashboardConnectionsComponent,
  ],
  imports: [SharedModule, DashboardFeedModule, ImageModule, ProfileDashboardRoutingModule],
})
export class ProfileDashboardModule {}
