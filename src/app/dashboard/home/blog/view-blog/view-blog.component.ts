import { BlogModel } from './../../../../models/blog.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
    private blogService: BlogsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.route.params.subscribe((param: Params) => {
      const id = param.id;
      let getBlog: any;
      if (id) {
        getBlog = this.blogService.getBlogForUser(id);
      } else {
        this.route.queryParams.subscribe((param: Params) => {
          if (param.id) {
            getBlog = this.blogService.getBlog(param.id);
          } else {
            this.router.navigate(['../../'], { relativeTo: this.route, replaceUrl: true });
          }
        });
      }

      getBlog.subscribe(
        (blog: BlogModel) => {
          this.blog = blog;
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.router.navigate(['../../'], { relativeTo: this.route, replaceUrl: true });
        }
      );
    });
  }
}
