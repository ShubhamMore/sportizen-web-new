import { NgModule } from '@angular/core';

import { UserConnectionComponent } from './user-connection.component';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  declarations: [UserConnectionComponent],
  imports: [SharedModule],
  entryComponents: [UserConnectionComponent],
  exports: [UserConnectionComponent],
})
export class UserConnectionModule {}
