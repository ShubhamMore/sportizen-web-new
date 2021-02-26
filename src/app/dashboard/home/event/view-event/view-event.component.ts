import { Component, OnInit } from '@angular/core';
import { EventService } from './../../../../services/event.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { UserProfileService } from './../../../../services/user-profile.service';
import { EventModel } from './../../../../models/event.model';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss'],
})
export class ViewEventComponent implements OnInit {
  event: EventModel;
  userEmail: string;
  loading: boolean;

  constructor(
    private eventService: EventService,
    private userProfileService: UserProfileService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.userEmail = this.userProfileService.getUserEmail();

    this.route.params.subscribe((param: Params) => {
      const id = param.id;
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
    });
  }
}
