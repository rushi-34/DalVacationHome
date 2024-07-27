import React, { useEffect, useState, useContext } from 'react';
import { List, ListItem, ListItemText, Container, Box, Typography, TextField, Button } from '@mui/material';
import { AuthenticationContext } from '../ContextProvider';

const SupportChat = () => {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentBookingId, setCurrentBookingId] = useState('');
  const [message, setMessage] = useState('');
  const { userName, userRole } = useContext(AuthenticationContext);
  const isAgent = userRole === 'agent';

  const handleSendMessage = (message) => {
    const postData = {
      booking_id: currentBookingId,
      message: message,
      isAgent: isAgent,
    };
    setMessage('');

    const url = 'https://northamerica-northeast1-dalvacationhome-428403.cloudfunctions.net/publish-support-message';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    });

    fetchChats(userName, isAgent);
  };

  const fetchChats = async (userId, isAgent) => {
    const url = `https://jkqdwcff4qbbbjocyqb3uxidzq0xemce.lambda-url.us-east-1.on.aws/`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, is_agent: isAgent }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }

      const data = await response.json();

      if (data.chatDetails.length > 0) {
        setChats(data.chatDetails);
        const activeChat = data.chatDetails.find(chat => chat.booking_id === currentBookingId) || data.chatDetails[0];
        setCurrentBookingId(activeChat.booking_id);
        setMessages(activeChat.messages);
      } else {
        setChats([]);
        setMessages([]);
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const MessageList = ({ messages }) => {
    return (
      <List sx={{ flex: 1, overflowY: 'auto' }}>
        {(messages || []).map((message, index) => (
          <ListItem key={index} sx={{ border: '1px solid #ccc', borderRadius: '10px', paddingBottom: '5px' }}>
            {isAgent ? (
              <ListItemText primary={message.message} secondary={message.isAgent ? 'You' : 'Customer'} />
            ) : (
              <ListItemText primary={message.message} secondary={message.isAgent ? 'Agent' : 'You'} />
            )}
          </ListItem>
        ))}
      </List>
    );
  };

  const MessageInput = (onSendMessage) => {
    return (
      <Box sx={{ display: 'flex', mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={() => onSendMessage(message)} sx={{ ml: 2 }}>
          Send
        </Button>
      </Box>
    );
  };

  useEffect(() => {
    fetchChats(userName, isAgent);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchChats(userName, isAgent);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentBookingId]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Chats
      </Typography>
      <Box sx={{ display: 'flex', height: '500px', gap: '20px' }}>
        <Box sx={{ width: '300px', borderRight: '1px solid #ccc', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px' }}>
          <Typography variant="h6" gutterBottom>
            Booking ID
          </Typography>
          <List>
            {chats.map((chat) => (
              <ListItem button key={chat.booking_id} onClick={() => { setCurrentBookingId(chat.booking_id); setMessages(chat.messages); }}>
                <ListItemText primary={`${chat.booking_id}`} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '16px',
            display: 'flex',
            width: '700px',
            flexDirection: 'column',
          }}
        >
          <MessageList messages={messages} />
          {MessageInput(handleSendMessage)}
        </Box>
      </Box>
    </Container>
  );
};

export default SupportChat;
