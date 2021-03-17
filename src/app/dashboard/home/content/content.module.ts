import { SharedModule } from './../../../@shared/shared.module';
import { DashboardFeedModule } from './dashboard-feed/dashboard-feed.module';
import { NgModule } from '@angular/core';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { UploadContentComponent } from './upload-content/upload-content.component';
import { UploadContentDialogComponent } from './upload-content/upload-content-dialog/upload-content-dialog.component';

@NgModule({
  declarations: [ContentComponent, UploadContentComponent, UploadContentDialogComponent],
  entryComponents: [UploadContentDialogComponent],
  imports: [SharedModule, DashboardFeedModule, ContentRoutingModule],
})
export class ContentModule {}
