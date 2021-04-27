import { SharedModule } from './../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { ListEventRoutingModule } from './list-event-routing.module';
import { ListEventComponent } from './list-event.component';
import { EventDetailsModule } from '../event-details/event-details.module';

@NgModule({
  declarations: [ListEventComponent],
  imports: [SharedModule, ListEventRoutingModule, EventDetailsModule],
})
export class ListEventModule {}
