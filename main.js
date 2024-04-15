// Inside main.js
// Wait for the DOM content to be fully loaded
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

// Function to create a clickable label
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

// Add event listener to the form group for event delegation
const formGroup = document.querySelector(".form-group");
if (formGroup) {
  formGroup.addEventListener("click", function(event) {
    // Check if the clicked element is a clickable item
    if (event.target.classList.contains("clickable-item")) {
      // Retrieve data attributes from the clicked label
      const id = event.target.dataset.id;
      const type = event.target.dataset.type;
      // Perform actions based on the clicked label
      console.log(`Clicked item: ${id} - ${type}`);
    }
  });
} else {
  console.error("Form group not found.");
}




document.addEventListener('DOMContentLoaded', function() {
  // Retrieve stored data from local storage
  const storedData = JSON.parse(localStorage.getItem('storedData'));

  // Check if storedData is present
  if (storedData && storedData.length > 0) {
    // Loop through the stored data and generate charts for each ID and type
    storedData.forEach(({ id, type }) => {
      generateChart(id, type);
    });
  } else {
    console.error('No stored data found in local storage.');
  }

// Retrieve combined graph data from local storage
const combinedDataKeys = Object.keys(localStorage).filter(key => key.startsWith('combinedData_'));
if (combinedDataKeys.length > 0) {
  combinedDataKeys.forEach(key => {
    const combinedData = JSON.parse(localStorage.getItem(key));
    if (combinedData) {
      // Generate combined graph using the retrieved data
      createCombinedChartFromLocalStorage(combinedData);
    } else {
      console.error(`No combined graph data found in local storage for key: ${key}`);
    }
  });
} else {
  console.error('No combined graph data found in local storage.');
}
});


const combinedDataKeysAndValues = Object.keys(localStorage)
  .filter(key => key.startsWith('combinedData_'))
  .map(key => ({ key: key, value: JSON.parse(localStorage.getItem(key)) }));

console.log(combinedDataKeysAndValues);

console.log('Contents of localStorage:', localStorage);

function createContainerAndChart(id, type, data) {
  // Create a container for the chart
  const container = document.createElement('div');
  container.classList.add('card');
  container.classList.add('drag'); // Add 'drag' class to make it draggable

  // Create card content
  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  // Create card title
  const cardTitle = document.createElement('div');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = `${id} ${type}`;

  // Create remove button with "x" icon
  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-button');
  removeButton.innerHTML = '<i class="fas fa-times"></i>'; // Font Awesome times icon
  removeButton.addEventListener('click', function() {
    // Remove container from the DOM
    container.remove();

    // Remove position and size data from local storage
    localStorage.removeItem(`${id}-${type}-position`);
    localStorage.removeItem(`${id}-${type}-size`);

    // Remove the item from storedData if it exists
    const storedData = JSON.parse(localStorage.getItem('storedData')) || [];
    const indexToRemove = storedData.findIndex(item => item.id === id && item.type === type);
    if (indexToRemove !== -1) {
      storedData.splice(indexToRemove, 1);
      localStorage.setItem('storedData', JSON.stringify(storedData));
    }
  });

  // Append elements
  cardContent.appendChild(cardTitle);
  cardContent.appendChild(removeButton); // Add the remove button to the card content
  container.appendChild(cardContent);

  // Append container to charts-container
  document.getElementById('cont').appendChild(container);

  // Prepare labels and values for the chart
  const labels = data.map((entry) => entry.TimeStamp);
  const values = data.map((entry) => entry.Value);

  // Create graph placeholder
  const graphPlaceholder = document.createElement('div');
  graphPlaceholder.classList.add('graph-placeholder');

  // Create canvas for the chart
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', `chart-${id}-${type}`);
  canvas.setAttribute('class', 'dynamic-chart');
  canvas.setAttribute('width', '600');
  canvas.setAttribute('height', '300');

  // Append graph placeholder and canvas
  graphPlaceholder.appendChild(canvas);
  cardContent.appendChild(graphPlaceholder);

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
            min: Math.min(...values),
            stepSize: 0.20,
            max: Math.max(...values)
          }
        }
      }
    }
  });

  // Make the container draggable
  $(container).draggable({
    containment: "parent",
    stop: function(event, ui) {
      // Store the position in local storage when dragging stops
      const position = ui.position;
      localStorage.setItem(`${id}-${type}-position`, JSON.stringify(position));
    }
  });

  // Retrieve the position from local storage if available
  const storedPosition = localStorage.getItem(`${id}-${type}-position`);
  if (storedPosition) {
    const position = JSON.parse(storedPosition);
    container.style.left = position.left + 'px';
    container.style.top = position.top + 'px';
  }
}


