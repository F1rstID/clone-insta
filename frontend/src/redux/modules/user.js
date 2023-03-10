import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../shared/api"

const initialState = {
  loginSocial:{},
  isLoading: false,
  error: null,
};


export const __userOauthGoogle = createAsyncThunk(
  "oauth/USER_OAUTH_GOOGLE",
  async (payload, thunkAPI) => {
    try{
      const data = await api.post(`auth/google`, { payload })
      .then((res)=>{
        //console.log('๐ ๊ตฌ๊ธ ๋ก๊ทธ์ธ res : ', res)
        //console.log('๐ ๊ตฌ๊ธ ๋ก๊ทธ์ธ res.headers : ', res.headers)
        //console.log('๐ ๊ตฌ๊ธ ๋ก๊ทธ์ธ res.headers.authorization : ', res.headers.authorization)
        //console.log('๐ ๊ตฌ๊ธ ๋ก๊ทธ์ธ res.data.nickname : ', res.data.nickname)
        const accessToken = res.headers.authorization;
        const refreshToken = res.headers.refreshtoken;
        const nickname = res.data.nickname;
        //console.log('๐ ๊ตฌ๊ธ ๋ก๊ทธ์ธ res.headers.authorization : ', res.headers.authorization)
        //์ ์  ํ ํฐ + ๋๋ค์์ด ์๋ค๋ฉด ๊ฐ์ ธ์จ ํ ์ธํ
        if(accessToken && refreshToken && nickname){
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("nickname", nickname);
        }else{
          alert('์ธ์ฆ ์ค๋ฅ! ๋ค์ ์๋ํด์ฃผ์ธ์!')
          return window.location.assign("/");
        }
        //์ ์  ํ ํฐ + ๋๋ค์ ๊ฐ์ ธ์ค๊ธฐ
        const accessTokenGet = localStorage.getItem("token");
        const refreshTokenGet = localStorage.getItem("refreshToken");
        const nicknameGet = localStorage.getItem("nickname");
        if(accessTokenGet && refreshTokenGet && nicknameGet){
          alert('์์๋ก๊ทธ์ธ ์ธ์ฆ ์๋ฃ!')
          window.location.assign("/main");
        }else{
          alert('์ฐ๊ฒฐ ์ค๋ฅ! ๋ค์ ์๋ํด์ฃผ์ธ์!')
          return window.location.assign("/");
        }
        return res
      })
      return thunkAPI.fulfillWithValue(data)
    }catch(error){
      window.location.assign("/");
      return thunkAPI.rejectWithValue(error)
    }
  }
);





export const __userOauthKakao = createAsyncThunk(
  "oauth/USER_OAUTH_KAKAO",
  async (payload, thunkAPI) => {
    try{
      const data = await api.post(`auth/kakao`, {payload})
      .then((res)=>{
        //console.log('๐ ์นด์นด์ค ๋ก๊ทธ์ธ res : ', res)
        //console.log('๐ ์นด์นด์ค ๋ก๊ทธ์ธ res.headers : ', res.headers)
        //console.log('๐ ์นด์นด์ค ๋ก๊ทธ์ธ res.headers.authorization : ', res.headers.authorization)
        //console.log('๐ ์นด์นด์ค ๋ก๊ทธ์ธ res.data.nickname : ', res.data.nickname)
        const accessToken = res.headers.authorization;
        const refreshToken = res.headers.refreshtoken;
        const nickname = res.data.nickname;
        
        //์ ์  ํ ํฐ + ๋๋ค์์ด ์๋ค๋ฉด ๊ฐ์ ธ์จ ํ ์ธํ
         if(accessToken && refreshToken && nickname){
           localStorage.setItem("token", accessToken);
           localStorage.setItem("refreshToken", refreshToken);
           localStorage.setItem("nickname", nickname);
         }else{
           //console.log('๐ ์นด์นด์ค ๋ก๊ทธ์ธ res 2 : ', res)
           alert('์ธ์ฆ ์ค๋ฅ! ๋ค์ ์๋ํด์ฃผ์ธ์!')
            return window.location.assign("/");
         }
         //์ ์  ํ ํฐ + ๋๋ค์ ๊ฐ์ ธ์ค๊ธฐ
         const accessTokenGet = localStorage.getItem("token");
         const refreshTokenGet = localStorage.getItem("refreshToken");
         const nicknameGet = localStorage.getItem("nickname");
         if(accessTokenGet && refreshTokenGet && nicknameGet){
           alert('์์๋ก๊ทธ์ธ ์ธ์ฆ ์๋ฃ!')
           window.location.assign("/main");
         }else{
           alert('์ฐ๊ฒฐ ์ค๋ฅ! ๋ค์ ์๋ํด์ฃผ์ธ์!')
           return window.location.assign("/");
         }
         return res
      })
      return thunkAPI.fulfillWithValue(data)
    }catch(error){
      window.location.assign("/");
      return thunkAPI.rejectWithValue(error)
    }
  }
);




