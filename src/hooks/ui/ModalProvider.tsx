import React, { useState, ReactNode, useRef } from "react";
import { Box, Modal, Typography, CircularProgress, IconButton } from "@mui/material";
import Draggable from "react-draggable";
import { GlobalLoading } from "@/components";
import CloseIcon from "@mui/icons-material/Close";

// 🎯 Context는 별도 파일에서 import (HMR 안정성)
import { 
  ModalContext, 
  ModalKeyContext, 
  OpenerContext,
  type ModalItem 
} from "./ModalContext";

// 🎯 hooks를 re-export (기존 import 경로 유지)
export { useModal, useOpener } from "./ModalContext";

export const TabModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🎯 popup 폴더만 로드
  const modules = import.meta.glob("/src/pages/**/*.tsx");

  const openModal = (options: ModalItem) => {
    const { key, title, pagePath, props, onClose, width, height } = options;
    const modalKey = `${key}-${Date.now()}`;
    let renderContent: (props?: any) => ReactNode;

    const importKey = `/src/pages${pagePath}.tsx`;
    console.log("🔍 팝업 로드:", importKey);
    
    if (modules[importKey]) {
      const Component = React.lazy(() => {
        return modules[importKey]().then((mod: any) => {
          console.log("🔄 팝업 새로 로드:", importKey);
          return mod;
        });
      });
      
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
          <OpenerContext.Provider value={p?.opener || null}>
            <ModalKeyContext.Provider value={modalKey}>
              <Component {...p} />
            </ModalKeyContext.Provider>
          </OpenerContext.Provider>
        </React.Suspense>
      );
    } else {
      console.error("❌ 팝업을 찾을 수 없음:", importKey, "사용 가능:", Object.keys(modules));
      renderContent = () => <div>Page Not Found: {pagePath}</div>;
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
                  tabIndex={-1} 
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
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography >{m.title}</Typography>
                      <IconButton aria-label="close"   onClick={() => closeModal(m.key)} ><CloseIcon /> </IconButton>
                    </Box>
                  </Box>
                  <Box 
                    ref={modalContentRef}
                    sx={{ 
                      
                      flexGrow: 1,
                      position: "relative",
                      transform: 'translateZ(0)',
                      display: "flex",  // 추가
                      flexDirection: "column",  // 추가
                      overflow: "hidden", 
                    }}
                  >
                   {m.content?.(m.props)}
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

// ============================================
// 🎯 HMR 처리
// ============================================
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('✅ ModalProvider HMR - popup 업데이트만');
  });
}

