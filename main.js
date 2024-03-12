function getHomepage() {
    api("/", "GET").then((res) => {
      console.log("API Response:", res); // Log the actual response
  
      if (res.message === "success") {
        console.log("success");
      }
    });
  }
  
  const ctx = document.getElementById('myChart');


  function uploadDatabase() {
    // Trigger the click event of the hidden file input
    $("#databaseInput").click();
  }

  $(document).ready(function () {
    // Add a click event listener to the "Dashboard" link
    $("#uploadDatabaseBtn").click(uploadDatabase);

    // Add change event listener to the file input to handle file selection
    $("#databaseInput").change(function () {
      // Handle file upload logic here (e.g., send the file to the server)
      var selectedFile = $(this).prop("files")[0];
      console.log("Selected file:", selectedFile);

      // Create a FormData object to send the file
      var formData = new FormData();
      formData.append("file", selectedFile);

      api("upload", formData, "POST").then((res) => {
        console.log("API Response:", res); // Log the actual response
      }
      

      
    });
  });


  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });



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
