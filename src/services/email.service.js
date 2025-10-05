const { createTransport } = require('../config/email');

const transporter = createTransport();

async function sendEmail(to, subject, text) {
    if(!transporter) return false;
    const from = process.env.EMAIL_USER;
    await transporter.sendMail({ from, to, subject, html});
    return true;
}

async function sendWelcomeEmail(to, name) {
    return sendEmail({
        to,
        subject: 'Welcome to Our E-Commerce Platform',
        html: `<h1>Welcome, ${name}!</h1><p>Thank you for joining our e-commerce platform. We're excited to have you with us.</p>`
    });
}

async function sendOrderEmail(to, orderId, total) {
    return sendEmail({
        to,
        subject: "Order Confirmed!",
        html: `<h1>Order Confirmation</h1><p>Your order with ID <strong>${orderId}</strong> has been confirmed. The total amount is <strong>$${total}</strong>.</p>`
    });
}

module.exports = {sendEmail, sendWelcomeEmail, sendOrderEmail};

