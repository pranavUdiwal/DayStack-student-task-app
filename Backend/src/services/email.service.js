const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || 'dummy_key'
});

const sendMailTo = async (to, subject, html) => {
    try {
        const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: `DayStack Platform <noreply@${process.env.MAILGUN_DOMAIN}>`,
            to: [to],
            subject: subject,
            html: html
        });
        
        console.log('Email sent successfully via Mailgun:', response);
        return response;
    } catch (error) {
        console.error('Email sending failed via Mailgun:', error);
        return null;
    }
};

module.exports = sendMailTo;