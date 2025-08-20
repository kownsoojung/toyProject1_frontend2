import { Box, Button, ButtonGroup, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true"); // 임시 예시
    navigate("/"); // 로그인 후 메인 페이지로 이동

  }

  const handleJoins =() => {
    navigate("/register"); 
  }

  return ( 
    <Box
      sx={{display:"flex", 
        flexDirection:"column",
        alignItems:"center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
        <Typography variant="h4" mb={3}>로그인</Typography>
        <TextField
          label="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 20 }} 
          type="text"
        />
        <TextField
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{display:"flex", gap:1}}>
          <Button variant="contained" onClick={handleLogin}>
            로그인
          </Button>
          <Button variant="outlined" onClick={handleJoins}>
            회원가입
          </Button>
        </Box>
      </Box>
   );
}

export default LoginPage;

