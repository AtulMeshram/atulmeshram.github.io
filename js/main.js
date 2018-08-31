"use strict";
/* =================================================
 For IE - Check browser supports transition or not
 ================================================= */

var supportsTransitions = (function () {
    var s = document.createElement('p').style,
            v = ['ms', 'O', 'Moz', 'Webkit'];
    if (s['transition'] == '')
        return true;
    while (v.length)
        if (v.pop() + 'Transition' in s)
            return true;
    return false;
})();

// check browser is IE or not and getVersion method returns version of IE
var browser = {
    isIe: function () {
        return navigator.appVersion.indexOf("MSIE") != -1;
    },
    navigator: navigator.appVersion,
    getVersion: function () {
        var version = 999; // we assume a sane browser
        if (navigator.appVersion.indexOf("MSIE") != -1)
            // bah, IE again, lets downgrade version number
            version = parseFloat(navigator.appVersion.split("MSIE")[1]);
        return version;
    }
};

// check device is iPad or not
var is_iPad = navigator.userAgent.match(/iPad/i) != null;
var isActionButtonsVisible = false;

/* =================================================
 Purchase theme button
 =================================================== */


// $(document).ready(function () {

//     var $buythemediv = '<div class="buy-theme-main sm-display-none"><div class="buy-theme alt-font"><a href="https://themeforest.net/item/muu-unique-and-creative-resume-portfolio-template/16706908?ref=themezaa" target="_blank"><span><i class="fa fa-shopping-cart" aria-hidden="true"></i> <span>Purchase Muu</span></span></a></div><div class="demo-theme alt-font"><a href="http://www.themezaa.com/html/muu/white/index.html"><span><i class="fa fa-desktop" aria-hidden="true"></i> <span>Light Demo</span></span></a></div></div>';
//     $('body').append($buythemediv);

// });

/* =================================================
 Check element is visible on viewport or not
 =================================================== */

$.fn.isOnScreen = function () {
    var viewport = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + $(window).height();
    var bounds = {};
    bounds.top = this.offset().top;
    bounds.bottom = bounds.top + this.outerHeight();
    return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
};

function isSafari9() {
    return !!navigator.userAgent.match(' Safari/') && !!navigator.userAgent.match(' Version/9.');
};

