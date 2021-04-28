import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { UserProfileModel } from 'src/app/models/user-profile.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading: boolean;

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.loading = true;

    this.userProfileService.getMyProfile().subscribe(
      (userProfile: UserProfileModel) => {
        if (userProfile) {
          this.userProfileService.setProfile(userProfile);

          // if (!userProfile.profileCompleted) {
          //   this.router.navigate(['/dashboard/profile/edit'], { relativeTo: this.route });
          // }

          this.loading = false;
        }
      },
      (error: any) => {
        // this.router.navigate(['../'], { relativeTo: this.route });
      }
    );
  }

  ngOnDestroy() {
    this.userProfileService.setProfile(null);
  }
}
