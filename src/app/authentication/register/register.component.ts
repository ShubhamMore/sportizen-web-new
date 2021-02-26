import { Component, OnInit } from '@angular/core';
import { AuthResponseData, AuthService } from '../auth/auth-service/auth.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptService } from '../../services/shared-services/encrypt.service';
import { environment } from '../../../environments/environment';
import { Validator } from '../../@shared/validators';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  userExist: boolean;
  loading: boolean;
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private encryptService: EncryptService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private validator: Validator
  ) {}

  ngOnInit() {
    this.loading = true;

    this.userExist = false;
    this.form = this.formBuilder.group(
      {
        firstName: new FormControl(null, {
          validators: [Validators.required],
        }),
        lastName: new FormControl(null, {
          validators: [Validators.required],
        }),
        // userType: new FormControl('', {
        //   validators: [Validators.required],
        // }),
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
        (error) => {}
      );
    }
  }

  register() {
    if (!this.form.valid && this.form.hasError('invalidPassword')) {
      return;
    } else if (this.userExist) {
      return;
    }

    this.loading = true;

    const data = {
      name: this.form.value.firstName.toLowerCase() + ' ' + this.form.value.lastName.toLowerCase(),
      // userType: this.form.value.userType,
      userType: 'user',
      email: this.form.value.email,
      password: this.encryptService.encrypt(this.form.value.password, environment.encKey),
    };

    let authObs: Observable<AuthResponseData>;

    authObs = this.authService.createUser(data);

    authObs.subscribe(
      (res: any) => {
        this.loading = false;
        this.router.navigate(['/login'], { relativeTo: this.route });
      },
      (error: any) => {
        this.loading = false;
      }
    );

    this.form.reset();
  }
}
