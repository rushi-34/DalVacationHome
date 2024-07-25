const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  
  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }
  const { startDate, endDate } = requestBody;


  // Validate input
  if (!startDate || !endDate) {
    return {
      
      statusCode: 400,
      body: JSON.stringify({ error: event}),
    };
  }

  const params = {
    TableName: 'RoomAvailability',
  };

  try {
    // Scan the table to get all rooms and their availability
    const data = await dynamoDb.scan(params).promise();
    const allRooms = data.Items;

    console.log('Retrieved rooms:', JSON.stringify(allRooms, null, 2));

    const availableRooms = [];

    // Iterate through each room to check availability
    for (const room of allRooms) {
      const { roomId, availability } = room;

      console.log('Checking room:', roomId);
      console.log('Availability data:', JSON.stringify(availability, null, 2));

      let isAvailable = true;

      // Check booked dates for the room
      for (const [date, status] of Object.entries(availability)) {
        console.log('Date:', date, 'Status:', status);

        if (status === 'booked' && isDateInRange(date, startDate, endDate)) {
          console.log('Room is booked for date:', date);
          isAvailable = false;
          break;
        }
      }

      if (isAvailable) {
        console.log('Room is available:', roomId);
        availableRooms.push(roomId);
      }
    }

    console.log('Available rooms:', JSON.stringify(availableRooms, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ availableRooms }),
    };
  } catch (error) {
    console.error('Error fetching room availability:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

// Helper function to check if a date is within the given range
const isDateInRange = (date, startDate, endDate) => {
  return new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate);
};
