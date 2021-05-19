import { Component, Inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LikeType } from '../../../enums/likeType';
import { BlogLikeModel as LikeModel } from '../../../models/blog-models/blog-like.model';
import { BlogCommentLikeService } from '../../../services/blog-services/blog-comment-like.service';
import { BlogLikeService } from '../../../services/blog-services/blog-like.service';
import { environment } from './../../../../environments/environment';

export interface LikeDialogData {
  likeType: LikeType;
  blogId: string;
  commentId: string;
  replyCommentId: string;
}

@Component({
  selector: 'app-blog-likes',
  templateUrl: './blog-likes.component.html',
  styleUrls: ['./blog-likes.component.scss'],
})
export class BlogLikesComponent implements OnInit, AfterViewInit, OnDestroy {
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
    private blogLikeService: BlogLikeService,
    private blogCommentLikeService: BlogCommentLikeService,
    public dialogRef: MatDialogRef<BlogLikesComponent>,
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

    if (this.data.likeType === LikeType.Blog) {
      likeSubscription = this.blogLikeService.getBlogLikes(this.data.blogId, limit, skip);
    } else if (this.data.likeType === LikeType.BlogComment) {
      likeSubscription = this.blogCommentLikeService.getBlogCommentLikes(
        this.data.blogId,
        this.data.commentId,
        limit,
        skip
      );
    }

    likeSubscription.subscribe((likes: LikeModel[]) => {
      if (likes.length === 0) {
        this.noMoreLikes = true;
      } else {
        this.likes.push(...likes);
        // this.navigateToOnScreenBlog();
      }

      this.loadingLikes = false;
    });
  }

  ngOnDestroy() {
    this.likes = [];
    window.removeEventListener('scroll', this.scroll, true);
  }
}
