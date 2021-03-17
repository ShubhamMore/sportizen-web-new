import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { DashboardFeedRoutingModule } from './dashboard-feed-routing.module';
import { DashboardFeedComponent } from './dashboard-feed.component';
import { FeedShareComponent } from './feed-share/feed-share.component';
import { FeedLikesComponent } from './feed-likes/feed-likes.component';
import { FeedViewComponent } from './feed-view/feed-view.component';
import { FeedCommentComponent } from './feed-comment/feed-comment.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    DashboardFeedComponent,
    FeedShareComponent,
    FeedLikesComponent,
    FeedViewComponent,
    FeedCommentComponent,
  ],
  imports: [SharedModule, DashboardFeedRoutingModule, ScrollingModule],
  entryComponents: [
    FeedShareComponent,
    FeedLikesComponent,
    FeedViewComponent,
    FeedCommentComponent,
  ],
  exports: [DashboardFeedComponent],
})
export class DashboardFeedModule {}
