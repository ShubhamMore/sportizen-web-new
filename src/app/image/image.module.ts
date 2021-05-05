import { NgModule } from '@angular/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from '../@shared/shared.module';
import { ImageCroperComponent } from './image-croper/image-croper.component';

import { ImageModelComponent } from './image-model/image-model.component';

@NgModule({
  declarations: [ImageCroperComponent, ImageModelComponent],
  entryComponents: [ImageCroperComponent, ImageModelComponent],
  imports: [SharedModule, ImageCropperModule],
  exports: [ImageCroperComponent, ImageModelComponent],
})
export class ImageModule {}
