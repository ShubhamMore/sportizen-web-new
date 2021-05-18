import { Injectable } from '@angular/core';
import { HttpService } from './../shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostCommentLikeService {
  constructor(private httpService: HttpService) {}

  getPostCommentLikes(post: string, comment: string, limit?: number, skip?: number) {
    const data = { api: `getPostCommentLikes`, data: { post, comment, limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  likePostComment(post: string, comment: string) {
    const data = { api: `likePostComment`, data: { post, comment } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  unlikePostComment(post: string, comment: string) {
    const data = { api: `unlikePostComment`, data: { post, comment } };
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
