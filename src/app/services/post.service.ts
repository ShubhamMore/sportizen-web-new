import { Injectable } from '@angular/core';
import { HttpService } from './shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PostModel } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private _onScreenPostId: string;
  private _postList: PostModel[];

  constructor(private httpService: HttpService) {}

  get onScreenPostId(): string {
    return this._onScreenPostId;
  }
  set onScreenPostId(onScreenPostId: string) {
    this._onScreenPostId = onScreenPostId;
  }

  getPosts() {
    const data = { api: 'getPosts', data: {} };
    return this.httpService.httpPost(data).pipe(
      map((posts: PostModel[]) => {
        return posts;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  get postList() {
    return this._postList;
  }

  set postList(postList: PostModel[]) {
    this._postList = postList;
  }

  getMyPosts() {
    const data = { api: 'getMyPosts', data: {} };
    return this.httpService.httpPost(data).pipe(
      map((posts: PostModel[]) => {
        return posts;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getUserPosts(sportizenUser: string) {
    const data = { api: 'getUserPosts', data: { sportizenUser } };
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
    let data = { api: 'createPost', data: post };
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
    let data = { api: 'sharePost', data: sharedPost };
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
    let data = { api: 'updatePost', data: post };
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
