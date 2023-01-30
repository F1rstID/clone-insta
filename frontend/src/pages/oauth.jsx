// 리다이렉트 URI 화면
import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Cookies } from 'react-cookie';
import { __userOauthKakao } from '../redux/modules/user';

//import { actionCreators as userAction } from "../redux/modules/user";
// import Spinner from "../elements/Spinner";

const KakaoAuthHandler = (props) => {

  const dispatch = useDispatch();

  const cookies = new Cookies()
  const cookieToken = cookies.get('token')
  // const code = new URL(window.location.href).searchParams.get("code");

  console.log('❗❗❗ oauth 페이지로 이동 완료 ❗❗❗')
  console.log('❗❗❗ oauth 페이지 document.cookie : ', cookieToken)

  useEffect(()=>{ //백엔드로 쿠키 토큰 전송
    //dispatch(__userOauthKakao(cookieToken))
  },[])


  return (
    <>
      <Wrap>
        <StLoadingText>사용자 인증하는 중 🔒</StLoadingText>
        <StInfiniteRotatingLogo>⏳</StInfiniteRotatingLogo>
      </Wrap>
    </>
  )
};

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  background-color: #fffcdc;
`
const StLoadingText=styled.div`
  margin-bottom: 50px;
`
const StInfiniteRotatingLogo=styled.div`
  font-size: 40px;
  text-align: center;
  box-sizing: border-box;
  animation: rotate_image 1.5s linear infinite;
  transform-origin: 50% 50%;
  @keyframes rotate_image{
  100% {
      transform: rotate(360deg);
    }
  }
`



export default KakaoAuthHandler;