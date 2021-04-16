import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from 'events';
import { Subscription } from 'rxjs';
import { AuthService } from './../../../authentication/auth/auth-service/auth.service';
import { UserProfileModel } from './../../../models/user-profile.model';
import { DashboardSideDrawerService } from './../../../services/dashboard-side-drawer.service';
import { UserProfileService } from './../../../services/user-profile.service';

@Component({
  selector: 'app-dashboard-side-nav',
  templateUrl: './dashboard-side-nav.component.html',
  styleUrls: ['./dashboard-side-nav.component.scss'],
})
export class DashboardSideNavComponent implements OnInit, OnDestroy {
  loading: boolean;
  userProfile: UserProfileModel;
  profileImagePreview: string;
  coverImagePreview: string;

  private userProfileSubscription: Subscription;
  constructor(
    private userProfileService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dashboardSideDrawerService: DashboardSideDrawerService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const id = JSON.parse(localStorage.getItem('userData'))._id;
    this.userProfileService.getMyProfile().subscribe(
      (res: any) => {
        this.userProfile = res;
        this.loading = false;
        this.userProfileService.setProfile(this.userProfile);
        if (this.userProfile.profileCompleted === '0') {
          this.router.navigate(['/edit-profile'], { relativeTo: this.route });
        }

        this.userProfile = this.userProfile;
      },
      (error: any) => {}
    );

    this.userProfileSubscription = this.userProfileService
      .getProfileSubject()
      .subscribe((profile) => {
        this.userProfile = profile;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  navigateTo(path: any) {
    this.router.navigate([path], { relativeTo: this.route });
    // this.dashboardSideDrawerService.close();
  }

  ngOnDestroy() {
    this.userProfileSubscription.unsubscribe();
  }
}
