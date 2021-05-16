import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { AllUsersRoutingModule } from './all-users-routing.module';
import { AllUsersComponent } from './all-users.component';
import { UserConnectionModule } from './../../user-connection/user-connection.module';

@NgModule({
  declarations: [AllUsersComponent],
  imports: [SharedModule, UserConnectionModule, AllUsersRoutingModule],
})
export class AllUsersModule {}
