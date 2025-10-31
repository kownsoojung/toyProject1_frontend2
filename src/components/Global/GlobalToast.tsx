import React, { useEffect } from 'react';
import { Alert, Box, Fade, Slide } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeToast } from '@/store/slices/toastSlice';

export interface GlobalToastProps {
  container?: HTMLElement | null;
  tabKey?: string; // ⭐ 현재 탭 키
}

export const GlobalToast: React.FC<GlobalToastProps> = ({ tabKey }) => {
  const toasts = useAppSelector(state => state.toast.toasts);
  const dispatch = useAppDispatch();

  // ⭐ 현재 탭의 토스트만 필터링
  const tabToasts = toasts.filter(t => t.tabKey === tabKey || !t.tabKey);
  
  // 가장 최근 토스트만 표시
  const currentToast = tabToasts[tabToasts.length - 1];

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
    <Fade in={true} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
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
    </Fade>
  );
};

