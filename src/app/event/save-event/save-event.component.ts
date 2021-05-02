import { DateService } from './../../services/shared-services/date.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EventService } from './../../services/event.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserProfileModel } from './../../models/user-profile.model';
import { UserProfileService } from './../../services/user-profile.service';
import { EventModel, EventImageModel } from './/../../models/event.model';
import { SportModel } from './../../models/sport.model';
import { SportService } from './../../services/sport.service';
import { CountryService } from './../../services/shared-services/country.service';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-save-event',
  templateUrl: './save-event.component.html',
  styleUrls: ['./save-event.component.scss'],
})
export class SaveEventComponent implements OnInit, OnDestroy {
  event: EventModel;
  submit: boolean;

  loading: boolean;

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
    private imageCompress: NgxImageCompressService,
    private sportsService: SportService,
    private countryService: CountryService,
    public dateService: DateService,
    private location: Location,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;

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
          name: new FormControl(null, {
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
          noOfRegistrations: new FormControl(null, {
            validators: [Validators.required, Validators.min(1)],
          }),
          noOfPlayers: new FormControl(null, {
            validators: [],
          }),
          description: new FormControl(null, {
            validators: [Validators.required],
          }),
          winningPrice: new FormControl(null, {
            validators: [Validators.required],
          }),
          fees: new FormControl(null, {
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
          endDate: new FormControl(null, {
            validators: [],
          }),
          time: new FormControl(null, {
            validators: [],
          }),
          registerTill: new FormControl(null, {
            validators: [Validators.required],
          }),
        });

        this.eventLocationForm = new FormGroup({
          address: new FormControl(null, {
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
                  endDate: this.dateService.convertToDateString(event.endDate),
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

                // this.eventDetailsForm.get('sport').disable();
                // this.eventDetailsForm.get('eventType').disable();
                // this.eventDetailsForm.get('registrationType').disable();
                // this.eventDetailsForm.get('fees').disable();

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
        endDate: null,
      });
      this.eventScheduleForm.controls['endDate'].clearValidators();
      this.eventScheduleForm.controls['endDate'].updateValueAndValidity();
    }
  }

  changeRegistrationType() {
    const registrationType = this.eventDetailsForm.getRawValue().registrationType;
    console.log(registrationType, registrationType === 'team');
    if (registrationType === 'team') {
      this.eventDetailsForm.controls['noOfPlayers'].setValidators([
        Validators.required,
        Validators.min(1),
      ]);
      this.eventDetailsForm.controls['noOfPlayers'].updateValueAndValidity();
    } else {
      this.eventDetailsForm.patchValue({
        noOfPlayers: null,
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
    this.invalidImage = false;
    const files = (event.target as HTMLInputElement).files;
    const imgExt: string[] = ['jpg', 'png'];
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
      this.eventImageFiles.push(files[i]);
      const reader = new FileReader();
      reader.onload = () => {
        this.eventImagePreview.push(reader.result as string);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  // compressFile(image, fileName) {
  //   var orientation = -1;
  //   const sizeOfOriginalImage = this.imageCompress.byteCount(image) / (1024 * 1024);
  //   console.warn('Size in bytes is now:', sizeOfOriginalImage);
  //   this.imageCompress.compressFile(image, orientation, 50, 50).then((result) => {
  //     this.imgResultAfterCompress = result;
  //     // this.localCompressedURl = result;
  //     const sizeOFCompressedImage = this.imageCompress.byteCount(result) / (1024 * 1024);
  //     console.warn('Size in bytes after compression:', sizeOFCompressedImage);
  //     // create file from byte
  //     const imageName = fileName;
  //     // call method that creates a blob from dataUri
  //     // const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
  //     // //imageFile created below is the new compressed file which can be send to API in form data
  //     // const imageFile = new File([result], imageName, { type: 'image/jpeg' });
  //   });
  // }

  removeImage(i: number) {
    this.eventImageFiles.splice(i, 1);
    this.eventImagePreview.splice(i, 1);
  }

  deleteImage(id: string, imageId: string, i: number) {
    this.loading = true;
    this.eventService.deleteEventImage(id, imageId, i).subscribe(
      (res: any) => {
        this.event.images.splice(i, 1);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  saveEvent() {
    if (this.eventDetailsForm.invalid) {
      this.snackBar.open('Form Details are Required', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
    } else if (this.eventScheduleForm.invalid) {
      this.snackBar.open('Event Schedule is Required', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
    } else if (this.eventLocationForm.invalid) {
      this.snackBar.open('Event Location is Required', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
    } else {
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
      for (let i = 0; i < this.eventImageFiles.length; i++) {
        event.append('eventImage', this.eventImageFiles[i]);
      }

      if (!this.event) {
        this.eventService.saveEvent(event).subscribe(
          (resEvent: EventModel) => {
            this.eventDetailsForm.reset();
            this.eventScheduleForm.reset();
            this.eventLocationForm.reset();

            this.submit = false;
            this.eventImageFiles = [];
            this.eventImagePreview = [];
            this.close();
          },
          (error: any) => {
            this.loading = false;
          }
        );
      } else {
        this.eventService.editEvent(event).subscribe(
          (resEvent: EventModel) => {
            this.event = resEvent;
            this.event.images = resEvent.images;
            this.submit = false;
            this.eventImageFiles = [];
            this.eventImagePreview = [];
            this.close();
          },
          (error: any) => {
            this.loading = false;
          }
        );
      }
    }
  }

  close() {
    this.location.back();
  }

  ngOnDestroy() {}
}
