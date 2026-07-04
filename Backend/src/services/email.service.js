const { google } = require('googleapis');
const MailComposer = require('nodemailer/lib/mail-composer');

class EmailService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );
    this.oauth2Client.setCredentials({
      refresh_token: process.env.OAUTH_REFRESH_TOKEN
    });
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  async sendEmail(to, subject, htmlContent) {
    try {
      const mailOptions = {
        from: `"DayStack App" <${process.env.OAUTH_EMAIL}>`,
        to: to,
        subject: subject,
        html: htmlContent,
        textEncoding: 'base64'
      };
      const mail = new MailComposer(mailOptions);
      const message = await mail.compile().build();
      const rawMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      const result = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: rawMessage
        }
      });
      console.log('Email sent successfully:', result.data.id);
      return result.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();