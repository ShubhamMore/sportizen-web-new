import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionService } from '../../../../../../services/connection.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

interface Connection {
  name: string;
  email: string;
  userImageURL: string;
  sportizenId: string;
  mutuleConnections?: string;
  connectionStatus?: string;
}

@Component({
  selector: 'app-profile-dashboard-connections',
  templateUrl: './profile-dashboard-connections.component.html',
  styleUrls: ['./../@shared/profile.scss', './profile-dashboard-connections.component.scss'],
})
export class ProfileDashboardConnectionsComponent implements OnInit {
  userId: string;
  followers: Connection[];
  followings: Connection[];

  constructor(
    private userProfileService: UserProfileService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private connectionService: ConnectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param: Params) => {
      this.userId = param.id;
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.followers = [];
    this.followings = [];

    this.getFollowers(this.userId);
    this.getFollowings(this.userId);
  }

  getFollowers(userProfileId: string) {
    let followerSubscription: any;

    if (userProfileId) {
      followerSubscription = this.userProfileService.getUserFollowers(userProfileId);
    } else {
      followerSubscription = this.userProfileService.getMyFollowers();
    }

    followerSubscription.subscribe(
      (followers: Connection[]) => {
        this.followers = followers;
      },
      (error: any) => {}
    );
  }

  getFollowings(userProfileId: string) {
    let followingSubscription: any;

    if (userProfileId) {
      followingSubscription = this.userProfileService.getUserFollowings(userProfileId);
    } else {
      followingSubscription = this.userProfileService.getMyFollowings();
    }

    followingSubscription.subscribe(
      (followings: Connection[]) => {
        this.followings = followings;
      },
      (error: any) => {}
    );
  }

  viewProfile(id: string) {
    if (id === this.userId) {
      this.router.navigate(['./../', 'profile'], { relativeTo: this.route });
    } else {
      this.connectionService.searchedSportizenId = id;
      this.router.navigate(['./../../', 'profile', id], { relativeTo: this.route });
    }
  }

  unfollow(name: string, sportizenId: string, i: number) {
    this.connectionService.unfollowConnection(sportizenId).subscribe(
      (res: any) => {
        this.followers.splice(i, 1);
        this.snackBar.open(`You unfollowed  ${name}`, null, {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
      },
      (error: any) => {
        this.snackBar.open(error, null, {
          duration: 2000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }

  remove(name: string, sportizenId: string, i: number) {
    this.connectionService.removeFollowerConnection(sportizenId).subscribe(
      (res: any) => {
        this.followings.splice(i, 1);
        this.snackBar.open(`You Removed ${name}`, null, {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
      },
      (error: any) => {
        this.snackBar.open(error, null, {
          duration: 2000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }
}
