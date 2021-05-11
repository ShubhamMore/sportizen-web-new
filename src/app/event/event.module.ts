import { SharedModule } from './../@shared/shared.module';
import { NgModule } from '@angular/core';

import { EventRoutingModule } from './event-routing.module';
import { EventComponent } from './event.component';

@NgModule({
  declarations: [EventComponent],

  imports: [SharedModule, EventRoutingModule],
})
export class EventModule {}