const userOauth = createSlice({
  name: "userOauth",
  initialState,
  reducers: {
  },
  extraReducers: {
    //์นด์นด์ค
    [__userOauthKakao.pending]: (state) => {
      state.isLoading = true; // ๋คํธ์ํฌ ์์ฒญ์ด ์์๋๋ฉด ๋ก๋ฉ์ํ๋ฅผ true๋ก ๋ณ๊ฒฝ
    },
    [__userOauthKakao.fulfilled]: (state, action) => {
      state.isLoading = false; // ๋คํธ์ํฌ ์์ฒญ์ด ๋๋ฌ์ผ๋, false๋ก ๋ณ๊ฒฝ
      state.kakao = action.payload; // Store์ ์๋ state.data์ ์๋ฒ์์ ๊ฐ์ ธ์จ action.payload ์ถ๊ฐ
      //console.log('state.kakao : ' , state.kakao)
    },
    [__userOauthKakao.rejected]: (state, action) => {
      state.isLoading = false; // ์๋ฌ๊ฐ ๋ฐ์ํ์ง๋ง, ๋คํธ์ํฌ ์์ฒญ์ด ๋๋ฌ์ผ๋, false๋ก ๋ณ๊ฒฝ
      state.error = action.payload; // catch ๋ error ๊ฐ์ฒด๋ฅผ state.error์ ์ถ๊ฐ
    },
    //๊ตฌ๊ธ
    [__userOauthGoogle.pending]: (state) => {
      state.isLoading = true; // ๋คํธ์ํฌ ์์ฒญ์ด ์์๋๋ฉด ๋ก๋ฉ์ํ๋ฅผ true๋ก ๋ณ๊ฒฝ
    },
    [__userOauthGoogle.fulfilled]: (state, action) => {
      state.isLoading = false; // ๋คํธ์ํฌ ์์ฒญ์ด ๋๋ฌ์ผ๋, false๋ก ๋ณ๊ฒฝ
      state.google = action.payload; // Store์ ์๋ state.data์ ์๋ฒ์์ ๊ฐ์ ธ์จ action.payload ์ถ๊ฐ
      //console.log('state.kakao : ' , state.kakao)
    },
    [__userOauthGoogle.rejected]: (state, action) => {
      state.isLoading = false; // ์๋ฌ๊ฐ ๋ฐ์ํ์ง๋ง, ๋คํธ์ํฌ ์์ฒญ์ด ๋๋ฌ์ผ๋, false๋ก ๋ณ๊ฒฝ
      state.error = action.payload; // catch ๋ error ๊ฐ์ฒด๋ฅผ state.error์ ์ถ๊ฐ
    },
  },
});

// ์ก์ํฌ๋ฆฌ์์ดํฐ๋ ์ปดํฌ๋ํธ์์ ์ฌ์ฉํ๊ธฐ ์ํด export ํ๊ณ 
export const {} = userOauth.actions;
// reducer ๋ configStore์ ๋ฑ๋กํ๊ธฐ ์ํด export default ํฉ๋๋ค.
export default userOauth.reducer;