// 1. THREE.JS 3D BACKGROUND
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Add Resize Listener (Essential for mobile/laptop switching)
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

camera.position.z = 25; // Adjusted distance for better mobile framing

// Create Floating 3D Object
// const geometry = new THREE.IcosahedronGeometry(12, 1);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xd4af37,
//   wireframe: true,
//   transparent: true,
//   opacity: 0.15,
// });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// camera.position.z = 20;

// function animate3D() {
//   requestAnimationFrame(animate3D);
//   mesh.rotation.x += 0.001;
//   mesh.rotation.y += 0.001;
//   renderer.render(scene, camera);
// }

// Add this to your script.js or replace the old Three.js section
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshBasicMaterial({
  color: 0xd4af37,
  wireframe: true,
  transparent: true,
  opacity: 0.1,
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

function animate3D() {
  requestAnimationFrame(animate3D);
  torusKnot.rotation.x += 0.005;
  torusKnot.rotation.y += 0.003;
  renderer.render(scene, camera);
}
animate3D();

// 2. CURSOR FOLLOW
const cursor = document.querySelector(".cursor");
document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
});

// 3. GSAP ENTRANCE ANIMATIONS
window.addEventListener("load", () => {
  const tl = gsap.timeline();
  tl.from(".navbar", { y: -50, opacity: 0, duration: 1 });

  // Only run if hero elements exist (prevents errors on Services/About/Contact pages)
  if (document.querySelector(".hero-title")) {
    tl.from(".hero-tagline", { x: -30, opacity: 0, duration: 0.5 }, "-=0.5")
      .from(
        ".hero-title",
        { y: 50, opacity: 0, duration: 1, ease: "power4.out" },
        "-=0.3",
      )
      .from(".hero-description", { opacity: 0, duration: 1 }, "-=0.5")
      .from(".hero-btns", { scale: 0.9, opacity: 0, duration: 0.5 }, "-=0.5");
  }
});

// 4. SCROLL REVEAL (Phase 4)
gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray(".reveal").forEach((elem) => {
  gsap.to(elem, {
    scrollTrigger: {
      trigger: elem,
      start: "top 85%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    duration: 1.5,
    ease: "power2.out",
  });
});

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  // Toggle the X-mark
  hamburger.classList.toggle("open");
  // Slide the menu in/out
  navLinks.classList.toggle("mobile-active");

  // Prevent scrolling when menu is open
  if (navLinks.classList.contains("mobile-active")) {
    document.body.style.overflow = "hidden";

    // Premium GSAP staggered entrance for links
    gsap.from(".nav-links a", {
      x: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "back.out(1.7)",
    });
  } else {
    document.body.style.overflow = "auto";
  }
});

// Close menu if a user clicks a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("mobile-active");
    document.body.style.overflow = "auto";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.closest(".faq-item");
      const faqAnswer = faqItem.querySelector(".faq-answer");

      // Close other active answers
      document.querySelectorAll(".faq-item").forEach((item) => {
        if (item !== faqItem) {
          item.querySelector(".faq-question").classList.remove("active");
          item.querySelector(".faq-answer").classList.remove("active");
          item.querySelector(".faq-answer").style.maxHeight = "0";
        }
      });

      // Toggle current answer
      question.classList.toggle("active");
      faqAnswer.classList.toggle("active");

      if (faqAnswer.classList.contains("active")) {
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 30 + "px"; // +30 for padding
      } else {
        faqAnswer.style.maxHeight = "0";
      }
    });
  });
});
