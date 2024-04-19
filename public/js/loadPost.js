document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = parseInt(urlParams.get("postId"), 10);
  let currentPost;

  fetch("../data/Posts.json")
    .then((response) => response.json())
    .then((data) => {
      currentPost = data.posts.find((p) => p.id === postId);
      if (currentPost) {
        updatePostDetails(currentPost);
        updateComments(currentPost.comments);
      } else {
        document.getElementById("postContainer").innerHTML =
          "<p>해당 게시글을 찾을 수 없습니다.</p>";
      }
    })
    .catch((error) => {
      console.error("게시글을 로드하는 중 에러가 발생했습니다:", error);
    });

  document
    .querySelector(".edit-post-btn")
    .addEventListener("click", function () {
      if (currentPost) {
        const queryParams = new URLSearchParams({
          id: currentPost.id,
          title: currentPost.title,
          content: currentPost.content,
          image: currentPost.postImage,
        });
        window.location.href = `./edit-post.html?${queryParams.toString()}`;
      }
    });

  const postDeletionModal = document.getElementById("postDeletionModal");
  const commentDeletionModal = document.getElementById("commentDeletionModal");

  document
    .querySelector(".delete-post-btn")
    .addEventListener("click", function () {
      postDeletionModal.style.display = "block";
    });

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-comment-btn")) {
      commentDeletionModal.style.display = "block";
    }
  });

  document
    .querySelectorAll(".modal .cancel, .modal .confirm")
    .forEach((button) => {
      button.addEventListener("click", function () {
        this.closest(".modal").style.display = "none";
      });
    });

  window.onclick = function (event) {
    if (event.target.className === "modal") {
      event.target.style.display = "none";
    }
  };
});

function updatePostDetails(post) {
  document.querySelector(".post-title").textContent = post.title;
  document.querySelector(
    ".post-profile-picture"
  ).src = `../images/${post.author.profileImage}`;
  document.querySelector(".author-name").textContent = post.author.nickname;
  document.querySelector(".post-date").textContent = post.date;
  document.querySelector(".post-text").innerHTML = post.content;
  document.querySelector(
    ".view-count-btn"
  ).innerHTML = `${post.views}<br>조회수`;
  document.querySelector(
    ".comment-count-btn"
  ).innerHTML = `${post.commentsCount}<br>댓글수`;
  document.querySelector(
    ".img-box"
  ).style.backgroundImage = `url('../images/${post.postImage}')`;
  document.querySelector(".img-box").style.backgroundSize = "cover";
  document.querySelector(".img-box").style.backgroundPosition = "center";
}

function updateComments(comments) {
  const commentsContainer = document.querySelector(".comment");
  let commentsHtml = "";
  comments.forEach((comment) => {
    commentsHtml += `
        <div class="comment-container">
          <img src="../images/${comment.profileImage}" alt="댓글 작성자 프로필 사진" class="comment-profile-picture">
          <div class="comment-content">
            <div class="comment-top-row">
              <span class="comment-author-name">${comment.nickname}</span>
              <span class="comment-date">${comment.date}</span>
              <div class="comment-btn-container">
                <button class="edit-comment-btn">수정</button>
                <button class="delete-comment-btn">삭제</button>
              </div>
            </div>
            <div class="comment-text-container">
              <p class="comment-text">${comment.content}</p>
            </div>
          </div>
        </div>
      `;
  });
  commentsContainer.innerHTML = commentsHtml;
}
