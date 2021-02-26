import { PostModel } from './../../../../../models/post.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostService } from './../../../../../services/post.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, Input, OnInit, Inject } from '@angular/core';

export interface LikeDialogData {
  postId: string;
}

@Component({
  selector: 'app-feed-share',
  templateUrl: './feed-share.component.html',
  styleUrls: ['./feed-share.component.scss'],
})
export class FeedShareComponent implements OnInit {
  form: FormGroup;

  postUploading = false;

  constructor(
    public postService: PostService,
    public dialogRef: MatDialogRef<FeedShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LikeDialogData
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      description: new FormControl(null, { validators: [] }),
    });
  }

  submitPost(): void {
    if (this.form.valid) {
      this.postUploading = true;

      const sharedPost = {
        post: this.data.postId,
        description: this.form.value.description,
        visibility: 'all',
      };

      this.postService.sharePost(sharedPost).subscribe((post: PostModel) => {
        this.postUploading = false;
        this.dialogRef.close();
        var postList = this.postService.postList;
        postList.unshift(post);
        this.postService.postList = postList;
      });
    }
  }
}
