"use strict";

const SITE_CONFIG = {
  // Add the official WhatsApp number including country code.
  // Example format for India: 919876543210
  whatsappNumber: "",
  linkedinUrl: "https://www.linkedin.com/company/stavatech/",
  enquiryEmail: "info@stavatech.co.in",
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");

function handleScroll() {
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 24);
  backToTop?.classList.toggle("visible", y > 600);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  }
}
window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));

// Accessible mobile navigation.
const menuButton = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
function setMenu(open) {
  if (!menuButton || !navLinks) return;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navLinks.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
}
menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
navLinks?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 1023) setMenu(false);
});

// Match the active nav item to the current static page.
const pageName = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.getAttribute("href")?.split("#")[0] === pageName) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

// Hero crossfade stops when motion is reduced or the tab is hidden.
const heroSlides = [...document.querySelectorAll(".hero-slide")];
let heroIndex = 0;
let heroTimer;
function advanceHero() {
  heroSlides[heroIndex]?.classList.remove("active");
  heroIndex = (heroIndex + 1) % heroSlides.length;
  heroSlides[heroIndex]?.classList.add("active");
}
function manageHeroTimer() {
  clearInterval(heroTimer);
  if (heroSlides.length > 1 && !reducedMotion && !document.hidden) heroTimer = setInterval(advanceHero, 5500);
}
document.addEventListener("visibilitychange", manageHeroTimer);
manageHeroTimer();

// Progressive reveal system. Content remains visible if IntersectionObserver is unavailable.
const revealItems = document.querySelectorAll(".reveal");
if (!reducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Service carousels: buttons, arrow keys and horizontal swipe.
document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  const count = carousel.querySelector(".carousel-count");
  let index = 0;
  let touchStart = 0;
  const show = (next) => {
    if (!slides.length) return;
    slides[index].classList.remove("active");
    index = (next + slides.length) % slides.length;
    slides[index].classList.add("active");
    if (count) count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  };
  carousel.querySelector("[data-prev]")?.addEventListener("click", () => show(index - 1));
  carousel.querySelector("[data-next]")?.addEventListener("click", () => show(index + 1));
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
  carousel.addEventListener("touchstart", (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  carousel.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 45) show(index + (delta < 0 ? 1 : -1));
  }, { passive: true });
  show(0);
});

// Desktop-only card spotlight.
if (finePointer && !reducedMotion) {
  document.querySelectorAll(".tech-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--y", `${event.clientY - rect.top}px`);
    });
  });
}

function showToast(message) {
  const toast = document.querySelector(".toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3600);
}

function enquiryText(form) {
  const data = new FormData(form);
  return [
    `Hello StavaTech, my name is ${data.get("name") || ""}.`,
    `Email: ${data.get("email") || ""}`,
    `Phone: ${data.get("phone") || "Not provided"}`,
    `Company: ${data.get("company") || "Not provided"}`,
    `I'm interested in: ${data.get("service") || "General enquiry"}`,
    `Message: ${data.get("message") || ""}`,
  ].join("\n");
}

// Static-host-safe contact actions: hand off to the visitor's email or WhatsApp app.
const enquiryForm = document.querySelector("#contactForm");
document.querySelector("#sendEmail")?.addEventListener("click", () => {
  if (!enquiryForm?.reportValidity()) return;
  const subject = encodeURIComponent(`Website enquiry — ${new FormData(enquiryForm).get("service") || "StavaTech"}`);
  window.location.href = `mailto:${SITE_CONFIG.enquiryEmail}?subject=${subject}&body=${encodeURIComponent(enquiryText(enquiryForm))}`;
});
document.querySelector("#sendWhatsApp")?.addEventListener("click", () => {
  if (!enquiryForm?.reportValidity()) return;
  if (!SITE_CONFIG.whatsappNumber) {
    showToast("WhatsApp is awaiting the official company number. Please use Send by Email.");
    return;
  }
  window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(enquiryText(enquiryForm))}`, "_blank", "noopener,noreferrer");
});
enquiryForm?.addEventListener("submit", (event) => event.preventDefault());

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (!SITE_CONFIG.whatsappNumber) {
      showToast("WhatsApp is awaiting the official company number. Please contact us by email.");
      return;
    }
    const greeting = "Hello StavaTech, I would like to discuss a technology/automation project with your team.";
    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(greeting)}`, "_blank", "noopener,noreferrer");
  });
});

// The login screen is intentionally an integration preview, never a fake client-side login.
document.querySelector("#loginForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Secure account access is not connected yet. No credentials were submitted.");
});
