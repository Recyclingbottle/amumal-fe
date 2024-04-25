const BASE_URL = "https://fb53-180-70-118-11.ngrok-free.app";

document.addEventListener("DOMContentLoaded", function () {
  // 이전 페이지로 돌아가기 위한 이미지에 클릭 이벤트 연결
  const navigateBackImg = document.getElementById("navigate-back-img");
  navigateBackImg.addEventListener("click", () => {
    // 화살표 함수로 변경
    window.history.back();
  });
  let uploadedFileName = "";
  const formElements = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirm-password"),
    nickname: document.getElementById("nickname"),
    profileImage: document.getElementById("profile-img"),
    signUpButton: document.querySelector(".signup-button"),
    imgPreview: document.getElementById("profile-img-preview"),
  };

  // 유효성 검사 결과 업데이트
  const updateHelperText = (element, message) => {
    // 화살표 함수로 변경
    const helperElement = document.getElementById(`${element.id}-helper`);
    helperElement.textContent = message;
  };

  // 입력 필드 유효성 검사
  const validateField = async (field) => {
    // 화살표 함수와 async 사용
    let validationResult = "";
    switch (field.id) {
      case "email":
        validationResult = await validateEmail(field.value);
        break;
      case "password":
        validationResult = validatePassword(field.value);
        break;
      case "nickname":
        validationResult = await validateNickname(field.value);
        break;
      case "confirm-password":
        validationResult =
          field.value !== formElements.password.value
            ? "*비밀번호가 다릅니다."
            : "";
        break;
      case "profile-img":
        validationResult = field.files.length
          ? ""
          : "*프로필 사진을 추가해주세요.";
        break;
    }
    updateHelperText(field, validationResult);
    return validationResult;
  };

  // 이메일 유효성 검사 함수
  const validateEmail = async (email) => {
    // 화살표 함수와 async 사용
    if (!email) return "*이메일을 입력해주세요.";
    if (email.length < 5 || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
    }
    try {
      const message = await checkEmailAvailability(email); // 비동기 결과를 기다림

      return message; // 결과 메시지 반환
    } catch (error) {
      console.error("Validation error:", error);
      return "*이메일 검사 중 문제가 발생했습니다.";
    }
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    // 화살표 함수로 변경
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
  };

  const validateNickname = async (nickname) => {
    // 화살표 함수와 async 사용
    if (!nickname) return "*닉네임을 입력해주세요.";
    if (/\s/.test(nickname)) return "*띄어쓰기를 없애주세요";
    if (nickname.length > 10) return "*닉네임은 최대 10자까지 작성 가능합니다.";
    try {
      const response = await fetch(
        `${BASE_URL}/users/check-nickname?nickname=${encodeURIComponent(
          nickname
        )}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error("Error checking nickname:", error);
      return "닉네임 검사 중 오류가 발생했습니다.";
    }
  };

  // 이미지 파일 업로드 처리
  const handleFileUpload = (event) => {
    // 화살표 함수로 변경
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        // 화살표 함수와 async 사용
        formElements.imgPreview.src = e.target.result;
        try {
          uploadedFileName = await uploadImage(file);
        } catch (error) {
          console.error("Failed to upload file:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 서버에 업로드
  function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    return fetch(`${BASE_URL}/upload/profile`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "File uploaded successfully") {
          return data.filename; // 업로드된 파일명 반환
        } else {
          throw new Error("Failed to upload image");
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  }

  // 회원가입 데이터 전송
  const registerUser = async (email, password, nickname, profileImagePath) => {
    // 화살표 함수와 async 사용
    const userData = {
      email: email,
      password: password,
      nickname: nickname,
      profile_image: profileImagePath,
    };

    // 서버에 회원가입 요청 전송
    return fetch(`${BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          return response.json(); // 응답이 성공적이면 JSON 데이터 반환
        } else {
          throw new Error("회원가입 실패"); // 응답이 실패하면 예외 발생
        }
      })
      .then((data) => {
        return { success: true, data }; // 성공 객체 반환
      })
      .catch((error) => {
        console.error("회원 가입 오류:", error);
        return { success: false, message: error.message }; // 실패 객체 반환
      });
    if (response.ok) {
      return { success: true, data: await response.json() };
    } else {
      throw new Error("회원가입 실패");
    }
  };
  // 이메일 중복 검사 요청
  function checkEmailAvailability(email) {
    return fetch(
      `${BASE_URL}/users/check-email?email=${encodeURIComponent(email)}`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        // console.log("Response:", response.json()); // response 로그 출력
        return response.json();
      })
      .then((data) => {
        return data.message; // 서버로부터 받은 메시지 반환
      })
      .catch((error) => {
        console.error("Error checking email:", error);
        return "이메일 검사 중 오류가 발생했습니다."; // 오류 처리
      });
  }

  // 닉네임 중복 검사 요청
  function checkNicknameAvailability(nickname) {
    return fetch(
      `${BASE_URL}/users/check-nickname?nickname=${encodeURIComponent(
        nickname
      )}`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json()) // 상태 코드와 무관하게 응답을 json으로 파싱
      .then((data) => {
        return data.message; // 서버로부터 받은 메시지 반환
      })
      .catch((error) => {
        console.error("Error checking nickname:", error);
        return "닉네임 검사 중 오류가 발생했습니다."; // 오류 처리
      });
  }

  // 이미지 미리보기 스타일 적용
  function applyStylesToImagePreview(imageElement) {
    imageElement.style.width = "149px";
    imageElement.style.height = "149px";
    imageElement.style.borderRadius = "100%";
  }

  // 모든 필드의 유효성을 검사하여 회원가입 버튼 활성화 상태 결정
  async function checkAllFields() {
    const results = await Promise.all([
      validateField(formElements.email),
      validateField(formElements.password),
      validateField(formElements.confirmPassword),
      validateField(formElements.nickname),
      validateField(formElements.profileImage),
    ]);
  }

  // 각 입력 요소에 대한 이벤트 리스너 설정
  Object.values(formElements).forEach((element) => {
    if (element.tagName === "INPUT") {
      element.addEventListener("input", async () => {
        await checkAllFields(); // 입력이 있을 때마다 모든 필드 검사
      });
    }
  });

  // 프로필 이미지 업로드 이벤트 리스너 설정
  formElements.profileImage.addEventListener("change", handleFileUpload);

  // 회원가입 버튼에 클릭 이벤트 바인딩
  formElements.signUpButton.addEventListener("click", async () => {
    // 화살표 함수와 async 사용
    const signupResult = await registerUser(
      formElements.email.value,
      formElements.password.value,
      formElements.nickname.value,
      uploadedFileName
    );
    if (signupResult.success) {
      alert("회원 가입이 완료되었습니다.");
      window.location.href = "/"; // 회원가입 성공 후 로그인 페이지로 이동
    } else {
      alert("회원가입 실패: " + signupResult.message);
    }
  });
});
