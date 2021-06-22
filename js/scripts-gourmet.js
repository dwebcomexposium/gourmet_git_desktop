;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);
	var sliderTimer;
	var sliderNextTimer;

	// Fix header
	function fixHeader(winST) {
		var $wrapper = $('.global-wrapper');
		var $header = $('.site-banner');
		var mainOT = $('#main').offset().top;

		if (winST > mainOT && !$header.hasClass('fixed')) {
			$wrapper.css({
				'paddingTop': $header.outerHeight()
			});

			$header.addClass('fixed');
		} else if (winST < mainOT) {
			$header.removeClass('fixed');

			$wrapper.css({
				'paddingTop': 0
			});
		}
	}

	// Home slider
	function initHomepageSlider() {
		var $slider = $('.list-articles.actus .la-slider');
		var $clone = $slider.clone();
		var sliderArrow = '<a href="#" class="slider-next"/>';
		var sliderPaging = '<div class="slider-paging">';

		for (var i = 0; i <= $clone.find('.la-item').length - 1; i++) {
			sliderPaging += '<a href="#">0' + (i + 1) + '</a>'
		}

		sliderPaging += '</div>';

		$slider.after($clone);

		var $slidesContainer = $clone.find('.slider-content');

		$clone
			.append(sliderArrow)
			.append(sliderPaging);
		$slider.remove();

		$clone
			.find('.slider-paging a:first-child')
			.addClass('active');
		$clone
			.find('.la-item.slider-item:first-child')
			.addClass('active');

		$slidesContainer.carouFredSel({
			// width: '100%',
			// width: '1400px',
			responsive: true,
			height: 'variable',
			items: 1,
			scroll: { 
				fx: 'crossfade',
				duration: 600,
				onAfter: function(data) {
					setActive($slidesContainer);

					$clone
						.find('.slider-paging a')
						.eq($slidesContainer.triggerHandler('currentPosition'))
						.addClass('active')
						.siblings()
						.removeClass('active');
				}
			},
			swipe: {
				onTouch: true
			},
			auto: {
				play: false,
				// timeoutDuration: 7000
			},
			infinite: true,
			onCreate: function() {
				// setActive($slidesContainer);

				//41.4vw

				$clone
					.parent()
					.addClass('loaded');


			},
            next : function(){
                // return $clone.find('.slider-next');
            }
		});
		
		

		$clone.find('.slider-paging a').on('click', function(e){
			e.preventDefault();

			var $this = $(this);

			setActiveOnClick($slidesContainer, true, $this.index());
		});

		$clone.find('.slider-next').on('click', function(e){
			e.preventDefault();

			setActiveOnClick($slidesContainer);
		});
	}

	// Set active slide
	function setActive($slidesContainer) {
		$slidesContainer
			.find('.la-item:first-child')
			.addClass('active')
			.siblings()
			.removeClass('active');

		clearTimeout(sliderTimer);

		sliderTimer = setTimeout(function() {
			$slidesContainer
				.find('.active')
				.addClass('fadeout')
				.siblings()
				.removeClass('fadeout');
		}, 6500);
	}

	function setActiveOnClick($slidesContainer, slideTo, indx) {
		if (!$slidesContainer.find('.active.fadeout').length) {
			$slidesContainer.trigger('pause', true);

			$slidesContainer
				.find('.active')
				.addClass('fadeout')
				.siblings()
				.removeClass('fadeout');

			clearTimeout(sliderNextTimer);

			sliderNextTimer = setTimeout(function() {
				if (slideTo) {
					$slidesContainer.trigger('slideTo', indx);
				} else {
					$slidesContainer.trigger('next');
				}
				
				$slidesContainer.trigger('play', true);
			}, 500);
		}
	}

	

	// Gallery
	function initGallery() {
		var $galleryItems = $('.gallery-items');

		setTimeout(function(){
			$galleryItems.each(function(e){
				var $this = $(this);

				setTimeout(function(){
					$this
						.find('.active')
						.addClass('invisible');
				}, e * 250);

				setTimeout(function(){
					setTimeout(function(e){
						if ($this.find('.active:last-child').length) {
							$this
								.find('img:first-child')
								.addClass('active')
								.siblings()
								.removeClass('active invisible');
						} else {
							$this
								.find('.active')
								.next()
								.addClass('active')
								.siblings()
								.removeClass('active invisible');
						}

						if ($this.is(':last-child')) {
							initGallery();
						}
					}, e * 250);
				}, $galleryItems.length * 250);
			});
		}, 7000);
	}

	// Partners slider
	function initPartnerSlider() {
		var $slider = $('.partner.visiteurs .partner-gallery');
		var $clone = $slider.clone();
		var sliders = '<div class="pg-slider-container" id="container1"/><div class="pg-slider-container" id="container2"/>'
		var items = $clone.find('.pg-item').length;

		$slider.after($clone);
		$slider.detach();

		$clone
			.find('.slider-content')
			.after(sliders);

		$clone
			.find('.pg-item')
			.each(function(){
				var $this = $(this);
				var $itemClone = $this.clone();
				var container = $this.index() + 1 <= items / 2 ? '#container1' : '#container2';

				$itemClone
					.appendTo($(container));
			});

		$clone
			.find('.slider-content')
			.detach();

		$('.pg-slider-container').each(function() {
			var $slidesContainer = $(this);

			$slidesContainer.carouFredSel({
				width: '100%',
				circular: true,
				infinite: true,
				responsive: true,
				swipe: {
					onTouch: true
				},					
				auto: {
					play: true,
					timeoutDuration: 0
				},
				swipe: {
					onTouch: true
				},
				scroll: {
					duration: 40000,
					easing: 'linear'
				},
				items: {
					minimum: 1,
					visible: 5
				}
			})
		});
	}

	// Function to animate elements
	function animateElement(winST) {
		var $children = $('#zone1').children();
		

		$children.each(function(){
			var $this = $(this);
			var offset = $this.offset().top;

			if (winST + ($win.outerHeight() * 0.6) > offset) {
				$this.addClass('faded-in');
			}
		});

		if (winST + $win.outerHeight() + 300 > $('.site-footer').offset().top) {
			$children.addClass('faded-in');
		}
	}

	function initPartnerSliderFade() {
		var $slider        = $('.partner.partner .slider-content')
		// var $sliderW       = $slider.outerWidth()
		var $sliderParent  = $slider.closest('.slider-container')
		var counter        = 1
		var slidesCount    = ($slider.find('.pg-item').length % 4) +1

		console.log(slidesCount);

		setInterval(function() {
			var $sliderW       = $slider.outerWidth();
			$sliderParent.addClass('animating')

			if ( counter > slidesCount ) {
				counter = 0
			}

			if ( counter === slidesCount ) {
				$sliderParent.addClass('hide-dot')
			} else {
				$sliderParent.removeClass('hide-dot')
			}
			

			setTimeout(function() {
				$slider.css( 'transform', 'translateX( -' + $sliderW*counter + 'px)' )
				
				counter++
			}, 200);
			
			jQuery(window).resize(function () {
				if(counter!= 0){
					var $sliderW       = $('.partner.partner .slider-container__clip').outerWidth();
					$slider.css( 'transform', 'translateX( -' + $sliderW + 'px)' )
				}
			});

			setTimeout(function() {
				$sliderParent.removeClass('animating')
			}, 900);
		}, 4000);
	}

	$doc.ready(function() {
		$win.on('load', function(){
			if (navigator.appVersion.indexOf("Mac")!=-1) {
				$('body').addClass('is-mac')
			}

			// Home slider
			if ($('.list-articles.actus .la-slider').length) {
				initHomepageSlider();
			}

			// Gallery
			if ($('.gallery').length) {
				initGallery();
			}

			// Partners slider
			if ($('.partner.visiteurs .partner-gallery').length) {
				initPartnerSlider();
			}
			
		

			// Fix partners section
			if ($('.partner:not(.visiteurs) .partner-gallery').length) {
				var $partners = $('.partner:not(.visiteurs)');
				var $clone = $partners.find('.slider-content').clone();

				$partners
					.find('.partner-gallery')
					.detach();

				$partners
					.find('.inside')
					.append('<div class="slider-container"><div class="slider-container__clip"></div></div>')
					.find('.slider-container__clip')
					.append($clone);

				$partners
					.find('.slider-content')
					.removeAttr('style')
					.removeClass('swiper-wrapper')

				initPartnerSliderFade()



			}

			var winST = $win.scrollTop();

			// Animate Elements
			if ($('body.front').length) {
				animateElement(winST);
			}
		}).on('scroll', function(){
			var winST = $win.scrollTop();

			// Fix header
			fixHeader(winST);

			// Animate Elements
			if ($('body.front').length) {
				animateElement(winST);
			}
		});

		// Wrap images for hover effect
		if ($('.block-page.list-articles:not(.actus)').length) {
			$('.block-page.list-articles:not(.actus) .la-item-img').wrap('<div class="image"/>');
		}

		if ($('.block-page.list-articles:not(.actus) .gla-item').length) {
			$('.block-page.list-articles:not(.actus) .gla-item img').wrap('<div class="image"/>');
		}

		// Wrap <h4> tags article page 
		if ($('.article-wrapper h4').length) {
			$('.article-wrapper h4').wrapInner('<span/>');
		}

		// Accordion functionality
		$('.accordion-head h3').on('click', function(){
			$(this)
				.closest('.accordion-section')
				.addClass('accordion-expanded')
				.siblings()
				.removeClass('accordion-expanded');
		});

		// Click events for list items
		$('.block-page.list-articles:not(.actus) .la-item').on('click', function(){
			var newHref = $(this).find('.link-read-more').attr('href');

			window.location = window.location.href.substr(0, window.location.href.lastIndexOf('/') + 1) + newHref;
		});
	});
})(jQuery, window, document);



