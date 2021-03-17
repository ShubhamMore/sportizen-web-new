import { ImageModelComponent } from './../image-model/image-model.component';
import { ImageCroperComponent } from '../image-croper/image-croper.component';
import { SportsInterestComponent } from '../sports-interest/sports-interest.component';

import { SharedModule } from './../../../../@shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';

import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ImageCroperComponent, SportsInterestComponent, ImageModelComponent],
  entryComponents: [ImageCroperComponent, SportsInterestComponent, ImageModelComponent],
  imports: [SharedModule, ImageCropperModule],
  exports: [ImageCroperComponent, SportsInterestComponent, ImageModelComponent],
})
export class ProfileCommonModule {}
