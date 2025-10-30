import { createContext, useContext } from "react";

// ============================================
// 🎯 타입 정의
// ============================================
export type ModalItem = {
  key: string;
  title: string;
  content?: (props?: any) => React.ReactNode;
  pagePath?: string;
  props?: any;
  width?: number | string;
  height?: number | string;
  onClose?: (result?: any) => void;
};

export type ModalContextType = {
  openModal: (options: ModalItem) => void; 
  closeModal: (key: string, result?: any) => void;
};

// ============================================
// 🎯 Context 정의 (변경 거의 없음)
// ============================================
export const ModalContext = createContext<ModalContextType | null>(null);
export const ModalKeyContext = createContext<string | null>(null);
export const OpenerContext = createContext<any>(null);

// ============================================
// 🎯 Hooks
// ============================================
export const useModal = () => {
  const context = useContext(ModalContext);
  const modalKey = useContext(ModalKeyContext); 
  
  if (!context) {
    console.error('❌ useModal must be used within TabModalProvider');
    return {
      openModal: () => console.warn('useModal called outside TabModalProvider'),
      closeModal: () => console.warn('useModal called outside TabModalProvider'),
      closeCurrentModal: () => console.warn('useModal called outside TabModalProvider'),
    };
  }
  
  return {
    ...context,
    closeCurrentModal: (result?: any) => {
      if (modalKey) {
        context.closeModal(modalKey, result);
      }
    }
  };
};

export const useOpener = () => {
  const opener = useContext(OpenerContext);
  return opener;
};