function createCombinedChartFromLocalStorage() {
  const combinedDataKeys = Object.keys(localStorage).filter(key => key.startsWith('combinedData_'));

  if (combinedDataKeys.length > 0) {
    combinedDataKeys.forEach(key => {
      // Check if container already exists in the DOM
      if (document.getElementById(`${key}-container`)) {
        console.log(`Container for key ${key} already exists. Skipping...`);
        return; // Skip iteration if container already exists
      }

      const combinedDataString = localStorage.getItem(key);
      console.log(`Key: ${key}, Value: ${combinedDataString}`);
      
      // Attempt to parse JSON data
      try {
        const combinedData = JSON.parse(combinedDataString);
        console.log(`Parsed data for key ${key}:`, combinedData);

        // Check if combinedData is an array and not empty
        if (Array.isArray(combinedData) && combinedData.length > 0) {
          // Extract labels and values for each dataset
          const labels = combinedData[0].labels;

          // Create an array of datasets
          const datasets = combinedData.map((data, index) => ({
            label: `Data for ID ${index + 1}`,
            data: data.values,
            borderColor: index === 0 ? 'green' : 'blue',
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            borderWidth: 1
          }));

          // Create a container for the chart
          const container = document.createElement('div');
          container.classList.add('card');
          container.classList.add('dynamic-chart-container');
          container.setAttribute('id', `${key}-container`);
          container.classList.add('drag'); // Add the 'drag' class to make it draggable

          // Create card content
          const cardContent = document.createElement('div');
          cardContent.classList.add('card-content');

          // Create card title
          const cardTitle = document.createElement('div');
          cardTitle.classList.add('card-title');
          cardTitle.textContent = `Combined Chart - ${key}`;

          // Create remove button with "x" icon
          const removeButton = document.createElement('button');
          removeButton.classList.add('remove-button');
          removeButton.innerHTML = '<i class="fas fa-times"></i>'; // Font Awesome times icon
          removeButton.addEventListener('click', function() {
            // Remove container from the DOM
            container.remove();

            // Remove data from local storage
            localStorage.removeItem(key);
          });

          // Create graph placeholder
          const graphPlaceholder = document.createElement('div');
          graphPlaceholder.classList.add('graph-placeholder');

          // Create canvas for the chart
          const canvas = document.createElement('canvas');
          canvas.setAttribute('id', `${key}-chart`);
          canvas.setAttribute('class', 'dynamic-chart');
          canvas.setAttribute('width', '600');
          canvas.setAttribute('height', '300');

          // Append elements
          graphPlaceholder.appendChild(canvas);
          cardContent.appendChild(cardTitle);
          cardContent.appendChild(removeButton); // Add the remove button to the card content
          cardContent.appendChild(graphPlaceholder);
          container.appendChild(cardContent);

          // Append container to the appropriate container in the DOM
          const combinedChartContainer = document.getElementById('cont');
          if (combinedChartContainer) {
            combinedChartContainer.appendChild(container);

            // Create the combined chart using Chart.js
            new Chart(canvas, {
              type: 'line',
              data: {
                labels: labels,
                datasets: datasets
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: false,
                    // Set other scale options as needed
                  }
                }
              }
            });
          } else {
            console.error("Container for chart not found.");
          }
        } else {
          console.error(`Invalid combined graph data for key: ${key}`);
        }
      } catch (error) {
        console.error(`Error parsing data for key ${key}:`, error);
      }
    });
  } else {
    console.error("No combined graph data found in local storage.");
  }
}

