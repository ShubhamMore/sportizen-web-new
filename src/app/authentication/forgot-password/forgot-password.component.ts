import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from './../../services/shared-services/http.service';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('forgotPasswordFormDirective') forgotPasswordFormDirective: FormGroupDirective;

  loading: boolean;
  form: FormGroup;

  constructor(private httpService: HttpService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loading = true;

    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
    });
    this.loading = false;
  }

  forgotPassword() {
    if (this.form.valid) {
      this.loading = true;

      const data = {
        api: 'forgotPassword',
        data: {
          email: this.form.value.email,
        },
      };

      this.httpService.httpPost(data).subscribe(
        (res: any) => {
          this.forgotPasswordFormDirective.resetForm();
          this.form.reset();
          this.snackBar.open('Reset Password Link Send Successfully!', null, {
            duration: 2000,
            panelClass: ['success-snackbar'],
          });
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
    } else {
      this.snackBar.open('Enter Valid Email Address', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
    }
  }
}
