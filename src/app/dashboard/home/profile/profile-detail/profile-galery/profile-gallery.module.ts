import { NgModule } from '@angular/core';

import { ProfileGalleryRoutingModule } from './profile-gallery-routing.module';
import { ProfileGalleryComponent } from './profile-gallery.component';
import { SharedModule } from 'src/app/@shared/shared.module';
import { ImageModule } from './../../../../../image/image.module';

@NgModule({
  declarations: [ProfileGalleryComponent],
  imports: [SharedModule, ImageModule, ProfileGalleryRoutingModule],
})
export class ProfileGalleryModule {}
