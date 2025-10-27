import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { closeDialog } from '@/store/slices/dialogSlice';

export interface GlobalDialogProps {
  container?: HTMLElement | null;
  tabKey?: string; // ⭐ 현재 탭 키
}

export const GlobalDialog: React.FC<GlobalDialogProps> = ({ container, tabKey }) => {
  const dialogs = useAppSelector(state => state.dialog.dialogs);
  const dispatch = useAppDispatch();

  const handleClose = (id: string) => {
    dispatch(closeDialog(id));
  };

  // ⭐ 현재 탭의 다이얼로그만 필터링
  const tabDialogs = dialogs.filter(d => d.tabKey === tabKey || !d.tabKey);
  
  // 가장 최근 다이얼로그만 표시
  const currentDialog = tabDialogs[tabDialogs.length - 1];

  if (!currentDialog) return null;

  const isConfirm = currentDialog.type === 'confirm';

  const getSeverity = () => {
    switch (currentDialog.type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  return (
    <Dialog
      open={true}
      onClose={() => handleClose(currentDialog.id)}
      maxWidth="sm"
      fullWidth
      disablePortal={!!container}
      container={container ? () => container : undefined}
      sx={container ? {
        position: 'absolute',
      } : undefined}
      PaperProps={{
        sx: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          borderRadius: 3,
          minWidth: 400,
        }
      }}
    >
      {currentDialog.title && (
        <DialogTitle sx={{ 
          fontSize: '1.5rem', 
          fontWeight: 600,
          pb: 1,
        }}>
          {currentDialog.title}
        </DialogTitle>
      )}
      <DialogContent sx={{ pt: 2, pb: 3 }}>
        {currentDialog.type !== 'confirm' ? (
          <Alert 
            severity={getSeverity()}
            variant="filled"
            sx={{
              fontSize: '1.1rem',
              padding: '16px 20px',
              '& .MuiAlert-message': {
                fontSize: '1.1rem',
                fontWeight: 500,
              },
              '& .MuiAlert-icon': {
                fontSize: 32,
              }
            }}
          >
            {currentDialog.message}
          </Alert>
        ) : (
          <DialogContentText sx={{ 
            fontSize: '1.1rem',
            color: 'text.primary',
            lineHeight: 1.6,
            fontWeight: 500,
          }}>
            {currentDialog.message}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        {isConfirm ? (
          <>
            <Button
              onClick={() => {
                handleClose(currentDialog.id);
                currentDialog.onCancel?.();
              }}
              color="inherit"
              size="large"
              sx={{ minWidth: 100, fontSize: '1rem' }}
            >
              {currentDialog.cancelText || '취소'}
            </Button>
            <Button
              onClick={() => {
                handleClose(currentDialog.id);
                currentDialog.onConfirm?.();
              }}
              variant="contained"
              autoFocus
              size="large"
              sx={{ minWidth: 100, fontSize: '1rem' }}
            >
              {currentDialog.confirmText || '확인'}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => handleClose(currentDialog.id)}
            variant="contained"
            autoFocus
            size="large"
            sx={{ minWidth: 120, fontSize: '1rem' }}
          >
            {currentDialog.confirmText || '확인'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

