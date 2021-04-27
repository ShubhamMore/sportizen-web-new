import { SharedModule } from './../../@shared/shared.module';
import { EventDetailsComponent } from './event-details.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [EventDetailsComponent],
  imports: [SharedModule],
  exports: [EventDetailsComponent],
})
export class EventDetailsModule {}
