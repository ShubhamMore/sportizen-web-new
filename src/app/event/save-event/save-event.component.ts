import { DateService } from './../../services/shared-services/date.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EventService } from './../../services/event.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserProfileModel } from './../../models/user-profile.model';
import { UserProfileService } from './../../services/user-profile.service';
import { EventModel } from './/../../models/event.model';
import { SportModel } from './../../models/sport.model';
import { SportService } from './../../services/sport.service';
import { CountryService } from './../../services/shared-services/country.service';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompressImageService } from '../../services/shared-services/compress-image.service';
import { take } from 'rxjs/operators';
import { ImageModelComponent } from '../../image/image-model/image-model.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../@shared/confirm/confirm.component';

@Component({
  selector: 'app-save-event',
  templateUrl: './save-event.component.html',
  styleUrls: ['./save-event.component.scss'],
})
export class SaveEventComponent implements OnInit, OnDestroy {
  event: EventModel;
  submit: boolean;

  loading: boolean;
  loadingImages: boolean;

  userProfile: UserProfileModel;

  eventDetailsForm: FormGroup;
  eventScheduleForm: FormGroup;
  eventLocationForm: FormGroup;

  sports: SportModel[];
  invalidImage: boolean;
  eventImageFiles: File[];
  eventImagePreview: string[];

  states: any[];
  cities: any[];
  city: any;

  constructor(
    private eventService: EventService,
    private userProfileService: UserProfileService,
    private sportsService: SportService,
    private countryService: CountryService,
    public dateService: DateService,
    private location: Location,
    private snackBar: MatSnackBar,
    private compressImageService: CompressImageService,
    private dialog: MatDialog,
    private titleService: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadingImages = false;

    this.titleService.setTitle(`SPORTIZEN | Event`);

    this.submit = false;
    this.invalidImage = false;

    this.sports = this.sportsService.getSports();
    this.userProfileService.getProfile().subscribe((userProfile: UserProfileModel) => {
      if (userProfile) {
        this.userProfile = userProfile;

        this.eventImageFiles = [];
        this.eventImagePreview = [];

        this.states = this.countryService.getStates();
        this.cities = [];

        this.eventDetailsForm = new FormGroup({
          name: new FormControl('', {
            validators: [Validators.required],
          }),
          sport: new FormControl('', {
            validators: [Validators.required],
          }),
          eventType: new FormControl('', {
            validators: [Validators.required],
          }),
          registrationType: new FormControl('', {
            validators: [Validators.required],
          }),
          noOfRegistrations: new FormControl('', {
            validators: [Validators.required, Validators.min(1)],
          }),
          noOfPlayers: new FormControl('', {
            validators: [],
          }),
          description: new FormControl('', {
            validators: [Validators.required],
          }),
          winningPrice: new FormControl('', {
            validators: [Validators.required],
          }),
          fees: new FormControl('', {
            validators: [Validators.required, Validators.min(0)],
          }),
        });

        this.eventScheduleForm = new FormGroup({
          durationType: new FormControl('', {
            validators: [Validators.required],
          }),
          startDate: new FormControl(this.dateService.getDate(), {
            validators: [Validators.required],
          }),
          endDate: new FormControl('', {
            validators: [],
          }),
          time: new FormControl('', {
            validators: [],
          }),
          registerTill: new FormControl('', {
            validators: [Validators.required],
          }),
        });

        this.eventLocationForm = new FormGroup({
          address: new FormControl('', {
            validators: [Validators.required],
          }),
          state: new FormControl('', {
            validators: [Validators.required],
          }),
          city: new FormControl('', {
            validators: [Validators.required],
          }),
        });

        this.route.params.subscribe((param: Params) => {
          const id = param.id;

          if (id) {
            this.titleService.setTitle(`SPORTIZEN | Edit Event`);

            this.eventService.getEvent(id).subscribe(
              (event: EventModel) => {
                this.titleService.setTitle(`SPORTIZEN | Edit Event | ${event.name}`);
                this.event = event;

                this.eventDetailsForm.patchValue({
                  name: event.name,
                  sport: event.sport,
                  eventType: event.eventType,
                  registrationType: event.registrationType,
                  noOfRegistrations: event.noOfRegistrations,
                  noOfPlayers: event.noOfPlayers,
                  description: event.description,
                  winningPrice: event.winningPrice,
                  fees: event.fees,
                });

                this.eventScheduleForm.patchValue({
                  durationType: event.durationType,
                  startDate: this.dateService.convertToDateString(event.startDate),
                  endDate: event.endDate ? this.dateService.convertToDateString(event.endDate) : '',
                  time: event.time,
                  registerTill: this.dateService.convertToDateString(event.registerTill),
                });

                this.eventLocationForm.patchValue({
                  address: event.address,
                  state: event.state,
                });

                this.changeState(event.state);

                this.eventLocationForm.patchValue({
                  city: event.city,
                });

                this.changeCity(event.city);

                this.eventDetailsForm.get('eventType').disable();
                this.eventDetailsForm.get('registrationType').disable();
                this.eventDetailsForm.get('noOfPlayers').disable();
                this.eventDetailsForm.get('fees').disable();

                this.loading = false;
              },
              (error: any) => {
                this.loading = false;
              }
            );
          } else {
            this.titleService.setTitle(`SPORTIZEN | New Event`);
            this.loading = false;
          }
        });
      } else {
        this.location.back();
      }
    });
  }

