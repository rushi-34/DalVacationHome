import React from 'react';
import Navbar from '../components/Navbar';

const AgentDashboard = () => {
  return (
    <div>
      <Navbar />
      <h1 className="text-3xl">Agent Side Features!</h1>
      <div className="mt-8">
        <iframe
          width="600"
          height="450"
          src="https://lookerstudio.google.com/embed/reporting/1bb58321-3520-4ab2-aca4-e4e7f9be1e10/page/0Ts6D"
          // frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
        <iframe
          width="600"
          height="450"
          src="https://lookerstudio.google.com/embed/reporting/c6e10603-2d16-44e6-9d25-3f2028151e0c/page/OPs6D"
          // frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
        <iframe
          width="600"
          height="450"
          src="https://lookerstudio.google.com/embed/reporting/f6adbdd9-2889-4f1d-baef-fcd6386d8d0a/page/RTs6D"
          // frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
      </div>
    </div>
  );
};

export default AgentDashboard;
