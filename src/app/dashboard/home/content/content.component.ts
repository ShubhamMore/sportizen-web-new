import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardSideDrawerService } from './../../../services/dashboard-side-drawer.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  loading = true;

  constructor(private dashboardSideDrawerService: DashboardSideDrawerService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 5000);

    this.dashboardSideDrawerService.openDrawer();
  }
}
