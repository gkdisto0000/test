/* ui_common_v2.js 입니다. */
let POPUP_LAYER_ID = "frm_obj";
let CURRENT_LAYER = "";
let CURRENT_LAYER_CNT = 0;
let mousemoveTimeout;
$(document).ready(function(){
	
	$(window).scroll(function(){
		var tabFixed = $(window).scrollTop();
		
		if(tabFixed >= 50){
			$('.fixed_wrap .acco_list .item.on .acco_head').addClass('fixed');
		} else{
			$('.fixed_wrap .acco_list .item .acco_head').removeClass('fixed');
		}
	});

	// 상단 부모(body) 클릭시 비노출
	$('body').unbind("click").bind("click", function(e){
		// 공통 테이블 bg
		if( $(e.target).closest(".table-col.table_data").length == 0 ){	
			$(".table-col.table_data tr.hover").removeClass("hover");
		};
	});

	$('.fixed_wrap .acco_list .item .acco_btn').click(function(){
		$(window).animate({
			scrollTop : 0}, 400); 
		return false;
	});
	
	// input focus
	$('.inp_bar input').focus(function(){
		$(this).parent().addClass('focus');
		
		$('.input_text').each(function(){
			$(this).removeClass('focus_wrap');
		});
		if($(this).parents('.input_text').length){
			$(this).parents('.input_text').addClass('focus_wrap');
		}
		
	});
	$('.inp_bar').on('mouseleave', function(){
		$(this).removeClass('focus');
		$('.input_text').each(function(){
			$(this).removeClass('focus_wrap');
		});
	});
	$('.input_reset').each(function(i,v){
		let isThereClickEvent = false;
		$.each($._data(v, "events"), function(dataIndex, dataEvent){
			console.log("dataIndex", dataIndex, dataIndex === "click");
			if(dataIndex === "click"){
				isThereClickEvent = true;
				return false;
			}
		});
		if(!isThereClickEvent){
			$(v).on('click', function(e){
				$(e.currentTarget).prev('input').val('');
			});
		}
	});
	
	// select color
	$(document).on('change','.renew select', function(){
		$(this).parent('.form-select').addClass('on');
		//$(this).css('color', '#000');
	});
	
	// 하단 버튼 여부 확인 
	$('.btn_fixed, .btn_area').each(function(){
		if($(this).is('.btn_fixed, .btn_area')){
			$(this).parents('.layer').addClass('bottom_fixed');
		}
	});
	
	$('.btn_fixed').each(function(){
		if($('.btn_fixed').css( 'display') == 'none'){
			$('.contents').removeClass('fixed');
		} else{
			$('.contents').addClass('fixed');
		}
	});
	
	// 하단 버튼위 고정 안내문구 여부 확인 
	function infoFixed(){
		var infoHeight = $('.info_fixed_bar .info_title').outerHeight();
		$('div.info_fixed_bar').each(function(){

			$(this).parents('.layer_cont').addClass('info_fixed_text');
			$(this).css('height', infoHeight);
		});
	};
	infoFixed();
	
	$(window).resize(infoFixed);
	
	
	//input:disabled 여부 확인
	$('input').each(function(){
		if($(this).is(':disabled, [readonly]')){
			$(this).parent().addClass('inp_disabled');
		}
	});
	
	
	// 아코디언
	if( $(".acco_wrap .item .acco_btn").length > 0 ){
		acco.accoInit();
	};

	// 공통 펼치기, 닫기 버튼 이벤트
	setTimeout(function(){
		btnAni.autoHei();
	}, 200);
	$(".more_wrap .btn_open").bind("click", function(){
		btnAni.btnMore(this);
	});
	if( $(".btn_wrap .btn_show").length > 0 ){
		btnAni.showAni();
	};

	//툴팁
	tip.init();
    
	// 부모창 여부 확인 후 해당 iframe show
	if(parent.getCurrentFream() != ""){
		$(parent.document).find("#" + parent.getCurrentFream()).show();	
	}
	
	//탭(ty6)
	$('.tab_ty6 .item').on('click',function(e){
		e.preventDefault();
		$(this).addClass('active').siblings().removeClass('active');
	});
	
	
	/**
	 * 좌우 스와이프 영역 관련
	 */
	 $(function(){
         pub_ui.search()
     });


	 //아코디언(카드형태)
	accoCard.accoInit();
	$(".has_acco .item .acco_btn").unbind("click").bind("click", function(e){
		e.preventDefault();
		accoCard.accoClick(this);
	});

	//카드형태 이벤트
	cardBoxEvent.init();

	// 테이블 배경 포커스
	tblFocus.cellUnite();

	// 리사이즈 이벤트
	window.addEventListener('resize', function(e) {
		btnAni.autoHei();
	}, true);

	let THIS_LOCATION_URL = document.location.href;
	// 플로팅 메뉴 관련 Show 여부
	if(THIS_LOCATION_URL.indexOf("G.mo") > -1){
		$("#floating_menu").show();
	}

	//상단 프로그래스 영역
	// topProgs.init();

	//설계목록 스크롤
	if ( $(".contents .scrollInner").length > 0 ){
		scrollMove.elFocus();
	};

	// total_bottomSheet 있을시 하단 간격 자동 조정
	bottomSpace();

	// hyphen 너비 변경
	$(".form-table .cell.hyphen").each(function(){
		if ($(this).text().trim().length > 0){
			$(this).css("width","18px");
		}
	})
});

