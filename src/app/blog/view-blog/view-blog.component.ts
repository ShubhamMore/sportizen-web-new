import { BlogModel } from '../../models/blog-models/blog.model';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BlogsService } from '../../services/blog-services/blogs.service';
import { UserProfileService } from '../../services/user-services/user-profile.service';
import { Title } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { BlogCommentModel } from './../../models/blog-models/blog-comment.model';
import { BlogCommentService } from './../../services/blog-services/blog-comment.service';
import { environment } from './../../../environments/environment.prod';
import { BlogLikeService } from 'src/app/services/blog-services/blog-like.service';
import { BlogBookmarkService } from './../../services/blog-services/blog-bookmark.service';
import { LikeType } from 'src/app/enums/likeType';
import { BlogLikesComponent } from './blog-likes/blog-likes.component';
import { MatDialog } from '@angular/material/dialog';
import { _isNumberValue } from '@angular/cdk/coercion';
import { ConfirmComponent } from 'src/app/@shared/confirm/confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss'],
})
export class ViewBlogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('commentInput') commentInput: ElementRef;
  loading: boolean;
  deletingBlog: boolean;
  blog: BlogModel;
  sportizenId: string;
  comment: string;
  submitComment: boolean;
  loadingComments: boolean;
  noMoreComments: boolean;
  blogComments: BlogCommentModel[];
  limit = environment.limit;

  scroll = (event: any): void => {
    if (!this.loading && $('.loading-container')) {
      const moreFeed = $('.loading-container').offset().top;
      const threshold = window.innerHeight + 100;

      if (moreFeed <= threshold) {
        const skip = this.blogComments.length;
        if (!this.loadingComments && !this.noMoreComments) {
          this.getComments(this.limit, skip);
        }
      }
    }
  };

  constructor(
    private blogService: BlogsService,
    private userProfileService: UserProfileService,
    private titleService: Title,
    private blogCommentServie: BlogCommentService,
    private blogLikeService: BlogLikeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private blogBookmarkService: BlogBookmarkService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.deletingBlog = false;
    this.loadingComments = true;
    this.noMoreComments = false;
    this.submitComment = false;

    this.blogComments = [];

    this.userProfileService
      .getUserSportizenId()
      .pipe(first())
      .subscribe((sportizenId: string) => {
        this.sportizenId = sportizenId;
      });

    this.route.params.subscribe((param: Params) => {
      const id = param.id;

      if (id) {
        this.blogService.getBlog(id).subscribe(
          (blog: BlogModel) => {
            this.blog = blog;
            this.titleService.setTitle('SPORTIZEN | Blog | ' + blog.title);

            this.getComments(this.limit, 0);

            this.loading = false;
          },
          (error: any) => {
            this.router.navigate(['./../'], { relativeTo: this.route, replaceUrl: true });
          }
        );
      } else {
        this.router.navigate(['./../'], { relativeTo: this.route, replaceUrl: true });
      }
    });
  }

  addComment() {
    if (this.comment) {
      this.submitComment = true;
      this.blogCommentServie.addBlogComment(this.blog._id, this.comment).subscribe(
        (comment: BlogCommentModel) => {
          if (!this.blog.blogComments) {
            this.blog.blogComments = 1;
          } else {
            this.blog.blogComments++;
          }
          this.blogComments.unshift(comment);
          this.commentInput.nativeElement.value = '';
          this.submitComment = false;
        },
        (error: any) => {
          this.submitComment = false;
        }
      );
    }
  }

  ngAfterViewInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  viewTag(tag: string) {
    this.router.navigate(['../../tag', tag], { relativeTo: this.route });
  }

  editBlog() {
    if (this.blog.sportizenUser === this.sportizenId) {
      this.router.navigate(['../../edit', this.blog._id], { relativeTo: this.route });
    }
  }

  deleteBlog() {
    if (this.blog.sportizenUser === this.sportizenId) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { message: 'Do yoy really want to delete this Blog?' },
        maxHeight: '90vh',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.deletingBlog = true;
          this.blogService.deleteBlog(this.blog._id).subscribe(
            (res: any) => {
              this.snackBar.open('Blog Deleted Successfully!', null, {
                duration: 2000,
                panelClass: ['success-snackbar'],
              });
              this.router.navigate(['../../'], { relativeTo: this.route });
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

  showLikeDetails() {
    if (this.sportizenId) {
      if (!this.blog.blogLikes) {
        return;
      }

      const dialogRef = this.dialog.open(BlogLikesComponent, {
        data: { likeType: LikeType.Blog, blogId: this.blog._id },
        maxHeight: '90vh',
      });

      dialogRef.afterClosed().subscribe((result: any) => {});
    }
  }

  getComments(limit: number, skip: number) {
    this.loadingComments = true;

    this.blogCommentServie
      .getBlogComments(this.blog._id, limit, skip)
      .subscribe((comments: BlogCommentModel[]) => {
        if (comments.length === 0) {
          this.noMoreComments = true;
        } else {
          this.blogComments.push(...comments);
        }

        this.loadingComments = false;
      });
  }

  likeUnlikeBlog() {
    if (this.sportizenId) {
      if (!this.blog.alreadyLiked) {
        this.blogLikeService.likeBlog(this.blog._id).subscribe((res: any) => {
          if (!this.blog.blogLikes) {
            this.blog.blogLikes = 0;
          }
          this.blog.blogLikes += 1;
          this.blog.alreadyLiked = true;
        });
      } else {
        this.blogLikeService.unlikeBlog(this.blog._id).subscribe((res: any) => {
          this.blog.blogLikes -= 1;
          this.blog.alreadyLiked = false;
        });
      }
    }
  }

  deleteComment(blogId: string, i: number) {
    this.blogCommentServie.deleteBlogComment(blogId).subscribe(
      (res: any) => {
        this.blog.blogComments--;
        this.blogComments.splice(i, 1);
      },
      (error: any) => {}
    );
  }

  bookmarkBlog() {
    if (this.sportizenId) {
      if (!this.blog.alreadyBookmarked) {
        this.blogBookmarkService.addBlogBookmark(this.blog._id).subscribe((res: any) => {
          this.blog.alreadyBookmarked = true;
        });
      } else {
        this.blogBookmarkService.removeBlogBookmark(this.blog._id).subscribe((res: any) => {
          this.blog.alreadyBookmarked = false;
        });
      }
    }
  }

  ngOnDestroy() {
    this.blogComments = [];
    window.removeEventListener('scroll', this.scroll, true);
  }
}
