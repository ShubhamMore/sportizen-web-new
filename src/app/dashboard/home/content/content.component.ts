import { HomeService } from './../../../services/home.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DashboardSideDrawerService } from './../../../services/dashboard-side-drawer.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  loading = true;

  constructor(
    private dashboardSideDrawerService: DashboardSideDrawerService,
    private homeService: HomeService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.homeService.setRoute('Home');
    // setTimeout(() => {
    //   this.loading = false;
    // }, 5000);
    this.titleService.setTitle('SPORTIZEN | Feed');
    // this.dashboardSideDrawerService.openDrawer();
  }
}
