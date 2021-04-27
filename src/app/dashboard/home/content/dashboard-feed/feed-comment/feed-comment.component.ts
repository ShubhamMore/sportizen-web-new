import { ConfirmComponent } from './../../../../../@shared/confirm/confirm.component';
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
import { FeedLikesComponent } from './../feed-likes/feed-likes.component';

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
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private userProfileService: UserProfileService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.commentsLoading = true;
    this.comments = [];

    this.userProfileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.mySportizenId = sportizenId;
      this.getComments();
    });
  }

  private getComments() {
    this.postCommentService
      .getPostComments(this.data.postId)
      .subscribe((comments: CommentModel[]) => {
        this.comments = comments;
        this.commentsLoading = false;
        this.changeDetectorRef.markForCheck();
      });
  }

  submitComment() {
    if (this.postComment) {
      if (this.replyCommentFlag) {
        this.postCommentReplyService
          .addPostCommentReply(this.data.postId, this.replyCommentId, this.postComment)
          .subscribe(
            (res: any) => {
              this.commentPostedSuccessfully();
            },
            (error: any) => {
              this.commentPostedError(error);
            }
          );
      } else {
        this.postCommentService.addPostComment(this.data.postId, this.postComment).subscribe(
          (res: any) => {
            this.commentPostedSuccessfully();
          },
          (error: any) => {
            this.commentPostedError(error);
          }
        );
      }
    }
  }

  private commentPostedSuccessfully() {
    this.postComment = '';
    this.replyCommentFlag = false;
    this.getComments();
    this.changeDetectorRef.markForCheck();
    this.snackBar.open('Comment Posted Successfully', null, {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });
  }

  private commentPostedError(error: string) {
    this.snackBar.open(error, null, {
      duration: 2000,
      panelClass: ['error-snackbar'],
    });
  }

  deleteComment(id: string, index: number) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { message: 'Do you really want to delete this Comment?' },
      maxHeight: '90vh',
      disableClose: true,
    });

    // tslint:disable-next-line: deprecation
    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.postCommentService.deletePostComment(id).subscribe(
          (res: any) => {
            this.comments.splice(index, 1);
            this.changeDetectorRef.markForCheck();
            this.snackBar.open('Comment Deleted Successfully', null, {
              duration: 2000,
              panelClass: ['success-snackbar'],
            });
          },
          (error: any) => {
            this.snackBar.open(error, null, {
              duration: 2000,
              panelClass: ['error-snackbar'],
            });
          }
        );
      }
    });
  }

  deleteReplyComment(id: string, commentIndex: number, replyCommentIndex: number) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { message: 'Do you really want to delete this Comment?' },
      maxHeight: '90vh',
      disableClose: true,
    });

    // tslint:disable-next-line: deprecation
    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.postCommentReplyService.deletePostCommentReply(id).subscribe(
          (res: any) => {
            this.comments[commentIndex].replyComments.splice(replyCommentIndex, 1);
            this.changeDetectorRef.markForCheck();
            this.snackBar.open('Reply Comment Deleted Successfully', null, {
              duration: 2000,
            });
          },
          (error: any) => {
            this.snackBar.open(error, null, {
              duration: 2000,
              panelClass: ['error-snackbar'],
            });
          }
        );
      }
    });
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
    if (commentIndex !== -1) {
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
    this.changeDetectorRef.markForCheck();
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
    if (commentIndex !== -1) {
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
    this.changeDetectorRef.markForCheck();
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
        this.changeDetectorRef.markForCheck();
      });
  }

  viewCommentLikeDetails(commentId: string) {
    const dialogRef = this.dialog.open(FeedLikesComponent, {
      data: { likeType: LikeType.PostComment, postId: this.data.postId, commentId },
      maxHeight: '90vh',
    });
  }

  viewReplyCommentLikeDetails(commentId: string, replyCommentId: string) {
    const dialogRef = this.dialog.open(FeedLikesComponent, {
      data: {
        likeType: LikeType.PostReplyComment,
        postId: this.data.postId,
        commentId,
        replyCommentId,
      },
      maxHeight: '90vh',
    });
  }
}
