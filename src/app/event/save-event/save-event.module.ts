import { SharedModule } from './../../@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaveEventRoutingModule } from './save-event-routing.module';
import { SaveEventComponent } from './save-event.component';

@NgModule({
  declarations: [SaveEventComponent],
  imports: [SharedModule, SaveEventRoutingModule],
})
export class SaveEventModule {}
