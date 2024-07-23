import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import { logout } from "../CognitoHelper"; 
import CustomButton from './CustomButton'; 
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthenticationContext } from "../ContextProvider";

const theme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#ffffff',
    },
    background: {
      default: '#212121', 
      paper: '#212121',  
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', 
  },
});

function NavBar() {
  const [auth, setAuth] = useState(true);
  const { userRole } = useContext(AuthenticationContext);
  const location = useLocation();

  const handleLogout = () => {
    logout(); 
    setAuth(false); 
    window.location.href = "/login"; 
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary" elevation={0}> 
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0 24px' }}> 
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', marginRight: 1, color: 'white' }}>
              DAL
            </Typography>
            <Typography variant="h6" component="div" sx={{ color: 'white' }}>
              VacationHome
            </Typography>
          </Box>
          {userRole === 'agent' && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/app/agent"
                sx={{ 
                  mx: 2, 
                  color: 'white', 
                  fontSize: '1rem',
                  borderBottom: location.pathname === '/app/agent' ? '2px solid white' : '2px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderBottom: '2px solid white',
                  },
                  transition: 'all 0.3s',
                  padding: '6px 16px',
                }}
              >
                Rooms
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/app/agent/add-room"
                sx={{ 
                  mx: 2, 
                  color: 'white', 
                  fontSize: '1rem',
                  borderBottom: location.pathname === '/app/agent/add-room' ? '2px solid white' : '2px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderBottom: '2px solid white',
                  },
                  transition: 'all 0.3s',
                  padding: '6px 16px',
                }}
              >
                Add Room
              </Button>
            </Box>
          )}
          {auth ? ( 
            <CustomButton
              color="secondary"
              variant="contained"
              onClick={handleLogout}
              sx={{ marginLeft: 2 }} 
            >
              Logout
            </CustomButton>
          ) : (
            <Button color="inherit" variant="text" component={Link} to="/login">
              Login
            </Button>
          )} 
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default NavBar;