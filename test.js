// @charset UTF-8
/*
* [MyOlleh] version [1.0]
*
* Copyright �� 2024 kt corp. All rights reserved.
*
* This is a proprietary software of kt corp, and you may not use this file except in
* compliance with license agreement with kt corp.. Any redistribution or use of this
* software, with or without modification shall be strictly prohibited without prior written
* approval of kt corp, and the copyright notice above does not evidence any actual or
* intended publication of such software.
*
* @author kt
* @since 2024. 5. 13.
* @version [1.0]
* @see
* @Copyright �� 2024 By KT corp. All rights reserved.
*
* ----------------------------------------------------------------------------
* 媛쒖젙 �대젰 : �섏젙�� | �섏젙�� | �섏젙�댁슜 
* ----------------------------------------------------------------------------
* 2024. 5. 13. | 91360041 | 理쒖큹 �묒꽦  
* 2024. 5. 29. | 91360041 | DR-2024-誘몃벑濡� OTT 援щ룆 �ы꽭_v2.0 �곸슜
* 2024. 7. 18. | 91360041 | KT�룹뺨 OTT 援щ룆 '�룻뵆由�뒪 PI' 媛��� �щ� 議고쉶 愿��� �섏젙
* 2024. 10. 14. | 91360041 | s_OttSubscribeView2.js Merge
* ----------------------------------------------------------------------------
*/
var appFlag = false;
if(getMyKtAppYn()){
	appFlag = true;	
}
var subscribeApplyArray = {};
/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M怨⑤씪蹂닿린_v1.3 START */
var prodReserveAjax = false;
/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M怨⑤씪蹂닿린_v1.3 END */
var bigBannerAjax = false;
var prodListAjax = false;
var lifeAjax = false;
var guideAjax = false;
var netflixReturn = '';
var ottUsingStepFocus = '';
/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M媛쒖꽑_v1.2 START */
const opageCommendItems = '.opage-commend-banner';	// �댁슜媛��대뱶 �섎떒 諛곕꼫
const opageCommendMoreItems = '.opage-more-banner';	// HOT&NEW �섎떒 �좊같��
const opageSubscriptionItems = '.opage-subscription-banner';	// �덉빟�뚮┝�좎껌 �꾩슜 �좊같��
/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M媛쒖꽑_v1.2 END */
let $opageSwiper;
let $opageItem;
let $opageSliderItem;
let $opageAutoPlay;
let $opagePause;
let $opageNextButton;
let $opagePrevButton;
let $swiperReturnButton;
history.scrollRestoration = 'manual';
var controller = $.extend(new $.CommonObj(), { // 怨듯넻 �⑥닔 �곸냽 (2depth 源뚯� �덉슜�⑸땲��.)
	prdJsonData: {},
	eventInit: function() 
	{
		//console.log('eventInit');
		//誘몃줈洹몄씤�� 濡쒓렇�� �섏씠吏�濡� �대룞
		$(document).on('click', '.loginPageBtn', function() {
			parent.mkt.goLogin();
		});
	
		// 蹂댄샇�� �뺣낫蹂닿린 �앹뾽
		$(document).on("click", ".dispProtectedInfoBtnNew", function(e) {
			e.preventDefault();
			//留덉뒪�� �댁젣�� 寃쎌슦 留덉뒪�뱁빐�� 踰꾪듉 �대┃�� �붾㈃留� 由대줈�� �댁젣 �앹뾽X 
			var footerIsUnMasking = $("#footerIsUnMasking").val(); //FooterCommon.jsp�� 議댁옱
			if (typeof footerIsUnMasking !='undefined' && footerIsUnMasking =='true'){
				
				return;
			}
			
			
			var svcUrl = '/product/s_OttCertAuthPerson.do';
			var data = {
					'certGubun' : 'MAEM'
				  , 'locateUri' : location.href // �꾩젣 uri濡� �뚯븘���쇳븿.
				  , 'adobeStaticsDiv' : '留덉뒪�뱀쿂由ъ씪�쒗빐��'
			};
			openOttLayer(svcUrl, 'type5', 'POST', $(this), data);
		});

		// �꾨떞�곷떞�쇳꽣 踰꾪듉�대┃
		$(document).on("click", ".cscenterInfoBtn, .mypage-cscenter-talk", function(e){
			e.preventDefault();

			if($(this).attr('class').indexOf('cscenterInfoBtn') > -1)
			{
				try{KT_trackClicks('mKT-媛쒖씤_留덉씠�섏씠吏�','^mKT-媛쒖씤_�곹뭹�쒕퉬��_紐⑤컮��_OTT援щ룆^�뚮줈�낅찓��^�곷떞�쇳꽣�곌껐');}catch(e){}
				controller.setAdobe('^m^KT-媛쒖씤^�곹뭹^紐⑤컮��^OTT援щ룆^�뚮줈�낅찓��^�곷떞�쇳꽣�곌껐�덈궡');
			}
			else if($(this).attr('class').indexOf('mypage-cscenter-talk') > -1)
			{
				try{KT_trackClicks('mKT-媛쒖씤_留덉씠�섏씠吏�','^mKT-媛쒖씤_�곹뭹�쒕퉬��_紐⑤컮��_OTT援щ룆^�뚮줈�낅찓��^�곷떞�쇳꽣�곌껐^�쎄퀬鍮좊Ⅸ�꾪솕�곷떞');}catch(e){}
				controller.setAdobe('^m^KT-媛쒖씤^�곹뭹^紐⑤컮��^OTT援щ룆^�뚮줈�낅찓��^�곷떞�쇳꽣�곌껐�덈궡');
			}

			openOttPopup('#cscenterInfoPopup', 'type6', $(this));
		});

		$(document).on("click", '.opage-trend-sector [data-ottprodid="PL244F925"]', function(e) {
			e.preventDefault();
			$('li[data-ottprodid="PL244F925"] button').first().click();
		});

		// �몄쬆�붾㈃�쇰줈 �대룞
		$(document).on("click", ".ottCertBtnList button", function(e) {
			e.preventDefault();

			if (!$("#chkAgree").is(":checked")) {
				alert("蹂몄씤 �뺤씤 �덉감 吏꾪뻾�� �숈쓽�� 二쇱꽭��.");
				$("label[for=chkAgree]").focus();
				return false;
			}

			var action = "";
			if ($(this).hasClass("sms")) { // sms �몄쬆
				action = "/common/s_SmsCertInfo.do";
			} else if ($(this).hasClass("pin")) {	// ipin �몄쬆
				action = "/common/s_IpinCertInfo.do";
			} else if ($(this).hasClass("certificate")) { // �좎슜移대뱶
				action = "/common/s_CardCertInfo.do";
			} else if ($(this).hasClass("ars")) { // ars
				action = "/common/s_ARSCertInputPopup.do";
			}

			$("#certRedirectForm").attr("target", "_self");
			//https://m.kt.com/#mypage �듯빐�� �몄엯��  target=_top , locateUri=https://m.kt.com/#mypage濡� 泥섎━ �꾩슂 23.03.09 juneep
			if(top.location.href.indexOf("m.kt.com/#mypage") >= 0 || top.location.href.indexOf("mtb.kt.com/#mypage") >=0 ) {
				$("input[name=locateUri]").val(top.location.href);
				$("#certRedirectForm").attr("target", "_top");
			}
			$("#certRedirectForm").attr("action", action);
			$("#certRedirectForm").submit();
		});

		// 怨듭쑀�섍린 踰꾪듉
		$(document).on("click", '.shareCopyBtn', function() {
			$('#sharePage').attr('type', 'text');
			$('#sharePage').select();

			//var copy = document.execCommand('copy');
			navigator.clipboard.writeText("https://" + $('#sharePage').val()).then(res => {
				$('#sharePage').attr('type', 'hidden');
				alert('URL 蹂듭궗媛� �꾨즺�섏뿀�듬땲��. 怨듭쑀�섍퀬 �띠� 怨녹뿉 遺숈뿬�ｊ린 �섏꽭��.');
				return false;
			})
		});

		// 怨꾩젙李얘린 �뺤씤踰꾪듉
		$(document).on("click", "#goAccountFindBtn, #goAccountRegBtn", function(e) {
			e.preventDefault();
			var url = $(this).attr("netflixUrl") + $(this).attr("token");
			var os = "";
			var agent = navigator.userAgent.toLowerCase();
			if(agent.indexOf("os=os001") > -1) {
				os = "OS001";
			}else if(agent.indexOf("os=os002") > -1) {
				os = "OS002";
			}else if(agent.indexOf("os=os003") > -1) {
				os = "OS003";
			}else if(agent.indexOf("os=os004") > -1) {
				os = "OS004";
			}
			if (os != "") {
				if (confirm("해당기능은 넷플릭스에서 제공하며,'확인'버튼을 누르시면 모바일 넷플릭스로 이동하며, 데이터 요금이 발생할 수 있습니다.") == true) {
					doKtcsNativeIf({
						ifName: 'executeExternalApp',
						ifData: JSON.stringify({
							mimeType: "text/html",
							url: url
						})
					});
				}
			} else {
				window.open(url, "_blank");
			}
		});
		
		// 붿쫰+url대룞 KT:釉뚮씪곗 몄텧 / 紐⑤컮쇱쎒:덉갹 泥섎━ 
		$(document).on("click", "#actvDisneyBtn", function(e) {
			e.preventDefault();
			var url = $(this).attr("disneyUrl");
			var isActvPopup = url.indexOf("activate") > -1; //디즈니 계정 등록 레이어팝업 띄우기 위한 boolean

			if(getMyKtAppYn()) {
				if (confirm("대떦湲곕뒫 뱁럹댁먯꽌 쒓났섎ŉ,'뺤씤'踰꾪듉 꾨Ⅴ쒕㈃ 紐⑤컮 뱁럹댁濡 대룞섎ŉ, 곗씠 붽툑 諛쒖깮  덉뒿덈떎.")) {
					doKtcsNativeIf({
						ifName: 'executeExternalApp',
						ifData: JSON.stringify({
							mimeType: "text/html",
							url: url
						})
					});
					$('.close').click();
				}
			} else {
				window.open(url, "_blank");
				$('.close').click();
			}
		});

		// 곕튃 url 대룞 KT:釉뚮씪곗 몄텧 / 紐⑤컮쇱쎒:덉갹 泥섎━ 
		$(document).on("click", "#findTvingId", function(e) {
			e.preventDefault();
			var url = $(this).attr("tvingUrl");
			var isActvPopup = url.indexOf("activate") > -1;

			if(getMyKtAppYn()) {
				if (confirm("해당기능은 티빙에서 제공하며,'확인'버튼을 누르시면 모바일 티빙으로 이동하며, 데이터 요금이 발생할 수 있습니다.")) {
					doKtcsNativeIf({
						ifName: 'executeExternalApp',
						ifData: JSON.stringify({
							mimeType: "text/html",
							url: url
						})
					});
					if(isActvPopup) $(".close").click();
				}
			}else{
				window.open(url, "_blank");
				if(isActvPopup) $(".close").click();
			}
		});
		
		// 곕튃 url 대룞 KT:釉뚮씪곗 몄텧 / 紐⑤컮쇱쎒:덉갹 泥섎━ 
		$(document).on("click", "#actvTvingBtn", function(e) {
			e.preventDefault();
			var url = $(this).attr("tvingUrl");
			var isActvPopup = url.indexOf("activate") > -1;

			if (getMyKtAppYn()) {
				if (confirm("대떦湲곕뒫 뱁럹댁먯꽌 쒓났섎ŉ,'뺤씤'踰꾪듉 꾨Ⅴ쒕㈃ 紐⑤컮 뱁럹댁濡 대룞섎ŉ, 곗씠 붽툑 諛쒖깮  덉뒿덈떎.")) {
					doKtcsNativeIf({
						ifName: 'executeExternalApp',
						ifData: JSON.stringify({
							mimeType: "text/html",
							url: url
						})
					});
					$(".close").click();
				}
			} else {
				window.open(url, "_blank");
				$(".close").click();
			}
		});
		
		// 좏뒠釉 url 대룞 KT:釉뚮씪곗 몄텧 / 紐⑤컮쇱쎒:덉갹 泥섎━
		$(document).on("click", ".usingYoutubeUrlbtn", function(e) {
			e.preventDefault();
			var url = $(this).attr("youtubeUrl");
			var isActvPopup = url.indexOf("activate") > -1;
			
			if(getMyKtAppYn()){
				if (confirm("대떦湲곕뒫 뱁럹댁먯꽌 쒓났섎ŉ,'뺤씤'踰꾪듉 꾨Ⅴ쒕㈃ 紐⑤컮 뱁럹댁濡 대룞섎ŉ, 곗씠 붽툑 諛쒖깮  덉뒿덈떎.")) {
					doKtcsNativeIf({
						ifName: 'executeExternalApp',
						ifData: JSON.stringify({
							mimeType: "text/html",
							url: url
						})
					});
					if(isActvPopup) $(".close").click();
				}
			}else{
				window.open(url, "_blank");
				if(isActvPopup) $(".close").click();
			}
		});
		
		// 肄대떎 url 대룞 KT:釉뚮씪곗 몄텧 / 紐⑤컮쇱쎒:덉갹 泥섎━ 
		$(document).on("click", "#actvQandaBtn", function(e) {
			e.preventDefault();
			var url = $(this).attr("qandaUrl");
			var isActvPopup = url.indexOf("activate") > -1;

			if (getMyKtAppYn()) {
				if (confirm("대떦湲곕뒫 뱁럹댁먯꽌 쒓났섎ŉ,'뺤씤'踰꾪듉 꾨Ⅴ쒕㈃ 紐⑤컮 뱁럹댁濡 대룞섎ŉ, 곗씠 붽툑 諛쒖깮  덉뒿덈떎.")) {
					doKtcsNativeIf({
						ifName: 'executeExternalApp',
						ifData: JSON.stringify({
							mimeType: "text/html",
							url: url
						})
					});
					$(".close").click();
				}
			} else {
				window.open(url, "_blank");
				$(".close").click();
			}
		});
		
		
		// 援щ룆以 / 덉빟뚮┝좎껌 count
		var usingOttPrdCnt = $('.usingAddedOttPrdList').length + $('.usingOttPrd').length;
		var reserOttPrdCnt = $('.reserOttPrdList').length;
		$('.subscription.count').text(usingOttPrdCnt);
		$('.reservation.count').text(reserOttPrdCnt);

		//�쒕퉬�ㅼ꽕 諛 뚮윭ㅼ샃 대┃ 대깽
		$(document).on('click', '.opage-reservation-list .oradio', function() {
			controller.choiceOptionChk();
		});

		// 구독상품 상세검색 클릭 이벤트
		$(document).on('click', '#opage-product .btn-serarch', function() {
			openOttPopup('#subscSearchPopup', 'type1', $(this));
		});

		// 구독상품보기 > 상세검색 > 초기화
		$(document).on('change', '#subscSearchPopup .ocheckbox', function() {
			controller.prodListOptionChk();
		});

		// 援щ룆곹뭹蹂닿린 > 곸꽭寃  > 珥덇린
		$(document).on('click', '#subscSearchPopup .btn-fix .resetOn', function() {
			controller.searchPopinit();
		});

		// 援щ룆곹뭹蹂닿린 > 곸꽭寃  > 좏깮꾨즺
		$(document).on('click', '#subscSearchPopup .btn-fix .select', function() {
			controller.getOttSubscribeProdListHtml('Y');
		});

		// 援щ룆곹뭹蹂닿린 > 곸꽭꾪솴
		$(document).on('click', '#opage-product .ottProductFrame', function(e) {
			// 蹂섏꽭
			fnSetSubscribeApply($(this).closest('li'), $(this));
			controller.ottProductIframe($(this));
		});

		// ㅼ댄봽곸뿭 援щ룆좎껌
		$(document).on('click', '.subscribeSwiperBtn', function(e) {
			if(!bigBannerAjax || !prodListAjax || !lifeAjax || !guideAjax || !prodReserveAjax) return;
			
			
			$swiperReturnButton = $opageItem.find($(this)).parents('.swiper-slide-active').find('a');
			
			var varData = controller.getSerializedData({
				encSvcContId: $("#selectProdList").val(),
				isMilleUsingYn : $("#isMilleUsingYn").val(),
				isEbookUsingYn : $("#isEbookUsingYn").val(),
				ottProdId: $(this).data('ottprodid')
			});
			controller.ajaxSend({
				url : "/product/s_OttSubscribeAddedProdInfo.json"
				, data : varData
				, dataType : 'json'
				, type : 'post'
				, async : false
				, isOverLap : false
				, successCall : function(jsonObj) {
					var data = jsonObj.prdInfo;
					if(data)
					{
						subscribeApplyArray["ottProdId"]			= data.ottProdId;	// 곹뭹id
						subscribeApplyArray["ottProdCtg"]			= data.ottProdCtg;	//  移댄뀒怨좊━
						subscribeApplyArray["wdicLinkMobileUrl"]	= data.wdicLinkMobileUrl;
						subscribeApplyArray["ottProdNm"] 			= data.ottProdNm;	// 곹뭹紐
						subscribeApplyArray["ottProdPosibleAge"] 	= data.ottProdPosibleAge;	// 媛낃μ뿰
						subscribeApplyArray["usingYn"] 				= data.usingYn;	// 媛낇븳 곹뭹몄 
						subscribeApplyArray["saleYn"] 				= data.saleYn;	// 꾩옱 媛낃ν븳 곹뭹  <-- 꾩슂놁쓣吏
						subscribeApplyArray["reserveProdYn"] 		= data.reserveProdYn;	// 덉빟 곹뭹몄 
						
						// 濡쒓렇 泥댄겕
						var isNextGo = controller.isLoginChk('N');
						if(!isNextGo) return;
			
						ottUsingStepFocus = $(this);
						if(nflxAcceptCheck() == "N")
						{
							openOttPopup('#nflxAcceptCheckPopup', 'type1', $swiperReturnButton, {isOpend : true, isLayerSwiper : 'swiper', isSwiper : $opageSwiper, isSwiperItem : $opageItem, isSlider : $opageSliderItem, isAutoplay : $opageAutoPlay, isPause : $opagePause, isNext : $opageNextButton, isPrev : $opagePrevButton, isNowPlay : $opageSwiper.autoplay.running}); 
						}
						else
						{
							openOttPopup('#subscribeApplyInfoPopup', 'type2', $swiperReturnButton, {isOpend : true, isLayerSwiper : 'swiper', isSwiper : $opageSwiper, isSwiperItem : $opageItem, isSlider : $opageSliderItem, isAutoplay : $opageAutoPlay, isPause : $opagePause, isNext : $opageNextButton, isPrev : $opagePrevButton, isNowPlay : $opageSwiper.autoplay.running}); 
						}
					}
				}
			});
		});

		// 덉빟뚮┝ 좎껌踰꾪듉
		$(document).on('click', '.reserveNodataBtn, .reserveSwiperBtn', function(e) {
			if(!bigBannerAjax || !prodListAjax || !lifeAjax || !guideAjax || !prodReserveAjax) return;
			
			$swiperReturnButton = $opageItem.find($(this)).parents('.swiper-slide-active').find('a');
			
			var _focus = $(this);
			if($(this).attr('class') != 'reserveSwiperBtn')
			{
				try{KT_trackClicks('mKT-媛쒖씤_留덉씠�섏씠吏�', '^mKT-媛쒖씤_�곹뭹�쒕퉬��_紐⑤컮��_OTT援щ룆^�덉빟�뚮┝�좎껌�앹뾽^�덉빟�뚮┝�좎껌');}catch(e){}
				controller.setAdobe('^m^KT-媛쒖씤^�곹뭹^紐⑤컮��^OTT援щ룆^좏깮뺤삁쎌븣由쇱떊泥뙘');
			}
			else _focus = '.opage-swiper';

			// 濡쒓렇 泥댄겕
			var isNextGo = controller.isLoginChk('N');
			if(!isNextGo) return;

			if($('#isReserveCnt').val() > 0)
			{
				openOttPopup('#reserveApplyMultiPopup', 'type2', $swiperReturnButton, {isOpend : true, isLayerSwiper : 'swiper', isSwiper : $opageSwiper, isSwiperItem : $opageItem, isSlider : $opageSliderItem, isAutoplay : $opageAutoPlay, isPause : $opagePause, isNext : $opageNextButton, isPrev : $opagePrevButton, isNowPlay : $opageSwiper.autoplay.running});
			}
			else
			{
				if(prodListAjax)
				{
					alert('덉빟媛ν븳 곹뭹 놁뒿덈떎.');
				}
				return false;
			}
		});

		// OTT 援щ룆곹뭹 援щ룆좎껌踰꾪듉
		$(document).on('click', '#opage-product .ottUsingbtn', function(e) {
			e.preventDefault();

			// 蹂섏꽭
			fnSetSubscribeApply($(this).closest('li'), $(this));

			// 濡쒓렇 泥댄겕
			var isNextGo = controller.isLoginChk('Y');
			if(!isNextGo) return;

			ottUsingStepFocus = $(this);
			if(nflxAcceptCheck() == "N")
			{
				openOttPopup('#nflxAcceptCheckPopup', 'type1', $(this));
			}
			else
			{
				if($(this).data('isreserveyn') == 'Y') controller.ottUsingYn($(this));
				else openOttPopup('#subscribeApplyInfoPopup', 'type2', $(this));
			}
		});

		// HOT&NEW 援щ룆좎껌踰꾪듉
		$(document).on('click', '.opage-trend .ottUsingbtn', function(e) {
			e.preventDefault();

			// 蹂섏꽭
			fnSetSubscribeApply($(this).closest('.opage-trend-items'), $(this));

			// 濡쒓렇 泥댄겕
			var isNextGo = controller.isLoginChk('Y');
			if(!isNextGo) return;

			if(nflxAcceptCheck() == "N")
			{
				openOttPopup('#nflxAcceptCheckPopup', 'type1', $(this));
			}
			else
			{
				if($(this).data('isreserveyn') == 'Y') controller.ottUsingYn($(this));
				else openOttPopup('#subscribeApplyInfoPopup', 'type2', $(this));
			}
		});

		// 댁떆쒓렇 좏깮
		$(document).on('click', '.btn-hash-white', function() {
			
			// #꾩껜瑜 좏깮덉쓣 寃쎌슦
			if($(this).text() == '#꾩껜') {
				// 紐⑤뱺 댁떆쒗겕 좏깮 댁  this(#꾩껜)먮쭔 selected瑜 異붽
				$('.btn-hash-white').removeClass('selected');
				$(this).addClass('selected');
				// 紐⑤뱺 댁떆쒗겕 title 쒓굅  this(#꾩껜)먮쭔 title='좏깮'瑜 異붽
				$('.btn-hash-white').removeAttr('title');
				$(this).attr('title', '좏깮');
				// 댁떆쒓렇 좏깮  곸꽭寃 議곌굔  珥덇린
				$('#opage-product .title-grouping .btn-serarch').html('곸꽭寃');
			} else {
				// 湲곗〈媛믪씠 꾩껜 좏깮섏뼱덉쓣  꾩껜좏깮 踰꾪듉 class 쒓굅泥섎━
				if($('.btn-hash-white.selected').eq(0).text() == '#꾩껜') {
					$('.btn-hash-white').removeClass('selected');
					$('.btn-hash-white').removeAttr('title');
				}
				
				// 좏깮媛믪씠 쉼윭媛  덉쓣 寃쎌슦(꾩껜 X) => 좏깮 媛 댁
				if($(this).attr('title') !== undefined && $('.btn-hash-white.selected').length > 1) {
					$(this).removeClass('selected');
					$(this).removeAttr('title');
				} else {
					// 湲곗〈媛믪씠 꾩껜媛 꾨땲硫댁꽌 湲곗〈 좏깮 媛믪쓣 ㅼ떆 좏깮 => #꾩껜濡 蹂寃쎌쿂由
					if($('.btn-hash-white.selected').eq(0).text() == $(this).text()) {
						$(this).removeClass('selected');
						$(this).removeAttr('title');
					} else {
						$(this).addClass('selected');
						$(this).attr('title', '좏깮');
						$('#opage-product .title-grouping .btn-serarch').html('곸꽭寃');
					}
				}
			}

			controller.getOttSubscribeProdListHtml('Y');
		});

		// 援щ룆덉빟뚮┝ 痍⑥냼踰꾪듉
		$(document).on('click', '.reservCancel', function(e) {
			e.preventDefault();

			// 濡쒓렇 泥댄겕
			var isNextGo = controller.isLoginChk('N');
			if(!isNextGo) return;

			var svcUrl = "/product/s_OttSubscribeAddedProdChangeCheck.do";
			//var svcUrl = "/product/s_OttSubscribeAddedProdChange.do";
			var prodId = $(this).closest('div').data("ottprodid");
			var unitSvcId = $(this).closest('div').data("unitsvcid");
			var prodHstSeq = $(this).closest('div').data("prodhstseq");
			var ottProdCtg = $(this).closest('div').data("ottprodctg");
			var ottProdNm = $(this).closest('div').data("ottprodnm");
			var adobeStatics = "댁";
			var ctgryId = "RRL";
			
			var smsSendDate = $(this).closest('div').data("alarmdt").split('.').join('');	//ㅼ젙
			//var smsSendDate = $('#reserveAlarmDt').val().split('.').join('');	//ㅼ젙
			var chgParam = "";
			smsSendDate = smsSendDate+"000000";
			chgParam = smsSendDate + "|";
			
			var chgParam = {
				encSvcContId : $("#selectProdList").val(),
				adobeStaticsDiv : adobeStatics,
				chgProdTypeCd : "RC",
				chgProdId : prodId,
				unitSvcId : unitSvcId,
				prodHstSeq : prodHstSeq,
				prodSaleAmtVat : "臾대즺",
				vasProdNm : ottProdNm,
				ctgryId : ctgryId,
				chgParam : chgParam
			};
			
			chgParam = controller.getSerializedData(chgParam);
			controller.getUrlToSubmitPost(svcUrl+"?"+chgParam);
		});
		
		// 援щ룆덉빟뚮┝ 蹂寃쎈쾭
		$(document).on('click', '.reservChange', function(e) {
			e.preventDefault();
			
			// 濡쒓렇 泥댄겕
			var isNextGo = controller.isLoginChk('N');
			if(!isNextGo) return;

			var svcUrl = "/product/s_OttSubscribeAddedProdChangeCheck.do";
			var prodId = $(this).closest('div').data("ottprodid");
			var unitSvcId = $(this).closest('div').data("unitsvcid");
			var prodHstSeq = $(this).closest('div').data("prodhstseq");
			var ottProdCtg = $(this).closest('div').data("ottprodctg");
			var ottProdNm = $(this).closest('div').data("ottprodnm");
			var adobeStatics = "蹂寃";
			var ctgryId = "RRL";

			var smsSendDate = $(this).closest('div').data("alarmdt").split('.').join('');	//ㅼ젙
			var chgParam = "";
			smsSendDate = smsSendDate+"000000";
			chgParam = smsSendDate + "|";

			var chgParam = {
				encSvcContId : $("#selectProdList").val(),
				adobeStaticsDiv : adobeStatics,
				chgProdTypeCd : "RU",
				chgProdId : prodId,
				unitSvcId : unitSvcId,
				prodHstSeq : prodHstSeq,
				encParamSbst : "",
				vasProdNm : ottProdNm,
				prodSaleAmtVat : "臾대즺",
				adobeStatProdTypeCd : "RU",
				ctgryId : ctgryId,
				chgParam : chgParam
			};
				
			// *蹂議 諛⑹瑜 꾪빐 蹂寃쏀븷 곹뭹肄붾뱶 몄뀡 뺣낫 앹꽦
			var isNextGo = controller.createMobileChgProdIdSession(chgParam);
			if (isNextGo) {
				if(svcUrl == "/product/s_MobileSimpleSmsPopup.do" || svcUrl == "/product/s_MobileReqVMSChg.do") {
					mComnCntr.mollehLayerCall({
						url : svcUrl,
						data : controller.getSerializedData(chgParam),
						isBlock : true,
						async : true,
						isOverLap : false,
						type : 'type2',
						$rtnFocus : $(this)
					});
				} else {
					var formOption = {
							"id" : "submitForm",
							"method" : "post",
							"action" : svcUrl
						};
					controller.createForm(formOption);
					controller.setSerializedFormData(chgParam);
					controller.formSubmit();
				}
			} else {
				return false;
			}
		});

		/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M怨⑤씪蹂닿린_v1.3 START */
		// 붽툑쒕줈 댁슜以묒씤 OTT > OTT 怨⑤씪蹂닿린
		$(document).on('click', '.usingOttPrd .goOttPriceView', function(e) {
			var expireProd = $(this).data('isexpireprod');
			var prodReserveYn = $(this).data('prodreserveyn');
			
			var reserveProdRsrvSeq = $('#reserveProdRsrvSeq').val();
			var ottProdGroupYn = $('#ottProdGroupYn').val(); // 꾩옱 붽툑쒓 OTT洹몃９援곗씤吏 먮떒
			var curReserveProdPrice = $('#curReserveProdPrice').val(); // 덉빟 붽툑쒓 OTT洹몃９援곗씤吏 먮떒(깃툒  ㅼ뼱媛 怨녹씠硫, OTT洹몃９ 꾨땶寃쎌슦 "" ㅼ뼱)
			
			if(prodReserveYn == "Y")
			{
				if(curReserveProdPrice == "" && reserveProdRsrvSeq)
				{
					// OTT怨⑤씪蹂닿린 쒗깮 蹂寃 덉빟以 덉씠 (앹뾽) - OTT 珥덉씠ㅼ긽덉씠 꾨땶寃껋쓣 덉빟 蹂寃쎌떊泥븳 곹깭
					openOttPopup('#priceReserveCancelToUsingPopup', 'type1', $(this));
				}
				else
				{
					// 쒗깮 蹂寃 덉빟 以 덉씠 - OTT 珥덉씠ㅼ긽덉쓣 덉빟 蹂寃쎌떊泥븳 곹깭
					openOttPopup('#priceReserveUsingPopup', 'type1', $(this));
				}
			}
			else
			{
				// 媛낆쨷⑥뿬遺 앹뾽  몄텧
				if(expireProd)
				{
					if(expireProd == "TG" || expireProd == "TM")
					{
						openOttPopup('#ottExpireProdTvingPopup', 'type1', $(this));
					}
					else if(expireProd == "YT")
					{
						openOttPopup('#ottExpireProdYoutubePopup', 'type1', $(this));
					} else if(expireProd == "DS"){
						openOttPopup('#ottExpireProdDisneyPopup', 'type1', $(this));
					}
				}
				// 怨⑤씪蹂닿린 OTT 덉씠  몄텧
				else
				{
					window.location.href = "/product/s_OttSubscribePriceChoiceView.do";
				}
			}
		});

		// 怨꾩젙뺤씤
		$(document).on("click", ".accChkBtn, .accUsingChkBtn", function(e) {
			e.preventDefault();

			// 濡쒓렇 泥댄겕
			var isNextGo = controller.isLoginChk('N');
			if(!isNextGo) return;

			var ottProdId = $(this).data('ottprodid');
			var ottProdNm = $(this).data('ottprodnm');
			var ottProdCtg = $(this).data('ottprodctg');
			var unitSvcId = $(this).data('unitsvcid');
			var prodHstSeq = $(this).data('prodhstseq');
			var svcUrl = $(this).data('popurl');
			if(!svcUrl ||  svcUrl == '')
			{
				return false;
			}

			var chgParam = {
				encSvcContId: $("#selectProdList").val(),
				chgProdTypeCd: (($(this).attr('class')).indexOf('accUsingChkBtn') != -1)?"PU":"RU",
				chgProdId: ottProdId,
				unitSvcId: unitSvcId,
				prodHstSeq: prodHstSeq,
				encParamSbst: "",
				vasProdNm: ottProdNm,
				prodSaleAmtVat: "",
				accType: (($(this).attr('class')).indexOf('accUsingChkBtn') != -1)?"P":"R", // 怨꾩젙愿由 援щ텇媛(怨⑤씪蹂닿린꾨즺(P)몄 援щ룆좎껌꾨즺(R)몄)
			};
				
			// *蹂議 諛⑹瑜 꾪빐 蹂寃쏀븷 곹뭹肄붾뱶 몄뀡 뺣낫 앹꽦
			var isNextGo = controller.createMobileChgProdIdSession(chgParam);
			if (isNextGo) {
				openOttLayer(svcUrl, 'type1', 'POST', $(this), chgParam);
			} else {
				return false;
			}
		});
		
		// 怨꾩젙뺤씤 - 룻뵆由뒪
		$(document).on("click", ".accChkBtn_Nflix, .accUsingChkBtn_Nflix", function(e){
			e.preventDefault();

			// 濡쒓렇 泥댄겕
			var isNextGo = controller.isLoginChk('N');
			if(!isNextGo) return;

			var ottProdId			= $(this).data('ottprodid');
			var ottProdNm			= $(this).data('ottprodnm');
			var ottProdCtg			= $(this).data('ottprodctg');
			var accntActiveBtnType	= $(this).data('btntype');
			var svcUrl = '/product/s_OttNetflixAccountFindPopup.do';
			
			var chgParam = {
				encSvcContId : $("#selectProdList").val(),
				chgProdTypeCd : (($(this).attr('class')).indexOf('accUsingChkBtn_Nflix') != -1)?"PU":"RU",
				chgProdId : ottProdId,
				encParamSbst : "",
				vasProdNm : ottProdNm,
				prodSaleAmtVat : "",
				accType: (($(this).attr('class')).indexOf('accUsingChkBtn_Nflix') != -1)?"P":"R" // 怨꾩젙愿由 援щ텇媛(怨⑤씪蹂닿린꾨즺(P)몄 援щ룆좎껌꾨즺(R)몄)
			};

			// 댁
			if(accntActiveBtnType == 'SS')
			{
				netflixReturn = $(this);
				openOttPopup('#netflixCancelConfirmPopup', 'type1', netflixReturn, chgParam);
			}
			// 댁좎껌以
			else if(accntActiveBtnType == 'CP')
			{
				openOttPopup('#netflixCancelIngPopup', 'type1', $(this));
			}
			// 怨꾩젙깅줉
			else if($(this).data('usingottprdactvayn') == "N")  // 붽툑 怨꾩젙 誘몃벑濡앹씪寃쎌슦 怨꾩젙깅줉
			{
				svcUrl = '/product/s_OttNetflixAccountRegPopup.do';
				openOttLayer(svcUrl, 'type1', 'POST', $(this), chgParam);
			}
			// 怨꾩젙李얘린
			else
			{
				openOttLayer(svcUrl, 'type1', 'POST', $(this), chgParam);
			}
			return false;
		});
		
		// 덉빟痍⑥냼  앹뾽
		$(document).on("click",".btnPriceReserveCnclChk",function(e) {
	 		e.preventDefault();
	 		
			openOttPopup('#priceReserveCnclPopup', 'type1', $(this));
	 	});
		
		// 붽툑쒕줈 댁슜以묒씤 OTT 곹뭹  덉빟痍⑥냼
		$(document).on("click",".btnPriceReserveCncl",function(e) {
	 		e.preventDefault();
			//callKTTrackClick("^mKT-媛쒖씤_留덉씠_�붽툑/�쒕퉬��^OTT怨⑤씪蹂닿린^�덉빟痍⑥냼");
			$('#priceReserveCnclPopup .opage-close').trigger('click');
			
			var chgProdId = $("#reserveProdId").val();
			var prodRsrvSeq = $("#reserveProdRsrvSeq").val();
			var reserveCnclRegDt = $("#reserveCnclRegDt").val();
			
			var varData = controller.getSerializedData({
				encSvcContId : $("#selectProdList").val(),
				adobeStaticsDiv : "댁",
				chgProdTypeCd : "PRC",
				prodRsrvSeq : prodRsrvSeq,
				chgProdId : chgProdId,
				reserveCnclRegDt : reserveCnclRegDt
			});
			
			//if (confirm("蹂寃 덉빟 痍⑥냼섏떆寃좎뒿덇퉴?") == true) {
				controller.ajaxSend({
					url:'/product/s_OttSubscribeReservePriceChange.json',
					data: varData,
					dataType:'json',
					type : 'post',
					isBlock:true,
					async:true,
					isOverLap:true,
					successCall:function(jsonObj) {
						var alertMsg = "";
						if(jsonObj.moPriceResDto.svcResult == 'Y'){
							alertMsg = "蹂寃 덉빟 痍⑥냼 섏뿀듬땲.";
						} else{
							alertMsg = "痍⑥냼 泥섎━媛 ㅽ뙣섏뿀듬땲. : " + jsonObj.moPriceResDto.svcResultMsg;
						}
						alert(alertMsg);
						
						var chgParam = {
					  		 encSvcContId : $("#selectProdList").val()
						};
						
						var formOption = { "id" : "submitForm", "method" : "post", "action" : "/product/s_OttSubscribeView.do" }
						controller.createForm(formOption);
						controller.setSerializedFormData(chgParam);
						controller.formSubmit();
					}
				});
			//}
	 	});
		/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M怨⑤씪蹂닿린_v1.3 END */
		
		//�곹뭹蹂닿린 踰꾪듉 대┃
		$(document).on("click", ".goOpageProduct", function(e) {
            $('.opage-tabs li:eq(1) button').trigger('click');
        });
        
		/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M怨⑤씪蹂닿린_v1.5 START */
		// 怨⑤씪蹂닿린 덈궡 踰꾪듉
		$(document).on("click", '.ottChsInfoBtn', function() {
			openOttPopup('#ottChsInfoPopup', 'type1', $(this));
		});
		
		//  OTT 怨꾩젙 깅줉 덈궡 踰꾪듉
		$(document).on("click", '.ottRegInfoBtn', function() {
			openOttPopup('#ottRegInfoPopup', 'type1', $(this));
		});
		
		// 諛곕꼫 대룞(덉갹,섏씠吏  대룞 援щ텇 꾪빐)
		$(document).on("click", '.bannerLink', function() {
			var url = $(this).data("value");
			var isActvPopup = url.indexOf("activate") > -1;
			
			if($(this).data("gubun") == "Y"){
				if (getMyKtAppYn()) {
					if (confirm("대떦湲곕뒫 뱁럹댁먯꽌 쒓났섎ŉ,'뺤씤'踰꾪듉 꾨Ⅴ쒕㈃ 紐⑤컮 뱁럹댁濡 대룞섎ŉ, 곗씠 붽툑 諛쒖깮  덉뒿덈떎.")) {
						doKtcsNativeIf({
							ifName: 'executeExternalApp',
							ifData: JSON.stringify({
								mimeType: "text/html",
								url: url
							})
						});
						if (isActvPopup)
							$(".close").click();
					}
				} else {
					window.open(url, "_blank");
					if (isActvPopup)
						$(".close").click();
				}
			}else{
				setTimeout(function() {
					location.href = url;
				}, 300);
			}
			
		});
		
		/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M怨⑤씪蹂닿린_v1.5 END */
	},
	// (꾩닔)붾㈃  濡쒕뵫섎㈃ ㅽ뻾 肄붾뵫쒕떎.
	onCreate: function() 
	{
		//console.log('onCreate');
		// 뚯꽑좏깮
		controller.findOtherSvc();

		/* DR-2024-誘몃벑濡_OTT 援щ룆 異붽 媛쒕컻_2李-M怨⑤씪蹂닿린_v1.3 START */
		var prodListIsBlock = ($('#chgProdIdParam').val() || $('#isLoginChgProdIdParam').val() || $('#hashtagParam').val() || $('#sharedLinkYnParam').val() == 'Y') ? "Y" : "N";
		/* DR-2024-誘몃벑濡_OTT 援щ룆 異붽 媛쒕컻_2李-M怨⑤씪蹂닿린_v1.3 END */

		/* DR-2024-誘몃벑濡_OTT 援щ룆 異붽 媛쒕컻_2李-M怨⑤씪蹂닿린_v1.3 START */
		if($('#prodReserveYn').val() == 'Y') controller.getOttSubscribeReservePriceHtml();
		else prodReserveAjax = true;
		/* DR-2024-誘몃벑濡_OTT 援щ룆 異붽 媛쒕컻_2李-M怨⑤씪蹂닿린_v1.3 END */

		controller.getOttSubscribeBigBannerHtml();
		// 쒕뵫 URL hashtag 뚮씪誘명꽣 媛믪씠 덉쓣 寃쎌슦
		if($('#hashtagParam').val()){
			controller.getOttSubscribeProdListHtml(prodListIsBlock, $('#hashtagParam').val());	
		} else {
			controller.getOttSubscribeProdListHtml(prodListIsBlock);	
		}
		controller.getOttSubscribeLifeHtml('N');
		controller.getOttSubscribeGuideHtml();

		if($('#chgProdIdParam').val())
		{
			//console.log('prodListAjax ==> '+prodListAjax);
			var chgProdIdInterval = setInterval(function() {
				//console.log('prodListAjax ==> '+prodListAjax);
				if(prodListAjax)
				{
					clearInterval(chgProdIdInterval);
					var param = {
						flag : 'chgProdId',
						ottProdId : $('#chgProdIdParam').val()
					};

					setTimeout(function() {
						controller.loginCallback(param);
					}, 500);
				}
			}, 100);
		}
		else if($('#isLoginChgProdIdParam').val())
		{
			//console.log('prodListAjax ==> '+prodListAjax);
			var chgProdIdInterval = setInterval(function() {
				//console.log('prodListAjax ==> '+prodListAjax);
				if(prodListAjax)
				{
					clearInterval(chgProdIdInterval);
					var param = {
						flag : 'isLoginChgProdId',
						ottProdId : $('#isLoginChgProdIdParam').val()
					};
							
					setTimeout(function() {
						controller.loginCallback(param);
					}, 500);
				}
			}, 100);
		}
		else if($('#sharedLinkYnParam').val() == 'Y')
		{
			//console.log('prodListAjax ==> '+prodListAjax);
			var chgProdIdInterval = setInterval(function() {
				//console.log('prodListAjax ==> '+prodListAjax);
				if(prodListAjax)
				{
					clearInterval(chgProdIdInterval);

					setTimeout(function(){
						controller.ottReserveProd(true);
					}, 500);
				}
			}, 100);
		}
	},
	loginCallback: function(param)
	{
		// 몃留곹겕濡  곹뭹ъ쟾愿  덉씠대 몄텧  
		if(param.flag == 'chgProdId' && param.ottProdId)
		{
			// https://dev.m.my.kt.com/product/s_OttSubscribeView.do?chgProdId=PL242S729
			fnSetSubscribeApply($('.opage-subscription>li[data-ottprodid='+param.ottProdId+']'), '');
			
			var prodId = subscribeApplyArray["ottProdId"];
			if(typeof prodId == 'undefined'){
				alert("좎껌 媛ν븳 곹뭹.");
				return false;
			}
			
			controller.ottProductIframe('.opage-subscription');
		}
		// 援щ룆  誘  濡쒓렇몄쑝濡  濡쒓렇명럹댁瑜 媛붾떎  
		else if(param.flag == 'isLoginChgProdId' && param.ottProdId)
		{
			var varData = controller.getSerializedData({
				encSvcContId: $("#selectProdList").val(),
				isMilleUsingYn : $("#isMilleUsingYn").val(),
				isEbookUsingYn : $("#isEbookUsingYn").val(),
				ottProdId: param.ottProdId
			});
			controller.ajaxSend({
				url : "/product/s_OttSubscribeAddedProdInfo.json"
				, data : varData
				, dataType : 'json'
				, type : 'post'
				, async : false
				, isOverLap : false
				, successCall : function(jsonObj) {
					var data = jsonObj.prdInfo;
					if(data)
					{
						subscribeApplyArray["ottProdId"]			= data.ottProdId;	// 곹뭹id
						subscribeApplyArray["ottProdCtg"]			= data.ottProdCtg;	//  移댄뀒怨좊━
						subscribeApplyArray["wdicLinkMobileUrl"]	= data.wdicLinkMobileUrl;
						subscribeApplyArray["ottProdNm"] 			= data.ottProdNm;	// 곹뭹紐
						subscribeApplyArray["ottProdPosibleAge"] 	= data.ottProdPosibleAge;	// 媛낃μ뿰
						subscribeApplyArray["usingYn"] 				= data.usingYn;	// 媛낇븳 곹뭹몄 
						subscribeApplyArray["saleYn"] 				= data.saleYn;	// 꾩옱 媛낃ν븳 곹뭹  <-- 꾩슂놁쓣吏
						subscribeApplyArray["reserveProdYn"] 		= data.reserveProdYn;	// 덉빟 곹뭹몄 
						
						openOttPopup('#subscribeApplyInfoPopup', 'type2', '.opage-subscription');
					}
				}
			});
		}
	},
	/* DR-2024-誘몃벑濡_OTT 援щ룆 異붽 媛쒕컻_2李-M怨⑤씪蹂닿린_v1.3 START */
	getOttSubscribeReservePriceHtml: function() {
		var varData = controller.getSerializedData({
			encSvcContId: $("#selectProdList").val(),
			curProdId: $("#useProdId").val()
		});
		controller.ajaxSend({
			url: "/product/s_OttSubscribeReservePriceHtml.do",
			data: varData,
			dataType: "html",
			type: "post",
			isBlock: true,
			isBlockTarget: "#s_OttSubscribeReservePriceHtml",
			async: true,
			isOverLap: true,
			successCall: function(jsonObj) {
				controller.setOttSubscribeReservePriceHtml(jsonObj);
			}
		});
	},
	setOttSubscribeReservePriceHtml: function(jsonObj) {
		$("#s_OttSubscribeReservePriceHtml").html(jsonObj);
		prodReserveAjax = true;
		ottTextData();
	},
	/* DR-2024-誘몃벑濡_OTT 援щ룆 異붽 媛쒕컻_2李-M怨⑤씪蹂닿린_v1.3 END */
	getOttSubscribeBigBannerHtml: function() 
	{
		var varData = controller.getSerializedData({
			encSvcContId: $("#selectProdList").val(),
		});
		controller.ajaxSend({
			url: "/product/s_OttSubscribeBigBannerHtml.do",
			data: varData,
			dataType: "html",
			type: "post",
			isBlock: true,
			isBlockTarget: "#s_OttSubscribeBigBannerHtml",
			async: true,
			isOverLap: true,
			successCall: function(jsonObj) {
				controller.setOttSubscribeBigBannerHtml(jsonObj);
			}
		});
	},
	setOttSubscribeBigBannerHtml: function(jsonObj)
	{
		$("#s_OttSubscribeBigBannerHtml").html(jsonObj);
	
		$opageItem = $('.opage-swiper');
		
		if($('.opage-item-slider').length > 1)
		{
			$opageSwiper = new Swiper(".opage-swiper", {
				slidesPerView : 1,
				loop : true,
				a11y : false,
				resistance : false,
				slideToClickedSlide : true,
				allowTouchMove : true,
				autoplay: {
					delay: 3000,
					disableOnInteraction: false,
				},
				wrapperClass: "opage-swiper-wrapper",
				slideClass : "opage-item-slider",
				navigation : {
					nextEl : "page-next",
					prevEl : "page-prev",
				},
				pagination : {
					el : '.opage-pagination',
					type : 'custom',
					renderCustom: function (swiper, current, total) {
						return $('.opage-pagination').attr({'aria-label' : current, 'aria-description' : "珥 " + total + "媛쒖쓽  以 " + current + "踰덉㎏  以", "tabindex" : 0}), "<span class='current' aria-hidden='true' aria-label='" + current + "' aria-description='" + current + "踰덉㎏  以'>" + current + "/</span><span class='total' aria-hidden='true' aria-label='" + total + "' aria-description='珥 " + total + "媛쒖쓽  以'>" + total + "</span>"
					}
				},
				on : {
					init : function() {
						this.slides.attr('aria-hidden', true);
						this.slides[this.activeIndex].setAttribute('aria-hidden', 'false');
					},
					slideChange : function(activeIndex) {
						this.slides.attr('aria-hidden', true);
						this.slides.children("a").forEach((item, index) => {
							if(this.activeIndex === index) {
								item.setAttribute('tabindex', 0);
							} else {
								item.setAttribute('tabindex', -1);
							}
						});
						this.slides[this.activeIndex].setAttribute('aria-hidden', 'false');
					}
				}
			});

			$opageSliderItem = $opageItem.find('.opage-item-slider');
			$opageAutoPlay = $opageItem.find('.autoplay');
			$opagePause = $opageItem.find('.pause');
			$opageNextButton = $opageItem.find('.opage-button-next');
			$opagePrevButton = $opageItem.find('.opage-button-prev');

			/**
			 * 페이지 스와이퍼 시작 버튼 설정 함수
			 * - 스와이퍼 자동 재생 시작 버튼의 동작을 설정합니다.
			 */
			function oPageSwiperButtonStartSet() {
				$opageAutoPlay.hide();
				$opagePause.show();
				$opageSwiper.autoplay.start();
			}
			/**
			 * 페이지 스와이퍼 정지 버튼 설정 함수
			 * - 스와이퍼 자동 재생 정지 버튼의 동작을 설정합니다.
			 */
			function oPageSwiperButtonStopSet() {
				$opageAutoPlay.show();
				$opagePause.hide();
				$opageSwiper.autoplay.stop();
			}

			$opageAutoPlay.bind('click', function(e) {
				oPageSwiperButtonStartSet();
				$opagePause.focus();
				e.preventDefault();
			})
			$opagePause.bind('click', function(e) {
				oPageSwiperButtonStopSet();
				$opageAutoPlay.focus();
				e.preventDefault();
			})
			$opageNextButton
				.click(function(e) {
					$opageSwiper.slideNext();
					e.preventDefault();
				})
			$opagePrevButton
				.click(function(e) {
					$opageSwiper.slidePrev();
					e.preventDefault();
				})
		}
		else if($('.opage-item-slider').length == 1)
		{
			$opageAutoPlay = $opageItem.find('.autoplay');
			$opagePause = $opageItem.find('.pause');
			$opageNextButton = $opageItem.find('.opage-button-next');
			$opagePrevButton = $opageItem.find('.opage-button-prev');

			$opageAutoPlay.hide();
			$opagePause.hide();
			$opageNextButton.hide();
			$opagePrevButton.hide();
			$('.opage-pagination').hide();
		}	
		bigBannerAjax = true;
		ottTextData();
	},
	getOttSubscribeProdListHtml: function(flag, hashtag)
	{
		var schKeywordParam = '';
		$('.opage-hashtag .btn-hash-white.selected').each(function(index) {
			schKeywordParam += $(this).data('selcd') + '|';
		});
		if (!schKeywordParam) schKeywordParam = 'All';

		var ctgGrpParam = '';
		$(':checkbox[name="ottSubscCtgGrp"]:checked').each(function(index) {
			ctgGrpParam += $(this).val()+',';
		});

		var prcGrpParam = '';
		$(':checkbox[name="ottSubscPrcGrp"]:checked').each(function(index) {
			prcGrpParam += $(this).val()+'|';
		});
		schKeywordParam = (schKeywordParam != 'All')?schKeywordParam.slice(0, -1):schKeywordParam;
		ctgGrpParam = ctgGrpParam.slice(0, -1);
		prcGrpParam = prcGrpParam.slice(0, -1);

		if(ctgGrpParam || prcGrpParam) schKeywordParam = '';
		
		// 파라미터로 들어온 기존조건 무시하고 해시태그 값으로 세팅
		if(typeof hashtag != 'undefined') {
			schKeywordParam = hashtag;
		}

		var varData = controller.getSerializedData({
			encSvcContId: $("#selectProdList").val()
		  , ctgGrp: ctgGrpParam
		  , prcGrp: prcGrpParam
		  , schKeyword: schKeywordParam
		});
		
		if(flag == 'Y')
		{
			controller.ajaxSend({
				url : "/product/s_OttSubscribeProdListHtml.do",
				data : varData,
				dataType : "html",
				type : "post",
				isBlock : true,
				async : true,
				isOverLap : true,
				blockText : '처리중입니다.',
				successCall : function(jsonObj) {
					$('#subscSearchPopup .close').trigger('click');
					controller.setOttSubscribeProdListHtml(jsonObj);
					
					$('.opage-tabs').opageScrollTabsController({
						app : appFlag //APP, WEB 더미로 반드시 설정 필요
					});
					
					if($('.btn-hash-white.selected').length > 0)
					{
						var _left = ($('.btn-hash-white.selected').last().offset().left - 25 - ($('#opage-product').width() / 2) + ($('.btn-hash-white.selected').last().outerWidth() / 2));
						$('.opage-hashtag').scrollLeft(_left);
						
						// 접근성 이슈 - iOS voiceOver에서 스크롤이 안되는 문제가 있어서 딜레이를 줘서 해결
						setTimeout(function() {
							$('.btn-hash-white.selected').last().focus();
						}, 700);
					}
					else
					{
						// 뱀젒洹쇱꽦 댁뒋 - iOS voiceOver먯꽌 ъ빱깆씠 덈릺  臾몄젣媛  덉뼱  쒕젅대  以섏꽌 닿껐
						setTimeout(function() {
							$('#opage-product .opage-title').focus();
						}, 700);
					}
					//諛由ъ쓽 쒖옱 援щ룆 꾨즺  諛곕꼫대┃ 덉쑝硫 E遺곷━붽린  대┃ 
					var bannerMillebook = sessionStorage.getItem('bannerMillebook');
					
					if(bannerMillebook == "Y") {
						$('li[data-ottprodid="PL244F925"] button').last().click();
						sessionStorage.removeItem('bannerMillebook');
					}
				}
			});
		}
		else
		{
			controller.ajaxSend({
				url: "/product/s_OttSubscribeProdListHtml.do",
				data: varData,
				dataType: "html",
				type: "post",
				isBlock: true,
				isBlockTarget: "#s_OttSubscribeProdListHtml",
				async: true,
				isOverLap: true,
				successCall: function(jsonObj) {
					$('#subscSearchPopup .close').trigger('click');
					controller.setOttSubscribeProdListHtml(jsonObj);

					//諛由ъ쓽 쒖옱 援щ룆 꾨즺  諛곕꼫대┃ 덉쑝硫 E遺곷━붽린  대┃ 
					var bannerMillebook = sessionStorage.getItem('bannerMillebook');

					if(bannerMillebook == "Y") {
						$('li[data-ottprodid="PL244F925"] button').last().click();
						sessionStorage.removeItem('bannerMillebook');
					}
				}
			});
		}
	},
	setOttSubscribeProdListHtml: function(jsonObj)
	{
		$("#s_OttSubscribeProdListHtml").html(jsonObj);

		// iframe 濡쒕뵫  濡쒕뵫붾㈃ 앹꽦
		//$.loadBlock();

		$("iframe").on("load", function() {
			//console.log('iframe load');
			var $target = $(this);
			var that = $target.contents().find("html").height();

			// iframe �대��먯꽌 �ш린 �ㅼ젙 吏꾪뻾�섎굹 �대� 濡쒕뵫 吏��� �� �꾩떆 �ш린 �ㅼ젙
			if(!$.isEmptyObject($target) && $target.height() < that) {
				$target.height(that);
			} else if(!$.isEmptyObject($target) && that <= 150) {
				$target.height("380");		// error �섏씠吏� 湲곕낯 �ㅼ젙
			} else if($target.contents().length == 0) {
				$target.height("680");		// �섏씠吏� �쒕뵫 �ㅻ쪟 �� 湲곕낯 �ㅼ젙
			}

			//$.loadUnBlock();
		});

		prodListAjax = true;
		ottTextData();
		
		/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M媛쒖꽑_v1.2 START */
		if($(opageSubscriptionItems).find('.swiper-slide').length > 1 ) {
			$(opageSubscriptionItems).find('.pagination').show();
			const opageCommendBanner = new Swiper(opageSubscriptionItems, {
				spaceBetween: 25,
				loop : true,
				pagination: {
					clickable: true,
					el: ".pagination",
					renderBullet : function (index, className) {
						return '<a href="#" class="' + className + '">' + (index + 1) + "踰덉㎏ ��ぉ" + '</a>'
					}
				},
				on : {
					init : function(){
						this.slides.attr('aria-hidden', true);
						this.slides[this.activeIndex].setAttribute('aria-hidden', 'false');
					},
					paginationRender : function(){
						//DR-2024-72627 �깆젒洹쇱꽦 �뱀�移� 寃�利앹"移
						$(opageSubscriptionItems).find('.pagination a').eq(this.realIndex).attr('title', '좏깮');
						//DR-2024-72627 깆젒洹쇱꽦 뱀移 寃利앹"移
					},
					slideChange : function(activeIndex){
						//DR-2024-72627 깆젒洹쇱꽦 뱀移 寃利앹"移
						$(opageSubscriptionItems).find('.pagination a').removeAttr('title');
						$(opageSubscriptionItems).find('.pagination a').eq(this.realIndex).attr('title', '좏깮');
						//DR-2024-72627 깆젒洹쇱꽦 뱀移 寃利앹"移

						this.slides.attr('aria-hidden', true);
						this.slides.children("a").forEach((item, index) => {
							if(this.activeIndex === index) {
								item.setAttribute('tabindex', 0);
							} else {
								item.setAttribute('tabindex', -1);
							}
						});
						this.slides[this.activeIndex].setAttribute('aria-hidden', 'false');
					}
				}
			});
		}
		/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M媛쒖꽑_v1.2 END */
		
		$('.window-popup').CopyRender();
	},
	getOttSubscribeLifeHtml: function(flag) 
	{
		var varData = controller.getSerializedData({
			encSvcContId: $("#selectProdList").val()
		});
		
		if(flag == 'Y')
		{
			controller.ajaxSend({
				url : "/product/s_OttSubscribeLifeHtml.do",
				data : varData,
				dataType : "html",
				type : "post",
				isBlock : true,
				async : true,
				isOverLap : true,
				blockText : '처리중입니다.',
				successCall : function(jsonObj) {
					controller.setOttSubscribeLifeHtml(jsonObj);
				}
			});
		}
		else
		{
			controller.ajaxSend({
				url: "/product/s_OttSubscribeLifeHtml.do",
				data: varData,
				dataType: "html",
				type: "post",
				isBlock: true,
				isBlockTarget: "#s_OttSubscribeLifeHtml",
				async: true,
				isOverLap: true,
				successCall: function(jsonObj) {
					controller.setOttSubscribeLifeHtml(jsonObj);
				}
			});
		}
	},
	setOttSubscribeLifeHtml: function(jsonObj)
	{
		$("#s_OttSubscribeLifeHtml").html(jsonObj);

		lifeAjax = true;
		ottTextData();
		
		/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M媛쒖꽑_v1.2 START */
		if($(opageCommendMoreItems).find('.swiper-slide').length > 1 ) {
			$(opageCommendMoreItems).find('.pagination').show();
			const opageCommendBanner = new Swiper(opageCommendMoreItems, {
				spaceBetween: 25,
				loop : true,
				pagination: {
					clickable: true,
					el: ".pagination",
					renderBullet : function (index, className) {
						return '<a href="#" class="' + className + '">' + (index + 1) + "踰덉㎏ ��ぉ" + '</a>'
					}
				},
				on : {
					init : function(){
						this.slides.attr('aria-hidden', true);
						this.slides[this.activeIndex].setAttribute('aria-hidden', 'false');
					},
					paginationRender : function(){
						//DR-2024-72627 깆젒洹쇱꽦 뱀移 寃利앹"移
						$(opageCommendMoreItems).find('.pagination a').eq(this.realIndex).attr('title', '좏깮');
						//DR-2024-72627 깆젒洹쇱꽦 뱀移 寃利앹"移
					},
					slideChange : function(activeIndex){
						//DR-2024-72627 깆젒洹쇱꽦 뱀移 寃利앹"移
						$(opageCommendMoreItems).find('.pagination a').removeAttr('title');
						$(opageCommendMoreItems).find('.pagination a').eq(this.realIndex).attr('title', '좏깮');
						//DR-2024-72627 깆젒洹쇱꽦 뱀移 寃利앹"移

						this.slides.attr('aria-hidden', true);
						this.slides.children("a").forEach((item, index) => {
							if(this.activeIndex === index) {
								item.setAttribute('tabindex', 0);
							} else {
								item.setAttribute('tabindex', -1);
							}
						});
						this.slides[this.activeIndex].setAttribute('aria-hidden', 'false');
					}
				}
			});
		}
		/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M媛쒖꽑_v1.2 END */
	},
	getOttSubscribeGuideHtml: function()
	{
		var varData = controller.getSerializedData({
			encSvcContId: $("#selectProdList").val(),
		});
		controller.ajaxSend({
			url: "/product/s_OttSubscribeGuideHtml.do",
			data: varData,
			dataType: "html",
			type: "post",
			isBlock: true,
			isBlockTarget: "#s_OttSubscribeGuideHtml",
			async: true,
			isOverLap: true,
			successCall: function(jsonObj) {
				controller.setOttSubscribeGuideHtml(jsonObj);
			}
		});
	},
	setOttSubscribeGuideHtml: function(jsonObj)
	{
		$("#s_OttSubscribeGuideHtml").html(jsonObj);

		guideAjax = true;
		ottTextData();
		
		/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M媛쒖꽑_v1.2 START */
		if($(opageCommendItems).find('.swiper-slide').length > 1 ) {
			$(opageCommendItems).find('.pagination').show();
			const opageCommendBanner = new Swiper(opageCommendItems, {
				spaceBetween: 25,
				loop : true,
				pagination: {
					clickable: true,
					el: ".pagination",
					renderBullet : function (index, className) {
						return '<a href="#" class="' + className + '">' + (index + 1) + "踰덉㎏ ��ぉ" + '</a>'
					}
				},
				on : {
					init : function(){
						this.slides.attr('aria-hidden', true);
						this.slides[this.activeIndex].setAttribute('aria-hidden', 'false');
					},
					paginationRender : function(){
						//DR-2024-72627 깆젒洹쇱꽦 뱀移 寃利앹"移
						$(opageCommendItems).find('.pagination a').eq(this.realIndex).attr('title', '좏깮');
						//DR-2024-72627 깆젒洹쇱꽦 뱀移 寃利앹"移
					},
					slideChange : function(activeIndex){
						//DR-2024-72627 깆젒洹쇱꽦 뱀移 寃利앹"移
						$(opageCommendItems).find('.pagination a').removeAttr('title');
						$(opageCommendItems).find('.pagination a').eq(this.realIndex).attr('title', '좏깮');
						//DR-2024-72627 깆젒洹쇱꽦 뱀移 寃利앹"移

						this.slides.attr('aria-hidden', true);
						this.slides.children("a").forEach((item, index) => {
							if(this.activeIndex === index) {
								item.setAttribute('tabindex', 0);
							} else {
								item.setAttribute('tabindex', -1);
							}
						});
						this.slides[this.activeIndex].setAttribute('aria-hidden', 'false');
					}
				}
			});
		}
		/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M媛쒖꽑_v1.2 END */
	},
	ottReserveProd: function(focus)
	{
		try{KT_trackClicks('mKT-媛쒖씤_留덉씠�섏씠吏�', '^mKT-媛쒖씤_�곹뭹�쒕퉬��_紐⑤컮��_OTT援щ룆^�덉빟�뚮┝�좎껌�앹뾽^�덉빟�뚮┝�좎껌');}catch(e){}
		controller.setAdobe('^m^KT-媛쒖씤^�곹뭹^紐⑤컮��^OTT援щ룆^�좏깮�뺤삁�쎌븣由쇱떊泥�뙘��');
		
		// 濡쒓렇�� �щ� 泥댄겕
		var isNextGo = controller.isLoginChk('N');
		if(!isNextGo) return;
		
		if($('#isReserveCnt').val() > 0)
		{
			openOttPopup('#reserveApplyMultiPopup', 'type2', focus);
		}
		else
		{
			if(prodListAjax)
			{
				alert('�덉빟媛��ν븳 �곹뭹�� �놁뒿�덈떎.');
			}
			return false;
		}
	},
	ottProductIframe: function(obj)
	{
		openOttPopup('#ottProductIframePopup', 'type1', obj);
	},
	ottUsingYn: function(obj)
	{
		openOttPopup('#ottUsingYnPopup', 'type1', obj);
	},
	ottUsingStep: function(flag)
	{
		var stepPopup = (flag == 'Y')?'#reserveApplySinglePopup':'#subscribeApplyInfoPopup';
		$('#ottUsingYnPopup .close').trigger('click');
		openOttPopup(stepPopup, 'type2', ottUsingStepFocus);
	},
	createMobileChgProdIdSession: function(layerPopParm)
	{
		var isNextGo = false;
		controller.ajaxSend({
			url: "/product/s_OttProdSessionSet.json",
			data: layerPopParm,
			dataType: "json",
			type: "post",
			async: false,
			successCall: function(jsonObj) {
				isNextGo = true;
			}
		});
		return isNextGo;
	},
	reserveApplyMultiConfirm: function() 
	{
        var ottProdNm = $('input[name="ottSubscReserveProd"]:checked').closest('li').data('ottprodnm');
        try{KT_trackClicks('mKT-媛쒖씤_留덉씠�섏씠吏�','^mKT-媛쒖씤_�곹뭹�쒕퉬��_紐⑤컮��_OTT援щ룆^�덉빟�뚮┝�좎껌�좏깮�뺥뙘��^'+ottProdNm.replace(/ /g,'')+'^�덉빟�뚮┝�좎껌');}catch(e){};
		fnSetSubscribeApply($('input[name="ottSubscReserveProd"]:checked').closest('li'), '');
		controller.ottUsingConfirm('reserve');
	},
	ottUsingConfirm: function(flag)
	{
		/*
		 * �⑥씪�덉빟�좎껌�곹뭹�� �대떦��(�좏깮�뺤� �댁쟾�� �덉빟�щ� 泥댄겕) 
		 * ⑥씪뺤쓽 寃쎌슦 "덉빟 뚮┝ 좎껌" 踰꾪듉 좏깮  대 좎껌 곹깭몄 泥댄겕
		 */
		if(flag == 'reserve' && $('#s_OttSubscribeProdListHtml #grpOttProdId_'+subscribeApplyArray["ottProdCtg"]).data('useyn') == 'Y')
		{
			alert('�대� �덉빟 �뚮┝�� �좎껌 �섏뀲�듬땲��. 留덉씠 OTT�먯꽌 �뺤씤�댁＜�몄슂.');
			return false;
		}
		
		// 濡쒓렇�� �щ� 泥댄겕
		var isNextGo = controller.isLoginChk('Y');
		if(!isNextGo) return false;

		var isCompany			= $('input[name="isCompany"]').val();
		var hasMoProd			= $('input[name="hasMoProd"]').val();
		var isChild				= $('input[name="isChild"]').val();
		var legalCtn			= $('input[name="legalCtn"]').val();
		var isUnder14Age		= $('input[name="isUnder14Age"]').val();
		var isMilleUsingYn		= $('input[name="isMilleUsingYn"]').val();
		var ottProdPosibleAge	= subscribeApplyArray["ottProdPosibleAge"];
		var usingYn				= subscribeApplyArray["usingYn"];
		
		//var svcUrl = "/product/s_MobileAddedProdChangeCheck.do";
		var svcUrl = "/product/s_OttSubscribeAddedProdChangeCheck.do";
		var adobeStatics = "�좎껌";
		var ctgryId = "RRL";
		var encSvcContId = $("#selectProdList").val();

		var newForm = $('<form></form>');
		newForm.attr('method', 'post');
		newForm.attr('action', '/product/s_OttSubscribeEtc.do');
		//newForm.attr('target', '_blank');
		newForm.appendTo('body');
		
		// 1. 以��뚯썝/紐⑤컮�쇰�蹂댁쑀 or 踰뺤씤 �뚯썝 �щ� �뺤씤 -- 踰뺤씤�곗꽑
		if(isCompany == 'true')
		{
			newForm.append('<input type="hidden" name="pageUrlFlag" value="isCompany">');
			newForm.submit();
			return false;
		}
		else if(hasMoProd == 'false' || !hasMoProd)
		{
			newForm.append('<input type="hidden" name="pageUrlFlag" value="noMoProd">');
			newForm.submit();
			return false;
		}
		
		// 2. �좏깮�곹뭹�� 媛��� 媛��� �곕졊 �뺤씤
		if(isChild == 'Y')
		{
			// 吏���, 諛�由�, 釉붾씪�댁뒪�� 媛��낆젣�쒖씠 �놁쓬
			// �� 遺�遺꾩� 19�� 誘몃쭔(isChild) 泥댄겕�먯꽌 �쒗븳�� �녿뒗 寃쎌슦(*踰뺤젙��由ъ씤 �ㅽ럺�� 嫄몃젮�덉쓬)
			// 議곌굔�� 異붽��섎뒗 遺�遺꾩씠��. 14�� 誘몃쭔(isUnder14Age)�� 李⑷컖�섎㈃ �덈맗�덈떎. (踰뺤젙��由ъ씤�� 嫄몃젮�덉뼱�� 14�� 誘몃쭔 媛��� 遺덇� 議곌굔��) 蹂꾨룄濡� �덉뒿�덈떎.
			if(subscribeApplyArray["ottProdCtg"] != 'GENIE'
			&& subscribeApplyArray["ottProdCtg"] != 'MILLI'
			&& subscribeApplyArray["ottProdCtg"] != 'BLICE')
			{
				// 14�� 誘몃쭔�� ��
				if(isUnder14Age == 'Y')
				{
					// �대떦 遺�遺꾩� 14�� 誘몃쭔 �쒗븳�� �녿뒗 寃쎌슦 異붽��섎뒗 議곌굔
					if(subscribeApplyArray["ottProdCtg"] != 'QANDA'){
						alert('誘몄꽦�꾩옄�� 媛��낆씠 遺덇��ν븳 �곹뭹�낅땲��.');
						return false;
					}
				}
				else if(subscribeApplyArray["ottProdCtg"] != 'TVING'
                     && subscribeApplyArray["ottProdCtg"] != 'MOAZN'
                     && subscribeApplyArray["ottProdCtg"] != 'QANDA') 
				{
					alert('誘몄꽦�꾩옄�� 媛��낆씠 遺덇��ν븳 �곹뭹�낅땲��.');
					return false;
				}
				
			}
			//E遺곷━�붽린�� 誘몄꽦�꾩옄 媛��� 遺덇�
			else if(subscribeApplyArray["ottProdId"] == 'PL244F925') 
				{
					alert('誘몄꽦�꾩옄�� 媛��낆씠 遺덇��ν븳 �곹뭹�낅땲��.');
					return false;
				}
		}
		
		// �덉빟�뚮┝ �좎껌 case
		if(flag == 'reserve')
		{
			// 3. �좏깮 �곹뭹�� �댁슜以� �щ�
			if(usingYn == 'Y')
			{
				alert('�대� �덉빟 �뚮┝�� �좎껌 �섏뀲�듬땲��. 留덉씠 OTT�먯꽌 �뺤씤�댁＜�몄슂.');
				return false;
			}

			var prodNm = $('#s_OttSubscribeProdListHtml #grpOttProdNm_'+subscribeApplyArray["ottProdCtg"]).val();

			// �덉빟�뚮┝ �좎껌 而⑦럩 �붾㈃ �대룞
			var chgParam = {
				encSvcContId : encSvcContId,
				adobeStaticsDiv : adobeStatics,
				isMilleUsingYn : isMilleUsingYn,
				chgProdTypeCd : "RA",
				chgProdId : $('#s_OttSubscribeProdListHtml #grpOttProdId_'+subscribeApplyArray["ottProdCtg"]).val(),
				dataChargeEnterYn : "",
				prodSaleAmtVat : "", // prodSaleAmtVat: �� 9,500��<br/>(�� 1,000�� �좎씤 ��  8,500�� 泥�뎄)
				vasProdNm : prodNm,
				ctgryId : ctgryId
			};
		
			var isNextGo = controller.createMobileChgProdIdSession(chgParam);
			
			if (isNextGo) 
			{
				controller.setAdobe('^m^KT-媛쒖씤^�곹뭹^紐⑤컮��^OTT援щ룆^'+prodNm+'^�덉빟�뚮┝�좎껌而⑦럩');
			
				chgParam = controller.getSerializedData(chgParam);
				controller.getUrlToSubmitPost(svcUrl+"?"+chgParam);
			}
		}
		// 援щ룆 �좎껌 case
		else if(flag == 'subscribe')
		{
			// 3. 誘몄꽦�� �щ�
			if(isChild == 'Y')
			{
				// 1) 踰뺤젙��由ъ씤 �깅줉�щ�
				if(!legalCtn)
				{
					controller.setAdobe('^m^KT-媛쒖씤^�곹뭹^紐⑤컮��^OTT援щ룆^踰뺤젙��由ъ씤�깅줉�덈궡');
					newForm.append('<input type="hidden" name="pageUrlFlag" value="noLegalCtn">');
					newForm.submit();
					return false;
				}
				
				// 2) 踰뺤젙��由ъ씤 �몄쬆�붾㈃ �대룞泥섎━
            	var tUrl = svcUrl;
            	var certGubun = "LGMM";
        		svcUrl = "/product/s_OttSubscribeSmsLegalInfo.do";

    			var chgParam = {
					encSvcContId : encSvcContId,
					adobeStaticsDiv : adobeStatics,
					chgProdTypeCd : "RA",
					chgProdId : subscribeApplyArray["ottProdId"],
					dataChargeEnterYn : "",
					prodSaleAmtVat : "",
					vasProdNm : subscribeApplyArray["ottProdNm"],
    				locateUri : tUrl,
        			certGubun : certGubun,
        			adobeStaticsDiv : "蹂몄씤�몄쬆�덈궡",
        			locateAdobeStaticsDiv : adobeStatics,
        			ctgryId : ctgryId
    			};

				// ��*蹂�議� 諛⑹�瑜� �꾪빐 蹂�寃쏀븷 �곹뭹肄붾뱶 �몄뀡 �뺣낫 �앹꽦
				var isNextGo = controller.createMobileChgProdIdSession(chgParam);
				if (isNextGo) {
					chgParam = controller.getSerializedData(chgParam);
					controller.getUrlToSubmitPost(svcUrl+"?"+chgParam);
				}
				return false;
			}

			// �룻뵆由�뒪�� 寃쎌슦 蹂몄씤�몄쬆 �꾨줈�몄뒪 異붽�
			if(subscribeApplyArray["ottProdCtg"] == 'NETFLIX')
			{
				if(nflxAcceptCheck() == "N")
				{
					$("#subscribeApplyInfoPopup .close").click();
					setTimeout(function(){
						openOttPopup('#nflxAcceptCheckPopup', 'type1', netflixReturn);
					}, 600)
					return false;
				}
				else
				{
					controller.setAdobe('^m^KT-媛쒖씤^�곹뭹^紐⑤컮��^OTT援щ룆^'+subscribeApplyArray["ottProdNm"]+'^援щ룆�좎껌而⑦럩');
			
					// �좎껌而댄럩 �붾㈃ �대룞
					var chgParam = {
						encSvcContId : encSvcContId,
						adobeStaticsDiv : adobeStatics,
						chgProdTypeCd : "RA",
						chgProdId : subscribeApplyArray["ottProdId"],
						dataChargeEnterYn : "",
						prodSaleAmtVat : "", // prodSaleAmtVat: �� 9,500��<br/>(�� 1,000�� �좎씤 ��  8,500�� 泥�뎄)
						vasProdNm : subscribeApplyArray["ottProdNm"],
						ctgryId : ctgryId
					};
				
					var isNextGo = controller.createMobileChgProdIdSession(chgParam);
		
					if (isNextGo) {
						svcUrl = "/product/s_NetflixAddedProdChangeCheck.do";
						// �좎껌而댄럩 �붾㈃ �대룞
						var varData = controller.getSerializedData({
							encSvcContId: $("#selectProdList").val(),
							ottProdId: subscribeApplyArray["ottProdId"]
						});
						controller.getUrlToSubmitPost(svcUrl+"?"+varData);
						return false;
					}
				}
			}
			else
			{
				// �좎껌而댄럩 �붾㈃ �대룞
				var chgParam = {
					encSvcContId : encSvcContId,
					adobeStaticsDiv : adobeStatics,
					isMilleUsingYn : isMilleUsingYn,
					chgProdTypeCd : "RA",
					chgProdId : subscribeApplyArray["ottProdId"],
					dataChargeEnterYn : "",
					prodSaleAmtVat : "", // prodSaleAmtVat: �� 9,500��<br/>(�� 1,000�� �좎씤 ��  8,500�� 泥�뎄)
					vasProdNm : subscribeApplyArray["ottProdNm"],
					ctgryId : ctgryId
				};
			
				var isNextGo = controller.createMobileChgProdIdSession(chgParam);
				if (isNextGo) 
				{
					controller.setAdobe('^m^KT-媛쒖씤^�곹뭹^紐⑤컮��^OTT援щ룆^'+subscribeApplyArray["ottProdNm"]+'^援щ룆�좎껌而⑦럩');
					
					chgParam = controller.getSerializedData(chgParam);
					controller.getUrlToSubmitPost(svcUrl+"?"+chgParam);
				}
				return false;
			}
		}
	},
	choiceOptionChk: function() 
	{
        var chkedLen = $('.opage-reservation-list .oradio:checked').length;
        
        if(chkedLen == 0)
        {
			$('#reserveApplyMultiPopup > .btn-fix > .btnOff').show();
			$('#reserveApplyMultiPopup > .btn-fix > .btnOn').hide();
        }
        else
        {
			$('#reserveApplyMultiPopup > .btn-fix > .btnOff').hide();
			$('#reserveApplyMultiPopup > .btn-fix > .btnOn').show();
		}
    },
	prodListOptionChk: function() 
	{
		var chkedLen = $('#subscSearchPopup .ocheckbox:checked').length;
		$('#subscSearchPopup .btn-fix .view-counting>span').text(chkedLen);
		
        if(chkedLen == 0)
        {
			$('#subscSearchPopup .btn-fix .view-counting').hide();
			$('#subscSearchPopup > .btn-fix > .resetOff').show();
			$('#subscSearchPopup > .btn-fix > .resetOn').hide();
        }
        else
        {
			$('#subscSearchPopup .btn-fix .view-counting').show();
			$('#subscSearchPopup > .btn-fix > .resetOff').hide();
			$('#subscSearchPopup > .btn-fix > .resetOn').show();
		}
    },
    searchPopinit: function() 
    {
		$('#subscSearchPopup .ocheckbox').prop('checked', false);
		
		// 珥덇린��
		$('#subscSearchPopup .btn-fix .view-counting>span').text(0);
		$('#subscSearchPopup .btn-fix .view-counting').hide();
		$('#subscSearchPopup > .btn-fix > .resetOff').show();
		$('#subscSearchPopup > .btn-fix > .resetOn').hide();
		
		setTimeout(function(){
			$('#subscSearchPopup > .btn-fix > .select').focus(); 
		}, 700)
	},
	listAddBtn: function()
	{
		$('#opage-product .opage-subscription>li').show();
		$('#opage-product .btn-more').hide();
		
		setTimeout(function(){
			$('.opage-subscription .ottProductFrame').eq(6).focus();
		}, 700);
	},
	ottCreatePopup: function(flag)
	{
		if(!flag) return;
		openOttPopup('#ottCreate'+flag+'Popup', 'type3', '.btn-view-movie');
	},
	isLoginChk: function(flag)
	{
		var isNextGo = true;
		if($('input[name="isLogin"]').val() == 'false')
		{
			if(flag == 'Y')
			{
				var isLoginChgProdId = subscribeApplyArray["ottProdId"];
				history.pushState(null, null, '/product/s_OttSubscribeView.do?isLoginChgProdId='+isLoginChgProdId);
			}
			alert('濡쒓렇�몄씠 �꾩슂�� �쒕퉬�ㅼ엯�덈떎.');
			parent.mkt.goLogin();
			isNextGo = false;
		}
		return isNextGo;
	},
	setAdobe :function(titleARPU){
		try{
			var layerPopParm = controller.getSerializedData({
					adobeStaticsDiv:titleARPU
				});
			
			callAdobeStatistics("", layerPopParm);
			
		}catch(e){
			return;
		}
	}, 
	findOtherSvc: function() // �뚯꽑�좏깮
	{
		if ($("#selectProdList option").length == 0) {
			$("#mCfmClWrapper").append("<input type=\"hidden\" id=\"selectProdList\" />");
			return;
		}

		var authFlag = $(".findOtherSvc").hasClass("authFlag");

		if ($("#selectProdList option").length == 1) {
			if (!authFlag) {
				return;
			}
		}
		
		var findOtherSvcPopupHtml = "";

		findOtherSvcPopupHtml += 		'<ul class="circuit-list">\n';

		$("#selectProdList option").each(function (i) {
			var serviceGroupTypeNm = $(this).attr("serviceGroupTypeNm");
			var mskSvcNo = $(this).text();
			var isSelected = $(this).is(":selected");

			if ($(this).val() == $("#selectProdList").val()) {
				isSelected = true;
			}

			if (authFlag) { // �묎렐�쒖뼱�쒕뒗 紐⑤몢 洹몃젮�쇳븿
				isSelected = false;
			}

			if (!isSelected) {

				var encSvcContId = $(this).val();
				var targetUrl = $(this).attr("targetUrl");
				
				// eSIM 臾몄옄�� 媛뺤"移섑솚
				if(mskSvcNo.indexOf("(eSIM)") > -1) {
					mskSvcNo = mskSvcNo.replace("(eSIM)", "<em class='esim'>(eSIM)</em>");
				}

				findOtherSvcPopupHtml += '<li>';
				findOtherSvcPopupHtml += '	<button type="button" class="btn-separate popSelSvcNo" data-value="' + encSvcContId + '" data-targetUrl="' + targetUrl + '">';
				findOtherSvcPopupHtml += '		<span class="in-name">' + serviceGroupTypeNm + '</span>' + mskSvcNo;
				findOtherSvcPopupHtml += '	</button>';
				findOtherSvcPopupHtml += '</li>';

			}

		});

		findOtherSvcPopupHtml += 		'</ul>\n';

		$('.opage-circuit').append(findOtherSvcPopupHtml);

		// �뚯꽑 �좏깮
		$(document).on("click", ".popSelSvcNo", function(e) {
			e.preventDefault();
			if (!authFlag) {
				if ($("#selectProdList").val() == $(this).attr("data-value")) {
					return;
				}
			}

			var doUrl  = $(this).attr("data-targetUrl");
			var formOption = {"id" : "selectProductForm", "name" : "selectProductForm", "action" : doUrl , "method" : "post"}
			mComnCntr.createForm(formOption);
			mComnCntr.attachHiddenElement("encSvcContId", $(this).attr("data-value"));
			//shop梨꾨꼸 �뺣낫 異붽� 
			if($("#ch") && $("#ch").val()!=""){
				mComnCntr.attachHiddenElement("ch", $("#ch").val() );
			}
			//shop梨꾨꼸 �뺣낫 異붽� 
			if($("#shopProdId") && $("#shopProdId").val()!=""){
				mComnCntr.attachHiddenElement("shopProdId", $("#shopProdId").val() );
			}
			
			// 紐⑤컮�� �붽툑�쒕�寃� �곸꽭�섏씠吏� chgProdId 異붽�
			if ($("#selChgProdId").attr("chgProdId")) {
				mComnCntr.attachHiddenElement("chgProdId", $("#selChgProdId").attr("chgProdId"));
			}

			$.loadBlock(null, null);
			mComnCntr.formSubmit();
		});

	}, 
	netflixConfirmBtn: function()
	{ 
		var svcUrl = '/product/s_NetflixAddedProdChange.json';
		var varData = {
			encSvcContId: $("#selectProdList").val(),
			chgProdTypeCd: "RC",
			chgProdId: $('#cancelConfirmOttprodid').val()
		};
		
		controller.ajaxSend({
			url: svcUrl,
			data: varData,
			dataType: "json",
			type: "post",
			isBlock: true,
			async: true,
			isOverLap: false,
			blockText : '처리중입니다.',
			successCall: function(jsonObj) {
				var data = jsonObj.moAddedProdResDto;

				if(data.svcResult == '00')
				{
					$('#netflixCancelConfirmPopup .close').click();
					openOttPopup('#netflixCancelCompletePopup', 'type1', netflixReturn);
				}
				else
				{
					$('#netflixCancelConfirmPopup .close').click();
				}
			}
		});
	},
	netflixComplete: function() // �뚯꽑�좏깮
	{
		controller.getOttSubscribeProdListHtml('Y');
		controller.getOttSubscribeLifeHtml('Y');
	},
	phoneLink: function()
	{
		$('#cscenterInfoPopup .close').click();
		
		var centerNumber = "0803901111";
		window.location.href = "tel:"+centerNumber;
	}
});

