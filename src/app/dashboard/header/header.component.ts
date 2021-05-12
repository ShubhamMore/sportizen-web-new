import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../authentication/auth/auth-service/auth.service';
import { environment } from './../../../environments/environment.prod';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfileModel } from './../../models/user-profile.model';
import { DashboardSideDrawerService } from './../../services/dashboard-side-drawer.service';
import { UserProfileService } from './../../services/user-profile.service';
import { User } from './../../authentication/auth/auth-model/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('headerName', [
      state(
        'in',
        style({
          opacity: 1,
          width: 100,
        })
      ),

      transition('void => *', [
        style({
          opacity: 0,
          width: 0,
        }),
        animate(300),
      ]),

      transition('* => void', [
        animate(
          300,
          style({
            width: 0,
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User;
  logo: string;
  title: string;

  userProfile: UserProfileModel;
  showLogo: boolean;

  constructor(
    private dashboardSideDrawerService: DashboardSideDrawerService,
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.showLogo = true;

    this.logo = environment.logo;
    this.title = environment.title;
    this.authService.getUser().subscribe((user: User) => {
      this.user = user;
    });

    this.userProfileService.getProfile().subscribe((profile: UserProfileModel) => {
      this.userProfile = profile;
    });
  }

  goToHome() {
    this.router.navigate(['/dashboard'], { relativeTo: this.route });
  }

  onLogout() {
    this.authService.logout();
  }

  toggleDashboardSideDrawer() {
    this.dashboardSideDrawerService.toggle();
  }

  isDashboardDrawerOpened() {
    return this.dashboardSideDrawerService.isDrawerOpened();
  }

  toggleSearchBar(isSearchBarOpen: any) {
    this.showLogo = isSearchBarOpen;
  }

  ngOnDestroy() {}
}
