// api.js
import axios from 'axios';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const LAMBDA_URL = import.meta.env.VITE_GET_ROOMS_LAMBDA_URL;
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
        const payload = {
            start_date: formatDate(checkInDate),
            end_date: formatDate(checkOutDate),
        };
        const response = await axios.post(LAMBDA_URL, payload);
        const roomsData = response.data;

        const roomsWithPhotos = await Promise.all(
            roomsData.map(async (room) => {
                const photoUrl = await fetchPhoto();
                return { ...room, photoUrl };
            })
        );

        return roomsWithPhotos;
    } catch (err) {
        throw new Error('Failed to load rooms');
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

const formatDate = (date) => {
    return date.format('MM-DD-YYYY'); // Format date as MM-DD-YYYY
};