// topMenuBtn : TOP버튼
function topMenuBtn(){
 $('html, body').animate({
		scrollTop : 0}, 400); 
	return false;
} 

// focus 이동 ( target_btn > target_focus )
$(document).on('click', '.target_btn', function(){
	$('.target_focus').find('input, select').focus();
});


// 알릴의무 : 입력여부 확인
var checkFixed = {
		click: function(target){
			var _self = this,
			$target = $(target);
			$target.on('click', function(){
				var $this = $(this);
				if($(this).parents('.check_fixed').hasClass('is_opened') == true){
					$(this).parents('.check_fixed').removeClass('is_opened');
					 $('html body').css('overflow', '');
					 if(parent){
						 if(parent.fnLTAP000000G){
							 parent.fnLTAP000000G.quickVisible(true);
						 }
					 }
				} else{
					$(this).parents('.check_fixed').addClass('is_opened');
					$('html body').css('overflow', 'hidden');
					if(parent){
						if(parent.fnLTAP000000G){
							parent.fnLTAP000000G.quickVisible(false);
						}
					}
				}
			});
		},

};
checkFixed.click();


// 공통 z-index 
var zIndex = 99;

function bottomSpace(){
	/*if($(".contents .total_bottomSheet").length > 0){
		$(".renew .contents").addClass("bottomSpace");
	};*/
	
	$('.total_bottomSheet').each(function(){
		if($(this).is('.total_bottomSheet')){
			$(this).parents('.contents').addClass('bottomSpace');
		}
	});
};


