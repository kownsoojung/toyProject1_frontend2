import React, { createContext, useContext, useState, ReactNode, useRef } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import Draggable from "react-draggable";
type ModalItem = {
  key: string;
  title: string;
  content: (props?: any) => ReactNode;
  props?: any;
};

type ModalContextType = {
  openModal: (key: string, title: string, pagePath: string, props?: any) => void;
  closeModal: (key: string) => void;
};

const ModalContext = createContext<ModalContextType | null>(null);
export const useModal = () => useContext(ModalContext)!;

export const TabModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 페이지 lazy import
  const modules = import.meta.glob("/src/pages/**/*.tsx");

  const openModal = (key: string, title: string, pagePath: string, props?: any) => {
    const modalKey = `${key}-${Date.now()}`;
    let renderContent: (props?: any) => ReactNode;

    const importKey = `/src/pages${pagePath}.tsx`;
    if (modules[importKey]) {
      const Component = React.lazy(modules[importKey] as any);
      renderContent = (p?: any) => (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Component {...p} />
        </React.Suspense>
      );
    } else {
      renderContent = () => <div>Page Not Found</div>;
    }

    setModals(prev => [...prev, { key: modalKey, title, content: renderContent, props }]);
  };

  const closeModal = (key: string) => {
    setModals(prev => prev.filter(m => m.key !== key));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      <Box ref={containerRef} sx={{ width: "100%", height: "100%", transform: 'translateZ(0)', p: 2 }}>
        {children}

        {modals.map(m => {
          const nodeRef = React.createRef<HTMLDivElement>();

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
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box className="draggable-handle"  sx={{ p: 1, borderBottom: "1px solid #ccc", paddingLeft:3}}>
                  <Typography variant="h6">{m.title}</Typography>
                  </Box>
                  <Box sx={{ p: 3, overflowY: "auto", flexGrow: 1 }}>
                    <Box sx={{ mt: 2 }}>{m.content(m.props)}</Box>
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