jQuery(document).ready(function () {
	playVideo();
	checkbox();
	ins();
	search();
	numbers();
	imagesSlider();
	newsletterForm();
});
jQuery(document).scroll(function () {
	numbers();
});

function newsletterForm() {
	$('#comexposium_newsletter_email').attr('placeholder','Indiquez votre email ...');
	$('.newsletter-form form .nf-form-item').children().each(function () {
		if($(this).hasClass('nf-form-input')||$(this).hasClass('optin-container')||$(this).hasClass('nf-form-submit')||($(this).attr('for')=='nf1')){
			$(this).addClass('right-child');
		}else{
			$(this).addClass('left-child');
		}
	});
	$(".newsletter-form .left-child").wrapAll('<div class="left-col"></div>');
	$(".newsletter-form .right-child").wrapAll('<div class="right-col"></div>');
	
	$(".newsletter-form .right-col").children().not('.optin-container').wrapAll('<div class="form-field-box"></div>');
	var text = $(".newsletter-form .optin-container .nf-form-input").text();
	$(".newsletter-form .optin-container .nf-form-input input").wrap('<div class="checkbox-input"></div>');
	
	var html = $(".newsletter-form .optin-container .checkbox-input").html();
	$(".newsletter-form .optin-container .nf-form-input").html(html+'<label>'+text+'</label>');
	$(".newsletter-form").fadeIn();
}