// 공통 펼치기, 닫기 버튼 기능
var btnAni = {
    autoHei : function(){
		// table
		if ( $(".more_wrap [class^='table-']").length > 0 ){
			for( var i=0; i<$(".more_wrap [class^='table-']").length; i++ ){
				var tblHei = 0;
				$(".more_wrap [class^='table-']").eq(i).closest(".more_wrap").addClass("tbl");
				
				if( $(".more_wrap.tbl:eq("+i+") [class^='table-'] tbody tr").length > 3 ){ // 4줄 부터 기능 추가
					var line = 3;
					if( $(".more_wrap.tbl:eq("+i+")[class*='line_']").length > 0 ){
						var lineNum = $(".more_wrap.tbl:eq("+i+")[class*='line_']").attr("class").split(" ");
						for( var j=0; j<lineNum.length; j++ ){
							if( lineNum[j].indexOf("line_") > -1 ){
								line = lineNum[j].slice(lineNum[j].indexOf("_")+1);
							};
						};
					};
					for( var j=0; j<line; j++ ){
						if( $(".more_wrap.tbl:eq("+i+") [class^='table-'] tbody tr").eq(j).outerHeight() == undefined ){
							tblHei += 53;
						}else{
							tblHei += $(".more_wrap.tbl:eq("+i+") [class^='table-'] tbody tr").eq(j).outerHeight();
						};
					};
					$(".more_wrap.tbl:eq("+i+") [class^='table-']").height( ($(".more_wrap.tbl:eq("+i+") [class^='table-'] thead").outerHeight() || 0) + tblHei );
				};
			};
		};

		// 카드
		if ( $(".more_wrap .card_box_wrap").length > 0 ){
			for( var i=0; i<$(".more_wrap .card_box_wrap").length; i++ ){
				var listHei = 0;
				$(".more_wrap .card_box_wrap").eq(i).closest(".more_wrap").addClass("card");
				
				if( $(".more_wrap.card:eq("+i+") .card_box_wrap dt").length > 4 ){
					for( var j=0; j<4; j++ ){
						listHei += Math.max( $(".more_wrap.card:eq("+i+") .card_box_wrap dt").eq(j).outerHeight(true), $(".more_wrap.card:eq("+i+") .card_box_wrap dd").eq(j).outerHeight(true) );
					};
					$(".more_wrap.card:eq("+i+") .card_box_info").height( Math.ceil(listHei) );
				};
			};
		};

	},
    btnMore : function(target){
		if( $(target).closest(".more_wrap.on").length > 0 ){
			$(target).closest(".more_wrap").removeClass("on");
			if( $(target).find(".blind").length == 0 ){
				$(target).find(">span").text("펼치기");
			}else if( $(target).find(".blind").length > 0 ){
				$(target).find(".blind").text("펼치기");
			};
		}else{
			$(target).closest(".more_wrap").addClass("on");
			if( $(target).find(".blind").length == 0 ){
				$(target).find(">span").text("닫기");
			}else if( $(target).find(".blind").length > 0 ){
				$(target).find(".blind").text("닫기");
			};
		};
	},
    showAni : function(){
		for( var i=0; i<$(".btn_wrap .btn_show").length; i++ ){
			if( $(".btn_show").eq(i).hasClass("on") == true ){
				$(".btn_show:eq("+i+") .blind").text("접기");
				$(".btn_show:eq("+i+")").closest(".btn_wrap").parent('div').find(".show_wrap").stop().slideDown({
					duration: 300
				});
			}else{
				$(".btn_show:eq("+i+") .blind").text("펼치기");
				$(".btn_show:eq("+i+")").closest(".btn_wrap").parent('div').find(".show_wrap").slideUp(300);
			};
		};

		$(".btn_wrap .btn_show").unbind("click").bind("click", function(){
			if( $(this).hasClass("on") == true ){
				$(this).find(".blind").text("펼치기");
				$(this).removeClass("on");
				$(this).closest(".btn_wrap").parent('div').find(".show_wrap").stop().slideUp(300);
			}else{
				$(this).find(".blind").text("접기");
				$(this).addClass("on");
				$(this).closest(".btn_wrap").parent('div').find(".show_wrap").stop().slideDown({
					duration: 300,
					complete: function(){
						
					}
				  });
			};			
		});
	}
};

