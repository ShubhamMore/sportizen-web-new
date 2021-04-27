import { NgModule } from '@angular/core';
import { SharedModule } from '../../@shared/shared.module';
import { PostDetailsComponent } from './post-details.component';
import { PostShareComponent } from './post-share/post-share.component';
import { PostLikesComponent } from './post-likes/post-likes.component';
import { PostViewComponent } from './post-view/post-view.component';
import { PostCommentComponent } from './post-comment/post-comment.component';

@NgModule({
  declarations: [
    PostDetailsComponent,
    PostShareComponent,
    PostLikesComponent,
    PostViewComponent,
    PostCommentComponent,
  ],
  imports: [SharedModule],
  entryComponents: [
    PostShareComponent,
    PostLikesComponent,
    PostViewComponent,
    PostCommentComponent,
  ],
  exports: [PostDetailsComponent],
})
export class PostDetailsModule {}
