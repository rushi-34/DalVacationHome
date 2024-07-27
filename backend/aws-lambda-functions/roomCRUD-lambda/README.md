To manage bookings, we need to keep track of room availability and ensure that rooms can only be booked if they are free during the requested dates. Here's a step-by-step explanation of how bookings are managed:

1. Data Structure for Bookings
We will use a DynamoDB table named dalvac-rooms to store room details and another table named dalvac-bookings to store booking details.

dalvac-rooms Table:

room_id (String) - Unique identifier for each room.
room_feature (String) - Description of room features.
room_price (Decimal) - Price of the room.
room_type (String) - Type of the room (e.g., single, double, suite).
created_time (String) - Timestamp when the room was created.
last_updated (String) - Timestamp when the room details were last updated.
dalvac-bookings Table:

booking_id (String) - Unique identifier for each booking.
room_id (String) - Identifier for the room being booked.
start_date (String) - Booking start date.
end_date (String) - Booking end date.
user_id (String) - Identifier for the user who made the booking.
created_time (String) - Timestamp when the booking was created.
2. Booking Algorithm
Add a Booking
Receive Booking Request:

The user submits a booking request with room_id, start_date, end_date, and user_id.
Check Availability:

Query the dalvac-bookings table to check if there are any existing bookings for the room_id that overlap with the requested dates.
If no overlapping bookings are found, proceed to the next step.
If overlapping bookings are found, return an error indicating the room is not available for the requested dates.
Create Booking:

Generate a unique booking_id.
Insert a new record into the dalvac-bookings table with the booking_id, room_id, start_date, end_date, user_id, and created_time.
View Available Rooms
Receive Availability Request:

The user submits a request with start_date and end_date to check available rooms.
Get All Rooms:

Query the dalvac-rooms table to get all room details.
Check Availability for Each Room:

For each room, query the dalvac-bookings table to check if there are any bookings for that room that overlap with the requested dates.
Filter out rooms with overlapping bookings.
Return the list of available rooms.