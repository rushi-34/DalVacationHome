import React, { useState } from "react";
import { IconButton, Box, Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import chatbotImage from "/assets/chat-bot.svg";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <Box 
                sx={{ 
                    position: 'fixed', 
                    bottom: '2rem', 
                    right: '4rem', 
                    zIndex: 50 
                }}
            >
                <Box 
                    component="img"
                    src={chatbotImage}
                    alt="Chatbot Button"
                    onClick={toggleChatbot}
                    sx={{
                        cursor: 'pointer',
                        width: 64,
                        height: 64,
                        mb: 4,
                        borderRadius: '50%',
                        border: '2px solid #1976d2',
                        p: 1,
                        backgroundColor: '#fff',
                        boxShadow: 3,
                    }}
                />

                <Dialog 
                    open={isOpen} 
                    onClose={toggleChatbot}
                    PaperProps={{
                        sx: {
                            position: 'fixed',
                            bottom: '4rem',
                            right: '6rem',
                            width: 350,
                            height: 430,
                            m: 0,
                            borderRadius: 2,
                            boxShadow: 3,
                            overflow: 'hidden',
                        }
                    }}
                >
                    <Box 
                        sx={{ 
                            position: 'relative', 
                            width: '100%', 
                            height: '100%' 
                        }}
                    >
                        <IconButton 
                            onClick={toggleChatbot}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                zIndex: 50,
                                color: '#1976d2',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <iframe
                            width="100%"
                            height="100%"
                            allow="microphone;"
                            src="https://console.dialogflow.com/api-client/demo/embedded/fcf69ca3-3b5f-4c17-b368-1aa20a6f66c7"
                            style={{
                                border: 0,
                            }}
                        ></iframe>
                    </Box>
                </Dialog>
            </Box>
        </>
    );
}

export default ChatBot;


// import React, { useState } from "react";
// import { Box, Fab, Dialog, DialogContent, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import chatbotImage from "/assets/chat-bot.svg";

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleChatbot = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1050 }}>
//       <Fab
//         onClick={toggleChatbot}
//         sx={{
//           width: 64,
//           height: 64,
//           '&:hover': {
//             cursor: 'pointer'
//           }
//         }}
//       >
//         <Box
//           component="img"
//           src={chatbotImage}
//           alt="Chatbot Button"
//           sx={{ width: '100%', height: '100%' }}
//         />
//       </Fab>
      
//       <Dialog
//         open={isOpen}
//         onClose={toggleChatbot}
//         PaperProps={{
//           sx: {
//             position: 'fixed',
//             bottom: 96,
//             right: 16,
//             m: 0,
//             width: 350,
//             height: 430,
//             maxWidth: 'none',
//             maxHeight: 'none',
//           }
//         }}
//       >
//         <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
//           <IconButton
//             onClick={toggleChatbot}
//             sx={{
//               position: 'absolute',
//               right: 8,
//               top: 8,
//               color: 'grey.500',
//               zIndex: 1
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//           <iframe
//             width="100%"
//             height="100%"
//             allow="microphone;"
//             src="https://console.dialogflow.com/api-client/demo/embedded/fcf69ca3-3b5f-4c17-b368-1aa20a6f66c7"
//             style={{ border: 'none' }}
//           />
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// };

// export default ChatBot;
