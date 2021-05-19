import { Component, Inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostViewModel } from '../../../models/post-models/post-view.model';
import { PostViewService } from '../../../services/post-services/post-view.service';
import { environment } from './../../../../environments/environment.prod';

export interface ViewDialogData {
  postId: string;
}

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
})
export class PostViewComponent implements OnInit, AfterViewInit, OnDestroy {
  views: PostViewModel[];

  loadingViews: boolean;
  noMoreViews: boolean;

  limit = environment.limit + 4;

  scroll = (event: any): void => {
    if ($('.loading-container')) {
      const moreFeed = $('.loading-container').offset().top;
      const threshold = window.innerHeight + 100;

      if (moreFeed <= threshold) {
        const skip = this.views.length;
        if (!this.loadingViews && !this.noMoreViews) {
          this.getViews(this.limit, skip);
        }
      }
    }
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ViewDialogData,
    private postViewService: PostViewService,
    public dialogRef: MatDialogRef<PostViewComponent>
  ) {}

  ngOnInit(): void {
    this.loadingViews = true;
    this.noMoreViews = false;
    this.views = [];
    this.getViews(this.limit, 0);
  }

  ngAfterViewInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  getViews(limit: number, skip: number) {
    this.loadingViews = true;

    this.postViewService
      .getPostViews(this.data.postId, limit, skip)
      .subscribe((views: PostViewModel[]) => {
        if (views.length === 0) {
          this.noMoreViews = true;
        } else {
          this.views.push(...views);
        }

        this.loadingViews = false;
      });
  }

  ngOnDestroy() {
    this.views = [];
    window.removeEventListener('scroll', this.scroll, true);
  }
}
