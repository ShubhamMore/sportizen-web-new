import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  contact: string;
}

interface DialogData {
  teamMembers: TeamMember[];
}

@Component({
  selector: 'app-view-registration',
  templateUrl: './view-registration.component.html',
  styleUrls: ['./view-registration.component.scss'],
})
export class ViewRegistrationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ViewRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  getUserLetter(userName: string) {
    if (!userName) {
      return 'S';
    }
    return userName.charAt(0).toUpperCase();
  }
}
