import { SharedModule } from '../../@shared/shared.module';
import { NgModule } from '@angular/core';

import { CreateBlogRoutingModule } from './create-blog-routing.module';
import { CreateBlogComponent } from './create-blog.component';
import { ImageModule } from './../../image/image.module';

@NgModule({
  declarations: [CreateBlogComponent],
  imports: [SharedModule, ImageModule, CreateBlogRoutingModule],
})
export class CreateBlogModule {}
