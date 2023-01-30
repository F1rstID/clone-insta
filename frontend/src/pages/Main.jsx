import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import PostItem from "../components/PostItem";
import { __postsMain } from "../redux/modules/postsMainSlice";
import PostDetailModal from "../components/PostDetailModal";

const Main = () => {
  const dispatch = useDispatch();
  //모달 상태
  const isGlobalModalPostDetail = useSelector(
    (state) => state.postDetailSlice.isGlobalModalPostDetail
  );
  //게시글 전체 조회
  const posts = useSelector((state) => state.postsMainSlice.posts);
  console.log("메인 게시글 data", posts);
  useEffect(() => {
    dispatch(__postsMain()); //게시글 전체 조회
  }, []);
  //글 상세 내용 조회
  const postDetailObj = useSelector(
    (state) => state.postDetailSlice.postDetailObj
  );
  console.log(":두꺼운_확인_표시: postDetailObj : ", postDetailObj);
  return (
    <StMainWrap
      //모달 창 오픈시 뒷 배경 스크롤 막기
      overflow={!isGlobalModalPostDetail ? "auto" : "hidden"}
      height={!isGlobalModalPostDetail ? "auto" : ""}
    >
      <StMainPostItemBox>
        {posts?.map((post) => {
          return (
            <PostItem
              key={post.id}
              id={post.id}
              content={post.content}
              nickname={post.nickname}
              image={post.imageUrl}
              createAt={post.createAt}
              updateAt={post.updateAt}
              likes={post.likes}
              commentCount={post.commentCount}
            />
          );
        })}
      </StMainPostItemBox>
      <PostDetailModal
        key={postDetailObj.key}
        id={postDetailObj.id}
        content={postDetailObj.content}
        nickname={postDetailObj.nickname}
        image={postDetailObj.image}
        createAt={postDetailObj.createAt}
        likes={postDetailObj.likes}
      />
    </StMainWrap>
  );
};

const StMainWrap = styled.div`
  margin-left: 290px;
  padding: 30px 20px 80px 20px;
  overflow-y: ${(props) => props.overflow || "auto"};
  height: ${(props) => props.height || "auto"};
`;
const StMainPostItemBox = styled.div`
  width: auto;
  max-width: 1200px;
  min-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 16px;
`;

export default Main;
