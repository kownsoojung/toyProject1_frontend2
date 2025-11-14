// Header.tsx
import { AForm, ASwitch, FlexBox } from "@/components";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { useAppSelector } from "@/store/hooks";
import { KeyboardArrowDown, Menu as MenuIcon, MenuOpen as MenuOpenIcon, Person, PhoneAndroidTwoTone, Sms } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CallStatusBar } from "./CallStatusBar";
import { CallControlPanel } from "./CallControlPanel";

const Header: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useLayoutContext();
  const user = useAppSelector((state) => state.user);
  const [myMenuAnchorEl, setMyMenuAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(myMenuAnchorEl);
  const ctiSlice = useAppSelector((state) => state.cti);
  
  const handleMenuItemClick = (item: string) => {
    setMyMenuAnchorEl(null);
    if (item === "2") {
      // 로그아웃 처리
      localStorage.clear();
      window.location.href = "/login";
    }
  };
  
  const handleToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const methods = useForm({
    defaultValues: {
      boardStatus: "",
    },
  });
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        color: "text.primary",
        boxShadow: "0 2px 8px #f0f1f2",
        transition: "all 0.2s ease",
      }}
    > 
      <Box sx={{ bgcolor:"#1fb5a9", height:36, padding : "0 20px" , lineHeight: "36px", alignItems: "center", display: "flex", justifyContent: "space-between", }}>
        <Box component="img"
          src="data:image/png;base64,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"
          />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ color: "#fff", fontSize: 13, fontWeight: 600, marginLeft: 1, display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} 
            onClick={(event: React.MouseEvent<HTMLElement>)=>setMyMenuAnchorEl(event.currentTarget)} >
            <Person sx={{ color: "#fff", fontSize: 16 }} />
            {user.name} ({user.dn})
            <KeyboardArrowDown  />
          </Box>
          <Menu
            anchorEl={myMenuAnchorEl}
            open={open}
            onClose={() => setMyMenuAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => handleMenuItemClick("1")}>내 정보</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("2")}>로그아웃</MenuItem>
          </Menu>
        </Box>
      </Box>
      <fieldset style={{ border: "none", margin: 0, padding: 0 }} disabled={!ctiSlice.isConnected}>
        <Toolbar sx={{ height: 44,  gap: 1, backgroundColor: "#6A6A6A", color: "#fff", fontSize: 13, alignItems: "center", lineHeight: 1.5, justifyContent: "space-between", display: "flex",
        "&.MuiToolbar-root": {
          minHeight: 44,
          height: 44,
        }}}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        
            <IconButton edge="start" onClick={handleToggle} sx={{ mr: 2, fontSize: 20, color: "#fff" }}>
              {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            <CallStatusBar />

            <FlexBox id="boardStatus" sxProps={{ marginLeft: 1, alignItems: "center"}}>
              <AForm isTable={false} marginB={0} formStyle={{ display: "flex", alignItems: "center", gap: 1 }} >
                <ASwitch label="채팅" value={true} />
                <ASwitch label="이메일" />
                <ASwitch label="Qna" />
                <ASwitch label="게시판" />
              </AForm>
            </FlexBox>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center"}}>
            <CallControlPanel />
            <FlexBox id="sendInfo" sxProps={{ marginLeft: 3, gap: 1 }}>
              <Sms sx={{ color: "#fff", cursor: "pointer" }}  />
              <PhoneAndroidTwoTone sx={{ color: "#fff", cursor: "pointer" }} />
            </FlexBox>
          </Box>
        </Toolbar>
      </fieldset>
    </Box>
);
};

export default Header;
