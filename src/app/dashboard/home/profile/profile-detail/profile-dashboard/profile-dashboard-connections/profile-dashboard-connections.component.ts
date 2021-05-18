import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/services/user-services/user-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionService } from '../../../../../../services/user-services/connection.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserConnection } from './../../../../user-connection/user-connection.component';

@Component({
  selector: 'app-profile-dashboard-connections',
  templateUrl: './profile-dashboard-connections.component.html',
  styleUrls: ['./../@shared/profile.scss', './profile-dashboard-connections.component.scss'],
})
export class ProfileDashboardConnectionsComponent implements OnInit {
  userId: string;
  noOfFollowers: number;
  noOfFollowings: number;
  followers: UserConnection[];
  followings: UserConnection[];
  sportizenId: string;

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

    this.userProfileService
      .getUserSportizenId()
      .pipe(first())
      .subscribe((sportizenId: string) => {
        this.sportizenId = sportizenId;
      });
  }

  viewFollowers() {
    this.router.navigate(['./followers'], { relativeTo: this.route });
  }

  viewFollowings() {
    this.router.navigate(['./followings'], { relativeTo: this.route });
  }

  getFollowers(userProfileId: string) {
    let followerSubscription: any;

    if (userProfileId) {
      followerSubscription = this.userProfileService.getUserFollowers(userProfileId, 4);
    } else {
      followerSubscription = this.userProfileService.getMyFollowers(4);
    }

    followerSubscription.subscribe(
      (followersData: { connectionCount: number; connections: UserConnection[] }) => {
        this.noOfFollowers = followersData.connectionCount;
        this.followers = followersData.connections;
      },
      (error: any) => {}
    );
  }

  getFollowings(userProfileId: string) {
    let followingSubscription: any;

    if (userProfileId) {
      followingSubscription = this.userProfileService.getUserFollowings(userProfileId, 4);
    } else {
      followingSubscription = this.userProfileService.getMyFollowings(4);
    }

    followingSubscription.subscribe(
      (followingsData: { connectionCount: number; connections: UserConnection[] }) => {
        this.noOfFollowings = followingsData.connectionCount;
        this.followings = followingsData.connections;
      },
      (error: any) => {}
    );
  }

  followUser(name: string, sportizenId: string, i: number) {
    this.connectionService.sendConnectionRequest(sportizenId).subscribe(
      (res: any) => {
        if (!this.userId) {
          this.followings[i].connectionStatus = res.status;
          this.noOfFollowings += 1;
        } else {
          const followerIndex = this.followers.findIndex(
            (follower: UserConnection) => follower.sportizenId === sportizenId
          );

          if (followerIndex >= 0) {
            this.followers[followerIndex].connectionStatus = res.status;
          }

          const followingIndex = this.followings.findIndex(
            (following: UserConnection) => following.sportizenId === sportizenId
          );

          if (followingIndex >= 0) {
            this.followings[followingIndex].connectionStatus = res.status;
          }
        }

        this.snackBar.open(`You are now following ${name}`, null, {
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

  unfollowUser(name: string, sportizenId: string, i: number) {
    this.connectionService.unfollowConnection(sportizenId).subscribe(
      (res: any) => {
        // this.userProfileService.setConnectionCount(true, false);

        if (!this.userId) {
          this.followings[i].connectionStatus = 'not-connected';
          this.noOfFollowings -= 1;
        } else {
          const followerIndex = this.followers.findIndex(
            (follower: UserConnection) => follower.sportizenId === sportizenId
          );

          if (followerIndex >= 0) {
            this.followers[followerIndex].connectionStatus = 'not-connected';
          }

          const followingIndex = this.followings.findIndex(
            (following: UserConnection) => following.sportizenId === sportizenId
          );

          if (followingIndex >= 0) {
            this.followings[followingIndex].connectionStatus = 'not-connected';
          }
        }

        this.snackBar.open(`You unfollowed ${name}`, null, {
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
        this.followers.splice(i, 1);
        this.noOfFollowers -= 1;

        // this.userProfileService.setConnectionCount(false, false);
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
