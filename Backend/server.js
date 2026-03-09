const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer'); 
require('dotenv').config();

// Models Import
const Form = require('./models/Form');
const Career = require('./models/Career'); 

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected!"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// 2. Email Transporter Setup (Production Safe for Render)

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000, // 10 sec timeout
    greetingTimeout: 10000,
    socketTimeout: 10000
});

// SMTP Connection Verification (Debugging)
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP Connection Error:", error);
    } else {
        console.log("✅ SMTP Server Ready - Emails can be sent");
    }
});

// Multer Configuration (Memory Storage for fast processing)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB PDF
});

// 3. Keep-alive Route
app.get('/ping', (req, res) => res.send("I am awake!"));

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

// 4. Contact Form Route
app.post('/api/submit', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        const newData = new Form({ formType: 'contact', name, email, phone, subject, message });
        await newData.save();

        res.status(200).json({ success: true, message: "Inquiry Sent!" });

        // Admin Email Options
        const adminMailOptions = {
            from: `"Pratibha Printing Portal" <${process.env.EMAIL_USER}>`, 
            to: 'ea@pratibhaprinting.com',
            replyTo: email, 
            subject: `🚀 New Business Inquiry: ${subject} | From ${name}`,
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
        };

        // User Confirmation Email
        const userMailOptions = {
            from: `"Pratibha Printing Press" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Thank you for contacting us, ${name}!`,
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
        };

        // Send both mails in background
        transporter.sendMail(adminMailOptions).catch(err => console.log("Admin Contact Email Error:", err));
        if (email.toLowerCase() !== 'ea@pratibhaprinting.com') {
            transporter.sendMail(userMailOptions).catch(err => console.log("User Contact Email Error:", err));
        }

    } catch (err) {
        if (!res.headersSent) res.status(500).json({ success: false, error: err.message });
    }
});

// 5. Career Form Route (FULLY FIXED)
app.post('/api/career', upload.single('resume'), async (req, res) => {
    try {
        const { user_name, user_email, user_mobile, experience } = req.body;
        const resumeFile = req.file;

        if (!resumeFile) return res.status(400).json({ success: false, message: "Resume PDF is required!" });

        // A. Save to MongoDB
        const newCareer = new Career({ user_name, user_email, user_mobile, experience });
        await newCareer.save();

        // B. Send Response to Frontend Immediately
        res.status(200).json({ success: true, message: "Application Submitted Successfully!" });

        // C. Admin Mail (With Attachment)
        const adminCareerMail = {
            from: `"Pratibha Careers" <${process.env.EMAIL_USER}>`,
            to: 'ea@pratibhaprinting.com',
            subject: `💼 New Job Application: ${user_name}`,
            attachments: [{
                filename: `${user_name}_Resume.pdf`,
                content: resumeFile.buffer
            }],
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
            </div>`
        };

        // D. User Confirmation Mail
        const userCareerMail = {
            from: `"Pratibha Printing Press" <${process.env.EMAIL_USER}>`,
            to: user_email,
            subject: `Application Received - ${user_name}`,
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
        };

        // ✨ EXECUTION: Dono mail bhejna yahan ensure kiya hai
        transporter.sendMail(adminCareerMail)
            .then(() => console.log(`Email sent to Admin for ${user_name}`))
            .catch(err => console.error("Admin Career Email Error:", err));
        
        if (user_email.toLowerCase() !== 'ea@pratibhaprinting.com') {
            transporter.sendMail(userCareerMail)
                .then(() => console.log(`Confirmation email sent to ${user_email}`))
                .catch(err => console.error("User Career Email Error:", err));
        }

    } catch (err) {
        console.error("Career Error:", err);
        if (!res.headersSent) res.status(500).json({ success: false, error: "Critical Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is flying on port ${PORT}`));