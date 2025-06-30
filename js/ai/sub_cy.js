document.addEventListener('DOMContentLoaded', function () {
  initTabsComponent();
  initDoubleInnerTabs01();
  initDoubleInnerTabs02();
  initStickyHeader();
  initModelTabsSwiper02();
  initModelTabsSwiper03();
  initAccordion();
  initSequentialVideoPlayer();
});


window.addEventListener('scroll', function () {
  syncMobileTabActiveByScroll();
});

// ===== Tabs Component =====
function initTabsComponent() {
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    const container = tabs.closest('.tabs-component') || tabs.parentNode;
    const tabButtons = tabs.querySelectorAll('.tabs__tab');
    const tabPanels = Array.from(container.querySelectorAll('.tabs__panel'));
    tabs.addEventListener('click', function (e) {
      if (e.target.classList.contains('tabs__tab')) {
        const selectedId = e.target.id;
        tabButtons.forEach(btn => {
          const isActive = btn.id === selectedId;
          btn.classList.toggle('tabs__tab--active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        tabPanels.forEach(panel => {
          const isActive = panel.getAttribute('aria-labelledby') === selectedId;
          panel.classList.toggle('tabs__panel--active', isActive);
          panel.hidden = !isActive;
        });
        if (window.innerWidth <= 767) {
          const tabsContainer = tabs;
          const tabElement = e.target;
          const containerRect = tabsContainer.getBoundingClientRect();
          const tabRect = tabElement.getBoundingClientRect();
          const scrollLeft = tabRect.left - containerRect.left - 20;
          tabsContainer.scrollTo({ left: tabsContainer.scrollLeft + scrollLeft, behavior: 'smooth' });
        }
      }
    });
  });
}
// resources 탭 내 게시글 접속 시 뒤로가기 해도 탭 활성화 유지 + 모바일 자동 스크롤
(function () {
  const TAB_KEY = 'resourcesTabActive';
  const tabPrefix = 'tab-';
  const tabGroupSelector = '.js-tab-group .tabs__tab';
  const panelGroupSelector = '.js-tab-group .tabs__panel';

  function getTabNameById(tabId) {
    switch (tabId) {
      case 'tab-1': return 'all';
      case 'tab-2': return 'whatsnew';
      case 'tab-3': return 'modelcard';
      case 'tab-4': return 'techreport';
      case 'tab-5': return 'publications';
      default: return 'all';
    }
  }
  function getTabIdByName(tabName) {
    switch (tabName) {
      case 'all': return 'tab-1';
      case 'whatsnew': return 'tab-2';
      case 'modelcard': return 'tab-3';
      case 'techreport': return 'tab-4';
      case 'publications': return 'tab-5';
      default: return 'tab-1';
    }
  }

  function activateTab(tabId, scrollToTab = false) {
    const tabBtns = document.querySelectorAll(tabGroupSelector);
    const tabPanels = document.querySelectorAll(panelGroupSelector);
    tabBtns.forEach(btn => {
      const isActive = btn.id === tabId;
      btn.classList.toggle('tabs__tab--active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      // 모바일: 활성화된 탭 자동 스크롤
      if (isActive && scrollToTab && window.innerWidth <= 767) {
        const tabsContainer = btn.parentNode;
        const containerRect = tabsContainer.getBoundingClientRect();
        const tabRect = btn.getBoundingClientRect();
        const scrollLeft = tabRect.left - containerRect.left - 20; // 1.25rem = 20px
        tabsContainer.scrollTo({
          left: tabsContainer.scrollLeft + scrollLeft,
          behavior: 'smooth'
        });
      }
    });
    tabPanels.forEach(panel => {
      const isActive = panel.getAttribute('aria-labelledby') === tabId;
      panel.classList.toggle('tabs__panel--active', isActive);
      panel.hidden = !isActive;
    });
  }

  function saveTab(tabId) {
    localStorage.setItem(TAB_KEY, tabId);
  }
  function getSavedTab() {
    return localStorage.getItem(TAB_KEY);
  }

  function setHash(tabId) {
    const tabName = getTabNameById(tabId);
    if (location.hash !== '#' + tabName) {
      history.replaceState(null, '', '#' + tabName);
    }
  }
  function getTabIdFromHash() {
    const hash = location.hash.replace('#', '');
    if (!hash) return null;
    return getTabIdByName(hash);
  }

  function handleTabClick(e) {
    if (!e.target.classList.contains('tabs__tab')) return;
    const tabId = e.target.id;
    setHash(tabId);
    saveTab(tabId);
    // 모바일: 클릭 시 자동 스크롤
    if (window.innerWidth <= 767) {
      activateTab(tabId, true);
    }
  }

  function handleHashChange() {
    const tabId = getTabIdFromHash();
    if (tabId) {
      // 뒤로가기/앞으로가기 시 해시 변경 시에도 모바일 자동 스크롤
      activateTab(tabId, window.innerWidth <= 767);
      saveTab(tabId);
    }
  }

  // 초기 진입 시: 해시 → localStorage → 기본값 순으로 탭 활성화
  document.addEventListener('DOMContentLoaded', function () {
    const tabIdFromHash = getTabIdFromHash();
    const tabIdFromStorage = getSavedTab();
    let tabIdToActivate = tabIdFromHash || tabIdFromStorage || 'tab-1';
    // 모바일: 진입 시 자동 스크롤
    activateTab(tabIdToActivate, window.innerWidth <= 767);
    setHash(tabIdToActivate);
    // 탭 클릭 시 해시/스토리지 동기화
    const tabBtns = document.querySelectorAll(tabGroupSelector);
    tabBtns.forEach(btn => {
      btn.addEventListener('click', handleTabClick);
    });
  });
  // 뒤로가기/앞으로가기 시 해시 변경 감지
  window.addEventListener('hashchange', handleHashChange);
})();






// ===== Double Inner Tabs (버튼/컨텐츠 분리형) =====
function initDoubleInnerTabs01() {
  document.querySelectorAll('.inner-tabs-container').forEach(function (container) {
    // 컨테이너 바로 다음에 오는 double-inner-tab-content-wrapper를 찾음
    var contentWrapper = container.nextElementSibling;
    if (!contentWrapper || !contentWrapper.classList.contains('double-inner-tab-content-wrapper')) return;
    var triggers = Array.from(container.querySelectorAll('.inner-tab-trigger'));
    var tabPanels = Array.from(contentWrapper.querySelectorAll('.flex.example-double'));
    var count = Math.min(triggers.length, tabPanels.length);

    // fadeOut, fadeIn 유틸 함수 (initInnerTabs와 동일)
    function fadeOut(element, callback) {
      element.style.opacity = '0';
      setTimeout(function () {
        element.style.position = 'absolute';
        element.style.visibility = 'hidden';
        element.style.zIndex = '-1';
        if (callback) callback();
      }, 300);
    }
    function fadeIn(element) {
      element.style.position = 'relative';
      element.style.visibility = 'visible';
      element.style.zIndex = '1';
      setTimeout(function () { element.style.opacity = '1'; }, 20);
    }

    // 초기화: 모든 패널 숨기고 첫 번째만 보이게
    tabPanels.forEach(function (panel, idx) {
      panel.style.transition = 'opacity 0.4s ease-in-out';
      if (idx !== 0) {
        panel.style.opacity = '0';
        panel.style.position = 'absolute';
        panel.style.visibility = 'hidden';
        panel.style.zIndex = '-1';
        panel.classList.remove('active');
      } else {
        panel.style.opacity = '1';
        panel.style.position = 'relative';
        panel.style.visibility = 'visible';
        panel.style.zIndex = '1';
        panel.classList.add('active');
      }
    });
    triggers.forEach(function (trigger, idx) {
      if (idx === 0) {
        trigger.classList.add('active');
      } else {
        trigger.classList.remove('active');
      }
    });

    // 기존 이벤트 제거 (중복 방지)
    triggers.forEach(function (trigger, i) {
      var newTrigger = trigger.cloneNode(true);
      trigger.parentNode.replaceChild(newTrigger, trigger);
      triggers[i] = newTrigger;
    });

    // 이벤트 바인딩 (그룹 내에서만 동작)
    triggers.slice(0, count).forEach(function (trigger, idx) {
      trigger.addEventListener('click', function () {
        if (trigger.classList.contains('active')) return;
        var currentActiveTrigger = container.querySelector('.inner-tab-trigger.active');
        var currentActivePanel = contentWrapper.querySelector('.flex.example-double.active');
        if (currentActiveTrigger) currentActiveTrigger.classList.remove('active');
        trigger.classList.add('active');
        var newPanel = tabPanels[idx];
        if (currentActivePanel && newPanel) {
          fadeOut(currentActivePanel, function () {
            currentActivePanel.classList.remove('active');
            newPanel.classList.add('active');
            fadeIn(newPanel);
          });
        }
      });
    });
  });
}
// ===== Double Inner Tabs (버튼/컨텐츠 분리형) =====
function initDoubleInnerTabs02() {
  document.querySelectorAll('.inner-tabs-container').forEach(function (container) {
    // 컨테이너 바로 다음에 오는 double-inner-tab-content-wrapper를 찾음
    var contentWrapper = container.nextElementSibling;
    if (!contentWrapper || !contentWrapper.classList.contains('double-inner-tab-content-wrapper')) return;
    var triggers = Array.from(container.querySelectorAll('.inner-tab-trigger'));
    var tabPanels = Array.from(contentWrapper.querySelectorAll('.flex.example-double'));
    var count = Math.min(triggers.length, tabPanels.length);

    // fadeOut, fadeIn 유틸 함수 (initInnerTabs와 동일)
    function fadeOut(element, callback) {
      element.style.opacity = '0';
      setTimeout(function () {
        element.style.position = 'absolute';
        element.style.visibility = 'hidden';
        element.style.zIndex = '-1';
        if (callback) callback();
      }, 300);
    }
    function fadeIn(element) {
      element.style.position = 'relative';
      element.style.visibility = 'visible';
      element.style.zIndex = '1';
      setTimeout(function () { element.style.opacity = '1'; }, 20);
    }

    // 초기화: 모든 패널 숨기고 첫 번째만 보이게
    tabPanels.forEach(function (panel, idx) {
      panel.style.transition = 'opacity 0.4s ease-in-out';
      if (idx !== 0) {
        panel.style.opacity = '0';
        panel.style.position = 'absolute';
        panel.style.visibility = 'hidden';
        panel.style.zIndex = '-1';
        panel.classList.remove('active');
      } else {
        panel.style.opacity = '1';
        panel.style.position = 'relative';
        panel.style.visibility = 'visible';
        panel.style.zIndex = '1';
        panel.classList.add('active');
      }
    });
    triggers.forEach(function (trigger, idx) {
      if (idx === 0) {
        trigger.classList.add('active');
      } else {
        trigger.classList.remove('active');
      }
    });

    // 기존 이벤트 제거 (중복 방지)
    triggers.forEach(function (trigger, i) {
      var newTrigger = trigger.cloneNode(true);
      trigger.parentNode.replaceChild(newTrigger, trigger);
      triggers[i] = newTrigger;
    });

    // 이벤트 바인딩 (그룹 내에서만 동작)
    triggers.slice(0, count).forEach(function (trigger, idx) {
      trigger.addEventListener('click', function () {
        if (trigger.classList.contains('active')) return;
        var currentActiveTrigger = container.querySelector('.inner-tab-trigger.active');
        var currentActivePanel = contentWrapper.querySelector('.flex.example-double.active');
        if (currentActiveTrigger) currentActiveTrigger.classList.remove('active');
        trigger.classList.add('active');
        var newPanel = tabPanels[idx];
        if (currentActivePanel && newPanel) {
          fadeOut(currentActivePanel, function () {
            currentActivePanel.classList.remove('active');
            newPanel.classList.add('active');
            fadeIn(newPanel);
          });
        }
      });
    });
  });
}





// ===== Model Tabs Swiper (Mobile) 두번째 =====
let mobileTabSwiper02 = null;
function initModelTabsSwiper02() {
  const modelTabs = document.querySelector('.mobile-model-tabs.modeltabs02');
  if (!modelTabs) return;
  if (window.innerWidth < 768) {
    if (!mobileTabSwiper02) {
      mobileTabSwiper02 = new Swiper('.mobile-model-tabs.modeltabs02', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        // centeredSlides: true,
        speed: 500,
        effect: 'slide',
        on: {
          slideChange: function () { syncMobileTabContent02(this.activeIndex); },
          tap: function (swiper, e) {
            const clickedIdx = swiper.clickedIndex;
            if (typeof clickedIdx === 'number' && clickedIdx !== swiper.activeIndex) {
              swiper.slideTo(clickedIdx);
            }
            syncMobileTabContent02(swiper.activeIndex);
          }
        }
      });
      assignMobileTabIndexes02();
      syncMobileTabContent02(mobileTabSwiper02.activeIndex || 0);
    }
    document.querySelectorAll('.mobile-model-tabs.modeltabs02 .inner-tab-trigger').forEach(trigger => { trigger.onclick = null; });
  } else {
    if (mobileTabSwiper02) {
      mobileTabSwiper02.destroy();
      mobileTabSwiper02 = null;
    }
  }
}
function assignMobileTabIndexes02() {
  const triggers02 = document.querySelectorAll('.mobile-model-tabs.modeltabs02 .inner-tab-trigger');
  const contents02 = document.querySelectorAll('.inner-tabs-wrapper02 .flex.example-double');
  triggers02.forEach((el, idx) => { el.setAttribute('data-index', idx); });
  contents02.forEach((el, idx) => { el.setAttribute('data-index', idx); });
}
function syncMobileTabContent02(activeIdx) {
  if (window.innerWidth >= 768) return;
  const triggers02 = document.querySelectorAll('.mobile-model-tabs.modeltabs02 .inner-tab-trigger');
  const contents02 = document.querySelectorAll('.inner-tabs-wrapper02 .flex.example-double');
  triggers02.forEach((el, idx) => {
    const tIdx = el.getAttribute('data-index');
    if (parseInt(tIdx) === activeIdx) {
      el.classList.add('active');
      el.style.opacity = '1';
      el.style.transition = 'opacity';
    } else {
      el.classList.remove('active');
      el.style.opacity = '0.6';
      el.style.transition = 'opacity';
    }
  });
  contents02.forEach((el, idx) => {
    const cIdx = el.getAttribute('data-index');
    if (parseInt(cIdx) === activeIdx) {
      el.classList.add('active');
      el.style.opacity = '1';
      el.style.transition = 'opacity';
      el.style.visibility = 'visible';
      el.style.zIndex = '1';
      el.style.position = 'relative';
    } else {
      el.classList.remove('active');
      el.style.opacity = '0';
      el.style.transition = 'opacity';
      el.style.visibility = 'hidden';
      el.style.zIndex = '-1';
      el.style.position = 'absolute';
    }
  });
}

