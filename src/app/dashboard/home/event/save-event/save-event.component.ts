import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DateService } from './../../../../services/shared-services/date.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EventService } from '../../../../services/event.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserProfileModel } from './../../../../models/user-profile.model';
import { UserProfileService } from './../../../../services/user-profile.service';
import { EventModel, EventImageModel } from './../../../../models/event.model';
import { SportModel } from './../../../../models/sport.model';
import { SportService } from './../../../../services/sport.service';
import { CountryService } from './../../../../services/shared-services/country.service';

@Component({
  selector: 'app-save-event',
  templateUrl: './save-event.component.html',
  styleUrls: ['./save-event.component.scss'],
})
export class SaveEventComponent implements OnInit, OnDestroy {
  event: EventModel;
  editingMode: boolean;
  savingRecord: boolean;

  loading: boolean;

  userProfile: UserProfileModel;

  form: FormGroup;
  sports: SportModel[];
  invalidImage: boolean;
  eventImageFiles: File[];
  eventImagePreview: string[];

  eventImage: EventImageModel[];

  states: any[];
  cities: any[];
  city: any;

  constructor(
    private eventService: EventService,
    private userProfileService: UserProfileService,
    private sportsService: SportService,
    private countryService: CountryService,
    private dateService: DateService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.savingRecord = false;
    this.invalidImage = false;
    this.editingMode = false;
    this.sports = this.sportsService.getSports();
    this.userProfile = this.userProfileService.getProfile();

    this.eventImageFiles = [];
    this.eventImagePreview = [];
    this.eventImage = [];

    const id = this.eventService.getEventId();

    this.states = this.countryService.getStates();
    this.cities = [];

    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      // eventType: new FormControl( '', {
      //   validators: [Validators.required],
      // }),
      sport: new FormControl('', {
        validators: [Validators.required],
      }),
      registrationType: new FormControl('', {
        validators: [Validators.required],
      }),
      noOfPlayers: new FormControl(null, {
        validators: [Validators.required],
      }),
      startDate: new FormControl(null, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(null, {
        validators: [Validators.required],
      }),
      registerTill: new FormControl(null, {
        validators: [Validators.required],
      }),
      // time: new FormControl( null, {
      //   validators: [Validators.required],
      // }),
      description: new FormControl(null, {
        validators: [Validators.required],
      }),
      winningPrice: new FormControl(null, {
        validators: [Validators.required],
      }),
      fees: new FormControl(null, {
        validators: [Validators.required, Validators.min(0)],
      }),
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

    if (id) {
      this.editingMode = true;
      this.eventService.getEvent(id).subscribe(
        (event: EventModel) => {
          this.event = event;
          this.form.patchValue({
            name: event.name,
            // eventType: event.eventType,
            sport: event.sport,
            registrationType: event.registrationType,
            noOfPlayers: event.noOfPlayers,
            address: event.address,
            state: event.state,
            startDate: this.dateService.convertToDateString(event.startDate),
            endDate: this.dateService.convertToDateString(event.endDate),
            registerTill: this.dateService.convertToDateString(event.registerTill),
            // time: event.time,
            description: event.description,
            winningPrice: event.winningPrice,
            fees: event.fees,
          });

          this.changeState(event.state);

          this.form.patchValue({
            city: event.city,
          });

          this.changeCity(event.city);

          this.eventImage = event.images;

          this.form.get('sport').disable();
          this.form.get('registrationType').disable();
          this.form.get('fees').disable();

          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
    }
  }

  changeState(name: string) {
    console.log(name);
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
    this.eventService.deleteEventImage(id, imageId, i).subscribe(
      (res: any) => {
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  saveEvent() {
    // if (this.editingMode) {
    //   if (this.eventImageFiles.length === 0 && this.eventImage.length === 0) {
    //     return;
    //   }
    // } else {
    //   if (this.eventImageFiles.length === 0) {
    //     return;
    //   }
    // }

    if (this.form.valid) {
      this.savingRecord = true;
      const event = new FormData();
      if (this.event && this.editingMode) {
        event.append('_id', this.event._id);
      }
      event.append('name', this.form.value.name);
      event.append('sport', this.form.value.sport);
      event.append('registrationType', this.form.value.registrationType);
      event.append('startDate', this.form.value.startDate);
      event.append('endDate', this.form.value.endDate);
      event.append('registerTill', this.form.value.registerTill);
      // event.append('time', this.form.value.time);
      event.append('noOfPlayers', this.form.value.noOfPlayers);
      event.append('address', this.form.value.address);
      event.append('state', this.form.value.state);
      event.append('city', this.form.value.city);
      event.append('latitude', this.city.latitude);
      event.append('longitude', this.city.longitude);
      event.append('description', this.form.value.description);
      event.append('winningPrice', this.form.value.winningPrice);
      event.append('fees', this.form.value.fees);
      event.append('createdBy', this.userProfile.email);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.eventImageFiles.length; i++) {
        event.append('eventImage', this.eventImageFiles[i]);
      }

      this.eventService.saveEvent(event, this.editingMode).subscribe(
        (resEvent: EventModel) => {
          if (!this.editingMode) {
            this.form.reset();
          } else {
            this.event = resEvent;
            this.eventImage = resEvent.images;
          }
          this.savingRecord = false;
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

  close() {
    this.location.back();
  }

  ngOnDestroy() {
    this.eventService.setEventId(null);
  }
}
