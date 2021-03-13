import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

export interface DialogData {
  message: string;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements OnInit {
  message: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.message = this.data.message;
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
