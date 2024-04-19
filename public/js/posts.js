document.addEventListener("DOMContentLoaded", function () {
  const profilePicture = document.querySelector(".profile-picture");
  const menu = document.querySelector(".menu");
  let menuTimeout;

  const userEmail = localStorage.getItem("userEmail");
  const userNickname = localStorage.getItem("userNickname");
  const userProfileImage = localStorage.getItem("userProfileImage");

  if (userProfileImage) {
    profilePicture.src = `../images/${userProfileImage}`;
  }

  profilePicture.addEventListener("mouseenter", function () {
    clearTimeout(menuTimeout);
    menu.style.display = "block";
  });

  profilePicture.addEventListener("mouseleave", function () {
    menuTimeout = setTimeout(function () {
      menu.style.display = "none";
    }, 3000);
  });

  let isLoading = false;
  let page = 0;

  function fetchPosts() {
    if (isLoading) return;
    isLoading = true;

    fetch(`../data/Posts.json`)
      .then((response) => response.json())
      .then((data) => {
        data.posts.forEach((post) => createPostElement(post));
        page++;
        isLoading = false;
      })
      .catch((error) => console.error("Error loading posts:", error));
  }

  window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
      fetchPosts();
    }
  });

  fetchPosts();

  function createPostElement(post) {
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
          <img src="../images/${post.author.profileImage}" alt="${
      post.author.nickname
    }의 프로필 이미지" class="author-profile-picture">
          <span class="author-name">${post.author.nickname}</span>
        </div>
      `;

    postDiv.addEventListener("click", () => {
      location.href = "./post-detail.html?postId=" + post.id;
    });

    document.getElementById("postsContainer").appendChild(postDiv);
  }

  function formatCount(num) {
    if (num >= 100000) return (num / 1000).toFixed(0) + "k";
    if (num >= 10000) return (num / 1000).toFixed(0) + "k";
    if (num >= 1000) return (num / 1000).toFixed(0) + "k";
    return num;
  }
});
