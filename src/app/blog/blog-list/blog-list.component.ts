import { BlogModel } from '../../models/blog.model';
import { BlogsService } from '../../services/blog-services/blogs.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '../../services/user-services/user-profile.service';
import { Title } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  loading: boolean;
  blogsList: BlogModel[];
  sportizenId: string;
  type: string;

  loadingBlogs: boolean;
  noMoreBlogs: boolean;

  backPosition: string;

  constructor(
    private blogsService: BlogsService,
    private router: Router,
    private userProfileService: UserProfileService,
    private titleService: Title,
    private route: ActivatedRoute
  ) {}

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
    this.loading = true;
    this.titleService.setTitle('SPORTIZEN | Blogs');
    this.blogsList = [];

    this.userProfileService
      .getUserSportizenId()
      .pipe(first())
      .subscribe((sportizenId: string) => {
        this.sportizenId = sportizenId;
      });

    this.route.data.subscribe((data: any) => {
      this.type = data.type;

      if (this.type === 'manage') {
        this.backPosition = './../';
      } else {
        this.backPosition = './';
      }

      this.getBlogs(environment.limit, null);
    });
  }

  getTags(tags: string[]) {
    return tags.join(' | ');
  }

  getBlogs(limit: number, skip: number) {
    let blogSubscription: any;

    if (this.type === 'manage') {
      blogSubscription = this.blogsService.getMyBlogs(limit, skip);
    } else {
      blogSubscription = this.blogsService.getBlogs(limit, skip);
    }

    blogSubscription.subscribe(
      (blogs: BlogModel[]) => {
        if (blogs.length === 0) {
          this.noMoreBlogs = true;
        } else {
          this.blogsList.push(...blogs);
        }
        this.loading = false;
        this.loadingBlogs = false;
      },
      (error: any) => {
        this.loading = false;
        this.loadingBlogs = false;
      }
    );
  }

  newBlog() {
    if (this.sportizenId) {
      this.router.navigate([this.backPosition, 'new'], { relativeTo: this.route });
    }
  }

  editBlog(id: string) {
    if (this.sportizenId && id) {
      this.router.navigate([this.backPosition, 'edit', id], { relativeTo: this.route });
    }
  }

  openBlog(id: string) {
    this.router.navigate([this.backPosition, 'view', id], { relativeTo: this.route });
  }
}
