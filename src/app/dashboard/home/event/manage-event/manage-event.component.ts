import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/@shared/confirm/confirm.component';
import { ConnectionService } from './../../../../services/connection.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from './../../../../services/event.service';
import { UserProfileService } from './../../../../services/user-profile.service';
import { EventModel } from './../../../../models/event.model';
import * as $ from 'jquery';

@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.scss'],
})
export class ManageEventComponent implements OnInit, AfterViewInit, OnDestroy {
  events: EventModel[];
  userSportizenId: string;
  loading: boolean;
  loadingEvents: boolean;
  noMoreEvents: boolean;

  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private userProfileService: UserProfileService,
    private connectionService: ConnectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  scroll = (event: any): void => {
    if ($('.loading-event-container')) {
      const moreFeed = $('.loading-event-container').offset().top;

      const threshold = window.innerHeight + 50;

      if (moreFeed <= threshold) {
        const skip = this.events.length;
        if (!this.loadingEvents && !this.noMoreEvents) {
          this.getEvents(3, skip);
        }
      }
    }
  };

  ngOnInit(): void {
    this.loading = true;
    this.noMoreEvents = false;

    this.userSportizenId = this.userProfileService.getUserSportizenId();

    this.events = [];
    this.getEvents(3, null);
  }

  ngAfterViewInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  viewEvent(id: string) {
    this.eventService.setEventId(id);
    this.router.navigate(['../view'], { relativeTo: this.route, queryParams: { id } });
  }

  joinEvent(id: string) {
    this.eventService.setEventId(id);
    this.router.navigate(['../join'], { relativeTo: this.route, queryParams: { id } });
  }

  editEvent(id: string) {
    this.eventService.setEventId(id);
    this.router.navigate(['../edit'], { relativeTo: this.route });
  }

  viewProfile(id: string) {
    if (id === this.userProfileService.getProfile().sportizenId) {
      this.router.navigate(['../../', 'profile'], { relativeTo: this.route });
    } else {
      this.connectionService.searchedSportizenId = id;
      this.router.navigate(['../../', 'profile', id], { relativeTo: this.route });
    }
  }

  getRegistrations(registrations: any[]) {
    if (registrations.length > 6) {
      return registrations.slice(0, 6);
    }

    return registrations;
  }

  getEvents(limit: number, skip: number) {
    this.loadingEvents = true;

    this.eventService.getMyEvents(limit, skip).subscribe(
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
