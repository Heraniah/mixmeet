document
  .querySelector(".current-user-nav-btn")
  .addEventListener("click", () => {
    let userModal = document.querySelector(".user-modal");
    userModal.classList.toggle("hide");
  });
document.querySelector(".new-post").addEventListener("click", () => {
  let form = document.querySelector(".new-post-form");
  if (form.classList.contains("hide")) {
    // change text in btn
    document.querySelector(".new-post").textContent = "close";
  } else {
    document.querySelector(".new-post").textContent = "+ new post";
  }
  form.classList.toggle("hide");
});
