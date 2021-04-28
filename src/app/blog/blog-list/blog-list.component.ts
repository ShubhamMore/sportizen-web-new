import { BlogModel } from '../../models/blog.model';
import { BlogsService } from '../../services/blogs.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '../../services/user-profile.service';
import { Title } from '@angular/platform-browser';

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

    this.userProfileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.sportizenId = sportizenId;
    });

    this.blogsService.getBlogs().subscribe(
      (blogs: BlogModel[]) => {
        this.blogsList = blogs;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );

    // this.blogsList = this.blogsService.getBlogsList();
  }

  openBlog(blog: BlogModel) {
    this.router.navigate(['/dashboard/blog/view', blog._id], { relativeTo: this.route });
  }
}
