import React, {useEffect, useState} from 'react';
import { List, ListItem, ListItemText, Container, Box, Typography, TextField, Button } from '@mui/material';

const SupportChat = () => {

  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentBookingId, setCurrentBookingId] = useState('');
  const [message, setMessage] = useState('');
  const { userEmail, userRole } = useContext(AuthenticationContext);
  const isAgent = userRole === 'agent';
  const handleSendMessage = (message) => {
    const postData = {
        booking_id: "2418",
        message: message,
        isAgent: isAgent
    };
    setMessage('');

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
        
        return response.json(); 
    });

    
    // setMessages([...messages, { message: message, isAgent: 'True' }]);
    fetchMessages(currentBookingId);
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
  
  const fetchChats = async (userId, isAgent) => {
    const url = `https://5t9c2sbo5j.execute-api.us-east-1.amazonaws.com/dev/support/chats`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId, is_agent: isAgent })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }

        const data = await response.json();
        const body = JSON.parse(data['body']);
        setChats(body['chatDetails']);
        if (body['chatDetails'].length > 0) {
          const firstBookingId = body['chatDetails'][0].booking_id;
          setCurrentBookingId(firstBookingId);
          fetchMessages(firstBookingId);
      }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};

  const MessageList = () => {
    return (
        <List sx={{ flex: 1, overflowY: 'auto' }}>
            {messages.map((message, index) => (
                <ListItem key={index} sx={{border: '1px solid #ccc', borderRadius: '10px', paddingBottom: '5px'}}>
                    {
                      isAgent ? 
                        <ListItemText 
                            primary= {message.message} 
                            secondary={message.isAgent ? 'You' : 'Customer'} 
                        /> 
                      :
                        <ListItemText 
                        primary= {message.message} 
                        secondary={message.isAgent ? 'Agent' : 'You'} 
                      />

                    }
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
            <Button variant="contained" color="primary" onClick={() => {onSendMessage(message)}} sx={{ ml: 2 }}>
                Send
            </Button>
            </Box>
      );
    }

    useEffect(() => {
      fetchChats(userEmail, isAgent); 
    }, []);

    return (
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Chats
          </Typography>
          <Box sx={{ display: 'flex', height: '500px', gap: "20px" }}>
            <Box sx={{ width: '200px', borderRight: '1px solid #ccc', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px' }}>
              <Typography variant="h6" gutterBottom>
                Booking ID
              </Typography>
              <List>
                  {chats.map((chat) => (
                      <ListItem button key={chat.booking_id} onClick={() => { setCurrentBookingId(chat.booking_id); fetchMessages(chat.booking_id); }}>
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
    
}

export default SupportChat;