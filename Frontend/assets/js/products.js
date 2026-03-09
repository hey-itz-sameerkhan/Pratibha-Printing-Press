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

    // --- 3️⃣ Subtle Tilt Effect for Floating Pouches ---
    // Jab user scroll karega, pouch thoda tilt hoga move ke saath
    function handlePouchTilt() {
        const pouches = document.querySelectorAll('.floating-pouch');
        pouches.forEach(pouch => {
            const rect = pouch.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                const shift = (windowHeight / 2 - rect.top) * 0.05;
                pouch.style.transform = `translateY(${shift}px) rotate(${shift * 0.2}deg)`;
            }
        });
    }


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


    // --- 5️⃣ Feature Icons Stagger Delay ---
    // Icons ek-ek karke appear honge (Stagger effect)
    const featIcons = document.querySelectorAll('.feat-icon');
    featIcons.forEach((icon, index) => {
        icon.setAttribute('data-aos', 'fade-up');
        icon.setAttribute('data-aos-delay', (index % 3) * 100);
    });

    // --- 6️⃣ Demo Card Click Interaction ---
    // Agar koi demo image par click kare toh wo highlight ho jaye
    const demoCards = document.querySelectorAll('.d-card');
    demoCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active from others in the same card
            this.parentElement.querySelectorAll('.d-card').forEach(c => c.style.borderColor = 'transparent');
            // Add active to this one
            this.style.border = '2px solid var(--accent-orange)';
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.15) rotate(-3deg)';
            }, 100);
        });
    });

    console.log("Pratibha Products: Premium Grid UI Loaded! 🚀✨");
});