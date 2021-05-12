import { HomeService } from './../services/home.service';
import { Component, OnInit } from '@angular/core';
import { UserProfileService } from './../services/user-profile.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  isSportizenId: boolean;

  constructor(private homeService: HomeService, private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.isSportizenId = true;

    this.userProfileService
      .getUserSportizenId()
      .pipe(first())
      .subscribe((sportizenId: string) => {
        this.isSportizenId = !!sportizenId;

        if (sportizenId) {
          this.homeService.setRoute('Events');
        }
      });
  }
}
