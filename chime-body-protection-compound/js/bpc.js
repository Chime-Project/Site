/* Chime Health: BPC product page (clone of healthletic.io/products/body-protection-compound).
   The reference's own scripts, in the order the page ran them. Runs on jQuery 3.7.1 + slick 1.9.0 (both MIT,
   self-hosted in js/), as the reference does. Shopify cart, Appstle subscriptions, FrontrowMD, Judge.me and
   every tracker are gone. Lines changed for Chime are marked CHIME. */

/* header: sticky on scroll-up (their theme's StickyHeader custom element, scripts.js) */
(function(){try{class StickyHeader extends HTMLElement{constructor(){super()}connectedCallback(){this.header=document.querySelector(".section-header"),this.headerIsAlwaysSticky=this.getAttribute("data-sticky-type")==="always"||this.getAttribute("data-sticky-type")==="reduce-logo-size",this.headerBounds={},this.setHeaderHeight(),window.matchMedia("(max-width: 990px)").addEventListener("change",this.setHeaderHeight.bind(this)),this.headerIsAlwaysSticky&&this.header.classList.add("shopify-section-header-sticky"),this.currentScrollTop=0,this.preventReveal=!1,this.predictiveSearch=this.querySelector("predictive-search"),this.onScrollHandler=this.onScroll.bind(this),this.hideHeaderOnScrollUp=()=>this.preventReveal=!0,this.addEventListener("preventHeaderReveal",this.hideHeaderOnScrollUp),window.addEventListener("scroll",this.onScrollHandler,!1),this.createObserver()}setHeaderHeight(){document.documentElement.style.setProperty("--header-height",`${this.header.offsetHeight}px`)}disconnectedCallback(){this.removeEventListener("preventHeaderReveal",this.hideHeaderOnScrollUp),window.removeEventListener("scroll",this.onScrollHandler)}createObserver(){new IntersectionObserver((entries,observer2)=>{this.headerBounds=entries[0].intersectionRect,observer2.disconnect()}).observe(this.header)}onScroll(){const scrollTop=window.pageYOffset||document.documentElement.scrollTop;if(!(this.predictiveSearch&&this.predictiveSearch.isOpen)){if(scrollTop>this.currentScrollTop&&scrollTop>this.headerBounds.bottom){if(this.header.classList.add("scrolled-past-header"),this.preventHide)return;requestAnimationFrame(this.hide.bind(this))}else scrollTop<this.currentScrollTop&&scrollTop>this.headerBounds.bottom?(this.header.classList.add("scrolled-past-header"),this.preventReveal?(window.clearTimeout(this.isScrolling),this.isScrolling=setTimeout(()=>{this.preventReveal=!1},66),requestAnimationFrame(this.hide.bind(this))):requestAnimationFrame(this.reveal.bind(this))):scrollTop<=this.headerBounds.top&&(this.header.classList.remove("scrolled-past-header"),requestAnimationFrame(this.reset.bind(this)));this.currentScrollTop=scrollTop}}hide(){this.headerIsAlwaysSticky||(this.header.classList.add("shopify-section-header-hidden","shopify-section-header-sticky"),this.closeMenuDisclosure(),this.closeSearchModal())}reveal(){this.headerIsAlwaysSticky||(this.header.classList.add("shopify-section-header-sticky","animate"),this.header.classList.remove("shopify-section-header-hidden"))}reset(){this.headerIsAlwaysSticky||this.header.classList.remove("shopify-section-header-hidden","shopify-section-header-sticky","animate")}closeMenuDisclosure(){this.disclosures=this.disclosures||this.header.querySelectorAll("header-menu"),this.disclosures.forEach(disclosure=>disclosure.close&&disclosure.close())}closeSearchModal(){this.searchModal=this.searchModal||this.header.querySelector("details-modal"),this.searchModal&&this.searchModal.close&&this.searchModal.close(!1)}}customElements.define("sticky-header",StickyHeader)}catch(e){console.error(e)}})();

