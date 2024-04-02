$(function() {
    
    // -------- 메인 --------
    // 01. 메인 최상단 날짜 노출
    var mnnow = new Date();
    var month = mnnow.getMonth()+1;//월
    $('.mn-month').text(month);

    var day = ('0' + mnnow.getDate()).slice(-2);;//일자
    $('.mn-day').text(day);

    // 요일
    var weekday = new Array(7);
    weekday[0] = "일";
    weekday[1] = "월";
    weekday[2] = "화";
    weekday[3] = "수";
    weekday[4] = "목";
    weekday[5] = "금";
    weekday[6] = "토";
    
    var weektxt = weekday[mnnow.getDay()];
    $('.mn-dayweek').text(weektxt);


    // 메인 아이콘 움직임
    $('.icon-morebtn.mnicon-open').click(function(){
        $('.btm-icons').addClass('open');
        $(this).addClass('hide');
        $('.mnicon-close').removeClass('hide');


        $("#sortable").sortable({
            cancel: '.nosort',
            delay : 300,
        });
        $('.btm-icons li').removeClass('nosort');

        if($('.btm-icons').hasClass('open') === true) {
            var iconInnerH = $('.btm-icons.open').find(('#sortable')).height();
            var iconInnerHAuto = iconInnerH + 15;
            console.log(iconInnerH);
            console.log(iconInnerHAuto);
            $('.btm-icons').animate({height:iconInnerHAuto}, 200);
        } else if ($('.btm-icons').hasClass('open') === false)  {
            $('.btm-icons').animate({height:300}, 200);
        }
    });

    $('.icon-morebtn.mnicon-close').click(function(){
            $('.btm-icons').removeClass('open');
            $(this).addClass('hide');
            $('.mnicon-open').removeClass('hide');
            $('.btm-icons li').addClass('nosort');
            $('.btm-icons').animate({height:300}, 200);

            if($('.btm-icons').hasClass('open') === true) {
                var iconInnerH = $('.btm-icons.open ul').height();
                var iconInnerHAuto = $('.btm-icons.open ul').height();
                console.log(iconInnerH);
                console.log(iconInnerHAuto);
                $('.btm-icons').animate({height:iconInnerHAuto}, 200);
            } else if ($('.btm-icons').hasClass('open') === false)  {
                $('.btm-icons').animate({height:300}, 200);
            }
    });



    function initializeSwiper () {
        // 02. 메인 배너 swiper
        var swiper01 = new Swiper('.slider-bnr01', {
            slidesPerView : 1, 
            centeredSlides: true,
            loop: true,
            autoHeight: true,
            spaceBwtween : 40,
            autoplay : {
                delay : 3000,
                disableOnInteraction : false,
            },
            pagination: {
                el: '.numcount',
                type: 'custom',
                renderCustom: function (swiper, current, total) {
                    return '<span class="current-num">'+ current + '&nbsp;</span> <span class="div">/</span> <span class="total-num">&nbsp;' + total + '</span>';
                }
            },
        })

        // 03. 메인 하단 swiper
        var swiper02 = new Swiper('.slider-bnr03', {
            slidesPerView : '1', 
            centeredSlides: true,
            loop: true,
            pagination: {
                el: '.slider-bnr03-arrows',
                clickable: true,
            },
            autoplay : {
                delay : 3000,
                disableOnInteraction : false,
            },
        })
    }

    initializeSwiper();





    $('.mn-banner.mid-bnr .mn-play').click(function(){
        $(this).addClass('hide');
        $('.mn-banner.mid-bnr .mn-pause').removeClass('hide');
        swiper01.autoplay.start();
    });

    $('.mn-banner.mid-bnr .mn-pause').click(function(){
        $(this).addClass('hide');
        $('.mn-banner.mid-bnr .mn-play').removeClass('hide');
        swiper01.autoplay.stop();
    });









    // -------- subpage --------

    // 04. 서브페이지 tab active 작동
    $('.newbuild .cardwrap .boxtabs li').click(function(){
        $('.newbuild .cardwrap .boxtabs li').removeClass('active');
        $(this).addClass('active');
    });
}) 
// end