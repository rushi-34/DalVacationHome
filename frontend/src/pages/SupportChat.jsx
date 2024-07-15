import React, {useEffect, useState} from 'react';
import { List, ListItem, ListItemText, Container, Box, Typography, TextField, Button } from '@mui/material';

const SupportChat = () => {

    const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    const postData = {
        booking_id: "2418",
        message: message,
        isAgent: false
    };
    
    const url = 'https://northamerica-northeast1-dalvacationhome-428403.cloudfunctions.net/publish-support-message';
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return response.json(); // assuming the server returns JSON
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
    // setMessages([...messages, { message: message, isAgent: 'True' }]);
    fetchMessages('2418');
  };

  const fetchMessages = async (bookingId) => {
    const url = `https://5t9c2sbo5j.execute-api.us-east-1.amazonaws.com/dev/support/${bookingId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText);
      }
  
      const data = await response.json();
      const body = JSON.parse(data['body']);
      setMessages(body['messages'])
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }
  

    const MessageList = () => {
        return (
            <List sx={{ flex: 1, overflowY: 'auto' }}>
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemText primary={message.sender} secondary={message.message} />
                </ListItem>
              ))}
            </List>
          );
    }

    const MessageInput = (onSendMessage) => {
        const [message, setMessage] = useState('');
        return (
            <Box sx={{ display: 'flex', mt: 2 }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                
            />
            <Button variant="contained" color="primary" onClick={() => {onSendMessage(message)}} sx={{ ml: 2 }}>
                Send
            </Button>
            </Box>
      );
    }

    useEffect(() => {
        fetchMessages('2418')
    }, [messages])

    return (
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Chats
          </Typography>
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '16px',
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <MessageList messages={messages} />
            {MessageInput(handleSendMessage)}
          </Box>
        </Container>
      );
    
}

export default SupportChat;