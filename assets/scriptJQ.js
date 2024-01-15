// API Endpoint
const api_url = "https://652d78fdf9afa8ef4b277e2f.mockapi.io/Tasks";

// Global Variables
const date = new Date();
const options = { month: "long", day: "numeric", year: "numeric" };
const audio = new Audio("assets/audio/ping.mp3");

// Logo Animation
anime({
  targets: ".loading",
  direction: "alternate",
  loop: false,
  duration: 1000,
  easing: "easeInOutCirc",
  update: function (animation) {
    $(".percentage").html = Math.round(animation.progress) + "%";
  },
});

// Timeout Funkcija
setTimeout(() => {
  $(".loading")[0].css("display", "none");
}, 1000);

// Dark Mode
if (localStorage.getItem("preferDark") == "1") {
  enableDarkMode();
}

function enableDarkMode() {
  document.body.classList.toggle("dark");
  const darkMode = $("#dark-mode");
  $(".loading").css("backgroundColor", "#121212");
  $(".percentage").css("color", "#FFF");
  $(darkMode).html === "Enable Dark Mode"
    ? ($(darkMode).html = "Disable Dark Mode")
    : ($(darkMode).html = "Enable Dark Mode");
}

$("#dark-mode").on("click", function () {
  enableDarkMode();
  localStorage.getItem("preferDark") == "1"
    ? localStorage.setItem("preferDark", "0")
    : localStorage.setItem("preferDark", "1");
});

// Set Date
$("#date").html = date.toLocaleDateString("en-US", options);
$("#due-date").valueAsDate = date;
$("#year").text = date.getFullYear();

// Top Bar - Cookie Notice
const topbar = $("#top-bar-hide");
topbar.on("click", function () {
  $(".top-bar").css("display", "none");
  setCookie("todo-cookie-notice", "closed", 7);
});

// Function that sets cookies
function setCookie(name, value, days) {
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// Function that reads cookies
function getCookie(name) {
  const match = document.cookie.match(new RegExp(name + "=([^;]+)"));
  return match ? match[1] : null;
}

// If statement that is called when pages is loaded
if (getCookie("todo-cookie-notice") == "closed") {
  $(".top-bar").css("display", "none");
}

// Modal
const modal = $("#modal");
const changeNameButton = $(".change-name");
const closeButton = $(".close-modal");

function showModal() {
  modal.css("display", "block");
}

function hideModal() {
  modal.css("display", "none");
}

changeNameButton.on("click", showModal);
closeButton.on("click", hideModal);

window.on("click", function (event) {
  if (event.target === modal) {
    hideModal();
  }
});

function setUser() {
  localStorage.setItem("user", $("#name").value);
  hideModal();
  window.location.reload();
}

(function showUser() {
  const user = localStorage.getItem("user");
  $("#user").text = `${!user ? "Hey there stranger" : user}`;
})();

// Greeting
(function () {
  const hour = date.getHours();
  const icon = $("#icon");
  let text;

  if (hour < 12) {
    $(icon).text = "routine";
    text = "Good Morning";
  } else if (hour < 18) {
    $(icon).text = "clear_day";
    text = "Good Afternoon";
  } else {
    $(icon).text = "dark_mode";
    text = "Good Evening";
  }

  $("#greeting").html = text;
})();

function createTaskListItem(task) {
  const li = document.createElement("li");
  const list = $("#list");
  const formattedDate = new Date(task.due);

  li.innerHTML = `
  <span class="task">${task.task}</span>
  <span class="date">Added ${
    task.date
  } — Due ${formattedDate.toLocaleDateString("en-US", options)}</span>
  <span class="category ${task.category.toLowerCase().split(" ").join("-")}">${
    task.category
  }</span>
  <span class="close material-symbols-outlined">delete</span>
  `;

  li.dataset.id = task.id;
  li.dataset.due = task.due;
  li.dataset.completed = task.completed;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#description
  formattedDate < date &&
    task.completed !== "true" &&
    li.classList.add("overdue");

  task.completed === "true" && li.classList.add("checked");
  list.appendChild(li);
  checkEmpty();
}
