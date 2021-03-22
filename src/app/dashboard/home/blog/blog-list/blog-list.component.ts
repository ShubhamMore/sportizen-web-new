import { BlogModel } from './../../../../models/blog.model';
import { BlogsService } from '../../../../services/blogs.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  blogsList: BlogModel[];

  constructor(
    private blogsService: BlogsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.blogsList = [];
    this.blogsList = this.blogsService.getBlogsList();
    console.log(this.blogsList);
  }

  openBlog(id: string) {
    this.blogsService.setBlogId(id);
    this.router.navigate(['/dashboard/blog/view', id], { relativeTo: this.route });
  }
}
