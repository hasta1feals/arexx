
function getHomepage() {
    api("/", "GET").then((res) => {
      if (res.message === "success") {
       
  
    console.log("success");
      }
    });
  }




//you can add all the buttons you want to connect to the api or button functions
document.addEventListener("DOMContentLoaded", function () {
    connectButton("myButton", getHomepage);
  });











  function connectButton(id, event) {
    let element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", event);
    }
  }
  



//api function to get infro from the server to frontend
function api(endpoint, method = "GET", data = {}) {
    const API = "https://arexx-a9d58d6027d0.herokuapp.com";
    return fetch(API + endpoint, {
      method: method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("token"),
      },
      body: method == "GET" ? null : JSON.stringify(data),
    }).then((res) => res.json());
  }
  

  // Cookie functions stolen from w3schools (https://www.w3schools.com/js/js_cookies.asp)
  function setCookie(cname, cvalue, exdays = 1) {
    let d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000); // Expiration time in milliseconds
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"; // Set the cookie
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function connectButton(id, event) {
    let element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", event);
    }
  }
  
  function getValue(id) {
    let element = document.getElementById(id);
    if (element) {
      return element.value;
    }
    return "";
  }
  
  function showPage(id) {
    let pages = document.getElementsByClassName("container");
    for (let i = 0; i < pages.length; i++) {
      pages[i].style.display = "none";
    }
    document.getElementById(id).style.display = "block";
  }
  
  function deleteCookie(cookieName) {
    document.cookie =
      cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  const logoutLink = document.getElementById("logoutLink");
  logoutLink.addEventListener("click", function (event) {
    event.preventDefault();
  
    x = getCookie("token");
    console.log(x);
    deleteCookie("token");
    console.log("Token cookie deleted " + x);
    window.location.href = "login.html";
  });