/* header: language picker (their localization-form.js) */
customElements.get("localization-form")||customElements.define("localization-form",class extends HTMLElement{constructor(){super(),this.elements={input:this.querySelector('input[name="locale_code"], input[name="country_code"]'),button:this.querySelector("button"),panel:this.querySelector(".disclosure__list-wrapper")},this.elements.button.addEventListener("click",this.openSelector.bind(this)),this.elements.button.addEventListener("focusout",this.closeSelector.bind(this)),this.addEventListener("keyup",this.onContainerKeyUp.bind(this)),this.querySelectorAll("a").forEach(item=>item.addEventListener("click",this.onItemClick.bind(this)))}hidePanel(){this.elements.button.setAttribute("aria-expanded","false"),this.elements.panel.setAttribute("hidden",!0)}onContainerKeyUp(event){event.code.toUpperCase()==="ESCAPE"&&this.elements.button.getAttribute("aria-expanded")!="false"&&(this.hidePanel(),event.stopPropagation(),this.elements.button.focus())}onItemClick(event){event.preventDefault();const form=this.querySelector("form");this.elements.input.value=event.currentTarget.dataset.value/* CHIME: no store locales, nothing to submit */}openSelector(){this.elements.button.focus(),this.elements.panel.toggleAttribute("hidden"),this.elements.button.setAttribute("aria-expanded",(this.elements.button.getAttribute("aria-expanded")==="false").toString())}closeSelector(event){const isChild=this.elements.panel.contains(event.relatedTarget)||this.elements.button.contains(event.relatedTarget);(!event.relatedTarget||!isChild)&&this.hidePanel()}});

/* mobile menu (their he_mob-menu.js) */
$(document).ready(function () {
  $(".header__icon--menu").click(function (evt) {
    evt.preventDefault();
    $(".he_mob-menu-outer").addClass("menuOpen");
    $('body').css('overflow', 'hidden');
    $('html').css('overflow', 'hidden');
  });

  $(".he_mob-menu-close").click(function (evt) {
    evt.preventDefault();
    $(".he_mob-menu-outer").removeClass("menuOpen");
    $('body').css('overflow', 'unset');
    $('html').css('overflow', 'unset');
  });
});

