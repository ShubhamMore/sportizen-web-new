import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogLikeService {
  constructor(private httpService: HttpService) {}

  getBlogLikes(blog: string, limit?: number, skip?: number) {
    const data = { api: `getBlogLikes`, data: { blog, limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  likeBlog(blog: string) {
    const data = { api: `likeBlog`, data: { blog } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  unlikeBlog(blog: string) {
    const data = { api: `unlikeBlog`, data: { blog } };
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
