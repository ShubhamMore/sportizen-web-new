import { UserProfileModel } from './../../models/user-profile.model';
import { ConnectionService } from './../../services/connection.service';
import { EventTeamRegistrationService } from './../../services/event-team-registration.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventModel } from './../../models/event.model';
import { EventService } from './../../services/event.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { UserProfileService } from './../../services/user-profile.service';
import { ObjectId } from 'bson';
import { EventPlayerRegistrationService } from './../../services/event-player-registration.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-join-event',
  templateUrl: './join-event.component.html',
  styleUrls: ['./join-event.component.scss'],
})
export class JoinEventComponent implements OnInit, OnDestroy {
  event: EventModel;
  loading: boolean;
  joinEventForm: FormGroup;
  sportizenId: string;

  constructor(
    private eventService: EventService,
    private eventTeamRegistrationService: EventTeamRegistrationService,
    private eventPlayerRegistrationService: EventPlayerRegistrationService,
    private userProfileService: UserProfileService,
    private connectionService: ConnectionService,
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.titleService.setTitle(`SPORTIZEN | Join Event`);

    this.route.params.subscribe((param: Params) => {
      const id = param.id;

      if (id) {
        this.eventService.getEvent(id).subscribe(
          (event: EventModel) => {
            this.event = event;

            this.titleService.setTitle(`SPORTIZEN | Join Event | ${event.name}`);

            if (event.registrationType === 'individual') {
              this.joinEventForm = new FormGroup({
                name: new FormControl(null, {
                  validators: [Validators.required],
                }),
                email: new FormControl(null, {
                  validators: [Validators.required, Validators.email],
                }),
                contact: new FormControl(null, {
                  validators: [
                    Validators.required,
                    Validators.min(1000000000),
                    Validators.max(9999999999),
                  ],
                }),
              });

              this.userProfileService.getProfile().subscribe((userProfile: UserProfileModel) => {
                if (userProfile) {
                  this.sportizenId = userProfile.sportizenId;

                  this.joinEventForm.patchValue({
                    name: userProfile.name,
                    email: userProfile.email,
                    contact: userProfile.phoneNo,
                  });
                }
              });

              if (event.registration) {
                this.joinEventForm.patchValue({
                  name: event.registration.name,
                  email: event.registration.email,
                  contact: event.registration.contact,
                });
              }
            } else if (event.registrationType === 'team') {
              this.joinEventForm = new FormGroup({
                teamName: new FormControl(null, {
                  validators: [Validators.required],
                }),
                teamMembers: new FormArray([]),
              });

              if (event.registration) {
                this.joinEventForm.patchValue({
                  teamName: event.registration.teamName,
                });

                event.registration.teamMembers.forEach((teamMember: any) => {
                  this.addTeamMember(teamMember);
                });
              } else {
                const noOfPlayers = +this.event.noOfPlayers;

                for (let i = 0; i < noOfPlayers; i++) {
                  this.generateTeamMember();
                }
              }
            } else {
              this.router.navigate(['./../../'], { relativeTo: this.route, replaceUrl: true });
            }
            this.loading = false;
          },
          (error: any) => {
            this.router.navigate(['./../../'], { relativeTo: this.route, replaceUrl: true });
          }
        );
      } else {
        this.router.navigate(['./../../'], { relativeTo: this.route, replaceUrl: true });
      }
    });
  }

  private getTeamMembers() {
    return this.joinEventForm.get('teamMembers') as FormArray;
  }

  private newTeamMember(teamMemberData: any) {
    return new FormGroup({
      _id: new FormControl(teamMemberData._id ? teamMemberData._id : new ObjectId().toString(), {
        validators: [Validators.required],
      }),
      name: new FormControl(teamMemberData.name ? teamMemberData.name : null, {
        validators: [Validators.required],
      }),
      email: new FormControl(teamMemberData.email ? teamMemberData.email : null, {
        validators: [Validators.required, Validators.email],
      }),
      contact: new FormControl(teamMemberData.contact ? teamMemberData.contact : null, {
        validators: [Validators.required, Validators.min(1000000000), Validators.max(9999999999)],
      }),
    });
  }

  getRegistrations(registrations: any[]) {
    if (registrations.length > 6) {
      return registrations.slice(0, 6);
    }
    return registrations;
  }

  viewProfile(id: string) {
    if (id === this.sportizenId) {
      this.router.navigate(['/dashboard', 'profile'], { relativeTo: this.route });
    } else {
      this.connectionService.searchedSportizenId = id;
      this.router.navigate(['/dashboard', 'profile', id], { relativeTo: this.route });
    }
  }

  private addTeamMember(teamMember: any) {
    const teamMembers = this.getTeamMembers();
    teamMembers.push(this.newTeamMember(teamMember));
  }

  generateTeamMember() {
    const teamMember = {
      _id: new ObjectId().toString(),
      name: null,
      email: null,
      contact: null,
    };
    this.addTeamMember(teamMember);
  }

  deleteTeamMember(i: number) {
    if (i !== 0) {
      const teamMembers = this.getTeamMembers();
      teamMembers.removeAt(i);
    }
  }

  registerNow() {
    this.joinEventForm.markAllAsTouched();
    if (this.joinEventForm.invalid) {
      // Show Error
      return;
    }

    const joinEventData = { event: this.event._id, ...this.joinEventForm.getRawValue() };

    if (this.event.registrationType === 'individual') {
      if (!this.event.registration) {
        this.eventPlayerRegistrationService.registerPlayer(joinEventData).subscribe(
          (res: any) => {
            this.event.registration = res;
            this.router.navigate(['./../'], { relativeTo: this.route });
          },
          (error: any) => {}
        );
      } else {
        joinEventData._id = this.event.registration._id;
        this.eventPlayerRegistrationService.updatePlayerRegistration(joinEventData).subscribe(
          (res: any) => {},
          (error: any) => {}
        );
      }
    } else if (this.event.registrationType === 'team') {
      if (!this.event.registration) {
        this.eventTeamRegistrationService.registerTeam(joinEventData).subscribe(
          (res: any) => {
            this.event.registration = res;
            this.router.navigate(['./../'], { relativeTo: this.route });
          },
          (error: any) => {}
        );
      } else {
        joinEventData._id = this.event.registration._id;
        this.eventTeamRegistrationService.updateTeamRegistration(joinEventData).subscribe(
          (res: any) => {
            this.router.navigate(['./../'], { relativeTo: this.route });
          },
          (error: any) => {}
        );
      }
    }
  }

  ngOnDestroy() {
    // this.eventService.setEventId(null);
  }
}