/* product section: gallery + review sliders, auto-refill switch, offers, tabs, lab popup (their section script) */
$(document).ready(function(){
        $('.whole_gallery-box').addClass('loaded');
        

        $('.he_product-review-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 3000
        });

        $('.he_prod_rev-next').click(function(){
            $('.he_product-review-slider .slick-next').trigger('click');
        });

        $('.he_prod_rev-prev').click(function(){
            $('.he_product-review-slider .slick-prev').trigger('click');
        });

        $('.he_mobile-gallery').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: true,
            asNavFor: '.he_mobile-gallery-thumbs'
        });

        $('.he_mobile-gallery-thumbs').slick({
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            asNavFor: '.he_mobile-gallery',
            focusOnSelect: true
        });

        $('.he_desktop-gallery').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: true,
            asNavFor: '.he_desktop-gallery_thumbs'
        });

        $('.he_desktop-gallery_thumbs').slick({
            infinite: true,
            slidesToShow: 8,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            focusOnSelect: true,
            asNavFor: '.he_desktop-gallery'
        });

        $('.he_desk-gallery-next').click(function(){
            $('.he_desktop-gallery').find('.slick-next').trigger('click');
        });

        $('.he_desk-gallery-prev').click(function(){
            $('.he_desktop-gallery').find('.slick-prev').trigger('click');
        });

        $('.he_mob-gallery-next').click(function(){
            $('.he_mobile-gallery').find('.slick-next').trigger('click');
        });

        $('.he_mob-gallery-prev').click(function(){
            $('.he_mobile-gallery').find('.slick-prev').trigger('click');
        });

       $('.he_product-variant-box').click(function () {
            $('.he_product-variant-box').removeClass('active');
            $(this).addClass('active');

            var currentId = $(this).attr('data-id');

            updateVariantInURL(currentId);
        });

        function updateVariantInURL(variantId) {
            const url = new URL(window.location.href);
            url.searchParams.set('variant', variantId);
            window.history.replaceState({}, '', url);
        }


        $('.he_product-sub-btn').click(function(){
            $(this).toggleClass('active');

            $('.he_product-variant-perbottle-price').addClass('hided');
            $('.he_product-price-box').addClass('hided');
            if ($(this).hasClass('active')){
                $('.he_product-variant-perbottle-price[data="sub"]').removeClass('hided');
                $('.he_product-price-box[data="sub"]').removeClass('hided');
                $('[data="sub"]').removeClass('hided');
                $('[data="otp"]').addClass('hided');
            }
            else{
                $('.he_product-variant-perbottle-price[data="otp"]').removeClass('hided');
                $('.he_product-price-box[data="otp"]').removeClass('hided');
                $('[data="sub"]').addClass('hided');
                $('[data="otp"]').removeClass('hided');
            }
        });

        $('#shopify-section-template--30529308688732__product .he_product-faq-block').click(function(){
            $(this).find('.he_product-faq-content').slideToggle();
        });

        $('.he_product-cta').click(function(evt){
            evt.preventDefault();

            $('html, body').animate({
                scrollTop: $(".he_product-section").offset().top
            }, 500);
        });

        // CHIME: their ipapi.co lookup (visitor country → "Fast Shipping Available to <country> <flag>") is a
        // third-party call; the line is fixed to the United States.
        $(".he_product-delivery-date").html("Get It Quick: Fast Shipping Available to United States 🇺🇸");


        $('.he_nutri-popup-close').click(function(){
            $('.he_nutri-popup').hide();
        });

        $('.he_product-lab-btn').click(function(evt){
            var mode = $(this).attr('data');
            if (mode == 'expand'){
                evt.preventDefault();
                $('.heproduct-discover-yout-content').slideDown();
            }

            $('.he_nutri-main-image').removeClass('hided');
            $('.he_nutri-faq-image').addClass('hided');

            if (mode == 'popup'){
                 evt.preventDefault();
                $('.he_nutri-popup').css('display', 'flex');
            }

            if (mode == 'close'){
                evt.preventDefault();
                $('.heproduct-discover-yout-content').slideUp();
            }
        });

        $('.he_product-tag').click(function(){
            $('.he_product-tag').removeClass('active');
            $(this).addClass('active');

            var currentTitle = $(this).html();
            var currentText = $(this).attr('data-text');
            $('.he_product-lab-note').find('h3').html(currentTitle);
            $('.he_product-lab-note').find('p').html(currentText);
        });

        $('.he_product-more-info-btn').click(function(evt){
            evt.preventDefault();
            $('.he_product-info-more-content').slideToggle();
        });

       var index = 0;

        $('.he_prod_rev-next_mob').on('click', function () {
            var slideW = $('.he_product-review-slider_mob-in > div').outerWidth(true);
            var slides = $('.he_product-review-slider_mob-in > div').length;

            if (index < slides - 1) index++;

            $('.he_product-review-slider_mob-in').css({
                transform: 'translateX(' + -(index * slideW) + 'px)',
                transition: 'transform .3s ease'
            });
        });

        $('.he_prod_rev-prev_mob').on('click', function () {
            var slideW = $('.he_product-review-slider_mob-in > div').outerWidth(true);

            if (index > 0) index--;

            $('.he_product-review-slider_mob-in').css({
                transform: 'translateX(' + -(index * slideW) + 'px)',
                transition: 'transform .3s ease'
            });
        });

        $('.he_product-main-lab-popup').click(function(){
            var currentSrc = $(this).attr('src');
            $('.he_nutri-popup').css('display', 'flex');
            $('.he_nutri-main-image').addClass('hided');
            $('.he_nutri-faq-image').removeClass('hided');
            $('.he_nutri-faq-image').attr('src', currentSrc);
        });


        $('.he_product-variant-line_outer').click(function(){
            $('.he_product-variant-line_outer').removeClass('active');
            $(this).addClass('active');
        });

        $('.he_product-long-tabs-nav-btn').click(function(){
            $('.he_product-long-tabs-nav-btn').removeClass('active');
            $(this).addClass('active');
            var currentData = $(this).attr('data');
            $('.he_product-long-tabs-content').removeClass('active');
            $('.he_product-long-tabs-content[data="'+currentData+'"]').addClass('active');
        });

        $('.he_mobile-gallery').on('afterChange', function (event, slick, currentSlide) {
            const $dotsWrapper = $(this).find('.slick-dots');
            const $activeDot = $dotsWrapper.find('li.slick-active');

            if (!$activeDot.length) return;

            const wrapper = $dotsWrapper[0];
            const dot = $activeDot[0];

            const wrapperLeft = wrapper.scrollLeft;
            const wrapperRight = wrapperLeft + wrapper.offsetWidth;

            const dotLeft = dot.offsetLeft;
            const dotRight = dotLeft + dot.offsetWidth;

            // If active dot is out of view, scroll to it
            if (dotLeft < wrapperLeft || dotRight > wrapperRight) {
                $dotsWrapper.animate({
                    scrollLeft: dotLeft - wrapper.offsetWidth / 2 + dot.offsetWidth / 2
                }, 300);
            }
        });

    });