(function () {
    "use strict";
    /* =================================================
     Input placeholder 
     =================================================== */
    function add() {
        if ($(this).val() === '') {
            $(this).val($(this).attr('placeholder')).addClass('placeholder');
        }
    }

    function remove() {
        if ($(this).val() === $(this).attr('placeholder')) {
            $(this).val('').removeClass('placeholder');
        }
    }

    if (!('placeholder' in $('<input>')[0])) {
        $('input[placeholder], textarea[placeholder]').blur(add).focus(remove).each(add);
        $('form').submit(function () {
            $(this).find('input[placeholder], textarea[placeholder]').each(remove);
        });
    }

    /* =================================================
     Main slider
     =================================================== */

    /* cache jQuery objects */
    var slideshow = $('.cd-slideshow'),
            slides = slideshow.children('li'),
            navigation = $('.cd-slideshow-nav'),
            sliderdots = slideshow.find('ol.slider-dots').children('li'), isSwipe = false,
            _windowWidth = $(window).width();

    /* initialize varaibles */
    var delta = 0,
            scrollThreshold = 3,
            resizing = false,
            scrolling = false;

    if (isSafari9()) {
        scrollThreshold = 1;
    }

    /* check media query and bind corresponding events */
    var mq = windowWidth(slideshow.get(0)), bindToggle = false;

    /* bind mouse and keyboard events */
    bindEvents(mq, true);

    /* initilaize slidshow */
    initSlideshow(slideshow);

    /* refresh page while change orientation of mobile and tablet */
    $(window).on('orientationchange', function (event) {
        window.location.href = window.location.href;
    });

    /* on swipe, update visible sub-slides (if available) */
    /* initialize swipeup, swipedown, swipeleft and swiperight on slides*/

    for (var i = 0; i < slides.length; i++) {
        initTouchListeners(slides[i]);
    }

    function initTouchListeners(touchableElement) {
        $(touchableElement).swipe({
            excludedElements: ".owl-carousel,input,select,textarea",
            swipeLeft: function (event, direction, distance, duration, fingerCount) {
                var windowwidthforSwipe = $(window).width();
                if (windowwidthforSwipe > 767) {
                    isSwipe = true;
                    updateSubSlide($(this), 'next');
                    setTimeout(function () {
                        isSwipe = false;
                    }, 1000);
                }
            },
            swipeRight: function (event, direction, distance, duration, fingerCount) {
                var windowwidthforSwipe = $(window).width();
                if (windowwidthforSwipe > 767) {
                    isSwipe = true;
                    updateSubSlide($(this), 'prev');
                    setTimeout(function () {
                        isSwipe = false;
                    }, 1000);
                }
            },
            //Default is 75px, set to 0 for demo so any distance triggers swipe
            threshold: 75
        });

        if (mq == 'desktop') {
            $(touchableElement).swipe({
                excludedElements: ".owl-carousel,input,select,textarea",
                swipeUp: function (event, direction, distance, duration, fingerCount) {
                    var slimScrollDiv = $(event.target).parents('.slimScrollDiv').height(), slimScrollBar = $(event.target).parents('.slimScrollDiv').find('.slimScrollBar').height();
                    if ($(event.target).parents('.slimScrollDiv').length <= 0) {
                        isSwipe = true;
                        setTimeout(function () {
                            updateSlide('next');
                            isSwipe = false;
                        }, 100);
                    }
                    else if (slimScrollDiv == slimScrollBar) {
                        isSwipe = true;
                        setTimeout(function () {
                            updateSlide('next');
                            isSwipe = false;
                        }, 100);
                    }
                },
                swipeDown: function (event, direction, distance, duration, fingerCount) {
                    var slimScrollDiv = $(event.target).parents('.slimScrollDiv').height(), slimScrollBar = $(event.target).parents('.slimScrollDiv').find('.slimScrollBar').height();
                    if ($(event.target).parents('.slimScrollDiv').length <= 0) {
                        isSwipe = true;
                        setTimeout(function () {
                            updateSlide('prev');
                            isSwipe = false;
                        }, 100);
                    }
                    else if (slimScrollDiv == slimScrollBar) {
                        isSwipe = true;
                        setTimeout(function () {
                            updateSlide('prev');
                            isSwipe = false;
                        }, 100);
                    }
                },
                //Default is 75px, set to 0 for demo so any distance triggers swipe
                threshold: 75
            });
        }
    };

    /* update slideshow if user clicks on a not-visible slide (desktop version only)*/
    slides.on('click', function (event) {
        if (!isSwipe) {
            var slide = $(this);
            if (mq == 'desktop' && !slide.hasClass('visible')) {
                updateSlide('nav', slide);
            } else if (mq == 'desktop' && $(event.target).parents('.sub-visible').length == 0 && $(event.target).parents('.sub-slides').length > 0) {
                var newSubSlide = $(event.target).parents('.cd-slider-content').parent('li'),
                        direction = (newSubSlide.prev('.sub-visible').length > 0) ? 'next' : 'prev';
                updateSubSlide(slide, direction);
            }
        }
    });

    /* update subslide while clicking on slider dots */
    sliderdots.on('click', function (event) {
        var slideIndex = $(this).index(),
        listItem = $(this).parents('li'),
        subSlidesWrapper = listItem.children('.sub-slides'),
        visibleSubSlide = subSlidesWrapper.children('.sub-visible'),
        newSlide = $(this).parent('ol').parent('li').children('.sub-slides').children('li').eq(slideIndex);
        var translate = 0,
        marginSlide = Number(listItem.find('.cd-slider-content').eq(0).css('margin-right').replace('px', '')) * 6,
        windowWidth = window.innerWidth;
        windowWidth = (mq == 'desktop') ? windowWidth - marginSlide : windowWidth;

        if (!$(this).hasClass('active')) {
            var newSubSlidePosition = newSlide.index();
            translate = parseInt((-newSubSlidePosition * windowWidth), 10);
            setTransformValue(subSlidesWrapper.get(0), 'translateX', translate + 'px');
            visibleSubSlide.removeClass('sub-visible');
            newSlide.addClass('sub-visible');
            updateSlideDots(listItem.children('.slider-dots'), 'nav', slideIndex);
        }
    });

    /* open/close main navigation*/
    navigation.on('click', '.cd-nav-trigger', function () {
        if (navigation.hasClass('nav-open') && mq == 'desktop')
            $(window).on('DOMMouseScroll mousewheel', updateOnScroll);
        else if (!navigation.hasClass('nav-open') && mq == 'desktop')
            $(window).off('DOMMouseScroll mousewheel', updateOnScroll);
        navigation.toggleClass('nav-open');
    });

    /* select a slide from the navigation */
    navigation.on('click', 'a', function (event) {
        var _this = $(this);
        var windowWidth = $(window).width();
        var selectedItem = $(event.target),
        isSubSlide = (selectedItem.parents('.sub-nav').length > 0),
        slideIndex = (!isSubSlide) ? selectedItem.parent('li').index() : selectedItem.parents('.sub-nav').parent('li').index(),
        newSlide = slides.eq(slideIndex);
        slideshow.addClass('remove-transitions');
        navigation.removeClass('nav-open');
        if (supportsTransitions) {
            navigation.removeClass('nav-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                slideshow.removeClass('remove-transitions');
                if (mq == 'desktop') {
                    //event.preventDefault();

                    $(updateSlide('nav', newSlide)).promise().done(function () {
                        _this.parents('.menu-items').find('li').removeClass('active');
                        _this.parent('li').addClass('active');

                    });
                    $(window).on('DOMMouseScroll mousewheel', updateOnScroll);
                }

                if (windowWidth >= 768) {
                    if (!isSubSlide) {
                        newSlide.children('.sub-slides').attr('style', '').children('li.sub-visible').removeClass('sub-visible').end().children('li').eq(0).addClass('sub-visible');
                        updateSlideDots(newSlide.children('.slider-dots'), 'nav', 0);
                    } else {
                        var subIndex = selectedItem.parent('li').index() + 1,
                                visibleSubSlide = newSlide.children('.sub-slides').children('li').eq(subIndex);
                        updateSubSlide(newSlide, 'nav', visibleSubSlide);
                    }
                }
            });
        }
        else {
            if (mq == 'desktop') {

                $(updateSlide('nav', newSlide)).promise().done(function () {
                    _this.parents('.menu-items').find('li').removeClass('active');
                    _this.parent('li').addClass('active');

                });
                $(window).on('DOMMouseScroll mousewheel', updateOnScroll);
            }

            if (windowWidth >= 768) {
                if (!isSubSlide) {
                    newSlide.children('.sub-slides').attr('style', '').children('li.sub-visible').removeClass('sub-visible').end().children('li').eq(0).addClass('sub-visible');
                    updateSlideDots(newSlide.children('.slider-dots'), 'nav', 0);
                } else {
                    var subIndex = selectedItem.parent('li').index() + 1,
                            visibleSubSlide = newSlide.children('.sub-slides').children('li').eq(subIndex);
                    updateSubSlide(newSlide, 'nav', visibleSubSlide);
                }
            }
        }
        _this.parents('.menu-items').find('li.active').removeClass('active');
        _this.parent('li').addClass('active');
    });

    /* go to one slide to another slide in same page */
    $('.inner-link').on('touchstart click', function (event) {
        var _this = $(this);
        if (mq == 'desktop') {

            setTimeout(function () {
                var selectedItem = _this, li = $(selectedItem.attr('href')), slide = li.parents('li');

                if (slide.length > 0) {
                    if (!slide.hasClass('visible'))
                        updateSlide('nav', slide);
                    if (!li.hasClass('sub-visible'))
                        updateSubSlide(slide, 'nav', li);
                }
                else {
                    slide = li;
                    if (!slide.hasClass('visible'))
                        updateSlide('nav', slide);
                }
            }, 500);
        }
        else {
            var selectedItem = _this, li = $(selectedItem.attr('href')), listItem = li.parents('li'), slideIndex = li.index();
            var windowWidth = $(window).width();
            if (windowWidth >= 768) {
                if (listItem.length > 0) {
                    $('html, body').animate({
                        scrollTop: $(listItem).offset().top - 70
                    }, 500, function () {
                        listItem.children('.slider-dots').find('li').eq(slideIndex).trigger("click");
                    });
                }
                else {
                    listItem = li;
                    var menuitem = navigation.find('.menu-items a[href=#' + listItem.attr('id') + ']');
                    if (menuitem.length > 0)
                        menuitem.trigger("click");
                }
            }
            else {
                $('html, body').animate({
                    scrollTop: $(selectedItem.attr('href')).offset().top - 50
                }, 1000);
                event.preventDefault();
            }
        }

        if (_this.attr('href').indexOf('#') != -1) {
            event.preventDefault();
        }

    });


    /* update slideshow position on resize */
    $(window).on('resize', function () {
        if (browser.isIe() && browser.getVersion() <= 9) {
            window.location.href = window.location.href;
        }
        if (!resizing) {
            (!window.requestAnimationFrame) ? updateOnResize() : window.requestAnimationFrame(updateOnResize);
            resizing = true;
        }
    });

    /* update slideshow dot */
    function updateSlideDots(listItemNav, string, newSubIndex) {
        var activeDot = listItemNav.children('.active');

        if (string == 'next')
            var newDots = activeDot.next();
        else if (string == 'prev')
            var newDots = activeDot.prev();
        else
            var newDots = listItemNav.children('li').eq(newSubIndex);
        activeDot.removeClass('active');
        newDots.addClass('active');
    }

    /* update sub slide */
    function updateSubSlide(listItem, string, subSlide) {
        isActionButtonsVisible = false;
        $(".indication-right").hide();
        $(".indication-left").hide();
        $(".indication-bottom").hide();
        var translate = 0,
                listItemNav = listItem.children('.slider-dots'),
                marginSlide = Number(listItem.find('.cd-slider-content').eq(0).css('margin-right').replace('px', '')) * 8,
                windowWidth = window.innerWidth;

        windowWidth = (mq == 'desktop') ? windowWidth - marginSlide : windowWidth;

        if (listItem.children('.sub-slides').length > 0) {
            var subSlidesWrapper = listItem.children('.sub-slides'),
                    visibleSubSlide = subSlidesWrapper.children('.sub-visible');
            if (visibleSubSlide.length == 0)
                visibleSubSlide = subSlidesWrapper.children('li').eq(0).addClass('sub-visible');

            if (string == 'nav') {
                /* we have choosen a new slide from the navigation */
                var newSubSlide = subSlide;
            } else {
                var newSubSlide = (string == 'next') ? visibleSubSlide.next() : visibleSubSlide.prev();
            }

            if (newSubSlide.length > 0) {
                var newSubSlidePosition = newSubSlide.index();
                translate = parseInt((-newSubSlidePosition * windowWidth), 10);

                setTransformValue(subSlidesWrapper.get(0), 'translateX', translate + 'px');
                updateSlideDots(listItemNav, string, newSubSlidePosition);
                visibleSubSlide.removeClass('sub-visible');
                newSubSlide.addClass('sub-visible');

                if ($(newSubSlide).find('.timer').length > 0 && !$(newSubSlide).find('.timer').hasClass('appear') && isVisible($(newSubSlide).find('.timer'))) {
                    $(newSubSlide).find('.timer').addClass('appear');
                    animatecounters();
                }
                if ($(newSubSlide).find('.skillbar').length > 0 && !$(newSubSlide).find('.skillbar').hasClass('appear') && isVisible($(newSubSlide).find('.skillbar'))) {
                    var skillbars = $('.skillbar');
                    for (var i = 0; i < skillbars.length; i++) {
                        $(skillbars[i]).addClass('appear');
                        $(skillbars[i]).skillBars({
                            from: 0,
                            speed: 4000,
                            interval: 100,
                            decimals: 0,
                        });
                    }
                }
            }
        }

    }

    /* update slide */
    function updateSlide(string, slide) {
        isActionButtonsVisible = false;
        $(".indication-right").hide();
        $(".indication-left").hide();
        $(".indication-bottom").hide();

        /* switch from a slide to the next/previous one*/
        var visibleSlide = slides.filter('.visible'),
                marginSlide = (visibleSlide.find('.cd-slider-content').length > 0) ? Number(visibleSlide.find('.cd-slider-content').eq(0).css('margin-bottom').replace('px', '')) * 2.5 : 0,
                actualTranslate = getTranslateValue(slideshow.get(0), 'Y');

        if (string == 'nav') {
            /* we have choosen a new slide from the navigation */
            var newSlide = slide;
        } else {
            var newSlide = (string == 'next') ? visibleSlide.next() : visibleSlide.prev();
        }

        if (newSlide.length > 0) {
            $(window).off('DOMMouseScroll mousewheel', updateOnScroll);
            var translate = parseInt((-newSlide.offset().top + actualTranslate + marginSlide), 10);
            (translate > 0) && (translate = 0);
            setTransformValue(slideshow.get(0), 'translateY', translate + 'px');
            visibleSlide.removeClass('visible');
            newSlide.addClass('visible');
            (newSlide.find('.sub-visible').length == 0) && newSlide.find('.sub-slides').children('li').eq('0').addClass('sub-visible');

            if ($(newSlide).find('.timer').length > 0 && !$(newSlide).find('.timer').hasClass('appear') && isVisible($(newSlide).find('.timer'))) {
                $(newSlide).find('.timer').addClass('appear');
                animatecounters();
            }
            if ($(newSlide).find('.skillbar').length > 0 && !$(newSlide).find('.skillbar').hasClass('appear') && isVisible($(newSlide).find('.skillbar'))) {
                var skillbars = $('.skillbar');
                for (var i = 0; i < skillbars.length; i++) {
                    $(skillbars[i]).addClass('appear');
                    $(skillbars[i]).skillBars({
                        from: 0,
                        speed: 4000,
                        interval: 100,
                        decimals: 0,
                    });
                }
            }

            var newSlideID = newSlide.attr("id");
            $('.nav-middle-block li').removeClass("active");
            var navmiddleblocks = $('.nav-middle-block a');
            for (var i = 0; i < navmiddleblocks.length; i++) {
                var currLink = $(navmiddleblocks[i]);
                var href = currLink.attr("href").substr(1);
                if (newSlideID == href) {
                    currLink.parent('li').addClass("active");
                }
            }

        }
    }

    /* update slideshow on resize */
    function updateOnResize() {
        /* remove height from slide's element which has class "content-wrapper" */
        var width = $(window).width();
        if (width > 991) {
            $('.sub-slides').children('li').find('.content-wrapper').css("height", "");
        }
        mq = windowWidth(slideshow.get(0));
        bindEvents(mq, bindToggle);
        if (mq == 'mobile') {
            bindToggle = true;

            /* set translateX to 0 if browser widht is less than or equal to 767 */
            var windowwidthforSwipe = $(window).width();
            if (windowwidthforSwipe <= 767) {
                setTimeout(function () {
                    for (var i = 0; i < slides.length; i++) {
                        if ($(slides[i]).children('.sub-slides').length > 0) {
                            setTransformValue($(slides[i]).children('.sub-slides').get(0), 'translateX', 0 + 'px');
                        }
                    }

                }, 200);
            }

            slideshow.attr('style', '').children('.visible').removeClass('visible');

        } else {
            bindToggle = false;
        }


        initSlideshow(slideshow);

        /* set height for slide's element which has class "content-wrapper" */
        setTimeout(function () {
            SetSlideHeights();
        }, 1000);

        resizing = false;

        /* if menu is open on resize and browser width is greater than 767 then unbind DOMMouseScroll and mousewheel events from window*/
        if (navigation.hasClass('nav-open') && mq == 'desktop') {
            setTimeout(function () {
                $(window).off('DOMMouseScroll mousewheel', updateOnScroll);
            }, 1000);
        }

    }

    var enableRun = true;
    var MacChrome = false;
    function scrollHijacking(event) {

        if (navigator.appVersion.indexOf("Mac") != -1) {
            if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) {
                MacChrome = true;
            }
        }

        if (MacChrome) {
            if (enableRun) {
                if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) {
                    delta--;
                    (Math.abs(delta) >= scrollThreshold) && updateSlide('prev');
                } else {
                    delta++;

                    (delta >= scrollThreshold) && updateSlide('next');
                }
                enableRun = false;

                setTimeout(function () {
                    enableRun = true;
                }, 100);

            }
        }
        else {
            if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) {
                delta--;
                (Math.abs(delta) >= scrollThreshold) && updateSlide('prev');
            } else {
                delta++;

                (delta >= scrollThreshold) && updateSlide('next');
            }
        }

        scrolling = false;
        return false;
    }

    function setActionButtons(event) {
        isActionButtonsVisible = true;
        var subSlide = $(event.target).parents('li.sub-visible');
        if (subSlide.length > 0) {
            var parentSlide = $(subSlide).parents('li.visible');
            //Next Slide
            if (subSlide.next().length > 0) {
                $(".indication-right").show();
                $(".indication-right").on("click", function notify() {
                    updateSubSlide(parentSlide, 'nav', subSlide.next());
                    $(".indication-right").hide();
                    $(".indication-left").hide();
                    $(".indication-bottom").hide();
                });

            }

            //Previouse Slide
            if (subSlide.prev().length > 0) {
                $(".indication-left").show();
                $(".indication-left").on("click", function () {
                    updateSubSlide(parentSlide, 'nav', subSlide.prev());
                    $(".indication-right").hide();
                    $(".indication-left").hide();
                    $(".indication-bottom").hide();
                });
            }

            //Below Slide
            if (parentSlide.next().length > 0) {
                $(".indication-bottom").show();
                $(".indication-bottom").on("click", function () {
                    updateSlide('nav', parentSlide.next());

                    $(".indication-right").hide();
                    $(".indication-left").hide();
                    $(".indication-bottom").hide();
                });

            }
        }
        else {
            var Slide = $(event.target).parents('li.visible');
            //Below Slide
            if (Slide.next().length > 0) {
                $(".indication-bottom").show();
                $(".indication-bottom").on("click", function () {
                    updateSlide('nav', Slide.next());
                    $(".indication-right").hide();
                    $(".indication-left").hide();
                    $(".indication-bottom").hide();
                });
            }
        }
    }

    function updateOnScroll(event) {

        var slimScrollDiv = $(event.target).parents('.slimScrollDiv').height(),
         slimScrollBarHeight = $(event.target).parents('.slimScrollDiv').find('.slimScrollBar').height();

        if ($(event.target).parents('.slimScrollDiv').length > 0 && slimScrollDiv != slimScrollBarHeight) {

            if (!isActionButtonsVisible) {
                setActionButtons(event);
            }

            return false;
        }
        isActionButtonsVisible = false;

        if (browser.isIe() && browser.getVersion() <= 9) {
            if (!scrolling) {
                scrolling = true;
                scrollHijacking(event);
                scrolling = false;
            }
        } else {
            if (!scrolling) {
                (!window.requestAnimationFrame) ? scrollHijacking(event) : window.requestAnimationFrame(function () {
                    scrollHijacking(event);
                });
                scrolling = true;

            }
        }
    }

    if (mq == 'desktop') {
        $(window).on('DOMMouseScroll mousewheel', updateOnScroll);
    }

    function bindEvents(MQ, bool) {
        $(window).focus();
        if (MQ == 'desktop' && bool) {

            $(window).on('DOMMouseScroll mousewheel', updateOnScroll);
            $(document).on('keydown', function (event) {
                if (event.which == '40') {
                    event.preventDefault();
                    updateSlide('next');
                } else if (event.which == '38') {
                    event.preventDefault();
                    updateSlide('prev');
                } else if (event.which == '39') {
                    var visibleSlide = slides.filter('.visible');
                    updateSubSlide(visibleSlide, 'next');
                } else if (event.which == '37') {
                    var visibleSlide = slides.filter('.visible');
                    updateSubSlide(visibleSlide, 'prev');
                }
            });
        } else if (MQ == 'mobile') {
            $(window).off('DOMMouseScroll mousewheel', updateOnScroll);
            $(document).off('keydown');
        }
    }

    function createSubSlideDots(container, slideNumber) {
        /* create dots i slide has sub-slides */
        if (container.find('.slider-dots').length == 0) {
            var navigationWrapper = $('<ol class="slider-dots"></ol>').appendTo(container);
            for (var i = 0; i < slideNumber; i++) {
                var navItem = (i == 0) ? $('<li class="active"></li>') : $('<li></li>');
                navItem.appendTo(navigationWrapper);
            }
        }
        sliderdots = slideshow.find('ol.slider-dots').children('li');
    }

    function initSlideshow(slideshow) {
        var windowWidth = window.innerWidth;
        var slideshowchilds = slideshow.children('li');
        for (var i = 0; i < slideshowchilds.length; i++) {
            var slide = $(slideshowchilds[i]),
            subSlideNumber = slide.children('.sub-slides').children('li').length,
            slideWidth = (subSlideNumber) * windowWidth;
            slideWidth = (slideWidth == 0) ? windowWidth : slideWidth;
            slide.css('width', slideWidth + 'px');

            if (subSlideNumber > 0) {
                var visibleSubSlide = slide.find('.sub-visible');
                if (visibleSubSlide.length == 0) {
                    visibleSubSlide = slide.find('li').eq(0);
                    visibleSubSlide.addClass('sub-visible');
                }
                updateSubSlide(slide, 'nav', visibleSubSlide);
                createSubSlideDots(slide, subSlideNumber);
            }
        }
        if (mq == 'desktop') {
            if (slides.filter('.visible').length == 0)
                slides.eq(0).addClass('visible');
            updateSlide('nav', slides.filter('.visible'));
        }
        else {
            var slide;
            for (var i = 0; i < slideshowchilds.length; i++) {
                if ($(slideshowchilds[i]).isOnScreen()) {
                    slide = $(slideshowchilds[i]);
                    return false;
                }
            }
            if (slide) {
                var newSlideID = slide.attr("id");
                $('.nav-middle-block li').removeClass("active");

                var navmiddleblocks = $('.nav-middle-block a');
                for (var i = 0; i < navmiddleblocks.length; i++) {
                    var currLink = $(navmiddleblocks[i]);
                    var href = currLink.attr("href").substr(1);
                    if (newSlideID == href) {
                        currLink.parent('li').addClass("active");
                    }
                }
            }
        }
    }

    function getTranslateValue(element, axis) {
        var elementStyle = window.getComputedStyle(element, null),
                elementTranslate = elementStyle.getPropertyValue("-webkit-transform") ||
                elementStyle.getPropertyValue("-moz-transform") ||
                elementStyle.getPropertyValue("-ms-transform") ||
                elementStyle.getPropertyValue("-o-transform") ||
                elementStyle.getPropertyValue("transform");

        if (elementTranslate.indexOf('(') >= 0) {
            elementTranslate = elementTranslate.split('(')[1];
            elementTranslate = elementTranslate.split(')')[0];
            elementTranslate = elementTranslate.split(',');
            var translateValue = (axis == 'X') ? elementTranslate[4] : elementTranslate[5];
        } else {
            var translateValue = 0;
        }

        return Number(translateValue);
    }

    function setTransformValue(element, property, value) {
        element.style["-webkit-transform"] = property + "(" + value + ")";
        element.style["-moz-transform"] = property + "(" + value + ")";
        element.style["-ms-transform"] = property + "(" + value + ")";
        element.style["-o-transform"] = property + "(" + value + ")";
        element.style["transform"] = property + "(" + value + ")";

        $(element).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            if (mq == 'desktop') {
                delta = 0;
                $(window).on('DOMMouseScroll mousewheel', updateOnScroll);
            }
        });

        if (browser.isIe() && browser.getVersion() <= 9) {
            if (mq == 'desktop') {
                delta = 0;
                $(window).on('DOMMouseScroll mousewheel', updateOnScroll);
            }
        }
    }

    function windowWidth(element) {
        var mq = window.getComputedStyle(element, '::before').getPropertyValue('content').replace(/["']/g, '');
        return mq;
    }

    /* update slide when user comes from different page when clicks on menu item*/
    var page = getParameterByName('page');
    if (page) {

        if (mq == 'desktop') {
            var slide = $('#' + page);
            updateSlide('nav', slide);
        }
        else {
            var li = $('#' + page), listItem = li.parents('li'), slideIndex = li.index();
            var _width = $(window).width();
            $('.sub-slides').imagesLoaded(function () {
                var _this = $(this);
                if (_width >= 768) {
                    if (listItem.length > 0) {
                        var menuitem = navigation.find('.menu-items a[href=#' + listItem.attr('id') + ']');
                        if (menuitem.length > 0) {
                            menuitem.trigger("click");
                        }
                        setTimeout(function () {
                            listItem.children('.slider-dots').find('li').eq(slideIndex).trigger("click");
                        }, 1000);
                    }
                    else {
                        listItem = li;
                        var menuitem = navigation.find('.menu-items a[href=#' + listItem.attr('id') + ']');
                        if (menuitem.length > 0) {
                            setTimeout(function () {
                                menuitem.trigger("click");
                            }, 1000);
                        }
                    }
                }
                else {
                    $('html, body').animate({
                        scrollTop: $(li).offset().top - 50
                    }, 1000);
                }
            });
        }
    }
    /* =================================================
     Ajax popup
     =================================================== */

    $('.work-details-popup').on('click', function () {
        var _this = $(this), li = $(this).closest('li').parents('li').eq(0), listItem = li.parents('li'), slideIndex = li.index();

        $.magnificPopup.open({
            items: {
                src: $(this).closest('figure').parent('li').find('.popup-main'),
            },
            type: 'inline',
            fixedContentPos: true,
            closeOnContentClick: false,
            callbacks: {
                beforeOpen: function () {
                },
                open: function () {
                    $('.mfp-wrap').addClass('popup-bg');
                    //ReloadOwlCarousel();
                },
                beforeClose: function () {
                    var _width = $(window).width();
                    if (_width >= 768) {
                        if (listItem.length > 0) {
                            var menuitem = navigation.find('.menu-items a[href=#' + listItem.attr('id') + ']');
                            if (!listItem.isOnScreen()) {
                                if (menuitem.length > 0)
                                    menuitem.trigger("click");
                                setTimeout(function () {
                                    listItem.children('.slider-dots').find('li').eq(slideIndex).trigger("click");
                                }, 1000);
                            }
                            else {
                                listItem.children('.slider-dots').find('li').eq(slideIndex).trigger("click");
                            }
                        }
                        else {
                            listItem = li;
                            if (!listItem.isOnScreen()) {
                                var menuitem = navigation.find('.menu-items a[href=#' + listItem.attr('id') + ']');
                                if (menuitem.length > 0)
                                    menuitem.trigger("click");
                            }
                        }
                    }
                    else {
                        $('html, body').animate({
                            scrollTop: $(_this).offset().top - 50
                        }, 1000);
                    }
                },
                close: function () {
                    $('.mfp-wrap').removeClass('popup-bg');
                }
            }
        });
    });


    /* =================================================
     Lightbox Gallery
     =================================================== */

    var groups = {};
    $('.galleryitem').each(function () {
        var id = parseInt($(this).attr('data-group'), 10);
        if (!groups[id]) {
            groups[id] = [];
        }
        groups[id].push(this);
    });

    $.each(groups, function () {
        $(this).magnificPopup({
            type: 'image',
            gallery: { enabled: true },
            callbacks: {
                beforeClose: function () {
                    var mp = $.magnificPopup.instance, t = $(mp.currItem.el[0]);

                    var _this = $(t), li = $(t).closest('li').parents('li').eq(0), listItem = li.parents('li'), slideIndex = li.index();
                    var _width = $(window).width();
                    if (_width >= 768) {
                        if (listItem.length > 0) {
                            var menuitem = navigation.find('.menu-items a[href=#' + listItem.attr('id') + ']');
                            if (!listItem.isOnScreen()) {
                                if (menuitem.length > 0)
                                    menuitem.trigger("click");
                                setTimeout(function () {
                                    listItem.children('.slider-dots').find('li').eq(slideIndex).trigger("click");
                                }, 1000);
                            }
                            else {
                                listItem.children('.slider-dots').find('li').eq(slideIndex).trigger("click");
                            }
                        }
                        else {
                            listItem = li;
                            if (!listItem.isOnScreen()) {
                                var menuitem = navigation.find('.menu-items a[href=#' + listItem.attr('id') + ']');
                                if (menuitem.length > 0)
                                    menuitem.trigger("click");
                            }
                        }
                    }
                    else {
                        $('html, body').animate({
                            scrollTop: $(_this).offset().top - 50
                        }, 1000);
                    }
                }
            }
        })
    });

    /* =================================================
     Iframe Popup - Youtube, Vimeo, Google map
     =================================================== */

    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        callbacks: {
            beforeClose: function () {

                var mp = $.magnificPopup.instance, t = $(mp.currItem.el[0]);

                var _this = $(t), li = $(t).closest('li').parents('li').eq(0), listItem = li.parents('li'), slideIndex = li.index();
                var _width = $(window).width();
                if (_width >= 768) {
                    if (listItem.length > 0) {
                        var menuitem = navigation.find('.menu-items a[href=#' + listItem.attr('id') + ']');
                        if (!listItem.isOnScreen()) {
                            if (menuitem.length > 0)
                                menuitem.trigger("click");
                            setTimeout(function () {
                                listItem.children('.slider-dots').find('li').eq(slideIndex).trigger("click");
                            }, 1000);
                        }
                        else {
                            listItem.children('.slider-dots').find('li').eq(slideIndex).trigger("click");
                        }
                    }
                    else {
                        listItem = li;
                        if (!listItem.isOnScreen()) {
                            var menuitem = navigation.find('.menu-items a[href=#' + listItem.attr('id') + ']');
                            if (menuitem.length > 0)
                                menuitem.trigger("click");
                        }
                    }
                }
                else {
                    $('html, body').animate({
                        scrollTop: $(_this).offset().top - 50
                    }, 1000);
                }
            }
        }
    });

    /* =================================================
     Owl slider
     =================================================== */

    $(".owl-slider").owlCarousel({
        autoPlay: false,
        slideSpeed: 1000,
        navigationText: ["<i class='fa fa-caret-left'></i>", "<i class='fa fa-caret-right'></i>"],
        navigation: true,
        pagination: false,
        items: 1,
        itemsDesktop: [1200, 1],
        itemsTablet: [1000, 1],
        itemsMobile: [700, 1]

    });
    $(".owl-slider-pagination").owlCarousel({
        autoPlay: false,
        slideSpeed: 1000,
        navigationText: ["<i class='fa fa-caret-left'></i>", "<i class='fa fa-caret-right'></i>"],
        navigation: false,
        pagination: true,
        items: 1,
        itemsDesktop: [1200, 1],
        itemsTablet: [1000, 1],
        itemsMobile: [700, 1]

    });

    /* =================================================
     Counter
     =================================================== */

    animatecounters();

    /* =================================================
     Portfolio filter shorting tab
     =================================================== */

    var $portfolio_filter = $('.grid');
    $portfolio_filter.imagesLoaded(function () {
        $portfolio_filter.isotope({
            itemSelector: 'li',
            layoutMode: 'masonry'
        });
    });

    var $grid_selectors = $('.portfolio-filter > li > a');
    $grid_selectors.on('click', function () {
        $grid_selectors.parent().removeClass('active');
        $(this).parent().addClass('active');
        var selector = $(this).attr('data-filter');
        $portfolio_filter.isotope({ filter: selector });
        return false;
    });

    /* windows resize event */
    $(window).resize(function () {
        SetResizeContent();
        setTimeout(function () {
            $portfolio_filter.isotope('layout');
        }, 500);
    });

    /* =================================================
     Full screen height 
     =================================================== */

    function SetResizeContent() {
        var minheight = $(window).height();
        $(".full-screen").css('min-height', minheight);
        setTimeout(function () {
            LoadSlimScroll();
        }, 1000);
    }
    SetResizeContent();

    /* =================================================
     Smooth scroll link for main navigation
     =================================================== */

    $('.menu-items li a').smoothScroll({
        speed: 900,
        offset: -69
    });

    /* =================================================
     Timer function
     =================================================== */

    $('.timer').appear();

    /* =================================================
     Skillbar function
     =================================================== */

    $('.skillbar').appear();

    /* =================================================
     Scroll to anchor tag
     =================================================== */

    $('.smooth-scrolling-link').on('touchstart click', function (event) {
        var _this = $(this), selectedItem = _this;
        $('html, body').animate({
            scrollTop: $(selectedItem.attr('href')).offset().top
        }, 1000);
        event.preventDefault();
    });

    /* =================================================
     Fit video
     =================================================== */
    $(".fit-videos").fitVids();

    /* =================================================
     active menu item on scroll
     =================================================== */

    if (is_iPad) {
        if (_windowWidth < 991) {
            $('.menu-items').onePageNav({
                scrollSpeed: 750,
                scrollThreshold: 0.5, // Adjust if Navigation highlights too early or too late
                currentClass: 'active'
            });
        }
    }
    else {
        $('.menu-items').onePageNav({
            scrollSpeed: 750,
            scrollThreshold: 0.5, // Adjust if Navigation highlights too early or too late
            currentClass: 'active'
        });
    }
})();

