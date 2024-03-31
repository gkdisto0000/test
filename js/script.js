$(function() {
    // 풀페이지
    var page = $('.fullpage').fullpage({
        scrollingSpeed: 500,
        //aos        
        afterLoad: function(anchorLink, index){
            jQuery('.section.active [data-aos]').addClass("aos-animate");
            if (index == 3){
				$('.topBtn').addClass('black');
			} else if (index == 4){
				$('.topBtn').addClass('black');
            } else if (index == 5){
				$('.topBtn').addClass('black');
            } else if (index == 6){
				$('.topBtn').addClass('black');
            } else if (index == 7){
				$('.topBtn').addClass('black');
            } else if (index == 8){
				$('.topBtn').addClass('black');
            } else if (index == 1){
				$('.topBtn').addClass('hide');
            } else {
                $('.topBtn').removeClass('black');
                $('.topBtn').removeClass('hide');
            }
        },
        onLeave: function(){
            jQuery('.section [data-aos]').removeClass("aos-animate");
        },
        onSlideLeave: function(){
            jQuery('.slide [data-aos]').removeClass("aos-animate");
        },
        afterSlideLoad: function(){
            jQuery('.slide.active [data-aos]').addClass("aos-animate");
        },     
        
        anchors: ['sec01','sec02','sec03', 'sec04', 'sec05','sec06','sec07','sec08', 'sec09', 'sec10'],
    });


    // aos 초기화
	AOS.init({
		once: true,
	});


	var swiperArticle = new Swiper('.art-slideWrap', {
		spaceBetween : 40,
		slidesPerView : 2.5,
		loop : true,
		loopedSlides: 10,
		loopAdditionalSlides: 10,
		centeredSlides :false,
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true, 
        },
        
		//autoplay : true,
		//delay : 4000,
		 breakpoints: {
			760: {
			spaceBetween : 20,
			slidesPerView : 1.4,
            centeredSlides :true,
			}
		},
	});




    var swiperTab = new Swiper('.scroll', {
		slidesPerView : 5,
        breakpoints: {
			360: {
                slidesPerView : 3,
			}
		},
	});



    $('.yearTab li').on('click',function(){
		var tabNum = $(this).data('yearTab');
		$('.yearTab li').removeClass('on');
		$(this).addClass('on');
		$('#' + tabNum).css('height','auto');
	});

	$(".yearTab li").click(function(){
		var tabNum = $(this).data('year');
		$(".yearTab li").removeClass('on');
		$(this).addClass('on');
		$('.listWrap').removeClass('on');
		$('#' + tabNum).addClass('on');
	});
	$('.yearTab li:nth-child(1)').trigger('click');



    // list버튼
    // $('.cnt08 .openBtn').click(function(){
    //     $('.cnt08 .listWrap').addClass('open');
    //     $(this).hide();
    //     $('.listMore.closeBtn').show();
    // });

    // $('.listMore.closeBtn').click(function(){
    //     $('.cnt08 .listWrap').removeClass('open');
    //     $(this).hide();
    //     $('.listMore.openBtn').show();
    // });

    $('.mapBtn').click(function(){
        $(this).toggleClass('active');
    });

})