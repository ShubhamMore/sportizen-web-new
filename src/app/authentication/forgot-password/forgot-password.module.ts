import { ForgotPasswordComponent } from './forgot-password.component';
import { SharedModule } from './../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [SharedModule, ForgotPasswordRoutingModule],
})
export class ForgotPasswordModule {}
