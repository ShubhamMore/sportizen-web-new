import { SharedModule } from './../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { SearchUserRoutingModule } from './search-user-routing.module';
import { SearchUserComponent } from './search-user.component';

@NgModule({
  declarations: [SearchUserComponent],
  imports: [SharedModule, SearchUserRoutingModule],
})
export class SearchUserModule {}
