import { MatDialog } from '@angular/material/dialog';
import { ImageCroperComponent } from '../../../../image/image-croper/image-croper.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfileModel } from './../../../../models/user-profile.model';
import { UserProfileService } from './../../../../services/user-profile.service';
import { Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { CompressImageService } from './../../../../services/shared-services/compress-image.service';
import { ConnectionStatus } from 'src/app/enums/connectionStatus';
import { ProfileService } from './../@shared/profile.service';
import { ConnectionService } from './../../../../services/connection.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
})
export class ProfileDetailComponent implements OnInit, OnDestroy {
  loading: boolean;

  userProfile: UserProfileModel;

  connectionStatus: string;

  profileImagePreview: string;
  coverImagePreview: string;
  invalidImage: boolean;

  userProfileId: string;
  sportizenId: string;

  constructor(
    private profileService: ProfileService,
    private userProfileService: UserProfileService,
    private compressImageService: CompressImageService,
    private connectionService: ConnectionService,
    private snackBar: MatSnackBar,
    private titleService: Title,
    public dialog: MatDialog,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param: Params) => {
      this.userProfileId = param.id;
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.loading = true;

    this.titleService.setTitle('SPORTIZEN | Profile');

    this.userProfileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.sportizenId = sportizenId;

      let userProfileSubscription: any;

      if (this.userProfileId) {
        userProfileSubscription = this.userProfileService.getUserProfile(this.userProfileId);
      } else {
        userProfileSubscription = this.userProfileService.getProfile();
      }

      userProfileSubscription.subscribe((userProfile: UserProfileModel) => {
        if (userProfile) {
          this.userProfile = userProfile;

          if (this.userProfileId) {
            this.setConnectionStatus(userProfile.connection);
          }

          this.profileService.setProfile(userProfile);

          // this.dashboardSideDrawerService.close();

          this.profileImagePreview = this.userProfile.userImageURL;
          this.coverImagePreview = this.userProfile.userCoverImageURL;

          this.loading = false;
        } else {
          this.location.back();
        }
      });
    });
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

  editProfile() {
    this.router.navigate(['./edit'], { relativeTo: this.route });
  }

  followUnfollow() {
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

  ngOnDestroy() {
    this.profileService.setProfile(null);
  }
}
