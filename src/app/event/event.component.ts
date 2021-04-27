import { HomeService } from './../services/home.service';
import { Component, OnInit } from '@angular/core';
import { UserProfileService } from './../services/user-profile.service';
import { UserProfileModel } from './../models/user-profile.model';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  userProfile: UserProfileModel;

  constructor(private homeService: HomeService, private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.userProfileService.getProfile().subscribe((userProfile: UserProfileModel) => {
      if (userProfile) {
        this.userProfile = userProfile;
        this.homeService.setRoute('Events');
      }
    });
  }
}
