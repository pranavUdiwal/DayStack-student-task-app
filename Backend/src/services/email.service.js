const nodemailer = require('nodemailer');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendMailTo = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: 'Student Task System <' + process.env.EMAIL + '>',
            to,
            subject,
            html
        };
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(error);
        return null;
    }
};

module.exports = sendMailTo;