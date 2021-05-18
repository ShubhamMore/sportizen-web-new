import { Injectable } from '@angular/core';
import { HttpService } from './../shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostCommentReplyLikeService {
  constructor(private httpService: HttpService) {}

  getPostReplyCommentLikes(
    post: string,
    comment: string,
    replyComment: string,
    limit?: number,
    skip?: number
  ) {
    const data = {
      api: `getPostReplyCommentLikes`,
      data: { post, comment, replyComment, limit, skip },
    };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  likePostReplyComment(post: string, comment: string, replyComment: string) {
    const data = { api: `likePostReplyComment`, data: { post, comment, replyComment } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  unlikePostReplyComment(post: string, comment: string, replyComment: string) {
    const data = { api: `unlikePostReplyComment`, data: { post, comment, replyComment } };
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
