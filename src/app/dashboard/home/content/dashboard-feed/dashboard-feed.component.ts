import { User } from './../../../../authentication/auth/auth-model/user.model';
import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { LikeType } from './../../../../enums/likeType';
import { ConnectionService } from './../../../../services/connection.service';
import { PostLikeService } from './../../../../services/post-like.service';
import { PostSaveService } from './../../../../services/post-save.service';
import { PostViewService } from './../../../../services/post-view.service';
import { PostService } from './../../../../services/post.service';
import { AuthService } from './../../../../authentication/auth/auth-service/auth.service';
import { UserProfileService } from './../../../../services/user-profile.service';
import { FeedCommentComponent } from './feed-comment/feed-comment.component';
import { FeedLikesComponent } from './feed-likes/feed-likes.component';
import { FeedViewComponent } from './feed-view/feed-view.component';
import { FeedShareComponent } from './feed-share/feed-share.component';

@Component({
  selector: 'app-dashboard-feed',
  templateUrl: './dashboard-feed.component.html',
  styleUrls: ['./dashboard-feed.component.scss'],
})
export class DashboardFeedComponent implements OnInit {
  @Input() isMyFeed: boolean;
  @Input() isUserFeed: boolean;
  @Input() userId: string;

  sportizenUser: string;

  constructor(
    public postService: PostService,
    public postLikeService: PostLikeService,
    public postSaveService: PostSaveService,
    private postViewService: PostViewService,
    private commentsSheet: MatBottomSheet,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private connectionService: ConnectionService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.authService.getUser().subscribe((user: User) => {
      if (user) {
        this.sportizenUser = user.sportizenId;
      }
      this.loadFeed();
    });
  }

  loadFeed() {
    if (this.isMyFeed) {
      this.postService.getMyPosts().subscribe((res: any) => {
        this.postService.postList = res;
      });
    } else if (this.isUserFeed) {
      this.postService.getUserPosts(this.userId).subscribe((res: any) => {
        this.postService.postList = res;
      });
    } else {
      this.postService.getPosts().subscribe((res: any) => {
        this.postService.postList = res;
        this.navigateToOnScreenPost();
      });
    }
  }

  navigateToOnScreenPost() {
    if (this.postService.onScreenPostId) {
      setTimeout(() => {
        document
          .querySelector('#p' + this.postService.onScreenPostId)
          .scrollIntoView({ block: 'center', inline: 'nearest' });
        this.postService.onScreenPostId = null;
      }, 1);
    }
  }

  likeUnlikePost(postId: string, alreadyLiked: boolean, postIndex: number): void {
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

  updatePostLikesCount(postId: string, alreadyLiked: boolean, postIndex: number) {
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

  saveUnsavePost(postId: string, alreadySaved: boolean, postIndex: number): void {
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

  updateBookmarkIcon(postId: string, alreadySaved: boolean, postIndex: number) {
    if (!alreadySaved) {
      if (!this.postService.postList[postIndex].alreadySaved) {
        this.postService.postList[postIndex].alreadySaved = false;
      }
      this.postService.postList[postIndex].alreadySaved = true;
    } else {
      this.postService.postList[postIndex].alreadySaved = false;
    }
  }

  openCommentsSheet(postId: string, imageUrl: string) {
    this.commentsSheet.open(FeedCommentComponent, {
      panelClass: 'comment-bottom-sheet',
      data: {
        postId,
        imageUrl,
      },
    });
  }

  sharePost(postId: string) {
    const dialogRef = this.dialog.open(FeedShareComponent, {
      data: { postId },
      maxHeight: '90vh',
    });
  }

  showLikeDetails(postId: string) {
    const dialogRef = this.dialog.open(FeedLikesComponent, {
      data: { likeType: LikeType.Post, postId },
      maxHeight: '90vh',
    });
  }

  showViewDetails(postId: string) {
    const dialogRef = this.dialog.open(FeedViewComponent, {
      data: { likeType: LikeType.Post, postId },
      maxHeight: '90vh',
    });
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
    if (id === this.userProfileService.getProfile().sportizenId) {
      this.router.navigate(['/dashboard', 'profile'], { relativeTo: this.route });
    } else {
      this.connectionService.searchedSportizenId = id;
      this.postService.onScreenPostId = postId;
      this.router.navigate(['/dashboard', 'profile', id], { relativeTo: this.route });
    }
  }

  deletePost(post: string, createdBy: string, i: number) {
    if (createdBy === this.sportizenUser) {
      this.postService.deletePost(post).subscribe(
        (res: any) => {
          this.postService.postList.splice(i, 1);
        },
        (error: any) => {}
      );
    }
  }

  scrolledIndexChange(event: any) {}
}
