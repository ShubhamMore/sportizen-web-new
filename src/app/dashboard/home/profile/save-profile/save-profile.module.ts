import { ProfileCommonModule } from './../@shared/profile-common.module';
import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { SaveProfileRoutingModule } from './save-profile-routing.module';
import { SaveProfileComponent } from './save-profile.component';

@NgModule({
  declarations: [SaveProfileComponent],
  imports: [SharedModule, ProfileCommonModule, SaveProfileRoutingModule],
})
export class SaveProfileModule {}
