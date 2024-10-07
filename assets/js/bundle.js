/* **************** *
  || version : 2차 || 
 * **************** */
var $document = $(document);

// 디바이스 확인 //
function checkMobile() {
  var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

  if(varUA.indexOf('android') > -1) {
      //안드로이드
      return "android";
  } else if( varUA.indexOf("iphone") > -1||varUA.indexOf("ipad") > -1||varUA.indexOf("ipod") > -1 ) {
      //IOS
      return "ios";
  } else {
      //아이폰, 안드로이드 외
      return "other";
  } 
}

var tabbable = "button:not([disabled]), input:not([type='hidden']):not([disabled]):not([readonly]), select:not([disabled]), iframe:not([disabled]), textarea:not([disabled]):not([readonly]), [href]:not([disabled]), [tabindex]:not([tabindex='-1']):not([disabled])";
// [VOS2차] 결함 ID 1122410, 1122191, 1122624, 1122468, 1122150 수정 - 시작 //
var focusArray = tabbable.split(','); // focus 가능 요소들에 대한 정의를 배열로 변환 한다. //
var contentArea, footerContainer, headerContainer, pageTitleContainer, headerTrigger, fixedContainer, footerTrigger;
// [VOS2차] 결함 ID 1122410, 1122191, 1122624, 1122468, 1122150 수정 - 끝 //

$(document).ready(function () {
  //======================= 유튜브 영상 비율 =======================//
  $('.skip').before('<div class="blankFocus" tabindex="0"></div>');
  $(window).on('load', function() {
    setTimeout(function() {
      if($('.videoBox').find('.youtube').length > 0) {
        $('.videoBox').find('.youtube').each(function() {
          var $player = $(this);
          var thisWidth = $player.outerWidth();
          var command = 'pauseVideo'; // play = playVideo, pause = pauseVideo, stop = stopVideo
          
          $player[0].contentWindow.postMessage('{"event":"command","func":"' + command + '","args":""}', '*');

          if($player.closest('.mainVisual').length > 0) {
            var thisHeight = thisWidth * 0.44;
          }
          else {
            var thisHeight = (thisWidth * 9) / 16;
          }
          $player.css({ 'height' : thisHeight });
        });
      }
      // [VOS2차] 결함 ID : 1122038, 1122662, 1122775, 1122892, 1123154 수정 : 페이지 로드 시 첫 번째 요소 포커스 - 시작 //
      catchTheFocus();
      // [VOS2차] 결함 ID : 1122038, 1122662, 1122775, 1122892, 1123154 수정 : 페이지 로드 시 첫 번째 요소 포커스 - 끝 //
    }, 100);

    // [VOS2차] 결함 ID 1122410, 1122191, 1122624, 1122468, 1122150 수정 - 시작 //
    // [VOS2차] 결함 ID 1122468 재등록 사항 수정 - 시작 //
    setTimeout(function() {
      contentContainer = document.querySelector('.contentContainer');
      footerContainer = document.querySelector('.footerContainer');
      headerContainer = document.querySelector('.headerContainer');
      pageTitleContainer = document.querySelector('.pageTitleContainer'); // 브레드크럼을 선택한다. //
      fixedContainer = document.querySelector('.fixedFooterContainer');
      if(pageTitleContainer) {
        headerTrigger = headerContainer.offsetHeight + pageTitleContainer.offsetHeight;
      }
      if(fixedContainer) {
        footerTrigger = fixedContainer.getBoundingClientRect().top;
      }

      if(contentContainer && footerContainer)  {
        var contentFocusable = contentContainer.querySelectorAll(tabbable);
        var footerFocusable = footerContainer.querySelectorAll(tabbable);
        
        for(contentElement of contentFocusable) {
          // focus 이벤트 리스너 //

          $(contentElement).on('focus', function(e) {
          // contentElement.addEventListener('focus', function(e) {
            var target = e.target;
            var top = target.getBoundingClientRect().top;
            var thisCoord = getCoords(target);
            var thisHeight = target.offsetHeight;
            var windowWidth = screen.width;
            var windowHeight = screen.height;
            var destination = (windowHeight / 2) - 150;
            
            if((windowWidth > 1024 && top < headerTrigger) || (windowWidth <= 1024 && top < 44)) {
              // window.scroll(0, thisCoord.top - destination);
            }
          });
        }
  
        for(footerElement of footerFocusable) {
          footerElement.addEventListener('focus', function(e) {
            var target = e.target;
            var thisCoord = getCoords(target);
            var thisHeight = target.offsetHeight;
            var windowHeight = screen.height;

            if(fixedContainer && top + thisHeight > footerTrigger) {
              // window.scroll(0, thisCoord.top - ((windowHeight - thisHeight) / 2));
            }
          });
        }
      }
    }, 100);
    // [VOS2차] 결함 ID 1122468 재등록 사항 수정 - 끝 //
    // [VOS2차] 결함 ID 1122410, 1122191, 1122624, 1122468, 1122150 수정 - 끝 //
  }).on('resize', function() {
    if($('.videoBox').find('.youtube').length > 0) {
      $('.videoBox').find('.youtube').each(function() {
        var $this = $(this);
        var thisWidth = $this.outerWidth();

        if($this.closest('.mainVisual').length > 0) {
          var thisHeight = thisWidth * 0.44;
        }
        else {
          var thisHeight = (thisWidth * 9) / 16;
        }
        $this.css({ 'height' : thisHeight });
      });
    }
  }).resize();

  //======================= 웹접근성 =======================//

  // 모든 팝업에 tabindex=0 추가, 비동기식으로 변경//
  $(document).find('.popupContainer').attr('tabindex', '0');

  tabControl('.tabButton');
  accordionControl(
    '.accordionBtn',
    '.accordionContent',
    '.accordionArea',
    '정보 열기',
    '정보 닫기',
    '.summaryContent',
    '.summaryArea'
  ); //요금제/부가서비스 > 일반 요금제아코디언
  accordionControl(
    '.basicBtn',
    '.basicInfoContent',
    '.feeBasic',
    '요금제 기본 정보 열기',
    '요금제 기본 정보 닫기',
    '.productPlanDetailList',
    '.detailArea'
  ); //요금제 상세
  accordionControl(
    '.msgBtn',
    '.feeMsgContent',
    '.feeMessage',
    '요금제 제공 안내 정보 열기',
    '요금제 제공 안내 정보 닫기',
    '.productPlanDetailList',
    '.detailArea'
  ); //요금제 제공 안내 상세
  accordionControl(
    '.limitBtn',
    '.feeLimitContent',
    '.feeLimit',
    '음성통화 및 메세지 서비스 사용제한 조건 정보 열기',
    '음성통화 및 메세지 서비스 사용제한 조건 정보 닫기',
    '.productPlanDetailList',
    '.detailArea'
  ); //요금제 상세
  accordionControl(
    '.shareBtn',
    '.shareContent',
    '.shareContainer',
    '공유하기 열기',
    '공유하기 닫기'
  ); //이벤트 상세 공유하기 버튼
  accordionControl(
    '.supportBtn',
    '.supportContent',
    '.supportArea',
    '답변 열기',
    '답변 닫기'
  ); //고객지원 공지사항,FAQ
  accordionControl(
    '.extraBtn',
    '.extraContent',
    '.extraArea',
    '정보 열기',
    '정보 닫기'
  ); //상품 부가서비스
  accordionControl(
    '.optionToggleBtn',
    '.optionGroup',
    '.optionArea',
    '옵션 열기',
    '옵션 닫기'
  ); //상품 필터
  videoAccordion('.videosubBtn', '.videosubContent', '.videosubArea'); //마이알뜰폰 소개, 서비스>소개, 서비스>알뜰폰 사업, 고객지원>이용가이드

  dropdownControl('.dropdownBtn');
  breadcrumbDrop('.breadcrumbBtn');
  summaryControl(".summaryBtn");

  var $wrap = $document.find(".wrap");
  var $header = $wrap.find(".headerContainer");
  var $footer = $wrap.find(".footerContainer");
  var position = $(window).scrollTop();

  $document.off("mouseenter", ".gnb > li > .depth01");
  $document.off("mouseleave", ".gnbContainer");
  $document.off("focus", ".gnbContainer a");
  $document.off('focusout', ".gnb > li:last-child > .subMenu > li:last-child");
  $document.off('focusout', ".gnbBtmMenuTitle .iconBgSetting");
  $document.off("click", ".gnb > li > .moDepth01");
  $document.off("click", ".subMenu .openDepth03");
  $document.off("click", ".btnMenuOpen");
  $document.off("click", ".btnMenuClose");
  
  // Depth 1 Menu MouseEnter //
  $document.on("mouseenter", ".gnb > li > .depth01", function (e) {
    //$header 대상이 없었다면 다시 가져오기 //
    if($header.length == 0) {
      $header = $document.find(".wrap").find(".headerContainer");
    }

    if(!$header.hasClass("mobile")) {
      $header.addClass("hover");
    }
  });
  // Depth 1 Menu Mouseleave //
  $document.on("mouseleave", ".gnbContainer", function () {
    //$header 대상이 없었다면 다시 가져오기 //
    if($header.length == 0) {
      $header = $document.find(".wrap").find(".headerContainer");
    }

    if(!$header.hasClass("mobile")) {
      $header.removeClass("hover");
      $header.removeClass("focus");
    }
  });

  // [VOS2차] 결함 ID 1122023 수정 : 버튼도 포커스 대상에 포함 //
  $document.on("focus", ".gnbContainer a, .gnbContainer button", function () {
    //$header 대상이 없었다면 다시 가져오기 //
    if($header.length == 0) {
      $header = $document.find(".wrap").find(".headerContainer");
    }
    
    if(!$header.hasClass("mobile")) {
      $header.addClass("focus");
    }
  });

  // GNB Menu 마지막 링크 focusout //
  $document.on('focusout', ".gnbBtmMenu a:last-child", function () {
    //$header 대상이 없었다면 다시 가져오기 //
    if($header.length == 0) {
      $header = $document.find(".wrap").find(".headerContainer");
    }

    $(this).addClass('tag');
    if(!$header.hasClass("mobile")) {
      $header.removeClass("focus");
    }
  });
  
  $document.on('focusout', ".gnbBtmMenuTitle .iconBgSetting", function () {
    //$header 대상이 없었다면 다시 가져오기 //
    if($header.length == 0) {
      $header = $document.find(".wrap").find(".headerContainer");
    }
  });

  $document.on("click", ".gnb > li > .moDepth01", function () {
    if($header.length == 0) {
      $header = $document.find(".wrap").find(".headerContainer");
    }

    if($header.hasClass("mobile")) {
      var $depth = $(this).closest(".gnb > li");

      if ($depth.hasClass("active")) {
        $(this).attr('aria-expanded', 'false');
        $depth.removeClass("active");
      } else {
        $(this).attr('aria-expanded', 'true');
        $depth.addClass("active").siblings().removeClass("active");
      }
      return false;
    }
  });
  
  $document.on("click", ".subMenu .openDepth03", function () {
    var $depth = $(this).parent("li");

    if($depth.hasClass('active') ) {
      $('.gnbBottom.pcType').removeAttr('style');
      $(this).attr('aria-expanded', 'false');
      $depth.removeClass('active');
    } else {
      $('.subMenu .openDepth03').attr('aria-expanded', 'false');
      $('.subMenu > li').removeClass("active");
      $('.gnbBottom.pcType').removeAttr('style');

      $(this).attr('aria-expanded', 'true');
      $depth.addClass('active');
    }

    if( $(this).parents('.subMenu').height() > 460) {//[2차] 20221006 마이알뜰폰 홈 메뉴 추가
      $('.gnbBottom.pcType').css({height: '73rem'}); //[2차] 20221006 마이알뜰폰 홈 메뉴 추가
    }
  });

  // Mobile GNB 이벤트 open
  $document.on("click", ".btnMenuOpen" ,function(){
    var $wrap = $document.find(".wrap"); //20230307 dev 추가
    var $mobileContainer = $('.mobileContainer');
    var menuHeight = $(window).height() - $('.header').height();

    $wrap.addClass("moMenuOpen");
    $document.find("body").css({
      position: "fixed",
      width: "100%",
      height: "100%",
      overflow: "hidden",
    });

    $mobileContainer.css('height', menuHeight);

    setTimeout(function() {
      if($mobileContainer.find('.myInfoSummary ').hasClass('beforeLogin')) {
        $mobileContainer.find(tabbable).first().focus();
      }
      else {
        $mobileContainer.find('.myInfoSummary').find('.subTitleRight').find(tabbable).first().focus();
      }
      
    }, 0);

    if ($wrap.hasClass(".moMenuOpen")) {
      $wrap.removeClass("moMenuOpen");
    };
  });
  // Mobile GNB 이벤트 close
  $document.on("click", ".btnMenuClose" ,function() {
    var $wrap = $document.find(".wrap"); //20230307 dev 추가
    $wrap.removeClass("moMenuOpen");
    $document.find("body").removeAttr('style');
    $('.mobileContainer').removeAttr('style');

    setTimeout(function() {
      $wrap.find('.btnMenuOpen').focus();
    }, 0);
  });
  // [VOS2차] 결함 ID 1122230 추가 - 시작
  $document.on("click", ".btnMenuOpen" ,function() {
    setTimeout(function() {
      $wrap.find('.btnMenuClose').focus();
    }, 0);
  });
  // [VOS2차] 결함 ID 1122230 추가 - 끝

  // [운영] 20230308 부가서비스 개선 : 팝업 닫을 시 탭 초기화 - 시작
  $document.on("click", ".btnClose" ,function() {
    var $popupContainer = $(this).closest('.popupContainer');
    var $popupInnerTabList = $popupContainer.find('.tabList');

    $popupContainer.find('*').scrollTop(0);//스크롤 top으로 올리기 

    $popupInnerTabList.each(function(){
      var $popupInnerButton = $(this).find('.tabButton').eq(0);//첫번째 탭

      if($popupInnerButton.attr('aria-selected') == 'false') {
        var buttonControls = $popupInnerButton.attr('aria-controls');//eq 0 연결 탭내용

        setTimeout(function() {
          $popupInnerButton.siblings().attr('aria-selected', 'false');//eq 0 외 초기화
          $popupInnerButton.attr('aria-selected', 'true');//eq 0 선택 상태 변경
          $('#' + buttonControls).addClass('show').siblings().removeClass('show');//eq 연결 0 탭내용 외 초기화
        }, 400);
      }
    });
  });
  // [운영] 20230308 부가서비스 개선 : 팝업 닫을 시 탭 초기화 - 끝
});

