import { SharedModule } from './../../@shared/shared.module';
import { NgModule } from '@angular/core';
import { ImageModule } from './../../image/image.module';

import { SaveEventRoutingModule } from './save-event-routing.module';
import { SaveEventComponent } from './save-event.component';

@NgModule({
  declarations: [SaveEventComponent],
  imports: [SharedModule, ImageModule, SaveEventRoutingModule],
})
export class SaveEventModule {}
