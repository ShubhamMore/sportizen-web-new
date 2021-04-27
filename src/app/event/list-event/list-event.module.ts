import { SharedModule } from './../../@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListEventRoutingModule } from './list-event-routing.module';
import { ListEventComponent } from './list-event.component';

@NgModule({
  declarations: [ListEventComponent],
  imports: [SharedModule, ListEventRoutingModule],
})
export class ListEventModule {}
