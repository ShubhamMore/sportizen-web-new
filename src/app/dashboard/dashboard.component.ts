import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading: boolean;

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.userProfileService.setProfile(null);
  }
}
