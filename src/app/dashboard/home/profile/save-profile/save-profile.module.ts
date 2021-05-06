import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { SaveProfileRoutingModule } from './save-profile-routing.module';
import { SaveProfileComponent } from './save-profile.component';
import { SportsModule } from './../../../../sports/sports.module';
import { ImageModule } from './../../../../image/image.module';

@NgModule({
  declarations: [SaveProfileComponent],
  imports: [SharedModule, SportsModule, ImageModule, SaveProfileRoutingModule],
})
export class SaveProfileModule {}
