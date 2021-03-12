import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { AuthService, AuthResponseData } from '../auth/auth-service/auth.service';
import { EncryptService } from '../../services/shared-services/encrypt.service';

import { AuthService as GoogleAuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  error: string = null;

  user: SocialUser;
  authObs: Observable<AuthResponseData>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private googleAuthService: GoogleAuthService,
    private router: Router,
    private encryptService: EncryptService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
    this.googleAuthService.authState.subscribe((user) => {
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

    this.loading = false;
  }

  login() {
    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    const email = this.form.value.email;
    const password = this.encryptService.encrypt(this.form.value.password, environment.encKey);

    this.authObs = this.authService.login(email, password);
    this.authSubscribe();
  }

  authSubscribe() {
    this.authObs.subscribe(
      (res: any) => {
        this.loading = false;
        if (res.userType === 'user') {
          this.router.navigate(['/dashboard'], { relativeTo: this.route });
        } else {
          this.router.navigate(['/login'], {
            relativeTo: this.route,
          });
        }
        this.form.reset();
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  signInWithGoogle(): void {
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
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
          this.loading = false;
        }
      );
    });
  }

  signOut(): void {
    this.googleAuthService.signOut();
  }
}
