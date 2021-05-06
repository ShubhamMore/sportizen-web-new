import { UserProfileModel } from './../../../../models/user-profile.model';
import { UserProfileService } from './../../../../services/user-profile.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostType } from './../../../../enums/postType';
import { UploadContentDialogComponent } from './upload-content-dialog/upload-content-dialog.component';

@Component({
  selector: 'app-upload-content',
  templateUrl: './upload-content.component.html',
  styleUrls: ['./upload-content.component.scss'],
})
export class UploadContentComponent implements OnInit {
  @ViewChild('postImage') postImage: any;
  invalidImage: boolean;
  postImageFiles: File[];
  postImagePreview: string[];
  profileName: string;

  constructor(public dialog: MatDialog, public userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.invalidImage = false;
    this.postImageFiles = [];
    this.postImagePreview = [];
    // tslint:disable-next-line: deprecation
    this.userProfileService.getProfile().subscribe((userProfile: UserProfileModel) => {
      if (userProfile) {
        this.profileName = userProfile.name;
      }
    });
  }

  public get postType(): typeof PostType {
    return PostType;
  }

  openDialog(postType: PostType): void {
    const data: { postType: PostType; postImageFiles?: File[]; postImagePreview?: string[] } = {
      postType,
    };

    if (postType === PostType.Image) {
      data.postImageFiles = this.postImageFiles;
      data.postImagePreview = this.postImagePreview;
    }

    const dialogRef = this.dialog.open(UploadContentDialogComponent, {
      data,
    });

    // tslint:disable-next-line: deprecation
    dialogRef.afterClosed().subscribe((result: any) => {
      this.postImage.nativeElement.value = '';
    });
  }

  onImagePicked(event: Event): any {
    this.postImageFiles = [];
    this.postImagePreview = [];
    this.invalidImage = false;

    const files = (event.target as HTMLInputElement).files;
    const imgExt: string[] = ['jpg', 'jpeg', 'png'];

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
