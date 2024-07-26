const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const bookingsTable = 'dalvac-bookings';
const roomsTable = 'dalv';
const availabilityTable = 'RoomAvailability'; // Define your RoomAvailability table name

exports.handler = async (event) => {
    let statusCode = 200;
    let body = {};
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "https://www.example.com",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };
    
    console.log("New Booking Event:", event);
    
    try {
        // Parse request body
        const bodyData = JSON.parse(event.body);
        
        console.log("Body:", bodyData);
        
        const { user_id, roomNumber, start_date, end_date } = bodyData;
        const dateFormat = "MM-DD-YYYY";
        const startDate = moment(start_date, dateFormat).format("YYYY-MM-DD");
        const endDate = moment(end_date, dateFormat).format("YYYY-MM-DD");
        
        console.log("start_date:", startDate, "end_date:", endDate);
        
        if (!user_id || !endDate || !startDate || !roomNumber) {
            console.log("Pass all the required information...");
            statusCode = 400;
            body = JSON.stringify({
                error: "Pass all the required information: user_id, start_date, end_date, roomNumber"
            });
        } else {
            // Check if the room exists in the dalv table
            const roomsResponse = await dynamodb.scan({ TableName: roomsTable }).promise();
            const allRooms = roomsResponse.Items;
            const room = allRooms.find(r => r.roomNumber === roomNumber);
            
            if (!room) {
                statusCode = 404;
                body = JSON.stringify({ error: "Room not found" });
            } else {
                const booking_id = `B-${roomNumber}-${uuidv4().slice(0, 4)}`;
                const current_date = moment().format("YYYY-MM-DD");
                const booking_status = "Confirmed";
    
                const item = {
                    user_id,
                    booking_id,
                    booking_date: current_date,
                    roomNumber,
                    start_date: startDate,
                    end_date: endDate,
                    status: booking_status
                };
                
                console.log("Item:", item);
                
                await dynamodb.put({
                    TableName: bookingsTable,
                    Item: item
                }).promise();
                
                // Update RoomAvailability table
                const availabilityResponse = await dynamodb.get({
                    TableName: availabilityTable,
                    Key: { roomId: roomNumber }
                }).promise();
                
                const availability = availabilityResponse.Item ? availabilityResponse.Item.availability : {};
                
                let currentDate = moment(startDate);
                while (currentDate.isSameOrBefore(endDate)) {
                    const dateStr = currentDate.format("YYYY-MM-DD");
                    availability[dateStr] = "booked"; // Updated to match the format
                    currentDate.add(1, 'day');
                }
                
                await dynamodb.put({
                    TableName: availabilityTable,
                    Item: {
                        roomId: roomNumber,
                        availability
                    }
                }).promise();
                
                body = JSON.stringify(item);
            }
        }
    } catch (error) {
        console.error("Error found!!!", error);
        statusCode = 500;
        body = JSON.stringify({ error: error.message });
    }
    
    return {
        statusCode,
        body,
        headers
    };
};
