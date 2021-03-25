import { BlogModel } from './../../../../models/blog.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogsService } from 'src/app/services/blogs.service';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss'],
})
export class ViewBlogComponent implements OnInit {
  loading: boolean;
  blog: BlogModel;
  constructor(
    private blogsService: BlogsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const blog = this.blogsService.getViewBlog();

    if (blog) {
      this.blog = blog;
    } else {
      this.router.navigate(['/dashboard/blog'], { relativeTo: this.route });
    }

    this.loading = false;
  }
}