let CopyDataSet = []; //�섏씠吏� �대� �꾩썙�� �섎뒗 �덉씠�댄뙘�낆씠 �덈뒗 寃쎌슦 諛곗뿴�닿린

$.fn.CopyRender = function() { //�섏씠吏� �대� Copy�� �덉씠�댄뙘�낆쓣 �멸꼍�� 諛섎뱶�� �몄텧�섏뼱�쇳븿.
	$(this).each(function(i) {
		CopyDataSet.push({"html" : $(this).html(), "id" : $(this).attr('id')});
	});
	$(this).remove();
}

$.fn.opageAccordionController = function(options) {
	let config = $.extend({
		item : '> li',
		content : 'div.opage-accrdion-contents',
		selecter : '.button',
		attr : 'aria-expanded',
		type : 'click',
		selectedClass : 'selected',
		selectedIndex : -1,
		moving : false
	}, options);

	return this.each(function() {
		let $self = $(this),
			$item = $self.find(config.item),
			$content = $item.find(config.content),
			$selecter = $item.find(config.selecter),
			$selectedIndex = config.selectedIndex;

		/**
		 * 초기화 함수
		 * - 페이지 또는 컴포넌트의 상태를 초기화하고 필요한 이벤트 리스너를 등록합니다.
		 */
		function init() {
			$item.eq($selectedIndex).addClass(config.selectedClass);
			$item.eq($selectedIndex).find($content).slideDown();

			$selecter
				.each(function(index) {
					if($selectedIndex === index) {
						$(this).attr(config.attr, true);
					} else {
						$(this).attr(config.attr, false);
					}
				})
		}

		if (config.selectedIndex <= -1) {
			$selecter.attr(config.attr, false);
		} else {
			init();
		}

		$selecter
			.bind(config.type, function(e) {
				let $selectedIndex = $selecter.index(this);

				if($item.eq($selectedIndex).find($content).is(':animated')){
					return;
				}

				if($item.eq($selectedIndex).hasClass(config.selectedClass)) {
					close();

					return;
				}

				close();

				open($selectedIndex);

				e.preventDefault();
			})

		/**
		 * 이동 함수
		 * - 지정된 개수만큼 요소를 이동시킵니다.
		 * @param {number} count - 이동할 개수
		 */
		function moving(count) {
			let opageMainHoldItem = 0;
			if($('.opage-holder').length) {
				opageMainHoldItem = $('.opage-holder').outerHeight() - 1
			}

			$('html, body').animate({
				'scrollTop' : $selecter.eq(count).position().top - opageMainHoldItem - $('#mCfmClGnb').outerHeight()
			}, 500);
		}

		/**
		 * 닫기 함수
		 * - 현재 열려있는 요소나 팝업을 닫습니다.
		 */
		function close() {
			$content.slideUp();
			$item.removeClass(config.selectedClass);

			$selecter
				.each(function() {
					$(this).attr(config.attr, false);
				})
		}

		/**
		 * 열기 함수
		 * - 지정된 인덱스의 요소나 팝업을 엽니다.
		 * @param {number} index - 열 요소의 인덱스
		 */
		function open(index) {
			$item.eq(index).find($content).slideDown(function() {
				if(config.moving) {
					moving(index);
				}
			});
			$item.eq(index).addClass(config.selectedClass);
			$selecter.eq(index).attr(config.attr, true);
		}
	})
}