$(document).ready(function() {
  // Initialize draggability for elements with the 'drag' class
  $(".drag").draggable();
});




$(document).ready(function() {
  // Initialize draggability for elements with the 'drag' class
  $(".drag").each(function() {
    $(this).draggable({
      // When dragging stops, save the position in local storage
      stop: function(event, ui) {
        localStorage.setItem($(this).attr('id') + '-position', JSON.stringify(ui.position));
      }
    });
    
    // Retrieve and apply the saved position
    var savedPosition = localStorage.getItem($(this).attr('id') + '-position');
    if (savedPosition) {
      $(this).css({
        left: JSON.parse(savedPosition).left + 'px',
        top: JSON.parse(savedPosition).top + 'px'
      });
    }
  });
});



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
  
  console.log('Selected ID from sessionStorage:', id);
  console.log('Selected Type from sessionStorage:', type);

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

// Function to handle click events on buttons inside table rows
function handleClick(event) {
  if (event.target.classList.contains('btn-get-id')) {
    const id = event.target.dataset.id; // Get the ID from the button's data attribute
    const type = event.target.dataset.type; // Get the Type from the button's data attribute
    console.log('Clicked button for ID:', id, 'Type:', type);
    // Call the generateChart function with the ID and Type
    generateChart(id, type);
  }
}

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



// Inside main.js
// Function to filter dynamically created containers/cards based on search input
// Function to handle the search functionality
function searchContainers() {
  // Declare variables
  var input, filter, containers, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  containers = document.querySelectorAll('.card');

  // Loop through all containers/cards, and hide those that don't match the search query
  containers.forEach(function(container) {
    const cardTitle = container.querySelector('.card-title');
    txtValue = cardTitle.textContent || cardTitle.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      container.style.display = "";
    } else {
      container.style.display = "none";
    }
  });
}

// Add event listener to the parent element of the dynamically generated .card elements
document.addEventListener("input", function(event) {
  if (event.target && event.target.id === "searchInput") {
    searchContainers();
  }
});


let currentTablePage = 1;
let originalRows = []; 

let newDataReceived = localStorage.getItem('newDataReceived') === 'true' ? true : false;

