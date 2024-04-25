const BASE_URL = "https://fb53-180-70-118-11.ngrok-free.app";

document.addEventListener("DOMContentLoaded", function () {
  // 화살표 함수로 변경
  const token = localStorage.getItem("auth_token");
  const profileImg = document.getElementById("profileImg");
  const helperText = document.getElementById("helper-text");
  const nicknameInput = document.getElementById("nickname");
  const updateButton = document.querySelector(".signup-butoton");
  const userId = localStorage.getItem("user_id");
  const user_profileImage = localStorage.getItem("user_profileImage");
  const userEmail = localStorage.getItem("user_email");
  const user_nickname = localStorage.getItem("user_nickname");
  document.querySelector("#email").innerText = userEmail;
  document.querySelector("#nickname").value = user_nickname;
  const bannerprofileimg = document.querySelector(".profile-picture");
  bannerprofileimg.src = `${BASE_URL}/images/profile/${user_profileImage}`;
  profileImg.src = `${BASE_URL}/images/profile/${user_profileImage}`;
  nicknameInput.addEventListener("input", validateNickname);

  profileImg.addEventListener("click", () => {
    // 화살표 함수로 변경
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      // 화살표 함수로 변경
      const file = e.target.files[0];
      uploadProfileImage(file);
    };
    fileInput.click();
  });

  updateButton.addEventListener("click", () => {
    // 화살표 함수로 변경
    submitProfileUpdate();
  });

  // 프로필 이미지 업로드
  function uploadProfileImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    fetch(`${BASE_URL}/upload/profile`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.filename) {
          profileImg.src = `${BASE_URL}/images/profile/${data.filename}`;
          localStorage.setItem("user_profileImage", data.filename); // 업로드된 파일 이름 저장
        }
      })
      .catch((error) => console.error("프로필 이미지 업로드 실패:", error));
  }

  // 사용자 정보 수정 제출
  function submitProfileUpdate() {
    const profileImage = localStorage.getItem("user_profileImage");
    const updatedNickname = nicknameInput.value;

    fetch(`${BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nickname: updatedNickname,
        profile_image: profileImage,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("프로필이 성공적으로 업데이트되었습니다.");
          localStorage.clear();
          window.location.href = "/";
        } else {
          alert("프로필 업데이트에 실패했습니다.");
        }
      })
      .catch((error) => console.error("프로필 업데이트 중 오류 발생:", error));
  }

  // 닉네임 유효성 검사 및 중복 체크
  function validateNickname() {
    const newNickname = nicknameInput.value;
    helperText.textContent = "";

    if (!newNickname) {
      helperText.textContent = "닉네임을 입력해주세요.";
      updateButton.disabled = true;
      return;
    }

    fetch(
      `http://localhost:3000/users/check-nickname?nickname=${newNickname}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) =>
        response.json().then((data) => {
          // Promises chain 정리
          if (response.ok) {
            helperText.textContent = data.message;
            updateButton.disabled = false;
          } else {
            throw new Error(data.message);
          }
        })
      )
      .catch((error) => {
        helperText.textContent = error.message;
        updateButton.disabled = true;
      });
  }
  const modal = document.getElementById("myModal");
  const modalOpenLink = document.querySelector(".go-to-login");
  const modalCloseButton = modal.querySelector(".cancel");
  const modalConfirmButton = modal.querySelector(".confirm");

  // 모달 열기
  modalOpenLink.addEventListener("click", (event) => {
    // 화살표 함수로 변경
    event.preventDefault(); // 기본 동작 방지
    modal.style.display = "block";
  });

  // 모달 닫기
  modalCloseButton.addEventListener("click", () => {
    // 화살표 함수로 변경
    modal.style.display = "none";
  });

  // 모달 내 '확인' 버튼 클릭 이벤트
  modalConfirmButton.addEventListener("click", () => {
    // 화살표 함수로 변경
    deleteUserAccount();
  });

  function deleteUserAccount() {
    const userId = localStorage.getItem("user_id");
    fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("회원 탈퇴가 완료되었습니다.");
          localStorage.clear(); // 로컬 스토리지 클리어
          window.location.href = "/";
        } else {
          alert("회원 탈퇴에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("회원 탈퇴 중 오류 발생:", error);
        alert("네트워크 오류로 회원 탈퇴를 진행할 수 없습니다.");
      })
      .finally(() => {
        modal.style.display = "none";
      });
  }
});
