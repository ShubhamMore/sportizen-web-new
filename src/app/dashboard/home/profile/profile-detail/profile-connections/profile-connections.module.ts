import { NgModule } from '@angular/core';

import { SharedModule } from './../../../../../@shared/shared.module';
import { ProfileConnectionsRoutingModule } from './profile-connections-routing.module';
import { ProfileConnectionsComponent } from './profile-connections.component';

@NgModule({
  declarations: [ProfileConnectionsComponent],
  imports: [SharedModule, ProfileConnectionsRoutingModule],
})
export class ProfileConnectionsModule {}
