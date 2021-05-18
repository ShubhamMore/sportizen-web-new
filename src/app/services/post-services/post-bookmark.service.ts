import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostBookmarkService {
  constructor(private httpService: HttpService) {}

  getBookmarkeddPosts(limit?: number, skip?: number) {
    const data = { api: `getBookmarkedPosts`, data: { limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  addPostBookmark(post: string) {
    const data = { api: `addPostBookmark`, data: { post } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  removePostBookmark(post: string) {
    const data = { api: `removePostBookmark`, data: { post } };
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
