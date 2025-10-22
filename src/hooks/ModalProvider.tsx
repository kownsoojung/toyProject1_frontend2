import React, { createContext, useContext, useState, ReactNode, useRef } from "react";
import { Box, Button, Modal, Typography, CircularProgress } from "@mui/material";
import Draggable from "react-draggable";
import { GlobalLoading } from "@/components";
type ModalItem = {
  key: string;
  title: string;
  content?: (props?: any) => ReactNode;
  pagePath?: string;
  props?: any;
  width?: number | string;
  height?: number | string;
  onClose?: (result?: any) => void;
};

type ModalContextType = {
  openModal: (options: ModalItem) => void; 
  closeModal: (key: string) => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    console.error('❌ useModal must be used within TabModalProvider');
    // 기본 fallback 반환
    return {
      openModal: () => console.warn('useModal called outside TabModalProvider'),
      closeModal: () => console.warn('useModal called outside TabModalProvider'),
    };
  }
  return context;
};

export const TabModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 페이지 lazy import
  const modules = import.meta.glob("/src/pages/**/*.tsx");

  const openModal = (options: ModalItem) => {
    const { key, title, pagePath, props, onClose, width, height } = options;
    const modalKey = `${key}-${Date.now()}`;
    let renderContent: (props?: any) => ReactNode;

    const importKey = `/src/pages${pagePath}.tsx`;
    if (modules[importKey]) {
      const Component = React.lazy(modules[importKey] as any);
      renderContent = (p?: any) => (
        <React.Suspense fallback={
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              minHeight: 200,
              flexDirection: "column",
              gap: 2
            }}
          >
            <CircularProgress size={50} thickness={4} />
            <Box sx={{ color: "text.secondary", fontSize: 14 }}>로딩 중...</Box>
          </Box>
        }>
          <Component {...p} />
        </React.Suspense>
      );
    } else {
      renderContent = () => <div>Page Not Found</div>;
    }

    setModals(prev => [...prev, { key: modalKey, title, content: renderContent, props, onClose, width, height }]);
  };

  const closeModal = (key: string, result?: any) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.key === key);
      if (modal?.onClose) modal.onClose(result); 
      return prev.filter((m) => m.key !== key);
    });
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      <Box ref={containerRef} sx={{ width: "100%", height: "100%", transform: 'translateZ(0)', position: "absolute"}}>
        {children}
        
        {/* 탭 영역 로딩 */}
        <GlobalLoading />

        {modals.map(m => {
          const nodeRef = React.createRef<HTMLDivElement>();
          const modalContentRef = React.createRef<HTMLDivElement>();

          return (
             
          <Modal
            key={m.key}
            open
            onClose={() => {}}
            disablePortal
            container={() => containerRef.current!}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "auto", }}
          >
            <div>
              <Draggable handle=".draggable-handle" nodeRef={nodeRef}>
                <Box
                ref={nodeRef}
                  sx={{
                    maxWidth: 1200,
                    maxHeight: 800,
                    width: m.width ?? "auto",
                    height: m.height ?? "auto",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <Box className="draggable-handle"  sx={{ p: 1, borderBottom: "1px solid #ccc", paddingLeft:3}}>
                  <Typography variant="h6">{m.title}</Typography>
                  </Box>
                  <Box 
                    ref={modalContentRef}
                    sx={{ 
                      overflowY: "auto", 
                      flexGrow: 1,
                      position: "relative",
                      transform: 'translateZ(0)',
                    }}
                  >
                    <Box sx={{ mt: 2 }}>{m.content?.(m.props)}</Box>
                  </Box>
                  <Box sx={{ p: 1, borderTop: "1px solid #ccc", textAlign:"right" }}>
                    <Button onClick={() => closeModal(m.key)} >닫기</Button>
                  </Box>
                </Box>
              </Draggable>
            </div>
          </Modal>
          )
        })}
      </Box>
    </ModalContext.Provider>
  );
};
