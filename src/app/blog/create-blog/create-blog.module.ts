import { SharedModule } from '../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { CreateBlogRoutingModule } from './create-blog-routing.module';
import { CreateBlogComponent } from './create-blog.component';

@NgModule({
  declarations: [CreateBlogComponent],
  imports: [SharedModule, CreateBlogRoutingModule],
})
export class CreateBlogModule {}
