import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/shared-services/http.service';
import { EncryptService } from '../../services/shared-services/encrypt.service';
import { environment } from '../../../environments/environment';
import { Validator } from '../../@shared/validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;

  loading: boolean;

  token: string;
  user: string;

  constructor(
    private httpService: HttpService,
    private roure: ActivatedRoute,
    private encryptService: EncryptService,
    private router: Router,
    private formBuilder: FormBuilder,
    private validator: Validator
  ) {}

  ngOnInit() {
    this.loading = true;
    this.form = this.formBuilder.group(
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

    this.roure.queryParams.subscribe((params: Params) => {
      if (params.key === undefined) {
      } else {
        this.router.navigate(['/page_not_found'], { relativeTo: this.roure });
        this.token = params.key;

        const data = { api: 'validateToken', data: { token: this.token } };
        this.httpService.httpPost(data).subscribe(
          (response: any) => {
            const valid = response.valid_token;
            if (valid) {
              this.loading = false;
            } else {
              this.router.navigate(['/page_not_found'], {
                relativeTo: this.roure,
              });
            }
          },
          (error: any) => {
            this.router.navigate(['/page_not_found'], {
              relativeTo: this.roure,
            });
          }
        );
      }
    });
  }

  reset() {
    if (this.form.valid && !this.form.hasError('invalidPassword')) {
      this.loading = true;

      const resetPassword = {
        // user: this.user,
        password: this.encryptService.encrypt(this.form.value.password, environment.encKey),
        token: this.token,
      };

      const data = { api: 'resetPassword', data: resetPassword };
      this.httpService.httpPost(data).subscribe(
        (val: any) => {
          this.form.reset();
          this.router.navigate(['/login'], { relativeTo: this.roure });
        },
        (error: any) => {
          this.loading = false;
        }
      );
    } else {
    }
  }
}
