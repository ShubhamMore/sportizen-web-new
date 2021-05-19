import { SharedModule } from '../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { ViewBlogRoutingModule } from './view-blog-routing.module';
import { ViewBlogComponent } from './view-blog.component';
import { BlogLikesComponent } from './blog-likes/blog-likes.component';

@NgModule({
  declarations: [ViewBlogComponent, BlogLikesComponent],
  entryComponents: [BlogLikesComponent],
  imports: [SharedModule, ViewBlogRoutingModule],
})
export class ViewBlogModule {}
