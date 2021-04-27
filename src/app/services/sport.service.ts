import { Injectable } from '@angular/core';
import { SportModel } from './../models/sport.model';

@Injectable({ providedIn: 'root' })
export class SportService {
  sport: SportModel[] = [
    new SportModel('0', 'Cricket', ''),
    new SportModel('1', 'Football', ''),
    new SportModel('2', 'Hockey', ''),
    new SportModel('3', 'Kabaddi', ''),
    new SportModel('4', 'Volleyball', ''),
    new SportModel('5', 'Table tennis', ''),
    new SportModel('6', 'Tennis', ''),
    new SportModel('7', 'Basketball', ''),
    new SportModel('8', 'Wrestling', ''),
    new SportModel('9', 'Powerlifting', ''),
    new SportModel('10', 'Taekwondo', ''),
    new SportModel('11', 'Cycling', ''),
    new SportModel('12', 'Ludo', ''),
    new SportModel('13', 'Handball', ''),
    new SportModel('14', 'Athletics', ''),
    new SportModel('15', 'Gymnastics', ''),
    new SportModel('16', 'Chess', ''),
    new SportModel('17', 'Carrom', ''),
    new SportModel('18', 'Throwball', ''),
    new SportModel('19', 'Polo', ''),
    new SportModel('20', 'Kho Kho', ''),
  ];

  getSports() {
    return [...this.sport];
  }

  getSport(id: string) {
    return this.sport.find((sport) => sport._id === id);
  }
}
