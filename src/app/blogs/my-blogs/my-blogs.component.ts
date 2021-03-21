import { Component, OnInit } from '@angular/core';
import { BlogsService } from 'src/app/services/blogs.service';

@Component({
  selector: 'app-my-blogs',
  templateUrl: './my-blogs.component.html',
  styleUrls: ['./my-blogs.component.scss']
})
export class MyBlogsComponent implements OnInit {

  blogs:any;
  constructor(private blogsService:BlogsService) { }

  ngOnInit(): void {
    this.blogs = this.blogsService.getBlogsList();
  }

}
