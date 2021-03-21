import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogsService } from 'src/app/services/blogs.service';


@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {

  loading : boolean;
  blogDetails:any;
  constructor(private blogsService:BlogsService,private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.loading = true;
    var blogDetails =  this.blogsService.getSelectedBlogDetails();
    if(blogDetails){
      this.blogDetails = blogDetails;
    }else{
      this.router.navigate(['/blogs'],{ relativeTo: this.route })
    }
    this.loading= false;
  }

}