  onSelectDurationType() {
    const durationType = this.eventScheduleForm.getRawValue().durationType;
    if (durationType === 'multiple-day') {
      this.eventScheduleForm.controls['endDate'].setValidators([Validators.required]);
      this.eventScheduleForm.controls['endDate'].updateValueAndValidity();
    } else {
      this.eventScheduleForm.patchValue({
        endDate: '',
      });
      this.eventScheduleForm.controls['endDate'].clearValidators();
      this.eventScheduleForm.controls['endDate'].updateValueAndValidity();
    }
  }

  changeRegistrationType() {
    const registrationType = this.eventDetailsForm.getRawValue().registrationType;
    if (registrationType === 'team') {
      this.eventDetailsForm.controls['noOfPlayers'].setValidators([
        Validators.required,
        Validators.min(1),
      ]);
      this.eventDetailsForm.controls['noOfPlayers'].updateValueAndValidity();
    } else {
      this.eventDetailsForm.patchValue({
        noOfPlayers: '',
      });
      this.eventDetailsForm.controls['noOfPlayers'].clearValidators();
      this.eventDetailsForm.controls['noOfPlayers'].updateValueAndValidity();
    }
  }

  changeState(name: string) {
    this.cities = this.countryService.getCities(name);
  }

  changeCity(name: any) {
    const city = this.cities.find((curCity: any) => curCity.name === name);
    this.city = city;
  }

  onImagePicked(event: Event): any {
    this.loadingImages = true;

    const files = (event.target as HTMLInputElement).files;
    const imgExt: string[] = ['jpg', 'jpeg', 'png'];

    const n: number = files.length;

    for (let i = 0; i < n; i++) {
      const fileName = files[i].name;
      const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

      if (!(imgExt.indexOf(ext) !== -1)) {
        this.invalidImage = true;
        continue;
      }

      this.eventImageFiles.push(files[i]);

      const reader = new FileReader();

      reader.onload = () => {
        const preview = reader.result as string;
        this.eventImagePreview.push(preview);

        if (i === n - 1) {
          this.loadingImages = false;
        }
      };

      reader.readAsDataURL(files[i]);
    }
  }

  removeImage(i: number) {
    this.eventImageFiles.splice(i, 1);
    this.eventImagePreview.splice(i, 1);
  }