/* UGC videos (their section script) */
$(document).ready(function () {
        const $slides = $('.he_ugc-block');
        const $outer = $('.he_ugc-carousel_outer');

       function scrollIntoViewUgc($slide) {
            const outer = $('.he_ugc-carousel_outer')[0];
            const slide = $slide[0];

            const target =
                slide.offsetLeft - outer.offsetLeft - 16;

            $('.he_ugc-carousel_outer').animate(
                { scrollLeft: target },
                300
            );
        }


        function togglePlay($slide) {
            const video = $slide.find('video')[0];
            if (!video) return;

            // If already playing → stop it
            if (!video.paused) {
                video.pause();
                video.currentTime = 0;
                $slide.removeClass('playing');
                return;
            }

            // Pause all other videos
            $('video').each(function () {
                this.pause();
                this.currentTime = 0;
            });
            $('.he_ugc-block').removeClass('playing');

            // Play this one
            video.play();
            $slide.addClass('playing');
        }


        function activateSlide($slide) {
            $slides.removeClass('activeCell');
            $slide.addClass('activeCell');
            scrollIntoViewUgc($slide);
        }

        // Click on slide
        $slides.on('click', function () {
            const $slide = $(this);

            if ($slide.hasClass('activeCell')) {
                togglePlay($slide);
            } else {
                activateSlide($slide);
                togglePlay($slide);
            }
        });

        // Next arrow
        $('.he_ugc-next').on('click', function () {
            const $current = $('.activeCell');
            let idx = $slides.index($current);
            let next = (idx + 1) % $slides.length;
            const $slide = $slides.eq(next);

            activateSlide($slide);
            togglePlay($slide);
        });

        // Prev arrow
        $('.he_ugc-prev').on('click', function () {
            const $current = $('.activeCell');
            let idx = $slides.index($current);
            let prev = (idx - 1 + $slides.length) % $slides.length;
            const $slide = $slides.eq(prev);

            activateSlide($slide);
            togglePlay($slide);
        });


        if (window.innerWidth <= 678) {
            const $outer = $('.he_ugc-carousel_outer');
            const $slides = $('.he_ugc-block');
            const $second = $slides.eq(1);

            if ($second.length) {
                const outerWidth = $outer.outerWidth();
                const slideCenter = $second.position().left + ($second.outerWidth() / 2);
                const scrollTarget = slideCenter - (outerWidth / 2);

                $outer.animate({ scrollLeft: scrollTarget }, 600);
            }
        }

        if (window.innerWidth <= 678) {
            setTimeout(function(){
                 $('video').each(function () {
                    const video = this;
                    video.muted = true; // ensure autoplay allowed on iOS
                    video.play().then(() => {
                    video.pause();
                    video.currentTime = 0;
                    }).catch(() => {
                    // silently ignore autoplay blocking
                    });
                });
            },2000);
           
        }
    });

