import { NgModule } from '@angular/core';
import { SharedModule } from './../../@shared/shared.module';

import { BlogTagListRoutingModule } from './blog-tag-list-routing.module';
import { BlogTagListComponent } from './blog-tag-list.component';

@NgModule({
  declarations: [BlogTagListComponent],
  imports: [SharedModule, BlogTagListRoutingModule],
})
export class BlogTagListModule {}
