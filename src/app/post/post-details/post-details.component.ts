import { PostModel } from '../../models/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { LikeType } from '../../enums/likeType';
import { ConnectionService } from '../../services/connection.service';
import { PostLikeService } from '../../services/post-like.service';
import { PostSaveService } from '../../services/post-save.service';
import { PostViewService } from '../../services/post-view.service';
import { PostService } from '../../services/post.service';
import { PostCommentComponent } from './post-comment/post-comment.component';
import { PostLikesComponent } from './post-likes/post-likes.component';
import { PostViewComponent } from './post-view/post-view.component';
import { PostShareComponent } from './post-share/post-share.component';
import { ConfirmComponent } from '../../@shared/confirm/confirm.component';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
})
export class PostDetailsComponent implements OnInit {
  @Input('post') post: PostModel;
  @Input('index') index: number;
  @Input('isUserFeed') isUserFeed: boolean;
  @Input('sportizenId') sportizenId: string;

  constructor(
    public postService: PostService,
    public postLikeService: PostLikeService,
    public postSaveService: PostSaveService,
    private postViewService: PostViewService,
    private router: Router,
    private route: ActivatedRoute,
    private commentsSheet: MatBottomSheet,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private connectionService: ConnectionService
  ) {}

  ngOnInit(): void {}

  likeUnlikePost(postId: string, alreadyLiked: boolean, postIndex: number): void {
    if (this.sportizenId) {
      if (!alreadyLiked) {
        this.postLikeService.likePost(postId).subscribe((res: any) => {
          this.updatePostLikesCount(postId, alreadyLiked, postIndex);
        });
      } else {
        this.postLikeService.unlikePost(postId).subscribe((res: any) => {
          this.updatePostLikesCount(postId, alreadyLiked, postIndex);
        });
      }
    }
  }

  updatePostLikesCount(postId: string, alreadyLiked: boolean, postIndex: number) {
    if (this.sportizenId) {
      if (!alreadyLiked) {
        if (!this.postService.postList[postIndex].postLikes) {
          this.postService.postList[postIndex].postLikes = 0;
        }
        this.postService.postList[postIndex].postLikes =
          this.postService.postList[postIndex].postLikes + 1;
        this.postService.postList[postIndex].alreadyLiked = true;
      } else {
        this.postService.postList[postIndex].postLikes =
          this.postService.postList[postIndex].postLikes - 1;
        this.postService.postList[postIndex].alreadyLiked = false;
      }
    }
  }

  saveUnsavePost(postId: string, alreadySaved: boolean, postIndex: number): void {
    if (this.sportizenId) {
      if (!alreadySaved) {
        this.postSaveService.savePost(postId).subscribe((res: any) => {
          this.updateBookmarkIcon(postId, alreadySaved, postIndex);
        });
      } else {
        this.postSaveService.unsavePost(postId).subscribe((res: any) => {
          this.updateBookmarkIcon(postId, alreadySaved, postIndex);
        });
      }
    }
  }

  getDescriptionLess(description: string) {
    if (description.length >= 150) {
      return description.substring(0, 150) + '...';
    }
    return description;
  }

  toggleDescription(id: number | string, toggle: boolean) {
    if (toggle) {
      $('#less-description-' + id).removeClass('display-block');
      $('#less-description-' + id).addClass('display-none');
      $('#more-description-' + id).removeClass('display-none');
      $('#more-description-' + id).addClass('display-block');
    } else {
      $('#less-description-' + id).removeClass('display-none');
      $('#less-description-' + id).addClass('display-block');
      $('#more-description-' + id).removeClass('display-block');
      $('#more-description-' + id).addClass('display-none');
    }
  }

  updateBookmarkIcon(postId: string, alreadySaved: boolean, postIndex: number) {
    if (this.sportizenId) {
      if (!alreadySaved) {
        if (!this.postService.postList[postIndex].alreadySaved) {
          this.postService.postList[postIndex].alreadySaved = false;
        }
        this.postService.postList[postIndex].alreadySaved = true;
      } else {
        this.postService.postList[postIndex].alreadySaved = false;
      }
    }
  }

  openCommentsSheet(postId: string, imageUrl: string) {
    this.commentsSheet.open(PostCommentComponent, {
      panelClass: 'comment-bottom-sheet',
      data: {
        postId,
        imageUrl,
      },
    });
  }

  sharePost(postId: string) {
    if (this.sportizenId) {
      const dialogRef = this.dialog.open(PostShareComponent, {
        data: { postId, isUserFeed: this.isUserFeed },
        maxHeight: '90vh',
      });

      dialogRef.afterClosed().subscribe((result: any) => {});
    }
  }

  showLikeDetails(postId: string) {
    const dialogRef = this.dialog.open(PostLikesComponent, {
      data: { likeType: LikeType.Post, postId },
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  showViewDetails(postId: string) {
    const dialogRef = this.dialog.open(PostViewComponent, {
      data: { likeType: LikeType.Post, postId },
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  callViewPost(postId: string, alreadyViewed: boolean, postIndex: number, event: any) {
    if (!alreadyViewed) {
      this.postViewService.viewPost(postId).subscribe((res: any) => {
        this.postService.postList[postIndex].alreadyViewed = true;
        this.postService.postList[postIndex].postViews =
          this.postService.postList[postIndex].postViews + 1;
      });
    }
  }

  viewProfile(id: string, postId: any) {
    if (id === this.sportizenId) {
      this.router.navigate(['/dashboard', 'profile'], { relativeTo: this.route });
    } else {
      this.connectionService.searchedSportizenId = id;
      this.postService.onScreenPostId = postId;
      this.router.navigate(['/dashboard', 'profile', id], {
        relativeTo: this.route,
      });
    }
  }

  deletePost(post: string, createdBy: string, i: number) {
    if (createdBy === this.sportizenId) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { message: 'Do yoy really want to delete this Post?' },
        maxHeight: '90vh',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.postService.deletePost(post).subscribe(
            (res: any) => {
              this.postService.postList.splice(i, 1);
              this.snackBar.open('Post Deleted Successfully!', null, {
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
  }
}
