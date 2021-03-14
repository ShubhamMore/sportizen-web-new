import { ImageModelComponent } from './../image-model/image-model.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from './../../../../@shared/shared.module';
import { ImageCroperComponent } from '../image-croper/image-croper.component';
import { SportsInterestComponent } from '../sports-interest/sports-interest.component';

import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ImageCroperComponent, SportsInterestComponent, ImageModelComponent],
  imports: [SharedModule, ImageCropperModule],
  exports: [ImageCropperModule, ImageCroperComponent, SportsInterestComponent, ImageModelComponent],
})
export class ProfileCommonModule {}
