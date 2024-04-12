document.addEventListener("DOMContentLoaded", function () {
  // Load the HTML content into the "nav-placeholder" element
  $("#nav-placeholder").load("navbar.html");

  // Add event listener to the modal's content after it's loaded
  $(document).on('click', '#combine-graph', function () {
    // Remove any existing click event handlers on clickable items
    $('.modal-content .clickable-item').off('click');

    // Add event listener to the document body for delegation
    $('body').on('click', '.modal-content .clickable-item', function () {
      // Toggle clicked class to change background color
      $(this).toggleClass('clicked');

      // Log data and name
      const dataId = $(this).data('id');
      const dataType = $(this).data('type');
      const itemName = $(this).text();
      console.log(`Clicked item: ${itemName}, Data ID: ${dataId}, Data Type: ${dataType}`);
    });
  });
});




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

document.addEventListener('DOMContentLoaded', function() {
  const tableBody = document.querySelector('#myTable tbody');
  
  // Add event listener to all buttons in the table body
  tableBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-get-id')) {
      const id = event.target.dataset.id; // Get the ID from the button's data attribute
      const type = event.target.dataset.type; // Get the Type from the button's data attribute
      console.log('Clicked button for ID:', id);
      console.log('Type:', type);
      
      // Store ID and Type in sessionStorage
      sessionStorage.setItem('selectedId', id);
      sessionStorage.setItem('selectedType', type);

      // Navigate to the other page
      window.location.href = 'homepage.html'; // Replace 'otherpage.html' with the path to your other page
      
      // Prevent default behavior of button click (optional)
      event.preventDefault();
    }
  });

  // Check if the container element exists on the other page
  const containerOnOtherPage = document.querySelector('.container1');
  if (containerOnOtherPage) {
    // Call createContainerAndChart function if the container exists
    const id = sessionStorage.getItem('selectedId');
    const type = sessionStorage.getItem('selectedType');
    if (id && type) {
      generateChart(id, type);
    }
  }
});


// Function to generate a chart based on the provided ID and Type
function generateChart(id, type) {
  // Fetch data corresponding to the ID and Type from your database or wherever it's stored
  // Example API call
  api(`/getDataFromDatabase?id=${id}&type=${type}`, 'GET')
    .then(data => {
      // Process the data and generate the chart
      createContainerAndChart(id, type, data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// Retrieve selectedId and selectedType from sessionStorage
const id = sessionStorage.getItem('selectedId');
const type = sessionStorage.getItem('selectedType');

// Check if selectedId and selectedType are present
if (id && type) {
  // Call the generateChart function with the retrieved ID and Type
  generateChart(id, type);
} else {
  console.error('No selected ID or type found in sessionStorage.');
}






document.addEventListener('DOMContentLoaded', function() {
  // Check if the event listener is already added
  if (!sessionStorage.getItem('eventListenerAdded')) {
    // Add event listener to the table body
    const tableBody = document.querySelector('#myTable tbody');
    tableBody.addEventListener('click', handleClick);
    
    // Set a flag in sessionStorage to indicate that the event listener is added
    sessionStorage.setItem('eventListenerAdded', true);
  }

  // Retrieve selectedId and selectedType from sessionStorage
  const id = sessionStorage.getItem('selectedId');
  const type = sessionStorage.getItem('selectedType');

  // Check if selectedId and selectedType are present
  if (id && type && !sessionStorage.getItem('chartGenerated')) {
    // Call the generateChart function with the retrieved ID and Type
    generateChart(id, type);
    
    // Set a flag in sessionStorage to indicate that the chart is generated
    sessionStorage.setItem('chartGenerated', true);
  } else {
    console.error('No selected ID or type found in sessionStorage.');
  }
});

function handleClick(event) {
  if (event.target.classList.contains('btn-get-id')) {
    const id = event.target.dataset.id; // Get the ID from the button's data attribute
    const type = event.target.dataset.type; // Get the Type from the button's data attribute
    console.log('Clicked button for ID:', id);
    console.log('Type:', type);
    // Call the generateChart function with the ID and Type
    generateChart(id, type);
  }
}



// document.addEventListener("DOMContentLoaded", function () {
//   // Fetch unique combinations of ID and Type
//   api("/getUniqueIDsFromDatabase", "GET")
//     .then((res) => {
//       res.forEach((entry) => {
//         const id = entry.Id; // get the ID from the response object
//         // Fetch unique types for the current ID
//         api(`/getUniqueTypesForIDFromDatabase?id=${id}`, "GET")
//           .then((typesRes) => {
//             typesRes.forEach((typeEntry) => {
//               const type = typeEntry.Type;// get all types for the current ID from the response object
             
//               // Fetch data for the current ID and Type
//               api(`/getDataFromDatabase?id=${id}&type=${type}`, "GET")
//                 .then((dataRes) => {
//                   // Create a container and chart for the current ID and Type
//                   createContainerAndChart(id, type, dataRes);
//                 })
//                 .catch((error) => {
//                   console.error("Error fetching data:", error);
//                 });
//             });
//           })
//           .catch((error) => {
//             console.error("Error fetching types:", error);
//           });
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching IDs:", error);
//     });
// });

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

let newDataReceived = localStorage.getItem('newDataReceived') === 'true' ? true : false;

function itemsLoad() {
  api("/getAllitems", "GET")
    .then((res) => {

      const tableBody = document.querySelector("#myTable tbody");
      tableBody.innerHTML = "";

      // Check if new data is received
      const hasNewData = res.rows && res.rows.length > 0;

      // Loop through the items and add them to the table
      res.rows.forEach((row) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td>${row.Id}</td>
          <td>${row.Value}</td>
          <td>${row.Type}</td>
          <td>${row.TimeStamp}</td>
          <td><button class="btn-get-id" data-id="${row.Id}" data-type="${row.Type}">Graph</button>
          </td>
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

      // Update newDataReceived flag based on whether new data is received
      newDataReceived = hasNewData;
      localStorage.setItem('newDataReceived', newDataReceived.toString()); // Persist the flag in localStorage

      // Reset the newDataReceived flag after 10 seconds (adjust the time as needed)
      setTimeout(() => {
        newDataReceived = false;
        localStorage.setItem('newDataReceived', 'false'); // Update localStorage
      }, 10000); // 10 seconds in milliseconds

    })
    .catch((error) => {
      console.error("Error fetching items:", error);
      // In case of an error, set newDataReceived to false
      newDataReceived = false;
      localStorage.setItem('newDataReceived', 'false');
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
