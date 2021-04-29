import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment.component';
import { SharedModule } from '../@shared/shared.module';

@NgModule({
  declarations: [PaymentComponent],
  imports: [SharedModule],
  entryComponents: [PaymentComponent],
  exports: [PaymentComponent],
})
export class PaymentModule {}
