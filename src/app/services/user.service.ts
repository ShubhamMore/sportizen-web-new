import { Injectable } from '@angular/core';
import { HttpService } from './shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from './../authentication/auth/auth-service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpService: HttpService, private authService: AuthService) {}

  checkUser(email: string) {
    const data = { api: 'checkUser', data: { email } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  logoutAll() {
    this.authService.logoutAll();
  }
}