$(window).load(function () {
    $('.loading-wrap').fadeOut();
    /* =================================================
    set height for slide's element which has class "content-wrapper" 
    =================================================== */
    SetSlideHeights();

    /* =================================================
    set indication arrow
    =================================================== */
    var cookieValue = Cookies.get('indication');
    Cookies.set('indication', 'true', { expires: 1 });
    if (!cookieValue) {
        var item1 = $('.indication-right').hide(), item2 = $('.indication-bottom').hide(), item3 = $('.indication-left').hide();

        item1.fadeIn(1000, function () {
            item2.fadeIn(1000, function () {
                item3.fadeIn(1000, function () {
                    setTimeout(function () {
                        item1.fadeOut("slow");
                        item2.fadeOut("slow");
                        item3.fadeOut("slow");
                    }, 1500);
                });
            });
        });
    }
});

/* =================================================
 Content slim scroll bar
 =================================================== */

function LoadSlimScroll() {

    var width = $(window).width();
    var CustomScrollbar = $('.mCustomScrollbar');
    if (width > 991) {
        for (var i = 0; i < CustomScrollbar.length; i++) {
            $(CustomScrollbar[i]).slimScroll({
                height: 'auto',
                distance: '5px',
                size: '8px',
                color: '#727272'
            });
        }
    }
    else {
        for (var i = 0; i < CustomScrollbar.length; i++) {
            $(CustomScrollbar[i]).slimScroll({ destroy: true });

            var $elem = $(CustomScrollbar[i]),
                    events = jQuery._data($elem[0], "events");

            if (events) {
                jQuery._removeData($elem[0], "events");
            }
            $(CustomScrollbar[i]).removeAttr('style');
            $(CustomScrollbar[i]).parent().find('.slimScrollBar').remove();
            $(CustomScrollbar[i]).parent().find(".slimScrollRail").remove();
        }
    }

    /* slim scroll for navigation */
    $(".menu-customscrollbar").slimScroll({
        height: 'auto',
        distance: '5px',
        size: '5px',
        color: '#727272'
    });

}