  deleteImage(id: string, imageId: string, i: number) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { message: 'Do you want to delete This Image?' },
      maxHeight: '90vh',
      disableClose: true,
    });

    // tslint:disable-next-line: deprecation
    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.loadingImages = true;
        this.eventService.deleteEventImage(id, imageId, i).subscribe(
          (res: any) => {
            this.event.images.splice(i, 1);
            this.loadingImages = false;
          },
          (error: any) => {
            this.loadingImages = false;
          }
        );
      }
    });
  }

  openImageModel(image: any) {
    const dialogRef = this.dialog.open(ImageModelComponent, {
      data: { image },
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  submitEvent() {
    if (this.eventDetailsForm.invalid) {
      this.snackBar.open('Form Details are Required', '', {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
      return;
    } else if (this.eventScheduleForm.invalid) {
      this.snackBar.open('Event Schedule is Required', '', {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
      return;
    } else if (this.eventLocationForm.invalid) {
      this.snackBar.open('Event Location is Required', '', {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.submit = true;

    const n = this.eventImageFiles.length;

    if (n === 0) {
      this.saveEvent();
      return;
    }

    const eventImageFiles: File[] = [];

    for (let i = 0; i < n; i++) {
      this.compressImageService
        .compress(this.eventImageFiles[i])
        .pipe(take(1))
        .subscribe((compressedImage) => {
          eventImageFiles.push(compressedImage);

          if (i === n - 1) {
            this.saveEvent(eventImageFiles);
          }
        });
    }
  }

  private saveEvent(eventImageFiles?: File[]) {
    this.submit = true;

    const event = new FormData();
    // Event ID
    if (this.event) {
      event.append('_id', this.event._id);
    }

    // Event Details
    event.append('name', this.eventDetailsForm.getRawValue().name);
    event.append('description', this.eventDetailsForm.getRawValue().description);
    event.append('sport', this.eventDetailsForm.getRawValue().sport);
    event.append('eventType', this.eventDetailsForm.getRawValue().eventType);
    event.append('registrationType', this.eventDetailsForm.getRawValue().registrationType);
    event.append('noOfRegistrations', this.eventDetailsForm.getRawValue().noOfRegistrations);
    event.append('noOfPlayers', this.eventDetailsForm.getRawValue().noOfPlayers);
    event.append('winningPrice', this.eventDetailsForm.getRawValue().winningPrice);
    event.append('fees', this.eventDetailsForm.getRawValue().fees);
    // Event Schedule
    event.append('durationType', this.eventScheduleForm.getRawValue().durationType);
    event.append('startDate', this.eventScheduleForm.getRawValue().startDate);
    event.append('endDate', this.eventScheduleForm.getRawValue().endDate);
    event.append('registerTill', this.eventScheduleForm.getRawValue().registerTill);
    event.append('time', this.eventScheduleForm.getRawValue().time);
    // Event Location
    event.append('address', this.eventLocationForm.getRawValue().address);
    event.append('state', this.eventLocationForm.getRawValue().state);
    event.append('city', this.eventLocationForm.getRawValue().city);
    event.append('latitude', this.city.latitude);
    event.append('longitude', this.city.longitude);
    event.append('createdBy', this.userProfile.email);
    // Event Images
    if (eventImageFiles) {
      const n = eventImageFiles.length;
      for (let i = 0; i < n; i++) {
        event.append('eventImage', eventImageFiles[i]);
      }
    }

    if (!this.event) {
      this.eventService.saveEvent(event).subscribe(
        (resEvent: EventModel) => {
          this.eventDetailsForm.reset();
          this.eventScheduleForm.reset();
          this.eventLocationForm.reset();

          this.eventImageFiles = [];
          this.eventImagePreview = [];
          this.submit = false;
          this.close();
        },
        (error: any) => {
          this.snackBar.open(error, '', {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
          this.submit = false;
        }
      );
    } else {
      this.eventService.editEvent(event).subscribe(
        (resEvent: EventModel) => {
          this.event = resEvent;
          this.event.images = resEvent.images;
          this.eventImageFiles = [];
          this.eventImagePreview = [];
          this.submit = false;
          this.close();
        },
        (error: any) => {
          this.snackBar.open(error, '', {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
          this.submit = false;
        }
      );
    }
  }

  close() {
    this.location.back();
  }

  ngOnDestroy() {}
}
