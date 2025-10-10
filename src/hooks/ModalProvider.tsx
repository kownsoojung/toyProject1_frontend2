// ModalProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

type ModalItem = {
  key: string;
  title: string;
  content: ReactNode;
};

type ModalContextType = {
  openModal: (key: string, title: string, content: ReactNode) => void;
  closeModal: (key: string) => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => useContext(ModalContext)!;

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalItem[]>([]);

  const openModal = (key: string, title: string, content: ReactNode) => {
    setModals(prev => [...prev, { key, title, content }]);
  };

  const closeModal = (key: string) => {
    setModals(prev => prev.filter(m => m.key !== key));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map((m, idx) => (
        <Dialog
          key={m.key}
          open
          onClose={() => closeModal(m.key)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { top: 50 + idx * 20, zIndex: 1300 + idx } }}
        >
          <DialogTitle>{m.title}</DialogTitle>
          <DialogContent dividers>{m.content}</DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={() => closeModal(m.key)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      ))}
    </ModalContext.Provider>
  );
};