$.fn.jsTabs = function(options) {
	var config = $.extend({
		items: 'li',
		content: 'tab-content',
		selectedItem: 'selected',
		selectedContent: 'tab-content-selected',
		selectedTitle: '좏깮',
		selectedIndex: 0,
		random: false,
		imgRegExp: null,
		normalImage: null,
		selectedImage: null,
		mouseOver: false,
		roll: false,
		interval: 5000,
		effect: null,
		onSelect: null,
		main: true
	}, options);

	return this.each(function() {
		var self = this,
			$self = $(self),
			items = $self.find(config.items),
			imgRegExp = config.imgRegExp,
			eventType = config.mouseOver ? 'click.jsTabs mouseenter.jsTabs' : 'click.jsTabs';

		if ($.data(self, 'init.jsTabs')) {
			destroy();
		}

		function init() {
			$.data(self, 'selectedIndex.jsTabs', config.random ? getRandom(0, items.length - 1) : config.selectedIndex);
			$.data(self, 'items.jsTabs', items);

			items.each(function(index) {
				var item = this,
					$item = $(item),
					anchor = item.getElementsByTagName('a')[0] || item.getElementsByTagName('button')[0],
					contentId = anchor && anchor.getAttribute('href', 2) || anchor && anchor.getAttribute('data-href', 2),
					content = contentId && (contentId !== '#') && $(document).find(contentId).addClass(config.content),
					image = item.getElementsByTagName('img')[0];

				if (!config.random && $item.hasClass(config.selectedItem)) {
					$.data(self, 'selectedIndex.jsTabs', index);
				}

				$.data(item, 'index.jsTabs', index);
				$.data(item, 'image.jsTabs', image);
				$.data(item, 'content.jsTabs', content);

				$item.bind({
					'select.jsTabs': function() {
						select(index);
					},
					'unselect.jsTabs': function() {
						unselect(index);
					}
				});

				$item.bind(eventType, function(e) {
					e.preventDefault();
					$item.trigger('select.jsTabs');
				});

				if (config.roll) {
					$item
						.bind('mouseenter.jsTabs', function() {
							stop();
						})
						.bind('mouseleave.jsTabs', function() {
							roll();
						});
					content
						.bind('mouseenter.jsTabs', function() {
							stop();
						})
						.bind('mouseleave.jsTabs', function() {
							roll();
						});
				}
			});

			select($.data(self, 'selectedIndex.jsTabs'));

			if (config.roll) {
				roll();
			}

			$.data(self, 'init.jsTabs', true);
		}

		/**
		 * 선택 함수
		 * - 지정된 항목의 상태를 선택됨으로 변경합니다.
		 * @param {number} index - 선택할 항목의 인덱스
		 */
		function select(index) {
			unselectAll();

			if (index < 0) {
				return null;
			}

			var selected = items.eq(index),
				image = selected.data('image.jsTabs'),
				content = selected.data('content.jsTabs');

			if (config.selectedImage && image) {
				var src = image.getAttribute('src');
				if (imgRegExp && imgRegExp.exec) {
					var exec = imgRegExp.exec(src),
						match = exec && exec[1];
					if (match && match !== config.selectedImage) {
						image.setAttribute('src', src.replace(config.normalImage, config.selectedImage));
					}
				} else if (src.indexOf(config.normalImage) > -1) {
					image.setAttribute('src', src.replace(config.normalImage, config.selectedImage));
				}
			}

			selected.find("> a").attr('title', config.selectedTitle);
			selected.find("> button").attr('title', config.selectedTitle);
			selected.find("> a").attr('aria-selected', true);
			selected.find("> button").attr('aria-selected', true);
			selected.addClass(config.selectedItem);
			if (content.length) {
				content.addClass(config.selectedContent);
			}

			if (config.onSelect && typeof config.onSelect === 'function') {
				config.onSelect();
			}

			if(config.main) {
				ottTextData();
			}

			$.data(self, 'selectedIndex.jsTabs', index);
		}

		$.data(self, 'select.jsTabs', select);

		/**
		 * 선택 해제 함수
		 * - 지정된 항목의 상태를 선택 해제로 변경합니다.
		 * @param {number} index - 선택 해제할 항목의 인덱스
		 */
		function unselect(index) {
			var item = items.eq(index),
				image = item.data('image.jsTabs'),
				content = item.data('content.jsTabs');

			if (image) {
				var src = image.getAttribute('src');
				if (imgRegExp && imgRegExp.exec) {
					var exec = imgRegExp.exec(src),
						match = exec && exec[1];
					if (match && match === config.selectedImage) {
						image.setAttribute('src', src.replace(match, config.normalImage));
					}
				} else if (src.indexOf(config.normalImage) === -1) {
					image.setAttribute('src', src.replace(config.selectedImage, config.normalImage));
				}
			}

			item.find("> a").removeAttr('title');
			item.find("> a").attr('aria-selected', false);
			item.find("> button").removeAttr('title');
			item.find("> button").attr('aria-selected', false);
			item.removeClass(config.selectedItem);
			if (content) {
				content.removeClass(config.selectedContent);
			}
		}

		/**
		 * 모두 선택 해제 함수
		 * - 모든 선택된 항목을 선택 해제합니다.
		 */
		function unselectAll() {
			items.each(function() {
				$(this).trigger('unselect.jsTabs');
			});
		}

		/**
		 * 롤링 함수
		 * - 요소를 자동으로 순환시킵니다. 주로 슬라이더나 캐러셀에서 사용됩니다.
		 */
		function roll() {
			var timer = window.setInterval(function() {
				var index = $.data(self, 'selectedIndex.jsTabs'),
					next = ++index < items.length ? index : 0;
				select(next);
				$.data(self, 'selectedIndex.jsTabs', next);
			}, config.interval);

			$.data(self, 'timer.jsTabs', timer);
		}

		/**
		 * 정지 함수
		 * - 자동 롤링이나 애니메이션을 중지합니다.
		 */
		function stop() {
			window.clearInterval($.data(self, 'timer.jsTabs'));
			$.data(self, 'timer.jsTabs', null);
		}

		init();

		/**
		 * 소멸 함수
		 * - 컴포넌트나 이벤트 리스너를 정리하고 메모리를 해제합니다.
		 */
		function destroy() {
			items.each(function() {
				var $item = $(this),
					content = $.data(this, 'content.jsTabs');
				$item.removeClass(config.selectedItem);
				content.removeClass(config.selectedContent);
				$.data(this, 'content.jsTabs').unbind('.jsTabs');
				$.removeData(this, 'index.jsTabs');
				$.removeData(this, 'image.jsTabs');
				$.removeData(this, 'content.jsTabs');
				$item.unbind('.jsTabs');
			});
			$self
				.removeData('selectedIndex.jsTabs')
				.removeData('items.jsTabs')
				.removeData('timer.jsTabs');
		}
	});
};

