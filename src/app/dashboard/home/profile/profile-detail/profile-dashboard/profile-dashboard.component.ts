import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss'],
})
export class ProfileDashboardComponent implements OnInit {
  userId: string;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((param: Params) => {
      this.userId = param.id;
      this.ngOnInit();
    });
  }

  ngOnInit(): void {}
}
