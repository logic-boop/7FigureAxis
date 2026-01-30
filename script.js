/**
 * 7FIGURE AXIS - ELITE PERFORMANCE SCRIPT
 * Finalized Version for Olubode A. James
 */

// 1. ENTRANCE ANIMATION & PRELOADER FAILSAFE
window.addEventListener("load", () => {
  // Ensure the page starts at the top for the best entrance effect
  window.scrollTo(0, 0);

  const overlay = document.querySelector(".initial-load-overlay");

  // High-performance trigger for the CSS opacity transition
  document.body.classList.add("loaded");

  const tl = gsap.timeline({
    defaults: { ease: "power4.out" },
  });

  // PRELOADER LOGIC: Checks if overlay exists to prevent script crashes
  if (overlay) {
    tl.to(overlay, {
      opacity: 0,
      duration: 1.2,
      delay: 0.8,
      onComplete: () => {
        overlay.style.display = "none";
        document.body.style.overflow = "auto";
      },
    });
  } else {
    // Failsafe: If HTML is missing the overlay, just unlock the scroll
    document.body.style.overflow = "auto";
    tl.set({}, { delay: 0.1 });
  }

  // ELITE ENTRANCE SEQUENCE (The "Ease Motion" reveal)
  tl.from(
    ".navbar",
    {
      y: -100,
      opacity: 0,
      duration: 1.2,
    },
    "-=0.6",
  )
    .from(
      ".hero-bg-logo",
      {
        scale: 0.6,
        opacity: 0,
        duration: 2,
        ease: "power2.out",
      },
      "-=1",
    )
    .from(
      ".hero-title",
      {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1.5,
      },
      "-=1.4",
    )
    .from(
      ".hero-description",
      {
        opacity: 1,
        y: 30,
        duration: 1,
      },
      "-=1",
    )
    .from(
      ".hero-btns",
      {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
      },
      "-=0.8",
    );
});

// 2. THREE.JS 3D BACKGROUND (THE GOLDEN AXIS)
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

  // High-detail Torus Knot for a premium mathematical feel
  const geometry = new THREE.TorusKnotGeometry(12, 3.5, 180, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0xd4af37, // Brand Gold
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });

  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);
  camera.position.z = 30;

  function animate3D() {
    requestAnimationFrame(animate3D);
    const scrollY = window.scrollY;

    // Dynamic rotation that responds to user scrolling
    torusKnot.rotation.x += 0.002 + scrollY * 0.00005;
    torusKnot.rotation.y += 0.001 + scrollY * 0.00005;

    renderer.render(scene, camera);
  }
  animate3D();
}

// 3. CURSOR & LOGO PARALLAX PHYSICS
const hero = document.querySelector(".hero");
const bgLogo = document.querySelector(".hero-bg-logo");
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  const { clientX, clientY } = e;

  // Custom Cursor movement
  if (cursor) {
    gsap.to(cursor, {
      x: clientX,
      y: clientY,
      duration: 0.2,
      ease: "power2.out",
    });
  }

  // 3D Background Logo Tilt
  if (hero && bgLogo) {
    const xPos = (clientX / window.innerWidth - 0.5) * 35;
    const yPos = (clientY / window.innerHeight - 0.5) * 35;

    gsap.to(bgLogo, {
      rotationY: xPos,
      rotationX: -yPos,
      transformPerspective: 1200,
      duration: 1.8,
      ease: "power3.out",
    });
  }
});

// Cursor Interaction States
const interactives = document.querySelectorAll(
  "a, button, .story-card, .hamburger",
);
interactives.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    if (cursor)
      gsap.to(cursor, {
        scale: 3.5,
        backgroundColor: "rgba(212, 175, 55, 0.25)",
      });
  });
  el.addEventListener("mouseleave", () => {
    if (cursor) gsap.to(cursor, { scale: 1, backgroundColor: "#d4af37" });
  });
});

// 4. SCROLL ENGINE (GSAP REVEALS)
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".reveal").forEach((elem) => {
  gsap.to(elem, {
    scrollTrigger: {
      trigger: elem,
      start: "top 88%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    duration: 1.4,
    ease: "power3.out",
  });
});

// 5. STORY CARD INTERACTION
const cards = document.querySelectorAll(".story-card");
cards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, {
      y: -15,
      scale: 1.03,
      borderColor: "#d4af37",
      boxShadow:
        "0 20px 50px rgba(0,0,0,0.7), 0 0 20px rgba(212, 175, 55, 0.15)",
      duration: 0.4,
    });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      y: 0,
      scale: 1,
      borderColor: "#1a1a1a",
      boxShadow: "none",
      duration: 0.4,
    });
  });
});

// 6. MARQUEE & MOBILE NAVIGATION
const track = document.querySelector(".marquee-track");
if (track) {
  track.addEventListener(
    "mouseenter",
    () => (track.style.animationPlayState = "paused"),
  );
  track.addEventListener(
    "mouseleave",
    () => (track.style.animationPlayState = "running"),
  );
}

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const links = document.querySelectorAll(".nav-links a");

hamburger.addEventListener("click", () => {
  const isOpening = !hamburger.classList.contains("active");

  // Toggle Hamburger Animation
  hamburger.classList.toggle("active");

  // Toggle Menu Visibility
  navLinks.classList.toggle("active");

  if (isOpening) {
    // Premium 3D Stagger Entrance
    gsap.to(links, {
      opacity: 1,
      rotationX: 0,
      z: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power4.out",
      delay: 0.2,
    });
  } else {
    // Smooth Exit
    gsap.to(links, {
      opacity: 0,
      rotationX: -90,
      z: -100,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in",
    });
  }
});

// Close menu when a link is clicked
links.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

// 7. RESPONSIVE RESIZE
window.addEventListener("resize", () => {
  if (canvasContainer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});

const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 600) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

backToTopBtn.addEventListener("click", () => {
  // 3D Press Effect: Make it look like it's being pushed into the screen
  backToTopBtn.style.transform = "scale(0.9) translateZ(-10px)";

  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 100);
});