var tblFocus = {
	cellUnite : function(){
		$(".table-col.table_data").bind("click", function(e){
			var index = $(e.target).closest("tr").index();
			var getRow = 0;				
			$(".table-col.table_data").find("tr.hover").removeClass("hover"); // 클래스 삭제
			for( var i=index; i>=0; i-- ){
				if( $(e.target).closest("tbody").find("tr").eq(index).find("th").length == 1 && $(e.target).closest("tbody").find("tr").eq(index).find("th").attr("rowspan") == undefined ){
					$(e.target).closest("tbody").find("tr").eq(index).addClass("hover"); // 선택된 셀 클래스 추가
					break;
				};
				if( $(e.target).closest("tbody").find("tr").eq(i).find("th").attr("rowspan") != undefined ){
					getRow = $(e.target).closest("tbody").find("tr").eq(i).find("th").attr("rowspan") !== undefined ? $(e.target).closest("tbody").find("tr").eq(i).find("th").attr("rowspan") : 0
					for( var j=0; j<getRow; j++ ){
						// console.log( "선택", index, getRow );
						$(e.target).closest("tbody").find("tr").eq(i+j).addClass("hover"); // 선택된 셀 클래스 추가
					};
					break;
				};
			};
		});
	},
	extraCellUnite : function(){
		$(".table-col.table_data:not(.tblIpt)").bind("click", function(e){
			if( $(e.target).closest(".table-col").find("tbody tr th input[type='checkbox']").length == 0 && $(e.target).closest(".table-col").find("tbody tr th input[type='radio']").length == 0 ){
				var index = $(e.target).closest("tr").index();
				var getRow = 0;				
				$(e.target).closest(".table-col.table_data:not(.tblIpt)").find("tr th.hover").removeClass("hover"); // 클래스 삭제
				for( var i=index; i>=0; i-- ){
					if( $(e.target).closest("tbody").find("tr").eq(i).find("th").length > 0 ){
						$(e.target).closest("tbody").find("tr").eq(i).find("th").addClass("hover"); // 선택된 셀 클래스 추가
						break;
					};
				};
			};
		});
	}
};

var acco = {
	accoInit : function(){
		// 아코디언
		$(".acco_wrap .acco_head .acco_btn").each(function(idx, item){
			// 하단 유의사항일 경우 default 펼침
			if( $(item).closest(".acco_wrap").hasClass('noti') == true){
				$(item).closest('.item').addClass('on');
				$(item).closest(".item").find('> .acco_body').css('display', 'block');
			};

			if( $(item).closest(".item").hasClass("on") == true ){
				$(item).closest(".item.on").find("> .acco_body").css({"display":"block"});
				$(item).attr({
					"role":"button",
					"tabindex":0
				});
				if( $(item).find("> .blind.txt").length == 0 ){
					$(item).closest(".item.on").find("> .acco_head .acco_btn").append('<span class="blind txt">접기</span>');
				};
				$(item).closest(".item").find('.acco_head  input[type="radio"]').prop('checked', true);
			}else{
				$(item).attr({
					"role":"button",
					"tabindex":0
				});
				if( $(item).find("> .blind.txt").length == 0 ){
					$(item).closest(".item").find("> .acco_head .acco_btn").append('<span class="blind txt">펼치기</span>');
				};
			};
		});

		$(".acco_wrap .item .acco_btn").unbind("click").bind("click", function(e){
			e.preventDefault();
			acco.accoClick(this);
		});
	},
	accoClick : function(target){
		if( $(target).closest(".item").find("> .acco_body").length > 0 ){
			if( $(target).closest(".item").hasClass("on") == true ){ // 닫힘
				$(target).closest(".item").removeClass("on");
				$(target).find("> .blind.txt").text("펼치기");
				$(target).closest(".item").find("> .acco_body").stop(true, true).slideUp(230);
				$(target).closest(".item").find('.acco_head  input[type="radio"]').prop('checked', false);
			}else{ // 펼침
				$(target).closest(".acco_list").find("> .item").removeClass("on");
				$(target).closest(".item").addClass("on");
				$(target).closest(".acco_list").find("> .item .acco_btn .blind.txt").text("펼치기");
				$(target).find("> .blind.txt").text("접기");
				$(target).closest(".acco_list").find("> .item > .acco_body").stop(true, true).slideUp(230);
				$(target).closest(".item").find("> .acco_body").stop(true, true).slideDown({
					duration: 230
				});
				$(target).closest(".item").find('.acco_head  input[type="radio"]').prop('checked', true);
			};
		};
	},
	accoDevContl : function(target, idx){
		$(target).closest(".item").find("> .acco_head .acco_btn").trigger("click");
		$(target).closest(".acco_list").find("> .item:eq("+idx+") .acco_btn").trigger("click");
	}
};

