import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProfileService } from '../../../@shared/profile.service';
import { UserProfileModel } from '../../../../../../models/user-profile.model';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-dashboard-story',
  templateUrl: './profile-dashboard-story.component.html',
  styleUrls: ['./../@shared/profile.scss', './profile-dashboard-story.component.scss'],
})
export class ProfileDashboardStoryComponent implements OnInit {
  userId: string;
  storyEdit: boolean;
  story: string;

  constructor(
    private profileService: ProfileService,
    private userProfileService: UserProfileService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param: Params) => {
      this.userId = param.id;
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.storyEdit = false;

    this.profileService.getUserStory().subscribe((story: string) => {
      this.story = story;

      if (!this.userId && !this.story) {
        this.storyEdit = true;
      }
    });
  }

  editStory() {
    this.storyEdit = true;
  }

  saveStory() {
    if (this.story) {
      const profile: any = { _id: this.userId, story: this.story };

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
}
