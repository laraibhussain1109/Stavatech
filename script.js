/*menu*/

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
  menuBtn.addEventListener("click", function () {
    navLinks.classList.toggle("show");
  });
}

/*closemenu*/

const links = document.querySelectorAll(".nav-links a");

links.forEach(function (link) {
  link.addEventListener("click", function () {
    if (navLinks) {
      navLinks.classList.remove("show");
    }
  });
});

/*HERO IMAGE SLIDESHOW*/

const slides = document.querySelectorAll(".slide");

let currentSlide = 0;

function showNextSlide() {
  if (slides.length === 0) {
    return;
  }

  slides[currentSlide].classList.remove("active");
  slides[currentSlide].classList.add("previous");

  // Move to next slide
  currentSlide++;

  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  slides[currentSlide].classList.remove("previous");
  slides[currentSlide].classList.add("active");

  slides.forEach((slide, index) => {
    if (index !== currentSlide) {
      setTimeout(() => {
        slide.classList.remove("previous");
      }, 1000);
    }
  });
}

/* Change image*/
if (slides.length > 0) {
  setInterval(showNextSlide, 5000);
}

/* active nav link*/

const currentPage = window.location.pathname.split("/").pop();

links.forEach(function (link) {
  const linkPage = link.getAttribute("href");
  if (
    linkPage === currentPage ||
    (currentPage === "" && linkPage === "index.html")
  ) {
    link.classList.add("active");
  }
});

/*back to top*/

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
  if (backToTop) {
    if (window.scrollY > 300) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  }
});

if (backToTop) {
  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/*contact form*/

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Thank you! Your message has been submitted.");
    contactForm.reset();
  });
}

/*scroll animation*/

const cards = document.querySelectorAll(
  ".service-card, .product-card, .about-text, .about-image",
);

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  {
    threshold: 0.15,
  },
);

cards.forEach(function (card) {
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = "all 0.6s ease";
  observer.observe(card);
});

/*VISIT COUNTER */

//for reseting count to 0:
//localStorage.setItem("visitCount", 0);

let visits = localStorage.getItem("visitCount");

if (visits === null) {
  visits = 1;
} else {
  visits = parseInt(visits) + 1;
}

localStorage.setItem("visitCount", visits);

const counter = document.getElementById("visitCount");

let current = 0;
const target = visits;
const duration = 1500; // 1.5 seconds

const increment = target / (duration / 20);

const counterAnimation = setInterval(() => {
  current += increment;

  if (current >= target) {
    current = target;
    clearInterval(counterAnimation);
  }

  counter.textContent = Math.floor(current);
}, 20);

const repairTarget = 500;
const repairCounter = document.getElementById("repairCount");

let repairCurrent = 0;

const repairAnimation = setInterval(() => {
  repairCurrent += 5;

  if (repairCurrent >= repairTarget) {
    repairCurrent = repairTarget;
    clearInterval(repairAnimation);
  }

  repairCounter.textContent = repairCurrent + "+";
}, 20);

function changeImage(button, direction) {
  const slider = button.closest(".card-image-slider");

  const mainImage = slider.querySelector(":scope > img");

  const images = slider.querySelectorAll(".slider-images img");

  let currentIndex = 0;

  // Find the current image
  images.forEach((image, index) => {
    if (image.src === mainImage.src) {
      currentIndex = index;
    }
  });

  // Move to next/previous image
  currentIndex += direction;

  //last image from first
  if (currentIndex < 0) {
    currentIndex = images.length - 1;
  }

  //first image after last
  if (currentIndex >= images.length) {
    currentIndex = 0;
  }

  // Change image
  mainImage.src = images[currentIndex].src;
}
