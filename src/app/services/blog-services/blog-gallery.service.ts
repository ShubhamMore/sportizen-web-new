import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogGalleryService {
  constructor(private httpService: HttpService) {}

  getMyBlogGallery(limit?: number, skip?: number) {
    const data = { api: `getMyBlogGallery`, data: { limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getUserBlogGallery(user: string, limit?: number) {
    const data = { api: `getUserBlogGallery`, data: { user, limit } };
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
