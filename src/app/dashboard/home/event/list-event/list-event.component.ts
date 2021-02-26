import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from './../../../../services/event.service';
import { UserProfileService } from './../../../../services/user-profile.service';
import { AuthService } from './../../../../authentication/auth/auth-service/auth.service';
import { EventModel } from './../../../../models/event.model';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.scss'],
})
export class ListEventComponent implements OnInit {
  events: EventModel[];
  userSportizenId: string;
  loading: boolean;

  constructor(
    private eventService: EventService,
    private userProfileService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.userSportizenId = this.userProfileService.getUserSportizenId();

    this.events = [];

    this.getLocation();
  }

  joinEvent(id: string) {
    this.eventService.setEventId(id);
    this.router.navigate(['./join'], { relativeTo: this.route });
  }

  editEvent(id: string) {
    this.eventService.setEventId(id);
    this.router.navigate(['./edit'], { relativeTo: this.route });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.getEvents(position.coords.longitude, position.coords.latitude);
      });
    } else {
      this.getEvents(null, null);
    }
  }

  getEvents(longitude: number, latitude: number) {
    this.eventService.getAllEvents(longitude, latitude).subscribe(
      (events: EventModel[]) => {
        this.events = events;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  deleteEvent(id: string, createdUser: string, i: number) {
    if (this.userSportizenId === createdUser) {
      const confirm = window.confirm('DO you really want to delete This Event');
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
}