// 전페이지 공통 js
function commonEvent() {}

// 메인 js
function mainEvent() {}
// KMVNO-3999 탑배너 고도화로 구소스 삭제

// info Summary
function summaryControl(button) {
  var $this = $document.find(button);
  $(document).off("click", button);
  $(document).on("click", button, function(){
    var $container = $(this).closest(".infoSummaryBottom");
    var $content = $container.find(".summaryBottom");

    if ($container.hasClass("active")) {
      $container.removeClass("active");
      $(this).attr("aria-expanded", "false");
      $(this).find('span').text('상세 요금 정보 보기');
    } else {
      $container.addClass("active");
      $(this).attr("aria-expanded", "true");
      $(this).find('span').text('상세 요금 정보 닫기');
    }
  });
}
function summaryReset() {
  if ($document.find(".infoSummaryBottom").hasClass("active")) {
    $document.find(".infoSummaryBottom").removeClass("active");
    $document.find(".infoSummaryBottom").find(".summaryBtn").attr("aria-expanded", "false");
    $document.find(".summaryBottom").attr("tabindex", -1);
  }
}
//------------ end of header --------------//

//------------ sub common --------------//
// tab accessibility
function tabControl(button) {
  var $btn = $document.find(button);
  var $contentArea = $document.find(button).parents('.contentArea');
  var selectedText = null;
  
  // 기본 노출 탭내용 초기 값
  var initBtn = $(button + '[aria-selected="true"]').attr('aria-controls');
  $('#'+initBtn).addClass('show');

  $btn.on('click', function(){
    
    var tabCon = $(this).attr('aria-controls');

    // 초기화
    $(this).siblings().attr("aria-selected", "false");
    $document.find("#" + tabCon).siblings().removeClass('show');

    // show
    $(this).attr('aria-selected', 'true');
    $document.find('#' + tabCon).addClass('show');
    // return false;
  
    if( $contentArea.find('.summaryContent').length > 0) {
      
      reloadMasonry('.summaryContent', '.summaryArea');
    }

    // DR-2023-34353 20230711 주석처리
    // (1112631 1차 vos : 탭 선택 시 url이 다르게 출력 되어 각 페이지별 타이틀이 달라야 했던 결함, 20230711 동일 현상 확인 안 됨)
    // if($('.wrap').hasClass('policiesAndTerms')){
    //   selectedText = $(this).text();
    //   document.title = selectedText + ' | KT 마이알뜰폰';
    // }
    // DR-2023-34353
  });

}

// accordion accessibility
function accordionControl(button, content, wrap, openText, closeText, masonryCon, masonryItem) {
  var $btn = $document.find(button);
  var $contentArea = $document.find(button).parents('.contentArea');

  if( $contentArea.find(masonryCon).length > 0) {
    
    reloadMasonry(masonryCon, masonryItem);
  }
  // 상태에 대한 초기 셋팅
  if( $btn.attr("aria-expanded") == 'false' ) {
    $btn.find('span').text(openText);
    
  } else if ( $btn.attr("aria-expanded") == 'true' ) {
    $btn.find('span').text(closeText);
    
  }
  $(document).off("click", button);
  $(document).on("click", button, function(){
    var $content = $(this).parent().siblings(content);
    var $wrap = $(this).closest(wrap);
    if ($wrap.hasClass("active")) {
      $wrap.removeClass("active");
      $(this).attr("aria-expanded", "false");
      if($(this).find('span')) {
        $(this).find('span').text(openText);
      }
      // $content.attr("tabindex", -1);
    } else {
      $wrap.addClass("active");
      $(this).attr("aria-expanded", "true");
      if($(this).find('span')) {
        $(this).find('span').text(closeText);
      }
      // $content.attr("tabindex", 0);
    }

    if( $contentArea.find(masonryCon).length > 0) {
      reloadMasonry(masonryCon, masonryItem);
    }
  })
}

// accordion accessibility
function videoAccordion(button, panel, wrap) {
  var $btn = $document.find(button);

  if (!$btn.attr('aria-expanded') == 0) {
    $btn.find('span').text('자막 펼치기');
  } else {
    $btn.find('span').text('자막 숨기기');
  }
  $(document).on('click', button, function () {
    var $panel = $(this).closest(wrap).find(panel);
    var $wrap = $(this).closest(wrap);
    if ($wrap.hasClass('active')) {
      $wrap.removeClass('active');
      $(this).attr('aria-expanded', 'false');
      $panel.attr("tabindex", -1);
      $(this).find('span').text('자막 펼치기');
    } else {
      $wrap.addClass('active');
      $(this).attr('aria-expanded', 'true');
      $(panel).attr("tabindex", 0);
      $(this).find('span').text('자막 숨기기');
    }
  });
}


function reloadMasonry(masonryCon, masonryItem) {
  $document.find(masonryCon).masonry({
    itemSelector: masonryItem,
    columnWidth: masonryItem,
    percentPosition: true,
  });
}

// breadcrumbDrop
function breadcrumbDrop(button) {
  $document.find(button).on("click", function () {
    var $button = $(this);
    var $container = $button.parents(".breadcrumbDrop");
    var $wrap = $button.parents(".breadcrumb");
    var $list = $wrap.find(".breadcrumbDropList li");
    var listLength = $list.length;

    // click
    if ($container.hasClass("active")) {
      $container.removeClass("active");
      $button.attr("aria-expanded", "false");
    } else {
      breadcrumbDropReset();
      $container.addClass("active");
      $button.attr("aria-expanded", "true");
    }
    
    // out
    $list.eq(listLength - 1).find('a').on('focusout', function(){
      
      breadcrumbDropReset();
    });
    $('.breadcrumbDropList').on("mouseleave", function(){
      
      breadcrumbDropReset();
    });
  });
}

