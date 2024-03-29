import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    $(document).ready(() => {
      /** MOBILE NAV */
      $('.js--nav-icon').on('click', () => {
        const nav = $('.js--main-nav');
        const icon = $('.js--nav-icon i');

        nav.slideToggle(200);

        if (icon.hasClass('fa-list')) {
          icon.addClass('fa-close');
          icon.removeClass('fa-list');
        } else {
          icon.addClass('fa-list');
          icon.removeClass('fa-close');
        }
      });

      $('.js--nav-link').on('click', () => {
        if ($(window).width() < 1080) {
          const nav = $('.js--main-nav');
          const icon = $('.js--nav-icon i');
          nav.slideToggle(200);
          if (icon.hasClass('fa-list')) {
            icon.addClass('fa-close');
            icon.removeClass('fa-list');
          } else {
            icon.addClass('fa-list');
            icon.removeClass('fa-close');
          }
        }
      });

      $('.js--home').on('click', () => {
        if ($(window).width() < 1080) {
          const icon = $('.js--nav-icon i');
          const nav = $('.js--main-nav');
          nav.slideUp(200);
          icon.addClass('fa-list');
          icon.removeClass('fa-close');
        }
      });

      $(window).on('resize', () => {
        const icon = $('.js--nav-icon i');
        const nav = $('.js--main-nav');
        if ($(window).width() > 1080) {
          nav.slideDown(200);
        } else {
          if (icon.hasClass('fa-close')) {
            icon.removeClass('fa-close');
            icon.addClass('fa-list');
          }
          nav.slideUp(200);
        }
      });
    });
  }
}
