import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogsService } from '../services/blogs.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {

  blogsList :any;

  constructor(private blogsService:BlogsService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.blogsList = this.blogsService.getBlogsList();
  }

  openBlog(id){
    this.blogsService.setBlogId(id);
    this.router.navigate(['/blogDetails'], { relativeTo: this.route })
  }
}