function breadcrumbDropReset(){
  $document.find('.breadcrumbDrop').removeClass("active");
  $document.find('.breadcrumbBtn').attr("aria-expanded", "false");
}
// [VOS2차] 결함 ID 1122584, 1123248 드롭다운 초점 오류 수정, 20230316 - 시작 //
// Dropdown Accessibility //
function dropdownControl(button) {
  var $btn = $document.find(button);
  var thisClassName = button;
  var $wrap = $btn.closest(".dropdownArea");

  // 드롭다운 최상위 Wrapper 가 disabled 클래스를 가지고 있는 경우 기능을 비활성화 합니다. //
  // if ($wrap.hasClass("disabled")) {
  //   return false;
  // }
 
  // 드롭다운 내부에 회선 설정 버튼이 있는 경우 keydown 이벤트를 부여합니다. //
  $wrap.find('.dropSetting').off("keydown", dropSettingControl);
  if($wrap.find('.dropSetting').length > 0) {
    $wrap.find('.dropSetting').on('keydown', dropSettingControl);
 
    function dropSettingControl(e) {
      var $this = $(this);
      var $wrap = $this.parents(".dropdownArea"); // Dropdown 최상위 Wrapper
      var $option = $wrap.find(".dropdownList"); // Dropdown Option List
      if (!e.shiftKey && e.keyCode == "9") {
       
        $wrap.removeClass("active");
        $option.slideUp(100);
        $this.attr("aria-expanded", "false");//20230316
      }
    }
  }
 
  /*
  Dropdown 내의 button prameter 로 지정된 버튼 click 이벤트 입니다.
  클릭 시 옵션 리스트가 오픈됩니다.
  */
  $(document).off("click", button, dropdownAreaClick);
  $(document).off("keydown", button, dropdownAreaKeydown);
  $(document).on("click", button, dropdownAreaClick).on("keydown", button, dropdownAreaKeydown);
 
  function dropdownAreaClick(e) {
    var $wrap = $(this).parents(".dropdownArea"); // Dropdown 최상위 Wrapper
    var $content = $wrap.find(".dropdownList"); // Dropdown Option List
 
    // Dropdown이 활성화 상태인 경우 비활성화 시킵니다. //
    if ($wrap.hasClass("active")) {
      // 옵션에 부여된 이벤트를 off 시킵니다. //
      dropdownOptionControl($content, false);
      $content.slideUp(100, function() {
        $wrap.removeClass("active");
        $(this).attr("aria-expanded", "false");
        $content.attr('tabindex', -1);
      });
    }
    // Dropdown이 비활성화 상태인 경우 활성화 시킵니다. //
    else {
      // 모든 드롭다운을 접는다 //
      $(document).find('.dropdownArea').find('.dropdownList').slideUp(100, function() {
        $(document).find('.dropdownArea').removeClass('active');
        $(document).find('.dropdownArea').find('.dropdownBtn').attr("aria-expanded", "false");
      });
 
      // 선택한 드롭다운 활성화 //
      $(this).attr("aria-expanded", "true");
      $content.removeAttr('tabindex');
      $content.slideDown(100, function() {
        $wrap.addClass("active");
      });
      // $content.find("li").find('button[aria-selected="true"]').focus();
 
      // 옵션에 부여된 이벤트를 on 시킵니다. //
      dropdownOptionControl($content, true);
    }
    
    // 이벤트 전파를 막습니다. //
    e.preventDefault();
    // e.stopImmediatePropagation();
  }

  function dropdownAreaKeydown(e) {
    var $wrap = $(this).parents(".dropdownArea"); // Dropdown 최상위 Wrapper
    var $content = $wrap.find(".dropdownList"); // Dropdown Option List
 
    // KeyDown - ESC //
    if (e.code == 'Escape' || e.code == 'Esc' || e.keyCode == 27) {
      e.preventDefault();
      e.stopImmediatePropagation();
 
      $wrap.removeClass("active");
 
      // 옵션에 부여된 이벤트를 off 시킵니다. //
      dropdownOptionControl($content, false);
      $content.slideUp(100);
      $(this).attr("aria-expanded", "false");
    }
    // KeyDown - Space bar or Enter //

    else if (e.code =='Enter' || e.keyCode == "13" || e.code == 'Space' || e.keyCode == "32") {
     
    }
    else if(e.code == 'ArrowDown' || e.keyCode == '40') {
      $content.find('li').eq(0).find('button').focus();
 
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    else if(e.code == 'Tab' || e.keyCode == '9') {
      if(!e.shiftKey) {
       
        if($wrap.hasClass('active')) {
          $content.find('li').eq(0).find('button').focus();
 
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
      else {
        $wrap.removeClass("active");
        $content.slideUp(100);
        $(this).attr("aria-expanded", "false");
      }
    }
  }
 
  $(document).off("click", "html", dropdownHtmlControl);
  $(document).on("click", "html", dropdownHtmlControl);
  function dropdownHtmlControl(e) {
    let target = e.target;
    let parent = target.closest(thisClassName);
  
    if(!parent || parent.length > 0) {
      dropdownOptionControl($wrap.find(".dropdownList"), false);
      $wrap.find(".dropdownList").slideUp(100, function() {
        $wrap.removeClass("active");
      });
    }
  }
}
  
// Dropdown option에 이벤트를 부여하는 함수 입니다. //
function dropdownOptionControl(option, state) {
  var $option = option;
  
  if (!state) {
    $option.find('li').find('button').off("click", dropdownOptionClick);
    $option.find('li').find('button').off("keydown", dropdownOptionKeydown);
  
    return false;
  }
  
  // Option의 각 버튼에 이벤트를 부여합니다. //
  $option.find("li").find("button").on("click", dropdownOptionClick).on("keydown", dropdownOptionKeydown);
  
  function dropdownOptionClick(e) {
    var $this = $(this);
    var $wrap = $this.parents(".dropdownArea"); // Dropdown 최상위 Wrapper
    var $option = $wrap.find(".dropdownList"); // Dropdown Option List
    var $btn = $wrap.find('.dropdownBtn');
    var text = $this.text();
 
    if($option.find('.phoneLine').length >= 1) {
      var img = $this.find('.imgWrap').find('img').attr('src');
      var product = $this.find('.labelGroup').find('.product').text();
      var phone = $this.find('.labelGroup').find('.phone').text();
      var colorLabel = $this.find('.colorLabel');
 
      $wrap.find(".titleLabel").find('.imgWrap').find('img').attr('src', img);
      $wrap.find(".titleLabel").find('.product').text(product);
      $wrap.find(".titleLabel").find('.phone').text(phone);
 
      // 대표 번호 라벨 리셋
      $wrap.find(".titleLabel").find('.colorLabel').remove();
      // 대표번호 라벨 있는 옵션 선택 시 추가
      if ( colorLabel.length > 0 ) {
        $('<span class="colorLabel">대표번호</span>').prependTo($wrap.find(".titleLabel"));
      }
    }
    else {
      // 선택한 옵션 값을 드롭다운에 출력합니다.
      $wrap.find('.titleLabel').find('span').text(text);
    }
  
    $option.find("li").find('button[title="선택됨"]').removeAttr("title");
    $this.attr("title", '선택됨');
    
    // 현재 초점 요소를 초점 선택 해제함 //
    document.activeElement.blur();
  
    $option.slideUp(100, function() {
      $btn.attr('aria-expanded', false);
      $wrap.removeClass("active");
      // 드롭다운 요소로 초점 이동 //
      $btn.focus();
    });
  }

  function dropdownOptionKeydown(e) {
    var $this = $(this); // 현재 클릭한 옵션 버튼
    var $list = $this.closest("li"); // 버튼을 감싸고 있는 li 태그
    var $wrap = $this.parents(".dropdownArea"); // Dropdown 최상위 Wrapper
    var $option = $wrap.find(".dropdownList"); // Dropdown Option List
    var index = $option.find("li").index($list); // 선택한 옵션의 index
    var listLength = $option.find("li").length; // 옵션 리스트의 length
    var text = $this.text();
  
    // KeyDown - ESC //
    if (e.keyCode == "27") {
      $option.slideUp(100, function() {
        $wrap.find(".dropdownBtn").focus();
        $wrap.removeClass("active");
      });
  
      e.stopImmediatePropagation();
    }
    // KeyDown - Space bar or Enter //
    else if (e.code =='Enter' || e.keyCode == "13" || e.code == 'Space' || e.keyCode == "32") {
    }
    // KeyDown - Home //
    else if (e.code =='Home' || e.keyCode == "36") {
      $option.find("li").first().find("button").focus();
  
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    // KeyDown - End //
    else if (e.code =='End' || e.keyCode == "35") {
      $option.find("li").last().find("button").focus();
      
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    // KeyDown - Up //
    else if ((e.shiftKey && e.keyCode == "9") || e.keyCode == "38") {


      if (index > 0) {
        $option.find("li").eq(index - 1).find("button").focus();
      }
      else {
        if((e.shiftKey && e.keyCode == "9") || e.keyCode == '38') {
          $wrap.find('.dropdownBtn').focus();
        }
      }
  
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    // KeyDown - Down //
    else if (e.keyCode == "9" || e.keyCode == "40") {
      if (index < listLength - 1) {
        $option.find("li").eq(index + 1).find("button").focus();
        // ind;
      }
      else {
        if(e.keyCode == "9") {
          $wrap.find('.dropSetting').focus();
        }
      }
  
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }
}
// [VOS2차] 결함 ID 1122584, 1123248 드롭다운 초점 오류 수정, 20230316 - 끝 //

// [VOS2차] 결함 ID 1122024, 1122026 수정 - 시작 //
function togglePopup(toggler, id) {

  /* NW_UI/UX 기존 팝업에서 호출시 신규 filter script 실행
  *  FilterTabModule 함수가 없거나 호출하지 못할 경우 실행 시키지 않게 조건 처리
  * */
  if(typeof mvno !== 'undefined' && typeof mvno.FilterExtend !== 'undefined' && typeof mvno.FilterExtend.init === 'function') {
    const filterTabInstance = mvno.FilterExtend.init('.mvno-popup-filter-wrap');
    filterTabInstance.initEvents();
  }
  
  var $this = $document.find("#" + toggler);
  var $popup = $document.find("#" + id);
  var $tabbable = $popup.find(
    "button:not([disabled]), input:not([type='hidden']):not([disabled]), select:not([disabled]), iframe:not([disabled]), textarea:not([disabled]), [href]:not([disabled]), [tabindex]:not([tabindex='-1']):not([disabled])"
  );

  // var firstTab = $tabbable.first();
  var popup = document.querySelector(`#${id}`);
  var firstTab = popup.querySelector("button:not([disabled]), input:not([type='hidden']):not([disabled]), select:not([disabled]), iframe:not([disabled]), textarea:not([disabled]), [href]:not([disabled]), [tabindex]:not([tabindex='-1']):not([disabled])");
  var lastTab = $tabbable.last();

  // ESC 키를 입력한 경우 해당 팝업을 닫습니다. //
  $(window).off("keydown");
  $(window).on("keydown", function (e) {
    if (e.keyCode == 27) {
      // $this.focus();
      // $popup.removeClass('show');
      // $(window).off('keydown');
      // $('html').off('click');

      closePopup();
    }
  });

  // 팝업이 열려 있는 경우 닫습니다. //
  if ($popup.hasClass("show")) {
    // $this.attr('aria-expanded', false); [VOS2차] 결함 ID 1122072 삭제
    $('body').css('overflow', 'auto');
    // [VOS2차] 결함 ID 1122420 수정 - 시작 //
    if($popup.hasClass('periodContainer')) {
      $this.attr('aria-expanded', false);
      $('body').css('overflow', 'auto');
    }
    // [VOS2차] 결함 ID 1122420 수정 - 끝 //
    closePopup();
    $this.focus();
  }
  // 팝업이 닫혀 있는 경우 엽니다. //
  else {
    // $this.attr('aria-expanded', true); [VOS2차] 결함 ID 1122072 삭제
    $popup.addClass("show");
    $('body').css('overflow', 'hidden');
    // [VOS2차] 결함 ID 1122420 수정 - 시작 //
    if($popup.hasClass('periodContainer')) {
      $this.attr('aria-expanded', true);
      $('body').css('overflow', 'auto');
    }
    // [VOS2차] 결함 ID 1122420 수정 - 끝 //
    // 팝업 내에 탭으로 이동할 수 있는 요소가 있는지 확인 합니다. //
    if ($tabbable.length > 0) {
      // 탭으로 이동할 요소가 있다면 첫 번째 요소를 포커스 적용 합니다. //
      
      setTimeout(function() {
        firstTab.focus();
      }, 50);

      // 포커스 된 첫 번째 요소에 요소에 어떤 키가 입력되는지 확인 합니다. //
      $(firstTab).off("keydown");
      $(firstTab).on("keydown", function (e) {
        // Shift + Tab을 입력하여 탭을 반대로 이동할 경우 //
        if ($(this).is(':focus') && e.shiftKey && (e.keyCode || e.which) === 9) {
          // 이벤트 전파를 막고 마지막 요소로 포커스를 이동합니다. //
          e.preventDefault();
          lastTab.focus();
        }
      });

      // 포커스 된 마지막 요소에 요소에 어떤 키가 입력되는지 확인 합니다. //
      lastTab.off("keydown");
      lastTab.on("keydown", function (e) {
        var $this = $(this);
        // Tab을 입력하여 탭을 이동할 경우 //
        if (!e.shiftKey && (e.keyCode || e.which) === 9) {
          // 이벤트 전파를 막고 첫 번째 요소로 포커스를 이동합니다. //
          e.preventDefault();
          $(firstTab).focus();
        }
      });
    }
  }

  // 지역 함수 - 현재 오픈한 팝업 닫기 //
  function closePopup() {
    $this.focus();
    $(window).off("keydown");
    $document.find("html").off("click");
    setTimeout(function () {
      $popup.removeClass("show");
    }, 100);
  }

  return false;
}
// [VOS2차] 결함 ID 1122024, 1122026 수정 - 끝 //

// button 클릭 시 활성화 클래스 추가 - 다중 선택
function btnActive(button, activeClass) {
  var $button = $document.find(button);
  $(document).on('click', button, function(){
    if( $(this).hasClass(activeClass) ) {
      $(this).removeClass(activeClass);
      $button.removeAttr('title');
    } else {
      $(this).attr('title', '선택 됨');
      $(this).addClass(activeClass);
    }
  })
}
// button 클릭 시 활성화 클래스 추가 - 단일 선택
function btnSingleActive(button, activeClass) {
  var $button = $document.find(button);
  $(document).on('click', button, function(){
    $button.removeClass(activeClass);
    $button.removeAttr('title');
    $(this).addClass(activeClass);
    $(this).attr('title', '선택 됨');
  })
}

//------------ end of sub common --------------//
// 하단 영역 고정 모바일용
function bottomFiexdControl(button, container, area, falseText, trueText) {// [VOS2차] 결함ID 1123028 수정
  $(document).on("click", button, function () {
    var $content = $(this).siblings(area);
    var $wrap = $(this).parents(container);
    if ($wrap.hasClass("active")) {
      $wrap.removeClass("active");
      $(this).attr("aria-expanded", "false");
      $content.attr("tabindex", -1);
      $(button).find('span').text(falseText);// [VOS2차] 결함ID 1123028 수정
    } else {
      $wrap.addClass("active");
      $(this).attr("aria-expanded", "true");
      $content.attr("tabindex", 0);
      $(button).find('span').text(trueText);// [VOS2차] 결함ID 1123028 수정
    }
  });
}

function enabledShowingFocus(swiper) {
  if(Array.isArray(swiper)) {
    for(var i = 0; i < swiper.length; i++) {
      setFocusElement(swiper[i]);
    }
  }
  else {
    setFocusElement(swiper);
  }

  function setFocusElement(swiper) {
    var activeIndex = swiper.activeIndex;
    var snapIndex = swiper.snapIndex;
    var slidesPerView = Math.floor(swiper.params.slidesPerView);
    var $swiper = $(swiper.el);

    // [VOS2차] 결함 ID 1122394 수정 : bullet 형식 pagination 활성화 버튼에 title="선택됨" 속성 추가 - 시작 //
    var swiperParams = swiper.params;
    var pagination = swiper.pagination;
    
    // 페이지네이션 존재함 //
    if(pagination && pagination.el) {
      // Pagination이 bullet 형식인지 확인함 //
      if(swiperParams.pagination.type == 'bullets') {
        // 모든 bullet의 title 속성 삭제 //
        for(var i = 0; i < pagination.bullets.length; i++) {
          pagination.bullets[i].removeAttribute('title');
        }
        // 활성화 bullet에 title="선택됨" 속성 추가 //
        $('.swiper-pagination-bullet-active').attr('title', '선택됨');
      }
    }

    if(swiper.slides && swiper.slides.length > 0) {
      for(var i = 0; i < swiper.slides.length; i++) {
        var $slide = $(swiper.slides[i]);

        if(i >= snapIndex && i < snapIndex + slidesPerView) {
          $slide.find(tabbable).removeAttr('tabindex');
          $slide.find('*').attr('aria-hidden', false);
        }
        else {
          $slide.find(tabbable).attr('tabindex', -1);
          $slide.find('*').attr('aria-hidden', true);
        }
      }
    }
  }
}

function focusSlide(swiper) {

}

function focusLink(closeButtonID, btnID) {
  $(document).on('click', closeButtonID, function(){
    $(btnID).focus().addClass('focusA');
  });
  $(document).on('focusout', btnID, function(){
    $(btnID).removeClass('focusA');
  });
}

// 간편/일반 로그인
function loginTabControl(button) {
  var $btn = $document.find(button);
  
  // 기본 노출 탭내용 초기 값
  var initBtn = $(button + '[aria-selected="true"]').attr('aria-controls');
  $('#'+initBtn).addClass('show');

  $(document).on('click', button, function(){

    var tabCon = $(this).attr('aria-controls');

    // 초기화
    $(this).siblings().attr("aria-selected", "false");
    $document.find("#" + tabCon).siblings().removeClass('show');

    // show
    $(this).attr('aria-selected', 'true');
    $document.find('#' + tabCon).addClass('show');
  });
}

// [VOS2차] 결함 ID : 1122038, 1122662, 1122775, 1122892, 1123154 수정 : 페이지 로드 시 첫 번째 요소 포커스 - 시작 //
function catchTheFocus() {
  var os = checkMobile();
  var blankFocus = document.querySelector('.blankFocus');
  var skip = document.querySelector('.skip a');
  var body = document.querySelector('body');
  var activeElement = document.activeElement;

  // Mobile //
  if(os == 'ios' || os == 'android') {
    blankFocus.focus(function(e) {
      e.target.remove();
    });
    activeElement = document.activeElement;
  }
  // PC //
  else {
    if(blankFocus) {
      blankFocus.addEventListener('blur', (e) => {
        var target = e.target;
        target.remove();
      });
      blankFocus.focus();
      activeElement = document.activeElement;
      

      if(activeElement != body) {
        blankFocus.focus();
      }
    }
  }
}

function getCoords(element) {
  let box = element.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset
  };
}
// [VOS2차] 결함 ID : 1122038, 1122662, 1122775, 1122892, 1123154 수정 : 페이지 로드 시 첫 번째 요소 포커스 - 끝 //
/*
Datepicker는 bootstrap-datepicker를 사용하여 구현했습니다.
Option과 Method, Event는 아래 링크에서 확인할 수 있습니다.
(https://bootstrap-datepicker.readthedocs.io/en/latest/index.html)
*/
var $document = $(document);

$(document).ready(function() {

  // if($('#datepicker-start-data').length > 0 && $('#datepicker-end-data').length > 0) {
  //   getMultiDatePicker('start', '#datepicker-start-data', '#datepicker-end-data', 'yyyy-mm-dd');
  //   getMultiDatePicker('end', '#datepicker-start-data', '#datepicker-end-data', 'yyyy-mm-dd');
  // }

  if($document.find('#datepicker-start-period-data').length > 0 && $('#datepicker-end-period-data').length > 0) {
    getMultiDatePicker('start', '#datepicker-start-period-data', '#datepicker-end-period-data', 'yyyy-mm-dd');
    getMultiDatePicker('end', '#datepicker-start-period-data', '#datepicker-end-period-data', 'yyyy-mm-dd');
  }

  // =============== Month를 선택하는 Datepicker without button =============== //

  if($document.find('#datepicker-start-data').length > 0) {
    getDatepicker('#datepicker-start-data', 'calendar');
  }

  // =============== Month를 선택하는 Datepicker =============== //

  if($document.find('#datepicker-usage-data').length > 0) {
    getDatepicker('#datepicker-usage-data', 'month');
  }

  if($document.find('#datepicker-usage-data-customize').length > 0) {
    getDatepicker('#datepicker-usage-data-customize', 'month', true);
  }

  if($document.find('#datepicker-usage-data-large').length > 0) {
    getDatepicker('#datepicker-usage-data-large', 'month');
  }

  // Month를 선택하는 Datepicker의 값이 바뀌면 선택한 값을 버튼 내부 텍스트에 입력합니다. // 


  // =============== Date를 선택하는 Datepicker =============== //

  if($document.find('#datepicker-select-date').length > 0) {
    getDatepicker('#datepicker-select-date', 'calendar');
  }
  
  if($document.find('#datepicker-select-date-large').length > 0) {
    getDatepicker('#datepicker-select-date-large', 'calendar');
  }

  // =============== 현재 달을 기준으로 기간을 선택하는 Popup =============== //

  // 기간 선택 팝업 출력 버튼의 초기 값을 현재 달로 설정합니다. //
  $document.find('.btnOpenPeriod').each(function() {
    
    var $this = $(this);
    var month = 1;
    var getDate = getPeriod(month, false);

    $this.text(getDate);
  });

  if($document.find('#datepicker-select-period').length > 0) {
    getDatepicker('#datepicker-select-period', 'period');
  }

  if($document.find('#datepicker-select-period-large').length > 0) {
    getDatepicker('#datepicker-select-period-large', 'period');
  }
  
  /*
  Datepicker가 적용된 input 필드의 다음에 배치된 버튼을 클릭하면
  해당 input 필드가 포커스 됩니다.
  */
});

function popupDirection($datepicker) {
  var $parent = $datepicker.closest('.fieldDatepicker');
  var $popup = $parent.find('.datepicker-dropdown');
  var $window = $(window);

  var popupTop = $popup.offset().top;
  var popupHeight = $popup.outerHeight();

  var scrollTop = $document.scrollTop();
  var windowHeight = $window.outerHeight();

  // 팝업이 윈도우 하단을 벗어난 경우
  if(popupTop + popupHeight > scrollTop + windowHeight) {
    if(!$parent.hasClass('top')) {
      $parent.addClass('top');
    }
  }
}

// Date Format 변경 함수 //
function fommattedtDate(rawDate, separator, first, range, time) {
  var date = rawDate;
  var currentYear = date.getFullYear();    // 선택한 날짜에 대한 년도 (4 disit)

  // 선택한 날짜에 대한 월 (0 to 11) //
  if(time == 'old') {
    var currentMonth = date.getMonth() - 1;
  }
  else if(time == 'future') {
    var currentMonth = date.getMonth() + 1;
  }
  else {
    var currentMonth = date.getMonth();
  }
  
  var currentDay = date.getDate();         // // 선택한 날짜에 대한 년도 (1 to 31)
  var getDate;

  if(first == 'first') {
    getDate = new Date(currentYear, currentMonth, 1);
  }
  else if(first == 'last') {
    getDate = new Date(currentYear, currentMonth + 1, 0);
  }
  else {
    getDate = new Date(currentYear, currentMonth, currentDay);
  }
  
  var getYear = getDate.getFullYear();
  var getMonth = getDate.getMonth() + 1 < 10 ? '0' + (getDate.getMonth() + 1) : getDate.getMonth() + 1;
  var getDay = getDate.getDate() < 10 ? '0' + getDate.getDate() : getDate.getDate();

  if(range == 'year') return getYear;
  else if(range == 'month') return getYear + separator + getMonth;
  else if(range == 'day' || !range) return getYear + separator + getMonth + separator + getDay;
}

// 기간 선택 함수 //
function getPeriod(month, first) {
  var currentDate = new Date();

  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth();
  var currentDay = currentDate.getDate();

  if(first) {
    var firstDate = fommattedtDate(currentDate, '.', 'first', 'day');
    var endRawDate = new Date(currentYear, currentMonth + (month -1), currentDay);
    var endDate = fommattedtDate(endRawDate, '.', 'last', 'day');
  }
  else {
    var firstRawDate = new Date(currentYear, currentMonth - (month -1), currentDay);
    var firstDate = fommattedtDate(firstRawDate, '.', 'first', 'day');
    var endDate = fommattedtDate(currentDate, '.', 'last', 'day');
  }

  return  (currentMonth + 1) + '월 (' + firstDate + ' ~ ' + endDate + ')';
}

// [dev추가]
function getPeriodMonth(month, first) {
	var currentDate = new Date();

	var currentYear = currentDate.getFullYear();
	var currentMonth = currentDate.getMonth();
	var currentDay = currentDate.getDate();

	var firstRawDate = new Date(currentYear, month-1, currentDay);
	var firstDate = fommattedtDate(firstRawDate, '.', 'first', 'day');
	var endDate = fommattedtDate(firstRawDate, '.', 'last', 'day');

	return (month) + '월 (' + firstDate + ' ~ ' + endDate + ')';
}

// Datepicker 적용함수 //
// 파라미터(id:적용할 ID, '방')
function getDatepicker(id, type, customize, defaultPeriod) {
  // 타입이 month 일 경우 월 선택 팝업이 출력되도록 설정한다  //
  if(type == 'month' || type == 'monthSimple') {
    var minViewMode = 1;
    var maxViewMode = 2;
  }
  // 타입이 calendar 일 경우 달력이 출력되도록 설정한다 //
  else if(type == 'calendar') {
    var minViewMode = 0;
    var maxViewMode = 2;
  }

  // aria-expanded 속성이 없을 경우 false 로 초기화 //
  var $btnOpen = $document.find(id).find('.singleDatePicker').next('.btnOpen');
  var ariaExpanded = $btnOpen.attr('aria-expanded');

  if(!ariaExpanded) {
    $btnOpen.attr('aria-expanded', false);
  }

  // 타입이 month or calendar 일 경우 //
  if(type == 'month' || type == 'calendar' || type == 'monthSimple') {
    $document.find(id).find('.singleDatePicker').datepicker({
      container: id + ' .datePickerArea',
      language: 'ko',             // 언어 설정
      format: 'yyyy.mm.dd',       // 출력될 날짜 형식
      autoclose: false,           // 입력 시 달력이 자동으로 닫힘
      assumeNearbyYear: true,     // 년도를 두 자릿 수로 입력 가능 (eg. 1997 : 97, 2002 : 02)
      todayHighlight: true,       // 오늘 날짜를 다른 색으로 표시함
      minViewMode: minViewMode,   // 선택할 수 있는 최소 단계를 월까지로 제한함
      maxViewMode: maxViewMode,    // 선택할 수 있는 최대 단계를 년도까지로 제한함
      // showOnFocus: false,
    });

    // 버튼으로 Datepicker를 오픈 할 경우 //
    if($document.find(id).find('.singleDatePicker').next('.btnOpen').length > 0) {
  
      // $document.find(id).find('.singleDatePicker').next('.btnOpen').off('click');
      $btnOpen.on('click', function() {
        var $this = $(this);
        
        if(type == 'month' || type == 'monthSimple') {
          $this.attr('aria-expanded', true);
          $document.find(id).find('.singleDatePicker').datepicker('show');
        }
        else if(type == 'calendar' || type == 'period') {
          $this.attr('aria-expanded', true);
          $this.prev('.singleDatePicker').focus();    
        }
      });
    }

    $document.find(id).find('.singleDatePicker').datepicker().on('hide', function(e) {
      $(this).closest('.datePickerArea').find('.btnOpen').focus();
    });

    // 입력한 날짜가 변경된 경우 //
    // $document.find(id).find('.singleDatePicker').datepicker().off('changeDate').off('show').off('hide');
    $document.find(id).find('.singleDatePicker').datepicker().on('changeDate', function(e) {
      var formattedDate = '';
      if(type == 'month') {
        // 현재 선택한 Month (1월 : 0, 2월 : 1 ...) //
        var currentYear = e.date.getFullYear();
        var currentDate = e.date.getMonth() + 1;

        var formattedFirstDate = fommattedtDate(e.date, '.', 'first', 'day', 'old');   // 선택한 달의 첫 날
        var fommatedLastDate = fommattedtDate(e.date, '.', 'last', 'day', 'old');      // 선택한 달의 마지막 날

        if(customize) {
          // 버튼 내부에 선택한 달의 첫 날과 마지막 날을 조합하여 입력합니다. //
          formattedDate = '(' + formattedFirstDate + ' ~ ' + fommatedLastDate + ' 이용)';
        }
        else {
          formattedDate = currentDate + '월 (' + formattedFirstDate + ' ~ ' + fommatedLastDate + ')';
        }
      }
      else if(type == 'monthSimple') {// 소액결제 내역
        var currentYear = e.date.getFullYear();
        var currentDate = e.date.getMonth() + 1;

        if(currentDate < 10) {
          formattedDate = currentYear + '.0' + currentDate;
        } else {
          formattedDate = currentYear + '.' + currentDate;
        }
      }
      else if(type == 'calendar') {
        var currentYear = e.date.getFullYear();     // 현재 선택한 Year (yyyy) //
        // 현재 선택한 날짜. 날짜가 한 자리 수일 경우 날짜 앞에 0을 추가해줍니다. //
        var currentMonth = e.date.getMonth() + 1 < 10 ? '0' + (e.date.getMonth() + 1) : e.date.getMonth() + 1;
        // 현재 선택한 날짜. 날짜가 한 자리 수일 경우 날짜 앞에 0을 추가해줍니다. //
        var currentDay = e.date.getDate() < 10 ? '0' + e.date.getDate() : e.date.getDate();          

        // 버튼 내부에 선택한 달의 첫 날과 마지막 날을 조합하여 입력합니다. //
        formattedDate = e.format(0, 'yyyy.mm.dd');
      }

      $(e.currentTarget).next('.btnOpen').text(formattedDate);
      $(e.currentTarget).next('.btnOpen').attr('aria-expanded', false);
      if(customize) {
        $(e.currentTarget).next('.btnOpen').prepend('<span class="currentDate">' + currentYear + '.' + currentDate + '</span>');
        // $(e.currentTarget).next('.btnOpen').append('<span class="colorLabel">납부 예정</span>');
      }

    }).on('show', function(e) {
      var $this = $(this);

      // 팝업이 출력될 방향을 결정합니다. // 팝업이 화면 하단을 벗어날 경우 위쪽으로 출력되도록 합니다. //
      popupDirection($this);
    }).on('hide', function(e) {
      var $this = $(this);
      var $parent = $this.closest('.fieldDatepicker');

      if($parent.hasClass('top')) {
        $parent.removeClass('top')
      }
    });

    // 버튼에 입력할 날짜를 현재 달로 설정합니다 // 
    $(id).find('.singleDatePicker').datepicker('setDate', new Date());
  }
  // 타입이 period 일 경우 // [dev 수정]
  else if(type == 'period' || type == 'periodMonth') {
    $(id).find('.periodContainer').append('<div class="button-box"><button type="button" class="btn-close-calendar">닫기</button></div>');

    if(defaultPeriod && defaultPeriod > 0) {
      var $btnPeriod = $document.find(id).find('.periodContainer').find('.periodArea').children('button');
      var $parent = $btnPeriod.closest('.datePickerArea');
      var month = $btnPeriod.eq(defaultPeriod - 1).attr('month');
      var monthUsed = $btnPeriod.eq(defaultPeriod - 1).attr('monthUsed');
  
      if(type == 'period') {
        var getDate = getPeriod(month, false);
      } else {
        var getDate = getPeriodMonth(month, false);
      }

      $document.find(id).find('.periodContainer').find('.btnPeriod').removeAttr('title');
      $btnPeriod.eq(defaultPeriod - 1).attr('title', '선택됨');
  
      $parent.find('.btnOpenPeriod').text(getDate);
      $parent.find('.btnOpenPeriodUsed').text(monthUsed);
      $parent.find('.btnOpenPeriod').attr('aria-expanded', false);
    }

    $document.find(id).find('.periodContainer').find('.btn-close-calendar').on('click', function(e) {
      // [VOS2차] 결함 ID 1122420 수정 //
      $document.find(id).find('.periodContainer').removeClass('show').siblings('.btnOpen').attr('aria-expanded', false);
      // [VOS2차] 결함 ID 1122076 수정 : 닫기 버튼 클릭하여 닫았을 때 팝업 제공 전 버튼으로 포커스 이동 //
      $document.find(id).find('.periodContainer').removeClass('show').siblings('.btnOpen').focus();
    });

    // $document.find(id).find('.periodContainer').find('.btnPeriod').off('click');
    $document.find(id).find('.periodContainer').find('.btnPeriod').on('click', function(e) {
      var $this = $(this);
      var $parent = $this.closest('.datePickerArea');
      var month = $this.attr('month');
      var monthUsed = $this.attr('monthUsed');
  
      if(type == 'period') {
        var getDate = getPeriod(month, false);
      } else {
        var getDate = getPeriodMonth(month, false);
      }

      $document.find(id).find('.periodContainer').find('.btnPeriod').removeAttr('title');
      $this.attr('title', '선택됨');
  
      $parent.find('.btnOpenPeriod').text(getDate);
      $parent.find('.btnOpenPeriodUsed').text(monthUsed);
      $parent.find('.btnOpenPeriod').attr('aria-expanded', false);

      $this.parents('.periodContainer').removeClass('show').siblings('.btnOpen').focus();
    });
    
    $document.find(id).find('.periodContainer').on('keydown', function(e) {
      var $this = $(this);
      var $option = $this.find('.btnPeriod:focus');
      var index = $this.find('.btnPeriod').index($option);
      var listLength = $this.find('.btnPeriod').length;

      if (e.keyCode == "27") {
        $this.removeClass('show').siblings('.btnOpen').focus();
        // aria-expanded 속성을 false로 설정한다. //
        $this.removeClass('show').siblings('.btnOpen').attr('aria-expanded', false);

        e.preventDefault();
        e.stopImmediatePropagation();
      }
      else if (e.keyCode == "13" || e.keyCode == "32") {
        // e.preventDefault();
        // e.stopImmediatePropagation();
      }
      // KeyDown - Home //
      else if (e.keyCode == "36") {
        $this.find('.btnPeriod').first().focus();
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      // KeyDown - End //
      else if (e.keyCode == "35") {
        $this.find('.btnPeriod').last().focus();
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      // KeyDown - Up //
      else if (e.keyCode == "38") {
        if (index > 0) {
          $this.find('.btnPeriod').eq(index - 1).focus();
        }

        e.preventDefault();
        e.stopImmediatePropagation();
      }
      // KeyDown - Down //
      else if (e.keyCode == "40") {
        if (index < listLength - 1) {
          $this.find('.btnPeriod').eq(index + 1).focus();
        }

        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });
  }
}

// 시작일과 종료일을 입력하는 Datepicker //
// 시작일과 종료일 필드를 각각 적용합니다. //
// getMultiDatePicker('start', '#datepicker-start-period-data', '#datepicker-end-period-data', 'yyyy-mm-dd');
function getMultiDatePicker(type, start_id, end_id, format) {
  if(type == 'start') {
    var id = start_id;
  }
  else if(type == 'end') {
    var id = end_id;
  }

  $document.find(id).find('.singleDatePicker').datepicker({
    container: id + ' .datePickerArea',
    language: 'ko',             // 언어 설정
    format: format,       // 출력될 날짜 형식
    autoclose: false,           // 입력 시 달력이 자동으로 닫힘
    assumeNearbyYear: true,     // 년도를 두 자릿 수로 입력 가능 (eg. 1997 : 97, 2002 : 02)
    todayHighlight: true,        // 오늘 날짜를 다른 색으로 표시함
    minViewMode: 0,   // 선택할 수 있는 최소 단계를 날짜까지로 제한함
    maxViewMode: 2    // 선택할 수 있는 최대 단계를 월까지로 제한함
  });

  // 버튼으로 Datepicker를 오픈 할 경우 //
  if($document.find(id).find('.singleDatePicker').next('.btnOpen').length > 0) {
    var today = new Date();
    var btnText = $(id).find('.singleDatePicker').next('.btnOpen').text();

    if(btnText == '' || btnText == null) {
      $document.find(id).find('.singleDatePicker').next('.btnOpen').text(fommattedtDate(today, '-'));
    }

    // $document.find(id).find('.singleDatePicker').next('.btnOpen').off('click');
    $document.find(id).find('.singleDatePicker').next('.btnOpen').on('click', function() {
      var $this = $(this);
      $this.prev('.singleDatePicker').focus();
    });
  }
  
  // $document.find(id).find('.singleDatePicker').datepicker().off('changeDate').off('show').off('hide');
  $document.find(id).find('.singleDatePicker').datepicker().on('changeDate', function(e) {
    var currentDate = $(this).val();

    if(type == 'start') {
      var relatedDate = $(end_id).find('.singleDatePicker').val();
    }
    else if(type == 'end') {
      var relatedDate = $(start_id).find('.singleDatePicker').val();
    }

   // 입력한 시작일이 종료일 보다 이후 날짜일 경우 경고메세지를 출력하고, 입력 값을 초기화 합니다. //
    if(currentDate && relatedDate) {
      if(type == 'start' && currentDate > relatedDate) {
        // togglePopup(id.replace('#', ''), 'popup-wrong-start-date')
        
        // $(this).datepicker('setDate', null);
      }
      else if(type == 'end' && currentDate < relatedDate) {
        // togglePopup(id.replace('#', ''), 'popup-wrong-end-date')
        
        // $(this).datepicker('setDate', null);
      }
      else {
        if($document.find(id).find('.singleDatePicker').next('.btnOpen').length > 0) {
          $document.find(id).find('.singleDatePicker').next('.btnOpen').text(currentDate);
        }
      }
    }
    else {
      if($document.find(id).find('.singleDatePicker').next('.btnOpen').length > 0) {
        $document.find(id).find('.singleDatePicker').next('.btnOpen').text(currentDate);
      }
    }

  }).on('show', function(e) {
    var $this = $(this);

    // 팝업이 출력될 방향을 결정합니다. // 팝업이 화면 하단을 벗어날 경우 위쪽으로 출력되도록 합니다. //
    popupDirection($this);
  }).on('hide', function(e) {
    var $this = $(this);
    var $parent = $this.closest('.fieldDatepicker');

    if($parent.hasClass('top')) {
      $parent.removeClass('top')
    }
  });

  // $(id).find('.singleDatePicker').datepicker('setDate', new Date());
}

$(document).ready(function() {
  // [VOS2차] 결함 ID 1121820 브래드크럼 관련 수정 - 시작
  var $wrap = $document.find(".wrap");
  var $header = $wrap.find(".headerContainer");
  var $footer = $wrap.find(".footerContainer");

  var $firstMenu = null;  // Depth 1 활성화 메뉴
  var $secondMemuArea = null; // Depth 2 메뉴 그룹
  var $secondMenu = null; // Depth 2 활성화 메뉴
  var $thirdMemuArea = null;  // Depth 3 메뉴 그룹
  var $thirdMenu = null;  // Depth 3 활성화 메뉴

  var windowWidth = $(window).outerWidth();
  var windowHeight = $(window).outerHeight();

  var activeFisrstMenuIdx = null; // 사용자가 선택한 Depth 1 메뉴 Index
  var activeSecondMenuIdx = null; // 사용자가 선택한 Depth 2 메뉴 Index
  var activeThirdMenuIdx = null; // 사용자가 선택한 Depth 3 메뉴 Index
  var firstMenuIdx = null;  // 현재 페이지의 Depth 1 활성화 메뉴 Index
  var secondMenuIdx = null;  // 현재 페이지의 Depth 2 활성화 메뉴 Index
  var thirdMenuIdx = null;  // 현재 페이지의 Depth 3 활성화 메뉴 Index
  var hasThirdMenu = false; // 현재 페이지가 Depth 3 메뉴 소유 여부 

  var $menuList = $('.mobileNav').find('.menuList');
  var $mobileMenu = $('.mobileMenu');
  var $secondMenuList = $mobileMenu.find('.mobileSubMenuList'); // Depth 2 메뉴 그룹들의 컨테이너

  if($mobileMenu.find('.mobileThirdMenuList').length > 0) {
    var $thirdMenuList = $mobileMenu.find('.mobileThirdMenuList'); // Depth 3 메뉴 그룹들의 컨테이너
  }
  else {
    var $thirdMenuList = null;
  }

  $(window).on('load', function() {
    $wrap = $document.find(".wrap");
    $header = $wrap.find(".headerContainer");
    $footer = $wrap.find(".footerContainer");

    setTimeout(function() {
      alignActiveMenu();
    }, 250);
  }).scroll(function () {
    // summaryReset(); //header summary closed

    var scroll = $(window).scrollTop();
    var headerH = $('.headerArea').outerHeight();

    // 스크롤 좌표가 헤더 영역을 벗어남 //
    if (scroll > headerH) {
      if($mobileMenu.hasClass('active')) {
        $mobileMenu.removeClass('active');
      }
      
      if(!$mobileMenu.hasClass('mobileNavActive')) {
        $wrap.addClass("mobileNavActive");
      }

      if(secondMenuIdx != activeSecondMenuIdx) {
        $secondMenuList.find('.mobileSubMenuArea.show').find('a.active').removeClass('active');
        $secondMenuList.find('.mobileSubMenuArea.show').find('li').eq(secondMenuIdx - 1).find('a').addClass('active');
      }
      if($thirdMenuList) {
        $thirdMenuList.find('.mobileThirdMenuArea.show').removeClass('show');
      }
    } else {
      if($wrap.hasClass('mobileNavActive')) {
        $wrap.removeClass("mobileNavActive");
      }
      $secondMenuList.removeAttr('style');

      if($secondMenuList.find('.mobileSubMenuArea.show').find('li').eq(secondMenuIdx - 1).find('a').hasClass('hasThirdMenu')) {
        $thirdMenuList.find('#thirdMenu_' + firstMenuIdx + '_' + secondMenuIdx).addClass('show');
      }
    }
  }).resize(function() {
    windowWidth = $(window).outerWidth();
    if(windowWidth > 1024) {
      if($header.hasClass("mobile")) {
        $header.removeClass("mobile");
        $wrap.removeClass("moMenuOpen");
        $document.find("body").removeAttr('style');
        $('.mobileContainer').removeAttr('style');
      }
      if($footer.hasClass("mobile")) {
        $footer.removeClass("mobile");
      }
      $('.wrap').removeClass("mobileNavOn");
    } else {
      if(!$header.hasClass("mobile")) {
        $header.addClass("mobile");
      }
      if(!$footer.hasClass("mobile")) {
        $footer.addClass("mobile");
      }
      $('.wrap').addClass("mobileNavOn");

      mobileNavControl();
    }
  }).resize();

  function mobileNavControl() {
    // 초기 값
    var initBtn = $('.menuList .menu' + '[aria-selected="true"]').attr('aria-controls');
    $('#' + initBtn).addClass('show');
    
    // 메뉴가 적을 경우 토글버튼 비활성화
    var wrpperWith = $('.mobileSubMenuList').width();
    // var itemWidth = $('#' + initBtn).find('.mobileSubMenu').width();

    // ===== 첫 번째 메뉴 클릭 이벤트 리스너 ===== //

    $(document).off("click", '.menuList .menu');
    $(document).on("click", '.menuList .menu', function() {
      // 초기 값
      var $this = $(this);
      var $parent = $this.closest('li');
      
      var thisIndex = $menuList.children('li').index($parent) + 1;
      $('.menuList .menu').removeClass('active').attr("aria-selected", "false");
      $('.mobileSubMenuArea').removeClass('show');

      // show
      var $tabCon = $this.attr('aria-controls');
      $this.addClass('active');
      $this.attr('aria-selected', 'true');
      $('#' + $tabCon).addClass('show');

      if( $('.mobileNavOn').hasClass('mobileNavActive') ) {
        $('.mobileSubMenuList').addClass('show');
      } else {
        $('.mobileSubMenuList').removeClass('show');
      }

      // 메뉴가 적을 경우 토글버튼 비활성화
      var itemWidth = $('#' + $tabCon).find('.mobileSubMenu').width();
      if( wrpperWith <= itemWidth ) {
        $('.btnShowAll').removeClass('disabled');
        $('.btnShowAll').removeAttr('disabled');
      } else {
        $('.btnShowAll').addClass('disabled');
        $('.btnShowAll').attr('disabled', '');
      }

      if(thisIndex != activeFisrstMenuIdx && $thirdMenuList) {
        $thirdMenuList.find('.mobileThirdMenuArea.show').removeClass('show');
      }

      activeFisrstMenuIdx = thisIndex;
    });
    
    $wrap = $document.find(".wrap");
    $header = $wrap.find(".headerContainer");
    $footer = $wrap.find(".footerContainer");

    // First //
    $firstMenu = $document.find('.mobileNav').find('.menuList').find('.menu.active');
    firstMenuIdx = $firstMenu.closest('li').index() + 1;
    $secondMemuArea = $document.find('.mobileNav').find('.mobileSubMenuList').find('.mobileSubMenuArea.show');

    // Get the Active Second menu index //
    var secondMenuClass = $secondMemuArea.attr('class');

    // [VOS2차] 결함 ID 1122233 수정 - 시작 //
    $secondMemuArea.find('li').find('a').removeAttr('title');
    if(secondMenuClass) {
      activeSecondMenuIdx = checkActiveClass(secondMenuClass);
      $secondMemuArea.find('li').eq(activeSecondMenuIdx - 1).find('a').addClass('active');
      $secondMemuArea.find('li').eq(activeSecondMenuIdx - 1).find('a').attr('title', '선택됨');
    }
    else {
      $secondMemuArea.find('li').eq(0).find('a').addClass('active');
      $secondMemuArea.find('li').eq(0).find('a').attr('title', '선택됨');
    }

    // Second //  
    $secondMenu = $secondMemuArea.find('a.active');
    secondMenuIdx = $secondMenu.closest('li').index() + 1;
    $thirdMemuArea = $document.find('.mobileNav').find('.mobileThirdMenuList').find('#thirdMenu_' + firstMenuIdx + '_' + secondMenuIdx);
    $thirdMemuArea.addClass('show');

    // Get the Active Third menu index //
    var thirdMenuClass = $thirdMemuArea.attr('class');
    // var thirdMenuActive

    $thirdMemuArea.find('li').find('a').removeAttr('title');
    if(thirdMenuClass) {
      activeThirdMenuIdx = checkActiveClass(thirdMenuClass);
      $thirdMemuArea.find('li').eq(activeThirdMenuIdx - 1).find('a').addClass('active');
      $thirdMemuArea.find('li').eq(activeThirdMenuIdx - 1).find('a').attr('title', '선택됨');
    }
    else {
      $thirdMemuArea.find('li').eq(0).find('a').addClass('active');
      $thirdMemuArea.find('li').eq(0).find('a').attr('title', '선택됨');
    }
    // [VOS2차] 결함 ID 1122233 수정 - 끝 //

    // Third //  
    $thirdMenu = null;
    thirdMenuIdx = null;

    // Get Current Title //
    var currentTitle = '';
    if($secondMenu.hasClass('hasThirdMenu')) {
      $thirdMenu = $thirdMemuArea.find('a.active');
      thirdIdx = $thirdMenu.closest('li').index() + 1;
      currentTitle = $thirdMenu.text();
      hasThirdMenu = true;
    }
    else {
      currentTitle = $secondMenu.text();
      hasThirdMenu = false;
    }

    $document.find('.mobileMenu').find('.currentPageTitle').find('.menuTitle').text(currentTitle); //[VOS2차] 결함ID 1122632 클래스로 변경

    alignActiveMenu();
  
    expandedControl(hasThirdMenu);

    // ===== 두 번째 메뉴 클릭 이벤트 리스너 ===== //

    $(document).off("click", '.mobileSubMenuList .mobileSubMenu a');
    $(document).on("click", '.mobileSubMenuList .mobileSubMenu a', function() {
      var $this = $(this);
      var $parent = $this.closest('.mobileSubMenuArea');
      
      // 두 번째 메뉴가 세 번째 메뉴를 갖고 있지 않은 경우 a 태그에 연결된 경로로 이동 //
      if(!$this.hasClass('hasThirdMenu')) {
        return true;
      }
      // 두 번째 메뉴가 세 번째 메뉴를 갖고 있는 경우 해당 되는 세 번째 메뉴를 오픈 //
      else {
        var myIdx = $parent.find('.mobileSubMenu').find('a').index(this) + 1;
        var parentIdx = $(document).find('.mobileSubMenuList').find('.mobileSubMenuArea').index($parent) + 1;

        $parent.find('.mobileSubMenu').find('a').removeClass('active');
        $parent.find('.mobileSubMenu').find('a').removeAttr('title');//[VOS] 1122233 - 20230322 수정

        $this.addClass('active');
        $this.attr('title', '선택됨');//[VOS] 1122233 - 20230322 수정

        if(!$document.find('.mobileThirdMenuList').find('#thirdMenu_' + parentIdx + '_' + myIdx).hasClass('show')) {
          $document.find('.mobileThirdMenuList').find('.mobileThirdMenuArea').removeClass('show');
          $document.find('.mobileThirdMenuList').find('#thirdMenu_' + parentIdx + '_' + myIdx).addClass('show');
          activeSecondMenuIdx = myIdx;
        }
        
        return false;
      }
    });
  }

  function checkActiveClass(classes) {
    var classArray = classes.split(' ');
    var hasActive = -1;

    for(var i = 0; i < classArray.length; i++) {
      if(classArray[i].search('active-') > -1) {
        hasActive = i;
        break;
      }
    }

    if(hasActive > -1) {
      return Number(classArray[hasActive].split('-')[1]);
    }
    else {
      return false;
    }
  }

  // mobile navi toggle button
  function expandedControl(has3rdMenu) {
    // 초기 값
    $('.mobileMenu .btnShowAll').attr('aria-expanded', 'false');
    $('.mobileMenu').removeClass('active');

    // ===== toggle 활성화 ===== //

    $(document).off("click", '.mobileMenu .btnShowAll');
    $(document).on("click", '.mobileMenu .btnShowAll', function(){
      var $mobileMenu = $('.mobileMenu');
      var $secondMenuList = $mobileMenu.find('.mobileSubMenuList');

      if(has3rdMenu) {
        var $thirdMenuList = $mobileMenu.find('.mobileThirdMenuList');
      }
      else {
        var $thirdMenuList = null;
      }

      // 모바일 하위 메뉴를 접는다. //
      if($mobileMenu.hasClass('active') ) {
        $(this).attr('aria-expanded', 'false');
        $mobileMenu.removeClass('active');

        // Depth 3 메뉴가 있음 //
        if(has3rdMenu) {
          if($wrap.hasClass('mobileNavActive')) {
            $thirdMenuList.removeAttr('style');
          }
        }

        alignActiveMenu();

      // 모바일 하위 메뉴를 펼친다. //
      } else {
        $(this).attr('aria-expanded', 'true');
        $mobileMenu.addClass('active');

        // Depth 3 메뉴가 있음 //
        if(has3rdMenu) {
          if($wrap.hasClass('mobileNavActive')) {            
            // 두 번째 메뉴 리스트 hide(), 세 번째 메뉴 리스트 show() //
            $secondMenuList.hide();
            $thirdMenuList.show();

            // Depth 3 메뉴 리스트 중 현재 페이지에 해당하는 메뉴가 show 클래스를 가지고 있지 않을 경우 추가해준다. //
            if(!$thirdMenuList.find('#thirdMenu_' + firstMenuIdx + '_' + secondMenuIdx).hasClass('show')) {
              $thirdMenuList.find('.mobileThirdMenuArea').removeClass('show');
              $thirdMenuList.find('#thirdMenu_' + firstMenuIdx + '_' + secondMenuIdx).addClass('show');
            }
          }
        }
        // Depth 3 메뉴가 없음 //
        else {
          $secondMenuList.show();
        }

        $(this).attr('aria-expanded', 'true');
        $mobileMenu.addClass('active');
      }
    });
  }

  function alignActiveMenu() {
    if($firstMenu && $firstMenu.length > 0) {
      var totalFirstWidth = 0;
      var firstLeft = $firstMenu.position().left;
      var firstWidth = $firstMenu.outerWidth();
      var firstBoxWidth = $menuList.width();

      for(var i = 0; i < firstMenuIdx - 1; i++) {
        if($menuList.find('li').eq(i).css('display') != 'none') {
          totalFirstWidth += $menuList.find('li').eq(i).outerWidth();
        }
      }

      if(firstLeft + firstWidth < 0 || firstLeft + firstWidth > firstBoxWidth) {
        $menuList.scrollLeft(totalFirstWidth);
        firstLeft = Math.floor($firstMenu.position().left);
      }
    }

    if($secondMenu && $secondMenu.length > 0) {
      var totalSecondWidth = 0;
      var secondtLeft = Math.floor($secondMenu.position().left);
      var secondWidth = Math.floor($secondMenu.outerWidth());
      var secondBoxWidth = Math.floor($secondMemuArea.width());

      for(var i = 0; i < secondMenuIdx - 1; i++) {
        if($secondMemuArea.find('li').eq(i).css('display') != 'none') {
          totalSecondWidth += $secondMemuArea.find('li').eq(i).outerWidth() + 4;
        }
      }

      if(secondtLeft + secondWidth < 0 || secondtLeft + secondWidth > secondBoxWidth) {
        $secondMemuArea.scrollLeft(totalSecondWidth - 60);
        secondtLeft = Math.floor($secondMenu.position().left);
      }
    }

    if($thirdMenu && $thirdMenu.length > 0) {
      var totalThirdWidth = 0;
      var thirdtLeft = $thirdMenu.offset().left;
      var thirdWidth = $thirdMenu.outerWidth();
      var thirdBoxWidth = $thirdMemuArea.width();

      for(var i = 0; i < thirdMenuIdx - 1; i++) {
        if($thirdMemuArea.find('li').eq(i).css('display') != 'none') {
          totalThirdWidth += $thirdMemuArea.find('li').eq(i).outerWidth();
        }
      }

      if(thirdtLeft + thirdWidth < 0 || thirdtLeft + thirdWidth > thirdBoxWidth) {
        $thirdMemuArea.scrollLeft(totalThirdWidth);
        thirdtLeft = Math.floor($thirdMenu.position().left);
      }
    }
  }

  // [VOS2차] 결함 ID 1121820 브래드크럼 관련 수정 - 끝
});

// DR-2023-55179 탑배너 고도화 추가 시작
// window.addEventListener('load', loadCheckTopBanner);
// window.removeEventListener('load', loadCheckTopBanner);

function loadCheckTopBanner() {
  const topBannerContainer = document.querySelector('.topBannerContainer');
  if( topBannerContainer ) {
    document.querySelector('.wrap').classList.add('openedTopBanner');// wrap.openedTopBanner
    TopBannerSwiper();// swiper
    const closeTopBanner = topBannerContainer.querySelector('.closeBanner');
    closeTopBanner.addEventListener('click', closeTopBannerHandler);
  }
}

// Top Banner Swiper 20230927 수정
function TopBannerSwiper() {
  const swiperId = '#topBannerSwiper';
  let options;

  // slide가 1 보다 작을 때 <> 숨김
  const swiperWrapper = document.querySelector(swiperId + ' .swiper-wrapper');
  const swiperSlideCount = swiperWrapper.childElementCount;
  if(swiperSlideCount <= 1) {
    document.querySelector(swiperId + ' .bannerbuttons').style.display = 'none';
  } else {
    options = {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      touchRatio: 0,
      navigation: {
        nextEl: ".bannerBtnNext",
        prevEl: ".bannerBtnPrev",
      },
      on: {
        slideChange: function(e) {
          enabledShowingFocus(topBannerSwiper);
        },
        resize: function(e) {
          enabledShowingFocus(topBannerSwiper);
        }
      }       
    }
  }

  var topBannerSwiper = new Swiper(swiperId, options);
  enabledShowingFocus(topBannerSwiper);
}
// Top banner close
function closeTopBannerHandler() {
  const topBanner = this.parentNode;
  topBanner.remove();
  document.querySelector('.wrap').classList.remove('openedTopBanner');
  setTimeout(function() {
    document.querySelector('.header .logo a').focus();
  }, 400)
}
// DR-2023-55179 탑배너 고도화 추가 끝
function loginBgScroll(homeLogin) {
  var state = null;
  var $fixedImg = $(homeLogin).find('.loginImage .moType');
  var fixedImgH = $fixedImg.outerHeight();
  var $footer = $(homeLogin).find('.footerContainer');
  var footerH = $footer.outerHeight();
  var $loginContainer = $(homeLogin).find('.loginContainer');
  var loginContainerH = $loginContainer.outerHeight();
  var $loginWrapper = $(homeLogin).find('.loginWrapper');
  var loginContainerPaddingSum = (footerH + loginContainerH);

  if ($(window).width() <= 1024) {
    // 컨테이너 하단 여백값 (푸터 높이 + 이미지 높이)

    // fixedImgH = $fixedImg.outerHeight();

    fixedImgH = $(window).outerWidth() * 0.831125828;

    footerH = $footer.outerHeight();
    loginContainerH = $loginContainer.outerHeight();
    loginContainerPaddingSum = (footerH + loginContainerH);

    if(state != 'mobile') {
      state = 'mobile';
      $loginWrapper.addClass('mobile');

      

      $loginContainer.css({
        'position': 'relative',
        'marginTop' : fixedImgH
      });
    }
  }

  else {
    if(state != 'pc') {
      state = 'pc';
      $loginWrapper.removeClass('mobile');

      $loginContainer.removeAttr('style');
    }
  }
}


// [1차] VOS 1112775 수정 20221020 //시작//
$(document).ready(function () {
  var $skip = $(".skip");
  var $logo = $("h1.logo");

  // 본문바로가기 시 최상단으로 스크롤 이동
  $skip.find("a, button").eq(0).on("click", function (e) {
    $("html, body").stop().animate({scrollTop: 0,},100);
  });

  // skip이 있을 경우 실행
  if (!$skip.length == 0) {
    $skip.find("a").each(function (e) {
      var $this = $(this);
      if (!$this.attr("role")) {
        $this.attr("role", "button");
      }
    });

    if (!$logo.find("a").attr("role")) {
      $logo.find("a").attr("role", "button");
    }

    $(window).on("resize", function () {
      $logo.on("focus", function () {
        $skip.find("a").blur();
      });

      $("#contentContainer").removeAttr("id").removeAttr("tabindex"); //id reset attr

      // ======================== GNB ======================== //
      if ($(window).width() > 1024) {
        //PC
        $("#gnbContainer").removeAttr("id").removeAttr("tabindex"); //id reset attr
        $skip.find("a").removeAttr("style"); //skip mobile - gnb,footer none Reset
        
        // ID 체크
        if ($(".gnbContainer").find(".gnb").attr("id") && $(".gnbContainer").find(".gnb").attr("id") != "") {
          // id가 있는 경우
          var attrID = $(".gnbContainer").find(".gnb").attr("id");
          $skip.find("a").eq(1).attr("href", "#" + attrID); //change href
          $("#" + attrID).attr("tabindex", "-1");
        } else {
          // id가 없는 경우
          $(".gnbContainer").find(".gnb").attr("id", "gnbContainer").attr("tabindex", "-1"); //add attr
        }
      } else {
        //Mobile
        $skip.find("a").hide().eq(0).show(); // skip mobile - gnb,footer none
      }

      // ======================== Contents Container ======================== //
      if ($(".wrap").hasClass("homeSearchResult")) {
        // ====== 통합검색 ====== //
        if ($(window).width() > 1024) {
          //PC
          skipSync($(".homeSearchResult").find(".contentContainer"), 0);
        } else {
          //Mobile
          skipSync($(".homeSearchResult").find(".contentArea"), 0);
        }
      } 
      else if ($(".headerArea").find("> .myInfoSummary").length > 0) {
        // ====== 메인 ====== //
        skipSync($(".headerArea > .myInfoSummary"), 0);
      }
      // <!-- [K-WAX] 20221117 숨김 --> 
      // else if ($(".wrap").find(".contentContainer .subTitleContainer").length > 0) {
      //   // ====== 마이알뜰폰 회선 정보 영역 ====== // 회선영역이 없는 경우 detail 조건과 etc 조건
      //   skipSync($(".contentContainer .subTitleContainer"), 0);
      // } 
      // else if ($(".wrap").find(".eventSwiper").length > 0) {
      //   // ====== 이벤트 목록 - 슬라이드 ====== //
      //   skipSync($(".eventSwiper"), 0);
      // } 
      // else if ($(".wrap").find(".contentContainer .searchContainer").length > 0) {
      //   // ====== 검색바 영역 - FAQ, 공지사항, 종료된 이벤트 ====== //
      //   skipSync($(".contentContainer .searchContainer"));
      // } 
      // else if ($(".wrap").hasClass("detail")) {
      //   // ====== 상세 페이지 ====== //
      //   if ($(".wrap").find(".contentArea").length > 0) {
      //     skipSync($(".wrap").find(".contentArea"), 0);
      //   } else {
      //     $("main").attr("id", "contentContainer").attr("tabindex", "-1"); //add attr
      //   }
      // } 
      // else if ($(".wrap").hasClass("serviceFriends")) {
      //   // ====== 마이알뜰폰 프렌즈 ====== //
      //   skipSync($(".serviceFriends").find(".contentInner"), 0);
      // } 
      // <!-- //[K-WAX] 20221117 숨김 -->
      else {
        // ====== ETC ====== //
        // 본문 0개 이상
        if ($(".contentContainer").length > 0) {
          skipSync($(".contentContainer"), 0);
        } else {
          skipSync($("main"), 0);
        }
      }
    }).resize();
    
    /*
    바로가기 버튼과 바로가기 ID의 동기화를 위한 함수
    parameter
    - $container : id를 가지고 있어야 할 대상
    - skip : 본문 바로가기 버튼 순서(0 : 본문 바로가기, 1: 주메뉴 바로가기, 2: 푸터 바로가기))
    */
    function skipSync($container, skip) {
      // ID 체크
      if ($container.attr("id") && $container.attr("id") != "") {
        // id가 있는 경우
        var attrID = $container.attr("id");
        $skip.find("a").eq(skip).attr("href", "#" + attrID); //change href
        $("#" + attrID).attr("tabindex", "-1");
      } else {
        // id가 없는 경우
        $container.attr("id", "contentContainer").attr("tabindex", "-1"); //add attr
      }
    }
  }
});
// [1차] VOS 1112775 수정 20221020 //끝//

// [VOS2차] 결함ID 1122059 하드코딩으로 변경
// [VOS2차] 결함ID 1122882 시작
$(function () {
  $(window).on('load', function () {
    // 단계 표현 IR
    if ($(document).find('.deliveryStep.detail').length !== 0) {
      $('.deliveryStep.detail').each(function(){
        var $currentStep = $(this).find('.step.on > .title');
        $currentStep.prepend('<span class="iconState">현재</span>');
      });
    }
  });
});
// [VOS2차] 결함ID 1122882 끝


// NW_UI/UX 필터 스크립트
$(function () {
function selectTagSlide() {
  var swiper = new Swiper(".selectTagSlide", {
    slidesPerView: "auto",
    spaceBetween: 6,
    observer: true,
    observeParents: true,
    breakpoints: {
      717: {
        spaceBetween: 5,
      }
    }
  });
}

selectTagSlide()


});