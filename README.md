# 🚀 Pratibha Printing Press Portal

**A Modern Full-Stack (MERN) Packaging & Printing Solution Platform**

Pratibha Printing Press is a high-performance, interactive web application built for a premier printing house in Mathura. It features smooth 3D-like animations, a robust career recruitment system, and a real-time business inquiry portal.

---

## 🛠️ Tech Stack

### **Frontend**

- **UI/UX:** HTML5, CSS3, Modern JavaScript (ES6+)
- **Animations:** GSAP (GreenSock), ScrollTrigger, AOS (Animate on Scroll)
- **Smooth Scrolling:** Lenis Scroll
- **Components:** Swiper.js (Hero Slider), SweetAlert2 (Professional Popups)

### **Backend**

- **Environment:** Node.js, Express.js
- **Database:** MongoDB Atlas (MERN Stack)
- **File Handling:** Multer (Memory Storage)
- **Email Service:** Nodemailer (SMTP Integration with Background Tasks)
- **Security:** CORS, Dotenv, 2-Step Verified SMTP

---

## ✨ Key Features

- ✅ **Interactive Home:** GSAP-powered animations for a premium feel.
- ✅ **Dynamic Quote System:** Clients can send business inquiries directly to the admin.
- ✅ **Smart Career Portal:** Job seekers can upload PDF resumes which are automatically mailed to HR and saved in the database.
- ✅ **Auto-Confirmation Emails:** Dual-email system (One for Admin, one for User) for better CRM.
- ✅ **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.
- ✅ **Fast Performance:** Optimized images and lightweight smooth-scroll integration.

---

## 📁 Project Structure

```text
.
├── Backend/                 # Express Server & API Logic
│   ├── models/              # Mongoose Schemas (Career, Form)
│   ├── server.js            # Main entry point
│   └── .env                 # Environment Variables (Protected)
└── Frontend/                # Client-side UI
    ├── assets/              # CSS, JS, and Optimized Images
    └── public/              # HTML Pages (Home, Products, Contact)
```