//OTT index Page Tab Bar
$.fn.opageScrollTabsController = function(options) {
	let config = $.extend({
		item : '> li',
		selecter : '> button',
		content : '.opage-holder',
		target : '.opage-section',
		index : 0,
		app : appFlag
	}, options);

	this.each(function() {
		let self = this,
			$self = $(self),
			$item = $self.find(config.item),
			$selecter = $item.find(config.selecter),
			$content = $self.parent(config.content),
			$target = $(config.target),
			$apphigh = 0;

		// OTT�먯꽌�� apphigh瑜� 52 以섏빞��
		//config.app === true ? $apphigh = 0 : $apphigh = 52;
		$apphigh = 52;

		$selecter.unbind('click');

		$selecter
			.bind('click', function(e) {
				let $ButtonIndex = $selecter.index(this);
				let _position = 0;
				
				_position = $target.eq($ButtonIndex).find('.opage-title').position().top;
				if(_position == 0) _position = $target.eq($ButtonIndex).find('.opage-title').parent().position().top;

				$('html, body').animate({
					'scrollTop' : (_position - $self.outerHeight()) + 1
					// 'scrollTop' : ($target.eq($ButtonIndex).position().top - $self.outerHeight()) + 1
				}, 500, function() {
					$target.eq($ButtonIndex).find('.opage-title').focus();
				})

				e.preventDefault();
			})

		/**
		 * 이동 컨트롤러 함수
		 * - 사용자 입력에 따라 요소 이동을 처리하는 로직을 담당합니다.
		 */
		function movingController() {
			if(config.app) {
				if($(this).scrollTop() >= $content.position().top + $('.opage-holder').outerHeight() + 30 - $apphigh) {
					$self.addClass("app-fixed")
				} else {
					$self.removeClass("app-fixed")
				}
				scrollMoving()
			} else {
				if($(this).scrollTop() >= $content.position().top + $('.opage-holder').outerHeight() + 30 - $apphigh) {
					$self.addClass("fixed")
				} else {
					$self.removeClass("fixed")
				}
				scrollMoving();
			}
		}

		/**
		 * 스크롤 이동 함수
		 * - 스크롤 이벤트에 따른 요소 이동을 처리합니다.
		 */
		function scrollMoving() {
			let $isPositionItem = [];

			$target.each(function(i) {
				let $position = $(this).position().top;
				$isPositionItem[i] = $position;
				
				if($(window).scrollTop() <= $isPositionItem[0] - $apphigh) {
					$item.removeClass("selected");
					$item.eq(0).addClass("selected");
					/* DR-2024-35255 OTT援щ룆 異붽� 媛쒕컻_v3.0 */
					$item.find('button').attr('title', '');
					$item.eq(0).find('button').attr('title', '좏깮');
					/* //DR-2024-35255 OTT援щ룆 異붽 媛쒕컻_v3.0 */
					return;
				}
				
				// 留 꾨옒 ㅽ겕濡 대룞 留덉留  좏깮섎룄濡 泥섎━
				if(Math.ceil($(window).scrollTop() + $(window).innerHeight()) >= $(document).innerHeight()) {
					$item.removeClass("selected");
					$item.eq($isPositionItem.length - 1).addClass("selected");
					/* DR-2024-35255 OTT援щ룆 異붽� 媛쒕컻_v3.0 */
					$item.find('button').attr('title', '');
					$item.eq(i).find('button').attr('title', '좏깮');
					/* //DR-2024-35255 OTT援щ룆 異붽 媛쒕컻_v3.0 */
					return;
				}
				
				if($(window).scrollTop() >= $isPositionItem[i] - $apphigh) {
					$item.removeClass("selected");
					$item.eq(i).addClass("selected");
					/* DR-2024-35255 OTT援щ룆 異붽� 媛쒕컻_v3.0 */
					$item.find('button').attr('title', '');
					$item.eq(i-1).find('button').attr('title', '좏깮');
					/* //DR-2024-35255 OTT援щ룆 異붽 媛쒕컻_v3.0 */
					return;
				}

				if($(window).scrollTop() >= $isPositionItem[$isPositionItem.length - 1] - $apphigh) {
					$item.removeClass("selected");
					$item.eq($isPositionItem.length - 1).addClass("selected");
					/* DR-2024-35255 OTT援щ룆 異붽� 媛쒕컻_v3.0 */
					$item.find('button').attr('title', '');
					$item.eq(i).find('button').attr('title', '좏깮');
					/* //DR-2024-35255 OTT援щ룆 異붽 媛쒕컻_v3.0 */
					return;
				}
			})

		}

		movingController();

		$(window).scroll(function() {
			movingController();
		})
	})

	return this;
}

