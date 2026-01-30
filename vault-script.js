document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".proof-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      // GSAP Shuffle Effect
      gsap.to(items, {
        duration: 0.4,
        scale: 0.8,
        opacity: 1,
        ease: "power2.in",
        onComplete: () => {
          items.forEach((item) => {
            if (filterValue === "all" || item.classList.contains(filterValue)) {
              item.style.display = "block";
              gsap.to(item, {
                duration: 0.6,
                scale: 1,
                opacity: 1,
                ease: "back.out(1.7)",
              });
            } else {
              item.style.display = "none";
            }
          });
        },
      });
    });
  });

  // Reveal animations for scroll
  gsap.from(".store-card", {
    scrollTrigger: ".store-grid",
    y: 50,
    opacity: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: "power4.out",
  });
});
