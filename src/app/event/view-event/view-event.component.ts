import { MatDialog } from '@angular/material/dialog';
import { ViewRegistrationComponent } from './view-registration/view-registration.component';
import { ConnectionService } from './../../services/connection.service';
import { EventTeamRegistrationService } from './../../services/event-team-registration.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventModel } from './../../models/event.model';
import { EventService } from './../../services/event.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserProfileService } from './../../services/user-profile.service';
import { EventPlayerRegistrationService } from './../../services/event-player-registration.service';
import { Title } from '@angular/platform-browser';
import { first } from 'rxjs/operators';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  contact: string;
}

interface Registration {
  _id: string;
  name: string;
  email: string;
  contact: string;
  userImageURL: string;
  teamName?: string;
  teamMembers?: TeamMember[];
}
@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss'],
})
export class ViewEventComponent implements OnInit, OnDestroy {
  loading: boolean;
  loadingPlayers: boolean;
  sportizenId: string;
  event: EventModel;
  players: Registration[];

  constructor(
    private eventService: EventService,
    private eventTeamRegistrationService: EventTeamRegistrationService,
    private eventPlayerRegistrationService: EventPlayerRegistrationService,
    private userProfileService: UserProfileService,
    private connectionService: ConnectionService,
    public dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadingPlayers = true;
    this.titleService.setTitle(`SPORTIZEN | Event`);

    this.userProfileService
      .getUserSportizenId()
      .pipe(first())
      .subscribe((sportizenId: string) => {
        this.sportizenId = sportizenId;
      });

    this.players = [];

    this.route.params.subscribe((param: Params) => {
      const id = param.id;

      let getEvent: any;
      if (id) {
        getEvent = this.eventService.getEvent(param.id);
      } else {
        this.router.navigate(['./../../'], { relativeTo: this.route, replaceUrl: true });
      }

      getEvent.subscribe(
        (event: EventModel) => {
          this.event = event;
          this.titleService.setTitle(`SPORTIZEN | Event | ${event.name}`);

          if (event.registrationType === 'individual') {
            this.getIndividualRegistrations();
          } else if (event.registrationType === 'team') {
            this.getTeamRegistrations();
          } else {
          }

          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.router.navigate(['./../../'], { relativeTo: this.route, replaceUrl: true });
        }
      );
    });
  }

  getIndividualRegistrations() {
    this.eventPlayerRegistrationService.getEventPlayers(this.event._id).subscribe(
      (players: Registration[]) => {
        this.players = players;
        this.loadingPlayers = false;
      },
      (error: any) => {}
    );
  }

  getTeamRegistrations() {
    this.eventTeamRegistrationService.getEventTeams(this.event._id).subscribe(
      (players: Registration[]) => {
        this.players = players;
        this.loadingPlayers = false;
      },
      (error: any) => {}
    );
  }

  viewTeamMembers(teamMembers: TeamMember[]) {
    const dialogRef = this.dialog.open(ViewRegistrationComponent, {
      data: { teamMembers },
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  getRegistrations(registrations: any[]) {
    if (registrations.length > 6) {
      return registrations.slice(0, 6);
    }
    return registrations;
  }

  viewProfile(id: string) {
    if (this.sportizenId && id === this.sportizenId) {
      this.router.navigate(['/dashboard', 'profile'], { relativeTo: this.route });
    } else {
      if (this.sportizenId) {
        this.connectionService.searchedSportizenId = id;
      }
      this.router.navigate(['/dashboard', 'profile', id], { relativeTo: this.route });
    }
  }

  ngOnDestroy() {
    // this.eventService.setEventId(null);
  }
}