/* =================================================
 Set height for ipad slider
 =================================================== */

/* set height for slide's element which has class "content-wrapper" */
function SetSlideHeights() {
    var width = $(window).width();
    if (width <= 991) {
        $('.sub-slides').children('li').find('.content-wrapper').css("height", "");

        $('.sub-slides').each(function () {
            var _this = $(this)
            $(this).imagesLoaded(function () {
                var heights = _this.children('li').find('.content-wrapper').map(function () {
                    return $(this).height();
                }).get(),
                        maxHeight = Math.max.apply(null, heights);

                _this.children('li').each(function () {
                    $(this).find('.content-wrapper').height(maxHeight);
                });
            });

        });
    }
    else {
        $('.sub-slides').children('li').find('.content-wrapper').css("height", "");
    }
}

/* =================================================
 Counter
 =================================================== */

function animatecounters() {
    $('.timer').each(count);
    function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }
}

/* =================================================
 Querystring
 =================================================== */

function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/* check element is visible or not */
function isVisible($el) {
    var winTop = $(window).scrollTop();
    var winBottom = winTop + $(window).height();
    var elTop = $el.offset().top;
    var elBottom = elTop + $el.height();
    return ((elBottom <= winBottom) && (elTop >= winTop));
}

$(document.body).on('appear', '.timer', function (e) {
    // this code is executed for each appeared element
    if (!$(this).hasClass('appear')) {
        animatecounters();
        $(this).addClass('appear');
    }
});

