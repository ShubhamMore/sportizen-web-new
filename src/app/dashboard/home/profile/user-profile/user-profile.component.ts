import { ImageModelComponent } from '../../../../image/image-model/image-model.component';
import { MatDialog } from '@angular/material/dialog';
import { PostGalleryService } from './../../../../services/post-gallery.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConnectionStatus } from './../../../../enums/connectionStatus';
import { UserProfileModel } from './../../../../models/user-profile.model';
import { ConnectionService } from './../../../../services/connection.service';
import { UserProfileService } from './../../../../services/user-profile.service';
import { Title } from '@angular/platform-browser';
interface Connection {
  name: string;
  email: string;
  userImageURL: string;
  sportizenId: string;
  mutuleConnections?: string;
  connectionStatus?: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  loading: boolean;
  userProfileId: string;
  userProfile: UserProfileModel;
  connectionStatus: string;
  followers: Connection[];
  followings: Connection[];
  gallery: any[];
  sportizenId: string;

  constructor(
    private postGalleryService: PostGalleryService,
    private userProfileService: UserProfileService,
    private connectionService: ConnectionService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute
  ) {
    // tslint:disable-next-line: deprecation
    this.route.params.subscribe((param: Params) => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.loading = true;

    this.titleService.setTitle('SPORTIZEN | Profile');

    this.connectionStatus = '';
    this.gallery = [];
    this.followers = [];
    this.followings = [];

    this.userProfileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.sportizenId = sportizenId;

      this.route.params.subscribe((param: Params) => {
        this.userProfileId = param.id;

        if (this.userProfileId) {
          this.userProfileService
            .getUserProfile(this.userProfileId)
            .subscribe((userProfile: UserProfileModel) => {
              this.titleService.setTitle('SPORTIZEN | Profile | ' + userProfile.name);
              this.userProfile = userProfile;

              this.setConnectionStatus(userProfile.connection);
              this.getGallery();
              this.getFollowers();
              this.getFollowings();

              this.loading = false;
            });
        } else {
          this.router.navigate(['./../'], { relativeTo: this.route });
        }
      });
    });
  }

  viewProfile(id: string) {
    if (id === this.sportizenId) {
      this.router.navigate(['./../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['./../../', 'profile', id], { relativeTo: this.route });
    }
  }

  getGallery() {
    this.postGalleryService.getUserPostGallery(this.userProfile.sportizenId, 6).subscribe(
      (gallery: any[]) => {
        this.gallery = gallery;
      },
      (error: any) => {}
    );
  }

  openImageModel(image: any) {
    const dialogRef = this.dialog.open(ImageModelComponent, {
      data: { image },
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
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
      this.connectionService.unfollowConnection(this.userProfileId).subscribe(
        (res: any) => {
          this.setConnectionStatus(ConnectionStatus.notConnected);
          this.snackBar.open(`You unfollowed  ${this.userProfile.name}`, null, {
            duration: 2000,
          });
        },
        (error: any) => {
          this.snackBar.open(error, null, {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
        }
      );
    } else {
      this.connectionService.sendConnectionRequest(this.userProfileId).subscribe(
        (res: any) => {
          this.setConnectionStatus(res.status);
          this.snackBar.open(`You are now following ${this.userProfile.name}`, null, {
            duration: 2000,
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
}
