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
    private sportsService: SportService,
    private countryService: CountryService,
    private dateService: DateService,
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
          noOfPlayers: new FormControl(null, {
            validators: [Validators.required],
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
          startDate: new FormControl(null, {
            validators: [Validators.required],
          }),
          endDate: new FormControl(null, {
            validators: [Validators.required],
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

                console.log({
                  name: event.name,
                  sport: event.sport,
                  eventType: event.eventType,
                  registrationType: event.registrationType,
                  noOfPlayers: event.noOfPlayers,
                  description: event.description,
                  winningPrice: event.winningPrice,
                  fees: event.fees,
                });

                this.eventDetailsForm.patchValue({
                  name: event.name,
                  sport: event.sport,
                  eventType: event.eventType,
                  registrationType: event.registrationType,
                  noOfPlayers: event.noOfPlayers,
                  description: event.description,
                  winningPrice: event.winningPrice,
                  fees: event.fees,
                });

                this.eventScheduleForm.patchValue({
                  startDate: event.startDate,
                  endDate: event.endDate,
                  time: event.time,
                  registerTill: event.registerTill,
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
      event.append('noOfPlayers', this.eventDetailsForm.getRawValue().noOfPlayers);
      event.append('winningPrice', this.eventDetailsForm.getRawValue().winningPrice);
      event.append('fees', this.eventDetailsForm.getRawValue().fees);
      // Event Schedule
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
