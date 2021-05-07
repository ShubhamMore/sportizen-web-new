import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';
import { ProfileService } from './../@shared/profile.service';

import { ProfileDetailRoutingModule } from './profile-detail-routing.module';
import { ProfileDetailComponent } from './profile-detail.component';
import { ImageModule } from './../../../../image/image.module';

@NgModule({
  declarations: [ProfileDetailComponent],
  providers: [ProfileService],
  imports: [SharedModule, ImageModule, ProfileDetailRoutingModule],
})
export class ProfileDetailModule {}
