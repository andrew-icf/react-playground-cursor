import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
  username: string;
  password: string;
}

const initialState: LoginState = {
  username: '',
  password: '',
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    updateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    updatePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    resetLogin: () => initialState,
  },
});

export const { updateUsername, updatePassword, resetLogin } = loginSlice.actions;
export default loginSlice.reducer;

