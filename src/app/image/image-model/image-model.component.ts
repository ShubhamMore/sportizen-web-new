import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

export interface DialogData {
  image: string;
}

@Component({
  selector: 'app-image-model',
  templateUrl: './image-model.component.html',
  styleUrls: ['./image-model.component.scss'],
})
export class ImageModelComponent implements OnInit {
  image: string;

  constructor(
    public dialogRef: MatDialogRef<ImageModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.image = this.data.image;
  }
}
