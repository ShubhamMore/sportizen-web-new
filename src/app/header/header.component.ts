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
    $(document).ready(function () {
      /** MOBILE NAV */

      $('.js--nav-icon').click(function () {
        var nav = $('.js--main-nav');
        var icon = $('.js--nav-icon i');

        nav.slideToggle(200);

        if (icon.hasClass('fa-list')) {
          icon.addClass('fa-close');
          icon.removeClass('fa-list');
        } else {
          icon.addClass('fa-list');
          icon.removeClass('fa-close');
        }
      });

      $('.js--nav-link').click(function () {
        if ($(window).width() < 768) {
          var nav = $('.js--main-nav');
          var icon = $('.js--nav-icon i');
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

      $('.js--home').click(function () {
        if ($(window).width() < 768) {
          var icon = $('.js--nav-icon i');
          var nav = $('.js--main-nav');
          nav.slideUp(200);
          icon.addClass('fa-list');
          icon.removeClass('fa-close');
        }
      });

      $(window).resize(function () {
        var nav = $('.js--main-nav');
        if ($(window).width() > 1080) {
          nav.slideDown(200);
        } else {
          nav.slideUp(200);
        }
      });
    });
  }
}
