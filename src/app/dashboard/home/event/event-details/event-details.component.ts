import { ConnectionService } from './../../../../services/connection.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from './../../../../services/user-profile.service';
import { EventModel } from './../../../../models/event.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit {
  @Input('eventDetails') event: EventModel;

  constructor(
    private userProfileService: UserProfileService,
    private connectionService: ConnectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

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
}
