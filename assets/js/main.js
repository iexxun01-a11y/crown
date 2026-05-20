(() => {
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const page = document.body.dataset.page;

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (navToggle && header && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    });

    nav.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;

      header.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "메뉴 열기");

      const href = link.getAttribute("href");
      if (href && !href.startsWith("#") && !link.target) {
        event.preventDefault();
        window.location.href = new URL(href, window.location.href).href;
      }
    });
  }

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    if (link.dataset.navLink === page) link.classList.add("is-active");
  });

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const prevButton = document.querySelector("[data-slide-prev]");
  const nextButton = document.querySelector("[data-slide-next]");
  let currentSlide = 0;
  let slideTimer;

  const showSlide = (index) => {
    if (!slides.length) return;
    slides[currentSlide].classList.remove("is-active");
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("is-active");
  };

  const startSlider = () => {
    if (slides.length < 2) return;
    slideTimer = window.setInterval(() => showSlide(currentSlide + 1), 5200);
  };

  const restartSlider = () => {
    window.clearInterval(slideTimer);
    startSlider();
  };

  if (slides.length) {
    startSlider();
    prevButton?.addEventListener("click", () => {
      showSlide(currentSlide - 1);
      restartSlider();
    });
    nextButton?.addEventListener("click", () => {
      showSlide(currentSlide + 1);
      restartSlider();
    });
  }

  document.querySelectorAll("[data-bg-rotator]").forEach((rotator) => {
    const images = Array.from(rotator.querySelectorAll("img"));
    if (!images.length) return;

    let active = 0;
    images[0].classList.add("is-active");
    if (images.length < 2) return;

    window.setInterval(() => {
      images[active].classList.remove("is-active");
      active = (active + 1) % images.length;
      images[active].classList.add("is-active");
    }, 4800);
  });

  document.querySelectorAll("[data-banner-carousel]").forEach((carousel) => {
    const banners = Array.from(carousel.querySelectorAll(".banner-slide"));
    const progress = carousel.parentElement?.querySelector("[data-banner-progress]");
    const prev = carousel.parentElement?.querySelector("[data-banner-prev]");
    const next = carousel.parentElement?.querySelector("[data-banner-next]");
    if (banners.length < 2) return;

    let activeBanner = banners.findIndex((banner) => banner.classList.contains("is-active"));
    if (activeBanner < 0) activeBanner = 0;

    const updateBanner = () => {
      banners.forEach((banner, index) => banner.classList.toggle("is-active", index === activeBanner));
      if (progress) progress.style.transform = `translateX(${activeBanner * 100}%)`;
    };

    const goBanner = (direction = 1) => {
      activeBanner = (activeBanner + direction + banners.length) % banners.length;
      updateBanner();
    };

    prev?.addEventListener("click", () => goBanner(-1));
    next?.addEventListener("click", () => goBanner(1));
    window.setInterval(() => {
      activeBanner = (activeBanner + 1) % banners.length;
      updateBanner();
    }, 4600);
    updateBanner();
  });

  const topicRail = document.querySelector("[data-topic-rail]");
  const railPrev = document.querySelector("[data-rail-prev]");
  const railNext = document.querySelector("[data-rail-next]");
  if (topicRail) {
    const scrollRail = (direction) => {
      const card = topicRail.querySelector("a");
      const amount = card ? card.getBoundingClientRect().width + 22 : 260;
      topicRail.scrollBy({ left: amount * direction, behavior: "smooth" });
    };
    railPrev?.addEventListener("click", () => scrollRail(-1));
    railNext?.addEventListener("click", () => scrollRail(1));
  }

  const setupMobileDots = (selector) => {
    document.querySelectorAll(selector).forEach((track) => {
      const cards = Array.from(track.children).filter((child) => child.nodeType === 1);
      if (cards.length < 2 || track.nextElementSibling?.classList.contains("mobile-carousel-dots")) return;

      const dots = document.createElement("div");
      dots.className = "mobile-carousel-dots";
      cards.forEach((_, index) => {
        const dot = document.createElement("span");
        if (index === 0) dot.classList.add("is-active");
        dot.addEventListener("click", () => {
          cards[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
        });
        dots.appendChild(dot);
      });
      track.insertAdjacentElement("afterend", dots);

      const updateDots = () => {
        if (!window.matchMedia("(max-width: 768px)").matches) return;
        const trackLeft = track.getBoundingClientRect().left;
        let active = 0;
        let minDistance = Infinity;
        cards.forEach((card, index) => {
          const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
          if (distance < minDistance) {
            minDistance = distance;
            active = index;
          }
        });
        Array.from(dots.children).forEach((dot, index) => dot.classList.toggle("is-active", index === active));
      };

      track.addEventListener("scroll", updateDots, { passive: true });
      window.addEventListener("resize", updateDots);
      updateDots();
    });
  };

  setupMobileDots(".service-directory");
  setupMobileDots(".city-best-grid");
  setupMobileDots(".city-route-panels");
  setupMobileDots(".mobility-service-grid");
  setupMobileDots(".review-grid");
  setupMobileDots(".service-grid");
  setupMobileDots(".course-showcase");
  setupMobileDots(".city-photo-grid");
  setupMobileDots(".service-route-visual");
  setupMobileDots(".cinematic-grid");
  setupMobileDots(".guide-board");
  setupMobileDots(".city-food-grid");

  document.querySelectorAll("img").forEach((img) => {
    const markMissing = () => {
      img.classList.add("is-broken");
      const holder = img.closest("article, figure, .editorial-image, .sub-hero-bg, .hero-slide, .image-cta");
      holder?.classList.add("image-missing");
    };
    if (img.complete && img.naturalWidth === 0) {
      markMissing();
    } else {
      img.addEventListener("error", markMissing, { once: true });
    }
  });

  const popup = document.querySelector("[data-event-popup]");
  const closePopup = document.querySelector("[data-popup-close]");
  const hideDayButton = document.querySelector("[data-popup-hide-day]");
  const popupStorageKey = "danangEventPopupHiddenUntilV2";

  const hidePopup = () => {
    if (!popup) return;
    popup.classList.remove("is-visible");
    popup.setAttribute("aria-hidden", "true");
  };

  if (popup && page === "home") {
    const hiddenUntil = Number(localStorage.getItem(popupStorageKey) || 0);
    if (Date.now() > hiddenUntil) {
      window.setTimeout(() => {
        popup.classList.add("is-visible");
        popup.setAttribute("aria-hidden", "false");
      }, 350);
    }

    closePopup?.addEventListener("click", hidePopup);
    popup.addEventListener("click", (event) => {
      if (event.target === popup) hidePopup();
    });
    hideDayButton?.addEventListener("click", () => {
      localStorage.setItem(popupStorageKey, String(Date.now() + 24 * 60 * 60 * 1000));
      hidePopup();
    });
  }

  const visitorNodes = document.querySelectorAll("[data-visitor-count]");
  if (visitorNodes.length) {
    // 議고쉶???쒖옉媛??섏젙 ?꾩튂
    const baseVisitors = 18420;
    // ?섎（ 利앷? ?⑥쐞 ?섏젙 ?꾩튂
    const visitorsPerDay = 100;
    const baseDate = new Date("2026-05-01T00:00:00+09:00");
    const today = new Date();
    const dayGap = Math.max(0, Math.floor((today - baseDate) / 86400000));
    const stableDailyVariation = (dayGap * 37) % 41;
    const gentleLoadVariation = Math.floor(Math.random() * 7);
    const visitors = baseVisitors + dayGap * visitorsPerDay + stableDailyVariation + gentleLoadVariation;

    visitorNodes.forEach((node) => {
      node.textContent = visitors.toLocaleString("ko-KR");
    });
  }

  const usdInput = document.querySelector("[data-usd-input]");
  const rateInput = document.querySelector("[data-rate-input]");
  const vndOutput = document.querySelector("[data-vnd-output]");
  const updateExchange = () => {
    if (!usdInput || !rateInput || !vndOutput) return;
    const usd = Number(usdInput.value || 0);
    const rate = Number(rateInput.value || 0);
    vndOutput.textContent = Math.round(usd * rate).toLocaleString("ko-KR");
  };
  usdInput?.addEventListener("input", updateExchange);
  rateInput?.addEventListener("input", updateExchange);
  updateExchange();

  document.querySelectorAll("[data-accordion]").forEach((accordion) => {
    accordion.addEventListener("click", (event) => {
      const button = event.target.closest(".faq-item button");
      if (!button) return;

      const item = button.closest(".faq-item");
      const isOpen = item.classList.contains("is-open");

      item.classList.toggle("is-open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  const revealItems = document.querySelectorAll(".reveal-on-scroll, .editorial-split, .service-group, .cinematic-grid figure");
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    revealItems.forEach((item) => {
      item.classList.add("reveal-on-scroll");
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  if (!document.querySelector(".mobile-quick-nav")) {
    const quickNav = document.createElement("nav");
    quickNav.className = "mobile-quick-nav";
    quickNav.setAttribute("aria-label", "모바일 빠른 메뉴");
    quickNav.innerHTML = `
      <a href="/crown/index.html"><span>홈</span></a>
      <a href="/crown/hoiana.html"><span>카지노</span></a>
      <a href="/crown/services/index.html"><span>서비스</span></a>
      <a href="#contact"><span>문의</span></a>
    `;
    document.body.appendChild(quickNav);
  }
})();
