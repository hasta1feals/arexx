function showMainContent() {
  const mainContent = document.querySelector('.container');
  mainContent.style.display = 'block';

  // If you want to show the chart, call your existing showChart function
  showChart();
}

function hideMainContent() {
  const mainContent = document.querySelector('.container ');
  mainContent.style.display = 'none';
}

function getHomepage() {
  api("/", "GET").then((res) => {
    console.log("API Response:", res); // Log the actual response

    if (res.message === "success") {
      console.log("success");
    }
  });
}

// Function to fetch RH data from the API
function getRH() {
  api("/getRH", "GET").then((res) => {
    console.log("API Response:", res); // Log the actual response
    const labels = res.map(data => data.TimeStamp);
    const values = res.map(data => data.Value);
    updateChart(labels, values);
  });
}

// Function to update the chart with new data
function updateChart(labels, values) {
  myChart.data.labels = labels;
  myChart.data.datasets[0].data = values;
  myChart.update();
}

// Call the getRH function initially to fetch RH data and update the chart
getRH();

// Call the getRH function every 1 minute to fetch new RH data and update the chart
setInterval(getRH, 60000); // 60000 milliseconds = 1 minute


// Initialize empty data arrays
let labels = [];
let data = [];


// Get the canvas elements
const ctx = document.getElementById('myChart').getContext('2d');

// Check if there's already a chart associated with the canvas


// Create the chart with initial empty data
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'RH',
            data: [],
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                  // Set the steps for the y-axis
                  stepSize: 2, // Adjust this value according to your data
                  max: 30 // Set the maximum value for the y-axis
              }
            }
        }
    }
});


// Function to update the chart with new data
function updateChart(labels, newData) {
  // Update the chart data
  myChart.data.labels = labels;
  myChart.data.datasets[0].data = newData;

  // Update the chart
  myChart.update();
}

// Example usage: Call this function whenever you want to update the chart with new data
updateChart([]);


// Function to trigger file upload
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

    // Use "POST" as the method for file upload
    apiDiffType("upload", "POST", formData).then((res) => {
      console.log("API Response:", res); // Log the actual response
    });
  });
});

// You can add all the buttons you want to connect to the API or button functions
document.addEventListener("DOMContentLoaded", function () {
  connectButton("myButton", getHomepage);
});

function connectButton(id, event) {
  let element = document.getElementById(id);
  if (element) {
    element.addEventListener("click", event);
  }
}

// API function to get info from the server to frontend
function api(endpoint, method = "GET", data = {}) {
  const API = "http://127.0.0.1:3000";

  const requestOptions = {
    method: method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getCookie("token"),
    },
  };

  if (method !== "GET") {
    requestOptions.body = JSON.stringify(data);
  }

  return fetch(API + endpoint, requestOptions).then((res) => res.json());
}

function apiDiffType(endpoint, method = "GET", data = {}) {
  const API = "http://127.0.0.1:3000";
  const headers = {
    Authorization: "Bearer " + getCookie("token"),
  };

  // Properly concatenate the URL with a "/" between API and endpoint
  const url = `${API}/${endpoint}`;

  return fetch(url, {
    method: method,
    mode: "cors",
    headers: headers,
    body: method === "GET" ? null : data, // Don't stringify data for POST requests
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
