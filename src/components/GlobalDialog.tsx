import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  AlertTitle,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { closeDialog } from '@/store/slices/dialogSlice';

interface GlobalDialogProps {
  container?: HTMLElement | null;
}

export const GlobalDialog: React.FC<GlobalDialogProps> = ({ container }) => {
  const dialogs = useAppSelector(state => state.dialog.dialogs);
  const dispatch = useAppDispatch();

  const handleClose = (id: string) => {
    dispatch(closeDialog(id));
  };

  // 가장 최근 다이얼로그만 표시
  const currentDialog = dialogs[dialogs.length - 1];

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
    >
      {currentDialog.title && (
        <DialogTitle>{currentDialog.title}</DialogTitle>
      )}
      <DialogContent>
        {currentDialog.type !== 'confirm' ? (
          <Alert severity={getSeverity()}>
            {currentDialog.title && currentDialog.type !== 'info' && (
              <AlertTitle>{currentDialog.title}</AlertTitle>
            )}
            {currentDialog.message}
          </Alert>
        ) : (
          <DialogContentText>{currentDialog.message}</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        {isConfirm ? (
          <>
            <Button
              onClick={() => {
                handleClose(currentDialog.id);
                // onCancel 콜백이 있으면 실행
                currentDialog.onCancel?.();
              }}
              color="inherit"
            >
              {currentDialog.cancelText || '취소'}
            </Button>
            <Button
              onClick={() => {
                handleClose(currentDialog.id);
                // onConfirm 콜백이 있으면 실행
                currentDialog.onConfirm?.();
              }}
              variant="contained"
              autoFocus
            >
              {currentDialog.confirmText || '확인'}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => handleClose(currentDialog.id)}
            variant="contained"
            autoFocus
          >
            {currentDialog.confirmText || '확인'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

