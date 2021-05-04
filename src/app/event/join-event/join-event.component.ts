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
import { MatDialog } from '@angular/material/dialog';
import { PaymentComponent } from './../../payment/payment.component';

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
  submit: boolean;
  acceptTCStatus: boolean;

  constructor(
    private eventService: EventService,
    private eventTeamRegistrationService: EventTeamRegistrationService,
    private eventPlayerRegistrationService: EventPlayerRegistrationService,
    private userProfileService: UserProfileService,
    private connectionService: ConnectionService,
    public dialog: MatDialog,
    private location: Location,
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.submit = false;

    this.acceptTCStatus = false;

    this.titleService.setTitle(`SPORTIZEN | Join Event`);

    this.route.params.subscribe((param: Params) => {
      const id = param.id;

      if (id) {
        this.eventService.getEvent(id).subscribe(
          (event: EventModel) => {
            this.event = event;

            if (event.registration) {
              this.acceptTCStatus = true;
            }

            this.titleService.setTitle(`SPORTIZEN | Join Event | ${event.name}`);

            this.userProfileService.getProfile().subscribe((userProfile: UserProfileModel) => {
              this.sportizenId = userProfile.sportizenId;

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

                if (event.registration) {
                  this.joinEventForm.patchValue({
                    name: event.registration.name,
                    email: event.registration.email,
                    contact: event.registration.contact,
                  });
                } else {
                  this.joinEventForm.patchValue({
                    name: userProfile.name,
                    email: userProfile.email,
                    contact: userProfile.phoneNo,
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

                  this.joinEventForm.controls.teamMembers['controls'][0].patchValue({
                    name: userProfile.name,
                    email: userProfile.email,
                    contact: userProfile.phoneNo,
                  });

                  // this.joinEventForm.controls[0].teamMembers.patchValue({
                  //   name: userProfile.name,
                  //   email: userProfile.email,
                  //   contact: userProfile.phoneNo,
                  // });
                }
              } else {
                this.back();
              }
              this.loading = false;
            });
          },
          (error: any) => {
            this.back();
          }
        );
      } else {
        this.back();
      }
    });
  }

  acceptTermsConditions(acceptTCStatus: boolean) {
    this.acceptTCStatus = acceptTCStatus;
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

  payNow() {
    this.joinEventForm.markAllAsTouched();
    if (this.joinEventForm.invalid) {
      // Show Error
      return;
    }

    if (!this.event.registration) {
      if (this.event.fees === 0) {
        this.registerNow();
        return;
      }

      const dialogRef = this.dialog.open(PaymentComponent, {
        data: { amount: this.event.fees, eventId: this.event._id },
        maxHeight: '90vh',
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result.status) {
          this.registerNow(result.orderId, result.receiptId);
        }
      });
    } else {
      this.registerNow();
    }
  }

  private registerNow(orderId?: string, receiptId?: string) {
    this.joinEventForm.markAllAsTouched();
    if (this.joinEventForm.invalid) {
      // Show Error
      return;
    }

    this.submit = true;

    const joinEventData = { event: this.event._id, ...this.joinEventForm.getRawValue() };

    if (!this.event.registration) {
      joinEventData.orderId = orderId;
      joinEventData.receiptId = receiptId;
    }

    if (this.event.registrationType === 'individual') {
      if (!this.event.registration) {
        this.eventPlayerRegistrationService.registerPlayer(joinEventData).subscribe(
          (res: any) => {
            this.event.registration = res;
            this.submit = false;
            this.back();
          },
          (error: any) => {
            this.submit = false;
          }
        );
      } else {
        joinEventData._id = this.event.registration._id;
        this.eventPlayerRegistrationService.updatePlayerRegistration(joinEventData).subscribe(
          (res: any) => {
            this.submit = false;
            this.back();
          },
          (error: any) => {
            this.submit = false;
          }
        );
      }
    } else if (this.event.registrationType === 'team') {
      if (!this.event.registration) {
        this.eventTeamRegistrationService.registerTeam(joinEventData).subscribe(
          (res: any) => {
            this.event.registration = res;
            this.submit = false;
            this.back();
          },
          (error: any) => {
            this.submit = false;
          }
        );
      } else {
        joinEventData._id = this.event.registration._id;
        this.eventTeamRegistrationService.updateTeamRegistration(joinEventData).subscribe(
          (res: any) => {
            this.submit = false;
            this.back();
          },
          (error: any) => {
            this.submit = false;
          }
        );
      }
    }
  }

  back() {
    this.location.back();
  }

  ngOnDestroy() {
    // this.eventService.setEventId(null);
  }
}
