import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthResponseData, AuthService } from './../auth/auth-service/auth.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptService } from './../../services/shared-services/encrypt.service';
import { environment } from './../../../environments/environment';
import { Validator } from './../../@shared/validators';
import { UserService } from './../../services/user-services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('registerFormDirective') registerFormDirective: FormGroupDirective;
  loading: boolean;
  form: FormGroup;

  userExist: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private encryptService: EncryptService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private validator: Validator
  ) {}

  ngOnInit() {
    this.loading = true;

    this.titleService.setTitle('SPORTIZEN | Register');
    this.userExist = false;
    this.form = new FormGroup(
      {
        firstName: new FormControl(null, {
          validators: [Validators.required],
        }),
        lastName: new FormControl(null, {
          validators: [Validators.required],
        }),
        email: new FormControl(null, {
          validators: [Validators.required, Validators.email],
        }),
        password: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      {
        validators: this.validator.passwordValidator.bind(this),
      }
    );
    this.loading = false;
  }

  checkUser() {
    if (this.form.controls.email.status === 'VALID') {
      this.userService.checkUser(this.form.value.email).subscribe(
        (res: any) => {
          this.userExist = res.exist;
        },
        (error: any) => {
          this.snackBar.open(error, null, {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
        }
      );
    }
  }

  register() {
    if (!this.form.valid && this.form.hasError('invalidPassword')) {
      this.snackBar.open('Invalid Form Data', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
      return;
    } else if (this.userExist) {
      this.snackBar.open('This user already Exist', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.loading = true;

    const data = {
      name: this.form.value.firstName.toLowerCase() + ' ' + this.form.value.lastName.toLowerCase(),
      userType: 'user',
      email: this.form.value.email,
      password: this.encryptService.encrypt(this.form.value.password, environment.encKey),
    };

    this.authService.createUser(data).subscribe(
      (res: any) => {
        this.loading = false;
        this.registerFormDirective.resetForm();
        this.form.reset();
        this.snackBar.open('New User Created Successfully!', null, {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/login'], { relativeTo: this.route });
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
}
