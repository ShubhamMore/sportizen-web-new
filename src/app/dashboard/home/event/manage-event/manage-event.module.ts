import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { ManageEventRoutingModule } from './manage-event-routing.module';
import { ManageEventComponent } from './manage-event.component';

@NgModule({
  declarations: [ManageEventComponent],
  imports: [SharedModule, ManageEventRoutingModule],
})
export class ManageEventModule {}
