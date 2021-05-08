import { NgModule } from '@angular/core';
import { SportsComponent } from './sports.component';
import { SharedModule } from '../@shared/shared.module';

@NgModule({
  declarations: [SportsComponent],
  imports: [SharedModule],
  entryComponents: [SportsComponent],
  exports: [SportsComponent],
})
export class SportsModule {}