var customSltBox = {
    custmSelData : "", // 선택된 상품 데이터 값
    sltAni : function(target){ // 기능
        if($(target).closest(".custom_slt").hasClass("on") == true){
			$(target).closest(".custom_slt").find(".sellist_group").stop().slideUp({
				duration: 300,
				complete: function(){
					$(target).closest(".custom_slt").removeClass("on");
				}
			});
		}else{
            $(target).closest(".custom_slt").find(".sellist_group").stop().slideDown({
                duration: 300,
                complete: function(){

				}
		  	});
			$(target).closest(".custom_slt").addClass("on");
		};
		$(target).closest(".custom_slt").find(".sellist_group").css({"z-index":zIndex++});

	},
    sltData : function(target){ // 데이터 삽입
        if($(target).closest("li").hasClass("select") == false){
			$(target).closest(".sel_list").find(".block").removeAttr('title');
			$(target).attr("title", "선택됨");
			$(target).closest(".sel_list").find("> li").removeClass("select");
			$(target).closest("li").addClass("select");
		};

		$(target).closest(".sellist_group").stop().slideUp({
			duration: 300,
			complete: function(){
				$(target).closest(".custom_slt").removeClass("on");
			}
		});

		// data 추가
		customSltBox.custmSelData = $(target).closest(".custom_slt").find(".select .block .tit").html();
		$(target).closest(".custom_slt").find(".sel").html(customSltBox.custmSelData);
	}
};

// 툴팁
var tip = {
	make : function(){
		$('.tooltip').each(function(){
			$(this).wrap('<div class="tip"><div class="tip_wrap"></div></div>');

			if($(this).hasClass('text')){	// 툴팁 텍스트
				$(this).find('.text_tip').prependTo($(this).closest('.tip_wrap'));
				$(this).closest('.tip').addClass('text');
				$(this).closest('.tip').find('.tooltip.text').removeClass('text');
				if($(this).closest('.tip').find('.text_ellipsis').length > 0){
					$(this).closest('.tip').css('display','block');
					$(this).closest('.tip_wrap').css('display','block');
				}
			}else{	// 툴팁 아이콘
				$(this).closest('.tip_wrap').prepend('<button type="button" class="icoBtn_tip"><span class="blind">도움말</span></button>');	
			}

			$(this).wrapInner('<div class="cont"></div>');
			$(this).append('<button type="button" class="icoBtn_close"><span class="도움말 닫기"></span></button>');
			$(this).append('<div class="arrow"></div>');
		});
	},
	init : function(){
		tip.make();
		for(var  i = 0 ; i < $('.tip_wrap').length ; ++i ){
			$('.tip_wrap:eq('+i+') > .icoBtn_tip, .tip_wrap:eq('+i+') > .text_tip').bind({
				'click':function(e){
					e.preventDefault();
					if($(this).parent().hasClass('on') == false ){
						$(this).next().attr("tabindex", -1).focus();
						$(this).parent().addClass('on');
						tip.open( $(this) );
					}
				},
				'mouseenter':function(e){
					if( $(this).next().hasClass('in') == false ){
						$('.tip_wrap').removeClass('on');
						tip.open( $(this) );
					}
				},
				'mouseleave':function(e){
					if($(this).parent().hasClass('on') == false ){
					}
				}
			});

			$('.tip_wrap:eq('+i+') .icoBtn_close').bind({
				'click':function(e){
					e.preventDefault();
					tip.close( $(this) );
				}
			});
		};
	},
	open : function(target){
		tip.setPosRec( target );
		tip.setPosArrow( target );
		target.next().css('width', tip.getWidth( target ));
	},
	close : function (target){
		target.parent().parent().removeClass('on');
		target.parent().removeClass('in');
	},
	setPosArrow : function(target) {
		var tipX = target.closest('.tip').offset().left;
		var tipWidth = target.closest('.tip').outerWidth();

		target.next().find('.arrow').offset({left : (tipX + tipWidth) - (tipWidth / 2) - 7});
	},
	setPosRec : function(target) {
		var recX = 20;
		var recY = target.closest('.tip').offset().top + target.closest('.tip').outerHeight();

		if(target.closest('.layer').length != 0){	// 팝업
			recX = target.closest('.layer_wrap').offset().left + 20;
		}
		
		target.next().offset({left : recX , top : recY + 10});
	},
	getWidth : function(target) {
		if(target.closest('.layer').length != 0){	// 팝업
			return target.closest('.layer_wrap').width() - 40;
		}else {
			return $(window).width() - 40;
		}
	},
};

