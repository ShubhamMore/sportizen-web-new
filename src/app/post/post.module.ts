import { NgModule } from '@angular/core';
import { SharedModule } from './../@shared/shared.module';

import { PostComponent } from './post.component';

import { PostRoutingModule } from './post-routing.module';
import { PostDetailsModule } from './post-details/post-details.module';

@NgModule({
  declarations: [PostComponent],
  imports: [SharedModule, PostRoutingModule, PostDetailsModule],
})
export class PostModule {}
