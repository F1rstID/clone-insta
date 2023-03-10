import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../shared/api";

axios.defaults.withCredentials = true;

const initialState = {
  user: {},
  isLoading: false,
  error: null,
  is_login: false,
};

export const __loginUser = createAsyncThunk(
  "loginUser",
  async (payload, thunkAPI) => {
    try {
      const data = await api.post(`auth/local`, payload);
      // console.log("ํ์ธ:", data.status);
      if (data.status === 201) {
        //console.log("๐๐๐๋ก๊ทธ์ธ res.status : ", data);
        const accessToken = data.data.token.AccessToken;
        const refreshToken = data.data.token.RefreshToken;
        const nickName = data.data.nickname;

        if(accessToken && refreshToken && nickName){
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("nickName", nickName);
        }
        alert("๋ก๊ทธ์ธ ์ฑ๊ณต!!!");
        window.location.assign("/main");
      }
      // console.log("login data", data);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      alert("๋ค์ ํ์ธํด์ฃผ์ธ์.");
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const loginSlice = createSlice({
  name: "loginUser",
  initialState,
  reducers: {},
  extraReducers: {
    [__loginUser.pending]: (state) => {
      state.isLoading = true;
    },
    [__loginUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
      //console.log("๋ก๊ทธ์ธ state.users", state.users);
      //console.log("๋ก๊ทธ์ธ action payload", action.payload);
      state.isLoginOk = true;
    },
    [__loginUser.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      //console.log("state err", state.error);
      state.isLoginOk = false;
      state.users = null;
    },
  },
});

export const {} = loginSlice.actions;
export default loginSlice.reducer;
