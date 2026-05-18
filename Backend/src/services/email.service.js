const sendMailTo = async (to, subject, html) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: {  
                    name: 'DayStack Platform',
                    email: process.env.EMAIL
                },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Brevo API Error:', data);
            return null;
        }

        console.log('Email sent successfully via Brevo HTTP API:', data);
        return data;
    } catch (error) {
        console.error('Email sending failed:', error);
        return null;
    }
};

module.exports = sendMailTo;