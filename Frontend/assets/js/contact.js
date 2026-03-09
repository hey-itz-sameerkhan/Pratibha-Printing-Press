// ==========================================
// 1️⃣ Initialize Lenis (Smooth Scroll)
// ==========================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => 1 - Math.pow(2, -10 * t),
    smoothWheel: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

window.addEventListener("load", () => {
    setTimeout(() => {
        lenis.resize();
    }, 100);
});

// ==========================================
// 2️⃣ Initialize AOS (Scroll Animations)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 80,
        easing: "ease-in-out"
    });
});

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

// ==========================================
// 4️⃣ Input Focus Effects
// ==========================================
const inputs = document.querySelectorAll(".input-group input, .input-group select, .input-group textarea");

inputs.forEach(input => {
    input.addEventListener("focus", () => {
        input.parentElement.classList.add("focused");
    });
    input.addEventListener("blur", () => {
        if (input.value === "") {
            input.parentElement.classList.remove("focused");
        }
    });
});

// ==========================================
// 🚀 CONTACT & QUOTE FORM SUBMISSION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const quoteForm = document.getElementById("quoteForm");

    if (quoteForm) {
        quoteForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            // Submit button UI state
            const submitBtn = this.querySelector(".submit-btn");
            const btnText = submitBtn.querySelector("span");
            const btnIcon = submitBtn.querySelector("i");
            const originalText = btnText.innerText;

            // Loading State start
            btnText.innerText = "Sending Request...";
            btnIcon.className = "fas fa-spinner fa-spin";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            // Form data collect karo (Backend ke field names ke hisaab se)
            const formData = {
                name: this.name.value,
                email: this.email.value,
                phone: this.phone.value,
                subject: this.product.value, // Selected product becomes the subject
                message: this.message.value
            };

            try {
                // Backend Fetch Call
                const response = await fetch('http://localhost:5000/api/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    // ✅ Success Toast
                    Toastify({
                        text: "Success! Your request has been sent to the owner.",
                        duration: 5000,
                        gravity: "top",
                        position: "right",
                        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
                        stopOnFocus: true
                    }).showToast();
                    
                    quoteForm.reset(); // Clear form
                } else {
                    throw new Error("Server error");
                }

            } catch (error) {
                console.error("Submission Error:", error);
                // ❌ Error Toast
                Toastify({
                    text: "Oops! Failed to connect to server. Please try again.",
                    duration: 5000,
                    gravity: "top",
                    position: "right",
                    style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" },
                    stopOnFocus: true
                }).showToast();
            } finally {
                // Button wapas normal karo
                btnText.innerText = originalText;
                btnIcon.className = "fas fa-paper-plane";
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
            }
        });
    }
});

console.log("Pratibha Press: Backend Connection Ready 🚀");