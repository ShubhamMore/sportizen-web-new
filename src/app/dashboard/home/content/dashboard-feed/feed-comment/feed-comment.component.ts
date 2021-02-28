import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LikeType } from './../../../../../enums/likeType';
import { CommentModel } from './../../../../../models/comment.model';
import { PostCommentLikeService } from './../../../../../services/post-comment-like.service';
import { PostCommentReplyLikeService } from './../../../../../services/post-comment-reply-like.service';
import { PostCommentReplyService } from './../../../../../services/post-comment-reply.service';
import { PostCommentService } from './../../../../../services/post-comment.service';
import { UserProfileService } from './../../../../../services/user-profile.service';
import { FeedLikesComponent } from '../feed-likes/feed-likes.component';

@Component({
  selector: 'app-feed-comment',
  templateUrl: './feed-comment.component.html',
  styleUrls: ['./feed-comment.component.scss'],
})
export class FeedCommentComponent implements OnInit {
  @ViewChild('commentInput') commentInput: ElementRef;

  postComment: string;
  comments: CommentModel[];
  commentsLoading: boolean;
  mySportizenId: string;
  replyCommentFlag: boolean;
  replyCommentId: string;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { postId: string; imageUrl: string },
    public postCommentService: PostCommentService,
    private postCommentLikeService: PostCommentLikeService,
    private postCommentReplyService: PostCommentReplyService,
    private postCommentReplyLikeService: PostCommentReplyLikeService,
    private _snackBar: MatSnackBar,
    private _changeDetectorRef: ChangeDetectorRef,
    private userProfileService: UserProfileService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.mySportizenId = this.userProfileService.getProfile().sportizenId;
    this.commentsLoading = true;
    this.getComments();
  }

  private getComments() {
    this.postCommentService.getPostComments(this.data.postId).subscribe((res: any) => {
      this.comments = res;
      this.commentsLoading = false;
      this._changeDetectorRef.markForCheck();
    });
  }

  submitComment() {
    if (this.postComment) {
      if (this.replyCommentFlag) {
        this.postCommentReplyService
          .addPostCommentReply(this.data.postId, this.replyCommentId, this.postComment)
          .subscribe((res: any) => {
            this.commentPostedSuccessfully();
          });
      } else {
        this.postCommentService
          .addPostComment(this.data.postId, this.postComment)
          .subscribe((res: any) => {
            this.commentPostedSuccessfully();
          });
      }
    }
  }

  private commentPostedSuccessfully() {
    this.postComment = '';
    this.replyCommentFlag = false;
    this.getComments();
    this._changeDetectorRef.markForCheck();
    this._snackBar.open('Comment Posted Successfully', null, {
      duration: 2000,
    });
  }

  deleteComment(id: string, index: number) {
    if (window.confirm('Do you really want to delete this Comment')) {
      this.postCommentService.deletePostComment(id).subscribe((res: any) => {
        this.comments.splice(index, 1);
        this._changeDetectorRef.markForCheck();
        this._snackBar.open('Comment Deleted Successfully', null, {
          duration: 2000,
        });
      });
    }
  }

  deleteReplyComment(id: string, commentIndex: number, replyCommentIndex: number) {
    if (window.confirm('Do you really want to delete this Comment')) {
      this.postCommentReplyService.deletePostCommentReply(id).subscribe((res: any) => {
        this.comments[commentIndex].replyComments.splice(replyCommentIndex, 1);
        this._changeDetectorRef.markForCheck();
        this._snackBar.open('Comment Deleted Successfully', null, {
          duration: 2000,
        });
      });
    }
  }

  likeUnlikeComment(commentId: string, alreadyLiked: boolean, index: number): void {
    if (!alreadyLiked) {
      this.postCommentLikeService.likeComment(this.data.postId, commentId).subscribe((res: any) => {
        this.updateCommentLikesCount(commentId, alreadyLiked, index);
      });
    } else {
      this.postCommentLikeService
        .unlikeComment(this.data.postId, commentId)
        .subscribe((res: any) => {
          this.updateCommentLikesCount(commentId, alreadyLiked, index);
        });
    }
  }

  private updateCommentLikesCount(commentId: string, alreadyLiked: boolean, commentIndex: number) {
    if (commentIndex != -1) {
      if (!alreadyLiked) {
        if (!this.comments[commentIndex].postCommentLikes) {
          this.comments[commentIndex].postCommentLikes = 0;
        }
        this.comments[commentIndex].postCommentLikes =
          this.comments[commentIndex].postCommentLikes + 1;
        this.comments[commentIndex].alreadyLiked = true;
      } else {
        this.comments[commentIndex].postCommentLikes =
          this.comments[commentIndex].postCommentLikes - 1;
        this.comments[commentIndex].alreadyLiked = false;
      }
    }
    this._changeDetectorRef.markForCheck();
  }

  likeUnlikeReplyComment(
    commentId: string,
    replyCommentId: string,
    alreadyLiked: boolean,
    commentIndex: number,
    replyCommentIndex: number
  ) {
    if (!alreadyLiked) {
      this.postCommentReplyLikeService
        .likeReplyComment(this.data.postId, commentId, replyCommentId)
        .subscribe((res: any) => {
          this.updateReplyCommentLikesCount(
            commentId,
            alreadyLiked,
            commentIndex,
            replyCommentIndex
          );
        });
    } else {
      this.postCommentReplyLikeService
        .unlikeReplyComment(this.data.postId, commentId, replyCommentId)
        .subscribe((res: any) => {
          this.updateReplyCommentLikesCount(
            commentId,
            alreadyLiked,
            commentIndex,
            replyCommentIndex
          );
        });
    }
  }

  private updateReplyCommentLikesCount(
    commentId: string,
    alreadyLiked: boolean,
    commentIndex: number,
    replyCommentIndex: number
  ) {
    if (commentIndex != -1) {
      if (!alreadyLiked) {
        if (!this.comments[commentIndex].replyComments[replyCommentIndex].postReplyCommentLikes) {
          this.comments[commentIndex].replyComments[replyCommentIndex].postReplyCommentLikes = 0;
        }
        this.comments[commentIndex].replyComments[replyCommentIndex].postReplyCommentLikes =
          this.comments[commentIndex].replyComments[replyCommentIndex].postReplyCommentLikes + 1;
        this.comments[commentIndex].replyComments[replyCommentIndex].alreadyLiked = true;
      } else {
        this.comments[commentIndex].replyComments[replyCommentIndex].postReplyCommentLikes =
          this.comments[commentIndex].replyComments[replyCommentIndex].postReplyCommentLikes - 1;
        this.comments[commentIndex].replyComments[replyCommentIndex].alreadyLiked = false;
      }
    }
    this._changeDetectorRef.markForCheck();
  }

  updateReplyCommentFlag() {
    if (!this.postComment) {
      this.replyCommentFlag = false;
      this.replyCommentId = null;
    }
  }

  replyComment(commentId: string, userName: string) {
    this.postComment = '@' + userName + ' ';
    this.commentInput.nativeElement.focus();
    this.replyCommentFlag = true;
    this.replyCommentId = commentId;
  }

  viewCommentDetails(commentId: string, index: number) {
    this.postCommentReplyService
      .getPostReplyComments(this.data.postId, commentId)
      .subscribe((res: any) => {
        this.comments[index].replyComments = res;
        this._changeDetectorRef.markForCheck();
      });
  }

  viewCommentLikeDetails(commentId: string) {
    const dialogRef = this.dialog.open(FeedLikesComponent, {
      data: { likeType: LikeType.PostComment, postId: this.data.postId, commentId: commentId },
      maxHeight: '90vh',
    });
  }

  viewReplyCommentLikeDetails(commentId: string, replyCommentId: string) {
    const dialogRef = this.dialog.open(FeedLikesComponent, {
      data: {
        likeType: LikeType.PostReplyComment,
        postId: this.data.postId,
        commentId: commentId,
        replyCommentId: replyCommentId,
      },
      maxHeight: '90vh',
    });
  }
}
