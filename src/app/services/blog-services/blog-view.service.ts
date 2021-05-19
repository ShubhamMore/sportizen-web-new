import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogViewService {
  constructor(private httpService: HttpService) {}

  getBlogViews(blog: string, limit?: number, skip?: number) {
    const data = { api: `getBlogViews`, data: { blog, limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  viewBlog(blog: string) {
    const data = { api: `viewBlog`, data: { blog } };
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
