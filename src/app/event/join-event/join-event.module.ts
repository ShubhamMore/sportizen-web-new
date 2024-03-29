import { SharedModule } from './../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { JoinEventRoutingModule } from './join-event-routing.module';
import { JoinEventComponent } from './join-event.component';
import { EventDetailsModule } from './../event-details/event-details.module';
import { PaymentModule } from 'src/app/payment/payment.module';

@NgModule({
  declarations: [JoinEventComponent],
  imports: [SharedModule, EventDetailsModule, PaymentModule, JoinEventRoutingModule],
})
export class JoinEventModule {}
