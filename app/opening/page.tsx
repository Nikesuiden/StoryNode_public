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
            ログイン
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleNavigation('/signup')}
          >
            新規登録
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Opening;
