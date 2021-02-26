import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostViewModel } from './../../../../../models/post-view.model';
import { PostViewService } from './../../../../../services/post-view.service';

export interface ViewDialogData {
  postId: string;
}

@Component({
  selector: 'app-feed-view',
  templateUrl: './feed-view.component.html',
  styleUrls: ['./feed-view.component.scss'],
})
export class FeedViewComponent implements OnInit {
  views: PostViewModel[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ViewDialogData,
    private postViewService: PostViewService,
    public dialogRef: MatDialogRef<FeedViewComponent>
  ) {}

  ngOnInit(): void {
    this.postViewService.getPostViews(this.data.postId).subscribe((res: any) => {
      this.views = res;
    });

    function isElementInViewport(el: any) {
      // Special bonus for those using jQuery
      if (typeof jQuery === 'function' && el instanceof jQuery) {
        el = el[0];
      }

      const rect = el.getBoundingClientRect();

      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight ||
            document.documentElement.clientHeight) /* or $(window).height() */ &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
      );
    }
  }
}
