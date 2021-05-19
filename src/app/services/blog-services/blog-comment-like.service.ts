import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogCommentLikeService {
  constructor(private httpService: HttpService) {}

  getBlogCommentLikes(blog: string, comment: string, limit?: number, skip?: number) {
    const data = { api: `getBlogCommentLikes`, data: { blog, comment, limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  likeBlogComment(blog: string, comment: string) {
    const data = { api: `likeBlogComment`, data: { blog, comment } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  unlikeBlogComment(blog: string, comment: string) {
    const data = { api: `unlikeBlogComment`, data: { blog, comment } };
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
