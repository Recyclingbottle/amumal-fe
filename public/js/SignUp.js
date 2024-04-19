document.addEventListener("DOMContentLoaded", function () {
  const formElements = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirm-password"),
    nickname: document.getElementById("nickname"),
    profileImage: document.getElementById("profile-img"),
    signUpButton: document.querySelector(".signup-button"),
    imgPreview: document.getElementById("profile-img-preview"),
  };

  let usersData = [];

  fetch("../data/UserInfo.json")
    .then((response) => response.json())
    .then((data) => (usersData = data));

  function updateHelperText(element, message) {
    const helperElement = document.getElementById(element.id + "-helper");
    helperElement.textContent = message;
  }

  function validateField(field) {
    switch (field.id) {
      case "email":
        return validateEmail(field.value);
      case "password":
        return validatePassword(field.value);
      case "nickname":
        return validateNickname(field.value);
      case "confirm-password":
        return field.value !== formElements.password.value
          ? "*비밀번호가 다릅니다."
          : "";
      case "profile-img":
        return field.files.length ? "" : "*프로필 사진을 추가해주세요.";
      default:
        return "";
    }
  }

  function validateEmail(email) {
    if (!email) return "*이메일을 입력해주세요.";
    if (email.length < 5 || !/^[^@]+@[^@]+\.[^@]+$/.test(email))
      return "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
    if (usersData.some((user) => user.email === email))
      return "*중복된 이메일입니다.";
    return "";
  }

  function validatePassword(password) {
    if (!password) return "*비밀번호를 입력해주세요";
    if (
      password.length < 8 ||
      password.length > 20 ||
      !/[A-Za-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[\!\@\#\$\%\^\&\*]/.test(password)
    )
      return "*비밀번호는 8자 이상, 20자 이하이며, 문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    return "";
  }

  function validateNickname(nickname) {
    if (!nickname) return "*닉네임을 입력해주세요.";
    if (/\s/.test(nickname)) return "*띄어쓰기를 없애주세요";
    if (nickname.length > 10) return "*닉네임은 최대 10자까지 작성 가능합니다.";
    if (usersData.some((user) => user.nickname === nickname))
      return "*중복된 닉네임입니다.";
    return "";
  }

  function handleInputEvent(event) {
    const field = event.target;
    updateHelperText(field, validateField(field));
    checkAllFields();
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        formElements.imgPreview.src = e.target.result;
        applyStylesToImagePreview(formElements.imgPreview);
      };
      reader.readAsDataURL(file);
    } else {
      formElements.imgPreview.src = "../images/add-icon.png";
      removeStylesFromImagePreview(formElements.imgPreview);
    }
  }

  function applyStylesToImagePreview(imageElement) {
    imageElement.style.width = "149px";
    imageElement.style.height = "149px";
    imageElement.style.borderRadius = "100%";
  }

  function removeStylesFromImagePreview(imageElement) {
    imageElement.style.width = "";
    imageElement.style.height = "";
    imageElement.style.borderRadius = "";
  }

  function checkAllFields() {
    formElements.signUpButton.disabled = ![
      formElements.email,
      formElements.password,
      formElements.confirmPassword,
      formElements.nickname,
    ].every((input) => !validateField(input));
  }

  Object.values(formElements).forEach((element) => {
    if (element.tagName === "INPUT") {
      element.addEventListener("change", handleInputEvent);
      element.addEventListener("blur", handleInputEvent);
    }
  });

  formElements.profileImage.addEventListener("change", handleFileUpload);

  formElements.signUpButton.addEventListener("click", function () {
    if (!this.disabled) {
      alert("회원 가입이 완료되었습니다.");
      window.location.href = "./index.html";
    }
  });
});