$(document.body).on('appear', '.skillbar', function (e) {
    // this code is executed for each appeared element
    if (!$(this).hasClass('appear')) {
        $(this).addClass('appear');
        $(this).skillBars({
            from: 0,
            speed: 4000,
            interval: 100,
            decimals: 0,
        });
    }
});

/*==============================================================
 countdown timer
 ==============================================================*/

$('#counter-event').countdown($('#counter-event').attr("data-enddate")).on('update.countdown', function (event) {
    var $this = $(this).html(event.strftime('' + '<div class="counter-container"><div class="counter-box first"><div class="number">%-D</div><span>Day%!d</span></div>' + '<div class="counter-box"><div class="number">%H</div><span>Hours</span></div>' + '<div class="counter-box"><div class="number">%M</div><span>Minutes</span></div>' + '<div class="counter-box last"><div class="number">%S</div><span>Seconds</span></div></div>'))
});

$('body').on('touchstart click', function (e) {
    if ($(window).width() < 992) {
    }
});

//contact form button event
$("#contact-button").on('click', function (event) {
    var error = ValidationContactForm();
    var _this = $(this);
    if (error) {
        _this.next('.loading').removeClass('display-none');
        _this.prop('disabled', true);
        $.ajax({
            type: "POST",
            url: "email-templates/contact.php",
            data: $("#contactform").serialize(),
            success: function (result) {
                $('input[type=text],textarea').each(function () {
                    $(this).val('');
                })
                $("#success").html(result);
                $("#success").fadeIn("slow");
                $('#success').delay(4000).fadeOut("slow");
                _this.next('.loading').addClass('display-none');
                _this.prop('disabled', false);
            },
            error: function () {
                _this.next('.loading').addClass('display-none');
                _this.prop('disabled', false);
            }
        });
    }
});



