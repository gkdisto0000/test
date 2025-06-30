function includeCommonLayout(options = {}) {
    // header
    fetch("/ai/common/header")
        .then((res) => res.text())
        .then((data) => {
            const headerTarget = document.querySelector(".header-inner");
            if (headerTarget) {
                headerTarget.innerHTML = data;

                //solution 페이지에서만 checkHeader 실행
                if (typeof checkHeader === "function" && window.location.pathname.startsWith("/ai/solution/")) {
                    checkHeader();
                }

                // header.js 동적 로드
                const script = document.createElement("script");
                script.src = "/js/ai/common/header.js";
                document.body.appendChild(script);
            } else {
            }
        });

    // KT Model 체험하기
    if (!options.skipKtModel) {
        fetch("/ai/common/model")
            .then((res) => res.text())
            .then((data) => {
                const modelTarget = document.querySelector(".kt-model-section");
                if (modelTarget) {
                    modelTarget.innerHTML = data;

                    // AOS 다시 초기화
                    if (window.AOS && typeof window.AOS.init === "function") {
                        window.AOS.init();
                    }
                } else {
                }
            });
    }

    //resources Detail banner
    fetch("/ai/common/resourcesBanner")
        .then((res) => res.text())
        .then((data) => {
            const bannerTarget = document.querySelector(".tech-banner-sec");
            if (bannerTarget) {
                bannerTarget.innerHTML = data;
            } else {
            }
        });

    // footer
    fetch("/ai/common/footer")
        .then((res) => res.text())
        .then((data) => {
            const footerTarget = document.querySelector(".footer");
            if (footerTarget) {
                footerTarget.innerHTML = data;
            } else {
            }
        });
}
