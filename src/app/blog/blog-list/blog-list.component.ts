import { BlogModel } from '../../models/blog.model';
import { BlogsService } from '../../services/blogs.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '../../services/user-profile.service';
import { Title } from '@angular/platform-browser';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  loading: boolean;
  blogsList: BlogModel[];
  sportizenId: string;

  constructor(
    private blogsService: BlogsService,
    private router: Router,
    private userProfileService: UserProfileService,
    private titleService: Title,
    private route: ActivatedRoute
  ) {}

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

    this.getBlogs(null, null);
  }

  getBlogs(limit: number, skip: number) {
    this.blogsService.getBlogs(limit, skip).subscribe(
      (blogs: BlogModel[]) => {
        this.blogsList = blogs;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  newBlog() {
    if (this.sportizenId) {
      this.router.navigate(['./new'], { relativeTo: this.route });
    }
  }

  editBlog(id: string) {
    if (this.sportizenId && id) {
      this.router.navigate(['./edit', id], { relativeTo: this.route });
    }
  }

  openBlog(id: string) {
    this.router.navigate(['./view', id], { relativeTo: this.route });
  }
}