// 카드형태 아코디언
var accoCard = {
	accoInit : function(){
		// 아코디언
		$(".card_box_wrap.has_acco").each(function(idx, item){
			if( $(item).find(".item.on").length > 0 ){
				$(item).find(".item.on .acco_body").css({"display":"block"});
				$(item).find(".item .acco_btn").attr({
					"role":"button",
					"tabindex":0
				});
				$(item).find(".item:not(.on) .acco_btn").append('<span class="blind txt">펼치기</span>');
				$(item).find(".item.on .acco_btn").append('<span class="blind txt">접기</span>');
			}else{
				$(item).find(".item .acco_btn").attr({
					"role":"button",
					"tabindex":0
				});
				$(item).find(".item .acco_btn").append('<span class="blind txt">펼치기</span>');
			};
		});
	},
	accoClick : function(target){
		if( $(target).closest(".item").find(".acco_body").length > 0 ){
			if( $(target).closest(".item.on").length > 0 ){ // 닫힘
				$(target).closest(".has_acco").find(".item").removeClass("on");
				$(target).closest(".has_acco").find(".item").find("> .blind.txt").text("펼치기");
				$(target).closest(".has_acco").find(".item").find(".acco_body").stop(true, true).slideUp(230);

				if( $(target).siblings(".single").length > 0 && $(target).closest(".has_acco").find('.single input').is(":checked") ){ //아코디언 안에 라디오버튼
					$(target).closest(".has_acco").find('.single input').prop("checked",false);
				}
				
			}else{ // 펼침
				if( $(target).siblings(".single").length > 0 ){ //아코디언 안에 라디오버튼
					$(target).closest(".item").find('.single input').prop("checked",true);
				}

				$(target).closest(".card_box_area .has_acco").find(".item").removeClass("on");
				$(target).closest(".item").addClass("on");
				$(target).closest(".has_acco").find(".item .acco_btn .blind.txt").text("펼치기");
				$(target).find("> .blind.txt").text("접기");
				$(target).closest(".acco_wrap").find(".item .acco_body").stop(true, true).slideUp(230);
				$(target).closest(".item").find(".acco_body").stop(true, true).slideDown({
					duration: 230
				});

				$(target).closest(".has_acco").siblings(".has_acco").find(".item").removeClass("on");
				$(target).closest(".has_acco").siblings(".has_acco").find(".item").find("> .blind.txt").text("펼치기");
				$(target).closest(".has_acco").siblings(".has_acco").find(".item").find(".acco_body").stop(true, true).slideUp(230);
			};
		};
	},
};

//카드형태 input 이벤트
var cardBoxEvent = {
	init : function(){
		var $rdo = $(".card_box_wrap.ty02 .single input[type=radio]");
		var $chk = $(".card_box_wrap.ty02 .card_box_header input[type=checkbox]");
		var $accoRdo = $(".has_acco .single input");
		var $accoInfo = $(".has_acco.info");

		$rdo.each(function(index,obj){
			if ( $(obj).is(':checked') ){
				$(obj).closest('.card_box_wrap.ty02').addClass('active');
			}

			$(obj).bind({
				'change':function(e){
					$(this).closest('.card_box_wrap.ty02').addClass('active');
					$(this).closest('.card_box_wrap.ty02').siblings('.card_box_wrap.ty02').removeClass('active');
				}
			});
		});

		$chk.each(function(index,obj){
			if ( $(obj).is(':checked') ){
				$(obj).closest('.card_box_wrap.ty02').addClass('active');
			}

			$(obj).bind({
				'change':function(e){
					if ( $(obj).is(':checked') ){
						$(this).closest('.card_box_wrap.ty02').addClass('active');
					}else {
						$(this).closest('.card_box_wrap.ty02').removeClass('active');
					}
				}
			});
		});

		$accoRdo.each(function(index,obj){
			$(obj).bind({
				'change':function(e){
					$(this).closest('.card_box_wrap.ty02').addClass('active');
					$(this).closest('.card_box_wrap.ty02').siblings('.card_box_wrap.ty02.active').removeClass('active');
				}
			});
		});
	},
} 

