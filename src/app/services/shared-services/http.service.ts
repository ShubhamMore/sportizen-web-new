import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public httpGet(data: any): any {
    return this.http.get<any>(environment.backend + data.api, data.data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        let msg = 'SOMETHING BAD HAPPENED';
        if (err.error) {
          if (typeof err.error === 'object') {
            msg = `Can\'t Reach Server.., Please Try Again`;
          } else {
            msg = err.error;
          }
        }
        return throwError(msg);
      })
    );
  }

  public httpPost(data: { api: string; data: any }): any {
    return this.http.post<any>(environment.backend + data.api, data.data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        let msg = 'SOMETHING BAD HAPPENED';
        if (err.error) {
          if (typeof err.error === 'object') {
            msg = `Can\'t Reach Server.., Please Try Again`;
          } else {
            msg = err.error;
          }
        }
        return throwError(msg);
      })
    );
  }

  public httpPatch(data: any): any {
    return this.http.patch<any>(environment.backend + data.api, data.data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        let msg = 'SOMETHING BAD HAPPENED';
        if (err.error) {
          if (typeof err.error === 'object') {
            msg = `Can\'t Reach Server.., Please Try Again`;
          } else {
            msg = err.error;
          }
        }
        return throwError(msg);
      })
    );
  }

  public httpPut(data: any): any {
    return this.http.put<any>(environment.backend + data.api, data.data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        let msg = 'SOMETHING BAD HAPPENED';
        if (err.error) {
          if (typeof err.error === 'object') {
            msg = `Can\'t Reach Server.., Please Try Again`;
          } else {
            msg = err.error;
          }
        }
        return throwError(msg);
      })
    );
  }

  public httpDelete(data: any): any {
    return this.http.delete<any>(environment.backend + data.api, data.data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        let msg = 'SOMETHING BAD HAPPENED';
        if (err.error) {
          if (typeof err.error === 'object') {
            msg = `Can\'t Reach Server.., Please Try Again`;
          } else {
            msg = err.error;
          }
        }
        return throwError(msg);
      })
    );
  }
}
