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

		$slidesContainer.carouFredSel({
			width: '100%',
			items: 1,
			scroll: { 
				fx: 'crossfade',
				duration: 0,
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
				play: true,
				timeoutDuration: 7000
			},
			infinite: true,
			onCreate: function() {
				setActive($slidesContainer);

				$clone
					.parent()
					.addClass('loaded');
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

	// Newsletter 
	if ($('.newsletter-form').length) {
		var $form = $('.newsletter-form');

		$form
			.detach()
			.appendTo('body');
		$form
			.find('.nf-form-input input')
			.attr('placeholder', 'Votre email');
		$form
			.find('.nf-main-content')
			.append('<a href="#" class="form-close"/>');

		$('[href*="#newsletter"]').on('click', function(e){
			e.preventDefault();

			$form.addClass('form-shown');
		});

		$doc.on('click', function(e){
			var $target = $(e.target);

			if (($target.is('.form-close, .form-close *') || !$target.is('.nf-main-content, .nf-main-content *, [href*="#newsletter"], [href*="#newsletter"] *')) && $form.hasClass('form-shown')) {
				e.preventDefault();

				$form.removeClass('form-shown');
			}
		});

		if (window.location.href.indexOf('#newsletter') >= 0) {
			$form.addClass('form-shown');
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

	$doc.ready(function() {
		$win.on('load', function(){
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
					.append($clone);
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
