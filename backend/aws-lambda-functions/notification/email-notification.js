const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dhruvikkakadiya50@gmail.com',
        pass: '******' // Use the App Password generated
    }
});

exports.handler = async (event) => {
    // Parse incoming HTTP request body
    const requestBody = JSON.parse(event.body);

    // Extract email details from request body
    const emailParams = {
        from: 'dhruvikkakadiya50@gmail.com',
        to: requestBody.email,
        subject: requestBody.subject,
        text: requestBody.body
    };

    try {
        // Send email using Node Mailer or your preferred method
        await transporter.sendMail(emailParams);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' })
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error sending email' })
        };
    }
    
};

