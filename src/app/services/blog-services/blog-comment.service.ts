import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogCommentService {
  constructor(private httpService: HttpService) {}

  getBlogComments(blog: string, limit?: number, skip?: number) {
    const data = { api: `getBlogComments`, data: { blog, limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  addBlogComment(blog: string, comment: string) {
    const data = { api: `addBlogComment`, data: { blog, comment } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  deleteBlogComment(id: string) {
    const data = { api: `deleteBlogComment`, data: { id } };
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
