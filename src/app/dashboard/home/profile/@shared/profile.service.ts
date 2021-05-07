import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { UserProfileModel } from './../../../../models/user-profile.model';

@Injectable()
export class ProfileService {
  private userProfile = new BehaviorSubject<UserProfileModel>(null);

  setProfile(userProfile: UserProfileModel) {
    this.userProfile.next(userProfile);
  }

  getProfile() {
    return this.userProfile;
  }

  getUserSportizenId() {
    return this.userProfile.pipe(
      map((userProfile: UserProfileModel) => {
        if (userProfile) {
          return userProfile.sportizenId;
        }
        return null;
      })
    );
  }

  getUserStory() {
    return this.userProfile.pipe(
      map((userProfile: UserProfileModel) => {
        if (userProfile) {
          return userProfile.story;
        }
        return null;
      })
    );
  }

  constructor() {}
}
