import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './../../../authentication/auth/auth-service/auth.service';
import { UserProfileModel } from './../../../models/user-profile.model';
import { DashboardSideDrawerService } from '../../../services/dashboard-services/dashboard-side-drawer.service';
import { UserProfileService } from './../../../services/user-services/user-profile.service';
import { environment } from './../../../../environments/environment';

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

  screenWidth: number;
  responsiveWidth: number;

  private userProfileSubscription: Subscription;

  constructor(
    private userProfileService: UserProfileService,
    private dashboardSideDrawerService: DashboardSideDrawerService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.screenWidth = window.innerWidth;

    $(window).on('resize', () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    });

    this.responsiveWidth = environment.responsiveScreenWidth;

    this.userProfileSubscription = this.userProfileService.getProfile().subscribe((profile) => {
      this.userProfile = profile;
      this.loading = false;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  navigateTo(path: any) {
    this.router.navigate([path], { relativeTo: this.route });
    this.closeSideNav();
  }

  closeSideNav() {
    if (this.screenWidth <= this.responsiveWidth) {
      this.dashboardSideDrawerService.close();
    }
  }

  ngOnDestroy() {
    this.userProfileSubscription.unsubscribe();
  }
}