/**
 * OTT 텍스트 데이터 처리 함수
 * - OTT 서비스 관련 텍스트 데이터를 처리합니다.
 */
function ottTextData() {
	const $viewItem = $('.opage-item-list li div.opage-item-box div.inside-group div.btn-group')

	$viewItem.each(function() {
		let $items = $(this).find('button'),
			$itemSize = 0;

		$items.each(function() {
			$itemSize = $itemSize + $(this).outerWidth()
		})

		if($itemSize + 20 >= 155) {
			$itemSize = 155
		} else {
			$itemSize = $itemSize + 20
		}

		$(this).css({
			'min-width' : $itemSize
		})
	})
}

/**
 * 영수증 데이터 처리 함수
 * - 영수증 또는 결제 관련 데이터를 처리합니다.
 */
function receiptData() {
	let $subDataPriceNote = $('.opage-receipt div.in-receipt div.note'),
		$subDataPriceName = $('.opage-receipt div.in-receipt .name'),
		$subDataPriceNoteSize = $('.opage-receipt div.in-receipt div.note .price').outerWidth();

	$subDataPriceNote
		.css({
			'min-width' : $subDataPriceNoteSize + 15
		})

	$subDataPriceName.removeClass('has')
}

/*
* 援щ룆�곹뭹 �곸꽭蹂닿린 �곗씠�곗쟾�� (iframe/cross-domain)
*/
function sendDataToOttProduct(dataObj)
{
	var _htight = $('#ottProductIframePopup').height();
	
	if(document.getElementById("ottProductPage"))
	{
		var ottProductFrame = document.getElementById("ottProductPage").contentWindow;

		var tgtHostname = "product.kt.com";

		var hostname = location.hostname;

		if(hostname.indexOf("m.") > -1){
			tgtHostname = "m." + tgtHostname;
		}

		if(hostname.indexOf("dev.") > -1){
			tgtHostname = "tb." + tgtHostname;
		}

		var tgtDomain = "https://" + tgtHostname;

		ottProductFrame.postMessage(dataObj, tgtDomain);

		// 쒕쾲  몄씠利  몄텧  덈릺  寃쎌슦媛  덉뼱   몄텧濡쒖쭅 異붽
		if(_htight == $('#ottProductIframePopup').height())
		{
			var intetvalCnt = 0;
			var postMessageInterval = setInterval(function(){

				if(_htight != $('#ottProductIframePopup').height() || intetvalCnt > 3) clearInterval(postMessageInterval);

				ottProductFrame.postMessage(dataObj, tgtDomain);
				intetvalCnt++;
			}, 500);
		}
	}
}

