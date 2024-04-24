const BASE_URL = "http://localhost:3000";

const validateLoginForm = () => {
  // 화살표 함수로 변경
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const helperText = document.getElementById("login-helper");

  // 이메일과 비밀번호의 기본 유효성 검사
  if (email.length === 0 || !email.includes("@")) {
    helperText.innerText = "올바른 이메일 주소를 입력하세요.";
    return false;
  } else if (password.length === 0) {
    helperText.innerText = "비밀번호를 입력하세요.";
    return false;
  } else {
    helperText.innerText = "";
    return true;
  }
};

document.getElementById("login-button").addEventListener("click", () => {
  // 화살표 함수로 변경
  if (validateLoginForm()) {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("auth_token", data.token);

        const decoded = jwt_decode(data.token); // jwt_decode 사용을 위해 해당 라이브러리의 import 필요

        localStorage.setItem("user_id", decoded.userId);
        localStorage.setItem("user_email", decoded.email);
        localStorage.setItem("user_nickname", decoded.nickname);
        localStorage.setItem("user_profileImage", decoded.profileImage);

        window.location.href = "/posts";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});

document.getElementById("signup-button").addEventListener("click", () => {
  // 화살표 함수로 변경
  window.location.href = "/signup"; // 회원가입 페이지로 리디렉션
});

// 입력 변경 시 유효성 검사
document.getElementById("email").addEventListener("input", validateLoginForm);
document
  .getElementById("password")
  .addEventListener("input", validateLoginForm);
