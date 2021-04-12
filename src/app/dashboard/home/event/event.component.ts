import { HomeService } from './../../../services/home.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.setRoute('Events');
  }
}
