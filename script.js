// 1. THREE.JS 3D BACKGROUND
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const canvasContainer = document.getElementById("canvas-container");

if (canvasContainer) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(renderer.domElement);

  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00f2ff,
    wireframe: true,
    transparent: true,
    opacity: 0.1,
  });
  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  camera.position.z = 25;

  function animate3D() {
    requestAnimationFrame(animate3D);
    const scrollSpeed = window.scrollY * 0.0001;
    torusKnot.rotation.x += 0.005 + scrollSpeed;
    torusKnot.rotation.y += 0.003 + scrollSpeed;
    renderer.render(scene, camera);
  }
  animate3D();
}

// 2. CURSOR LOGIC (FIXED: Standard Pointer + GSAP Follower)
const cursor = document.querySelector(".cursor");
if (cursor) {
  // Make sure the custom cursor doesn't block clicks
  cursor.style.pointerEvents = "none";

  document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: "power2.out",
    });
  });

  // Scale effect on hoverable elements
  const interactives = document.querySelectorAll(
    "a, button, .work-item, .tile, .faq-question",
  );
  interactives.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      gsap.to(cursor, {
        scale: 1.5,
        backgroundColor: "rgba(0, 242, 255, 0.2)",
        duration: 0.3,
      });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "transparent",
        duration: 0.3,
      });
    });
  });
}

// 3. GHOST REVEAL & MAGNETIC PROJECT LIST
const workItems = document.querySelectorAll(".work-item");
const hoverReveal = document.querySelector(".project-hover-reveal");
const hoverImage = document.querySelector(".hover-reveal-img");

if (workItems.length > 0 && hoverReveal) {
  workItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const imgPath = item.getAttribute("data-img");
      if (hoverImage) hoverImage.src = imgPath;
      gsap.to(hoverReveal, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });
    item.addEventListener("mouseleave", () => {
      gsap.to(hoverReveal, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.in",
      });
    });
    item.addEventListener("mousemove", (e) => {
      gsap.to(hoverReveal, {
        x: e.clientX + 20,
        y: e.clientY - 125,
        duration: 0.8,
        ease: "power3.out",
      });
      if (hoverImage)
        gsap.to(hoverImage, { rotation: e.movementX * 0.5, duration: 0.8 });
    });
  });
}

// 4. PURE CODE FORM HANDLER
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector("button");
    const originalText = btn.innerText;
    btn.innerText = "INITIATING SECURE TRANSIT...";

    const inputs = contactForm.querySelectorAll("input");
    const textArea = contactForm.querySelector("textarea");

    const payload = {
      name: inputs[0].value,
      email: inputs[1].value,
      subject: inputs[2].value,
      message: textArea ? textArea.value : "",
    };

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        btn.innerText = "HANDSHAKE SUCCESS ✓";
        contactForm.reset();
      } else {
        throw new Error();
      }
    } catch (err) {
      btn.innerText = "TRANSIT ERROR! RETRY";
    }
    setTimeout(() => {
      btn.innerText = originalText;
    }, 3000);
  });
}

// 5. GSAP ENTRANCE & SCROLL REVEALS
gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  const tl = gsap.timeline();
  tl.from(".navbar", { y: -50, opacity: 0, duration: 1 });
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

// Staggered reveals for project items
if (document.querySelector(".Ws")) {
  gsap.from(".work-item", {
    scrollTrigger: { trigger: ".Ws", start: "top 80%" },
    y: 50,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
  });
}

// Global Reveal Class
gsap.utils.toArray(".reveal").forEach((elem) => {
  gsap.to(elem, {
    scrollTrigger: {
      trigger: elem,
      start: "top 85%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
  });
});

// 6. NAVIGATION LOGIC
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("mobile-active");
    document.body.style.overflow = navLinks.classList.contains("mobile-active")
      ? "hidden"
      : "auto";
    if (navLinks.classList.contains("mobile-active")) {
      gsap.from(".nav-links a", {
        x: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
    }
  });
}

// Window Resize Fix
window.addEventListener("resize", () => {
  if (canvasContainer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});
