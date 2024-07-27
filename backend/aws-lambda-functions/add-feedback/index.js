const AWS = require('aws-sdk');
const axios = require('axios');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
    const statusCode = 200;
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        "Content-Type": "application/json"
    };

    let requestBody;
    try {
        console.log('event.body:', event.body);
        requestBody = JSON.parse(event.body);
    } catch (err) {
        console.error('Invalid JSON input:', err);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON input' }),
            headers: headers
        };
    }

    const user_id = requestBody.user_id;
    const booking_id = requestBody.booking_id;
    console.log('booking_id:', booking_id);

    // Get room_id from booking_table
    const bookingParams = {
        TableName: 'dalvac-bookings',
        FilterExpression: 'booking_id = :booking_id',
        ExpressionAttributeValues: { ':booking_id': booking_id }
    };

    let room_id;
    try {
        const bookingData = await dynamodb.scan(bookingParams).promise();
        room_id = bookingData.Items[0].roomNumber;
    } catch (err) {
        console.error('Error fetching booking data:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching booking data' }),
            headers: headers
        };
    }
    console.log('room_id:', room_id);

    const review_date = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    console.log('review_date:', review_date);

    const review_item = {
        user_id: user_id,
        room_id: room_id,
        review_comments: requestBody.review_comments,
        review_stars: requestBody.review_stars.toString(),
        review_date: review_date,
        booking_id: booking_id
    };
    console.log('review_item:', review_item);

    // Save the review in review_table
    const reviewParams = {
        TableName: 'dalvac-reviews',
        Item: review_item
    };
    try {
        await dynamodb.put(reviewParams).promise();
    } catch (err) {
        console.error('Error saving review:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error saving review' }),
            headers: headers
        };
    }

    // Get reviews for the room and calculate average star rating
    const reviewFilterParams = {
        TableName: 'dalvac-reviews',
        FilterExpression: 'room_id = :room_id',
        ExpressionAttributeValues: { ':room_id': room_id }
    };

    let feedbacks = [];
    let star_rating = 0;
    try {
        const reviewData = await dynamodb.scan(reviewFilterParams).promise();
        reviewData.Items.forEach((item) => {
            feedbacks.push({ message: item.review_comments });
            star_rating = (star_rating + parseFloat(item.review_stars)) / reviewData.Items.length;
        });
        star_rating = star_rating.toFixed(1);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching reviews' }),
            headers: headers
        };
    }
    console.log('feedbacks:', feedbacks);
    console.log('Average rating:', star_rating);
    const rawData = { feedbacks: feedbacks };

    const data = JSON.parse(JSON.stringify(rawData));
    console.log("Review data: ", data);

    // Scan the table to find the primary key using roomNumber
    const roomScanParams = {
        TableName: 'dalv',
        FilterExpression: 'roomNumber = :room_id',
        ExpressionAttributeValues: {
            ':room_id': room_id
        }
    };

    let primaryKey;
try {
    const roomScanData = await dynamodb.scan(roomScanParams).promise();
    if (roomScanData.Items.length > 0) {
        primaryKey = roomScanData.Items[0].id; // Replace with actual primary key attribute name
    } else {
        throw new Error('Room not found');
    }
} catch (err) {
    console.error('Error scanning room data:', err);
    return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error scanning room data' }),
        headers: headers
    };
}

    // Call the sentiment analysis
    const sentimentUrl = 'https://us-central1-serverless-term.cloudfunctions.net/sentiment-analysis';
    let sentimentResponse;
    try {
        console.log('Before calling sentiment analysis API');
        sentimentResponse = await axios.post(sentimentUrl, rawData, { headers: { 'Content-Type': 'application/json' } });
        console.log('After calling sentiment analysis API');
    } catch (err) {
        console.error('Error calling sentiment analysis API:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error calling sentiment analysis API' }),
            headers: headers
        };
    }
    console.log('sentiment_analysis_response: ', sentimentResponse.data);

        

    // Update the room table with sentiment data
    const overall_sentiment = sentimentResponse.data.overall_sentiment;
    const overall_score = sentimentResponse.data.overall_score.toString();
    const starRatingString = star_rating.toString();

    const roomUpdateParams = {
        TableName: 'dalv',
        Key: { 'id': primaryKey }, // Replace with actual primary key attribute name
        UpdateExpression: 'SET overall_sentiment = :s, overall_score = :sc, star_rating = :sr',
        ExpressionAttributeValues: {
            ':s': overall_sentiment,
            ':sc': overall_score,
            ':sr': starRatingString
        }
    };
  console.log('room_update_params:', roomUpdateParams);
  console.log('Primary ID:', primaryKey);
    try {
        console.log('Before updating room data');
        await dynamodb.update(roomUpdateParams).promise();
        console.log('After updating room data');
    } catch (err) {
        console.log('room_update_params:', roomUpdateParams);
        console.error('Error updating room data:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error updating room data' }),
            headers: headers
        };
    }
    console.log('room_update_response:', roomUpdateParams);

    return {
        statusCode: statusCode,
        body: JSON.stringify({ message: 'Review submitted successfully' }),
        headers: headers
    };
};
