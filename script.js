/**
 * 7FIGURE AXIS - MULTIVERSE & VAULT MASTER SCRIPT
 * Finalized Version for Olubode A. James
 */

// 1. ENTRANCE & PAGE INITIALIZATION
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  const overlay = document.querySelector(".initial-load-overlay");
  document.body.classList.add("loaded");
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

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
    document.body.style.overflow = "auto";
  }

  tl.from(".navbar", { y: -100, opacity: 0, duration: 1.2 }, "-=0.6")
    .from(
      ".hero-title",
      { y: 80, opacity: 0, stagger: 0.15, duration: 1.5 },
      "-=1.4",
    )
    .from(".hero-description", { opacity: 0, y: 30, duration: 1 }, "-=1")
    .from(".hero-btns", { scale: 0.9, opacity: 0, duration: 0.8 }, "-=0.8");
});

// 2. THREE.JS 3D MULTIVERSE (Kept as provided)
const container = document.querySelector("#canvas-container");
if (container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const particlesGeometry = new THREE.BufferGeometry();
  const count = 7000;
  const posArray = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) posArray[i] = (Math.random() - 0.5) * 30;
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3),
  );
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: "#D4AF37",
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  const mainPlanetGeom = new THREE.IcosahedronGeometry(1.8, 4);
  const mainPlanetMat = new THREE.MeshBasicMaterial({
    color: "#D4AF37",
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });
  const masterPlanet = new THREE.Mesh(mainPlanetGeom, mainPlanetMat);
  masterPlanet.position.set(0, 1, -4);
  scene.add(masterPlanet);

  const satellites = [];
  for (let i = 0; i < 3; i++) {
    const satGeom = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const satMat = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      wireframe: true,
    });
    const sat = new THREE.Mesh(satGeom, satMat);
    sat.userData = {
      orbit: 2.5,
      speed: 0.01 + i * 0.005,
      angle: Math.random() * Math.PI,
    };
    satellites.push(sat);
    scene.add(sat);
  }

  const planets = [];
  const planetSizes = [0.4, 0.15, 0.2, 0.22, 0.5, 0.45, 0.3, 0.25, 0.1];
  for (let i = 0; i < 9; i++) {
    const geometry = new THREE.IcosahedronGeometry(planetSizes[i], 2);
    const material = new THREE.MeshBasicMaterial({
      color: "#D4AF37",
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.userData = {
      distance: Math.random() * 6 + 4,
      speed: Math.random() * 0.004 + 0.001,
      angle: Math.random() * Math.PI * 2,
    };
    planets.push(planet);
    scene.add(planet);
  }

  camera.position.z = 5;
  let mouseX = 0,
    mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  let time = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    time += 0.01;
    const pulse = 1 + Math.sin(time * 0.5) * 0.1;
    masterPlanet.scale.set(pulse, pulse, pulse);
    masterPlanet.rotation.y += 0.002;
    satellites.forEach((s) => {
      s.userData.angle += s.userData.speed;
      s.position.x =
        masterPlanet.position.x + Math.cos(s.userData.angle) * s.userData.orbit;
      s.position.z =
        masterPlanet.position.z + Math.sin(s.userData.angle) * s.userData.orbit;
      s.rotation.x += 0.02;
    });
    planets.forEach((p) => {
      p.userData.angle += p.userData.speed;
      p.position.x = Math.cos(p.userData.angle) * p.userData.distance;
      p.position.z = Math.sin(p.userData.angle) * p.userData.distance - 3;
    });
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  };
  animate();
}

// 3. VAULT FILTERING LOGIC
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".proof-card");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const filterValue = button.getAttribute("data-filter");
      gsap.to(items, {
        duration: 0.3,
        scale: 0.8,
        opacity: 0,
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
});

// 4. UI INTERACTIONS (CURSOR & NAVIGATION)
const cursor = document.querySelector(".cursor");
document.addEventListener("mousemove", (e) => {
  if (cursor) gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.2 });
});

const interactives = document.querySelectorAll(
  "a, button, .story-card, .hamburger, .proof-card, .faq-question",
);
interactives.forEach((el) => {
  el.addEventListener(
    "mouseenter",
    () =>
      cursor &&
      gsap.to(cursor, {
        scale: 3.5,
        backgroundColor: "rgba(212, 175, 55, 0.2)",
      }),
  );
  el.addEventListener(
    "mouseleave",
    () => cursor && gsap.to(cursor, { scale: 1, backgroundColor: "#d4af37" }),
  );
});

// Scroll Reveal
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

// MOBILE NAVIGATION - UPDATED WITH GSAP
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const links = document.querySelectorAll(".nav-links a");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("active");

    // Toggle Classes
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");

    // Premium Link Animation
    if (!isOpen) {
      gsap.fromTo(
        links,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "power4.out",
          delay: 0.3,
        },
      );
    }
  });

  // Close menu when a link is clicked
  links.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}

// Back to Top
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    window.scrollY > 600
      ? backToTopBtn.classList.add("show")
      : backToTopBtn.classList.remove("show");
  });
  backToTopBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}
