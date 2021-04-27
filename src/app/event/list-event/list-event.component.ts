import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from './../../@shared/confirm/confirm.component';
import { ConnectionService } from './../../services/connection.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EventService } from './../../services/event.service';
import { UserProfileService } from './../../services/user-profile.service';
import { EventModel } from './../../models/event.model';
import { environment } from './../../../environments/environment';
import { Title, Meta } from '@angular/platform-browser';
import * as $ from 'jquery';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.scss'],
})
export class ListEventComponent implements OnInit, AfterViewInit, OnDestroy {
  events: EventModel[];
  sportizenId: string;
  loading: boolean;
  loadingEvents: boolean;
  noMoreEvents: boolean;

  longitude: number;
  latitude: number;

  type: string;
  backPosition: string;

  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private userProfileService: UserProfileService,
    private connectionService: ConnectionService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

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

    this.longitude = null;
    this.latitude = null;

    this.titleService.setTitle('SPORTIZEN | Events');

    this.userProfileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.sportizenId = sportizenId;

      this.route.data.subscribe((data: any) => {
        this.type = data.type;

        if (this.sportizenId && ['joined', 'manage'].includes(this.type)) {
          this.getEvents(environment.limit, null, this.longitude, this.latitude);
          this.backPosition = './../';
        } else {
          this.getLocation();
          this.backPosition = './';
        }
      });
    });
  }

  ngAfterViewInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  joinEvent(id: string) {
    if (this.sportizenId) {
      this.router.navigate([this.backPosition, 'join', id], {
        relativeTo: this.route,
      });
    }
  }

  viewEvent(id: string) {
    this.router.navigate([this.backPosition, 'view', id], {
      relativeTo: this.route,
    });
  }

  newEvent() {
    if (this.sportizenId) {
      this.router.navigate([this.backPosition, 'new'], { relativeTo: this.route });
    }
  }

  editEvent(id: string) {
    if (this.sportizenId) {
      this.router.navigate([this.backPosition, 'edit', id], { relativeTo: this.route });
    }
  }

  viewProfile(id: string) {
    if (id === this.sportizenId) {
      this.router.navigate([this.backPosition, '../', 'profile'], { relativeTo: this.route });
    } else {
      if (this.sportizenId) {
        this.connectionService.searchedSportizenId = id;
      }
      this.router.navigate([this.backPosition, '../', 'profile', id], { relativeTo: this.route });
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

    if (this.sportizenId) {
      if (this.type === 'joined') {
        this.titleService.setTitle('SPORTIZEN | Joined Events');
        eventDetails = this.eventService.getJoinedEvents(limit, skip);
      } else if (this.type === 'manage') {
        this.titleService.setTitle('SPORTIZEN | Manage Events');
        eventDetails = this.eventService.getMyEvents(limit, skip);
      }
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
    if (this.sportizenId === createdUser) {
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
