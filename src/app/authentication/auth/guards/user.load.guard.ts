import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlTree, ActivatedRoute } from '@angular/router';
import { AuthService } from './../auth-service/auth.service';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserAuthLoadGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: Route
  ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.authService.getUser().pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        if (isAuth && user.userType === 'user') {
          return true;
        }
        return this.router.createUrlTree(['/login']);
      })
      // tap(isAuth => {
      //   if (!isAuth) {
      //     this.router.navigate(['/auth']);
      //   }
      // })
    );
  }
}
