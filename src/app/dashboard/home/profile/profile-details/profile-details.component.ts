import { ImageModelComponent } from './../image-model/image-model.component';
import { PostGalleryService } from './../../../../services/post-gallery.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageCroperComponent } from './../image-croper/image-croper.component';
import { ConnectionService } from './../../../../services/connection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfileModel } from './../../../../models/user-profile.model';
import { DashboardSideDrawerService } from './../../../../services/dashboard-side-drawer.service';
import { UserProfileService } from './../../../../services/user-profile.service';

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
  userProfile: UserProfileModel;
  invalidImage: boolean;
  imagePreview: string;
  profileImagePreview: string;
  coverImagePreview: string;
  profileImage: File;
  coverImage: File;
  storyEdit: boolean;
  story: string;
  followers: Connection[];
  followings: Connection[];
  gallery: any[];

  constructor(
    private userProfileService: UserProfileService,
    private dashboardSideDrawerService: DashboardSideDrawerService,
    private postGalleryService: PostGalleryService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private connectionService: ConnectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.storyEdit = false;
    this.userProfileService.getProfile().subscribe((userProfile: UserProfileModel) => {
      if (userProfile) {
        this.userProfile = userProfile;

        // this.dashboardSideDrawerService.close();

        if (!this.userProfile.story) {
          this.storyEdit = true;
        }

        this.profileImagePreview = this.userProfile.userImageURL;
        this.coverImagePreview = this.userProfile.userCoverImageURL;
        this.gallery = [];
        this.followers = [];
        this.followings = [];

        this.getGallery();
        this.getFollowers();
        this.getFollowings();

        this.loading = false;
      }
    });
  }

  viewProfile(id: string) {
    if (id === this.userProfile.sportizenId) {
      this.router.navigate(['./../../', 'profile'], { relativeTo: this.route });
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

  getGallery() {
    this.postGalleryService.getMyPostGallery(6).subscribe(
      (gallery: any[]) => {
        this.gallery = gallery;
      },
      (error: any) => {}
    );
  }

  getFollowers() {
    this.userProfileService.getMyFollowers().subscribe(
      (followers: Connection[]) => {
        this.followers = followers;
      },
      (error: any) => {}
    );
  }

  getFollowings() {
    this.userProfileService.getMyFollowings().subscribe(
      (followings: Connection[]) => {
        this.followings = followings;
      },
      (error: any) => {}
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

  onImagePicked(event: Event, isCoverPic: boolean): any {
    this.invalidImage = false;
    const files = (event.target as HTMLInputElement).files;
    const imgExt: string[] = ['jpg', 'png'];
    let ext: string;
    const n: number = files.length;
    for (let i = 0; i < n; i++) {
      ext = files[i].name.substring(files[i].name.lastIndexOf('.') + 1).toLowerCase();
      if (!(imgExt.indexOf(ext) !== -1)) {
        return (this.invalidImage = true);
      }
    }
    this.invalidImage = false;
    for (let i = 0; i < n; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        if (!isCoverPic) {
          const dialogRef = this.dialog.open(ImageCroperComponent, {
            data: {
              image: this.imagePreview,
              customSavedBtnName: 'Save',
            },
            maxHeight: '90vh',
          });

          dialogRef.afterClosed().subscribe((data: any) => {
            if (data) {
              this.saveCroppedProfileImage(data);
            } else {
              this.imagePreview = null;
            }
          });
        } else {
          const dialogRef = this.dialog.open(ImageCroperComponent, {
            data: {
              image: this.imagePreview,
              customSavedBtnName: 'Save',
              customAspectRatio: 3,
            },
            maxHeight: '90vh',
          });

          dialogRef.afterClosed().subscribe((data: any) => {
            if (data) {
              this.saveCroppedCoverImage(data);
            } else {
              this.imagePreview = null;
            }
          });
        }
      };
      reader.readAsDataURL(files[i]);
    }
  }

  editProfile() {
    this.router.navigate(['./edit'], { relativeTo: this.route });
  }

  saveCroppedProfileImage(e: any) {
    this.profileImagePreview = e;
    this.imagePreview = null;
    this.profileImage = this.dataURLtoFile(
      this.profileImagePreview as string,
      this.userProfile.email.split('@')[0]
    );

    const profile = new FormData();
    if (this.profileImage) {
      profile.append('_id', this.userProfile._id);
      profile.append('profileImage', this.profileImage);
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

  saveCroppedCoverImage(e: any) {
    this.coverImagePreview = e;
    this.imagePreview = null;
    this.coverImage = this.dataURLtoFile(
      this.coverImagePreview as string,
      this.userProfile.email.split('@')[0]
    );

    const profile = new FormData();

    if (this.coverImage) {
      profile.append('_id', this.userProfile._id);
      profile.append('coverImage', this.coverImage);
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

  dataURLtoFile(dataURL: string, filename: string) {
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
}
