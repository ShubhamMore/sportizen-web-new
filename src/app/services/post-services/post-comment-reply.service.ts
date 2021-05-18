import { Injectable } from '@angular/core';
import { HttpService } from './../shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostCommentReplyService {
  constructor(private httpService: HttpService) {}

  getPostReplyComments(post: string, comment: string, limit?: number, skip?: number) {
    const data = { api: `getPostReplyComments`, data: { post, comment, limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  addPostCommentReply(post: string, comment: string, replyComment: string) {
    const data = { api: `addPostCommentReply`, data: { post, comment, replyComment } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  deletePostCommentReply(id: string) {
    const data = { api: `deletePostCommentReply`, data: { id } };
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
