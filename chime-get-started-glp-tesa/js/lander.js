/* The reference's own two inline scripts, verbatim: the "What happens next" timeline
   (IntersectionObserver fills the line and marks the active step) and the FAQ accordion. */
document.addEventListener("DOMContentLoaded", function () {
        const steps = document.querySelectorAll(".step-item");
        const numbers = document.querySelectorAll(".step-number");
        const lineTop = document.querySelector(".steps-line-top");
        const lineBox = document.querySelector(".steps-lineBox");

        // Intersection Observer to detect active step
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = [...steps].indexOf(entry.target);
                    const number = numbers[index];

                    if (entry.isIntersecting) {
                        // Remove active class from all
                        numbers.forEach((num) => num.classList.remove("active"));

                        // Add active class to the current one
                        number.classList.add("active");

                        // Scroll progress (line-top height)
                        const total = steps.length;
                        const progressPercent = ((index + 1) / total) * 100;

                        lineTop.style.height = progressPercent + "%";
                    }
                });
            },
            {
                threshold: 0.5, // activate when 50% of step item is visible
                rootMargin: "0px 0px -20% 0px"
            }
        );

        steps.forEach((step) => observer.observe(step));

        // ⭐ Reset line when scrolling back above the first step
        window.addEventListener("scroll", () => {
            const firstStepTop = steps[0].getBoundingClientRect().top;

            // When the first step is BELOW the viewport center → user is at the top
            if (firstStepTop > window.innerHeight * 0.3) {
                lineTop.style.height = "0%";
            }
        });
    });

document.querySelectorAll(".faq-question").forEach((btn) => {
        btn.addEventListener("click", () => {

            const parent = btn.closest(".faq-item");

            // Close others (optional)
            document.querySelectorAll(".faq-item.active").forEach(item => {
            if(item !== parent) item.classList.remove("active");
            });

            // Toggle this one
            parent.classList.toggle("active");
        });
        });
