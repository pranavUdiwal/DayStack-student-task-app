const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

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