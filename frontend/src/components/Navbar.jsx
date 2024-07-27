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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthenticationContext } from "../ContextProvider";
import ConcernModal from './ConcernModal';

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
  const [openConcernModal, setOpenConcernModal] = useState(false);

  const navigate = useNavigate();
  const handleOpenConcernModal = () => setOpenConcernModal(true);
  const handleCloseConcernModal = () => setOpenConcernModal(false);

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
            <Button color="inherit" variant="text" component={Link} to="/" sx={{ fontSize: "24px", fontWeight: "bold" }}>
              DAL
            </Button>
            <Typography variant="h6" component="div" sx={{ color: 'white' }}>
              VacationHome
            </Typography>
          </Box>
          {userRole === 'agent' ? (
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
              <Button
                color="inherit"
                component={Link}
                to="/app/support"
                sx={{
                  mx: 2,
                  color: 'white',
                  fontSize: '1rem',
                  borderBottom: location.pathname === '/app/support' ? '2px solid white' : '2px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderBottom: '2px solid white',
                  },
                  transition: 'all 0.3s',
                  padding: '6px 16px',
                }}
              >
                Chat
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/app/agent/dashboard"
                sx={{
                  mx: 2,
                  color: 'white',
                  fontSize: '1rem',
                  borderBottom: location.pathname === '/app/agent/dashboard' ? '2px solid white' : '2px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderBottom: '2px solid white',
                  },
                  transition: 'all 0.3s',
                  padding: '6px 16px',
                }}
              >
                Analytics
              </Button>
            </Box>
          ) : userRole === 'client' ? (
            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'right' }}>
              <Button
                color="inherit"
                component={Link}
>>>>>>> dev
                to="/app/support"
                sx={{
                  mx: 2,
                  color: 'white',
                  fontSize: '1rem',
                  borderBottom: location.pathname === '/app/support' ? '2px solid white' : '2px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderBottom: '2px solid white',
                  },
                  transition: 'all 0.3s',
                  padding: '6px 16px',
                }}
              >
                Chat
              </Button>
            </Box>
          ) : (null)}

          {/* <Button color="inherit" variant="text" component={Link} to="/feedbacks" sx={{
            alignSelf: 'right',
          }}>
            Feedbacks</Button>
          {
            !userRole && location.pathname === '/guest' ? (
              <Button color="inherit" variant="text" component={Link} to="/login">
                Login
              </Button>
            ) : !userRole && location.pathname === '/login' ? (
              <Button color="inherit" variant="text" component={Link} to="/guest">
                Guest
              </Button>
            ) : !userRole && location.pathname === '/feedbacks' ? (
              <Button color="inherit" variant="text" component={Link} to="/login">
                Login
              </Button>
            ) : (
              console.log(auth),
              <CustomButton
                color="secondary"
                variant="contained"
                onClick={handleLogout}
                sx={{ marginLeft: 2 }}
              >
                Logout
              </CustomButton>
            )
          } */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" variant="text" component={Link} to="/feedbacks" sx={{ marginRight: 2 }}>
              Feedbacks
            </Button>
            {!userRole && location.pathname === '/guest' && (
              <Button color="inherit" variant="text" component={Link} to="/login" sx={{ marginRight: 2 }}>
                Login
              </Button>
            )}
            {!userRole && location.pathname === '/login' && (
              <Button color="inherit" variant="text" component={Link} to="/guest" sx={{ marginRight: 2 }}>
                Guest
              </Button>
            )}
            {!userRole && location.pathname === '/feedbacks' && (
              <Button color="inherit" variant="text" component={Link} to="/login" sx={{ marginRight: 2 }}>
                Login
              </Button>
            )}
            {userRole && (
              <CustomButton
                color="secondary"
                variant="contained"
                onClick={handleLogout}
                sx={{ marginLeft: 2 }}
              >
                Logout
              </CustomButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default NavBar;