import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { ViewEventRoutingModule } from './view-event-routing.module';
import { ViewEventComponent } from './view-event.component';

@NgModule({
  declarations: [ViewEventComponent],
  imports: [SharedModule, ViewEventRoutingModule],
})
export class ViewEventModule {}