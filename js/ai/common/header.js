// Desktop: Dropdown
if (document.querySelectorAll('.has-dropdown').length) {
    document.querySelectorAll('.has-dropdown').forEach((item) => {
        item.addEventListener('mouseenter', () => item.classList.add('active'));
        item.addEventListener('mouseleave', () => item.classList.remove('active'));
        item.querySelector('.nav-link').addEventListener('click', (e) => {
            e.preventDefault();
            item.classList.toggle('active');
        });
    });
}

// Language Dropdown
const langBtn = document.getElementById('lang-btn');
const langMenu = document.getElementById('lang-menu');
const langCurrent = document.getElementById('lang-current');
if (langBtn && langMenu) {
    langBtn.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        langMenu.classList.add('active');
    });
    langMenu.addEventListener('mouseleave', (e) => {
        langMenu.classList.remove('active');
    });
    langMenu.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            langCurrent.textContent = btn.dataset.lang;
            langMenu.classList.remove('active');
        });
    });
    document.addEventListener('click', (e) => {
        if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
            langMenu.classList.remove('active');
        }
    });
}

const header = document.getElementById('main-header');
// 스크롤 시 헤더/스티키 메뉴 show/hide 및 상태 관리 (최적화)
(function () {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const stickyHeader = document.querySelector('.sticky-header');
    const parallaxSection = document.getElementById('parallax-depth-section');
    let lastHeaderState = null;
    let lastStickyState = null;

    function onScroll() {
        const currentY = window.scrollY;
        const isMobile = window.innerWidth <= 768;
        // 헤더 show/hide
        let headerState;
        if (currentY === 0) {
            headerState = 'top';
        } else if (currentY > lastScrollY && currentY > 80) {
            headerState = 'hide';
        } else {
            headerState = 'show';
        }
        // 상태 변화시에만 DOM 조작
        if (headerState !== lastHeaderState) {
            if (headerState === 'top' || headerState === 'show') {
                header.classList.add('show');
                header.classList.remove('hide');
            } else if (headerState === 'hide') {
                header.classList.add('hide');
                header.classList.remove('show');
            }
            if (currentY > 0) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastHeaderState = headerState;
        }
        // 스티키 헤더 show/hide (모바일만)
        if (stickyHeader && parallaxSection) {
            const sectionRect = parallaxSection.getBoundingClientRect();
            let stickyState = sectionRect.top <= 1 ? 'show' : 'hide';
            if (stickyState !== lastStickyState) {
                if (stickyState === 'show') {
                    stickyHeader.classList.add('show');
                } else {
                    stickyHeader.classList.remove('show');
                }
                lastStickyState = stickyState;
            }
        }
        lastScrollY = currentY;
        ticking = false;
    }
    function onScrollThrottled() {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }
    window.removeEventListener('scroll', onScroll); // 혹시 중복 방지
    window.addEventListener('scroll', onScrollThrottled);
    // 초기 상태 적용
    onScroll();
})();

// 구성요소 영역에서 dark-header 클래스 토글
// 구성요소 영역에서 dark-header 클래스 토글 및 스티키 헤더 관리
const depthSection = document.querySelector('.parallax-depth-section');
const kqualitySection = document.querySelector('.kquality-section');
const stickyHeaderList = document.querySelector('.sticky-header-list');
const componentSections = document.querySelectorAll(
    '#parallax-depth-section, #kquality-section, #eco-section, #usecase-section, #news-section',
);

function updateHeaderAndStickyNav() {
    // 헤더 클래스 업데이트
    if (depthSection) {
        const depthRect = depthSection.getBoundingClientRect();
        const depthVisible = depthRect.top <= 0 && depthRect.bottom > 0;
        depthVisible ? header.classList.add('dark-header') : header.classList.remove('dark-header');
    }

    if (kqualitySection) {
        const kqualityRect = kqualitySection.getBoundingClientRect();
        const kqualityVisible = kqualityRect.top <= 0 && kqualityRect.bottom > 0;
        kqualityVisible
            ? header.classList.add('gray-header')
            : header.classList.remove('gray-header');
    }

    // 스티키 네비게이션 업데이트
    if (stickyHeaderList && componentSections.length > 0) {
        const visibleSections = Array.from(componentSections)
            .map((section) => ({
                section,
                top: section.getBoundingClientRect().top,
            }))
            .filter(({ top, section }) => top < window.innerHeight && top > -section.offsetHeight);

        if (visibleSections.length > 0) {
            const activeSection = visibleSections.reduce((prev, curr) =>
                !prev || curr.top < prev.top ? curr : prev,
            );

            const sectionId = activeSection.section.id || activeSection.section.dataset.section;
            const stickyItems = stickyHeaderList.querySelectorAll('li');

            stickyItems.forEach((el) => el.classList.remove('active'));
            const activeStickyItem = stickyHeaderList.querySelector(
                `[data-section="${sectionId}"]`,
            );
            if (activeStickyItem) activeStickyItem.classList.add('active');
        }
    }
}

