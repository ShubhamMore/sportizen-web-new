import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.userProfileSubscription = this.userProfileService.getProfile().subscribe((profile) => {
      this.userProfile = profile;
      this.loading = false;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  joinedEvents() {
    this.router.navigate(['/dashboard/event'], {
      relativeTo: this.route,
      queryParams: { type: 'joined' },
    });
  }

  manageEvents() {
    this.router.navigate(['/dashboard/event'], {
      relativeTo: this.route,
      queryParams: { type: 'manage' },
    });
  }

  navigateTo(path: any) {
    this.router.navigate([path], { relativeTo: this.route });
    // this.dashboardSideDrawerService.close();
  }

  ngOnDestroy() {
    this.userProfileSubscription.unsubscribe();
  }
}
