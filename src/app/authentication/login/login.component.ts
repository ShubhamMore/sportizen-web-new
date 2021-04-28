import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

import { AuthService, AuthResponseData } from './../auth/auth-service/auth.service';
import { EncryptService } from './../../services/shared-services/encrypt.service';

import { SocialAuthService as GoogleAuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('loginFormDirective') loginFormDirective: FormGroupDirective;

  loading: boolean;
  form: FormGroup;

  user: SocialUser;
  authObs: Observable<AuthResponseData>;

  redirectRoute: string[];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private googleAuthService: GoogleAuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private encryptService: EncryptService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
    // tslint:disable-next-line: deprecation
    this.googleAuthService.authState.subscribe((user: any) => {
      this.user = user;
    });
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    });

    this.redirectRoute = [];

    this.route.queryParams.subscribe((param: Params) => {
      if (param.redirectTo) {
        this.redirectRoute = param.redirectTo.toString().split('/');
      }

      this.loading = false;
    });
  }

  login() {
    if (!this.form.valid) {
      this.snackBar.open('Invalid Login Credentials', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });

      return;
    }

    this.loading = true;

    const email = this.form.value.email;
    const password = this.encryptService.encrypt(this.form.value.password, environment.encKey);

    this.authObs = this.authService.login(email, password);
    this.authSubscribe();
  }

  authSubscribe() {
    // tslint:disable-next-line: deprecation
    this.authObs.subscribe(
      (res: any) => {
        this.loading = false;

        if (res.userType === 'user') {
          this.snackBar.open('Login Successful!', null, {
            duration: 2000,
            panelClass: ['success-snackbar'],
          });

          if (this.redirectRoute.length > 0) {
            this.router.navigate(['/dashboard', ...this.redirectRoute], { relativeTo: this.route });
          } else {
            this.router.navigate(['/dashboard'], { relativeTo: this.route });
          }
        } else {
          this.snackBar.open('Invalid User', null, {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });

          this.router.navigate(['/login'], {
            relativeTo: this.route,
          });
        }

        this.loginFormDirective.resetForm();
        this.form.reset();
      },
      (error: any) => {
        this.snackBar.open(error, null, {
          duration: 2000,
          panelClass: ['error-snackbar'],
        });
        this.loading = false;
      }
    );
  }

  signInWithGoogle(): void {
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: any) => {
      this.loading = true;
      this.userService.checkUser(user.email).subscribe(
        (res: any) => {
          if (res.exist) {
            this.authObs = this.authService.googleLogin(user);
            this.authSubscribe();
            this.signOut();
          } else {
            const newUser = {
              name: user.name.toLowerCase(),
              userType: 'user',
              email: user.email,
              idToken: user.idToken,
              password: this.encryptService.encrypt(user.id, environment.encKey),
              userImageURL: user.photoUrl,
            };

            this.authObs = this.authService.createUserGoogle(newUser);
            this.authSubscribe();
            this.signOut();
          }

          this.loading = false;
        },
        (error: any) => {
          this.snackBar.open(error, null, {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
          this.loading = false;
        }
      );
    });
  }

  signOut(): void {
    this.googleAuthService.signOut();
  }
}
