import { Injectable } from '@angular/core';
import { HttpService } from './shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostCommentLikeService {
  constructor(private httpService: HttpService) {}

  getCommentLikes(post: string, comment: string) {
    const data = { api: `getCommentLikes`, data: { post, comment } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  likeComment(post: string, comment: string) {
    const data = { api: `likeComment`, data: { post, comment } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  unlikeComment(post: string, comment: string) {
    const data = { api: `unlikeComment`, data: { post, comment } };
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
