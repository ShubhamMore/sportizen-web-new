import { Component, Inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LikeType } from '../../../enums/likeType';
import { PostLikeModel as LikeModel } from '../../../models/post-models/post-like.model';
import { PostCommentLikeService } from '../../../services/post-services/post-comment-like.service';
import { PostCommentReplyLikeService } from '../../../services/post-services/post-comment-reply-like.service';
import { PostLikeService } from '../../../services/post-services/post-like.service';
import { environment } from './../../../../environments/environment';

export interface LikeDialogData {
  likeType: LikeType;
  postId: string;
  commentId: string;
  replyCommentId: string;
}

@Component({
  selector: 'app-post-likes',
  templateUrl: './post-likes.component.html',
  styleUrls: ['./post-likes.component.scss'],
})
export class PostLikesComponent implements OnInit, AfterViewInit, OnDestroy {
  loadingLikes: boolean;
  noMoreLikes: boolean;
  likes: LikeModel[];

  limit = environment.limit + 4;

  scroll = (event: any): void => {
    if ($('.loading-container')) {
      const moreFeed = $('.loading-container').offset().top;
      const threshold = window.innerHeight + 100;

      if (moreFeed <= threshold) {
        const skip = this.likes.length;
        if (!this.loadingLikes && !this.noMoreLikes) {
          this.getLikes(this.limit, skip);
        }
      }
    }
  };

  constructor(
    private postLikeService: PostLikeService,
    private postCommentLikeService: PostCommentLikeService,
    private postCommentReplyLikeService: PostCommentReplyLikeService,
    public dialogRef: MatDialogRef<PostLikesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LikeDialogData
  ) {}

  ngOnInit(): void {
    this.loadingLikes = true;
    this.noMoreLikes = false;
    this.likes = [];
    this.getLikes(this.limit, 0);
  }

  ngAfterViewInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  getLikes(limit: number, skip: number) {
    this.loadingLikes = true;

    let likeSubscription: any;

    if (this.data.likeType === LikeType.Post) {
      likeSubscription = this.postLikeService.getPostLikes(this.data.postId, limit, skip);
    } else if (this.data.likeType === LikeType.PostComment) {
      likeSubscription = this.postCommentLikeService.getPostCommentLikes(
        this.data.postId,
        this.data.commentId,
        limit,
        skip
      );
    } else if (this.data.likeType === LikeType.PostReplyComment) {
      likeSubscription = this.postCommentReplyLikeService.getPostReplyCommentLikes(
        this.data.postId,
        this.data.commentId,
        this.data.replyCommentId,
        limit,
        skip
      );
    }

    likeSubscription.subscribe((likes: LikeModel[]) => {
      if (likes.length === 0) {
        this.noMoreLikes = true;
      } else {
        this.likes.push(...likes);
        // this.navigateToOnScreenPost();
      }

      this.loadingLikes = false;
    });
  }

  ngOnDestroy() {
    this.likes = [];
    window.removeEventListener('scroll', this.scroll, true);
  }
}
