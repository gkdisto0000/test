var hideMenu = null;

jQuery(function($) {

	var win_w = $(window).width();

	if (win_w > 950) {
//PC	
		setting_pc();

	} else {
//Mobile	
		setting_mobile();

	}


//Scroll
	$(".scrollDown a").off();
	$(".scrollDown a").on("click", function(event){       
		if(this.hash == undefined || this.hash == "" || $(this.hash).offset() == undefined){
			return;
		}		  
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
	});

	if ($('.animation').length) {

		mainAni();
		$(window).scroll(function(){
			mainAni();
		});
	}


//toggle	
	$(document).on("click",".trigger a",function() {
		var _currToggle = $(this).parent().parent(),
			sClass = $(this).parent().attr("class"),
			num = sClass.indexOf("view");
		
		if (num < 0) {
			$(this).parent().addClass("view");
			$(this).find("i").attr("class",  function(i){
				var src = $(this).attr("class");
				return src.replace("-down", "-up");
			});
			_currToggle.find(".toggleCon").slideDown(function(){
				$(this).css("display","flow-root");
			});
		} else {
			$(this).parent().removeClass("view");
			$(this).find("i").attr("class",  function(i){
				var src = $(this).attr("class");
				return src.replace("-up", "-down");
			});
			_currToggle.find(".toggleCon").slideUp();
		}

		return false
	});

});



// 윈도우 창 size 변경시
$(window).resize(function(){


	var win_w = $(window).width();
	if (win_w > 950) {
//PC	
		setting_pc();
	} else {
//Mobile	
		setting_mobile();
	}

//Scroll
	$(".scrollDown a").off();
	 $(".scrollDown a").on("click", function(event){            
		if(this.hash == undefined || this.hash == "" || $(this.hash).offset() == undefined){
			return;
		}
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
	});

	if ($('.animation').length) {

		mainAni();
		$(window).scroll(function(){
			mainAni();
		});
	}


});



//Mobile
function setting_mobile() {
	
	$("div.section01").removeAttr("style");

	if ($("div.section01").length) {
		var headerHeight = $("div.headerContainer").length > 0 ? $("div.headerContainer").outerHeight() : 148;
		var pageTitleContainerHeight = $("div.pageTitleContainer").length > 0 ? $("div.pageTitleContainer").outerHeight() : 48;
		var height = $(window).height() - headerHeight - pageTitleContainerHeight,
			section1_h = $("div.section01").outerHeight();
		if (height > section1_h) {
			$("div.section01").css({"height":height})
		}
	}
}



//PC 
function setting_pc() {
	$("div.section01").removeAttr("style");

	$("div.gnbView").hide();
	$("ul#gnb").show();

	if ($("div.section01").length) {
		var headerHeight = $("div.headerContainer").length > 0 ? $("div.headerContainer").outerHeight() : 80;
		var pageTitleContainerHeight = $("div.pageTitleContainer").length > 0 ? $("div.pageTitleContainer").outerHeight() : 64;		
		var height = $(window).height() - headerHeight - pageTitleContainerHeight,
			section1_h = $("div.section01").outerHeight();
		if (height > section1_h) {
			$("div.section01").css({"height":height})
		}
	}
}


function mainAni(){

	var scrollTop = $(window).scrollTop();

	$('div.animationArea').each(function(){
		var elPosition = $(this).offset().top  - ($(window).height() - 100),
			scroll_h= $(window).scrollTop();
		
		if (scroll_h > elPosition) {
			$(this).find(".animation").addClass("fade-in-up");
		}
	});

	$('.changeImg img').each(function(){
		var elPosition = $(this).offset().top  - ($(window).height() - 100),
			scroll_h= $(window).scrollTop();
		
		if (scroll_h > elPosition) {
			$(this).find(".animation").addClass("fade-in-up");
		}
	});

}






