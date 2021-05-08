import { MatDialog } from '@angular/material/dialog';
import { ImageCroperComponent } from '../../../../image/image-croper/image-croper.component';
import { Validator } from './../../../../@shared/validators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SportService } from './../../../../services/sport.service';
import { SportModel } from './../../../../models/sport.model';
import { environment } from './../../../../../environments/environment';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { UserProfileModel } from './../../../../models/user-profile.model';
import { UserProfileService } from './../../../../services/user-profile.service';
import { EncryptService } from './../../../../services/shared-services/encrypt.service';
import { HttpService } from './../../../../services/shared-services/http.service';
import { UserService } from './../../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardSideDrawerService } from './../../../../services/dashboard-side-drawer.service';
import { Title } from '@angular/platform-browser';
import { SportsComponent } from './../../../../sports/sports.component';
import { take } from 'rxjs/operators';
import { CompressImageService } from './../../../../services/shared-services/compress-image.service';

@Component({
  selector: 'app-save-profile',
  templateUrl: './save-profile.component.html',
  styleUrls: ['./save-profile.component.scss'],
})
export class SaveProfileComponent implements OnInit {
  @ViewChild('changePasswordFormDirective') private changePasswordFormDirective: NgForm;

  form: FormGroup;
  changePasswordForm: FormGroup;

  profileImage: File;
  invalidImage: boolean;
  profileImagePreview: string;

  addSportInterest: boolean;
  interestedSports: string[];
  sports: SportModel[];

  loading: boolean;

  userProfile: UserProfileModel;

