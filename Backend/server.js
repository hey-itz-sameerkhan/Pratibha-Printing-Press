const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { Resend } = require('resend');
require('dotenv').config();

// Models
const Form = require('./models/Form');
const Career = require('./models/Career');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Database Connected!"))
.catch(err => console.log("❌ DB Connection Error:", err));

// Multer Setup (Resume Upload)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

// 3. Keep-alive Route
app.get('/ping', (req, res) => res.send("🚀 Pratibha Printing Press Backend is LIVE!"));

// ✨ Add this Home Route
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #0056b3;">🚀 Pratibha Printing Press Backend is LIVE!</h1>
            <p>Database connection is successful and server is running.</p>
            <p style="color: #666;">© 2026 Pratibha Printing Press | Mathura</p>
        </div>
    `);
});

// ===============================
// CONTACT FORM API
// ===============================

app.post('/api/submit', async (req, res) => {

    try {

        const { name, email, phone, subject, message } = req.body;

        // Save to MongoDB
        const newData = new Form({
            formType: 'contact',
            name,
            email,
            phone,
            subject,
            message
        });

        await newData.save();

        // Admin Email
        await resend.emails.send({
            from: "Pratibha Printing <onboarding@resend.dev>",
            to: "ea@pratibhaprinting.com",
            subject: `New Inquiry from ${name}`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">

            <div style="background: linear-gradient(135deg, #0056b3, #00bfff); color: white; padding: 25px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">New Quote Request</h1>

                <p style="margin: 5px 0 0; opacity: 0.9;">Pratibha Printing Press Portal</p>
            </div>

            <div style="padding: 30px; background-color: #ffffff;">

                <p style="font-size: 16px;">Hello Admin,</p>

                <p>You have received a new business inquiry. Below are the submission details:</p>

                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 5px solid #0056b3;">

                    <p style="margin: 5px 0;"><strong>👤 Client Name:</strong> ${name}</p>

                    <p style="margin: 5px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #0056b3; text-decoration: none;">${email}</a></p>

                    <p style="margin: 5px 0;"><strong>📞 Phone:</strong> ${phone}</p>

                    <p style="margin: 5px 0;"><strong>📦 Product Interest:</strong> <span style="background: #e7f3ff; color: #0056b3; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${subject}</span></p>

                </div>
                <div style="margin-top: 25px;">
                    <h3 style="color: #0056b3; margin-bottom: 10px; font-size: 18px;">Customer Message:</h3>
                    <div style="padding: 15px; background: #fff; border: 1px solid #eee; border-radius: 6px; font-style: italic; color: #555;">
                        "${message ? message : "The client did not leave a specific message."}"
                    </div>
                </div>
                <div style="margin-top: 35px; text-align: center;">
                    <a href="mailto:${email}" style="background-color: #0056b3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reply to Client</a>

                </div>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                <p style="margin: 0;">This inquiry was sent via the official website. </p>
                <p style="margin: 5px 0 0;">© 2026 Pratibha Printing Press | Mathura</p>
            </div>
        </div>
        `
        });

        // User Confirmation Email
        await resend.emails.send({
            from: "Pratibha Printing <onboarding@resend.dev>",
            to: email,
            subject: "We received your inquiry",
            html:  `
            <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: auto; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
                <div style="background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">Message Received!</h1>
                    <p style="opacity: 0.9; font-size: 16px;">We'll get back to you shortly.</p>
                </div>
                
                <div style="padding: 30px; background: #ffffff; color: #333; text-align: center;">
                    <p style="font-size: 18px;">Hello <strong>${name}</strong>,</p>
                    <p>Thank you for reaching out to <strong>Pratibha Printing Press</strong>. We have received your inquiry regarding <strong>${subject}</strong>.</p>
                    <p>Our experts are reviewing your requirements and will contact you within 24 hours.</p>
                    
                    <div style="margin: 30px 0; border-top: 1px solid #eee; padding-top: 30px;">
                        <p style="font-weight: bold; color: #555;">Need an instant quote? Connect now:</p>
                        
                        <a href="https://wa.me/919068412030" style="display: inline-block; background: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 10px;">
                            📱 WhatsApp Us
                        </a>

                        <a href="mailto:ea@pratibhaprinting.com" style="display: inline-block; background: #0056b3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 10px;">
                            📩 Official Email
                        </a>
                    </div>
                </div>

                <div style="background: #f9f9f9; padding: 20px; text-align: center; color: #888; font-size: 12px;">
                    <p style="margin: 0;"><strong>Pratibha Printing Press | Mathura, UP</strong></p>
                    <p style="margin: 5px 0 0;">Quality Printing & Packaging Solutions</p>
                </div>
            </div>`            
        });

        res.status(200).json({
            success: true,
            message: "Form submitted successfully"
        });

    } catch (err) {

        console.error("❌ Contact Error:", err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


// ===============================
// CAREER FORM API
// ===============================

app.post('/api/career', upload.single('resume'), async (req, res) => {

    try {

        const { user_name, user_email, user_mobile, experience } = req.body;
        const resume = req.file;

        // Save to MongoDB
        const newCareer = new Career({
            user_name,
            user_email,
            user_mobile,
            experience
        });

        await newCareer.save();

        // Admin Email with Resume
        await resend.emails.send({

            from: "Pratibha Careers <onboarding@resend.dev>",
            to: "ea@pratibhaprinting.com",
            subject: `New Job Application - ${user_name}`,

            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <div style="background: linear-gradient(135deg, #0056b3, #00bfff); color: white; padding: 25px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">New Candidate Application</h1>
                    <p style="margin: 5px 0 0; opacity: 0.9;">Pratibha Printing Press | HR Portal</p>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <p style="font-size: 16px;">Hello Admin,</p>
                    <p>A new candidate has applied for a position. Details are as follows:</p>
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 5px solid #0056b3;">
                        <p style="margin: 5px 0;"><strong>👤 Candidate:</strong> ${user_name}</p>
                        <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${user_email}</p>
                        <p style="margin: 5px 0;"><strong>📞 Mobile:</strong> ${user_mobile}</p>
                        <p style="margin: 5px 0;"><strong>🛠️ Experience:</strong> ${experience}</p>
                    </div>
                    <p style="font-style: italic; color: #666; font-size: 14px;">Note: The candidate's resume PDF is attached to this email.</p>
                </div>
                <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                    <p>© 2026 Pratibha Printing Press | Recruitment System</p>
                </div>
            </div>`,

            attachments: resume ? [
                {
                    filename: resume.originalname,
                    content: resume.buffer
                }
            ] : []

        });

        // Candidate Confirmation Email
        await resend.emails.send({

            from: "Pratibha Careers <onboarding@resend.dev>",
            to: user_email,
            subject: "Application Received",

            html: `
            <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: auto; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
                <div style="background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">Application Received!</h1>
                    <p style="opacity: 0.9; font-size: 16px;">Career Opportunities at Pratibha Printing Press</p>
                </div>
                <div style="padding: 30px; background: #ffffff; color: #333; text-align: center;">
                    <p style="font-size: 18px;">Hello <strong>${user_name}</strong>,</p>
                    <p>Thank you for your interest in joining <strong>Pratibha Printing Press</strong>. We have successfully received your application and resume.</p>
                    <p>Our recruitment team is currently reviewing your profile. If your skills match our requirements, we will reach out to you for an interview.</p>
                    <div style="margin: 30px 0; border-top: 1px solid #eee; padding-top: 30px;">
                        <p style="font-weight: bold; color: #555;">Follow us for more updates:</p>
                        <a href="https://wa.me/919068412030" style="display: inline-block; background: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 10px;">📱 Contact HR</a>
                    </div>
                </div>
                <div style="background: #f9f9f9; padding: 20px; text-align: center; color: #888; font-size: 12px;">
                    <p><strong>Pratibha Printing Press | Mathura, UP</strong></p>
                    <p>Quality Printing & Packaging Solutions</p>
                </div>
            </div>`
        });

        res.status(200).json({
            success: true,
            message: "Application submitted successfully"
        });

    } catch (err) {

        console.error("❌ Career Error:", err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


// ===============================
// SERVER START
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});