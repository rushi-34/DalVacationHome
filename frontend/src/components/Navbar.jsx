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

  const handleLogout = () => {
    logout(); 
    setAuth(false); 
    window.location.href = "/login"; 
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary" elevation={0}> 
        <Toolbar sx={{ justifyContent: 'space-between' }}> 
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', marginRight: 1, color: 'white' }}>
              DAL
            </Typography>
            <Typography variant="h6" component="div" sx={{ color: 'white' }}>
              VacationHome
            </Typography>
          </Box>
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
