// ===============================
// 1️⃣ Initialize Lenis (Smooth Scroll) - MOBILE OPTIMIZED
// ===============================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => 1 - Math.pow(2, -10 * t),
    smoothWheel: true,
    // ✨ MOBILE FIX: Isse mobile touch scroll enable ho jayega
    smoothTouch: true, 
    touchMultiplier: 1.5,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// FIX: Force resize after load
window.addEventListener("load", () => {
    setTimeout(() => {
        lenis.resize();
    }, 500); // 500ms thoda extra time loading ke liye
});

// ===============================
// 2️⃣ Initialize AOS (Stable Version)
// ===============================
document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 80,
        easing: "ease-in-out"
    });

    // Proper Lenis + AOS sync
    lenis.on("scroll", () => {
        AOS.refresh();
    });
    
    // ===============================
    // 6️⃣ Hamburger Menu Logic
    // ===============================
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            // ✨ Pro-tip: Mobile menu khulne par scroll stop kar sakte ho
            if (navMenu.classList.contains("active")) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });

        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                lenis.start();
            });
        });
    }

    console.log("Pratibha Press: Home Page Ready 🚀");
   });