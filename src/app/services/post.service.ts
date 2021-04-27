import { Injectable } from '@angular/core';
import { HttpService } from './shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PostModel } from './../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private _onScreenPostId: string;
  private _postList: PostModel[] = [];
  private _userProfileId: string;

  get onScreenPostId(): string {
    return this._onScreenPostId;
  }
  set onScreenPostId(userProfileId: string) {
    this._userProfileId = userProfileId;
  }

  get postList() {
    return this._postList;
  }

  set postList(postList: PostModel[]) {
    this._postList.push(...postList);
  }

  unsetPostList() {
    this._postList = [];
  }

  get userProfileId(): string {
    return this._onScreenPostId;
  }

  set userProfileId(userProfileId: string) {
    this._userProfileId = userProfileId;
  }

  constructor(private httpService: HttpService) {}

  getPosts(limit?: number, skip?: number) {
    const data = { api: 'getPosts', data: { limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((posts: PostModel[]) => {
        return posts;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getMyPosts(limit?: number, skip?: number) {
    const data = { api: 'getMyPosts', data: { limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((posts: PostModel[]) => {
        return posts;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getUserPosts(sportizenUser: string, limit?: number, skip?: number) {
    const data = { api: 'getUserPosts', data: { sportizenUser, limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((posts: PostModel[]) => {
        return posts;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getPost(id: string) {
    const data = { api: 'getPost', data: { id } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  createPost(post: FormData) {
    const data = { api: 'createPost', data: post };
    return this.httpService.httpPost(data).pipe(
      map((resPost: PostModel) => {
        return resPost;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  sharePost(sharedPost: { post: string; description: string; visibility: string }) {
    const data = { api: 'sharePost', data: sharedPost };
    return this.httpService.httpPost(data).pipe(
      map((resPost: PostModel) => {
        return resPost;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  updatePost(post: FormData) {
    const data = { api: 'updatePost', data: post };
    return this.httpService.httpPost(data).pipe(
      map((resPost: PostModel) => {
        return resPost;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  deletePost(id: string) {
    const data = { api: `deletePost`, data: { id } };
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
