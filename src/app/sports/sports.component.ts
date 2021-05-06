import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { SportService } from './../services/sport.service';
import { SportModel } from './../models/sport.model';

export interface SportsInterestData {
  sportsInterest: string[];
}

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.scss'],
})
export class SportsComponent implements OnInit {
  sportsInterest: string[];
  sports: SportModel[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SportsInterestData,
    public dialogRef: MatDialogRef<SportsComponent>,
    public sportsService: SportService
  ) {}

  ngOnInit(): void {
    this.sports = this.sportsService.getSports();
    this.sportsInterest = this.data.sportsInterest;
  }

  toggleSportsInterest(id: string) {
    if (this.sportsInterest.includes(id)) {
      const i = this.sportsInterest.indexOf(id);
      this.sportsInterest.splice(i, 1);
    } else {
      this.sportsInterest.push(id);
    }
  }

  isSportsInterest(id: string) {
    if (this.sportsInterest.includes(id)) {
      return true;
    }
    return false;
  }

  onSave() {
    this.dialogRef.close(this.sportsInterest);
  }

  onClose() {
    this.dialogRef.close();
  }
}
