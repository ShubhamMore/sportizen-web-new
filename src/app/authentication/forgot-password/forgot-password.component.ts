import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/shared-services/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;

  loading: boolean;

  constructor(private httpService: HttpService, private router: Router) {}

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
          this.form.reset();
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
        }
      );
    } else {
    }
  }
}
