

function showMainContent() {
  const mainContent = document.querySelector('.container');
  mainContent.style.display = 'block';

  // If you want to show the chart, call your existing showChart function
  showChart();
}

document.addEventListener("DOMContentLoaded", function () {
  // Load the HTML content into the "nav-placeholder" element
  $("#nav-placeholder").load("navbar.html");

  // Get the modal and the button that opens the modal
  var modal = document.getElementById("addProductModal");
  var btn = document.getElementById("myBtn3");
  var span5 = document.getElementsByClassName("close5")[0];

  btn.onclick = function () {
    modal.style.display = "block";
  };

  span5.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  
 

});

document.addEventListener("DOMContentLoaded", function () {
  // Load the HTML content into the "nav-placeholder" element
  $("#nav-placeholder").load("navbar.html");

  // Fetch unique combinations of ID and Type
  api("/getUniqueIDsFromDatabase", "GET")
    .then((res) => {
      res.forEach((entry) => {
        const id = entry.Id; // get the ID from the response object
        // Fetch unique types for the current ID
        api(`/getUniqueTypesForIDFromDatabase?id=${id}`, "GET")
          .then((typesRes) => {
            typesRes.forEach((typeEntry) => {
              const type = typeEntry.Type; // get all types for the current ID from the response object

              // Create a container and chart for the current ID and Type
              const label = `${id} - ${type}`; // Create label with ID and Type
              createClickableLabel(id, type, label); // Create clickable label with ID and Type
            });

            // After dynamically adding clickable items, add event listeners to them
            addClickListenersToItems();
          })
          .catch((error) => {
            console.error("Error fetching types:", error);
          });
      });
    })
    .catch((error) => {
      console.error("Error fetching IDs:", error);
    });

  // Function to add event listeners to clickable items
  function addClickListenersToItems() {
    var clickableItems = document.querySelectorAll('.clickable-item');
    clickableItems.forEach(function (item) {
      item.addEventListener('click', function () {
        // Toggle clicked class to change background color
        this.classList.toggle('clicked');
      });
    });
  }
});


function createClickableLabel(id, type, label) {
  // Create a new clickable label element
  const clickableLabel = document.createElement("div");
  clickableLabel.classList.add("clickable-item");
  clickableLabel.textContent = label; // Set label text
  clickableLabel.dataset.id = id; // Set data-id attribute to ID
  clickableLabel.dataset.type = type; // Set data-type attribute to Type

  // Append the label to the form group
  const formGroup = document.querySelector(".form-group");
  if (formGroup) {
    formGroup.appendChild(clickableLabel);
  } else {
    console.error("Form group not found.");
  }
}



document.addEventListener("DOMContentLoaded", function () {
  // Fetch unique combinations of ID and Type
  api("/getUniqueIDsFromDatabase", "GET")
    .then((res) => {
      res.forEach((entry) => {
        const id = entry.Id; // get the ID from the response object
        // Fetch unique types for the current ID
        api(`/getUniqueTypesForIDFromDatabase?id=${id}`, "GET")
          .then((typesRes) => {
            typesRes.forEach((typeEntry) => {
              const type = typeEntry.Type;// get all types for the current ID from the response object
             
              // Fetch data for the current ID and Type
              api(`/getDataFromDatabase?id=${id}&type=${type}`, "GET")
                .then((dataRes) => {
                  // Create a container and chart for the current ID and Type
                  createContainerAndChart(id, type, dataRes);
                })
                .catch((error) => {
                  console.error("Error fetching data:", error);
                });
            });
          })
          .catch((error) => {
            console.error("Error fetching types:", error);
          });
      });
    })
    .catch((error) => {
      console.error("Error fetching IDs:", error);
    });
});

function createContainerAndChart(id, type, data) {
  // Create a container for the chart
  const container = document.createElement('div');
  container.classList.add('card');

  // Create card content
  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  // Create card title
  const cardTitle = document.createElement('div');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = `${id} ${type}`;

  // Create graph placeholder
  const graphPlaceholder = document.createElement('div');
  graphPlaceholder.classList.add('graph-placeholder');

  // Create canvas for the chart
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', `chart-${id}-${type}`);
  canvas.setAttribute('class', 'dynamic-chart');
  canvas.setAttribute('width', '600');
  canvas.setAttribute('height', '300');

  // Append elements
  graphPlaceholder.appendChild(canvas);
  cardContent.appendChild(cardTitle);
  cardContent.appendChild(graphPlaceholder);
  container.appendChild(cardContent);

  // Append container to charts-container
  document.getElementById('cont').appendChild(container);

  // Prepare labels and values for the chart
  const labels = data.map((entry) => entry.TimeStamp);
  const values = data.map((entry) => entry.Value);

  // Create a new chart instance
  new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${id} ${type}`,
        data: values,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            min: Math.min(...values), // Set the minimum value for the y-axis
            // Set the steps for the y-axis
            stepSize: 0.20, // Set the step size to 0.20
            max: Math.max(...values) // Set the maximum value for the y-axis
          }
        }
      }
    }
  });
}

// Inside main.js


// Function to filter dynamically created containers/cards based on search input
function searchContainers() {
  // Declare variables
  var input, filter, containers, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  containers = document.querySelectorAll('.card');

  // Loop through all containers/cards, and hide those that don't match the search query
  containers.forEach(function(container) {
    cardTitle = container.querySelector('.card-title');
    txtValue = cardTitle.textContent || cardTitle.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      container.style.display = "";
    } else {
      container.style.display = "none";
    }
  });
}


// Check if the element exists before adding the event listener
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("input", searchContainers);
}

let currentTablePage = 1;
let originalRows = []; 

function itemsLoad() {
  api("/getAllitems", "GET")
    .then((res) => {
  
      const tableBody = document.querySelector("#myTable tbody");
      tableBody.innerHTML = "";

      // Loop through the items and add them to the table
      // Store the original rows for filtering
      originalRows = res.rows;

      // Example: Populate the table with data
      res.rows.forEach((row) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td>${row.Id}</td>
          <td>${row.Value}</td>
          <td>${row.Type}</td>
          <td>${row.TimeStamp}</td>
          <td><button class="btn-get-id" data-id="${row.Id}">Graph</button></td>
          <!-- Add more table cells as needed -->
        `;
        tableBody.appendChild(newRow);
      });

      // Add event listener to all buttons in the table body
      tableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-get-id')) {
          const id = event.target.dataset.id; // Get the ID from the button's data attribute
          console.log('Clicked button for ID:', id);
          // Call a function or perform any action with the ID
        }
      });

    })
    .catch((error) => {
      console.error("Error fetching items:", error);
    });
}

 
  function searchTable() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those that don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    for (var j = 0; j < td.length; j++) {
      if (td[j]) {
        txtValue = td[j].textContent || td[j].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break; // Break the inner loop if a match is found
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}


document.addEventListener("DOMContentLoaded", function () {
 

          itemsLoad(currentTablePage);
          showMainContent();
          getRH();
});
    
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
