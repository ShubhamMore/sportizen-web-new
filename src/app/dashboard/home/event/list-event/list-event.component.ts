import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/@shared/confirm/confirm.component';
import { ConnectionService } from './../../../../services/connection.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EventService } from './../../../../services/event.service';
import { UserProfileService } from './../../../../services/user-profile.service';
import { EventModel } from './../../../../models/event.model';
import * as $ from 'jquery';
import { UserProfileModel } from './../../../../models/user-profile.model';
import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.scss'],
})
export class ListEventComponent implements OnInit, AfterViewInit, OnDestroy {
  events: EventModel[];
  userSportizenId: string;
  loading: boolean;
  loadingEvents: boolean;
  noMoreEvents: boolean;

  longitude: number;
  latitude: number;

  type: string;

  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private userProfileService: UserProfileService,
    private connectionService: ConnectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.route.queryParams.subscribe((param: Params) => {
    //   if (this.type !== param.type || (param.type && !['joined', 'manage'].includes(param.type))) {
    //     this.ngOnInit();
    //   }
    // });
  }

  scroll = (event: any): void => {
    if ($('.loading-event-container')) {
      const moreFeed = $('.loading-event-container').offset().top;
      const threshold = window.innerHeight + 250;

      if (moreFeed <= threshold) {
        const skip = this.events.length;
        if (!this.loadingEvents && !this.noMoreEvents) {
          this.getEvents(environment.limit, skip, this.longitude, this.latitude);
        }
      }
    }
  };

  ngOnInit(): void {
    this.loading = true;
    this.noMoreEvents = false;

    this.events = [];

    this.userProfileService.getProfileSubject().subscribe((userProfile: UserProfileModel) => {
      if (userProfile) {
        this.userSportizenId = userProfile.sportizenId;
      }
    });

    this.longitude = null;
    this.latitude = null;

    this.route.data.subscribe((data: any) => {
      this.type = data.type;

      if (['joined', 'manage'].includes(this.type)) {
        this.getEvents(environment.limit, null, this.longitude, this.latitude);
      } else {
        this.getLocation();
      }
    });
  }

  ngAfterViewInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  joinEvent(id: string) {
    // this.eventService.setEventId(id);
    this.router.navigate(['/dashboard/event/join', id], {
      relativeTo: this.route,
      // queryParams: { id },
    });
  }

  viewEvent(id: string) {
    //   this.eventService.setEventId(id);
    this.router.navigate(['/dashboard/event/view', id], {
      relativeTo: this.route,
      // queryParams: { id },
    });
  }

  editEvent(id: string) {
    // this.eventService.setEventId(id);
    this.router.navigate(['/dashboard/event/edit', id], { relativeTo: this.route });
  }

  viewProfile(id: string) {
    if (id === this.userProfileService.getProfile().sportizenId) {
      this.router.navigate(['/dashboard', 'profile'], { relativeTo: this.route });
    } else {
      this.connectionService.searchedSportizenId = id;
      this.router.navigate(['/dashboard', 'profile', id], { relativeTo: this.route });
    }
  }

  getRegistrations(registrations: any[]) {
    if (registrations.length > 6) {
      return registrations.slice(0, 6);
    }

    return registrations;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
        this.getEvents(environment.limit, null, this.longitude, this.latitude);
      });
    } else {
      this.getEvents(environment.limit, null, this.longitude, this.latitude);
    }
  }

  getEvents(limit: number, skip: number, longitude: number, latitude: number) {
    this.loadingEvents = true;

    let eventDetails = this.eventService.getAllEvents(limit, skip, longitude, latitude);

    if (this.type === 'joined') {
      eventDetails = this.eventService.getJoinedEvents(limit, skip);
    } else if (this.type === 'manage') {
      eventDetails = this.eventService.getMyEvents(limit, skip);
    }

    eventDetails.subscribe(
      (events: EventModel[]) => {
        if (events.length === 0) {
          this.noMoreEvents = true;
        } else {
          this.events.push(...events);
        }

        this.loading = false;
        this.loadingEvents = false;
      },
      (error: any) => {
        this.loading = false;
        this.loadingEvents = false;
      }
    );
  }

  deleteEvent(id: string, createdUser: string, i: number) {
    if (this.userSportizenId === createdUser) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { message: 'Do you really want to delete This Event?' },
        maxHeight: '90vh',
        disableClose: true,
      });

      // tslint:disable-next-line: deprecation
      dialogRef.afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.loading = true;
          this.eventService.deleteEvent(id).subscribe(
            (res: any) => {
              this.events.splice(i, 1);
            },
            (error: any) => {
              this.loading = false;
            }
          );
        }
      });
    }
  }

  limitDescription(desc: string) {
    const limit = 25;
    if (desc.length < limit) {
      return desc;
    }
    return desc.substring(0, limit) + '...';
  }

  formatDate(date: string) {
    return `${date.split('T')[0].split('-').reverse().join('-')} ${date.substring(
      date.indexOf('T') + 1,
      date.indexOf('.')
    )}`;
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }
}
