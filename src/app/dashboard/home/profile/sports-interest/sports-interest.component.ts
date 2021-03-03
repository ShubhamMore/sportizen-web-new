import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { SportService } from './../../../../services/sport.service';
import { SportModel } from './../../../../models/sport.model';

@Component({
  selector: 'app-sports-interest',
  templateUrl: './sports-interest.component.html',
  styleUrls: ['./sports-interest.component.scss'],
})
export class SportsInterestComponent implements OnInit {
  @Input() sportsInterest: string[];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<string[]>();

  sports: SportModel[];

  constructor(private sportsService: SportService) {}

  ngOnInit(): void {
    this.sports = this.sportsService.getSports();
  }

  toggleSportsInterest(id: string) {
    console.log(this.sportsInterest.includes(id));
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
    this.save.emit(this.sportsInterest);
  }

  onClose() {
    this.close.emit();
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    const n = byteString.length;
    for (let i = 0; i < n; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }
}
