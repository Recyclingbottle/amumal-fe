function validateLoginForm() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let helperText = document.getElementById("login-helper");

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
}
document.getElementById("login-button").addEventListener("click", function () {
  if (validateLoginForm()) {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("../data/UserInfo.json")
      .then((response) => response.json())
      .then((users) => {
        const user = users.find((user) => user.email === email);
        if (!user) {
          alert("해당 이메일로 등록된 사용자가 없습니다.");
        } else if (user.password !== password) {
          alert("비밀번호가 틀립니다.");
        } else {
          document.querySelector(".login-button").style.backgroundColor =
            "#7F6AEE";
          // 로컬 스토리지에 사용자 정보 저장하기
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userNickname", user.nickname);
          localStorage.setItem("userProfileImage", user.profile_image);
          window.location.href = "./posts.html";
        }
      })
      .catch((error) => {
        console.error("사용자 정보를 불러오는 중 오류가 발생했습니다:", error);
      });
  }
});

// 입력 변경 시 유효성 검사
document.getElementById("email").addEventListener("input", validateLoginForm);
document
  .getElementById("password")
  .addEventListener("input", validateLoginForm);
