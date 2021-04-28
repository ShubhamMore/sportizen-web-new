import { BlogModel } from '../../models/blog.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BlogsService } from '../../services/blogs.service';
import { UserProfileService } from '../../services/user-profile.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss'],
})
export class ViewBlogComponent implements OnInit {
  loading: boolean;
  blog: BlogModel;
  sportizenId: string;

  constructor(
    private blogService: BlogsService,
    private userProfileService: UserProfileService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.userProfileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.sportizenId = sportizenId;
    });

    this.route.params.subscribe((param: Params) => {
      const id = param.id;

      if (id) {
        this.blogService.getBlog(id).subscribe(
          (blog: BlogModel) => {
            this.blog = blog;
            this.titleService.setTitle('SPORTIZEN | Blog | ' + blog.title);
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
}
