import { ConnectionService } from './../../../../services/connection.service';
import { EventTeamRegistrationService } from './../../../../services/event-team-registration.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventModel } from './../../../../models/event.model';
import { EventService } from './../../../../services/event.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { UserProfileService } from './../../../../services/user-profile.service';
import { ObjectId } from 'bson';
import { EventPlayerRegistrationService } from './../../../../services/event-player-registration.service';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss'],
})
export class ViewEventComponent implements OnInit, OnDestroy {
  event: EventModel;
  userEmail: string;
  loading: boolean;

  constructor(
    private eventService: EventService,
    private eventTeamRegistrationService: EventTeamRegistrationService,
    private eventPlayerRegistrationService: EventPlayerRegistrationService,
    private userProfileService: UserProfileService,
    private connectionService: ConnectionService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.userEmail = this.userProfileService.getUserEmail();

    const id = this.eventService.getEventId();

    if (id) {
      this.eventService.getEvent(id).subscribe(
        (event: EventModel) => {
          this.event = event;

          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
        }
      );
    } else {
    }
  }

  getRegistrations(registrations: any[]) {
    if (registrations.length > 6) {
      return registrations.slice(0, 6);
    }
    return registrations;
  }

  viewProfile(id: string) {
    if (id === this.userProfileService.getProfile().sportizenId) {
      this.router.navigate(['../../', 'profile'], { relativeTo: this.route });
    } else {
      this.connectionService.searchedSportizenId = id;
      this.router.navigate(['../../', 'profile', id], { relativeTo: this.route });
    }
  }

  ngOnDestroy() {
    this.eventService.setEventId(null);
  }
}
