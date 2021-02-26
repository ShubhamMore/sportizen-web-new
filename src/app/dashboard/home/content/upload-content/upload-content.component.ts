import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostType } from './../../../../enums/postType';
import { UploadContentDialogComponent } from './upload-content-dialog/upload-content-dialog.component';

@Component({
  selector: 'app-upload-content',
  templateUrl: './upload-content.component.html',
  styleUrls: ['./upload-content.component.scss'],
})
export class UploadContentComponent implements OnInit {
  invalidImage: boolean;
  postImageFiles: File[];
  postImagePreview: string[];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.invalidImage = false;
    this.postImageFiles = [];
    this.postImagePreview = [];
  }

  openDialog(postType: PostType): void {
    const data = { postType: postType };

    if (postType === PostType.Image) {
      data['postImageFiles'] = this.postImageFiles;
      data['postImagePreview'] = this.postImagePreview;
    }

    const dialogRef = this.dialog.open(UploadContentDialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  public get postType(): typeof PostType {
    return PostType;
  }

  onImagePicked(event: Event): any {
    this.postImageFiles = [];
    this.postImagePreview = [];
    this.invalidImage = false;

    const files = (event.target as HTMLInputElement).files;
    const imgExt: string[] = ['jpg', 'png'];

    let ext: string;

    const n: number = files.length;
    for (let i = 0; i < n; i++) {
      ext = files[i].name.substring(files[i].name.lastIndexOf('.') + 1).toLowerCase();
      if (!(imgExt.indexOf(ext) !== -1)) {
        return (this.invalidImage = true);
      }
    }

    this.invalidImage = false;

    for (let i = 0; i < n; i++) {
      this.postImageFiles.push(files[i]);
      const reader = new FileReader();
      reader.onload = () => {
        this.postImagePreview.push(reader.result as string);
      };
      reader.readAsDataURL(files[i]);
    }

    this.openDialog(this.postType.Image);
  }
}
