import { Injectable } from '@angular/core';
import { HttpService } from './shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostCommentReplyLikeService {
  constructor(private httpService: HttpService) {}

  getReplyCommentLikes(post: string, comment: string, replyComment: string) {
    const data = { api: `getReplyCommentLikes`, data: { post, comment, replyComment } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  likeReplyComment(post: string, comment: string, replyComment: string) {
    const data = { api: `likeReplyComment`, data: { post, comment, replyComment } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  unlikeReplyComment(post: string, comment: string, replyComment: string) {
    const data = { api: `unlikeReplyComment`, data: { post, comment, replyComment } };
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
