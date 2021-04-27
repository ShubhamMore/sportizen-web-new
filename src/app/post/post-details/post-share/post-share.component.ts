import { PostModel } from '../../../models/post.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostService } from '../../../services/post.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, Input, OnInit, Inject } from '@angular/core';

export interface LikeDialogData {
  postId: string;
  isUserFeed: boolean;
}

@Component({
  selector: 'app-post-share',
  templateUrl: './post-share.component.html',
  styleUrls: ['./post-share.component.scss'],
})
export class PostShareComponent implements OnInit {
  form: FormGroup;

  postUploading = false;

  constructor(
    public postService: PostService,
    public dialogRef: MatDialogRef<PostShareComponent>,
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
        if (!this.data.isUserFeed) {
          this.postService.postList.unshift(post);
        }
        this.dialogRef.close();
      });
    }
  }
}
