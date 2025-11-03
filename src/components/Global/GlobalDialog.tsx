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

  // ⭐ 자동으로 닫히는 로직
  React.useEffect(() => {
    if (currentDialog && currentDialog.autoClose) {
      const timer = setTimeout(() => {
        handleClose(currentDialog.id);
      }, currentDialog.autoClose);

      return () => clearTimeout(timer);
    }
  }, [currentDialog?.id, currentDialog?.autoClose]);

  if (!currentDialog) return null;

  const isConfirm = currentDialog.type === 'confirm';
  const hasAutoClose = currentDialog.autoClose !== undefined; // ⭐ 자동 닫힘 여부

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
      sx={{
        // ⭐ Dialog root에 직접 flex 적용
        '& .MuiBackdrop-root': {
          // backdrop도 가운데 정렬을 위해
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '& .MuiDialog-container': {
          display: 'flex !important',
          alignItems: 'center !important',
          justifyContent: 'center !important',
          minHeight: '100%',
          position: 'relative',
        },
        ...(container && {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }),
      }}
      PaperProps={{
        sx: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          borderRadius: 3,
          minWidth: 400,
          margin: 'auto', // ⭐ 자동 마진으로 가운데 정렬 보조
          '@keyframes popIn': {
            '0%': {
              transform: 'scale(0.7)',
              opacity: 0,
            },
            '50%': {
              transform: 'scale(1.05)',
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
          },
          animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transformOrigin: 'center center',
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
          // ⭐ autoClose가 있으면 버튼 숨김
          !hasAutoClose && (
            <Button
              onClick={() => handleClose(currentDialog.id)}
              variant="contained"
              autoFocus
              size="large"
              sx={{ minWidth: 120, fontSize: '1rem' }}
            >
              {currentDialog.confirmText || '확인'}
            </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  );
};