  constructor(
    private httpService: HttpService,
    private sportService: SportService,
    private encryptService: EncryptService,
    private formBuilder: FormBuilder,
    private userProfileService: UserProfileService,
    private validator: Validator,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private titleService: Title,
    public dialog: MatDialog,
    public compressImageService: CompressImageService,
    private dashboardSideDrawerService: DashboardSideDrawerService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.titleService.setTitle('SPORTIZEN | Edit Profile');

    navigator.geolocation.getCurrentPosition((location) => {});

    this.addSportInterest = false;

    this.userProfileService.getProfile().subscribe((userProfile: UserProfileModel) => {
      if (userProfile) {
        this.userProfile = userProfile;

        this.profileImagePreview = this.userProfile.userImageURL;
        this.interestedSports = this.userProfile.sportsInterest;

        this.getInterestSports();

        this.form = new FormGroup({
          firstName: new FormControl(this.userProfile.name.split(' ')[0], {
            validators: [Validators.required],
          }),
          lastName: new FormControl(this.userProfile.name.split(' ')[1], {
            validators: [Validators.required],
          }),
          birthDate: new FormControl(new Date(this.userProfile.birthDate), {
            validators: [Validators.required],
          }),
          gender: new FormControl(this.userProfile.gender, { validators: [Validators.required] }),
          story: new FormControl(this.userProfile.story, {}),
          emailId: new FormControl(this.userProfile.email, {
            validators: [Validators.required, Validators.email],
          }),
          phoneNo: new FormControl(this.userProfile.phoneNo, {
            validators: [
              Validators.required,
              Validators.min(1000000000),
              Validators.max(9999999999),
            ],
          }),
        });

        this.changePasswordForm = new FormGroup(
          {
            oldPassword: new FormControl(null, {}),
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

        if (this.userProfile.userProvider === 'SPORTIZEN') {
          this.changePasswordForm
            .get('oldPassword')
            .setValidators([Validators.required, Validators.minLength(6)]);
        }

        this.loading = false;
      }
    });
  }

  onImagePicked(event: Event): any {
    this.invalidImage = false;

    const files = (event.target as HTMLInputElement).files;
    const imgExt: string[] = ['jpg', 'jpeg', 'png'];

    let ext: string;
    const n: number = files.length;

    for (let i = 0; i < n; i++) {
      ext = files[i].name.substring(files[i].name.lastIndexOf('.') + 1).toLowerCase();
      if (!(imgExt.indexOf(ext) !== -1)) {
        return (this.invalidImage = true);
      }
    }

    this.invalidImage = false;

    for (let i = 0; i < n; i++) {
      const reader = new FileReader();

      reader.onload = () => {
        const imagePreview = reader.result as string;

        const dialogRef = this.dialog.open(ImageCroperComponent, {
          data: {
            image: imagePreview,
          },
          maxHeight: '90vh',
        });

        dialogRef.afterClosed().subscribe((data: any) => {
          if (data) {
            this.saveCroppedImage(data);
          }
        });
      };
      reader.readAsDataURL(files[i]);
    }
  }

  saveCroppedImage(imagePreview: any) {
    this.profileImagePreview = imagePreview;

    this.profileImage = this.dataURLtoFile(
      this.profileImagePreview as string,
      this.userProfile.email.split('@')[0]
    );
  }

  private dataURLtoFile(dataURL: string, filename: string) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  getInterestSports() {
    this.sports = [];

    this.interestedSports.forEach((sport) => {
      this.sports.push(this.sportService.getSport(sport));
    });
  }

  sportsInterest() {
    const dialogRef = this.dialog.open(SportsComponent, {
      data: {
        sportsInterest: this.interestedSports,
      },
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.saveSportsInterest(data);
      } else {
        this.addSportInterest = false;
      }
    });
  }

  saveSportsInterest(interestedSports: any) {
    this.interestedSports = interestedSports;

    this.getInterestSports();
    this.addSportInterest = false;
  }

  removeInterestedSport(i: number) {
    this.interestedSports.splice(i, 1);
    this.getInterestSports();
  }

  submitUserProfile() {
    if (this.form.invalid) {
      this.snackBar.open('Please Enter Valid Profile Details', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
      return;
    } else if (this.interestedSports.length <= 0) {
      this.snackBar.open('Please Select at least 1 Sport Interest', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.loading = true;

    if (!this.profileImage) {
      this.saveUserProfile();
      return;
    }

    this.compressImageService
      .compress(this.profileImage)
      .pipe(take(1))
      .subscribe((compressedImage: any) => {
        this.saveUserProfile(compressedImage);
      });
  }

  saveUserProfile(profileImage?: File) {
    const profile = new FormData();

    profile.append('_id', this.userProfile._id);
    profile.append('name', this.form.value.firstName + ' ' + this.form.value.lastName);
    profile.append('birthDate', this.form.value.birthDate);
    profile.append('story', this.form.value.story);
    profile.append('phoneNo', this.form.value.phoneNo);
    profile.append('gender', this.form.value.gender);
    profile.append('sportsInterest', this.interestedSports.join(','));

    if (profileImage) {
      profile.append('profileImage', profileImage);
    }

    this.userProfileService.saveProfile(profile).subscribe(
      (updatedUserProfile: UserProfileModel) => {
        this.profileImage = null;

        this.userProfileService.setProfile(updatedUserProfile);

        this.snackBar.open('Profile Details Updated Successfully', null, {
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
  }

  changePassword() {
    if (this.form.valid && !this.form.hasError('invalidPassword')) {
      const data = { api: '', data: {} };
      if (this.userProfile.userProvider === 'SPORTIZEN') {
        data.api = 'changePassword';
        data.data = {
          email: this.userProfile.email,
          password: this.encryptService.encrypt(this.form.value.oldPassword, environment.encKey),
          newPassword: this.encryptService.encrypt(this.form.value.password, environment.encKey),
        };
      } else {
        data.api = 'setPassword';
        data.data = {
          email: this.userProfile.email,
          password: this.encryptService.encrypt(this.form.value.password, environment.encKey),
        };
      }

      this.httpService.httpPost(data).subscribe(
        (res: any) => {
          this.changePasswordFormDirective.resetForm();
          this.userProfile.userProvider = 'SPORTIZEN';
          this.userProfileService.setProfile(this.userProfile);
          this.snackBar.open('New Password updated Successfully', null, {
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
    }
  }

  logoutAll() {
    this.userService.logoutAll();
  }
}