// ===== Model Tabs Swiper (Mobile) 세번째 =====
let mobileTabSwiper03 = null;
function initModelTabsSwiper03() {
  const modelTabs = document.querySelector('.mobile-model-tabs.modeltabs03');
  if (!modelTabs) return;
  if (window.innerWidth < 768) {
    if (!mobileTabSwiper03) {
      mobileTabSwiper03 = new Swiper('.mobile-model-tabs.modeltabs03', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        // centeredSlides: true,
        speed: 500,
        effect: 'slide',
        on: {
          slideChange: function () { syncMobileTabContent03(this.activeIndex); },
          tap: function (swiper, e) {
            const clickedIdx = swiper.clickedIndex;
            if (typeof clickedIdx === 'number' && clickedIdx !== swiper.activeIndex) {
              swiper.slideTo(clickedIdx);
            }
            syncMobileTabContent03(swiper.activeIndex);
          }
        }
      });
      assignMobileTabIndexes03();
      syncMobileTabContent03(mobileTabSwiper03.activeIndex || 0);
    }
    document.querySelectorAll('.mobile-model-tabs.modeltabs03 .inner-tab-trigger').forEach(trigger => { trigger.onclick = null; });
  } else {
    if (mobileTabSwiper03) {
      mobileTabSwiper03.destroy();
      mobileTabSwiper03 = null;
    }
  }
}
function assignMobileTabIndexes03() {
  const triggers03 = document.querySelectorAll('.mobile-model-tabs.modeltabs03 .inner-tab-trigger');
  const contents03 = document.querySelectorAll('.inner-tabs-wrapper03 .flex.example-double');
  triggers03.forEach((el, idx) => { el.setAttribute('data-index', idx); });
  contents03.forEach((el, idx) => { el.setAttribute('data-index', idx); });
}
function syncMobileTabContent03(activeIdx) {
  if (window.innerWidth >= 768) return;
  const triggers03 = document.querySelectorAll('.mobile-model-tabs.modeltabs03 .inner-tab-trigger');
  const contents03 = document.querySelectorAll('.inner-tabs-wrapper03 .flex.example-double');
  triggers03.forEach((el, idx) => {
    const tIdx = el.getAttribute('data-index');
    if (parseInt(tIdx) === activeIdx) {
      el.classList.add('active');
      el.style.opacity = '1';
      el.style.transition = 'opacity';
    } else {
      el.classList.remove('active');
      el.style.opacity = '0.6';
      el.style.transition = 'opacity';
    }
  });
  contents03.forEach((el, idx) => {
    const cIdx = el.getAttribute('data-index');
    if (parseInt(cIdx) === activeIdx) {
      el.classList.add('active');
      el.style.opacity = '1';
      el.style.transition = 'opacity';
      el.style.visibility = 'visible';
      el.style.zIndex = '1';
      el.style.position = 'relative';
    } else {
      el.classList.remove('active');
      el.style.opacity = '0';
      el.style.transition = 'opacity';
      el.style.visibility = 'hidden';
      el.style.zIndex = '-1';
      el.style.position = 'absolute';
    }
  });
}




