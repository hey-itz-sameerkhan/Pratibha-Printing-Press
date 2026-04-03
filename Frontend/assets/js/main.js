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
    // 3️⃣ Career-Modal Logic 
    // ===============================
    
const modal = document.getElementById("careerModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close-btn");
const careerForm = document.getElementById("careerForm");

if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
        modal.style.display = "block";
        if (typeof lenis !== 'undefined') lenis.stop(); // Scroll stop
    });
}

const closeModal = () => {
    if (modal) {
        modal.style.display = "none";
        if (typeof lenis !== 'undefined') lenis.start(); // Scroll start
    }
};

if (closeBtn) closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
});

// ✨ PRO MERN Submission Logic with SweetAlert2
if (careerForm) {
    careerForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector(".btn-main");
        
        // 1. Loading State: Button ko animate karo
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loader"></span> Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";

        const formData = new FormData(this);

        try {
            // Backend URL
              const response = await fetch('https://pratibha-printing-press.onrender.com/api/career', {
                  method: 'POST',
                  body: formData
              });

            const result = await response.json();

            if (result.success) {
                // 2. Sundar Success Alert
                Swal.fire({
                    icon: 'success',
                    title: 'Application Received! 🚀',
                    text: 'Thank you, ' + formData.get('user_name') + '. We will review your resume soon.',
                    confirmButtonColor: '#0056b3'
                });
                
                careerForm.reset();
                closeModal();
            } else {
                throw new Error(result.message || "Submission failed");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            // 3. Professional Error Alert
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Backend se connect nahi ho paya. Please check if server is running!',
            });
        } finally {
            // 4. Reset Button State
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
        }
    });
}

    // ===============================
    // 4️⃣ Industries Section Logic
    // ===============================
    const accItems = document.querySelectorAll(".acc-item");
    const industryImg = document.getElementById("dynamic-industry-img");

    accItems.forEach(item => {
        item.addEventListener("click", function () {
            accItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");
            const newImg = this.getAttribute("data-img");

            if (industryImg) {
                industryImg.classList.add("image-fade");
                setTimeout(() => {
                    industryImg.src = newImg;
                    industryImg.classList.remove("image-fade");
                }, 400);
            }
        });
    });

    // ===============================
    // 5️⃣ Swiper Initialization
    // ===============================
    const swiper = new Swiper(".heroSwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        coverflowEffect: {
            rotate: 30,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
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


const video = document.querySelector('.showcase-video');
const muteBtn = document.getElementById('videoMuteBtn');

muteBtn.addEventListener('click', () => {
    if (video.muted) {
        video.muted = false;
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        video.muted = true;
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});