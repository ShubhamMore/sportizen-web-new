import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LikeType } from 'src/app/enums/likeType';
import { LikeModel } from 'src/app/models/like.model';
import { PostCommentLikeService } from 'src/app/services/post-comment-like.service';
import { PostCommentReplyLikeService } from 'src/app/services/post-comment-reply-like.service';
import { PostLikeService } from 'src/app/services/post-like.service';

export interface LikeDialogData {
  likeType: LikeType;
  postId: string;
  commentId: string;
  replyCommentId: string;
}

@Component({
  selector: 'app-feed-likes',
  templateUrl: './feed-likes.component.html',
  styleUrls: ['./feed-likes.component.scss'],
})
export class FeedLikesComponent implements OnInit {
  loading: boolean;
  likes: LikeModel[];

  constructor(
    private postLikeService: PostLikeService,
    private postCommentLikeService: PostCommentLikeService,
    private postCommentReplyLikeService: PostCommentReplyLikeService,
    public dialogRef: MatDialogRef<FeedLikesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LikeDialogData
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.likes = [];
    if (this.data.likeType === LikeType.Post) {
      this.postLikeService.getPostLikes(this.data.postId).subscribe((res: any) => {
        this.likes = res;
        this.loading = false;
      });
    } else if (this.data.likeType === LikeType.PostComment) {
      this.postCommentLikeService
        .getCommentLikes(this.data.postId, this.data.commentId)
        .subscribe((res: any) => {
          this.likes = res;
          this.loading = false;
        });
    } else if (this.data.likeType === LikeType.PostReplyComment) {
      this.postCommentReplyLikeService
        .getReplyCommentLikes(this.data.postId, this.data.commentId, this.data.replyCommentId)
        .subscribe((res: any) => {
          this.likes = res;
          this.loading = false;
        });
    }
  }
}
