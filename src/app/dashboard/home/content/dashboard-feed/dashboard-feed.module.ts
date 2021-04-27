import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { DashboardFeedRoutingModule } from './dashboard-feed-routing.module';
import { DashboardFeedComponent } from './dashboard-feed.component';
import { PostDetailsModule } from '../../../../post/post-details/post-details.module';

@NgModule({
  declarations: [DashboardFeedComponent],
  imports: [SharedModule, DashboardFeedRoutingModule, PostDetailsModule],
  exports: [DashboardFeedComponent],
})
export class DashboardFeedModule {}
