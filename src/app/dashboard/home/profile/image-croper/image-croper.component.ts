import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-croper',
  templateUrl: './image-croper.component.html',
  styleUrls: ['./image-croper.component.scss'],
})
export class ImageCroperComponent implements OnInit {
  @Input() image: string;
  @Input() customAspectRatio: number;
  @Input() customSavedBtnName: string;

  croppedImage: string;
  aspectRatio: number;
  savedBtnName: string;

  // tslint:disable-next-line: no-output-native
  @Output() close = new EventEmitter<void>();
  @Output() crop = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    this.croppedImage = '';
    this.aspectRatio = 1;
    this.savedBtnName = 'Crop';
    if (this.customAspectRatio) {
      this.aspectRatio = this.customAspectRatio;
    }
    if (this.customSavedBtnName) {
      this.savedBtnName = this.customSavedBtnName;
    }
  }

  imageCropped(image: any) {
    this.croppedImage = image.base64;
  }

  onCrop() {
    this.crop.emit(this.croppedImage);
  }

  onClose() {
    this.close.emit();
  }
}
