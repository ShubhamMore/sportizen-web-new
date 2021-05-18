import { Injectable } from '@angular/core';
import { HttpService } from './../shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { UserProfileModel } from './../../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  // private userFollowers = new BehaviorSubject<number>(0);
  // private userFollowings = new BehaviorSubject<number>(0);
  private userProfile = new BehaviorSubject<UserProfileModel>(null);

  setProfile(userProfile: UserProfileModel) {
    this.userProfile.next(userProfile);
    // this.setUserFollowers(userProfile ? userProfile.followingsCount : 0);
    // this.setUserFollowings(userProfile ? userProfile.followingsCount : 0);
  }

  // private setUserFollowers(followers: number) {
  //   this.userFollowers.next(followers);
  // }

  // private setUserFollowings(folloings: number) {
  //   this.userFollowings.next(folloings);
  // }

  // setFllowing(isFollow: boolean) {
  //   this.userFollowers.subscribe((followings: number) => {
  //     if (followings) {
  //       if (!isFollow) {
  //         followings -= 1;
  //       } else {
  //         followings += 1;
  //       }
  //       this.setUserFollowers(followings);
  //     }
  //   });
  // }

  // setFllower() {
  //   this.getProfile().subscribe((userProfile: any) => {
  //     if (userProfile) {
  // }

  // this.userFollowers.subscribe((followers: number) => {
  //   if (followers) {
  //     followers -= 1;
  //     this.setUserFollowers(followers);
  //   }
  //   });
  // }

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

  // getFollowing() {
  //   return this.userFollowings;
  // }

  // getFollower() {
  //   return this.userFollowers;
  // }

  constructor(private httpService: HttpService) {}

  saveProfile(profile: FormData) {
    const data = { api: 'saveUserProfile', data: profile };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getMyProfile() {
    const data = { api: 'getMyProfile', data: {} };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getMyConnections(limit?: number) {
    const data = { api: 'getMyConnections', data: { limit } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getMyFollowers(limit?: number) {
    const data = { api: 'getMyFollowers', data: { limit } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getMyFollowings(limit?: number) {
    const data = { api: 'getMyFollowings', data: { limit } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getUserFollowers(sportizenId: string, limit?: number) {
    const data = { api: 'getUserFollowers', data: { user: sportizenId, limit } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getUserFollowings(sportizenId: string, limit?: number) {
    const data = { api: 'getUserFollowings', data: { user: sportizenId, limit } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getUserProfile(id: string) {
    const data = { api: 'getUserProfile', data: { sportizenId: id } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  saveProfileImage(profile: FormData) {
    const data = { api: 'saveProfileImage', data: profile };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  saveCoverImage(profile: FormData) {
    const data = { api: 'saveCoverImage', data: profile };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  saveUserStory(profile: any) {
    const data = { api: 'saveUserStory', data: profile };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }
}
