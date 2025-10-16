import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeToast } from '@/store/slices/toastSlice';

interface GlobalToastProps {
  container?: HTMLElement | null;
}

export const GlobalToast: React.FC<GlobalToastProps> = ({ container }) => {
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
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={() => dispatch(removeToast(currentToast.id))}
      disablePortal={!!container}
      container={container ? () => container : undefined}
      sx={container ? {
        position: 'absolute',
      } : undefined}
    >
      <Alert
        onClose={() => dispatch(removeToast(currentToast.id))}
        severity={currentToast.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {currentToast.message}
      </Alert>
    </Snackbar>
  );
};

