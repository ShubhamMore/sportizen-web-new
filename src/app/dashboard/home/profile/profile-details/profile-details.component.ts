import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfileModel } from './../../../../models/user-profile.model';
import { DashboardSideDrawerService } from './../../../../services/dashboard-side-drawer.service';
import { UserProfileService } from './../../../../services/user-profile.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {
  userProfile: UserProfileModel;
  invalidImage: boolean;
  imagePreview: string;
  profilePicCropping: boolean;
  coverPicCropping: boolean;
  profileImagePreview: string;
  coverImagePreview: string;
  profileImage: File;
  coverImage: File;
  storyEdit: boolean;
  story: string;

  constructor(
    private userProfileService: UserProfileService,
    private dashboardSideDrawerService: DashboardSideDrawerService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.storyEdit = false;
    this.dashboardSideDrawerService.close();
    this.userProfile = this.userProfileService.getProfile();
    this.profileImagePreview = this.userProfile.userImageURL;
    this.coverImagePreview = this.userProfile.userCoverImageURL;
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
        if (isCoverPic) {
          this.coverPicCropping = true;
        } else {
          this.profilePicCropping = true;
        }
      };
      reader.readAsDataURL(files[i]);
    }
  }

  editProfile() {
    this.router.navigate(['./edit'], { relativeTo: this.route });
  }

  closeImageCropping() {
    this.imagePreview = null;
    this.profilePicCropping = false;
    this.coverPicCropping = false;
  }

  saveCroppedProfileImage(e: any) {
    this.profileImagePreview = e;
    this.closeImageCropping();
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
          this._snackBar.open('Profile Photo Updated Successfully', null, {
            duration: 2000,
          });
        },
        (error: any) => {}
      );
    }
  }

  saveCroppedCoverImage(e: any) {
    this.coverImagePreview = e;
    this.closeImageCropping();
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
          this._snackBar.open('Cover Photo Updated Successfully', null, {
            duration: 2000,
          });
        },
        (error: any) => {}
      );
    }
  }
  editStory() {
    this.story = this.userProfile.story;
    this.storyEdit = true;
  }

  saveStory() {
    const profile: any = { _id: this.userProfile._id, story: this.story };
    this.userProfileService.saveUserStory(profile).subscribe(
      (updatedUserProfile: UserProfileModel) => {
        this.userProfileService.setStory(this.story);
        this._snackBar.open('Intro Section Updated Successfully', null, {
          duration: 2000,
        });
      },
      (error: any) => {}
    );
    this.storyEdit = false;
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
