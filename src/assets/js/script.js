$(document).ready(function () {
  /*STICKY NAVIGATION*/
  $('.js--section-service').waypoint(
    function (direction) {
      if (direction == 'down') {
        $('.js--home').removeClass('hide-logo');
        $('nav').addClass('sticky');
        $('.btn-top-link').addClass('show-top-btn');
      } else {
        $('.js--home').addClass('hide-logo');
        $('nav').removeClass('sticky');
        $('.btn-top-link').removeClass('show-top-btn');
      }
    },
    {
      offset: '60px',
    }
  );

  /* ANIMATIONS */
  $('.js--animate-about').waypoint(
    function (direction) {
      $('.js--animate-about').addClass('animated fadeIn');
    },
    {
      offset: '75%',
    }
  );

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
    if ($(window).width() > 767) {
      nav.slideDown(200);
    } else {
      nav.slideUp(200);
    }
  });
});
