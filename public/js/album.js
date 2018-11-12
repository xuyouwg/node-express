var viewSwiper = new Swiper('.view .swiper-container', {
	on: {
		slideChangeTransitionStart: function () {
			updateNavPosition()
		}
	}
})

$('.view .arrow-left,.preview .arrow-left').on('click', function (e) {
	e.preventDefault()
	if (viewSwiper.activeIndex == 0) {
		viewSwiper.slideTo(viewSwiper.slides.length - 1, 1000);
		return
	}
	viewSwiper.slidePrev()
})
$('.view .arrow-right,.preview .arrow-right').on('click', function (e) {
	e.preventDefault()
	if (viewSwiper.activeIndex == viewSwiper.slides.length - 1) {
		viewSwiper.slideTo(0, 1000);
		return
	}
	viewSwiper.slideNext()
})

var previewSwiper = new Swiper('.preview .swiper-container', {
	//visibilityFullFit: true,
	slidesPerView: 'auto',
	allowTouchMove: false,
	on: {
		tap: function () {
			viewSwiper.slideTo(previewSwiper.clickedIndex)
		}
	}
})

function updateNavPosition() {
	$('.preview .active-nav').removeClass('active-nav')
	var activeNav = $('.preview .swiper-slide').eq(viewSwiper.activeIndex).addClass('active-nav')
	if (!activeNav.hasClass('swiper-slide-visible')) {
		if (activeNav.index() > previewSwiper.activeIndex) {
			var thumbsPerNav = Math.floor(previewSwiper.width / activeNav.width()) - 1
			previewSwiper.slideTo(activeNav.index() - thumbsPerNav)
		} else {
			previewSwiper.slideTo(activeNav.index())
		}
	}
}

// $('.del').click(function () {
// 	var link = $(this).attr('link');
// 	var $_this = $(this);
// 	$.get(link, function (data) {
// 		if (data == 1) {
// 			console.log($_this.parent().index());
// 			$('.swiper-wrapper').children().eq($_this.parent().index()).remove();
// 			if ($_this.parent().siblings().length == 0) {
// 				$_this.parent().after('<h3>该相册目前没有图片!</h3> ')
// 			}
// 			$_this.parent().remove();
// 		} else {

// 		}
// 	})
// })