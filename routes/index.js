const express = require("express");
const router = express.Router();
const path = require("path");

// 메인 페이지 (로그인 필요)
router.get("/", (req, res) => {
  // 로그인 상태를 확인하는 코드는 아직 구현되지 않았으므로 가정합니다.
  const loggedIn = false; // 로그인 여부를 체크하는 부분(가정)
  if (!loggedIn) {
    res.redirect("/login");
  } else {
    res.sendFile(path.join(__dirname, "../views", "index.html"));
  }
});

// 로그인 페이지
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "login.html"));
});

// 회원가입 페이지
router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "signup.html"));
});

// 게시글 목록 페이지
router.get("/posts", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "post-list.html"));
});

// 게시글 작성 페이지
router.get("/posts/new", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "post-edit.html")); // 게시글 작성과 수정을 같은 페이지에서 처리할 수 있도록 설정
});

// 게시글 상세 조회 페이지
router.get("/posts/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "post-detail.html"));
});

// 게시글 수정 페이지
router.get("/posts/:id/edit", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "post-edit.html"));
});

// 프로필 수정 페이지
router.get("/profile/edit", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "profile-edit.html"));
});

// 비밀번호 변경 페이지
router.get("/password/change", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "password-change.html"));
});

module.exports = router;
