'use strict';
(function() {
    window.mvno = window.mvno || {};
    const modules = {};
    /* 20240906 FilterTabModule 전체 수정 */
    const FilterTabModule = (function() {
        function FilterTabModule(tabElement) {
            const self = this;
            this.tabElement = document.querySelector(tabElement);
            this.tabWrapElement = this.tabElement.querySelector('.mvno-filter-tab-wrap');
            this.tabTabContainerElement = this.tabElement.querySelector('.mvno-filter-ac-tab-container');
            this.tabParentElement = this.tabElement.querySelector('.mvno-filter-ac-tab');
            this.tabItemElement = this.tabTabContainerElement.querySelectorAll('.mvno-filter-ac-tab-item');
            this.popupContent = document.querySelector('[data-layer-scroll-js="filter-tab"]');
            this.filterCloseElement = this.tabElement.querySelector('.mvno-popup-filter-close');
            this.filterHeaderElement = this.tabElement.querySelector('.mvno-popup-filter-header');
            this.isScrolling = false;
            this.sections = [];
            this.handleScrollBound = this.handleScroll.bind(this);
            this.isReset = false;
            this.initSections();
            this.initSwiper();
            this.initEvents();
            mvno.LayerExtend.init('#popupDefaultNew');
            this.filterCloseElement.addEventListener('click', function() {
                self.destroy();
            });
            this.tabItemElement.forEach(function(item) {
                item.addEventListener('click', function(e) {
                    if (self.isScrolling) return;
                    self.handleLinkClick(this);
                    e.preventDefault();
                });
            });
        }
        FilterTabModule.prototype.destroy = function() {
            const self = this;
            this.tabWrapElement.classList.remove('active');
            this.filterHeaderElement.classList.remove('active');
            this.popupContent.scrollTop = 0;
            if (this.tabSwiper) {
                this.tabSwiper.update();
            }
            this.updateTabItemClass();
            setTimeout(function() {
                self.tabSwiper.setTranslate(0);
                $(this.tabParentElement).css({
                    "transition-duration": "0ms"
                });
            }, 500);
            this.popupContent.removeEventListener('scroll', this.handleScrollBound);
            window.removeEventListener('resize', this.handleScrollBound);
            this.isScrolling = false;
        };
        FilterTabModule.prototype.initEvents = function() {
            this.popupContent.addEventListener('scroll', this.handleScrollBound);
            window.addEventListener('resize', this.handleScrollBound);
            $(document).on('touchstart', 'button', function(e) {
                $(this).addClass('press');
            });
            $(document).on('touchend', 'button', function(e) {
                $(this).removeClass('press');
            });
        };
        FilterTabModule.prototype.initSwiper = function() {
            const self = this;
            if (!this.tabSwiper) {
                this.tabSwiper = new Swiper(this.tabTabContainerElement, {
                    slidesPerView: 'auto',
                    preventClicks: true,
                    observer: true,
                    observeParents: true,
                    freeMode: true,
                });
                var $snbSwiperItem = $('.mvno-filter-ac-tab-container .mvno-filter-ac-tab .mvno-filter-ac-tab-item');
                $snbSwiperItem.click(function(e) {
                    var target = $(this);
                    if (!this.classList.contains('on')) {
                        $snbSwiperItem.removeClass('on');
                        target.addClass('on');
                        muCenter(target);
                        e.preventDefault();
                    }
                });

                function muCenter(target) {
                    var snbwrap = $('.mvno-filter-ac-tab-container .mvno-filter-ac-tab');
                    var targetPos = target.position();
                    var box = $('.mvno-filter-ac-tab-container');
                    var boxHarf = box.width() / 2;
                    var pos;
                    var listWidth = 0;
                    snbwrap.find('.mvno-filter-ac-tab-item').each(function() {
                        listWidth += $(this).outerWidth();
                    })
                    var selectTargetPos = targetPos.left + target.outerWidth() / 2;
                    if (selectTargetPos - 2 <= boxHarf) {
                        pos = 0;
                    } else if ((listWidth - selectTargetPos - 2) <= boxHarf) { //right
                        pos = listWidth - box.width();
                    } else {
                        pos = (selectTargetPos - 2) - boxHarf;
                    }
                    if (listWidth > box.width()) {
                        self.tabSwiper.setTransition(500);
                        self.tabSwiper.setTranslate(pos * -1);
                        // Swiper의 슬라이드 상태를 업데이트
                        self.tabSwiper.updateProgress();
                        self.tabSwiper.updateSlidesClasses();
                    }
                }
            } else {
                try {
                    this.tabSwiper.update();
                } catch (error) {
                    this.tabSwiper.destroy(true, true);
                    this.initSwiper();
                }
            }
        };
        FilterTabModule.prototype.initSections = function() {
            const self = this;
            this.tabItemElement.forEach(function(item) {
                const itemID = item.getAttribute('href');
                const itemElement = document.querySelector(itemID);
                self.sections.push({
                    id: itemID,
                    element: itemElement,
                    item
                });
            });
        };
        FilterTabModule.prototype.handleLinkClick = function(item) {
            this.updateTabItemClass(item);
            this.handleLinkAnimation(item);
            //this.centerPox(item);
        };
        FilterTabModule.prototype.handleLinkAnimation = function(item) {
            const self = this;
            const itemID = item.getAttribute('href');
            const itemElement = document.querySelector(itemID);
            const firstTabItem = this.tabItemElement[0];
            const itemPoy = itemElement.offsetTop - this.tabTabContainerElement.offsetHeight;
            let itemPoyChange = itemPoy;
            let wMPoy = 0;
            this.popupContent.removeEventListener('scroll', this.handleScrollBound);
            this.isScrolling = true;
            wMPoy = window.innerWidth <= 716 ? 53 : 103;
            if (firstTabItem && firstTabItem.getAttribute('href') === itemID) {
                this.tabWrapElement.classList.remove('active');
                this.filterHeaderElement.classList.remove('active');
                if (window.innerWidth <= 716) {
                    firstTabItem.classList.remove('on');
                }
                $(this.popupContent).stop().animate({
                    scrollTop: 0
                }, 500, function() {
                    self.popupContent.addEventListener('scroll', self.handleScrollBound);
                    self.isScrolling = false;
                });
                return;
            }
            $(this.popupContent).stop().animate({
                scrollTop: itemPoyChange - wMPoy
            }, 500, function() {
                self.popupContent.addEventListener('scroll', self.handleScrollBound);
                self.isScrolling = false;
            });
        };
        FilterTabModule.prototype.handleScroll = function() {
            const self = this;
            const filterAcTabHeight = this.tabTabContainerElement.offsetHeight;
            const scrollPosition = this.popupContent.scrollTop + filterAcTabHeight;
            const maxScrollPosition = this.popupContent.scrollHeight - this.popupContent.offsetHeight;
            const isAtBottom = this.popupContent.scrollTop >= maxScrollPosition;
            if (window.innerWidth <= 716 && this.popupContent.scrollTop + 143 > (document.getElementById('filter-PplCtgCd').offsetTop)) {
                this.tabWrapElement.classList.add('active');
                this.filterHeaderElement.classList.add('active');
            } else {
                this.tabWrapElement.classList.remove('active');
                this.filterHeaderElement.classList.remove('active');
            }
            this.sections.forEach(function(section) {
                let sectionTop = section.element.offsetTop - filterAcTabHeight;
                const sectionBottom = sectionTop + section.element.offsetHeight;
                if (window.innerWidth <= 716) {
                    sectionTop = section.element.offsetTop - filterAcTabHeight - 143;
                    if (self.popupContent.scrollTop === 0) {
                        self.tabItemElement[0].classList.remove('on');
                    }
                } else {
                    sectionTop = section.element.offsetTop - filterAcTabHeight - 120;
                }
                if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                    if (!section.item.classList.contains('on')) {
                        self.updateTabItemClass(section.item);
                        muCenter($(section.item));
                    }
                }
                if (isAtBottom) {
                    self.updateTabItemClass(section.item);
                }
            });

            function muCenter(target) {
                var snbwrap = $('.mvno-filter-ac-tab-container .mvno-filter-ac-tab');
                var targetPos = target.position();
                var box = $('.mvno-filter-ac-tab-container');
                var boxHarf = box.width() / 2;
                var pos;
                var listWidth = 0;
                snbwrap.find('.mvno-filter-ac-tab-item').each(function() {
                    listWidth += $(this).outerWidth();
                })
                var selectTargetPos = targetPos.left + target.outerWidth() / 2;
                if (selectTargetPos - 2 <= boxHarf) {
                    pos = 0;
                } else if ((listWidth - selectTargetPos - 2) <= boxHarf) { //right
                    pos = listWidth - box.width();
                } else {
                    pos = (selectTargetPos - 2) - boxHarf;
                }
                if (listWidth > box.width()) {
                    self.tabSwiper.setTransition(500);
                    self.tabSwiper.setTranslate(pos * -1);
                    // Swiper의 슬라이드 상태를 업데이트
                    self.tabSwiper.updateProgress();
                    self.tabSwiper.updateSlidesClasses();
                }
            }
            this.tabSwiper.updateProgress();
            this.tabSwiper.updateSlidesClasses();
        };
        FilterTabModule.prototype.updateTabItemClass = function(activeItem) {
            this.tabItemElement.forEach(function(item) {
                item.classList.remove('on');
            });
            if (activeItem && activeItem.classList) {
                activeItem.classList.add('on');
            }
        };
        FilterTabModule.prototype.centerPox = function(item) {
            let targetPos = window.innerWidth <= 716 ? $(item).position() : item.getBoundingClientRect(); // 선택된 아이템의 위치를 가져옵니다.
            const boxHalf = this.tabTabContainerElement.offsetWidth / 2; // 컨테이너의 반 너비
            let pos;
            let listWidth = 0;
            this.tabItemElement.forEach(function(tabItem) {
                listWidth += tabItem.offsetWidth;
            });
            const selectTargetPos = targetPos.left + item.offsetWidth / 2;
            if (this.tabParentElement.offsetWidth > listWidth) {
                return;
            }
            if (window.innerWidth <= 716) {
                if (selectTargetPos <= boxHalf) {
                    pos = 0;
                } else if ((listWidth - (targetPos.left + item.offsetWidth)) <= boxHalf) {
                    pos = listWidth - this.tabTabContainerElement.offsetWidth;
                } else {
                    pos = selectTargetPos - boxHalf;
                }
                this.tabSwiper.setTranslate(-pos);
                $(this.tabParentElement).css({
                    "transform": "translate3d(" + (pos * -1) + "px, 0, 0)",
                    "transition-duration": "500ms"
                });
                setTimeout(function() {
                    $(self.tabParentElement).css({
                        "transition-duration": "0ms"
                    });
                }, 500);
            } else {
                const lastSnapPos = this.tabSwiper.snapGrid[this.tabSwiper.snapGrid.length - 1];
                if (item.getAttribute('href').split('filter-')[1] === "PplCtgCd") {
                    this.tabSwiper.setTransition(500);
                    this.tabSwiper.setTranslate(0);
                    // Swiper의 슬라이드 상태를 업데이트
                    this.tabSwiper.updateProgress();
                    this.tabSwiper.updateSlidesClasses();
                    return;
                }
                if (selectTargetPos <= boxHalf) {
                    pos = 0;
                } else if ((listWidth - (targetPos.left + item.offsetWidth)) <= boxHalf) {
                    pos = lastSnapPos;
                } else {
                    const closestSnapPos = this.tabSwiper.snapGrid.reduce((prev, curr) => {
                        return Math.abs(curr - (selectTargetPos - boxHalf)) < Math.abs(prev - (selectTargetPos - boxHalf)) ? curr :
                        prev;
                    });
                    pos = closestSnapPos;
                }
                this.tabSwiper.setTransition(500);
                this.tabSwiper.setTranslate(-pos);
                // Swiper의 슬라이드 상태를 업데이트
                this.tabSwiper.updateProgress();
                this.tabSwiper.updateSlidesClasses();
                setTimeout(() => {
                    this.tabSwiper.setTransition(0); // 애니메이션 비활성화
                }, 500);
            }
        };
        return FilterTabModule;
    })();
    /* // 20240906 FilterTabModule 전체 수정 */
    modules.FilterExtend = (function() {
        let instances = {};

        function init(tabElement) {
            // init 호출 시 계속 실행 되는 함수
            infiniteAction(tabElement);
            if (!instances[tabElement] && document.querySelector(tabElement)) {
                instances[tabElement] = new FilterTabModule(tabElement);
            } else if (!document.querySelector(tabElement)) {
                console.warn('제공된 선택자를 찾을 수 없습니다.');
            }
            return instances[tabElement];
        }

        function infiniteAction(tabElement) {
            if (window.innerWidth >= 716) {
                document.querySelector(tabElement).querySelectorAll('.mvno-filter-ac-tab-item')[0].classList.add('on');
            }
        }
        return {
            init: init,
        };
    })();
    /* filter checkbox module 함수
     *  CheckModule(checkElement, '클릭 시 노출 되는 버튼 위치');
     *  */
    /* 20240906 CheckModule 전체 수정 */
    const CheckModule = (function() {
        function CheckModule(checkElement, options = {}) {
            this.options = options;
            this.checkboxes = document.querySelectorAll(checkElement);
            this.buttonContainer = document.querySelector(this.options.buttonContainer);
            this.swiperContainer = document.querySelector(this.options.swiperContainer);
            this.parentContainer = document.querySelector('[data-layer-js="wrap"]');
            this.swiperInstance = null; // Initialize swiper instance
            this.groupedCheckboxes = this.groupByName(this.checkboxes);
            this.clickedOrder = [];
            this.rangeModules = {}; // 모듈들을 저장하는 객체를 추가
            this.initRangeModules(); // 모듈 초기화 함수
            this.initEvents();
        }
        CheckModule.prototype.groupByName = function(checkboxes) {
            const groups = {};
            checkboxes.forEach(function(checkbox) {
                const name = checkbox.name;
                if (!groups[name]) {
                    groups[name] = [];
                }
                groups[name].push(checkbox);
            });
            return groups;
        };
        CheckModule.prototype.initEvents = function() {
            const self = this;
            Object.keys(this.groupedCheckboxes).forEach(function(name) {
                const group = self.groupedCheckboxes[name];
                group.forEach(function(checkbox) {
                    const labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                    const label = labelElement ? labelElement.innerText : "";
                    if (checkbox.checked) {
                        self.addButton(label, checkbox.id, name);
                    }
                    if (!checkbox.hasEventListener) {
                        checkbox.addEventListener("change", self.handleCheckboxChange.bind(self, checkbox, label, name));
                        checkbox.hasEventListener = true;
                    }
                });
            });
            // Reset 버튼 초기화
            this.initResetButton();
        };
        CheckModule.prototype.handleCheckboxChange = function(checkbox, label, name) {
            const isCheckbox = checkbox.checked;
            
            switch (name) {
                case "PplCtgCd":
                    // 통신
                    this.handlePplCtgCdChange(isCheckbox);
                    this.updateSelectNumCount(name);
                    break;
                case "SaleCmpnId":
                    // 알뜰폰
                    this.handleSaleCmpnIdChange(isCheckbox);
                    this.updateSelectNumCount(name);
                    break;
                case "DataSpd":
                    // 속도
                    this.handleDataSpdChange(isCheckbox);
                    this.updateSelectNumCount(name);
                    break;
                case "VoiceQnt":
                    // 통화
                    this.handleVoiceQntChange(isCheckbox);
                    this.updateSelectNumCount(name);
                    break;
                case "ChrQnt":
                    // 문자
                    this.handleChrQntChange(isCheckbox);
                    this.updateSelectNumCount(name);
                    break;
                case "Kategorie":
                    // 카테고리
                    this.handleKategorieChange(isCheckbox);
                    this.updateSelectNumCount(name);
                    break;
                case "SaleDay":
                    // 할인기간
                    this.handleSaleDayChange(isCheckbox);
                    this.updateSelectNumCount(name);
                    break;
                case "DataQnt":
                    if (checkbox.checked) {
                        if (!this.buttonContainer.querySelector(`[data-name="DataQnt"]`)) {
                            this.addButton(label, checkbox.id, "DataQnt");
                            this.updateSelectNumCount(name);
                        }
                    } else {
                        this.removeButtonByName("DataQnt");
                    }
                    this.updateSelectNumCount(name);
                    break;
                case "MonthUseChage":
                    if (checkbox.checked) {
                        if (!this.buttonContainer.querySelector(`[data-name="MonthUseChage"]`)) {
                            this.addButton(label, checkbox.id, "MonthUseChage");
                        }
                    } else {
                        this.removeButtonByName("MonthUseChage");
                    }
                    this.updateSelectNumCount(name);
                    break;
                default:
                    if (checkbox.checked) {
                        this.addButton(label, checkbox.id, name);
                    } else {
                        this.removeButton(label);
                    }
            }
            setTimeout(() => {
                if (this.buttonContainer.children.length < 1) {
                    this.parentContainer.classList.remove('active');
                }
                this.checkAndInitSwiper();
                if (this.swiperInstance) {
                    this.swiperInstance.update();
                }
            }, 50);
        };
        // 클릭 순서 업데이트 함수
        CheckModule.prototype.updateClickOrder = function(checkboxes) {
            // 체크된 항목들을 순서대로 관리
            Array.from(checkboxes).forEach(function(checkbox) {
                const clickedId = checkbox.id;
                const isChecked = checkbox.checked;
                // 체크된 상태일 경우 순서대로 추가
                if (isChecked) {
                    // clickedOrder에 포함되지 않은 경우만 추가
                    if (!this.clickedOrder.includes(clickedId)) {
                        this.clickedOrder.push(clickedId);
                    }
                }
                // 체크 해제된 경우
                else {
                    this.clickedOrder = this.clickedOrder.filter(function(id) {
                        return id !== clickedId;
                    });
                }
            }.bind(this));
            // 유효한 체크박스만 clickedOrder에 남겨두기 (혹시 다른 문제가 생겼을 경우를 대비)
            this.clickedOrder = this.clickedOrder.filter(function(id) {
                return checkboxes.find(cb => cb.id === id && cb.checked); // 체크된 항목만 남김
            });
            // console.log("Clicked order:", this.clickedOrder); 배열 담긴 name 확인 디버깅
        };
        // 체크된 박스를 필터링하는 함수
        CheckModule.prototype.getCheckedBoxes = function(checkboxes) {
            return Array.from(checkboxes).filter(function(checkbox) {
                return checkbox.checked;
            });
        };
        // 통신 체크박스 상태 변화 시 로직
        CheckModule.prototype.handlePplCtgCdChange = function() {
            const checkboxes = this.groupedCheckboxes["PplCtgCd"];
            // 클릭 순서 업데이트
            this.updateClickOrder(checkboxes);
            // 체크된 박스 필터링
            const checkedBoxes = this.getCheckedBoxes(checkboxes);
            this.removeButton("통신 방식 전체");
            if (checkedBoxes.length === 2) {
                this.removeButtonsByName("PplCtgCd");
                this.addButton("통신 방식 전체", "PplCtgCd_all", "PplCtgCd");
            } else if (checkedBoxes.length === 1) {
                this.removeButtonsByName("PplCtgCd");
                const labelElement = document.querySelector('label[for="' + checkedBoxes[0].id + '"] .label-tt');
                const label = labelElement ? labelElement.innerText : "";
                this.addButton(label, checkedBoxes[0].id, "PplCtgCd");
            } else {
                this.removeButtonsByName("PplCtgCd");
            }
            this.countCheckedByName("PplCtgCd");
        };
        
        // 속도 체크박스 상태 변화 시 로직
        CheckModule.prototype.handleDataSpdChange = function(checkflag) {
            // checkflag.chekced 정확한 체크값 확인 가능
            const checkboxes = this.groupedCheckboxes["DataSpd"];
            const currentTranslate = this.swiperInstance ? this.swiperInstance.getTranslate() : null;
            
            // 클릭 순서 업데이트
            this.updateClickOrder(checkboxes);
            
            // 체크된 박스 필터링
            const checkedBoxes = this.getCheckedBoxes(checkboxes);
            
            this.removeButton("소진 시 속도 전체");
            // 버튼 처리 (모든 체크박스가 선택되었을 때)
            if (checkedBoxes.length === 5) {
                // 개별 버튼 모두 제거 후 '전체' 버튼 추가
                this.removeButtonsByName("DataSpd");
                this.addButton("소진 시 속도 전체", "DataSpd_all", "DataSpd");
                return; // 전체 선택이므로 개별 체크 해제 로직을 종료
            }
            
            // 2. 개별 체크 해제 시 처리
            checkboxes.forEach(checkbox => {
                const labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                const label = labelElement ? labelElement.innerText : "";
        
                if (checkbox.checked) {
                    // 3. 체크된 상태인 경우 (기존 버튼 유지 및 추가)
                    this.addButton(label, checkbox.id, "DataSpd");
        
                    // 클릭한 순서를 기록
                    if (!this.clickedOrder.includes(checkbox.id)) {
                        this.clickedOrder.push(checkbox.id); // 클릭 순서 기록
                    }
                } else {
                    // 4. 체크 해제된 상태인 경우 해당 버튼 삭제
                    this.removeButton(label);
                    this.clickedOrder = this.clickedOrder.filter(clickedId => clickedId !== checkbox.id); // 클릭 순서에서 제거
                }
            });
            
            // 5. '소진 시 속도 전체' 버튼이 있으면 제거 (모든 체크박스가 선택되지 않은 경우)
            if (this.buttonContainer.querySelector(`[data-name="DataSpd_all"]`)) {
                this.removeButtonByName("DataSpd_all");
            }
            
            if (this.swiperInstance && currentTranslate !== null) {
                this.swiperInstance.setTranslate(currentTranslate);
                this.swiperInstance.update();
            }
        };
        
        // 통화 체크박스 상태 변화 시 로직
        CheckModule.prototype.handleVoiceQntChange = function(checkflag) {
            // checkflag.chekced 정확한 체크값 확인 가능
            const checkboxes = this.groupedCheckboxes["VoiceQnt"];
            const currentTranslate = this.swiperInstance ? this.swiperInstance.getTranslate() : null;
            
            // 클릭 순서 업데이트
            this.updateClickOrder(checkboxes);
            
            // 체크된 박스 필터링
            const checkedBoxes = this.getCheckedBoxes(checkboxes);
            
            this.removeButton("통화 전체");
            // 버튼 처리 (모든 체크박스가 선택되었을 때)
            if (checkedBoxes.length === 6) {
                // 개별 버튼 모두 제거 후 '전체' 버튼 추가
                this.removeButton("통화 무제한");
                this.removeButtonsByName("VoiceQnt");
                this.addButton("통화 전체", "VoiceQnt_all", "VoiceQnt");
                return; // 전체 선택이므로 개별 체크 해제 로직을 종료
            }
            
            // 개별 체크 해제 시 처리
            checkboxes.forEach(checkbox => {
                const labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                let label = labelElement ? labelElement.innerText : "";
                if (label === "무제한" || checkbox.value === "unlimited") {
                    label = "통화 무제한";
                }
        
                if (checkbox.checked) {
                    // 체크된 상태인 경우 (기존 버튼 유지 및 추가)
                    this.addButton(label, checkbox.id, "VoiceQnt");
        
                    // 클릭한 순서를 기록
                    if (!this.clickedOrder.includes(checkbox.id)) {
                        this.clickedOrder.push(checkbox.id); // 클릭 순서 기록
                    }
                } else {
                    // 체크 해제된 상태인 경우 해당 버튼 삭제
                    this.removeButton(label);
                    this.clickedOrder = this.clickedOrder.filter(clickedId => clickedId !== checkbox.id); // 클릭 순서에서 제거
                }
            });
            
            // '전체' 버튼이 있으면 제거 (모든 체크박스가 선택되지 않은 경우)
            if (this.buttonContainer.querySelector(`[data-name="VoiceQnt_all"]`)) {
                this.removeButtonByName("VoiceQnt_all");
            }
            
            if (this.swiperInstance && currentTranslate !== null) {
                this.swiperInstance.setTranslate(currentTranslate);
                this.swiperInstance.update();
            }
        };
        
        // 문자 체크박스 상태 변화 시 로직
        CheckModule.prototype.handleChrQntChange = function(checkflag) {
            // checkflag.chekced 정확한 체크값 확인 가능
            const checkboxes = this.groupedCheckboxes["ChrQnt"];
            const currentTranslate = this.swiperInstance ? this.swiperInstance.getTranslate() : null;
            
            // 클릭 순서 업데이트
            this.updateClickOrder(checkboxes);
            
            // 체크된 박스 필터링
            const checkedBoxes = this.getCheckedBoxes(checkboxes);
            
            this.removeButton("문자 전체");
            // 버튼 처리 (모든 체크박스가 선택되었을 때)
            if (checkedBoxes.length === 6) {
                // 개별 버튼 모두 제거 후 '전체' 버튼 추가
                this.removeButton("문자 무제한");
                this.removeButtonsByName("ChrQnt");
                this.addButton("문자 전체", "ChrQnt_all", "ChrQnt");
                return; // 전체 선택이므로 개별 체크 해제 로직을 종료
            }
            
            // 개별 체크 해제 시 처리
            checkboxes.forEach(checkbox => {
                const labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                let label = labelElement ? labelElement.innerText : "";
                if (label === "무제한" || checkbox.value === "unlimited") {
                    label = "문자 무제한";
                }
        
                if (checkbox.checked) {
                    // 체크된 상태인 경우 (기존 버튼 유지 및 추가)
                    this.addButton(label, checkbox.id, "ChrQnt");
        
                    // 클릭한 순서를 기록
                    if (!this.clickedOrder.includes(checkbox.id)) {
                        this.clickedOrder.push(checkbox.id); // 클릭 순서 기록
                    }
                } else {
                    // 체크 해제된 상태인 경우 해당 버튼 삭제
                    this.removeButton(label);
                    this.clickedOrder = this.clickedOrder.filter(clickedId => clickedId !== checkbox.id); // 클릭 순서에서 제거
                }
            });
            
            // '전체' 버튼이 있으면 제거 (모든 체크박스가 선택되지 않은 경우)
            if (this.buttonContainer.querySelector(`[data-name="ChrQnt_all"]`)) {
                this.removeButtonByName("ChrQnt_all");
            }
            
            if (this.swiperInstance && currentTranslate !== null) {
                this.swiperInstance.setTranslate(currentTranslate);
                this.swiperInstance.update();
            }
        };
        
        // 할인기간 체크박스 상태 변화 시 로직
        CheckModule.prototype.handleSaleDayChange = function(checkflag) {
            // checkflag.chekced 정확한 체크값 확인 가능
            const checkboxes = this.groupedCheckboxes["SaleDay"];
            const currentTranslate = this.swiperInstance ? this.swiperInstance.getTranslate() : null;
            
            // 클릭 순서 업데이트
            this.updateClickOrder(checkboxes);
            
            // 체크된 박스 필터링
            const checkedBoxes = this.getCheckedBoxes(checkboxes);
            
            this.removeButton("할인 기간 전체");
            // 버튼 처리 (모든 체크박스가 선택되었을 때)
            if (checkedBoxes.length === 6) {
                // 개별 버튼 모두 제거 후 '전체' 버튼 추가
                this.removeButtonsByName("SaleDay");
                this.addButton("할인 기간 전체", "SaleDay_all", "SaleDay");
                return; // 전체 선택이므로 개별 체크 해제 로직을 종료
            }
            
            // 개별 체크 해제 시 처리
            checkboxes.forEach(checkbox => {
                const labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                const label = labelElement ? labelElement.innerText : "";
        
                if (checkbox.checked) {
                    // 체크된 상태인 경우 (기존 버튼 유지 및 추가)
                    this.addButton(label, checkbox.id, "SaleDay");
        
                    // 클릭한 순서를 기록
                    if (!this.clickedOrder.includes(checkbox.id)) {
                        this.clickedOrder.push(checkbox.id); // 클릭 순서 기록
                    }
                } else {
                    // 체크 해제된 상태인 경우 해당 버튼 삭제
                    this.removeButton(label);
                    this.clickedOrder = this.clickedOrder.filter(clickedId => clickedId !== checkbox.id); // 클릭 순서에서 제거
                }
            });
            
            // '전체' 버튼이 있으면 제거 (모든 체크박스가 선택되지 않은 경우)
            if (this.buttonContainer.querySelector(`[data-name="SaleDay_all"]`)) {
                this.removeButtonByName("SaleDay_all");
            }
            
            if (this.swiperInstance && currentTranslate !== null) {
                this.swiperInstance.setTranslate(currentTranslate);
                this.swiperInstance.update();
            }
        };
        
        // 카테고리 상태 변화 시 로직
        CheckModule.prototype.handleKategorieChange = function(checkflag) {
            // checkflag.chekced 정확한 체크값 확인 가능
            const checkboxes = this.groupedCheckboxes["Kategorie"];
            const currentTranslate = this.swiperInstance ? this.swiperInstance.getTranslate() : null;
            
            // 클릭 순서 업데이트
            this.updateClickOrder(checkboxes);
            
            // 체크된 박스 필터링
            const checkedBoxes = this.getCheckedBoxes(checkboxes);
            
            this.removeButton("카테고리 전체");
            // 버튼 처리 (모든 체크박스가 선택되었을 때)
            if (checkedBoxes.length === 4) {
                // 개별 버튼 모두 제거 후 '전체' 버튼 추가
                this.removeButtonsByName("Kategorie");
                this.addButton("카테고리 전체", "Kategorie_all", "Kategorie");
                return; // 전체 선택이므로 개별 체크 해제 로직을 종료
            }
            
            // 개별 체크 해제 시 처리
            checkboxes.forEach(checkbox => {
                const labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                const label = labelElement ? labelElement.innerText : "";
        
                if (checkbox.checked) {
                    // 체크된 상태인 경우 (기존 버튼 유지 및 추가)
                    this.addButton(label, checkbox.id, "Kategorie");
        
                    // 클릭한 순서를 기록
                    if (!this.clickedOrder.includes(checkbox.id)) {
                        this.clickedOrder.push(checkbox.id); // 클릭 순서 기록
                    }
                } else {
                    // 체크 해제된 상태인 경우 해당 버튼 삭제
                    this.removeButton(label);
                    this.clickedOrder = this.clickedOrder.filter(clickedId => clickedId !== checkbox.id); // 클릭 순서에서 제거
                }
            });
            
            // '전체' 버튼이 있으면 제거 (모든 체크박스가 선택되지 않은 경우)
            if (this.buttonContainer.querySelector(`[data-name="Kategorie_all"]`)) {
                this.removeButtonByName("Kategorie_all");
            }
            
            if (this.swiperInstance && currentTranslate !== null) {
                this.swiperInstance.setTranslate(currentTranslate);
                this.swiperInstance.update();
            }
        };
        
        //알뜰폰 상태 변화 시 로직
        CheckModule.prototype.handleSaleCmpnIdChange = function() {
            const checkboxes = this.groupedCheckboxes["SaleCmpnId"];
            // 클릭 순서 업데이트
            this.updateClickOrder(checkboxes);
            // 체크된 박스 필터링
            const checkedBoxes = this.getCheckedBoxes(checkboxes);
            // 모든 체크박스가 선택된 경우 알뜰폰 사업자 전체 버튼 추가
            if (checkedBoxes.length === checkboxes.length) {
                const countButton = Array.from(this.buttonContainer.children).find(button => button.innerText.indexOf("외 ") !== -1);
                if (countButton) {
                    countButton.remove();
                }
                this.removeButtonsByName("SaleCmpnId");
                this.addButton("알뜰폰 사업자 전체", "SaleCmpnId_all", "SaleCmpnId");
                this.firstCheckedLabel = null;
                return;
            }
            // 체크된 항목이 없으면 버튼 제거하고 초기화
            if (checkedBoxes.length === 0) {
                this.removeButtonsByName("SaleCmpnId");
                this.firstCheckedLabel = null;
                return;
            }
            // 기존의 "알뜰폰 사업자 전체" 버튼을 제거하는 로직 추가
            const fullSelectionButton = Array.from(this.buttonContainer.children).find(button => button.innerText === "알뜰폰 사업자 전체");
            if (fullSelectionButton) {
                fullSelectionButton.remove(); // "알뜰폰 사업자 전체" 버튼 삭제
            }
            // 첫 번째 체크된 항목이 해제되었는지 확인하고, 해제되면 순서에 맞게 갱신
            if (!checkedBoxes.find(checkbox => checkbox.id === this.firstCheckedLabel)) {
                const nextChecked = this.clickedOrder.find(id => checkedBoxes.find(cb => cb.id === id));
                this.firstCheckedLabel = nextChecked || null;
            }
            // 현재 firstCheckedLabel의 레이블을 가져옴
            const labelElement = document.querySelector('label[for="' + this.firstCheckedLabel + '"] .label-tt');
            const firstCheckedLabelText = labelElement ? labelElement.innerText : "";
            // 5개 이상의 체크박스가 선택된 경우
            if (checkedBoxes.length >= 6) {
                const countButton = Array.from(this.buttonContainer.children).find(button => button.innerText.indexOf("외 ") !== -1);
                
                if (countButton) {
                    countButton.remove();
                }
                this.removeButtonsByName("SaleCmpnId");
                this.updateSaleCmpnIdCount(checkedBoxes.length, firstCheckedLabelText);
            } else {
                const checkboxes = this.groupedCheckboxes["SaleCmpnId"];
                const currentTranslate = this.swiperInstance ? this.swiperInstance.getTranslate() : null;
                
                // 클릭 순서 업데이트
                this.updateClickOrder(checkboxes);
                
                // 체크된 박스 필터링
                const checkedBoxes = this.getCheckedBoxes(checkboxes);
                
                if (checkedBoxes.length < 6) {
                    // 개별 체크 해제 시 처리
                    const countButton = Array.from(this.buttonContainer.children).find(button => button.innerText.indexOf("외 ")  !== -1)
                    if (countButton) {
                        countButton.remove();
                    }
                    
                    checkboxes.forEach(checkbox => {
                        const labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                        const label = labelElement ? labelElement.innerText : "";
                
                        if (checkbox.checked) {
                            // 체크된 상태인 경우 (기존 버튼 유지 및 추가)
                            this.addButton(label, checkbox.id, "SaleCmpnId");
                
                            // 클릭한 순서를 기록
                            if (!this.clickedOrder.includes(checkbox.id)) {
                                this.clickedOrder.push(checkbox.id); // 클릭 순서 기록
                            }
                        } else {
                            // 체크 해제된 상태인 경우 해당 버튼 삭제
                            this.removeButton(label);
                            this.clickedOrder = this.clickedOrder.filter(clickedId => clickedId !== checkbox.id); // 클릭 순서에서 제거
                        }
                    });
                    
                    // 체크된 항목이 없는 경우 firstCheckedLabel 초기화
                    if (checkedBoxes.length === 0) {
                        this.firstCheckedLabel = null;
                    }
                }
            }
        };
        // 알뜰폰 카운트
        CheckModule.prototype.updateSaleCmpnIdCount = function(count, firstLabel) {
            const self = this;
            const existingButton = Array.from(this.buttonContainer.children).find(function(button) {
                return button.innerText.indexOf(firstLabel) === 0;
            });
            if (existingButton) {
                existingButton.innerText = firstLabel + " 외 " + (count-1) + "개";
            } else {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "mvno-btn-select swiper-slide";
                button.innerText = firstLabel + " 외 " + (count-1) + "개";
                button.addEventListener("click", function() {
                    this.groupedCheckboxes["SaleCmpnId"].forEach(function(checkbox) {
                        checkbox.checked = false;
                        self.updateSelectNumCount("SaleCmpnId");
                    });
                    this.removeButton(button.innerText);
                }.bind(this));
                this.buttonContainer.appendChild(button);
            }
        };
        CheckModule.prototype.initRangeModules = function() {
            // DataQnt 모듈 초기화 및 이벤트 핸들러 추가
            const dataQntModule = modules.RangeDataExtend.init('[data-range-js="DataQnt"]');
            this.rangeModules["DataQnt"] = dataQntModule;
            const monthUseModule = modules.RangePriceExtend.init('[data-range-js="MonthUseChage"]');
            this.rangeModules["MonthUseChage"] = monthUseModule;
            // 슬라이더에 직접 조작 시 이벤트 리스너 추가
            const dataQntSlider = dataQntModule.getSlider();
            dataQntSlider.on('set', (values) => {
                this.updateDataRangeButton(values, "DataQnt");
            });
            const montUseSlider = monthUseModule.getSlider();
            montUseSlider.on('set', (values) => {
                this.updateDataRangeButton(values, "MonthUseChage");
            });
        };
        // 슬라이더 조작에 따라 버튼을 업데이트하는 함수 추가
        CheckModule.prototype.updateDataRangeButton = function(values, type) {
            if (type === "DataQnt") {
                const rangeLabel = document.querySelector('[data-range-js="DataQnt"] [data-range="rangeData"]');
                let labelText = rangeLabel ? rangeLabel.innerText : `Range: ${values[0]} - ${values[1]}`;
                let existingButton = Array.from(this.buttonContainer.children).find(function(button) {
                    return button.dataset.range === "DataQnt";
                });
                // Remove the existing "DataQnt" button first
                this.removeButton("데이터 전체");
                this.removeButtonsByName("DataQnt");
                if (existingButton) {
                    this.removeButton(existingButton);
                    this.removeButtonByName("DataQnt");
                }
                if(labelText == "무제한"){
                    labelText = "데이터 무제한";
                }
                this.addButton(labelText, null, "DataQnt", "DataQnt");
                this.updateSelectNumCount("DataQnt");
                this.checkAndInitSwiper();
            } else if (type === "MonthUseChage") {
                const rangeLabel = document.querySelector('[data-range-js="MonthUseChage"] [data-range="rangeData"]');
                const labelText = rangeLabel ? rangeLabel.innerText : `Range: ${values[0]} - ${values[1]}`;
                let existingButton = Array.from(this.buttonContainer.children).find(function(button) {
                    return button.dataset.range === "MonthUseChage";
                });
                this.removeButton("요금 전체");
                this.removeButtonsByName("MonthUseChage");
                if (existingButton) {
                    this.removeButton(existingButton);
                    this.removeButtonByName("MonthUseChage");
                }
                this.addButton(labelText, null, "MonthUseChage", "MonthUseChage");
                this.updateSelectNumCount("MonthUseChage");
                this.checkAndInitSwiper();
            }
        };
        // 버튼 추가 로직
        CheckModule.prototype.addButton = function(text, checkboxId, name, dataRange = null) {
            const self = this;
            var existingButton = Array.from(this.buttonContainer.children).find(function(button) {
                return button.dataset.name === name && button.innerText === text;
            });
            if (existingButton) {
                return;
            }
            let button = document.createElement("button");
            button.type = "button";
            button.className = "mvno-btn-select swiper-slide";
            button.innerText = text;
            button.dataset.name = name;
            button.dataset.id = checkboxId;
            
            if (dataRange) {
                button.dataset.range = dataRange;
            }
            button.addEventListener("click", function() {
                if (button.disabled) return;
                button.disabled = true;
                if (dataRange === "DataQnt") {
                    const dataQntassociatedCheckbox = document.getElementById(checkboxId);
                    if (dataQntassociatedCheckbox) {
                        dataQntassociatedCheckbox.checked = false;
                        dataQntassociatedCheckbox.dispatchEvent(new Event('change'));
                    }
                    const rangeDataModuleInstance = modules.RangeDataExtend.init('[data-range-js="DataQnt"]');
                    if (rangeDataModuleInstance) {
                        const rangeDataSlider = rangeDataModuleInstance.getSlider();
                        const rangeDataValue = rangeDataModuleInstance.getRangeDataValue();
                        rangeDataSlider.set([0, rangeDataValue.length - 1]);
                    }
                    self.removeButton("데이터 전체");
                    self.removeButton(button.innerText);
                    self.updateSelectNumCount("DataQnt");
                } else if (dataRange === "MonthUseChage") {
                    const monthUseChageassociatedCheckbox = document.getElementById(checkboxId);
                    if (monthUseChageassociatedCheckbox) {
                        monthUseChageassociatedCheckbox.checked = false;
                        monthUseChageassociatedCheckbox.dispatchEvent(new Event('change'));
                    }
                    const rangePriceModuleInstance = modules.RangePriceExtend.init('[data-range-js="MonthUseChage"]');
                    if (rangePriceModuleInstance) {
                        const rangePriceSlider = rangePriceModuleInstance.getSlider();
                        const rangePriceValue = rangePriceModuleInstance.getRangeDataValue();
                        rangePriceSlider.set([0, rangePriceValue.length - 1]);
                    }
                    self.removeButton("요금 전체");
                    self.removeButton(button.innerText);
                    self.updateSelectNumCount("MonthUseChage");
                } else if (text === "통신 방식 전체" && name === "PplCtgCd") {
                    self.clearAssociatedCheckboxes("PplCtgCd");
                    self.removeButtonsByName("PplCtgCd");
                    self.removeButton(text, name);
                } else if (text === "소진 시 속도 전체" && name === "DataSpd") {
                    self.clearAssociatedCheckboxes("DataSpd");
                    self.removeButton(text, name);
                } else if (text === "통화 전체" && name === "VoiceQnt") {
                    self.clearAssociatedCheckboxes("VoiceQnt");
                    self.removeButton(text, name);
                } else if (text === "문자 전체" && name === "ChrQnt") {
                    self.clearAssociatedCheckboxes("ChrQnt");
                    self.removeButton(text, name);
                } else if (text === "할인 기간 전체" && name === "SaleDay") {
                    self.clearAssociatedCheckboxes("SaleDay");
                    self.removeButton(text, name);
                } else if (text === "카테고리 전체" && name === "Kategorie") {
                    self.clearAssociatedCheckboxes("Kategorie");
                    self.removeButton(text, name);
                } else if (text === "알뜰폰 사업자 전체" && name === "SaleCmpnId") {
                    self.clearAssociatedCheckboxes("SaleCmpnId");
                    self.removeButton(text, name);
                } else {
                    var checkbox = document.getElementById(checkboxId);
                    if (checkbox) {
                        checkbox.checked = false;
                        checkbox.dispatchEvent(new Event('change'));
                        self.removeButton(text, name);
                        if (name === "SaleCmpnId") {
                            self.handleSaleCmpnIdChange();
                        }
                    }
                }
                setTimeout(function() {
                    button.disabled = false;
                }, 300, { passive: true });
            });
            this.parentContainer.classList.add('active');
            this.buttonContainer.appendChild(button);
        };
        // 버튼 제거 로직
        CheckModule.prototype.removeButton = function(text) {
            const button = Array.from(this.buttonContainer.children).find(function(button) {
                return button.innerText === text;
            });
            setTimeout(() => {
                if (this.buttonContainer.children.length < 1) {
                    this.parentContainer.classList.remove('active');
                }
            }, 10);
            if (button) {
                button.remove();
                const associatedCheckbox = Array.from(this.checkboxes).find(function(checkbox) {
                    const labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                    return labelElement && labelElement.innerText === text;
                });
                if (associatedCheckbox && associatedCheckbox.name === "DataQnt") {
                    const rangeDataModuleInstance = modules.RangeDataExtend.init('[data-range-js="DataQnt"]');
                    if (rangeDataModuleInstance) {
                        const rangeDataSlider = rangeDataModuleInstance.getSlider();
                        const rangeDataValue = rangeDataModuleInstance.getRangeDataValue();
                        rangeDataSlider.set([0, rangeDataValue.length - 1]);
                    }
                }
                if (associatedCheckbox && associatedCheckbox.name === "MonthUseChage") {
                    const rangeDataModuleInstance = modules.RangePriceExtend.init('[data-range-js="MonthUseChage"]');
                    if (rangeDataModuleInstance) {
                        const rangeDataSlider = rangeDataModuleInstance.getSlider();
                        const rangeDataValue = rangeDataModuleInstance.getRangeDataValue();
                        rangeDataSlider.set([0, rangeDataValue.length - 1]);
                    }
                }
                this.checkAndInitSwiper();
            }
        };
        CheckModule.prototype.removeButtonByName = function(name) {
            const button = Array.from(this.buttonContainer.children).find(function(button) {
                return button.dataset.name === name;
            });
            if (button) {
                button.remove();
            }
        };
        CheckModule.prototype.removeButtonsByName = function(name) {
            var self = this;
            Array.from(this.buttonContainer.children).forEach(function(button) {
                var buttonLabel = button.innerText.trim();
                if (name === "SaleCmpnId") {
                    var labelMatches = self.groupedCheckboxes["SaleCmpnId"].some(function(checkbox) {
                        var labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                        return labelElement && buttonLabel === labelElement.innerText.trim();
                    });
                    if (labelMatches) {
                        button.remove();
                    }
                } else if (name === "PplCtgCd") {
                    self.groupedCheckboxes["PplCtgCd"].forEach(function(checkbox) {
                        var labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                        if (labelElement && buttonLabel === labelElement.innerText.trim()) {
                            button.remove();
                        }
                    });
                } else if (name === "DataQnt") {
                    self.groupedCheckboxes["DataQnt"].forEach(function(checkbox) {
                        var labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                        if (labelElement && buttonLabel === labelElement.innerText.trim()) {
                            button.remove();
                        }
                    });
                } else if(name === "MonthUseChage") {
                    self.groupedCheckboxes["MonthUseChage"].forEach(function(checkbox) {
                        var labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                        if (labelElement && buttonLabel === labelElement.innerText.trim()) {
                            button.remove();
                        }
                    });
                } else {
                    var labelMatches = self.groupedCheckboxes[name].some(function(checkbox) {
                        var labelElement = document.querySelector('label[for="' + checkbox.id + '"] .label-tt');
                        return labelElement && buttonLabel === labelElement.innerText.trim();
                    });
                    if (labelMatches && button.dataset.name === name) {
                        button.remove();
                    }
                }
            });
        };
        CheckModule.prototype.updateSelectNumCount = function(name) {
            const self = this;
            const filterTabContainer = document.querySelector(".mvno-filter-ac-tab-container");
            if (!filterTabContainer) {
                return;
            }
            // 체크된 체크박스 개수 확인
            const checkedCount = this.countCheckedByName(name);
            const tabItems = filterTabContainer.querySelectorAll('.mvno-filter-ac-tab-item');
            tabItems.forEach(function(item) {
                const filterHref = item.getAttribute('href');
                const filterName = filterHref.split('filter-')[1];
                
                let checkedCount = self.countCheckedByName(name);
                
                if(filterName === "DataQnt") {
                    const dataQntRangeElement = self.buttonContainer.querySelector('[data-range="DataQnt"]');
                    if (dataQntRangeElement) {
                        checkedCount = 1;
                    }
                }
            
                if(filterName === "MonthUseChage") {
                    const monthUseChageRangeElement = self.buttonContainer.querySelector('[data-range="MonthUseChage"]');
                    if(monthUseChageRangeElement) {
                        checkedCount = 1;
                    }
                }
                
                if (filterName === name) {
                    let selectNumElement = item.querySelector(".select-num");
                    if (!selectNumElement) {
                        // 없다면 새로운 엘리먼트 생성
                        selectNumElement = document.createElement("span");
                        selectNumElement.className = "select-num";
                        // 새로운 span을 해당 item 안에 추가 (필요한 위치에 추가)
                        item.appendChild(selectNumElement);
                    }
                    if (checkedCount > 0) {
                        selectNumElement.innerText = checkedCount;
                    } else {
                        selectNumElement.remove();
                    }
                    setTimeout(function() {
                        if (!self.isReset) {
                            muCenter($(item));
                        }
                        setTimeout(() => {
                            self.isReset = false; // 값 변경을 지연시켜 실행
                        }, 400);
                    }, 30);

                    function muCenter(target) {
                        var snbwrap = $('.mvno-filter-ac-tab-container .mvno-filter-ac-tab');
                        var targetPos = target.position();
                        var box = $('.mvno-filter-ac-tab-container');
                        var boxHarf = box.width() / 2;
                        var pos;
                        var listWidth = 0;
                        snbwrap.find('.mvno-filter-ac-tab-item').each(function() {
                            listWidth += $(this).outerWidth();
                        })
                        var selectTargetPos = targetPos.left + target.outerWidth() / 2;
                        if (selectTargetPos - 2 <= boxHarf) {
                            pos = 0;
                        } else if ((listWidth - selectTargetPos - 2) <= boxHarf) { //right
                            pos = listWidth - box.width();
                        } else {
                            pos = (selectTargetPos - 2) - boxHarf;
                        }
                        if (listWidth > box.width()) {
                            const tabTabContainerElement = document.querySelector('.mvno-filter-ac-tab-container');
                            tabTabContainerElement.swiper.setTransition(500);
                            tabTabContainerElement.swiper.setTranslate(pos * -1);
                            // Swiper의 슬라이드 상태를 업데이트
                            tabTabContainerElement.swiper.updateProgress();
                            tabTabContainerElement.swiper.updateSlidesClasses();
                        }
                    }
                }
            });
        };
        CheckModule.prototype.countCheckedByName = function(name) {
            const checkboxes = this.groupedCheckboxes[name];
            if (!checkboxes) {
                return 0;
            }
            // 체크된 체크박스만 필터링
            const checkedBoxes = this.getCheckedBoxes(checkboxes);
            return checkedBoxes.length;
        };
        CheckModule.prototype.clearAssociatedCheckboxes = function(name) {
            var checkboxes = this.groupedCheckboxes[name];
            checkboxes.forEach(function(checkbox) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            });
        };
        // Swiper 인스턴스 초기화 또는 업데이트 함수
        CheckModule.prototype.checkAndInitSwiper = function() {
            const buttonWidth = Array.from(this.buttonContainer.children).reduce(function(acc, button) {
                return acc + button.offsetWidth;
            }, 0);
            const containerWidth = this.swiperContainer.offsetWidth;
            if (buttonWidth >= containerWidth) {
                this.initSwiper();
                const snapGrid = this.swiperInstance.snapGrid;
                const lastSnapValue = snapGrid[snapGrid.length - 1];
                this.swiperInstance.slideTo(lastSnapValue);
                // Swiper가 필요한 경우 초기화 또는 업데이트
                if (!this.swiperInstance) {
                    // 처음 실행후
                    this.initSwiper();
                    const snapGrid = this.swiperInstance.snapGrid;
                    const lastSnapValue = snapGrid[snapGrid.length - 1];
                    this.swiperInstance.slideTo(lastSnapValue);
                    this.moveActionSwiper();
                } else {
                    if (!this.isUpdatingSwiper) {
                        // 마지막 슬라이드 이동
                        this.isUpdatingSwiper = true;
                        this.swiperInstance.update();
                        const snapGrid = this.swiperInstance.snapGrid;
                        const lastSnapValue = snapGrid[snapGrid.length - 1];
                        this.swiperInstance.slideTo(lastSnapValue);
                        this.moveActionSwiper();
                        setTimeout(() => {
                            this.isUpdatingSwiper = false; // 업데이트 플래그 리셋
                        }, 100);
                    }
                }
            } else {
                // Swiper가 필요하지 않은 경우 해제
                this.destroySwiper();
            }
        };
        // Swiper 초기화 함수
        CheckModule.prototype.initSwiper = function() {
            if (!this.swiperInstance) {
                this.swiperInstance = new Swiper(this.swiperContainer, {
                    observer: true,
                    observeParents: true,
                    slidesPerView: 'auto',
                    preventClicks: true,
                    freeMode: true,
                });
            }
        };
        // Swiper 해제 함수
        CheckModule.prototype.destroySwiper = function() {
            if (this.swiperInstance) {
                this.swiperInstance.destroy(true, true);
                this.swiperInstance = null;
            }
        };
        CheckModule.prototype.moveActionSwiper = function() {
            const self = this;
            const timeLimit = 1500;
            let timeoutId = null;
            // swiperInstance가 초기화되지 않았으면 함수 실행을 중지하고 에러 메시지 출력
            if (!self.swiperInstance || !self.swiperInstance.slides || self.swiperInstance.slides.length === 0) {
                console.error('swiperInstance is not initialized or slides are not loaded.');
                return;
            }
            self.swiperInstance.on('touchStart', function(event) {
                clearTimeout(timeoutId);
                self.swiperInstance.params.speed = 500;
            });
            let slideInterval = null; // 슬라이드 이동을 제어하는 인터벌 변수
            this.buttonContainer.addEventListener('mousemove', function(e) {
                const rect = self.swiperContainer.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const tolerance = 10; // 마우스 움직임에 반응하는 경계값
                const swiperWidth = self.swiperContainer.offsetWidth;
                clearInterval(slideInterval); // 이전 슬라이드 이동 중지
                clearTimeout(timeoutId); // 이전 타임아웃 중지
                // swiperInstance가 null이 아닌지 확인
                if (!self.swiperInstance) {
                    return;
                }
                const currentTranslate = self.swiperInstance.getTranslate(); // 현재 슬라이드의 translate 값 가져오기
                const slideWidth = self.swiperInstance.slides[0].offsetWidth; // 슬라이드 하나의 너비
                const totalSlides = self.swiperInstance.slides.length; // 총 슬라이드 수
                const maxTranslate = -(self.swiperInstance.snapGrid[self.swiperInstance.snapGrid.length - 1]); // 오른쪽 끝의 최대 translate 값
                const transitionSpeed = 30; // 애니메이션 속도 (ms)
                const stepSize = 1;
                const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                if (mouseX < tolerance && currentTranslate < 0) {
                    // 왼쪽 로직
                    timeoutId = setTimeout(() => {
                        slideInterval = setInterval(() => {
                            const newTranslate = self.swiperInstance.getTranslate() + stepSize; // 매번 약간씩 왼쪽으로 이동
                            if (newTranslate >= 0) {
                                clearInterval(slideInterval); // 왼쪽 끝에 도달하면 인터벌 중지
                                self.swiperInstance.setTranslate(0); // 정확하게 왼쪽 끝에 고정
                            } else {
                                if (isSafari) {
                                    self.swiperInstance.setTransition(50);
                                } else {
                                    self.swiperInstance.setTransition(0.001);
                                }
                                self.swiperInstance.setTransition(0.001); // 애니메이션 적용
                                self.swiperInstance.setTranslate(newTranslate); // 슬라이드 위치 업데이트
                                self.swiperInstance.updateProgress(); // 슬라이드 진행 상태 업데이트
                            }
                        }, transitionSpeed);
                    }, timeLimit); // timeLimit 이후 슬라이드 이동 시작
                } else if (mouseX > (swiperWidth - tolerance) && currentTranslate > maxTranslate) {
                    // 오른쪽 로직
                    timeoutId = setTimeout(() => {
                        slideInterval = setInterval(() => {
                            const newTranslate = self.swiperInstance.getTranslate() - stepSize; // 매번 약간씩 오른쪽으로 이동
                            if (newTranslate <= maxTranslate) {
                                clearInterval(slideInterval); // 오른쪽 끝에 도달하면 인터벌 중지
                                self.swiperInstance.setTranslate(maxTranslate); // 정확하게 오른쪽 끝에 고정
                            } else {
                                if (isSafari) {
                                    self.swiperInstance.setTransition(50);
                                } else {
                                    self.swiperInstance.setTransition(0.001);
                                } // 애니메이션 적용
                                self.swiperInstance.setTranslate(newTranslate); // 슬라이드 위치 업데이트
                                self.swiperInstance.updateProgress(); // 슬라이드 진행 상태 업데이트
                            }
                        }, transitionSpeed);
                    }, timeLimit); // timeLimit 이후 슬라이드 이동 시
                } else {
                    // 가운데 로직
                    clearInterval(slideInterval); // 중앙에 있으면 슬라이드 이동 멈춤
                }
            });
            this.buttonContainer.addEventListener('mouseleave', function(e) {
                // 마우스가 슬라이드를 벗어날 때 슬라이드 이동 중지
                clearTimeout(timeoutId);
                clearInterval(slideInterval); // 슬라이드 이동 멈춤
            });
        };
        CheckModule.prototype.resetAllCheckboxes = function() {
            const isAnyChecked = Array.from(this.checkboxes).some(function(checkbox) {
                return checkbox.checked;
            });
            if (!isAnyChecked && this.buttonContainer.querySelectorAll('.mvno-btn-select').length < 0) {
                return;
            }
            this.isReset = true;
            const saleCmpnIdFilter = document.querySelector('.mvno-filter-ac-tab-item[href*="filter-SaleCmpnId"]');
            const tabTabContainerElement = document.querySelector('.mvno-filter-ac-tab-container');
            
            if (saleCmpnIdFilter && saleCmpnIdFilter.classList.contains('on')) {
                tabTabContainerElement.swiper.setTransition(0);
                tabTabContainerElement.swiper.setTranslate(tabTabContainerElement.swiper.translate);
                // Swiper의 슬라이드 상태를 업데이트
                tabTabContainerElement.swiper.updateProgress();
                tabTabContainerElement.swiper.updateSlidesClasses();
            }
            this.checkboxes.forEach(function(checkbox) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            });
            this.buttonContainer.innerHTML = '';
            this.parentContainer.classList.remove('active');
            if (this.swiperInstance) {
                this.swiperInstance.update();
            }
        };
        CheckModule.prototype.initResetButton = function() {
            const resetButton = document.querySelector('#resetCheck');
            if (resetButton) {
                resetButton.addEventListener('click', this.resetAllCheckboxes.bind(this));
            }
        };
        return CheckModule;
    })();
    /* // 20240906 CheckModule 전체 수정 */
    modules.CheckExtend = (function() {
        function init(checkElement, options = {}) {
            if (document.querySelector(checkElement)) {
                const checkModuleInstance = new CheckModule(checkElement, options);
                return checkModuleInstance;
            } else {
                console.warn('제공된 선택자를 찾을 수 없습니다.');
            }
        }
        return {
            init: init
        }
    })();
    /* layer module window pc 버전일 때~ layer height 고정 함수 */
    const LayerModule = (function() {
        function LayerModule(layerElement) {
            this.tagElements = document.querySelectorAll(layerElement);
            this.updateElements();
            window.addEventListener('resize', this.checkVisibilityAndUpdate.bind(this));
        }
        LayerModule.prototype.checkVisibilityAndUpdate = function() {
            let anyVisible = false;
            this.tagElements.forEach(function(tarElement) {
                const style = window.getComputedStyle(tarElement);
                if (style.display !== 'none') {
                    anyVisible = true;
                }
            });
            if (anyVisible) {
                window.addEventListener('resize', this.updateElements.bind(this));
                this.updateElements();
                return;
            }
            window.removeEventListener('resize', this.updateElements.bind(this));
        };
        LayerModule.prototype.updateElements = function() {
            this.tagElements.forEach(function(tarElement) {
                let winH = window.innerHeight;
                if (winH <= 800) {
                    if (window.innerWidth >= 716) {
                        $('html').addClass('mvnolayerModule');
                        if (!document.querySelector('.mvno-popup-dim')) {
                            const dimElement = document.createElement('div');
                            dimElement.className = 'mvno-popup-dim show';
                            document.body.prepend(dimElement);
                        }
                        tarElement.classList.add('mvnolayerModule');
                    }
                } else {
                    $('html').removeClass('mvnolayerModule');
                    tarElement.classList.remove('mvnolayerModule');
                    const dimElement = document.querySelector('.mvno-popup-dim');
                    if (dimElement) {
                        dimElement.remove();
                    }
                }
            });
        };
        return LayerModule;
    })();
    modules.LayerExtend = (function() {
        function init(layerElement) {
            if (document.querySelector(layerElement)) {
                const layerModuleInstance = new LayerModule(layerElement);
                return layerModuleInstance;
            } else {
                console.warn('제공된 선택자를 찾을 수 없습니다.');
            }
        }
        return {
            init: init,
        };
    })();
    /* range slider module 함수
     *  단일로만 사용 가능
     * */
    const RangeDataModule = (function() {
        function RangeDataModule(rangeElement) {
            const self = this;
            this.rangeElement = document.querySelector(rangeElement);
            this.rangeData = this.rangeElement.querySelector('.range-label');
            this.rangeLabel = this.rangeElement.querySelector('[data-range="rangeData"]');
            this.manualUpdate = true; // 수동 조작 여부를 추적하는 플래그
            this.rangeValue = ['0', '500MB', '1GB', '1.2GB', '1.4GB', '1.6GB', '1.8GB', '2GB', '3GB', '4GB', '5GB', '6GB', '7GB', '8GB', '9GB',
                '10GB', '11GB', '12GB', '13GB', '14GB', '15GB', '16GB', '17GB', '18GB', '19GB', '20GB', '30GB', '40GB', '50GB', '60GB', '70GB',
                '80GB', '90GB', '100GB', '110GB', '120GB', '130GB', '140GB', '150GB', '160GB', '170GB', '180GB', '190GB', '200GB', '무제한'
            ];
            this.rangeSlider = noUiSlider.create(this.rangeData, {
                start: [0, self.rangeValue.length - 1], // 초기 시작 범위
                range: {
                    min: 0,
                    max: self.rangeValue.length - 1
                },
                connect: true,
                margin: 0, // 범위 핸들 간의 최소 간격
                tooltips: false, // 포맷팅을 사용하여 문자열로 표시
            });
            this.rangeSlider.on('update', function(values) {
                self.updateRange(values);
            });
            this.bindCheckboxEvents();
        }
        RangeDataModule.prototype.updateRange = function(values) {
            const rangeLabel = this.rangeLabel;
            const minValue = this.rangeValue[parseInt(values[0])];
            const maxValue = this.rangeValue[parseInt(values[1])];
            if (minValue === maxValue) {
                if (minValue === this.rangeValue[this.rangeValue.length - 1]) {
                    // rangeLabel.textContent = "데이터 무제한"; 데이터 무제한 추가 요청 시 주석해제 후 아래 코드 삭제
                    rangeLabel.textContent = "무제한";
                } else if (minValue === this.rangeValue[0]) {
                    rangeLabel.textContent = "0GB";
                } else {
                    rangeLabel.textContent = minValue;
                }
            } else if (minValue === this.rangeValue[0] && maxValue === this.rangeValue[this.rangeValue.length - 1]) {
                rangeLabel.textContent = "데이터 전체";
            } else {
               rangeLabel.textContent = minValue + '~' + maxValue;
            }
            document.querySelectorAll('[name="DataQnt"]').forEach(function(checkbox) {
                const [checkboxMin, checkboxMax] = checkbox.value.split(',');
                const changeCheckboxMax = typeof checkboxMax === 'undefined' ? rangeDataValue.length - 1 : checkboxMax;
                if (parseInt(values[0]) !== Number(checkboxMin) || parseInt(values[1]) !== Number(changeCheckboxMax)) {
                    checkbox.checked = false;
                }
                /* 
                else {
                    checkbox.checked = true; // 조건이 맞으면 체크박스를 체크
                }
                */
            });
        };
        RangeDataModule.prototype.bindCheckboxEvents = function() {
            const self = this;
            this.rangeElement.querySelectorAll('[name="DataQnt"]').forEach(function(checkbox) {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        self.rangeElement.querySelectorAll('[name="DataQnt"]').forEach(function(otherCheckbox) {
                            if (otherCheckbox !== checkbox) {
                                otherCheckbox.checked = false;
                            } else {
                                otherCheckbox.checked = true;
                            }
                        });
                        const [startValue, endValue] = this.value.split(',');
                        const changeEndValue = endValue === undefined ? self.rangeValue.length - 1 : endValue;
                        self.rangeSlider.set([startValue, changeEndValue]);
                    } else {
                        self.rangeSlider.set([0, self.rangeValue.length - 1]);
                    }
                });
            });
        };
        // 슬라이더 객체를 반환하는 메서드
        RangeDataModule.prototype.getSlider = function() {
            return this.rangeSlider;
        };
        // 슬라이더의 데이터 값을 반환하는 메서드
        RangeDataModule.prototype.getRangeDataValue = function() {
            return this.rangeValue;
        };
        return RangeDataModule;
    })();
    modules.RangeDataExtend = (function() {
        let instances = {};

        function init(rangeElement) {
            if (!instances[rangeElement] && document.querySelector(rangeElement)) {
                instances[rangeElement] = new RangeDataModule(rangeElement);
            } else if (!document.querySelector(rangeElement)) {
                console.warn('제공된 선택자를 찾을 수 없습니다.');
            }
            return instances[rangeElement];
        }
        return {
            init: init,
        };
    })();
    const RangePriceModule = (function() {
        function RangePriceModule(rangeElement) {
            const self = this;
            this.rangeElement = document.querySelector(rangeElement);
            this.rangeData = this.rangeElement.querySelector('[data-range-label="rangeData-label"]');
            this.rangeLabel = this.rangeElement.querySelector('[data-range="rangeData"]');
            this.rangeValue = ['0원', '1천원', '2천원', '3천원', '4천원', '5천원', '6천원', '7천원', '8천원', '9천원', '1만원', '1만 1천원', '1만 2천원', '1만 3천원', '1만 4천원',
                '1만 5천원', '1만 6천원', '1만 7천원', '1만 8천원', '1만 9천원', '2만원', '2만 1천원', '2만 2천원', '2만 3천원', '2만 4천원', '2만 5천원', '2만 6천원', '2만 7천원',
                '2만 8천원', '2만 9천원', '3만원', '3만 1천원', '3만 2천원', '3만 3천원', '3만 4천원', '3만 5천원', '3만 6천원', '3만 7천원', '3만 8천원', '3만 9천원', '4만원',
                '4만 1천원', '4만 2천원', '4만 3천원', '4만 4천원', '4만 5천원', '4만 6천원', '4만 7천원', '4만 8천원', '4만 9천원', '5만원', '5만원 이상'
            ];
            this.rangeSlider = noUiSlider.create(this.rangeData, {
                start: [0, self.rangeValue.length - 1], // 초기 시작 범위
                range: {
                    min: 0,
                    max: self.rangeValue.length - 1
                },
                connect: true,
                margin: 0, // 범위 핸들 간의 최소 간격
                tooltips: false, // 포맷팅을 사용하여 문자열로 표시
            });
            this.rangeSlider.on('update', function(values) {
                self.updateRange(values);
            });
            this.bindCheckboxEvents();
        }
        RangePriceModule.prototype.updateRange = function(values) {
            const rangeLabel = this.rangeLabel;
            const minValue = this.rangeValue[parseInt(values[0])];
            const maxValue = this.rangeValue[parseInt(values[1])];
            if (minValue === maxValue) {
                if (minValue === this.rangeValue[this.rangeValue.length - 1]) {
                    rangeLabel.textContent = "5만원 이상";
                } else if (minValue === this.rangeValue[0]) {
                    rangeLabel.textContent = "0GB";
                } else {
                    rangeLabel.textContent = minValue;
                }
                //rangeLabel.textContent = (minValue === this.rangeValue[this.rangeValue.length - 1]) ? "5만원 이상" : minValue;
            } else if (minValue === this.rangeValue[0] && maxValue === this.rangeValue[this.rangeValue.length - 1]) {
                rangeLabel.textContent = "요금 전체";
            } else {
                rangeLabel.textContent = minValue + '~' + maxValue;
            }
            document.querySelectorAll('[name="MonthUseChage"]').forEach(function(checkbox) {
                const [checkboxMin, checkboxMax] = checkbox.value.split(',');
                const changeCheckboxMax = (typeof checkboxMax === 'undefined' || checkboxMax === '') ? rangeDataValue.length - 1 :
                    checkboxMax;
                if (parseInt(values[0], 10) !== Number(checkboxMin) || parseInt(values[1], 10) !== Number(changeCheckboxMax)) {
                    checkbox.checked = false;
                } 
                /*
                else {
                    checkbox.checked = true; // 조건이 맞으면 체크박스를 체크
                }
                */
            });
        };
        RangePriceModule.prototype.bindCheckboxEvents = function() {
            const self = this;
            this.rangeElement.querySelectorAll('[name="MonthUseChage"]').forEach(function(checkbox) {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        self.rangeElement.querySelectorAll('[name="MonthUseChage"]').forEach(function(otherCheckbox) {
                            if (otherCheckbox !== checkbox) {
                                otherCheckbox.checked = false;
                            } else {
                                otherCheckbox.checked = true;
                            }
                        });
                        const [startValue, endValue] = this.value.split(',');
                        const changeEndValue = endValue === undefined ? self.rangeValue.length - 1 : endValue;
                        self.rangeSlider.set([startValue, changeEndValue]);
                    } else {
                        self.rangeSlider.set([0, self.rangeValue.length - 1]);
                    }
                });
            });
        };
        // 슬라이더 객체를 반환하는 메서드
        RangePriceModule.prototype.getSlider = function() {
            return this.rangeSlider;
        };
        // 슬라이더의 데이터 값을 반환하는 메서드
        RangePriceModule.prototype.getRangeDataValue = function() {
            return this.rangeValue;
        };
        return RangePriceModule;
    })();
    modules.RangePriceExtend = (function() {
        let instances = {};

        function init(rangeElement) {
            if (!instances[rangeElement] && document.querySelector(rangeElement)) {
                instances[rangeElement] = new RangePriceModule(rangeElement);
            } else if (!document.querySelector(rangeElement)) {
                console.warn('제공된 선택자를 찾을 수 없습니다.');
            }
            return instances[rangeElement];
        }
        return {
            init: init,
        };
    })();
    /* brand name chagne module 함수 */
    const BrandModule = (function() {
        function BrandModule(brandElement) {
            const self = this;
            this.brandElement = document.querySelector(brandElement);
            this.toggleElement = this.brandElement.previousElementSibling.querySelector('[data-js="brandToggle"]');
            if (!this.brandElement) {
                return;
            }
            if (this.brandElement.classList.contains('initialized')) {
                return;
            }
            this.brandElement.classList.add('initialized');
            if (this.toggleElement) {
                this.toggleElement.setAttribute('title', '브랜드명만 보기 선택하기');
                this.toggleElement.addEventListener('click', function() {
                    self.toggles();
                });
            }
        }
        BrandModule.prototype.toggles = function() {
            let isActive = this.toggleElement.classList.contains('active');
            if (isActive) {
                this.toggleElement.classList.remove('active');
                this.toggleElement.setAttribute('title', '브랜드명만 보기 선택하기');
                this.brandElement.classList.remove('active');
                return;
            }
            this.toggleElement.classList.add('active');
            this.toggleElement.setAttribute('title', '브랜드명만 보기 해제하기');
            this.brandElement.classList.add('active');
        };
        return BrandModule;
    })();
    modules.BrandExtend = (function() {
        function init(brandElement) {
            if (document.querySelector(brandElement)) {
                const brandModuleInstance = new BrandModule(brandElement);
                return brandModuleInstance;
            } else {
                console.warn('제공된 선택자를 찾을 수 없습니다.');
            }
        }
        return {
            init: init
        };
    })();
    /*Object.keys(modules).forEach(function(key) {
        if (key.slice(-6) === 'Extend') {  // ES5 호환 endsWith 대체
            window.mvno[key] = modules[key];
            // console.log('Module ' + key + ' automatically attached to mvno.');
        }
    });*/
    Object.keys(modules).forEach(function(key) {
        if (key.slice(-6) === 'Extend') { // 키가 'Extend'로 끝나는지 확인 (ES5 호환 endsWith)
            // 모듈을 mvno에 연결하기 전에 추가 조건 확인
            if (typeof modules[key] !== 'undefined' && typeof modules[key].init === 'function') {
                // 조건을 충족하면 모듈을 mvno 객체에 연결
                window.mvno[key] = modules[key];
            } else {}
        }
    });
})();
window.addEventListener('load', function() {
    mvno.CheckExtend.init('.mvno-filter-modal-checkbox', {
        buttonContainer: '#buttonContainer',
        swiperContainer: '[data-swiper-js="buttonContainer"]'
    });
    mvno.RangeDataExtend.init('[data-range-js="DataQnt"]');
    mvno.RangePriceExtend.init('[data-range-js="MonthUseChage"]');
    mvno.BrandExtend.init('.budget-phone-tp');
});

$(document).on('click', '.mvno-popup-modal .dim', function() {
    togglePopup('btnIDNew', 'popupDefaultNew')
});
function deviceChk() {
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
    var agent = navigator.userAgent.toLowerCase();
    if (!isMobile) {
        //PC
        $('html').addClass('desktop');
    } else {
        //MOBILE        
        $('html').removeClass('desktop');
        if (agent.indexOf('android') > -1) {
            // 안드로이드인 경우
        } else if (agent.indexOf("iphone") > -1 || agent.indexOf("ipad") > -1 || agent.indexOf("ipod") > -1) {
            // IOS인 경우
            $('html').addClass('ios');
        }
    }
}
deviceChk();