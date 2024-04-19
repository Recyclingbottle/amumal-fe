document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);

  const title = urlParams.get("title");
  const content = urlParams.get("content");
  const image = urlParams.get("image");

  document.getElementById("post-title").value = title || "";
  document.getElementById("post-content").value = content || "";

  if (image) {
    document.getElementById("post-image-label").textContent = image;
  }
  postTitleInput.addEventListener("input", function () {
    if (postTitleInput.value.length > 26) {
      postTitleInput.value = postTitleInput.value.substring(0, 26);
    }
  });
});

function submitPost() {
  alert("수정 완료");
  window.location.href = "./posts.html";
}
