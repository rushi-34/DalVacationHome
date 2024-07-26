import React from 'react';
import { Box, Grid } from '@mui/material';
import Navbar from '../components/Navbar';

const AgentDashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2} justifyContent="center"> 
        <Grid item xs={12} sm={6} md={4}> 
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/1bb58321-3520-4ab2-aca4-e4e7f9be1e10/page/0Ts6D"
            className="dashboard-iframe"
            title="Report 1"
            style={{ width: "100%", height: "calc(80vh - 100px)" }} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/c6e10603-2d16-44e6-9d25-3f2028151e0c/page/OPs6D"
            className="dashboard-iframe"
            title="Report 2"
            style={{ width: "100%", height: "calc(80vh - 100px)" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/f6adbdd9-2889-4f1d-baef-fcd6386d8d0a/page/RTs6D"
            className="dashboard-iframe"
            title="Report 3"
            style={{ width: "100%", height: "calc(80vh - 100px)" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentDashboard;