function ValidationContactForm() {
    var error = true;
    $('#contactform input[type=text]').each(function (index) {
        if (index == 0) {
            if ($(this).val() == null || $(this).val() == "") {
                $("#contactform").find("input:eq(" + index + ")").addClass("required-error");
                error = false;
            }
            else {
                $("#contactform").find("input:eq(" + index + ")").removeClass("required-error");
            }
        }
        else if (index == 1) {
            if (!(/(.+)@(.+){2,}\.(.+){2,}/.test($(this).val()))) {
                $("#contactform").find("input:eq(" + index + ")").addClass("required-error");
                error = false;
            } else {
                $("#contactform").find("input:eq(" + index + ")").removeClass("required-error");
            }
        }

    });
    return error;
}

//Coming soon contact form
$("#comingsoon-contact-button").on('click', function (event) {
    var error = ValidationcomingsoonContactForm();
    var _this = $(this);
    if (error) {
        _this.parents('form').find('.loading').removeClass('display-none');
        _this.prop('disabled', true);
        $.ajax({
            type: "POST",
            url: "email-templates/comingsoon-contact.php",
            data: $("#comingsoonscontactform").serialize(),
            success: function (result) {
                $('input[type=text],textarea').each(function () {
                    $(this).val('');
                })
                $("#success").html(result);
                $("#success").fadeIn("slow");
                $('#success').delay(4000).fadeOut("slow");
                _this.parents('form').find('.loading').addClass('display-none');
                _this.prop('disabled', false);
            },
            error: function () {
                _this.parents('form').find('.loading').addClass('display-none');
                _this.prop('disabled', false);
            }
        });
    }
});

function ValidationcomingsoonContactForm() {
    var error = true;
    $('#comingsoonscontactform input[type=text]').each(function (index) {
        if (index == 0) {
            if (!(/(.+)@(.+){2,}\.(.+){2,}/.test($(this).val()))) {
                $("#comingsoonscontactform").find("input:eq(" + index + ")").addClass("required-error");
                error = false;
            } else {
                $("#comingsoonscontactform").find("input:eq(" + index + ")").removeClass("required-error");
            }
        }

    });
    return error;
}
