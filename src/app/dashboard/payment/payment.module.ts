import { NgModule } from '@angular/core';
import { SharedModule } from './../../@shared/shared.module';
import { PaymentComponent } from './payment.component';

@NgModule({
  declarations: [PaymentComponent],
  imports: [SharedModule],
  entryComponents: [PaymentComponent],
  exports: [PaymentComponent],
})
export class PaymentModule {}
