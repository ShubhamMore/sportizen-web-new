import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  public getFile(url: string, type: string) {
    return this.http
      .get(url, {
        headers: new HttpHeaders({ 'Content-Type': 'application/text' }),
      })
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((err: any) => {
          //   let msg = 'SOMETHING BAD HAPPENED';
          //   if (err.error) {
          //     if (typeof err.error === 'object') {
          //       msg = `Can\'t Reach Server.., Please Try Again`;
          //     } else {
          //       msg = err.error;
          //     }
          //   }
          return throwError(err);
        })
      );
  }
}
