import { SharedModule } from './../@shared/shared.module';
import { NgModule } from '@angular/core';
import { HeaderModule } from '../header/header.module';

import { EventRoutingModule } from './event-routing.module';
import { EventComponent } from './event.component';

@NgModule({
  declarations: [EventComponent],

  imports: [SharedModule, HeaderModule, EventRoutingModule],
})
export class EventModule {}