function imagesSlider() {
	$('.four-cols-img-slider .slider-row .card-slider').carouFredSel({
		// width: '100%',
		// width: '1400px',
		responsive: true,
		height: 'variable',
		items:  {
            width: 350,
            visible:
                {
                    min: 1,
                    max: 4
                }
        },
		scroll: { 
			fx: 'scroll',
			duration: 600,
		},
		swipe: {
			onTouch: true
		},
		auto: {
			play: true,
			timeoutDuration: 7000
		},
		infinite: true,
		   prev : { 
			  button : "#foo2_prev",
			  key : "left"
		   },
		
		   next : { 
			  button : "#foo2_next",
			  key : "right"
		   }
	});
}

function numbers() {
	var wTop = jQuery(window).scrollTop(),
		wHeight = jQuery(window).height(),
		wBottom = wTop + wHeight;
	jQuery('.num').each(function(){
		var me = jQuery(this),
			meTop = me.offset().top,
			meHeight = me.innerHeight(),
			meBottom = meTop + meHeight,
			limitTop = wTop - meHeight,
			limitBottom = wBottom + meHeight;
		if(meTop > limitTop && meBottom < limitBottom) {
			var cost = me.attr('data-num');
			
			
			
			me.not('.added').prop('number', 0).stop().animateNumber({
				number: cost,
			}, 3500);
			me.addClass('added');
		}
	});
}
function ins() {
    if(jQuery('#instafeed').length){
	    var feed = new Instafeed({
	      	accessToken: InstagramToken,
		    limit: 24,
	    	template:'<div class="instagram-list"><div class="bg-box" style="background-image:url({{image}});"><img src="{{image}}"></div></div>',
	        after: function () {    
				jQuery('.feed-box').carouFredSel({
					// width: '100%',
					// width: '1400px',
					responsive: true,
					height: 'variable',
					items: {
						width: 220,
						visible:
							{
								min: 1,
								max: 8
							}
					},
					scroll: { 
						fx: 'scroll',
						duration: 600,
					},
					swipe: {
						onTouch: true
					},
					auto: {
						play: true,
						timeoutDuration: 7000
					},
					infinite: true
				});
			},
	    });
	    feed.run();
    }
}

