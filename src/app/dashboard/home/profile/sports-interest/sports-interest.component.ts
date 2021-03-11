import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { SportService } from './../../../../services/sport.service';
import { SportModel } from './../../../../models/sport.model';

export interface SportsInterestData {
  sportsInterest: string[];
}
@Component({
  selector: 'app-sports-interest',
  templateUrl: './sports-interest.component.html',
  styleUrls: ['./sports-interest.component.scss'],
})
export class SportsInterestComponent implements OnInit {
  sportsInterest: string[];
  sports: SportModel[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SportsInterestData,
    public dialogRef: MatDialogRef<SportsInterestComponent>,
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
