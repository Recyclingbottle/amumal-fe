const BASE_URL = "https://fb53-180-70-118-11.ngrok-free.app";

document.addEventListener("DOMContentLoaded", () => {
  // 화살표 함수로 변경
  const profilePicture = document.querySelector(".profile-picture");
  const menu = document.querySelector(".menu");
  let menuTimeout;

  const auth_token = localStorage.getItem("auth_token");
  const user_id = localStorage.getItem("user_id");
  const userNickname = localStorage.getItem("userNickname");
  const user_profileImage = localStorage.getItem("user_profileImage");
  const user_email = localStorage.getItem("user_email");

  if (user_profileImage) {
    profilePicture.src = `${BASE_URL}/images/profile/${user_profileImage}`;
  }

  profilePicture.addEventListener("mouseenter", () => {
    // 화살표 함수로 변경
    clearTimeout(menuTimeout);
    menu.style.display = "block";
  });

  profilePicture.addEventListener("mouseleave", () => {
    // 화살표 함수로 변경
    menuTimeout = setTimeout(() => {
      // 화살표 함수로 변경
      menu.style.display = "none";
    }, 3000);
  });

  let isLoading = false;
  let page = 0;

  const fetchPosts = () => {
    // 화살표 함수로 변경
    if (isLoading) return;
    isLoading = true;

    fetch(`${BASE_URL}/posts`, {
      method: "GET",
      headers: {
        // Bearer 토큰을 사용한 인증 헤더
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((post) => createPostElement(post));
        page++;
        isLoading = false;
      })
      .catch((error) => {
        console.error("Error loading posts:", error);
        isLoading = false;
      });
  };

  window.addEventListener("scroll", () => {
    // 화살표 함수로 변경
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
      fetchPosts();
    }
  });

  fetchPosts();

  const createPostElement = (post) => {
    // 화살표 함수로 변경
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.innerHTML = `
        <h3 class="post-title">${post.title}</h3>
        <div class="post-meta">
          <span class="likes">좋아요 ${formatCount(post.likes)}</span>
          <span class="comments">댓글수 ${formatCount(
            post.commentsCount
          )}</span>
          <span class="views">조회수 ${formatCount(post.views)}</span>
          <time class="post-date">${new Date(post.date).toLocaleString()}</time>
        </div>
        <div class="author-info">
          <img src="${BASE_URL}/images/profile/${
      post.author.profileImage_path
    }" alt="${
      post.author.nickname
    }의 프로필 이미지" class="author-profile-picture">
          <span class="author-name">${post.author.nickname}</span>
        </div>
    `;

    postDiv.addEventListener("click", () => {
      // 화살표 함수로 변경
      location.href = `/posts/${post.id}`;
    });

    document.getElementById("postsContainer").appendChild(postDiv);
  };

  const formatCount = (num) => {
    // 화살표 함수로 변경
    if (num >= 100000) return `${(num / 1000).toFixed(0)}k`;
    if (num >= 10000) return `${(num / 1000).toFixed(0)}k`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num;
  };
});