/*
* 앹뾽愿 ⑥쁺
*/
function openOttPopup(_this, _type, _focus, param)
{
	$.fn.PageLayerCall({
		name: '.PageLayerCall', //팝업으로 사용되는 클래스
		return: _focus, //접근성으로 돌아갈 버튼 클래스 또는 ID 사용
		moving: '.is-focus', //접근성 레이어팝업 활성화 레이어팝업안에 이동해야할 위치
		opacity: true, //화면 어둡게 처리
		hidden: '#mCfmClWrapper', //접근성 aria-hidden 자동처리되는 위치
		type : _type, //[ type1, type2, type3, type4 ]
		swiper : param,
		dataCall : {//
			url : _this, //['./%%.do'] ajax경우 URL, html방식경우 ID값 = '#inpage'
			type : 'html', //["get", "html"] 추가 필요시 js에서 추가 확장
			pageScript : function(){
				// HTML append로 가져온 방식은 기본적으로 스크립트 동작이 발생하지 않음.
				// 해당 부분에 가져온 HTML 스크립트 사용할 부분있으면 작성
				// pageScript 호출방식 말고 엘리먼트 Ready 후
			}
		}
	});
}

function setCircuit() 
{
	let $itemCircuit = $('.opage-circuit'),
		$circuitButton = $itemCircuit.find('.btn-circuit'),
		$circuitContent = $itemCircuit.find('.circuit-list');

		$circuitButton.attr('aria-expanded', false);

		$circuitButton
			.bind('click', function(e){
				if($circuitContent.css('display') === 'block') {
					$circuitContent.slideUp();
					$(this).removeClass('selected');
					$(this).attr('aria-expanded', false);

					return;
				}
				$(this).addClass('selected');
				$(this).attr('aria-expanded', true)
				$circuitContent.slideDown();
				e.preventDefault();
			})
}
	
