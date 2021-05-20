import { BlogModel } from '../../models/blog-models/blog.model';
import { BlogsService } from '../../services/blog-services/blogs.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserProfileService } from '../../services/user-services/user-profile.service';
import { Title } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-blog-tag-list',
  templateUrl: './blog-tag-list.component.html',
  styleUrls: ['./blog-tag-list.component.scss'],
})
export class BlogTagListComponent implements OnInit, AfterViewInit, OnDestroy {
  blogsList: BlogModel[];
  sportizenId: string;
  tag: string;

  loadingBlogs: boolean;
  noMoreBlogs: boolean;

  constructor(
    private blogsService: BlogsService,
    private router: Router,
    private userProfileService: UserProfileService,
    private titleService: Title,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param: Params) => {
      this.tag = param.tag;

      this.titleService.setTitle('SPORTIZEN | Blogs | ' + this.tag);
      this.ngOnInit();
    });
  }

  scroll = (event: any): void => {
    if ($('.loading-container')) {
      const moreFeed = $('.loading-container').offset().top;
      const threshold = window.innerHeight + 250;

      if (moreFeed <= threshold) {
        const skip = this.blogsList.length;
        if (!this.loadingBlogs && !this.noMoreBlogs) {
          this.getBlogs(environment.limit, skip);
        }
      }
    }
  };

  ngOnInit(): void {
    this.loadingBlogs = true;
    this.blogsList = [];

    this.userProfileService
      .getUserSportizenId()
      .pipe(first())
      .subscribe((sportizenId: string) => {
        this.sportizenId = sportizenId;
      });

    this.getBlogs(environment.limit, null);
  }

  ngAfterViewInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  getBlogs(limit: number, skip: number) {
    this.loadingBlogs = true;

    this.blogsService.getBlogsByTag(this.tag, limit, skip).subscribe(
      (blogs: BlogModel[]) => {
        if (blogs.length === 0) {
          this.noMoreBlogs = true;
        } else {
          this.blogsList.push(...blogs);
        }
        this.loadingBlogs = false;
      },
      (error: any) => {
        this.loadingBlogs = false;
      }
    );
  }

  viewRecentBlogs() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  viewBlogsByTag(tag: string) {
    this.router.navigate(['../', tag], { relativeTo: this.route });
  }

  editBlog(id: string) {
    if (this.sportizenId && id) {
      this.router.navigate(['../../', 'edit', id], { relativeTo: this.route });
    }
  }

  openBlog(id: string) {
    this.router.navigate(['../../', 'view', id], { relativeTo: this.route });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }
}
