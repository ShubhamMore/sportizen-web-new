import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { JoinEventRoutingModule } from './join-event-routing.module';
import { JoinEventComponent } from './join-event.component';
import { EventDetailsModule } from '../event-details/event-details.module';

@NgModule({
  declarations: [JoinEventComponent],
  imports: [SharedModule, JoinEventRoutingModule, EventDetailsModule],
})
export class JoinEventModule {}
