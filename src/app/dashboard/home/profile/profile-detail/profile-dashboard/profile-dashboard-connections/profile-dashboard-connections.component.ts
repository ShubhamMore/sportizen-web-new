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

    this.userProfileService.getUserSportizenId().subscribe((sportizenId: string) => {
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
      (followers: Connection[]) => {
        this.followers = followers;
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
      (followings: Connection[]) => {
        this.followings = followings;
      },
      (error: any) => {}
    );
  }

  viewProfile(id: string) {
    if (id === this.sportizenId) {
      this.router.navigate(['/dashboard', 'profile'], { relativeTo: this.route });
    } else {
      this.connectionService.searchedSportizenId = id;
      this.router.navigate(['/dashboard', 'profile', id], { relativeTo: this.route });
    }
  }

  followUser(name: string, sportizenId: string) {
    this.connectionService.sendConnectionRequest(sportizenId).subscribe(
      (res: any) => {
        const followerIndex = this.followers.findIndex(
          (follower: Connection) => follower.sportizenId === sportizenId
        );

        if (followerIndex >= 0) {
          this.followers[followerIndex].connectionStatus = res.status;
        }

        const followingIndex = this.followings.findIndex(
          (following: Connection) => following.sportizenId === sportizenId
        );

        if (followingIndex >= 0) {
          this.followings[followingIndex].connectionStatus = res.status;
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

  unfollowUser(name: string, sportizenId: string) {
    this.connectionService.unfollowConnection(sportizenId).subscribe(
      (res: any) => {
        const followerIndex = this.followers.findIndex(
          (follower: Connection) => follower.sportizenId === sportizenId
        );

        if (followerIndex >= 0) {
          this.followers[followerIndex].connectionStatus = 'not-connected';
        }

        const followingIndex = this.followings.findIndex(
          (following: Connection) => following.sportizenId === sportizenId
        );

        if (followingIndex >= 0) {
          this.followings[followingIndex].connectionStatus = 'not-connected';
        }

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