function fnSetSubscribeApply(_thisData, _focus)
{
	subscribeApplyArray["ottProdId"]			= _thisData.data('ottprodid');	// 상품id
	subscribeApplyArray["ottProdNmWdic"]		= _thisData.data('ottprodnmwdic');	// 카테고리 추가
	subscribeApplyArray["ottProdCtg"]			= _thisData.data('ottprodctg');	// 카테고리
	subscribeApplyArray["wdicLinkMobileUrl"]	= _thisData.data('wdiclinkmobileurl');
	subscribeApplyArray["ottProdNm"] 			= (_thisData.data('ottprodnm'))?_thisData.data('ottprodnm').toUpperCase():_thisData.data('ottprodnm');	// 상품명
	subscribeApplyArray["ottProdPosibleAge"] 	= _thisData.data('ottprodposibleage');	// 가입가능연령
	subscribeApplyArray["usingYn"] 				= _thisData.data('usingyn');	// 가입한 상품인지 여부
	subscribeApplyArray["saleYn"] 				= _thisData.data('saleyn');	// 현재 가입가능한 상품 여부 <-- 필요없을지도
	subscribeApplyArray["reserveProdYn"] 		= _thisData.data('reserveprodyn');	// 예약 상품인지 여부
	
	if(_thisData.data('ottprodctg') == 'NETFLIX')
	{
		netflixReturn = _focus;
	}
}

