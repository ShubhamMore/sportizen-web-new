import { SharedModule } from '../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { ViewBlogRoutingModule } from './view-blog-routing.module';
import { ViewBlogComponent } from './view-blog.component';

@NgModule({
  declarations: [ViewBlogComponent],
  imports: [SharedModule, ViewBlogRoutingModule],
})
export class ViewBlogModule {}
