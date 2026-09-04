AOS.init();

$(".slider").slick({
  slidesToShow: 5,
  slidesToScroll: 1,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 0,
  speed: 3000,
  cssEase: "linear",
  arrows: false,
  dots: false,
  pauseOnHover: false,
  pauseOnFocus: false,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
});

$(".testimonial-slider").slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  infinite: true,
  arrows: true,
  dots: true,
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 800,
  pauseOnHover: false,
  prevArrow: `
      <button class="slick-prev absolute left-[-10px] top-1/2 -translate-y-1/2 z-10 bg-green-900 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg">
        ❮
      </button>
    `,
  nextArrow: `
      <button class="slick-next absolute right-[-10px] top-1/2 -translate-y-1/2 z-10 bg-green-900 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg">
        ❯
      </button>
    `,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
});

// accordian
const accordions = document.querySelectorAll(".accordion-item");

accordions.forEach((item, index) => {
  const btn = item.querySelector(".accordion-btn");
  const content = item.querySelector(".accordion-content");
  const icon = item.querySelector(".accordion-icon");

  // First item open by default
  if (index === 0) {
    content.style.height = content.scrollHeight + "px";
    icon.textContent = "−";
  }

  btn.addEventListener("click", () => {
    const isOpen = content.style.height && content.style.height !== "0px";

    // Close all
    accordions.forEach((accordion) => {
      const c = accordion.querySelector(".accordion-content");
      const i = accordion.querySelector(".accordion-icon");

      c.style.height = "0px";
      i.textContent = "+";
    });

    // Open clicked item
    if (!isOpen) {
      content.style.height = content.scrollHeight + "px";
      icon.textContent = "−";
    }
  });
});

// FAQ Load More
const faqLoadMoreBtn = document.getElementById('faqLoadMore');
if (faqLoadMoreBtn) {
  faqLoadMoreBtn.addEventListener('click', () => {
    const hidden = Array.from(
      document.querySelectorAll('#faqAccordion .accordion-item')
    ).filter(el => el.style.display === 'none');

    hidden.slice(0, 5).forEach(el => {
      el.style.display = '';
      // initialise accordion height for newly revealed items
      const c = el.querySelector('.accordion-content');
      if (c && !c.style.height) c.style.height = '0px';
    });

    if (hidden.length <= 5) {
      faqLoadMoreBtn.style.display = 'none';
    }
  });
}

// menu toggle
function highlightDiv() {
  var targetDiv = document.getElementById("targetDiv");
  targetDiv.classList.toggle("hidden");
}