// 깊깉 처리(url)
function escapeApp(url) {
	// 좏뒠釉 ㅽ봽쇱씤 덈궡 url (추가 처리 필요)
	if(url == "YTP_OFFLINE_SAVE_CONTENT"){
		url = "https://support.google.com/youtube/answer/6308116?hl=ko#offline&zippy=%2Cdownload-videos-to-watch-offline%2C%EB%8F%99%EC%98%81%EC%83%81%EC%9D%84-%EC%98%A4%ED%94%84%EB%9D%BC%EC%9D%B8-%EC%A0%80%EC%9E%A5%ED%95%98%EC%97%AC-%EC%8B%9C%EC%B2%AD)%EC%97%90%2C%EB%8F%99%EC%98%81%EC%83%81%EC%9D%84-%EC%98%A4%ED%94%84%EB%9D%BC%EC%9D%B8-%EC%A0%80%EC%9E%A5%ED%95%98%EC%97%AC-%EC%8B%9C%EC%B2%AD";
	}

	if(getMyKtAppYn()) {
		var confirmMsg = "해당 기능은 넷플릭스에서 제공하며, \n확인 버튼을 누르시면 \n모바일 넷플릭스로 이동하며, \n데이터요금이 발생할 수 있습니다.";
		if(confirm(confirmMsg)) {
			doKtcsNativeIf({ifName:'executeExternalApp',ifData:JSON.stringify({mimeType:"text/html",url:url})});
		}
	} else {
		window.open(url);
	}
}

function addComma(param)
{
	var returnData = param.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return returnData;
}

// 룻뵆由뒪 곹뭹 援щ룆 쒗븳 대깽
function nflxAcceptCheck() {
	var returnYn = "Y";
	if (subscribeApplyArray["ottProdCtg"] == "NETFLIX" && $("#netflixPiAplyYn").val() != "Y")
	{
		returnYn = "N";
	}
	return returnYn;
}

function clearNextFn()
{
	$('.opage-tabs').opageScrollTabsController({
		app : appFlag //APP, WEB ㅻⅤ誘 더미로 반드시 설정 필요
	});
	$('.opage-status').jsTabs({
		selectedIndex : 0,
		main : true
	});
	$('.opage-guide-list').opageAccordionController({
		selecter : '.open',
		selectedIndex : -1,
		moving : true
	});
	$('.in-opage-guide-service').opageAccordionController({
		selecter : '.btns',
		content : '.in-opage-contents',
		moving : true
	});
	$('.opage-service-caution').opageAccordionController({
		selecter : '.btns',
		content : '.in-contents',
		moving : true
	});
	setCircuit();
	ottTextData();

	/*
	$('.opage-trend-items').each(function() {
	    if($(this).data('subsclifetype') == 'A')
	    {
	        if($('#grpOttProdId_'+$(this).data('ottprodctg')).val()) $(this).find('.ottUsingbtn').data('isreserveyn', 'Y');
	        else $(this).find('.ottUsingbtn').data('isreserveyn', '');
	    }
	});
	*/

	$('.dispProtectedInfoHtmlTag').show();

	/* DR-2024-38906 OTT 援щ룆  꾨떞곷떞쇳꽣 곌껐 湲곕뒫 異붽_v1.13_異붽 섏젙붿껌ы빆 */
	$('.footer-float-icon-item .btn-opage-cscenter').show();

	setTimeout(function() {
		$('.mypage-cscenter-talk').hide();
		setInterval(function() {
			if($('.mypage-cscenter-talk').css('display') === 'block') {
				$('.mypage-cscenter-talk').hide();
			} else {
				$('.mypage-cscenter-talk').show();
			}
		}, 5000);
	}, 5000);
	/* DR-2024-38906 OTT 援щ룆  꾨떞곷떞쇳꽣 곌껐 湲곕뒫 異붽_v1.13_異붽 섏젙붿껌ы빆 */

	if($("#chgEncSvcContIdYn").val() == 'Y')
	{
		setTimeout(function(){
			$('.opage-circuit .btn-circuit').focus();
		}, 500);
	}

	/* DR-2024-47375  留덉씠�섏씠吏�-OTT 援щ룆-'�곹뭹蹂닿린' ��쑝濡� 諛붾줈 �대룞�섎뒗 �듭빱媛� �쎌엯�� URL �앹꽦 �붿껌 START */
	if ($('#anchorParam').val() == 'ProdList') {
		$('.opage-tabs li:eq(1) button').trigger('click');
	}
	/* DR-2024-47375  留덉씠�섏씠吏�-OTT 援щ룆-'�곹뭹蹂닿린' ��쑝濡� 諛붾줈 �대룞�섎뒗 �듭빱媛� �쎌엯�� URL �앹꽦 �붿껌 END */
	else if($('#anchorParam').val() == 'PersonalPick') {
		if($('#personalPick').length > 0)
		{
			$('html, body').stop().animate({
				'scrollTop' : ($('#personalPick').parent().position().top - $('.opage-tabs').outerHeight()) + 1
			}, 500);
		}
	}
	
	// �댁떆�쒓렇 �쒕뵫URL濡� �묒냽�섏뿬 hashtag媛� �덉쓣 寃쎌슦
	if($('#hashtagParam').val()) {
		$('.opage-tabs li:eq(1) button').trigger('click');

		// �댁떆�쒓렇 �쒕뵫URL �묒냽 �� talkback �ъ빱�� �댁뒋濡� 紐⑤뱺 濡쒕뵫�� �앸궃 �� �ъ빱�� �ㅼ떆 �섎룄濡� �섏젙
		if($('.btn-hash-white.selected').length > 0)
		{
			// �뱀젒洹쇱꽦 �댁뒋 - iOS voiceOver�먯꽌 �ъ빱�깆씠 �덈릺�� 臾몄젣媛� �덉뼱�� �쒕젅�대� 以섏꽌 �닿껐
			setTimeout(function(){
				$('.btn-hash-white.selected').last().focus();
			}, 700);
		}
		else
		{
			// �뱀젒洹쇱꽦 �댁뒋 - iOS voiceOver�먯꽌 �ъ빱�깆씠 �덈릺�� 臾몄젣媛� �덉뼱�� �쒕젅�대� 以섏꽌 �닿껐
			setTimeout(function(){
				$('#opage-product .opage-title').focus();
			}, 700);
		}
	}
}

$(document).ready(function() {
	$('body').addClass('opage');
	
	// MktAppSwiperModule 적용
	const specialSalesSwiper = new MktAppSwiperModule({
		swiperSelector: '[data-swiper="special-sales-swiper"]',
		options: {
			slidesPerView: 1,
			loop: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
				clickable: true
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			a11y: {
				prevSlideMessage: '이전 슬라이드',
				nextSlideMessage: '다음 슬라이드',
				slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드'
			}
		}
	});

	$('#sharePage').val(window.location.hostname+'/product/s_OttSubscribeShareView.do');

	$('.window-popup').CopyRender();

	controller.init();

	$("#encSvcContId").val($("#selectProdList").val());

	/*
	* 援щ룆�곹뭹 �곸꽭蹂닿린 �곗씠�곗닔�� (iframe/cross-domain)
	*/
	window.addEventListener("message", function(e){
		//console.log('援щ룆�곹뭹 �곸꽭蹂닿린 �곗씠�곗닔�� ==> '+e.data.fnName);
		var fnName = e.data.fnName;
		var resObj = {
			fnCmpltYn : "Y"
		  , fnName : fnName
		}

		switch (fnName) {
			case "setIframeHeight":
				var _setHeight = 0;
				var _defalutMargin = 20;
				if($(window).height() - (_defalutMargin * 2) <= e.data.height)
				{
					_setHeight = $(window).height() - (_defalutMargin * 2);
					$("#ottProductIframePopup").height(_setHeight);	// height媛�
					//$("#ottProductIframePopup").addClass('over');
					$("#ottProductIframePopup").css({ 'top': _defalutMargin });
				}
				else
				{
					_setHeight = e.data.height;
					$("#ottProductIframePopup").height(_setHeight);	// height媛�
					//$("#ottProductIframePopup").removeClass('over');
					$("#ottProductIframePopup").css({ 'top': $position });
				}
				break;
			case "fnSubscribeApply":

				var varData = controller.getSerializedData({
					encSvcContId: $("#selectProdList").val(),
					isMilleUsingYn : $("#isMilleUsingYn").val(),
					isEbookUsingYn : $("#isEbookUsingYn").val(),
					ottProdId: e.data.ottProdId
				});
				controller.ajaxSend({
					url : "/product/s_OttSubscribeAddedProdInfo.json"
					, data : varData
					, dataType : 'json'
					, type : 'post'
					, async : false
					, isOverLap : false
					, successCall : function(jsonObj) {
						//console.log(jsonObj);
						var data = jsonObj.prdInfo;
						//console.log(data)

						if(data)
						{
							subscribeApplyArray["ottProdId"]			= data.ottProdId;	// �곹뭹id
							subscribeApplyArray["ottProdCtg"]			= data.ottProdCtg;	// ���� 移댄뀒怨좊━
							subscribeApplyArray["wdicLinkMobileUrl"]	= data.wdicLinkMobileUrl;
							subscribeApplyArray["ottProdNm"] 			= data.ottProdNm;	// �곹뭹紐�
							subscribeApplyArray["ottProdPosibleAge"] 	= data.ottProdPosibleAge;	// 媛��낃��μ뿰��
							subscribeApplyArray["usingYn"] 				= data.usingYn;	// 媛��낇븳 �곹뭹�몄� �щ�
							subscribeApplyArray["saleYn"] 				= data.saleYn;	// �꾩옱 媛��낃��ν븳 �곹뭹 �щ� <-- �꾩슂�놁쓣吏���
							subscribeApplyArray["reserveProdYn"] 		= data.reserveProdYn;	// �덉빟 �곹뭹�몄� �щ�

							$('#ottProductIframePopup .close').trigger('click');

							openOttPopup('#subscribeApplyInfoPopup', 'type2', $('.opage-subscription [data-ottProdId="'+data.ottProdId+'"] .ottProductFrame'));
						}
					}
				});
				break;

			default:
				break;
		}
	});
});

$(window).on('load', function(){
	var ajaxInterval = setInterval(function(){
		//console.log('bigBannerAjax ==> '+bigBannerAjax+' prodListAjax ==> '+prodListAjax+' lifeAjax ==> '+lifeAjax+' guideAjax ==> '+guideAjax);
		/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M怨⑤씪蹂닿린_v1.3 START */
		if (bigBannerAjax && prodListAjax && lifeAjax && guideAjax && prodReserveAjax)
		{
		/* DR-2024-誘몃벑濡�_OTT 援щ룆 異붽� 媛쒕컻_2李�-M怨⑤씪蹂닿린_v1.3 END */
			clearInterval(ajaxInterval);
			
			// �대�吏�媛� 濡쒕뵫�� �꾨즺�섏��딆� �곹깭�먯꽌 focus 泥섎━臾몄젣濡� �명빐 濡쒕뵫�꾨즺�� �� 泥섎━
			var images = $('img');
			var loadedImages = 0;
			images.each(function() {
				$(this).on('load error', function(){
					if(loadedImages > images.length) return false;
					
					loadedImages++;
					
					// 紐⑤뱺�대�吏� 濡쒕뱶�섎㈃ 泥섎━ fn
					if(loadedImages == images.length) clearNextFn();
				})

				// 캐시된 이미지 load이벤트 안걸림
				if(this.complete)
				{
					loadedImages++;
					
					// 모든이미지 로드되면 처리 fn
					if(loadedImages == images.length) clearNextFn();
				}
			});
		} 
	}, 100);
});

$(window).resize(function() {
	ottTextData();
});

