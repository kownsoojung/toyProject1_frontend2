import React, { useEffect } from 'react';
import { Alert, Box, Slide } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeToast } from '@/store/slices/toastSlice';

interface GlobalToastProps {
  container?: HTMLElement | null;
}

export const GlobalToast: React.FC<GlobalToastProps> = () => {
  const toasts = useAppSelector(state => state.toast.toasts);
  const dispatch = useAppDispatch();

  // 가장 최근 토스트만 표시
  const currentToast = toasts[toasts.length - 1];

  useEffect(() => {
    if (currentToast) {
      const timer = setTimeout(() => {
        dispatch(removeToast(currentToast.id));
      }, currentToast.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [currentToast, dispatch]);

  if (!currentToast) return null;

  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1500,
          minWidth: 300,
          maxWidth: 500,
        }}
      >
        <Alert
          onClose={() => dispatch(removeToast(currentToast.id))}
          severity={currentToast.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        >
          {currentToast.message}
        </Alert>
      </Box>
    </Slide>
  );
};

