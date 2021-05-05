import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

export interface ImageCroperData {
  image: string;
  customAspectRatio: number;
  customSavedBtnName: string;
}
@Component({
  selector: 'app-image-croper',
  templateUrl: './image-croper.component.html',
  styleUrls: ['./image-croper.component.scss'],
})
export class ImageCroperComponent implements OnInit {
  croppedImage: string;
  aspectRatio: number;
  savedBtnName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ImageCroperData,
    public dialogRef: MatDialogRef<ImageCroperComponent>
  ) {}

  ngOnInit(): void {
    this.croppedImage = '';
    this.aspectRatio = 1;
    this.savedBtnName = 'Crop';
    if (this.data.customAspectRatio) {
      this.aspectRatio = this.data.customAspectRatio;
    }
    if (this.data.customSavedBtnName) {
      this.savedBtnName = this.data.customSavedBtnName;
    }
  }

  imageCropped(image: any) {
    this.croppedImage = image.base64;
  }

  onCrop() {
    this.dialogRef.close(this.croppedImage);
  }

  onClose() {
    this.dialogRef.close();
  }
}
