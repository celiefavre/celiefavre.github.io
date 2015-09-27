jQuery(document).ready(function ($) {
    'use strict';
    // variables
    var $transformer = $('.content');
    var $emdr = $('.home-anim-word--1');
    var $psychotherapies = $('.home-anim-word--2');
    var $evaluation = $('.home-anim-word--3');

    // menu
    $('.menu-toggle').on('click', function (event) {
        event.preventDefault();
        $transformer.toggleClass('is-open');
    });

    $('.close-btn').on('click', function (event) {
        event.preventDefault();
        $transformer.removeClass('is-open');
    });

    // animations
    var tlAnimMots = new TimelineMax({
        delay: 1,
        repeat: 0
    });

    tlAnimMots
        .fromTo($emdr, 1, {xPercent: -400}, {xPercent: 10, ease: Power2.easeOut})
        .fromTo($psychotherapies, 1, {xPercent: -400}, {xPercent: 50, ease: Power2.easeOut})
        .fromTo($evaluation, 3, {xPercent: -400}, {xPercent: 235, ease: Elastic.easeOut.config(1, 0.5)})
    ;

    // svg
    TweenMax.from(
        $(".chart-stroke"), 6, {
            drawSVG: "0%",
            ease: Power1.easeInOut
        });


    var tlEyeMove = new TimelineMax({
        delay: 5,
        repeat: -1,
        yoyo: true
    });

    tlEyeMove.fromTo(
        $("#eye-move"), 2, {
            left: -10
        },
        {
            left: 10,
            ease: Power0.easeNone
        });

});
