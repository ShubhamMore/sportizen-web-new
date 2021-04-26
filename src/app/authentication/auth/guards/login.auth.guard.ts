import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
  UrlTree,
  ActivatedRoute,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth-service/auth.service';
@Injectable({ providedIn: 'root' })
export class LoginAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // tslint:disable-next-line: max-line-length
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.authService.getUser().pipe(
      take(1),
      map((user) => {
        if (!localStorage.getItem('userData')) {
          this.authService.removeUser();
        }
        const isAuth = !!user;
        if (!isAuth) {
          return true;
        } else if (user.userType === 'user') {
          return this.router.createUrlTree(['/dashboard'], { relativeTo: this.route });
        } else {
          return this.router.createUrlTree(['/login']);
        }
      })
      // tap(isAuth => {
      //   if (!isAuth) {
      //     this.router.navigate(['/auth']);
      //   }
      // })
    );
  }
}
