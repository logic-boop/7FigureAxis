/**
 * 7FIGURE AXIS - THE VAULT MASTER SCRIPT
 * Integrated 3D Multiverse + Results Filtering
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. ENTRANCE ANIMATIONS
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  // Preloader Failsafe
  const overlay = document.querySelector(".initial-load-overlay");
  if (overlay) {
    tl.to(overlay, {
      opacity: 0,
      duration: 1.2,
      delay: 1,
      onComplete: () => {
        overlay.style.display = "none";
        document.body.style.overflow = "auto";
      },
    });
  }

  tl.from(".navbar", { y: -100, opacity: 0, duration: 1.2 }, "-=0.5").from(
    ".reveal",
    { y: 50, opacity: 0, stagger: 0.2, duration: 1.2 },
    "-=0.8",
  );

  // 2. THREE.JS MULTIVERSE (Planets, Satellites, Pulse)
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

    // --- Starfield ---
    const starGeom = new THREE.BufferGeometry();
    const starCount = 6000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 40;
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.006,
      color: "#D4AF37",
      transparent: true,
      opacity: 0.5,
    });
    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // --- Master 7-Figure Planet (The Breathing Center) ---
    const masterGeom = new THREE.IcosahedronGeometry(1.8, 4);
    const masterMat = new THREE.MeshBasicMaterial({
      color: "#D4AF37",
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const masterPlanet = new THREE.Mesh(masterGeom, masterMat);
    masterPlanet.position.set(0, 1, -5);
    scene.add(masterPlanet);

    // --- Satellites ---
    const satellites = [];
    for (let i = 0; i < 3; i++) {
      const sat = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.06, 0.06),
        new THREE.MeshBasicMaterial({ color: "#ffffff", wireframe: true }),
      );
      sat.userData = {
        orbit: 2.5,
        speed: 0.008 + i * 0.004,
        angle: Math.random() * Math.PI * 2,
      };
      satellites.push(sat);
      scene.add(sat);
    }

    // --- 9 Planet System ---
    const planets = [];
    const sizes = [0.4, 0.15, 0.2, 0.22, 0.5, 0.45, 0.3, 0.25, 0.1];
    for (let i = 0; i < 9; i++) {
      const p = new THREE.Mesh(
        new THREE.IcosahedronGeometry(sizes[i], 2),
        new THREE.MeshBasicMaterial({
          color: "#D4AF37",
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        }),
      );
      p.userData = {
        distance: 6 + i * 1.5,
        speed: 0.001 + Math.random() * 0.002,
        angle: Math.random() * 6,
      };
      planets.push(p);
      scene.add(p);
    }

    camera.position.z = 7;
    let mouseX = 0,
      mouseY = 0;
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    });

    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.015;

      // Breathing Pulse Logic
      const pulse = 1 + Math.sin(time * 0.5) * 0.1;
      masterPlanet.scale.set(pulse, pulse, pulse);
      masterPlanet.rotation.y += 0.002;

      // Satellite Orbits
      satellites.forEach((s) => {
        s.userData.angle += s.userData.speed;
        s.position.x =
          masterPlanet.position.x +
          Math.cos(s.userData.angle) * s.userData.orbit;
        s.position.z =
          masterPlanet.position.z +
          Math.sin(s.userData.angle) * s.userData.orbit;
        s.rotation.x += 0.02;
        s.rotation.y += 0.02;
      });

      // 9 Planets Orbits
      planets.forEach((p) => {
        p.userData.angle += p.userData.speed;
        p.position.x = Math.cos(p.userData.angle) * p.userData.distance;
        p.position.z = Math.sin(p.userData.angle) * p.userData.distance - 5;
        p.rotation.y += 0.01;
      });

      starField.rotation.y += 0.0003;

      // Mouse Parallax
      camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();
  }

  // 3. VAULT FILTERING & CAROUSEL LOGIC
  const filterButtons = document.querySelectorAll(".filter-btn");
  const proofCards = document.querySelectorAll(".proof-card");
  const proofTrack = document.querySelector(
    ".proof-carousel-section .carousel-track",
  );

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      gsap.to(proofCards, {
        duration: 0.3,
        scale: 0.7,
        opacity: 0,
        onComplete: () => {
          proofCards.forEach((card) => {
            card.style.display =
              filter === "all" || card.classList.contains(filter)
                ? "block"
                : "none";
          });
          if (proofTrack) gsap.set(proofTrack, { x: 0 }); // Reset scroll

          const visible = Array.from(proofCards).filter(
            (c) => c.style.display !== "none",
          );
          gsap.to(visible, {
            duration: 0.6,
            scale: 1,
            opacity: 1,
            stagger: 0.05,
            ease: "back.out(1.2)",
          });
        },
      });
    });
  });

  // 4. INFINITE CAROUSEL FOR LIVE PROJECTS
  const liveTrack = document.querySelector(".vault-showroom .carousel-track");
  if (liveTrack) {
    gsap.to(liveTrack, {
      xPercent: -50,
      repeat: -1,
      duration: 35,
      ease: "none",
    });
  }

  // 5. GLOBAL UI (Cursor & Scroll)
  const cursor = document.querySelector(".cursor");
  document.addEventListener("mousemove", (e) => {
    if (cursor) gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
  });

  const backBtn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 600) backBtn.classList.add("show");
    else backBtn.classList.remove("show");
  });
  backBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  // Resize Handler
  window.addEventListener("resize", () => {
    if (container) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  });
});
