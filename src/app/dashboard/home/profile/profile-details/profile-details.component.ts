import { ImageModelComponent } from '../../../../image/image-model/image-model.component';
import { PostGalleryService } from './../../../../services/post-gallery.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageCroperComponent } from '../../../../image/image-croper/image-croper.component';
import { ConnectionService } from './../../../../services/connection.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfileModel } from './../../../../models/user-profile.model';
import { DashboardSideDrawerService } from './../../../../services/dashboard-side-drawer.service';
import { UserProfileService } from './../../../../services/user-profile.service';
import { Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { CompressImageService } from './../../../../services/shared-services/compress-image.service';
import { ConnectionStatus } from 'src/app/enums/connectionStatus';

interface Connection {
  name: string;
  email: string;
  userImageURL: string;
  sportizenId: string;
  mutuleConnections?: string;
  connectionStatus?: string;
}

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {
  loading: boolean;

  userProfileId: string;
  userProfile: UserProfileModel;

  connectionStatus: string;

  profileImagePreview: string;
  coverImagePreview: string;
  invalidImage: boolean;

  storyEdit: boolean;
  story: string;

  followers: Connection[];
  followings: Connection[];
  gallery: any[];

  sportizenId: string;

  constructor(
    private userProfileService: UserProfileService,
    private dashboardSideDrawerService: DashboardSideDrawerService,
    private postGalleryService: PostGalleryService,
    private compressImageService: CompressImageService,
    private snackBar: MatSnackBar,
    private titleService: Title,
    public dialog: MatDialog,
    private connectionService: ConnectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.storyEdit = false;

    this.gallery = [];
    this.followers = [];
    this.followings = [];

    this.titleService.setTitle('SPORTIZEN | Profile');

    this.userProfileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.sportizenId = sportizenId;

      this.route.params.subscribe((param: Params) => {
        const userProfileId = param.id;

        let userProfileSubscription: any;
        if (userProfileId) {
          this.userProfileId = userProfileId;
          userProfileSubscription = this.userProfileService.getUserProfile(userProfileId);
        } else {
          userProfileSubscription = this.userProfileService.getProfile();
        }

        userProfileSubscription.subscribe((userProfile: UserProfileModel) => {
          if (userProfile) {
            this.userProfile = userProfile;

            // this.dashboardSideDrawerService.close();

            if (!userProfileId && !this.userProfile.story) {
              this.storyEdit = true;
            }

            this.profileImagePreview = this.userProfile.userImageURL;
            this.coverImagePreview = this.userProfile.userCoverImageURL;

            this.getGallery(userProfileId);
            this.getFollowers(userProfileId);
            this.getFollowings(userProfileId);

            this.loading = false;
          } else {
            this.router.navigate(['./../'], { relativeTo: this.route });
          }
        });
      });
    });
  }

  viewProfile(id: string) {
    if (id === this.userProfile.sportizenId) {
      this.router.navigate(['./../', 'profile'], { relativeTo: this.route });
    } else {
      this.connectionService.searchedSportizenId = id;
      this.router.navigate(['./../../', 'profile', id], { relativeTo: this.route });
    }
  }

  openImageModel(image: any) {
    const dialogRef = this.dialog.open(ImageModelComponent, {
      data: { image },
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  getGallery(userProfileId: string) {
    let postGallerySubscription: any;

    if (userProfileId) {
      postGallerySubscription = this.postGalleryService.getUserPostGallery(userProfileId, 6);
    } else {
      postGallerySubscription = this.postGalleryService.getMyPostGallery(6);
    }

    postGallerySubscription.subscribe(
      (gallery: any[]) => {
        this.gallery = gallery;
      },
      (error: any) => {}
    );
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

  setConnectionStatus(connectionStatus: any) {
    if (connectionStatus === ConnectionStatus.following) {
      this.connectionStatus = ConnectionStatus.following;
    } else if (connectionStatus === ConnectionStatus.pending) {
      this.connectionStatus = ConnectionStatus.pending;
    } else {
      this.connectionStatus = 'follow';
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

  editProfile() {
    this.router.navigate(['./edit'], { relativeTo: this.route });
  }

  editStory() {
    this.story = this.userProfile.story;
    this.storyEdit = true;
  }

  saveStory() {
    if (this.story) {
      const profile: any = { _id: this.userProfile._id, story: this.story };

      this.userProfileService.saveUserStory(profile).subscribe(
        (updatedUserProfile: UserProfileModel) => {
          this.userProfileService.setProfile(updatedUserProfile);

          this.snackBar.open('Story Updated Successfully', null, {
            duration: 2000,
            panelClass: ['success-snackbar'],
          });
          this.storyEdit = false;
        },
        (error: any) => {
          this.snackBar.open(error, null, {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
        }
      );
    } else {
      this.snackBar.open('Story id Required', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  onImagePicked(event: Event, isCoverPic: boolean): any {
    this.invalidImage = false;

    const files = (event.target as HTMLInputElement).files;

    const imgExt: string[] = ['jpg', 'jpeg', 'png'];

    let ext: string;
    const n: number = files.length;

    for (let i = 0; i < n; i++) {
      ext = files[i].name.substring(files[i].name.lastIndexOf('.') + 1).toLowerCase();
      if (!(imgExt.indexOf(ext) !== -1)) {
        this.invalidImage = true;
        continue;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const imagePreview = reader.result as string;

        const dialogRef = this.dialog.open(ImageCroperComponent, {
          data: {
            image: imagePreview,
            customSavedBtnName: 'Save',
            customAspectRatio: !isCoverPic ? 1 : 3,
          },
          maxHeight: '90vh',
        });

        dialogRef.afterClosed().subscribe((data: any) => {
          if (data) {
            this.compressFile(data, isCoverPic);
          }
        });
      };

      reader.readAsDataURL(files[i]);
    }
  }

  private compressFile(imagePreview: any, isCoverImage: boolean) {
    if (isCoverImage) {
      this.coverImagePreview = imagePreview;
    } else {
      this.profileImagePreview = imagePreview;
    }

    const imageFile = this.dataURLtoFile(
      imagePreview as string,
      this.userProfile.email.split('@')[0]
    );

    this.compressImageService
      .compress(imageFile)
      .pipe(take(1))
      .subscribe((compressedImage: any) => {
        if (isCoverImage) {
          this.saveCoverImage(compressedImage);
        } else {
          this.saveProfileImage(compressedImage);
        }
      });
  }

  private dataURLtoFile(dataURL: string, filename: string) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  private saveProfileImage(profileImage: File) {
    const profile = new FormData();
    if (profileImage) {
      profile.append('_id', this.userProfile._id);
      profile.append('profileImage', profileImage);
      this.userProfileService.saveProfileImage(profile).subscribe(
        (updatedUserProfile: UserProfileModel) => {
          this.userProfileService.setProfile(updatedUserProfile);

          this.snackBar.open('Profile Photo Updated Successfully', null, {
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

  private saveCoverImage(coverImage: File) {
    if (coverImage) {
      const profile = new FormData();

      profile.append('_id', this.userProfile._id);
      profile.append('coverImage', coverImage);

      this.userProfileService.saveCoverImage(profile).subscribe(
        (updatedUserProfile: UserProfileModel) => {
          this.userProfileService.setProfile(updatedUserProfile);
          this.snackBar.open('Cover Photo Updated Successfully', null, {
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
}
