import { PostModel } from './../../../../../models/post-models/post.model';
import { PostType } from './../../../../../enums/postType';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostService } from './../../../../../services/post-services/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { take } from 'rxjs/operators';
import { CompressImageService } from './../../../../../services/shared-services/compress-image.service';

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
  postImageFiles: File[];

  constructor(
    public dialogRef: MatDialogRef<UploadContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public postService: PostService,
    private compressImageService: CompressImageService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      description: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  uploadPost() {
    if (this.form.valid) {
      if (this.form.value.description == null && this.data.postType === PostType.Text) {
        return;
      }
    }

    this.postUploading = true;

    if (!this.data.postImageFiles) {
      this.submitPost();
      return;
    }
    const n = this.data.postImageFiles.length;

    this.postImageFiles = [];

    for (let i = 0; i < n; i++) {
      this.compressImageService
        .compress(this.data.postImageFiles[i])
        .pipe(take(1))
        .subscribe((compressedImage) => {
          this.postImageFiles.push(compressedImage);

          if (i === n - 1) {
            this.submitPost();
          }
        });
    }
  }

  private submitPost(): void {
    const submitForm = new FormData();
    submitForm.append('postType', this.data.postType);
    submitForm.append('description', this.form.value.description);

    if (this.data.postImageFiles != null && this.postImageFiles.length > 0) {
      submitForm.append('post', this.postImageFiles[0]);
    }

    this.postService.createPost(submitForm).subscribe((res: PostModel) => {
      const postList = this.postService.postList;
      postList.unshift(res);
      this.postService.postList = postList;

      this.postUploading = false;

      this.dialogRef.close();
    });
  }

  removeImage(i: number) {
    this.data.postImageFiles.splice(i, 1);
    this.data.postImagePreview.splice(i, 1);

    if (this.data.postImagePreview.length === 0) {
      this.dialogRef.close();
    }
  }
}
