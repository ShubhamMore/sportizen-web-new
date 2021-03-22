import { SharedModule } from './../../../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { BlogListRoutingModule } from './blog-list-routing.module';
import { BlogListComponent } from './blog-list.component';

@NgModule({
  declarations: [BlogListComponent],
  imports: [SharedModule, BlogListRoutingModule],
})
export class BlogListModule {}