// 스크롤 이벤트에 통합 함수 연결
window.addEventListener('scroll', updateHeaderAndStickyNav);

// 초기 실행
updateHeaderAndStickyNav();

// 스티키 헤더 클릭 이벤트
if (stickyHeaderList && componentSections.length > 0) {
    stickyHeaderList.querySelectorAll('li').forEach((item) => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;
            const targetSection =
                document.getElementById(sectionId) ||
                document.querySelector(`[data-section="${sectionId}"]`);

            if (targetSection) {
                const headerOffset = (header && header.offsetHeight) || 0;
                const sectionTop =
                    targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                window.scrollTo({ top: sectionTop, behavior: 'smooth' });

                stickyHeaderList
                    .querySelectorAll('li')
                    .forEach((el) => el.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
}

// ===== 모바일 메뉴 인터랙션 =====
(function () {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileSolutionToggle = document.getElementById('mobile-solution-toggle');
    const mobileSolutionItem = mobileSolutionToggle && mobileSolutionToggle.closest('.has-sub');
    const mobileSolutionSub = document.getElementById('mobile-solution-sub');
    const mobileLangBtns = document.querySelectorAll('.mobile-menu-lang button');

    // iOS Safari 대응: --vh 변수 설정 및 body scroll lock
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    let lastScrollY = 0;
    function setIOSVh() {
        document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
    }
    function lockBodyScrollIOS() {
        lastScrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${lastScrollY}px`;
        document.body.style.width = '100%';
    }
    function unlockBodyScrollIOS() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, lastScrollY);
    }

    // 메뉴 열기
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.add('active');
            document.body.classList.add('scroll-lock');
            if (isIOS) {
                setIOSVh();
                window.addEventListener('resize', setIOSVh);
                lockBodyScrollIOS();
            }
        });
    }
    // 메뉴 닫기
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('scroll-lock');
            if (isIOS) {
                window.removeEventListener('resize', setIOSVh);
                unlockBodyScrollIOS();
            }
        });
    }
    // Solution 아코디언
    if (mobileSolutionToggle && mobileSolutionItem) {
        mobileSolutionToggle.addEventListener('click', function (e) {
            e.preventDefault();
            mobileSolutionItem.classList.toggle('open');
        });
    }
    // 언어 선택
    if (mobileLangBtns.length) {
        mobileLangBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                mobileLangBtns.forEach(function (b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
            });
        });
    }
    // 메뉴 외부 클릭 시 닫기 (선택사항)
    // document.addEventListener('click', function(e) {
    //   if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && e.target !== mobileMenuBtn) {
    //     mobileMenu.classList.remove('active');
    //     document.body.style.overflow = '';
    //   }
    // });
})();

// 모바일 detail 페이지 뒤로가기 버튼 처리
(function () {
    const headerLogo = document.querySelector('.header-logo');
    const headerLogoExt = document.querySelector('.header-logo-ext');
    const isDetailPage = document.querySelector('.techDetailPage');

    if (isDetailPage && headerLogo && headerLogoExt) {
        // 모바일에서만 적용
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                headerLogo.querySelector('a').style.display = 'none';
                headerLogoExt.style.display = 'block';
            } else {
                headerLogo.querySelector('a').style.display = 'block';
                headerLogoExt.style.display = 'none';
            }
        };

        // 초기 실행
        handleResize();

        // 리사이즈 이벤트 리스너
        window.addEventListener('resize', handleResize);

        // 뒤로가기 버튼 클릭
        headerLogoExt.addEventListener('click', (e) => {
            e.preventDefault();
            history.back();
        });
    }
})();
