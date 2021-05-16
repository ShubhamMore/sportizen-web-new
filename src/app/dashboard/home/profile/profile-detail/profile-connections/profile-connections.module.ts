import { NgModule } from '@angular/core';

import { SharedModule } from './../../../../../@shared/shared.module';
import { ProfileConnectionsRoutingModule } from './profile-connections-routing.module';
import { ProfileConnectionsComponent } from './profile-connections.component';
import { UserConnectionModule } from './../../../user-connection/user-connection.module';

@NgModule({
  declarations: [ProfileConnectionsComponent],
  imports: [SharedModule, UserConnectionModule, ProfileConnectionsRoutingModule],
})
export class ProfileConnectionsModule {}
