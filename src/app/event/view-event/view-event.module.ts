import { EventDetailsModule } from './../event-details/event-details.module';
import { NgModule } from '@angular/core';
import { SharedModule } from './../../@shared/shared.module';

import { ViewEventRoutingModule } from './view-event-routing.module';
import { ViewEventComponent } from './view-event.component';
import { ViewRegistrationComponent } from './view-registration/view-registration.component';

@NgModule({
  declarations: [ViewEventComponent, ViewRegistrationComponent],
  entryComponents: [ViewRegistrationComponent],
  imports: [SharedModule, ViewEventRoutingModule, EventDetailsModule],
})
export class ViewEventModule {}
