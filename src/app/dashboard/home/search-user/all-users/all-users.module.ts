import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { AllUsersRoutingModule } from './all-users-routing.module';
import { AllUsersComponent } from './all-users.component';

@NgModule({
  declarations: [AllUsersComponent],
  imports: [SharedModule, AllUsersRoutingModule],
})
export class AllUsersModule {}
