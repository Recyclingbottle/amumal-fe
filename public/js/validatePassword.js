document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const passwordHelper = document.getElementById("password-helper");
  const confirmPasswordHelper = document.getElementById(
    "confirm-password-helper"
  );
  const button = document.querySelector(".signup-butoton");

  function validatePassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    passwordHelper.textContent = "";
    confirmPasswordHelper.textContent = "";

    if (!password) {
      passwordHelper.textContent = "*비밀번호를 입력해주세요";
      return false;
    } else if (!regex.test(password)) {
      passwordHelper.textContent =
        "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
      return false;
    }

    if (!confirmPassword) {
      confirmPasswordHelper.textContent = "비밀번호를 한번 더 입력해주세요";
      return false;
    } else if (password !== confirmPassword) {
      confirmPasswordHelper.textContent = "*비밀번호 확인과 다릅니다.";
      return false;
    }

    return true;
  }

  passwordInput.addEventListener("input", function () {
    validatePassword();
    updateButtonState();
  });

  confirmPasswordInput.addEventListener("input", function () {
    validatePassword();
    updateButtonState();
  });

  function updateButtonState() {
    if (validatePassword()) {
      button.disabled = false;
      button.style.backgroundColor = "#7F6AEE";
    } else {
      button.disabled = true;
      button.style.backgroundColor = "#ACA0EB";
    }
  }

  updateButtonState();
});