// 상단 프로그래스바(가입설계청약)
var topProgs = {
	init : function(){
		var current = $('.top_progress').data('current');
		var total = $('.top_progress').data('total');
		var calc = (100 / total) * current;

		$('.top_progress').attr("aria-label","총 " + total + "단계 중 " + current + "단계");
		$('.top_progress').append("<a href='#' class='prev'></a>");
		$('.top_progress').append("<div class='bar'><span></span></div>");
		$('.top_progress').append("<div class='num'>" + current + "<span>/" + total + "</span></div>");
		$('.top_progress').append("<a href='#' class='next'></a>");

		$('.top_progress').find('.bar span').css("width",calc + '%');
	}
}

function bottomLayer(openFlag){
	let targetLayer = $("#" + POPUP_LAYER_ID);
	if( typeof openFlag === "undifined"){
		targetLayer.toggleClass("is_opened");
	}else{
		if(openFlag){
			targetLayer.removeClass("is_opened");
			targetLayer.addClass("is_opened");
		}else{
			targetLayer.removeClass("is_opened");
		}
	}
}

/***
 * 대상 페이지 내에서의 Bottom Sheet 열기, 닫기
 * @param id (bottomSheet 영역의 Id)
 * @param openFlag (열기=true/닫기=false)
 */
function bottomSheetLayer(id, openFlag){
	let targetLayer = $("#" + id);
	if( typeof openFlag === "undifined"){
		targetLayer.toggleClass("is_opened");
		if(targetLayer.hasClass("is_opened")){
			CURRENT_LAYER_CNT++;
			$("html").css("overflow", "hidden");
		}else{
			CURRENT_LAYER_CNT--;
			if(CURRENT_LAYER_CNT == 0){
				$("html").css("overflow", "auto");	
			}
		}
	}else{
		if(openFlag){
			CURRENT_LAYER_CNT++;
			targetLayer.removeClass("is_opened");
			targetLayer.addClass("is_opened");
			$("html").css("overflow", "hidden");
		}else{
			CURRENT_LAYER_CNT--;
			targetLayer.removeClass("is_opened");
			if(CURRENT_LAYER_CNT == 0){
				$("html").css("overflow", "auto");	
			}
		}
	}
}

var _POP_RESOLVE_ = null;
/****
 * 바텀시트 열기
 * @param id
 */
function openBottomLayer(){
	var promise = new Promise(function(res, rej) {
		bottomLayer(true);
		_POP_RESOLVE_ = res;
	});
	CURRENT_LAYER = POPUP_LAYER_ID;
	return promise;
}
/****
 * 바텀시트 닫기
 * @param id
 */
function closeBottomLayer(){
	bottomLayer(false);
	if(_POP_RESOLVE_){
		_POP_RESOLVE_();
	}
	CURRENT_LAYER = "";
}
/***
 * 풀팝업(iFrame) 열기
 */
function openFrame(src){
	var promise = new Promise(function(res, rej) {
		$("#" + POPUP_LAYER_ID).attr("src", src);
		$("html").css("overflow", "hidden");
		_POP_RESOLVE_ = res;
	});
	CURRENT_LAYER = POPUP_LAYER_ID;
	return promise;
}

/***
 * 풀팝업(iFrame) 닫기
 */
function closeFrame(isBoolean){
	$("html").css("overflow", "auto");	
	
	$("#" + POPUP_LAYER_ID).hide();
	if(_POP_RESOLVE_){
		_POP_RESOLVE_(isBoolean);
	}
	CURRENT_LAYER = "";
}

/***
 * 레이어 팝업 및 레이어 바텀시트 iFrame 으로 열기
 */
function openLayerFrame(src){
	bottomLayer(true);
	return openFrame(src);
}

