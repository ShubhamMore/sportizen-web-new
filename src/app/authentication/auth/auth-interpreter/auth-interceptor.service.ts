import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './../auth-service/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.getUser().pipe(
      take(1),
      exhaustMap((user: any) => {
        if (!user) {
          return next.handle(req);
        }
        const token = 'Bearer ' + JSON.parse(sessionStorage.getItem('userData'))._token;
        const modifiedReq = req.clone({
          headers: req.headers.append('Authorization', token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
