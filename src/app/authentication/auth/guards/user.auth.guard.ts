import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
  UrlTree,
  Route,
  CanLoad,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../auth-service/auth.service';

@Injectable({ providedIn: 'root' })
export class UserAuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  // tslint:disable-next-line: max-line-length
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
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

  // tslint:disable-next-line: max-line-length
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.canActivate(route, state);
  }

  canLoad(route: Route) {
    return this.authService.getUser().pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        if (isAuth && user.userType === 'user') {
          return true;
        }
        return false;
      })
    );
  }
}
