import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DashboardSideDrawerService } from './../../services/dashboard-side-drawer.service';

import * as $ from 'jquery';

class NavTabLink {
  constructor(public link: string, public title: string, public icon: string) {}
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('drawer') public drawer: MatDrawer;

  loading: boolean;
  screenWidth: number;
  responsiveWidth: number;

  navLinks: NavTabLink[];
  activeNavLink: string;

  constructor(private dashboardSideDrawerService: DashboardSideDrawerService) {
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
  }

  ngOnInit(): void {
    this.navLinks = [
      new NavTabLink('/dashboard', 'Home', 'fa-home'),
      new NavTabLink('/dashboard/event', 'Events', 'fa-trophy'),
      new NavTabLink('/dashboard/blog', 'Blogs', 'fa-newspaper-o'),
      new NavTabLink('/dashboard/chat', 'Messages', 'fa-comment'),
      new NavTabLink('/dashboard', 'Notifications', 'fa-bell'),
      new NavTabLink('/dashboard', 'My Network', 'fa-users'),
    ];
    this.activeNavLink = this.navLinks[0].title;

    this.responsiveWidth = 1200;
    this.loading = true;
  }

  changeNavLink(link: string) {
    this.activeNavLink = link;
  }

  ngAfterViewInit(): void {
    this.dashboardSideDrawerService.setSideNav(this.drawer);

    let didScroll: any;
    let lastScrollTop = 0;
    const delta = 5;
    const navbarHeight = $('#dashboardLinks').outerHeight();

    $('#dashboardContent').scroll(function (event) {
      didScroll = true;
    });

    setInterval(function () {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    function hasScrolled() {
      const st = $('#dashboardContent').scrollTop();

      // Make sure they scroll more than delta
      if (Math.abs(lastScrollTop - st) <= delta) return;

      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        $('#dashboardLinks').removeClass('nav-down').addClass('nav-up');
        // $('.dashboard-link')
        //   .removeClass('disable-dashboard-link')
        //   .addClass('enable-dashboard-link');
      } else {
        // Scroll Up
        // if(st + $('#dashboardLinks').height() < $(document).height()) {
        $('#dashboardLinks').removeClass('nav-up').addClass('nav-down');
        // $('.dashboard-link')
        //   .removeClass('enable-dashboard-link')
        //   .addClass('disable-dashboard-link');
        // }
      }

      lastScrollTop = st;
    }
  }
}
