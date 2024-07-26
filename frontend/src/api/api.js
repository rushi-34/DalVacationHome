// api.js
import axios from 'axios';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const GET_ROOMS_URL = import.meta.env.VITE_GET_ROOMS_LAMBDA_URL;
const GET_AVAILABLE_ROOMS_URL = import.meta.env.VITE_GET_AVAILBLE_ROOMS_LAMBDA_URL;
const BOOK_ROOM_URL = import.meta.env.VITE_BOOK_ROOM_LAMBDA_URL;
const UNSPLASH_API_URL = import.meta.env.VITE_UNSPLASH_API_URL;
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

const poolData = {
    UserPoolId: 'us-east-1_oAtQBU6kM',
    ClientId: 'kcjgj5ug89c4ugbj6vog6ddb5',
};

const getUserPool = () => {
    return new CognitoUserPool(poolData);
}

export const currentUser = () => {
    const userPool = getUserPool();
    const cognitoUser = userPool.getCurrentUser();
    return cognitoUser;
}

export const fetchRooms = async (checkInDate, checkOutDate) => {
    try {
        // Step 1: Fetch available rooms
        const availableRoomsResponse = await axios.post(GET_AVAILABLE_ROOMS_URL, {
          startDate: checkInDate,
          endDate: checkOutDate
        });
        const availableRoomNumbers = availableRoomsResponse.data.availableRooms;
    
        // Log to inspect the available room numbers
        console.log("Available Room Numbers:", availableRoomNumbers.availableRooms);
        
    
        // Ensure availableRoomNumbers is an array
        if (!Array.isArray(availableRoomNumbers)) {
          throw new Error("Available room numbers is not an array");
        }
    
        // Step 2: Fetch all rooms
        const allRoomsResponse = await axios.get(GET_ROOMS_URL);
        const allRooms = allRoomsResponse.data;
    
        // Step 3: Filter rooms based on available room numbers
        const availableRooms = allRooms.filter(room => 
          availableRoomNumbers.includes(room.roomNumber)
        );
        console.log("Available Rooms:", availableRooms);
    
        return availableRooms;
      } catch (error) {
        console.error("Error fetching rooms:", error);
        return [];
      }
};

export const fetchPhoto = async () => {
    try {
        const response = await axios.get(UNSPLASH_API_URL, {
            params: { query: 'Mountain room view', client_id: UNSPLASH_API_KEY, per_page: 1 },
        });
        return response.data.results[0]?.urls.small || 'https://via.placeholder.com/200';
    } catch (err) {
        return 'https://via.placeholder.com/200';
    }
};

export const bookRoom = async (payload) => {
    try {
        await axios.post(BOOK_ROOM_URL, payload);
    } catch (err) {
        throw new Error('Failed to book room');
    }
};

export const formatDate = (date) => {
    return date.format('MM-DD-YYYY'); // Format date as MM-DD-YYYY
};