function checkbox() {
	jQuery('.checkbox-field label').click(function () {
		jQuery(this).siblings().trigger('click');
	});
}
function search() {
	jQuery('.gsf-trigger').click(function () {
		jQuery('.gsf-fields').toggleClass('show');
	});
	jQuery('body').click(function () {
		jQuery('.gsf-fields').removeClass('show');
	});
	jQuery('.gsf-fields').click(function (event) {
		event.stopPropagation(); 
	});
}

function playVideo() {
	
	jQuery('footer').before('<div class="videos pg-lightbox-wrap pg-yt"><div class="pg-lightbox"><div class="pg-lightbox-inner"><div class="pg-lightbox-content"><div class="pg-lightbox-content-inner"></div><div class="pg-lightbox-close" title="Close"><svg viewBox="0 0 384 512"><path d="M217.5 256l137.2-137.2c4.7-4.7 4.7-12.3 0-17l-8.5-8.5c-4.7-4.7-12.3-4.7-17 0L192 230.5 54.8 93.4c-4.7-4.7-12.3-4.7-17 0l-8.5 8.5c-4.7 4.7-4.7 12.3 0 17L166.5 256 29.4 393.2c-4.7 4.7-4.7 12.3 0 17l8.5 8.5c4.7 4.7 12.3 4.7 17 0L192 281.5l137.2 137.2c4.7 4.7 12.3 4.7 17 0l8.5-8.5c4.7-4.7 4.7-12.3 0-17L217.5 256z"></path></svg></div><div class="pg-lightbox-prev" title="Previous"><svg viewBox="0 0 256 512"><path d="M238.475 475.535l7.071-7.07c4.686-4.686 4.686-12.284 0-16.971L50.053 256 245.546 60.506c4.686-4.686 4.686-12.284 0-16.971l-7.071-7.07c-4.686-4.686-12.284-4.686-16.97 0L10.454 247.515c-4.686 4.686-4.686 12.284 0 16.971l211.051 211.05c4.686 4.686 12.284 4.686 16.97-.001z"></path></svg></div><div class="pg-lightbox-next" title="Next"><svg viewBox="0 0 256 512"><path d="M17.525 36.465l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L205.947 256 10.454 451.494c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l211.051-211.05c4.686-4.686 4.686-12.284 0-16.971L34.495 36.465c-4.686-4.687-12.284-4.687-16.97 0z"></path></svg></div></div><div class="pg-lightbox-info"></div></div></div></div>');
	
	
	jQuery('.video-item').click(function () {
		jQuery(this).addClass('open');
		jQuery('.pg-lightbox-wrap').fadeIn();
		var data = jQuery(this).find('.data-box').html();
		jQuery('.pg-lightbox-content-inner').html(data);
	});
	jQuery('.pg-lightbox').click(function () {
		jQuery('.video-item').removeClass('open');
		jQuery('.pg-lightbox-wrap').fadeOut();
		jQuery('.pg-lightbox-content-inner').html('');
	});
	jQuery('.pg-lightbox-prev').click(function (event) {
		event.stopPropagation();
		var index = jQuery('.video-item.open').index();
		var len = jQuery('.video-item').length;
		jQuery('.video-item').eq(index).removeClass('open');
		if((index+1)>1){
			jQuery('.video-item').eq(index).prev().addClass('open');
		}else{
			jQuery('.video-item').eq(len-1).addClass('open');
		}
		var data = jQuery('.video-item.open').find('.data-box').html();
		jQuery('.pg-lightbox-content-inner').html(data);
		
	});
	jQuery('.pg-lightbox-next').click(function (event) {
		event.stopPropagation();
		var index = jQuery('.video-item.open').index();
		var len = jQuery('.video-item').length;
		jQuery('.video-item').eq(index).removeClass('open');
		if((index+1)<len){
			jQuery('.video-item').eq(index).next().addClass('open');
		}else{
			jQuery('.video-item').eq(0).addClass('open');
		}
		var data = jQuery('.video-item.open').find('.data-box').html();
		jQuery('.pg-lightbox-content-inner').html(data);
	});
}


