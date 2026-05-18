const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
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
    const mailOptions = {
        from:'Student Task System <' + process.env.EMAIL + '>',
        to,
        subject,
        html
    }

    return await transporter.sendMail(mailOptions)
}

module.exports = sendMailTo;