import { Injectable } from '@angular/core';
import { HttpService } from './shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostGalleryService {
  constructor(private httpService: HttpService) {}

  getMyPostGallery(limit?: number) {
    const data = { api: `getMyPostGallery`, data: { limit } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getUserPostGallery(user: string, limit?: number) {
    const data = { api: `getUserPostGallery`, data: { user, limit } };
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
