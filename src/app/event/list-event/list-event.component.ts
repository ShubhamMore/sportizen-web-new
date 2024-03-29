import { ConnectionService } from '../../services/user-services/connection.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from './../../services/event-services/event.service';
import { UserProfileService } from './../../services/user-services/user-profile.service';
import { EventModel } from './../../models/event-models/event.model';
import { environment } from './../../../environments/environment';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';
import { first } from 'rxjs/operators';

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

    this.backPosition = './';

    this.titleService.setTitle('SPORTIZEN | Events');

    this.userProfileService
      .getUserSportizenId()
      .pipe(first())
      .subscribe((sportizenId: string) => {
        this.sportizenId = sportizenId;
      });

    this.route.data.subscribe((data: any) => {
      this.type = data.type;

      if (this.sportizenId && ['joined', 'manage'].includes(this.type)) {
        this.backPosition = './../';
        this.getEvents(environment.limit, null, this.longitude, this.latitude);
      } else {
        this.getLocation();
      }
    });
  }

  ngAfterViewInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  newEvent() {
    if (this.sportizenId && this.type === 'list') {
      this.router.navigate([this.backPosition, 'new'], { relativeTo: this.route });
    }
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

  deleteEvent(id: string) {
    const i = this.events.findIndex((event: EventModel) => event._id === id);

    if (i !== -1) {
      this.events.splice(i, 1);
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }
}
