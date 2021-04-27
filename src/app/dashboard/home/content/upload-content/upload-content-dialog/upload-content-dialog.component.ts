import { PostModel } from './../../../../../models/post.model';
import { PostType } from './../../../../../enums/postType';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostService } from './../../../../../services/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

export interface DialogData {
  postType: PostType;
  postImageFiles: File[];
  postImagePreview: string[];
}

@Component({
  selector: 'app-upload-content-dialog',
  templateUrl: './upload-content-dialog.component.html',
  styleUrls: ['./upload-content-dialog.component.scss'],
})
export class UploadContentDialogComponent implements OnInit {
  form: FormGroup;
  postUploading = false;

  constructor(
    public dialogRef: MatDialogRef<UploadContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public postService: PostService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      description: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  submitPost(): void {
    if (this.form.valid) {
      this.postUploading = true;

      if (this.form.value.description == null && this.data.postType === PostType.Text) {
        return;
      }

      const submitForm = new FormData();
      submitForm.append('postType', this.data.postType);
      submitForm.append('description', this.form.value.description);

      if (this.data.postImageFiles != null && this.data.postImageFiles.length > 0) {
        submitForm.append('post', this.data.postImageFiles[0]);
      }

      this.postService.createPost(submitForm).subscribe((res: PostModel) => {
        const postList = this.postService.postList;
        postList.unshift(res);
        this.postService.postList = postList;

        this.postUploading = false;

        this.dialogRef.close();
      });
    }
  }

  removeImage(i: number) {
    this.data.postImageFiles.splice(i, 1);
    this.data.postImagePreview.splice(i, 1);

    if (this.data.postImagePreview.length === 0) {
      this.dialogRef.close();
    }
  }
}
