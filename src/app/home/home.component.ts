import { ActivatedRoute, Params } from '@angular/router';
import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./common-content.scss', './home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private route: ActivatedRoute) {}

  scroll = (event: any): void => {
    const navHeight = $('#nav').height();
    const homeHeight = $('.home').height() - navHeight * 0.775;
    const serviceHeight = $('.js--section-service').height();

    const aboutHeight = homeHeight + serviceHeight * 0.5;

    const scrollTop = document.body.scrollTop;

    if (scrollTop >= homeHeight) {
      $('.js--home').removeClass('hide-logo');
      $('nav').addClass('sticky');
      $('.btn-top-link').addClass('show-top-btn');
    } else {
      $('.js--home').addClass('hide-logo');
      $('nav').removeClass('sticky');
      $('.btn-top-link').removeClass('show-top-btn');
    }

    if (scrollTop >= aboutHeight) {
      $('.js--animate-about').addClass('animated fadeIn');
    } else {
      $('.js--animate-about').removeClass('animated fadeIn');
    }
  };

  ngOnInit(): void {
    $(window).on('load', function () {
      $('.js--nav-link').on('click', function () {
        if ($(window).width() < 768) {
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

      $('.js--home').on('click', function () {
        if ($(window).width() < 768) {
          const icon = $('.js--nav-icon i');
          const nav = $('.js--main-nav');
          nav.slideUp(200);
          icon.addClass('fa-list');
          icon.removeClass('fa-close');
        }
      });

      $(window).on('resize', function () {
        const nav = $('.js--main-nav');
        if ($(window).width() > 767) {
          nav.slideDown(200);
        } else {
          nav.slideUp(200);
        }
      });
    });
  }

  ngAfterViewInit() {
    window.addEventListener('scroll', this.scroll, true);

    this.route.fragment.subscribe((fragment: string) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        element.scrollIntoView();
      }
    });
  }

  navIconClick() {
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

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }
}
