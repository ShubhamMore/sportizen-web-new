import { PostModel } from './../../../../models/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostLikeService } from './../../../../services/post-like.service';
import { PostSaveService } from './../../../../services/post-save.service';
import { PostService } from './../../../../services/post.service';
import { UserProfileService } from './../../../../services/user-profile.service';
import { environment } from './../../../../../environments/environment';

import * as $ from 'jquery';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-feed',
  templateUrl: './dashboard-feed.component.html',
  styleUrls: ['./dashboard-feed.component.scss'],
})
export class DashboardFeedComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() isMyFeed: boolean;
  @Input() isUserFeed: boolean;
  @Input() userId: string;

  noMorePosts: boolean;

  loadingFeed: boolean;
  sportizenId: string;

  constructor(
    public postService: PostService,
    public postLikeService: PostLikeService,
    public postSaveService: PostSaveService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private userProfileService: UserProfileService
  ) {}

  scroll = (event: any): void => {
    if ($('.loading-feed-container')) {
      const moreFeed = $('.loading-feed-container').offset().top;
      const threshold = window.innerHeight + 250;

      if (moreFeed <= threshold) {
        const skip = this.postService.postList.length;
        if (!this.loadingFeed && !this.noMorePosts) {
          this.loadFeed(environment.limit, skip);
        }
      }
    }
  };

  ngOnInit(): void {
    this.loadingFeed = true;
    this.noMorePosts = false;

    this.userProfileService
      .getUserSportizenId()
      .pipe(first())
      .subscribe((sportizenId: string) => {
        this.sportizenId = sportizenId;

        this.loadFeed(environment.limit, null);
      });
  }

  ngAfterViewInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  loadFeed(limit: number, skip: number) {
    this.loadingFeed = true;

    let postSubscription: any;

    if (this.isMyFeed) {
      postSubscription = this.postService.getMyPosts(limit, skip);
    } else if (this.isUserFeed) {
      postSubscription = this.postService.getUserPosts(this.userId, limit, skip);
    } else {
      postSubscription = this.postService.getPosts(limit, skip);
    }

    postSubscription.subscribe((posts: PostModel[]) => {
      if (posts.length === 0) {
        this.noMorePosts = true;
      } else {
        this.postService.postList = posts;
        // this.navigateToOnScreenPost();
      }

      this.loadingFeed = false;
    });
  }

  // navigateToOnScreenPost() {
  //   if (this.postService.onScreenPostId) {
  //     setTimeout(() => {
  //       document
  //         .querySelector('#post-' + this.postService.onScreenPostId)
  //         .scrollIntoView({ block: 'center', inline: 'nearest' });
  //       this.postService.onScreenPostId = null;
  //     }, 1);
  //   }
  // }

  scrolledIndexChange(event: any) {}

  ngOnDestroy() {
    this.postService.unsetPostList();
    window.removeEventListener('scroll', this.scroll, true);
  }
}
