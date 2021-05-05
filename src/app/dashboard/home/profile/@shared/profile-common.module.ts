import { SportsInterestComponent } from './../sports-interest/sports-interest.component';

import { SharedModule } from './../../../../@shared/shared.module';

import { NgModule } from '@angular/core';
import { ImageModule } from './../../../../image/image.module';

@NgModule({
  declarations: [SportsInterestComponent],
  entryComponents: [SportsInterestComponent],
  imports: [SharedModule, ImageModule],
  exports: [SportsInterestComponent],
})
export class ProfileCommonModule {}
