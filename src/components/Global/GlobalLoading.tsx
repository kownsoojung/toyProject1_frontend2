import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useAppSelector } from '@/store/hooks';

interface GlobalLoadingProps {
  // container는 필요 없음 - 자연스럽게 부모 영역에 렌더링됨
}

export const GlobalLoading: React.FC<GlobalLoadingProps> = () => {
  const { isLoading, message } = useAppSelector(state => state.loading);
  
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1400, // Dialog보다 높게
        pointerEvents: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress 
          size={60} 
          thickness={4} 
          sx={{ color: 'white' }}
        />
        {message && (
          <Typography variant="h6" sx={{ color: 'white' }}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

