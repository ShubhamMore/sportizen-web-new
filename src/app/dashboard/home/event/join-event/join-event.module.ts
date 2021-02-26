import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoinEventRoutingModule } from './join-event-routing.module';
import { JoinEventComponent } from './join-event.component';

@NgModule({
  declarations: [JoinEventComponent],
  imports: [SharedModule, JoinEventRoutingModule],
})
export class JoinEventModule {}
