//$(function(){
var pub_ui={};
var scrollTop = 0;
function layerShow($this){
	var layerLength = 0;
	$('#'+ $this).fadeIn().attr('tabIndex', 0).focus();
	$('.layer').each(function(e){
		if($(this).css('display')=='block'){
			layerLength++;
		};
	});
	if(layerLength == 1){
		scrollTop = $('html').scrollTop();
		$('body,html').css('overflow','hidden')
		$('body').scrollTop(scrollTop)
	}
	$(window).resize(function(){
		var thisLayer = $('#'+ $this);
		thisLayer.each(function(){
			thisLayer.find('.layer_wrap').removeAttr('style');
			if($(this).hasClass('mid')){
				var winHeight = $(window).height();
				var checkHeight = $(this).find('.layer_wrap').height();
				// if (checkHeight >= winHeight){
				// 	$(this).find('.layer_wrap').css('height', winHeight - 70);
				// }
			}
			if(thisLayer.find('.layer_wrap').children().hasClass('btn_area')){
				$(this).find('.layer_wrap').children('.layer_cont').addClass('is_btn');
			}
		});
	}).resize();

	function layer(){
		$(document).on('click','.btn_area .close, .layer_close, .flo .btn_close', function(){
			if($(this).hasClass('allclose')){
				$('.layer').fadeOut()
				return false;
			}
			$('body,html').css('overflow','')
			$('html').scrollTop(scrollTop)
			$(this).parents('.layer').fadeOut().removeAttr('style').removeAttr('tabIndex');
		});
	};
	layer();
}
function layerClose(ele){
	$('body,html').css('overflow','')
	// $('html, body').removeAttr('style');
	$('html').scrollTop(scrollTop)
	$('#'+ele).fadeOut().removeAttr('style').removeAttr('tabIndex');
};

function layerHide(){
	console.log($('.layer').attr('display'))
	if($('#wrap').find('div').hasClass('layer')){
		$('.layer').each(function(e){
			if($('.layer').eq(e).css('display') == 'block'){
				$('.layer').fadeOut().removeAttr('style').removeAttr('tabIndex');
				$('body').css('overflow','')
				return false;
			}else{
				alert('?????????????????????????????????????????')
			}
		});
	}

}

