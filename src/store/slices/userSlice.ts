import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userId: string | null;
  username: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  centerId: number | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
}

const initialState: UserState = {
  userId: null,
  username: null,
  name: null,
  email: null,
  role: null,
  centerId: null,
  accessToken: null,
  refreshToken: null,
  tokenType: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => {
      // localStorage도 함께 삭제
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      return initialState;
    },
    loadUserFromStorage: (state) => {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser && savedToken) {
        const userData = JSON.parse(savedUser);
        return { ...state, ...userData, accessToken: savedToken };
      }
      return state;
    },
  },
});

export const { setUser, clearUser, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;

