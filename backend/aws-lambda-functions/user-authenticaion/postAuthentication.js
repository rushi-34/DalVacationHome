import fetch from 'node-fetch';

export const handler = async (event, context) => {
    console.log("Received event:", JSON.stringify(event));

    if (event.triggerSource === 'PostAuthentication_Authentication') {
        const userEmail = event.request.userAttributes.email;

        if (!userEmail) {
            console.error("Error: User email not found in event.");
            return event; // Return the event directly 
        }

        const apiEndpoint = 'https://thbtqi9ka6.execute-api.us-east-1.amazonaws.com/send-email';
        const payload = {
            email: userEmail,
            subject: 'Dal Vacation Home',
            body: 'You have logged in successfully!'
        };

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('Email notification sent successfully');
            } else {
                const errorData = await response.json(); 
                const errorMessage = errorData.error || response.statusText; 
                throw new Error(`Failed to send email notification: ${errorMessage}`);
            }

        } catch (error) {
            console.error('Error sending email notification:', error.message);
        }
    }
    
    return event; 
};
