"use client";

// pages/index.tsx

import React from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Button, Box } from '@mui/material';

const Opening: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Box>
        <Typography variant="h2" component="h1" gutterBottom>
          StoryNode
        </Typography>
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNavigation('/signin')}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleNavigation('/signup')}
          >
            SignUp
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Opening;


// "use client";

// // pages/index.tsx

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Container, Typography, Button, Box } from '@mui/material';
// import { keyframes } from '@emotion/react';

// const Opening: React.FC = () => {
//   const router = useRouter();
  
//   const [showContent, setShowContent] = useState(false);

//   useEffect(() => {
//     // コンテンツがフェードインするアニメーション
//     setTimeout(() => {
//       setShowContent(true);
//     }, 500);
//   }, []);

//   const handleNavigation = (path: string) => {
//     router.push(path);
//   };

//   // アニメーションの定義
//   const fadeIn = keyframes`
//     from {
//       opacity: 0;
//       transform: translateY(-20px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   `;

//   const pulse = keyframes`
//     0% {
//       transform: scale(1);
//     }
//     50% {
//       transform: scale(1.05);
//     }
//     100% {
//       transform: scale(1);
//     }
//   `;

//   return (
//     <Container
//       maxWidth="sm"
//       sx={{
//         textAlign: 'center',
//         mt: 10,
//         animation: `${fadeIn} 1s ease-out`,
//       }}
//     >
//       {showContent && (
//         <Box>
//           <Typography
//             variant="h2"
//             component="h1"
//             gutterBottom
//             sx={{
//               animation: `${fadeIn} 1s ease-out`,
//               fontWeight: 'bold',
//               background: 'linear-gradient(90deg, #00DBDE 0%, #FC00FF 100%)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//             }}
//           >
//             StoryNode
//           </Typography>

//           <Box mt={4} display="flex" justifyContent="center" gap={2}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => handleNavigation('/signin')}
//               sx={{
//                 px: 4,
//                 py: 1.5,
//                 backgroundColor: '#6200EA',
//                 color: 'white',
//                 borderRadius: '50px',
//                 fontSize: '1.2rem',
//                 fontWeight: 'bold',
//                 textTransform: 'none',
//                 boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
//                 transition: 'transform 0.3s ease',
//                 '&:hover': {
//                   backgroundColor: '#3700B3',
//                   transform: 'translateY(-5px)',
//                 },
//                 animation: `${pulse} 2s infinite`,
//               }}
//             >
//               ログイン
//             </Button>
//             <Button
//               variant="outlined"
//               color="primary"
//               onClick={() => handleNavigation('/signup')}
//               sx={{
//                 px: 4,
//                 py: 1.5,
//                 borderRadius: '50px',
//                 fontSize: '1.2rem',
//                 fontWeight: 'bold',
//                 textTransform: 'none',
//                 border: '2px solid #6200EA',
//                 color: '#6200EA',
//                 transition: 'all 0.3s ease',
//                 '&:hover': {
//                   backgroundColor: '#6200EA',
//                   color: 'white',
//                   transform: 'translateY(-5px)',
//                   boxShadow: '0px 4px 20px rgba(98, 0, 234, 0.5)',
//                 },
//                 animation: `${pulse} 2s infinite`,
//               }}
//             >
//               新規登録
//             </Button>
//           </Box>
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default Opening;
