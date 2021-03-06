import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { ConnectionStatus } from './../../../../enums/connectionStatus';
import { UserProfileModel } from './../../../../models/user-profile.model';
import { ConnectionService } from './../../../../services/connection.service';
import { UserProfileService } from './../../../../services/user-profile.service';

interface Connection {
  name: string;
  email: string;
  userImageURL: string;
  mutuleConnections: string;
  sportizenId: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userProfileId: string;
  userProfile: UserProfileModel;
  loading: boolean;
  connectionStatus: string;
  followers: Connection[];
  followings: Connection[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private userProfileService: UserProfileService,
    private connectionService: ConnectionService,
    private snackBar: MatSnackBar
  ) {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.connectionStatus = '';

    this.userProfileId = this.connectionService.searchedSportizenId;
    this.followers = [];
    this.followings = [];

    if (this.userProfileId) {
      this.userProfileService
        .getUserProfile(this.userProfileId)
        .subscribe((userProfile: UserProfileModel) => {
          this.userProfile = userProfile;
          this.setConnectionStatus(userProfile.connection);
          this.getFollowers();
          this.getFollowings();
          this.loading = false;
        });
    }
  }

  getFollowers() {
    this.userProfileService.getUserFollowers(this.userProfile.sportizenId).subscribe(
      (followers: Connection[]) => {
        this.followers = followers;
      },
      (error: any) => {}
    );
  }

  getFollowings() {
    this.userProfileService.getUserFollowings(this.userProfile.sportizenId).subscribe(
      (followings: Connection[]) => {
        this.followings = followings;
      },
      (error: any) => {}
    );
  }

  setConnectionStatus(connectionStatus: any) {
    if (connectionStatus === ConnectionStatus.following) {
      this.connectionStatus = ConnectionStatus.following;
    } else if (connectionStatus === ConnectionStatus.pending) {
      this.connectionStatus = ConnectionStatus.pending;
    } else {
      this.connectionStatus = 'follow';
    }
  }

  follow() {
    if (this.connectionStatus === ConnectionStatus.following) {
      this.connectionService.unfollowConnection(this.userProfileId).subscribe((res: any) => {
        this.setConnectionStatus(ConnectionStatus.notConnected);
        this.snackBar.open(`You unfollowed  ${this.userProfile.name}`, null, {
          duration: 2000,
        });
      });
    } else {
      this.connectionService.sendConnectionRequest(this.userProfileId).subscribe((res: any) => {
        this.setConnectionStatus(res.status);
        this.snackBar.open(`You are now following ${this.userProfile.name}`, null, {
          duration: 2000,
        });
      });
    }
  }
}
