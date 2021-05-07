import { NgModule } from '@angular/core';

import { ProfileGalleryRoutingModule } from './profile-galery-routing.module';
import { ProfileGalleryComponent } from './profile-galery.component';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  declarations: [ProfileGalleryComponent],
  imports: [SharedModule, ProfileGalleryRoutingModule],
})
export class ProfileGalleryModule {}