function itemsLoad() {
  api("/getAllitems", "GET")
    .then((res) => {

      const tableBody = document.querySelector("#myTable tbody");


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
    const id = event.target.dataset.id;
    const type = event.target.dataset.type;
    console.log('Clicked button for ID:', id, type);
    
    // Retrieve existing data from local storage or initialize an empty array
    let storedData = JSON.parse(localStorage.getItem('storedData')) || [];

    // Add the new ID and type to the array
    storedData.push({ id, type });

    // Store the updated array back into local storage
    localStorage.setItem('storedData', JSON.stringify(storedData));

    // Navigate to homepage.html
    window.location.href = `homepage.html`;
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





let selectedItems = [];

if (formGroup) {
  formGroup.addEventListener("click", function(event) {
    // Check if the clicked element is a clickable item
    if (event.target.classList.contains("clickable-item")) {
      // Retrieve data attributes from the clicked label
      const id = event.target.dataset.id;
      const type = event.target.dataset.type;
      
      // Toggle selection
      const index = selectedItems.findIndex(item => item.id === id && item.type === type);
      if (index === -1) {
        // Add to selected items if not already selected
        selectedItems.push({ id, type });
      } else {
        // Remove from selected items if already selected
        selectedItems.splice(index, 1);
      }
      
      // Perform actions based on the clicked label
      console.log(`Selected items:`, selectedItems);
      
      // Generate combined graph based on selected items if at least two items are selected
      if (selectedItems.length >= 2) {
        generateCombinedGraph(selectedItems);
      } else {
        // If less than two items are selected, remove the existing combined chart
        removeCombinedChart();
      }
    }
  });
} else {
  console.error("Form group not found.");
}

// Function to remove the existing combined chart
function removeCombinedChart() {
 
}

// Append container to charts-container
const combinedChartContainer = document.getElementById('cont');
if (combinedChartContainer) {
  // Append the container for the combined chart
  combinedChartContainer.appendChild(container);

  // Create the chart using Chart.js
  createCombinedChart(canvas, combinedData);
} else {
  console.error("Container for chart not found.");
}


function generateCombinedGraph(selectedItems) {
  // Fetch data for selected items from the database or elsewhere
  const promises = selectedItems.map(item => {
    return api(`/getDataFromDatabase?id=${item.id}&type=${item.type}`, 'GET');
  });

  // Wait for all data fetch requests to complete
  Promise.all(promises)
    .then(datasets => {
      console.log('Datasets:', datasets); // Log datasets to check their structure

      // Extract labels and values for each dataset
      const combinedData = datasets.map(data => ({
        labels: data.map(entry => entry.TimeStamp),
        values: data.map(entry => entry.Value),
      }));

      // Save combined data to local storage with a unique key
      const currentTimestamp = Date.now(); // Generate a unique timestamp
      localStorage.setItem(`combinedData_${currentTimestamp}`, JSON.stringify(combinedData)); // Save combined graph data

      // Create a container for the combined chart
      const container = document.createElement('div');
      container.classList.add('card');

      // Create card content for the chart
      const cardContent = document.createElement('div');
      cardContent.classList.add('card-content');

      // Create card title
      const cardTitle = document.createElement('div');
      cardTitle.classList.add('card-title');
      cardTitle.textContent = `Combined Graph`;

      // Create remove button with "x" icon
      const removeButton = document.createElement('button');
      removeButton.classList.add('remove-button');
      removeButton.innerHTML = '<i class="fas fa-times"></i>'; // Font Awesome times icon
      removeButton.addEventListener('click', function() {
        // Remove container from the DOM
        container.remove();

        // Remove data from local storage
        localStorage.removeItem(`combinedData_${currentTimestamp}`);
      });

      // Create graph placeholder
      const graphPlaceholder = document.createElement('div');
      graphPlaceholder.classList.add('graph-placeholder');

      // Create canvas for the chart
      const canvas = document.createElement('canvas');
      canvas.setAttribute('id', `combined-chart-${currentTimestamp}`);
      canvas.setAttribute('class', 'dynamic-chart');
      canvas.setAttribute('width', '600');
      canvas.setAttribute('height', '300');

      // Append elements
      graphPlaceholder.appendChild(canvas);
      cardContent.appendChild(cardTitle);
      cardContent.appendChild(removeButton); // Add the remove button to the card content
      cardContent.appendChild(graphPlaceholder);
      container.appendChild(cardContent);

      // Append container to charts-container
      const combinedChartContainer = document.getElementById('cont');
      if (combinedChartContainer) {
        // Append the container for the combined chart
        combinedChartContainer.appendChild(container);

        // Create the chart using Chart.js
        createCombinedChart(canvas, combinedData);
      } else {
        console.error("Container for chart not found.");
      }
    })
    .catch(error => {
      console.error('Error fetching data for selected items:', error);
    });
}


// Function to create the combined chart using Chart.js
function createCombinedChart(canvas, combinedData) {
  new Chart(canvas, {
    type: 'line',
    data: {
      labels: combinedData[0].labels, // Using labels from the first dataset
      datasets: combinedData.map((data, index) => ({
        label: `Data for ID ${selectedItems[index].id}`, // Using ID as label
        data: data.values,
        borderColor: index === 0 ? 'green' : 'blue', // Different color for each line
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderWidth: 1
      }))
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          // Set the steps for the y-axis
          stepSize: 0.20, // Set the step size to 0.20
          // Set the minimum and maximum values for the y-axis
          min: Math.min(...combinedData.flatMap(data => data.values)),
          max: Math.max(...combinedData.flatMap(data => data.values))
        }
      }
    }
  });
}