// ===== Inner Tab Click (PC/모바일) =====
function initInnerTabClick01() {
  const triggers = document.querySelectorAll('.inner-tabs-wrapper01 .example-side-txts.top-tab-txts .inner-tab-trigger');
  const contents = document.querySelectorAll('.inner-tabs-wrapper01 .example-side-item .inner-tab-content');
  if (window.innerWidth >= 768) {
    triggers.forEach((trigger, idx) => {
      trigger.onclick = function () {
        triggers.forEach((el, i) => {
          el.classList.toggle('active', i === idx);
          if (contents[i]) contents[i].classList.toggle('active', i === idx);
        });
      };
    });
  } else {
    triggers.forEach((trigger, idx) => {
      trigger.onclick = function () {
        triggers.forEach((el, i) => {
          el.classList.toggle('active', i === idx);
          if (contents[i]) contents[i].classList.toggle('active', i === idx);
        });
        const anchor = document.querySelectorAll('.tabs__panel__anchor')[idx];
        if (anchor) {
          const headerHeight = 50;
          const rect = anchor.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetPosition = scrollTop + rect.top - headerHeight - 30;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      };
    });
  }
}
// ===== Inner Tab Click (PC/모바일) =====
function initInnerTabClick02() {
  const triggers = document.querySelectorAll('.inner-tabs-wrapper02 .example-side-txts.top-tab-txts .inner-tab-trigger');
  const contents = document.querySelectorAll('.inner-tabs-wrapper02 .example-side-item .inner-tab-content');
  if (window.innerWidth >= 768) {
    triggers.forEach((trigger, idx) => {
      trigger.onclick = function () {
        triggers.forEach((el, i) => {
          el.classList.toggle('active', i === idx);
          if (contents[i]) contents[i].classList.toggle('active', i === idx);
        });
      };
    });
  } else {
    triggers.forEach((trigger, idx) => {
      trigger.onclick = function () {
        triggers.forEach((el, i) => {
          el.classList.toggle('active', i === idx);
          if (contents[i]) contents[i].classList.toggle('active', i === idx);
        });
        const anchor = document.querySelectorAll('.tabs__panel__anchor')[idx];
        if (anchor) {
          const headerHeight = 50;
          const rect = anchor.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetPosition = scrollTop + rect.top - headerHeight - 30;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      };
    });
  }
}
// ===== Inner Tab Click (PC/모바일) =====
function initInnerTabClick03() {
  const triggers = document.querySelectorAll('.inner-tabs-wrapper03 .example-side-txts.top-tab-txts .inner-tab-trigger');
  const contents = document.querySelectorAll('.inner-tabs-wrapper03 .example-side-item .inner-tab-content');
  if (window.innerWidth >= 768) {
    triggers.forEach((trigger, idx) => {
      trigger.onclick = function () {
        triggers.forEach((el, i) => {
          el.classList.toggle('active', i === idx);
          if (contents[i]) contents[i].classList.toggle('active', i === idx);
        });
      };
    });
  } else {
    triggers.forEach((trigger, idx) => {
      trigger.onclick = function () {
        triggers.forEach((el, i) => {
          el.classList.toggle('active', i === idx);
          if (contents[i]) contents[i].classList.toggle('active', i === idx);
        });
        const anchor = document.querySelectorAll('.tabs__panel__anchor')[idx];
        if (anchor) {
          const headerHeight = 50;
          const rect = anchor.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetPosition = scrollTop + rect.top - headerHeight - 30;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      };
    });
  }
}

// ===== 아코디언 =====
function initAccordion() {
  function closeAllAccordionItems(container, exceptItem) {
    container.querySelectorAll('.kt-accordion__item').forEach(function (item) {
      if (item !== exceptItem) {
        item.classList.remove('active');
        const panel = item.querySelector('.kt-accordion__panel');
        panel.style.maxHeight = null;
      }
    });
  }
  document.querySelectorAll('.kt-accordion').forEach(function (accordion) {
    accordion.querySelectorAll('.kt-accordion__header').forEach(function (header) {
      header.addEventListener('click', function () {
        const item = header.closest('.kt-accordion__item');
        const panel = item.querySelector('.kt-accordion__panel');
        const isActive = item.classList.contains('active');
        if (!isActive) {
          closeAllAccordionItems(accordion, item);
          item.classList.add('active');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          panel.style.maxHeight = null;
        }
      });
    });
    accordion.querySelectorAll('.kt-accordion__item.active .kt-accordion__panel').forEach(function (panel) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  });
}

// ===== Sticky Header =====
function initStickyHeader() {
  const stickyHeader = document.querySelector('.tab-sticky-header');
  const tabsComponent = document.querySelector('.tabs-component');
  if (!stickyHeader || !tabsComponent) return;
  let forceShowStickyHeader = false;
  let isScrolling = false;
  function checkScroll() {
    const tabsRect = tabsComponent.getBoundingClientRect();
    const headerHeight = document.querySelector('#main-header').offsetHeight;
    const inRange = tabsRect.top <= headerHeight && tabsRect.bottom > headerHeight;
    const blackStyleSections = document.querySelectorAll('.bg-black-style');
    blackStyleSections.forEach(section => {
      const sectionRect = section.getBoundingClientRect();
      const isInBlackStyle = sectionRect.top <= headerHeight && sectionRect.bottom > headerHeight;
      if (isInBlackStyle) {
        stickyHeader.classList.add('black-style');
        return;
      }
    });
    if (!Array.from(blackStyleSections).some(section => {
      const sectionRect = section.getBoundingClientRect();
      return sectionRect.top <= headerHeight && sectionRect.bottom > headerHeight;
    })) {
      stickyHeader.classList.remove('black-style');
    }
    const firstLi = stickyHeader.querySelector('.sticky-header-list li:first-child');
    if (firstLi && firstLi.classList.contains('active')) {
      if (inRange || forceShowStickyHeader) {
        stickyHeader.classList.add('show');
      } else {
        stickyHeader.classList.remove('show');
      }
      return;
    }
    if (inRange) {
      stickyHeader.classList.add('show');
    } else {
      stickyHeader.classList.remove('show');
    }
  }
  function updateActiveItem() {
    if (isScrolling) return;
    const sections = Array.from(document.querySelectorAll('.tabs__panel__anchor'));
    const isPC = window.innerWidth >= 768;
    const headerHeight = isPC ? (document.querySelector('#main-header')?.offsetHeight || 0) : 50;
    const stickyItems = stickyHeader.querySelectorAll('.tab-sticky-header .sticky-header-list li');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= headerHeight && rect.bottom >= headerHeight) {
        const sectionId = section.id;
        stickyItems.forEach(item => {
          if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', checkScroll);
  window.addEventListener('scroll', updateActiveItem);
  checkScroll();
  const stickyItems = stickyHeader.querySelectorAll('.tab-sticky-header .sticky-header-list li');
  stickyItems.forEach((item, index) => {
    item.addEventListener('click', function () {
      const targetId = this.getAttribute('data-section');
      const targetSection = document.getElementById(targetId);
      const isPC = window.innerWidth >= 768;
      let headerHeight = isPC ? (document.querySelector('#main-header')?.offsetHeight || 0) : 50;
      if (targetSection) {
        isScrolling = true;
        const targetRect = targetSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = scrollTop + targetRect.top - headerHeight;
        if (index === 0) {
          forceShowStickyHeader = true;
          stickyHeader.classList.add('show');
          window.scrollTo({ top: targetPosition + 2, behavior: 'smooth' });
          setTimeout(() => { forceShowStickyHeader = false; checkScroll(); }, 800);
        } else {
          window.scrollTo({ top: targetPosition + 3, behavior: 'smooth' });
        }
        const tabButton = document.querySelector(`[aria-labelledby="${targetId}"]`);
        if (tabButton) tabButton.click();
        stickyItems.forEach(li => li.classList.remove('active'));
        this.classList.add('active');
        setTimeout(() => { isScrolling = false; }, 1000);
      }
    });
  });
}

// ===== 모바일 탭 active 동기화 (스크롤) =====
function syncMobileTabActiveByScroll() {
  if (window.innerWidth >= 768) return;
  const triggers = document.querySelectorAll('.mobile-model-tabs .inner-tab-trigger');
  const contents = document.querySelectorAll('.example-side-item .inner-tab-content');
  const header = document.querySelector('#main-header');
  const headerHeight = header ? header.offsetHeight : 0;
  const viewportHeight = window.innerHeight;
  let foundIdx = -1;
  contents.forEach((content, idx) => {
    const rect = content.getBoundingClientRect();
    const visibleTop = Math.max(rect.top, headerHeight);
    const visibleBottom = Math.min(rect.bottom, viewportHeight);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const contentHeight = rect.height;
    if (contentHeight > 0 && visibleHeight / contentHeight > 0.4 && foundIdx === -1) {
      foundIdx = idx;
    }
  });
  triggers.forEach((el) => el.classList.remove('active'));
  if (foundIdx !== -1) {
    triggers[foundIdx].classList.add('active');
  }
}

// ===== K Model 순차 영상 자동재생 =====
function initSequentialVideoPlayer() {
  const container = document.getElementById('video-play-trigger-01');
  if (!container) return;
  const wrappers = Array.from(container.querySelectorAll('.auto-video-wrapper'));
  const videos = wrappers.map(w => w.querySelector('video'));
  wrappers.forEach(showImage);
  function showVideo(wrapper) {
    const img = wrapper.querySelector('img');
    const videoWrap = wrapper.querySelector('.video-play-wrapper');
    if (img) img.style.opacity = 0;
    if (videoWrap) videoWrap.style.opacity = 1;
  }
  function showImage(wrapper) {
    const img = wrapper.querySelector('img');
    const videoWrap = wrapper.querySelector('.video-play-wrapper');
    if (img) img.style.opacity = 1;
    if (videoWrap) videoWrap.style.opacity = 0;
  }
  function SequentialVideoPlayer(container) {
    this.container = container;
    this.wrappers = Array.from(container.querySelectorAll('.auto-video-wrapper'));
    this.videos = this.wrappers.map(w => w.querySelector('video'));
    this.currentIdx = 0;
    this.isPlaying = false;
    this.loop = true;
    this._onEnded = this._onEnded.bind(this);
  }
  SequentialVideoPlayer.prototype.play = function () {
    if (this.isPlaying || this.wrappers.length === 0) return;
    this.isPlaying = true;
    this.currentIdx = 0;
    this._playCurrent();
  };
  SequentialVideoPlayer.prototype._playCurrent = function () {
    this.wrappers.forEach(showImage);
    const wrapper = this.wrappers[this.currentIdx];
    const video = this.videos[this.currentIdx];
    showVideo(wrapper);
    video.currentTime = 0;
    video.loop = false;
    video.removeEventListener('ended', this._onEnded);
    video.addEventListener('ended', this._onEnded);
    video.play().catch(() => { });
  };
  SequentialVideoPlayer.prototype._onEnded = function () {
    showImage(this.wrappers[this.currentIdx]);
    this.currentIdx++;
    if (this.currentIdx >= this.videos.length) {
      if (this.loop) {
        this.currentIdx = 0;
      } else {
        this.isPlaying = false;
        return;
      }
    }
    this._playCurrent();
  };
  SequentialVideoPlayer.prototype.stop = function () {
    this.isPlaying = false;
    this.videos.forEach((video, idx) => {
      video.pause();
      video.currentTime = 0;
      showImage(this.wrappers[idx]);
      video.removeEventListener('ended', this._onEnded);
    });
  };
  function playAllVideos(wrappers, videos) {
    wrappers.forEach(showVideo);
    videos.forEach(video => {
      video.loop = true;
      video.currentTime = 0;
      video.play().catch(() => { });
    });
  }
  function stopAllVideos(wrappers, videos) {
    videos.forEach((video, idx) => {
      video.pause();
      video.currentTime = 0;
      showImage(wrappers[idx]);
    });
  }
  function isMobile() { return window.innerWidth <= 767; }
  let observer;
  let aosIn = false;
  function handleEnter() {
    if (isMobile()) {
      playAllVideos(wrappers, videos);
      aosIn = true;
    } else {
      player.play();
    }
  }
  function handleLeave() {
    if (isMobile()) {
      stopAllVideos(wrappers, videos);
      aosIn = false;
    } else {
      player.stop();
    }
  }
  const player = new SequentialVideoPlayer(container);
  observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          handleEnter();
        } else {
          handleLeave();
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(container);
  window.addEventListener('resize', function () {
    if (isMobile()) {
      if (aosIn) {
        playAllVideos(wrappers, videos);
      } else {
        stopAllVideos(wrappers, videos);
      }
    } else {
      stopAllVideos(wrappers, videos);
      player.stop();
    }
  });
}
// ====== // K Model 순차 영상 자동재생 ======

// ===== exam-items 스크롤 감지 및 hasScroll 클래스 추가 =====
function checkExamItemsScroll() {
  var examItemsList = document.querySelectorAll('.exam-items.ex-items');
  var maxHeightPx = 20 * 16; // 20rem = 320px
  examItemsList.forEach(function (examItems) {
    var parent = examItems.closest('.example-content');
    if (!parent) return;
    var contentHeight = examItems.scrollHeight;
    // 기존 스크롤 이벤트 제거 (중복 방지)
    if (examItems.__scrollHandler) {
      examItems.removeEventListener('scroll', examItems.__scrollHandler);
      examItems.__scrollHandler = null;
    }
    if (contentHeight > maxHeightPx) {
      parent.classList.add('hasScroll');
      // 스크롤 이벤트 바인딩
      var scrollHandler = function () {
        var bgBlackParent = parent.closest('.bg-black-style');
        if (!bgBlackParent) return;
        // 맨 아래 도달 시 hasScroll 제거, 아니면 추가
        if (examItems.scrollTop + examItems.clientHeight >= examItems.scrollHeight - 2) {
          if (parent.classList.contains('hasScroll')) {
            parent.classList.remove('hasScroll');
          }
        } else {
          if (!parent.classList.contains('hasScroll')) {
            parent.classList.add('hasScroll');
          }
        }
      };
      examItems.addEventListener('scroll', scrollHandler);
      examItems.__scrollHandler = scrollHandler;
    } else {
      parent.classList.remove('hasScroll');
    }
  });
}

// ===== ex-taps-01 탭 연동 스크립트 =====
document.addEventListener('DOMContentLoaded', function () {
  var tabList = document.querySelectorAll('.pc-only .ex-taps-01 dl');
  var titleContents = document.querySelectorAll('.cont-title-wrap .ex-content');
  var bodyContents = document.querySelectorAll('.ex-txt-wrapper .ex-content-txts');

  if (tabList.length && titleContents.length && bodyContents.length) {
    tabList.forEach(function (tab, idx) {
      tab.addEventListener('click', function () {
        // 탭 활성화
        tabList.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        // 제목 영역 active 클래스 토글
        titleContents.forEach(function (tc, i) {
          tc.classList.toggle('active', i === idx);
        });
        // 본문 영역 active 클래스 토글
        bodyContents.forEach(function (bc, i) {
          bc.classList.toggle('active', i === idx);
        });
        // exam-items 스크롤 상태 갱신
        checkExamItemsScroll();
      });
    });
    // 초기화: 첫번째 탭만 보이게
    tabList.forEach(function (t, i) { t.classList.toggle('active', i === 0); });
    titleContents.forEach(function (tc, i) { tc.classList.toggle('active', i === 0); });
    bodyContents.forEach(function (bc, i) { bc.classList.toggle('active', i === 0); });
    // 초기화 시에도 스크롤 상태 갱신
    checkExamItemsScroll();
  }
});

// ===== 모바일 ex-taps-01 Swiper 연동 스크립트 (별도) =====
document.addEventListener('DOMContentLoaded', function () {
  var swiperEl = document.querySelector('.moTab-swiper-wrapper .modeltabs01');
  if (!swiperEl) return;
  var tabList = swiperEl.querySelectorAll('.modeltabs01 .ex-taps-01 dl');
  var titleContents = document.querySelectorAll('.cont-title-wrap .ex-content');
  var bodyContents = document.querySelectorAll('.ex-txt-wrapper .ex-content-txts');

  // Swiper 인스턴스 생성 (중복 방지)
  if (!window.__modelTabs01Swiper) {
    var swiper = new Swiper(swiperEl, {
      slidesPerView: 'auto',
      spaceBetween: 12,
      // centeredSlides: true,
      speed: 500,
      effect: 'slide',
      on: {
        slideChange: function () {
          var idx = swiper.activeIndex;
          // 탭 활성화
          tabList.forEach(function (t, i) { t.classList.toggle('active', i === idx); });
          // 제목 영역 active 클래스 토글
          titleContents.forEach(function (tc, i) { tc.classList.toggle('active', i === idx); });
          // 본문 영역 active 클래스 토글
          bodyContents.forEach(function (bc, i) { bc.classList.toggle('active', i === idx); });
          // exam-items 스크롤 상태 갱신
          checkExamItemsScroll();
        }
      }
    });
    window.__modelTabs01Swiper = swiper;
  } else {
    var swiper = window.__modelTabs01Swiper;
  }

  // dl 클릭 이벤트 제거 (오직 스와이프만 동작)
  tabList.forEach(function (tab) {
    tab.onclick = null;
    tab.removeEventListener && tab.removeEventListener('click', Function.prototype);
  });

  // 초기화: 첫번째 탭만 보이게
  tabList.forEach(function (t, i) { t.classList.toggle('active', i === 0); });
  titleContents.forEach(function (tc, i) { tc.classList.toggle('active', i === 0); });
  bodyContents.forEach(function (bc, i) { bc.classList.toggle('active', i === 0); });
  // 초기화 시에도 스크롤 상태 갱신
  checkExamItemsScroll();
});