/***
 * 레이어 팝업 및 레이어 바텀시트 iFrame 닫기
 */
function closeLayerFrame(isBoolean){
	bottomLayer(false);
	closeFrame(isBoolean);
}

function getCurrentFream(){
	return CURRENT_LAYER;
}

function openFrame2(id, src){
	$("#" + id).attr("src", src);
	$("html").css("overflow", "hidden");
	CURRENT_LAYER = id;
}

/***
 * 풀팝업(iFrame) 닫기
 */
function closeFrame2(id){
	$("html").css("overflow", "auto");	
	$("#" + id).hide();
	CURRENT_LAYER = "";
}


// 스크롤 여부 체크
function hasScroll(){
	return $("body").prop("scrollHeight") > $("body").prop("clientHeight");
};
	
var prevScroll = 0;
var scrollMove = {
	elFocus : function(){
		var topFix = $("#header .location").outerHeight()+2 || 52;
		var bottomFix = $(".renew .btn_fixed").outerHeight() || 60;
		var parentPb = parseInt( $(".renew .contents").css("padding-bottom").replace("px","") );
		var mt = 10;
		var scrollVal = parentPb;
		var basePb = parseInt( $(".renew .contents").css("padding-bottom").replace("px","") );
		
		//$(".scrollInner .acco_btn").bind("click", function(){
		
		$(document).on("click", ".scrollInner .single input", function(){
			var prevIdx = $(".scrollInner").find(".card_box_wrap.focus").index();
			var nextIdx = $(this).closest(".card_box_wrap").index();
			

			
			if ( $(this).closest(".has_acco").hasClass("focus") ){ //이미 focus 되어있을 때
				//$(".scrollInner").find(".card_box_wrap").removeClass("focus");


			}else { 
				$(this).closest(".card_box_area").find(".has_acco.focus").removeClass("focus");
				//$(this).closest(".card_box_area").find(".has_acco.active").removeClass("active");
				$(this).closest(".has_acco").addClass("focus");
				$(this).closest(".has_acco").find('.single input').prop("checked",true);
			}

			parentPb = parseInt( $(".renew .contents").css("padding-bottom").replace("px","") );

			mt = parseInt( $(this).closest(".card_box_wrap").css("margin-top").replace("px","") );

			topFix = Math.ceil( $(this).closest(".card_box_wrap").offset().top - ($("#header .location").outerHeight()+2) );

			/*if(prevIdx - nextIdx < 0 && prevIdx != -1) {
				topFix -= 2;
			}*/
			//console.log( (document.querySelector(".focus").getBoundingClientRect().top-$("#header .location").outerHeight()-110) - Math.abs( $("body").prop("clientHeight")-($("body").prop("scrollHeight") - $(window).scrollTop())) );

			if( $(this).closest(".focus").length > 0 ){
				if( hasScroll() == false ){ // 스크롤 없을때
					scrollVal = (document.querySelector(".focus").getBoundingClientRect().top+100+mt+bottomFix);
	
					/*if( basePb > scrollVal ){
						scrollVal = basePb;
						scrollVal += 2;
					};*/

					if( prevIdx == -1){
						scrollVal += 100;
					}
	
					$(".renew .contents").css({"padding-bottom":Math.floor(scrollVal)});
					$('html, body').animate({
						scrollTop : topFix
					}, 500);
				}else{
					scrollVal = parentPb + ( (document.querySelector(".focus").getBoundingClientRect().top-mt+bottomFix) - Math.abs($("body").prop("clientHeight")-($("body").prop("scrollHeight") - $(window).scrollTop())) - 100 );
	
					if( basePb > scrollVal ){
						scrollVal = basePb;
					};
	
					/*if( prevScroll > 100 && prevIdx - nextIdx > 0 ){
						scrollVal += 2;
					}*/
	
					$(".renew .contents").css({"padding-bottom":Math.floor(scrollVal)});
					$('html, body').animate({
						scrollTop : topFix
					}, 500);
					
				}
				prevScroll = scrollVal;
			}

		});
		
	}
};