$(document).ready(function(){

	pub_ui.load=function(){
		pub_ui.init();

		// pub_ui.search();

		// pub_ui.layer();
	}
	pub_ui.mnew =function(){
		pub_ui.slide()
		pub_ui.scroll();
		$('.swiper-pagination-current').text(1)
	}
	pub_ui.init = function(){
		//탭
		function tab(){
			$('.tab_wrap').each(function(){
				var tab_wrap = $(this);
				tab_wrap.find('li:first a').addClass('active');
				tab_wrap.find('.tab_cont').hide();
				tab_wrap.find('.tab_cont:first').show();
				tab_wrap.find('[class^="tab_ty"]>li>a').click(function(){
					$(this).addClass('active').parent().siblings().children().removeClass('active');
					var currentTab = $(this).attr('href');
					$(this).parents('.tab_wrap').find('.tab_cont').hide();
					$(currentTab).show();
					return false;
				});
			});
			$('.tab_ty5 a').click(function(){
				$(this).addClass('active').parent('.swiper-slide').siblings().children('a').removeClass('active');
				var currentTab = $(this).attr('href');
				$(this).parents('.tab_wrap').find('.tab_cont').hide();
				$(currentTab).show();
				return false;
			});
		}tab()



		//서브컨텐츠 header fix, content scroll
		function subContentCheck(){
			if($('.contents.sub').length > 0){
				$('#wrap').addClass('sub_fixed');
			}
			if($('.contents.sub .btn_fixed').length > 0){
				$('.contents').addClass('fixed');
			}
		}subContentCheck()

		//Hi하이 캘린더 활성화
		function calendarSelect(){
			if($('.calendar_wrap').length > 0){
				function resizeTodayWidth(){
					var $height = $('.calendar_table .day').height();
				}
				resizeTodayWidth();
				$(window).resize(resizeTodayWidth);

				$(".calendar_table .day").not('.off').on('click', function(){
					$('.day').removeClass('active');
					$(this).addClass('active');
				});
			}
		}calendarSelect()

		//전체메뉴
		function sideMenu(){

			$('.slidemenu .menu_gnb .dep1>li:first-child').addClass('active');
			$('.slidemenu .menu_gnb .dep1>li>a').on('click', function(){
				$(this).closest('li').addClass('active').siblings().removeClass('active')
				var dep2 = $(this).attr('rel');
				$('.dep2-box>li').removeClass('active')
				$('.'+dep2).addClass('active')
			});

			function sideMenuHeight() {
				var $h_win = $(window).height();
				var $top = $('.menu_top').height() +50;
				var $foot = $('.footer_bottom').outerHeight();
				var $height = ($h_win - $top - $foot);
				$('.slidemenu .menu_gnb, .slidemenu .dep2-box').css('height', $height);
			}
			sideMenuHeight();
			$(window).resize(sideMenuHeight);
		}sideMenu()

		//서랍장 이미지
		function drawerImg(){
			var $width = $('.drawer_list a p').width();
			$('.drawer_list .img').css('height', $width);
			$('.drawer_list .create').css('height', $width);
		}drawerImg()
		$(window).resize(drawerImg);
		//서랍장 active
		function drawerCheck(){
			$('.drawer_list li a').not('.create').on('click',function(){
				var $this = $(this).closest('li');
				if($this.closest('.drawer_list').hasClass('check')){
					$this.toggleClass('active');
				}if($this.closest('.drawer_list').hasClass('radio')){
					$this.toggleClass('active').siblings().removeClass('active');
				};
			});
		}drawerCheck()
		function noticeTxt($ele,$parent,$addC) {
			$ele.closest('div').addClass('hide').siblings('.hide').removeClass('hide')
			if($('.right-basic').hasClass('hide')){
				$($parent).addClass('del')
			}else{
				$($parent).removeClass('del')
			};
		};
		$('.notice-view .btn-del').on('click',function(){
			var $txt = $(this);
			noticeTxt($txt,'.notice-view');
		});
		//알림 탭
		function noticeTab(){
			$('.notice_list .btn-del').on('click', function(){
				var $txt = $(this);
				noticeTxt($txt,'.notice_list');
			});


			$('.notice_list .all,.calendar_table .form-select button').on('click', function(){
				var $this = $(this).parents('.all_menu');
				$this.toggleClass('active');
				if($this.hasClass('active')){
					$this.find('.tab_ty3').before("<div class='dim'></div>");
					$('.notice_list .tab_wrap').css({'min-height':$(window).height()});
					$('body').css({'overflow':'hidden', 'position':'fixed', 'left':0, 'right':0});
				} else {
					$this.find('.dim').remove();
					$('.notice_list .tab_wrap').removeAttr('style')
					$('body').css({'overflow':'', 'position':'', 'left':'', 'right':''});
				}
				$('.notice_list .tab_cont li').removeClass('active');
			});

			$('.hdmf .form-select button').on('click',function(){
				var $this = $(this).closest('.form-select');
				$this.toggleClass('active');
				if($this.hasClass('active')==true){
					$this.siblings('.option-box').show()
					$('body').css({'overflow':'hidden', 'position':'fixed', 'left':0, 'right':0});
					$('.dim').css({'height':$(window).height()});
				}else if($this.hasClass('active')==false){
					$this.siblings('.option-box').hide();
					$('body').removeAttr('style');
				}
			});

		}noticeTab()

		//로그인관리 on/off
		function loginSet(){
			$('.switch_box input').on('click', function(){
				var $this = $(this).parents('.switch_box');
				$this.toggleClass('active');
				if(!$this.hasClass('active')){
					$('.layer').fadeIn().attr('tabIndex', 0).focus();
				}
			});
		}loginSet()

		//PIN번호 입력
		function pinBox(){
			if($('.pin_num').length > 0){
				function pinBoxHeight(){
					var $width = $('.pin_num input').width();
					$('.pin_num input').css({'height':$width+'px'});
				}
				pinBoxHeight();
				$(window).resize(pinBoxHeight);

				$('.pin_num input').on('keydown keyup change', function(){
					var $this = $(this);
					var value = $.trim($this.val());
					$this.toggleClass('active', value.length !== 0);
				});
			}
		}pinBox()

		function video_play(){
			if($('.video_box').length > 0){
				var $video = document.getElementById('player');
				function playVid(){
					$video.play();
				}
				$('.play_box .play_btn').on('click', function(){
					$(this).parent().remove();
					playVid();
				});
				$('#player').on('playing', function(){
					$(this).attr('controls', true);
				});
			}
		}video_play()

		// 전체메뉴
		function allMenu(){
			var scrolltop=0;
			$('.btn-menu,.btn-menu-close').on('click', function(e){
				if(e.target.className == 'btn-menu'){
					scrolltop = $('html').scrollTop();
					$('.menu-box').addClass('active');
					$('.slidemenu').css('padding-bottom',57)
					$('body,html').css('overflow','hidden')
					$('body').scrollTop(scrolltop)
				}else if(e.target.className == 'btn-menu-close'){
					$('.menu-box').removeClass('active');
					$('body,html').css('overflow','')
					$('html').scrollTop(scrolltop)
				}
			});
		};allMenu()

		function quickMore(){
			if($('.quick_more').length > 0){

				var $qh = $('.quick_more .quick_menu').outerHeight() + 6;
				$('.quick_more .quick_menu').css('height', 161);
				$('.quick_more .btn_more').on('click', function(){
					var $this = $(this).parents('.quick_more');
					$this.toggleClass('active');
					if(!$this.hasClass('active')){
						$(this).children().text('더보기');
						$('.quick_more .quick_menu').animate({height:161}, 500);
						$('body,html').animate({scrollTop:0}, 500);
					} else {
						$(this).children().text('접기');
						var $vh = $('.main_slider').outerHeight() - 20;
						$('.quick_more .quick_menu').animate({height:$qh+'px'}, 500);
						$('body,html').animate({scrollTop:$vh}, 500);
					}
				});
			}
		}quickMore()

		function btnAcc($ele,allClose) {
			console.log('a',$this)


		};
		$('.btn-acc').on('click',function(){
			var $this = $(this);
			$this.toggleClass('active');

			$this.hasClass('active') == true ? accDown($this): accUp($this);
			function accDown($ele){
				$ele.closest('.acc-wrap').siblings().find('.btn-acc').removeClass('active');
				$ele.closest('.acc-wrap').siblings().find('.acc-form').slideUp();
				$ele.closest('.acc-wrap').find('.acc-form').slideDown();
				return false;
			}
			function accUp($this){
				$('.btn-acc').removeClass('active');
				$('.btn-acc').closest('.acc-wrap').find('.acc-form').slideUp();
				return false;
			}
		});
		$('.search-box input').on({'focusin':function(){
			$(this).closest('.search-box').addClass('on')
		},'focusout':function(){
			$(this).closest('.search-box').removeClass('on')
		}})
		$('.btn-cont-acc').on('click',function(){
			$(this).closest('div').toggleClass('active')
		});

		// 스크롤 체크
		$.fn.scrollStopped = function(callback){
			var that = this, $this = $(that);
			$this.scroll(function(ev) {
				clearTimeout($this.data('scrollTimeout'));
				$this.data('scrollTimeout', setTimeout(callback.bind(that), 500, ev));
			});
		};
		function footerBtn(){
			if($('.footer_bottom').length > 0){
				//$('#container').addClass('fh');
				if($('.footer_bottom').prev().is('#footer')){
					$('#container').addClass('fh'); // #footer + .footer_bottom
				} else {
					$('#container').addClass('ns'); // #footer
					$('#wrap').css({'height':'100%'})

				}
			}

			$(window).scrollStopped(function(ev){
				$('.footer_bottom').removeClass('active');
				//$('#wrap').addClass('fh');
			});
			$(window).scroll(function(event){
				$('.footer_bottom').addClass('active');

				var st = $(this).scrollTop();
				if (st > 30){
					$('.page_top').fadeIn(500);
				} else {
					$('.page_top').fadeOut(500);
				}
			});
			$('.page_top').on('click', function(){
				$('body,html').animate({scrollTop:0}, 800, 'easeInOutCirc');
			});
		}footerBtn()
		function cardTyCheck(){
			$('.card-check .card-ty-box a').on('click',function(){
				$(this).closest('.card-ty-box').toggleClass('active').siblings('.card-ty-box').removeClass('active');
			});
		};cardTyCheck();

		function tabFloating(){
			$(window).scroll('.tab_wrap',function(){
				var scrollT = $(window).scrollTop(),
					thisT = $('.tab_wrap').offset().top - $('#header .location').height();
					if(thisT<=scrollT){
						$('.tab_wrap').addClass('tab-f')
					}else{
						$('.tab_wrap').removeClass('tab-f')
					}
			});
		}
		$('#container').find('.tab_wrap').hasClass('fixed') ? tabFloating(): null;
	}

	// init
	pub_ui.slide = function(){

		var aswiper = new Swiper('.main_slider .swiper-container', {
			pagination: {
				el: '.swiper-pagination',
				type: 'fraction',
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			observer:true,
			observeParents:true,
		});


		function slideFun(ele) {
			new Swiper(ele + ' .swiper-container', {
					pagination: {
						el: ele + ' .btn_wrap .paging',
						type: 'fraction',
					},
					// slidesPerView : 2.38,
					slidesPerView : 'auto',
					spaceBetween: 14,
					initialSlide: 0,
					roundLengths: true,
					observer:true,
					observeParents:true,

				});
		}
		var Bswiper = slideFun('.slider01'),
			cswiper = slideFun('.slider02'),
			dswiper = slideFun('.slider03'),
			eswiper = slideFun('.slider04'),
			fswiper = slideFun('.slider05'),
			gswiper = slideFun('.slider06'),
			hswiper = slideFun('.slider07'),
			iswiper = slideFun('.slider08'),
			zswiper = slideFun('.slider09'),
			zswiper1 = slideFun('.slider10'),
			zswiper2 = slideFun('.slider11');




		var jswiper = new Swiper('.edu_slider .swiper-container', {
			slidesPerView : 1.25,
			// slidesPerView : 'auto',
			spaceBetween: 14,
			initialSlide: 0,
			roundLengths: true,
			observer:true,
			observeParents:true
		});

		var kswiper = new Swiper('.goods-slide .swiper-container', {
			slidesPerView : 1.18,
			spaceBetween: 14,
			initialSlide: 0,
			roundLengths: true,
			observer:true,
			observeParents:true,
			centeredSlides:true
		});

		function slideFun02(ele) {
			new Swiper(ele+'.swiper-container', {
				slidesPerView : 'auto',
				spaceBetween: 7,
				initialSlide: 0,
				roundLengths: true,
				observer:true,
				observeParents:true
			});
		};
		var lswiper = slideFun02('.tabslide01'),
			mswiper = slideFun02('.tabslide02'),
			nswiper = slideFun02('.tabslide03'),
			lswiper = slideFun02('.tabslide01');

	}
	pub_ui.scroll=function(){
		if($('#wrap').find('div').hasClass('mn_scroll')){scrollM()}
		function scrollM(){

			var navpos = $('.tab_inr').offset(),
				rows=[],
				vasdas = $('.tab_inr > .tab_ty1 li').eq(2).index();
			$('.tab_ty5 a').on('click',function(){
				rowsfun(20);
				var idx = $(this).closest('.tab_cont').index();
				$('body,html').stop().animate({'scrollTop':rows[idx]-1});
			})
			function rowsfun(num){
				if(num == undefined){num = 0};
				$('.tab_cont_wp>.tab_cont').each(function(e){
					var extop = e > vasdas ? 25-(e*2)+25 : 0;
					if(e == 0 ){extop = -$('.tab_inr').height()/2};
					rows[e]=$(this).offset().top - $('.mn_scroll >.tab_inr').outerHeight(true)+num;
				});
			}
			rowsfun();

			var scrollHT = 0;
			$(window).scroll(function(e){
				if($(window).scrollTop() > 60){
					$('body, .mn_scroll').addClass('fixed');
					scrollHT = 20;
				} else {
					$('body, .mn_scroll').removeClass('fixed');
					scrollHT = 0;
				}
				var winT = $(window).scrollTop();

				$('.tab_cont_wp>.tab_cont').each(function(event){
					$('.tab_cont_wp>.tab_cont').each(function(e){
						rows[e]=$(this).offset().top - $('.mn_scroll >.tab_inr').outerHeight(true) + scrollHT;
					});

					if(winT <= rows[event]+ $(this).outerHeight(true)-30){
						$('.tab_inr > .tab_ty1 li').eq(event).find('a').addClass('active').closest('li').siblings().find('a').removeClass('active')
						return false
					}
				});
			}).trigger('scroll');
			var aasdasd = 0
			$('.tab_ty1 li a').on('click',function(){
				if(!$('.mn_scroll').hasClass('fixed')){
					aasdasd = 20
				}else{
						aasdasd=0
					}
				var idx = $(this).closest('li').index(),
					vasdas = $('.tab_inr > .tab_ty1 li').eq(2).index();
				if(idx == 0){$('body,html').stop().animate({'scrollTop':0})
				 return false;}
				$('body,html').stop().animate({'scrollTop':rows[idx]-1+aasdasd})
				return false;
			});
		}

	}
	pub_ui.hiMagaz = function(){
		 $(window).resize(function(){
		 	$('.himagazine .swiper-wrapper ').css({'height':$(window).height()-50});
		 }).trigger('resize')
		var hiswiper = new Swiper('.himagazine-list .swiper-container', {
			arrow:true,
			direction:'vertical',
			observer:true,
			observeParents:true,
			pagination: {
				el: '.himagazine-list .swiper-pagination',
				type: 'fraction',
			},
			navigation:{
				prevEl:'.swiper-button-prev',
				nextEl:'.swiper-button-next'
			},
		});
	}
	pub_ui.scrolls= function($id,subtab){
			var rows = $('#'+$id).offset().top-30;
			$('body,html').scrollTop(rows)
			if(subtab !== undefined){
				$('#'+$id + ' .tab_ty5 .swiper-slide').each(function(e){
					if($(this).children('a').attr('href') == '#'+subtab){
						$(this).children('a').click();
						return false;
					};
				})
			}

	}
	pub_ui.search=function(){
		var searchTop = new Swiper('.search-top .swiper-container',{
		slidesPerView:'auto',
		spaceBetween:30,
		observer : true,
		observeParents: true,
		})

		$('.search-top .swiper-slide button').on('click',function(){
			var $thisIdx = $(this).attr('rel');
			$(this).closest('.swiper-slide').addClass('active').siblings().removeClass('active');
			$('.search-content').find('#'+$thisIdx).show().siblings('.search-date').hide();
			if($thisIdx == 'all'){
				$('.search-content').find('.search-date').show()
			}
		});


	}
pub_ui.load()

});