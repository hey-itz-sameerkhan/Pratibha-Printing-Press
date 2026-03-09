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


    // --- 3️⃣ Hero Parallax Effect ---
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.about-hero');
        if (hero) {
            let scrollValue = window.scrollY;
            // Background position moves slower for parallax depth
            hero.style.backgroundPositionY = (scrollValue * 0.4) + 'px'; 
        }
    });

    // --- 4️⃣ Stats Counter (Smart Fix for NaN) ---
    // Target both stat items and experience badges
    const stats = document.querySelectorAll('.stat-item h4, .experience-badge h3');
    
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const originalText = target.innerText.trim();
                
                // Extract number from text (e.g., "15+" becomes 15)
                const endValue = parseInt(originalText.replace(/[^0-9]/g, ''));

                // ✨ SMART CHECK: Agar text pure words hai (Zero Defect), toh animation skip karo
                if (isNaN(endValue)) {
                    target.style.opacity = "0";
                    target.style.transform = "translateY(10px)";
                    target.style.transition = "all 0.8s ease-out";
                    
                    setTimeout(() => {
                        target.style.opacity = "1";
                        target.style.transform = "translateY(0)";
                    }, 100);
                    
                    observer.unobserve(target);
                    return; 
                }

                // Number animation logic
                let startValue = 0;
                const duration = 2000; // 2 seconds animation
                const steps = 50;
                const increment = endValue / steps;
                
                let counter = setInterval(() => {
                    startValue += increment;
                    if (startValue >= endValue) {
                        // Final state with original symbols (+, etc.)
                        target.innerText = originalText;
                        clearInterval(counter);
                    } else {
                        // Intermediate state during counting
                        target.innerText = Math.ceil(startValue) + (originalText.includes('+') ? '+' : '');
                    }
                }, duration / steps);

                observer.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => statsObserver.observe(stat));


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