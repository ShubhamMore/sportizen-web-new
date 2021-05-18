import { Component, OnInit } from '@angular/core';
import { PostModel } from './../models/post-models/post.model';
import { PostService } from './../services/post-services/post.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  loading: boolean;
  post: PostModel;

  constructor(private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loading = true;

    this.route.params.subscribe((param: Params) => {
      const id = param.id;
      if (id) {
        this.postService.getPost(id).subscribe(
          (post: PostModel) => {
            this.post = post;
            this.loading = false;
          },
          (error: any) => {}
        );
      } else {
      }
    });
  }
}