/* recovery journey tabs (their section script) */
$(document).ready(function(){
        var $root = $('#he_bpc-journey-template--30529308688732__journey');

        $root.find('.he_bpc-journey-tab__bpc').click(function(){
            var tab = $(this).attr('data-tab');

            $root.find('.he_bpc-journey-tab__bpc').removeClass('active');
            $(this).addClass('active');

            $root.find('.he_bpc-journey-group__bpc').removeClass('active');
            $root.find('.he_bpc-journey-group__bpc[data-tab="' + tab + '"]').addClass('active');
        });
    });

/* press slider (their section script) */
$(document).ready(function(){
        var $root = $('#he_bpc-press-template--30529308688732__press');
        var $wrap = $root.find('.he_bpc-press-track-wrap__bpc');

        function scrollByCard(direction){
            var cardWidth = $wrap.find('.he_bpc-press-card__bpc').first().outerWidth(true);
            var amount = (cardWidth || 300) + 24;
            $wrap.animate({ scrollLeft: $wrap.scrollLeft() + (amount * direction) }, 400);
        }

        $root.find('[data-press-prev]').click(function(){ scrollByCard(-1); });
        $root.find('[data-press-next]').click(function(){ scrollByCard(1); });
    });

/* how it works accordion (their section script) */
$(document).ready(function(){
        $('.he_bpc-how-step__bpc').click(function(){
            var $step = $(this);
            var isActive = $step.hasClass('active');

            $('.he_bpc-how-step__bpc').removeClass('active');

            if(!isActive){
                $step.addClass('active');
            }
        });
    });

/* FAQ (their section script) */
$(document).ready(function(){
        $('#shopify-section-template--30529308688732__faq .he_product-faq-block').click(function(){
            $(this).find('.he_product-faq-content').slideToggle();
        });
    });

/* smooth scroll for in-page links (their section script) */
$(document).ready(function(){
        // Add smooth scrolling to all internal links
        $("a[href^='#']:not([href='#'])")  /* CHIME: their store links are "#" here */.on('click', function(event) {
          // Prevent default anchor click behavior
          event.preventDefault();

          // Get the target element's ID from the href attribute
          var target = $(this).attr("href");

          // Scroll smoothly to the target element
          $("html, body").animate({
            scrollTop: $(target).offset().top
          }, 800, function(){
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = target;
          });
        });
      });

/* CHIME: the reference's ADD TO CART put the chosen bundle in the Shopify cart drawer. Here it opens the
   Chime assessment, carrying the chosen offer (1 = Buy 1, 2 = Buy 2 Get 1, 3 = Buy 3 Get 2) and whether
   automatic refills were on. The assessment ignores parameters it does not know. */
$(document).ready(function(){
    $('.he_product-atc_long').css('cursor', 'pointer').on('click', function(){
        var $rows = $('.he_product-variant-line_outer');
        var offer = $rows.index($rows.filter('.active')) + 1;
        var refill = $('.he_product-sub-btn').hasClass('active') ? 1 : 0;
        window.location.href = '../chimeAssessment.html?product=bpc&offer=' + (offer || 2) + '&refill=' + refill;
    });
    /* their newsletter form posted to Shopify's /contact; there is no Chime list behind it yet */
    $('#ContactFooter').on('submit', function(evt){ evt.preventDefault(); });
});
