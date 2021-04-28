import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormGroupDirective } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { HttpService } from './../../services/shared-services/http.service';
import { EncryptService } from './../../services/shared-services/encrypt.service';
import { environment } from './../../../environments/environment';
import { Validator } from './../../@shared/validators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('resetFormDirective') resetFormDirective: FormGroupDirective;
  loading: boolean;
  form: FormGroup;

  token: string;
  user: string;

  constructor(
    private httpService: HttpService,
    private roure: ActivatedRoute,
    private encryptService: EncryptService,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private validator: Validator
  ) {}

  ngOnInit() {
    this.loading = true;
    this.titleService.setTitle('SPORTIZEN | Reset Password');
    this.form = new FormGroup(
      {
        password: new FormControl(null, {
          validators: [Validators.required],
        }),
        confirmPassword: new FormControl(null, {
          validators: [Validators.required],
        }),
      },
      {
        validators: this.validator.passwordValidator.bind(this),
      }
    );

    // tslint:disable-next-line: deprecation
    this.roure.queryParams.subscribe((params: Params) => {
      if (params.key === undefined) {
        this.router.navigate(['/page-not-found'], { relativeTo: this.roure });
        this.snackBar.open('Invalid Token', null, {
          duration: 2000,
          panelClass: ['error-snackbar'],
        });
      } else {
        this.token = params.key;

        const data = { api: 'validateToken', data: { token: this.token } };
        this.httpService.httpPost(data).subscribe(
          (response: any) => {
            const valid = response.valid_token;
            if (valid) {
              this.loading = false;
            } else {
              this.router.navigate(['/page-not-found'], {
                relativeTo: this.roure,
              });

              this.snackBar.open('Invalid Token', null, {
                duration: 2000,
                panelClass: ['error-snackbar'],
              });
            }
          },
          (error: any) => {
            this.router.navigate(['/page-not-found'], {
              relativeTo: this.roure,
            });

            this.snackBar.open(error, null, {
              duration: 2000,
              panelClass: ['error-snackbar'],
            });
          }
        );
      }
    });
  }

  reset() {
    this.form.markAllAsTouched();
    if (this.form.valid && !this.form.hasError('invalidPassword')) {
      this.loading = true;

      const resetPassword = {
        // user: this.user,
        password: this.encryptService.encrypt(this.form.value.password, environment.encKey),
        token: this.token,
      };

      const data = { api: 'resetPassword', data: resetPassword };
      this.httpService.httpPost(data).subscribe(
        (res: any) => {
          this.form.reset();

          this.resetFormDirective.resetForm();

          this.snackBar.open('Password Set Successfully', null, {
            duration: 2000,
            panelClass: ['success-snackbar'],
          });

          this.router.navigate(['/login'], { relativeTo: this.roure });
        },
        (error: any) => {
          this.snackBar.open(error, null, {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });

          this.loading = false;
        }
      );
    } else {
      this.snackBar.open('Invalid Form Data', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
    }
  }
}
