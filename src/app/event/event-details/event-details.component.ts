import { ConnectionService } from './../../services/connection.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from './../../services/user-profile.service';
import { EventModel } from './../../models/event.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { ConfirmComponent } from 'src/app/@shared/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit {
  @Input('eventDetails') event: EventModel;
  @Input('isList') isList: boolean;
  @Input('listType') listType: string;

  @Output() deletedEvent = new EventEmitter<string>();

  sportizenId: string;
  backPosition: string;
  isDeleting: boolean;

  constructor(
    private userProfileService: UserProfileService,
    private eventService: EventService,
    private dialog: MatDialog,
    private connectionService: ConnectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isDeleting = false;

    this.userProfileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.sportizenId = sportizenId;
    });

    if (this.isList && this.listType === 'list') {
      this.backPosition = './';
    } else {
      this.backPosition = './../';
    }
  }

  getRegistrations(registrations: any[]) {
    if (registrations.length > 6) {
      return registrations.slice(0, 6);
    }
    return registrations;
  }

  joinEvent(id: string, isRegistered: boolean) {
    if (this.event.createdBy === this.sportizenId) {
      return;
    } else if (isRegistered) {
      this.joinEventRoute(id);
      return;
    } else if (this.isRegistrationFull()) {
      return;
    } else {
      this.joinEventRoute(id);
    }
  }

  isRegistrationFull(): boolean {
    const noOfRegistrations = this.event.registrations.length;

    if (this.event.noOfRegistrations === noOfRegistrations) {
      return true;
    }

    return false;
  }

  private joinEventRoute(id: string) {
    if (this.sportizenId) {
      this.router.navigate([this.backPosition, 'join', id], {
        relativeTo: this.route,
      });
    }
  }

  viewEvent(id: string) {
    if (this.isList) {
      this.router.navigate([this.backPosition, 'view', id], {
        relativeTo: this.route,
      });
    }
  }

  editEvent(id: string) {
    if (this.sportizenId) {
      this.router.navigate([this.backPosition, 'edit', id], { relativeTo: this.route });
    }
  }

  loginForJoinEvent(id: string) {
    if (this.isRegistrationFull()) {
      return;
    }

    if (!this.sportizenId) {
      this.router.navigate(['/login'], {
        relativeTo: this.route,
        queryParams: { redirectTo: `event/join/${id}` },
      });
    }
  }

  deleteEvent(id: string, createdUser: string) {
    if (this.sportizenId === createdUser && !this.isDeleting) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { message: 'Do you really want to delete This Event?' },
        maxHeight: '90vh',
        disableClose: true,
      });

      // tslint:disable-next-line: deprecation
      dialogRef.afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.isDeleting = true;
          this.eventService.deleteEvent(id).subscribe(
            (res: any) => {
              this.deletedEvent.emit(id);
            },
            (error: any) => {
              this.isDeleting = false;
            }
          );
        }
      });
    }
  }

  viewProfile(id: string) {
    if (this.sportizenId) {
      const backPath = this.backPosition + (this.isList ? '' : '../') + '../';
      if (id === this.sportizenId) {
        this.router.navigate([backPath, 'profile'], { relativeTo: this.route });
      } else {
        this.connectionService.searchedSportizenId = id;
        this.router.navigate([backPath, 'profile', id], { relativeTo: this.route });
      }
    }
  }
}
