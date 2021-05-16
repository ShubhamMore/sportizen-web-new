import { NgModule } from '@angular/core';

import { SharedModule } from './../../@shared/shared.module';
import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy.component';

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [SharedModule, PrivacyPolicyRoutingModule],
})
export class PrivacyPolicyModule {}
