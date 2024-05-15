document.addEventListener('DOMContentLoaded', function() {
  // Retrieve position and display status from local storage
  const graphListPosition = JSON.parse(localStorage.getItem('graphListPosition'));
  const graphListDisplay = localStorage.getItem('graphListDisplay');

  // Set position and display status
  if (graphListPosition) {
      document.querySelector('.graph-list').style.top = graphListPosition.top;
      document.querySelector('.graph-list').style.left = graphListPosition.left;
  }
  if (graphListDisplay) {
      document.querySelector('.graph-list').style.display = graphListDisplay;
  }

  // // Make the graph list draggable
  $(".graph-list").draggable({
      stop: function(event, ui) {
          // Store position in local storage when dragging stops
          const position = {
              top: ui.position.top + 'px',
              left: ui.position.left + 'px'
          };
          localStorage.setItem('graphListPosition', JSON.stringify(position));
      }
  });

  // Minimize button event listener
  document.querySelector('.minimize-list-btn').addEventListener('click', function() {
      const graphList = document.querySelector('.graph-list');
      const currentDisplay = graphList.style.display;
      graphList.style.display = (currentDisplay === 'none') ? 'block' : 'none';

      // Store display status in local storage
      localStorage.setItem('graphListDisplay', graphList.style.display);
  });

  // Show/hide graph list when myBtn4 is clicked
  document.getElementById('myBtn4').addEventListener('click', function() {
      const graphList = document.querySelector('.graph-list');
      const currentDisplay = graphList.style.display;
      graphList.style.display = (currentDisplay === 'none') ? 'block' : 'none';

      // Store display status in local storage
      localStorage.setItem('graphListDisplay', graphList.style.display);
  });
});




document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired");

  // Load the HTML content into the "nav-placeholder" element
  $("#nav-placeholder").load("navbar.html");

  // Get the modals and their respective buttons
  var modal1 = document.getElementById("addProductModal");
  var btn1 = document.getElementById("myBtn3");
  var span5_1 = document.getElementsByClassName("close5")[0];
  var buttontab1 = document.getElementById("modaltab1");
  var buttontab10 = document.getElementById("modaltab10");
  var discardButton = document.getElementById("closemodal5");
  discardButton.addEventListener('click', function() {
    console.log('Hello');
  });
  var discardButton2 = document.getElementById("close-button3");

  var modal3 = document.getElementById("addProductModal3");
  var btn3 = document.getElementById("myBtn6");
  var span5_3 = document.getElementsByClassName("close5")[1];
  var span5_4 = document.getElementsByClassName("close5")[2];


var modal209 = document.getElementById("addProductModal6"); 
var btn6 = document.getElementById("changecolorASAH");

var bt7 = document.getElementById("discardcolor")

 
  span5_3.onclick = function() {
   closeModal(modal3);
};

span5_4.onclick = function() {
  closeModal(modal209);
};

discardButton.onclick = function() {
  
  closeModal(modal1);
};

bt7.onclick = function() {
  
  closeModal(modal209);
};
discardButton2.onclick = function() {

  closeModal(modal3);
};

btn6.onclick = function() {

  closeModal(modal209);
};
  var buttontab2 = document.getElementById("modaltab2");
  var buttontab4 = document.getElementById("modaltab4");


  // Check if any modal element is null
  if (!modal1) {
    console.log("Modal 1 is null");
  }
  
  if (!modal3) {
    console.log("Modal 3 is null");
  }

  // Function to open the modal
  function openModal(modal) {
    console.log("Opening modal:", modal.id);
    modal.style.display = "block";
    // Store the modal state in localStorage
    localStorage.setItem(modal.id, "open");
  }

  // Function to close the modal
  function closeModal(modal) {
    console.log("Closing modal:", modal.id);
    modal.style.display = "none";
    // Remove the modal state from localStorage
    localStorage.removeItem(modal.id);
    localStorage.removeItem("activeTab");

  setTimeout(function() {
    location.reload();
  }, 100);
  }

  // Check if the modal was open before and open it again
  if (localStorage.getItem(modal1.id) === "open") {
    openModal(modal1);
  }



  if (localStorage.getItem(modal3.id) === "open") {
    openModal(modal3);
  }

  // Add event listeners to open and close the modals
  btn1.onclick = function () {
    openModal(modal1);
  };

  span5_1.onclick = function () {
    closeModal(modal1);
  };

  buttontab1.onclick = function () {
    // Store the active tab state in localStorage
    localStorage.setItem("activeTab", "tab1");
    // Update the active tab visually
    openTab({ currentTarget: buttontab1 }, "tab1");
  };

  buttontab10.onclick = function () {
    // Store the active tab state in localStorage
    localStorage.setItem("activeTab", "tab10");
    // Update the active tab visually
    openTab({ currentTarget: buttontab1 }, "tab10");
  };
  buttontab2.onclick = function () {
    // Store the active tab state in localStorage
    localStorage.setItem("activeTab", "tab2");
    // Update the active tab visually
    openTab({ currentTarget: buttontab1 }, "tab2");
  };

  buttontab4.onclick = function () {
    // Store the active tab state in localStorage
    localStorage.setItem("activeTab", "tab4");
    // Update the active tab visually
    openTab({ currentTarget: buttontab1 }, "tab4");
  };

  var activeTabName = localStorage.getItem("activeTab");
  if (activeTabName) {
    openTab({ currentTarget: document.querySelector("[data-tab='" + activeTabName + "']") }, activeTabName);
    console.log("Active tab:", activeTabName);
  }


  btn3.onclick = function () {
    openModal(modal3);
  };

  span5_3.onclick = function () {
    closeModal(modal3);
  };

  // Close the modals when the user clicks outside of them
  window.onclick = function (event) {
    if (event.target == modal1) {
      closeModal(modal1);
    }
   
    if (event.target == modal3) {
      closeModal(modal3);
    }
  };
});



// Function to open a specific tab
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  // Hide all tab content
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove("active");
  }

  // Deactivate all tab buttons
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Show the selected tab content
  document.getElementById(tabName).classList.add("active");

  // Activate the clicked tab button
  evt.currentTarget.classList.add("active");
}


try {
  // Define a variable to store the selected choice
  var selectedChoice = null;

  // Function to populate the dropdown and attach event listener
  function populateDropdown1() {
    api("/getUniqueIDsFromDatabase", "GET")
      .then(function(data) {
        var select = document.getElementById("dropdown1");
        
        // Iterate over the data and add options to the dropdown
        data.forEach(function(row) {
          var option = document.createElement("option");
          option.value = row.Id;
          option.textContent = row.Id;
          select.appendChild(option);
        });

        // Attach event listener to the dropdown
        select.addEventListener("change", function(event) {
          var selectedValue = event.target.value;
          selectedChoice = selectedValue; // Assign selected value to the variable
          console.log("Selected choice:", selectedChoice); // Log the selected value
        });
      })
      .catch(function(error) {
        console.error("Error fetching unique IDs:", error);
      });
  }

  // Define a global variable to hold the selected value
  var selectedValueDropdown2;

  function populateDropdown2(selectedId) {
    id = selectedId;
    // Make an API request to fetch unique types for the selected ID
    api(`/getUniqueTypesForIDFromDatabase?id=${id}`, "GET", {})
      .then(function(data) {
        var select = document.getElementById("dropdown2");

        // Clear previous options

        // Check if the response is an array
        if (Array.isArray(data)) {
          // Iterate over the data and add options to the dropdown
          data.forEach(function(row) {
            var option = document.createElement("option");
            option.value = row.Type;
            option.textContent = row.Type;
            select.appendChild(option);
          });
        } else {
          console.error("Response is not an array:", data);
        }

        // Attach event listener to the dropdown
        select.addEventListener("change", function(event) {
          // Update the selected value variable
          selectedValueDropdown2 = event.target.value;
          console.log("Selected choice in dropdown 2:", selectedValueDropdown2); // Log the selected value
        });
      })
      .catch(function(error) {
        console.error("Error fetching unique types:", error);
      });
  }

  // Array of options

  // Event listener for dropdown1 change event
  $('#dropdown1').on('change', function() {
    var selectedId = $(this).val(); // Get the selected ID from dropdown1
    populateDropdown2(selectedId); // Populate dropdown2 based on the selected ID
  });

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

  // Define the options array
  const options = ["", ">", "<", "="];

  // Define a global variable to store the selected value
  let selectedOption = "";

  // Function to populate options in the select element and store the selected value
  function populateOptions(selectId, options) {
    // Get the select element
    const select = document.getElementById(selectId);
    
    // Clear existing options
    select.innerHTML = "";

    // Create and append options
    options.forEach(option => {
      const optionElement = document.createElement("option");
      optionElement.value = option; // Set value
      optionElement.textContent = option; // Set text content
      select.appendChild(optionElement);
    });

    // Attach event listener to the select element
    select.addEventListener("change", function(event) {
      // Update the global variable with the selected value
      selectedOption = event.target.value;
      console.log("Selected option:", selectedOption); // Log the selected value
    });
  }

  // Populate the select element with options
  populateOptions("dropdown3", options);

  // Define a global variable to store the input value
  let inputValue = "";

  // Function to update the global variable with the input value
  function updateInputValue(event) {
    inputValue = event.target.value;
    console.log("Input value:", inputValue); // Log the input value
  }

  // Get the input box element
  const inputBox = document.getElementById("inputBox1");

  // Attach event listener to the input box for input event
  inputBox.addEventListener("input", updateInputValue);

  // Function to make a POST request to set alert parameters
  function setAlertParameters() {
    // Get values from global variables
    const id = selectedChoice;
    const threshold = inputValue;
    const comparisonOperator = selectedOption;
    const type = selectedValueDropdown2;

    // Check if all required parameters are available
    if (!id || !threshold || !comparisonOperator || !type) {
      console.error('Missing required parameters');
      return;
    }

    // Log the values before making the API call
    console.log('ID:', id);
    console.log('Threshold:', threshold);
    console.log('Comparison Operator:', comparisonOperator);
    console.log('Type:', type);

    // Prepare data for the POST request
    const data = {
      id: id,
      threshold: threshold,
      comparison_operator: comparisonOperator,
      type: type
    };

    // Make the POST request using the api function
    api('/setAlert', 'POST', data)
      .then(response => {
        console.log('Alert parameters set successfully:', response);
      })
      .catch(error => {
        console.error('Error setting alert parameters:', error);
      });
  }
var modal200 = document.getElementById('addProductModal3')
  // Call the function to set alert parameters when needed
  // For example, when a button is clicked
  document.getElementById('send-Alert').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default behavior


    function closeModal(modal) {
      console.log("Closing modal:", modal.id);
      modal.style.display = "none";
      // Remove the modal state from localStorage
      localStorage.removeItem(modal.id);
      localStorage.removeItem("activeTab");
    }

    closeModal(modal200);
    // Call the setAlertParameters function
    setAlertParameters();
  });
} catch (error) {
  console.error('An error occurred but was caught:', error);
  // Handle the error as needed, or simply log it
}






    
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


  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Check if the key starts with "combinedData_"
    if (key.startsWith("combinedData_")) {
        const rawData = localStorage.getItem(key);
        try {
            const data = JSON.parse(rawData);
            // Check if data is an array
            if (Array.isArray(data)) {
                // Loop through each object in the array
                data.forEach(entry => {
                    // Check if the "naam" property is an empty string
                    if (entry.naam === "") {
                        // Log the key and the associated IDs
                        // console.log(`Key: ${key}, First ID: ${entry.id[0]}`);
                    }
                });
            } else {
                
            }
        } catch (error) {
            console.error(`Error parsing data for key: ${key}`, error);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
  const minimizeBtn = document.querySelector('.minimize-list-btn');
  const graphList = document.querySelector('.graph-list');
  const showGraphListBtn = document.querySelector('#myBtn4');
  populateDropdown1();
  populateDropdown2();
  if (minimizeBtn && graphList && showGraphListBtn) {
    minimizeBtn.addEventListener('click', function() {
      graphList.style.display = 'none';
    });

    showGraphListBtn.addEventListener('click', function() {
      graphList.style.display = 'block';
    });
  }
});



// Retrieve data from local storag
// Retrieve data from local storage
const graphData = Object.entries(localStorage).filter(([key, value]) => key.startsWith("combinedData_"));

// Create HTML elements for each graph
const graphList = document.querySelector('.graph-list');
if (graphList) {
  graphData.forEach(([key, value]) => {
    // console.log(typeof value, value); // For debugging

    const graphName = key.replace('combinedData_', '');
    const graphElement = document.createElement('div');
    graphElement.classList.add('graph');

    // Parse the JSON string to an array
    let dataArray;
    try {
      dataArray = JSON.parse(value);
    } catch (error) {
      console.error(`Error parsing data for key ${key}:`, error);
      return; // Skip this entry
    }

    if (Array.isArray(dataArray)) {
      // Check if there is any entry with naam not empty
      const hasNonEmptyNaam = dataArray.some(entry => entry.naam !== "");

      const nameToShow = hasNonEmptyNaam ? dataArray.find(entry => entry.naam !== "").naam : graphName;
      graphElement.innerHTML = `<div class="graph-name">${nameToShow}</div>`;

      const idContainer = document.createElement('div');
      idContainer.classList.add('id-container');

      dataArray.forEach(entry => {
        const idElement = document.createElement('div');
        idElement.textContent = `ID: ${entry.id[0]}`;
        idContainer.appendChild(idElement);
      });

      idContainer.style.display = 'none';
      graphElement.appendChild(idContainer);

      // Toggle display of IDs when graph name is clicked
      graphElement.addEventListener('click', () => {
        idContainer.style.display = idContainer.style.display === 'none' ? 'block' : 'none';
      });

      graphList.appendChild(graphElement);
    } 
  });
} else {
  console.error('No element found with class name "graph-list"');
}



  


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

// console.log(combinedDataKeysAndValues);

// console.log('Contents of localStorage:', localStorage);

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



function hexToRGBA(hex, alpha) {
  // Convert hex color to RGB
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Return RGBA format
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function updateLocalStorage(key, value) {
  localStorage.setItem(key, value);
}




let openOptions;

function createCombinedChartFromLocalStorage() {
  const combinedDataKeys = Object.keys(localStorage).filter(key => key.startsWith('combinedData_'));

  if (combinedDataKeys.length > 0) {
    combinedDataKeys.forEach(key => {
      // Check if container already exists in the DOM
      if (document.getElementById(`${key}-container`)) {
        return; // Skip iteration if container already exists
      }

      const combinedDataString = localStorage.getItem(key);
      try {
        const combinedData = JSON.parse(combinedDataString);

        if (Array.isArray(combinedData) && combinedData.length > 0) {
          const labels = combinedData[0].labels;

          const datasets = combinedData.map((data, index) => {
            const colorFormId = `form-color-${key}-${index}`;
            let colorForm = document.getElementById(colorFormId);
            if (colorForm) {
              colorForm.parentNode.removeChild(colorForm);
            }
            colorForm = document.createElement('form');
            colorForm.setAttribute('id', colorFormId);

            // Create a label element to display the ID above the color picker
            const idLabel = document.createElement('label');
            idLabel.textContent = `ID: ${data.id[0]}`;
            colorForm.appendChild(idLabel);

            colorForm.innerHTML += `<input type="color" id="${colorFormId}" value="${data.color}">`;
            document.querySelector('#addProductModal6 .modal-body').appendChild(colorForm);

            const colorInput = colorForm.querySelector(`#${colorFormId}`);
            colorInput.addEventListener('change', (function (data) {
              return function (event) {
                data.borderColor = hexToRGBA(event.target.value, 0.1);
                data.color = event.target.value;
                data.backgroundColor = hexToRGBA(event.target.value, 0.1);
                updateLocalStorage(key, JSON.stringify(combinedData));
              };
            })(data));

            return {
              label: `Data for ID ${data.id[0]}`,
              data: data.values,
              borderColor: data.color,
              backgroundColor: hexToRGBA(data.color, 0.1),
              naam: data.naam,
              color: data.color
            };
          });

          const nam = datasets[0].naam;

          const container = document.createElement('div');
          container.classList.add('card');
          container.classList.add('dynamic-chart-container');
          container.setAttribute('id', `${key}-container`);
          container.classList.add('drag');

          const cardContent = document.createElement('div');
          cardContent.classList.add('card-content');

          const cardTitle = document.createElement('div');
          cardTitle.classList.add('card-title');

          if (nam === "") {
            cardTitle.textContent = `Combined Chart - ${key}`;
          } else {
            cardTitle.textContent = nam;
          }

          const removeButton = document.createElement('button');
          removeButton.classList.add('remove-button');
          removeButton.innerHTML = '<i class="fas fa-times"></i>';
          removeButton.addEventListener('click', function () {
            container.remove();
            localStorage.removeItem(key);
          });

          // Close modal logic
          function closeModal(modal) {
            console.log("Closing modal:", modal.id);
            modal.style.display = "none";
            // Remove the modal state from localStorage
            localStorage.removeItem(modal.id);
            localStorage.removeItem("activeTab");
          }

          // Open modal logic
          function openModal(modal) {
            console.log("Opening modal:", modal.id);
            modal.style.display = "block";
            // Store the modal state in localStorage
            localStorage.setItem(modal.id, "open");
          }

          const openOptions = document.createElement('button');
          openOptions.classList.add('open-options');
          openOptions.id = 'open-options';
          openOptions.innerHTML = '<i class="fas fa-cog"></i>';

          document.body.appendChild(openOptions);

          var modal6 = document.getElementById("addProductModal6");
          var tab45 = document.getElementById("idtab45");

          if (localStorage.getItem(modal6.id) === "open") {
            openModal(modal6);
          }

          var activeTabName = localStorage.getItem("activeTab");
          if (activeTabName) {
            openTab({ currentTarget: document.querySelector("[data-tab='" + activeTabName + "']") }, activeTabName);
          }

          tab45.onclick = function () {
            localStorage.setItem("activeTab", "tab45");
            openTab({ currentTarget: tab45 }, "tab45");
          };

          openOptions.addEventListener('click', function () {
            // Hide all color pickers first
            document.querySelectorAll('#addProductModal6 .modal-body form').forEach(form => form.style.display = 'none');

            // Show only the relevant color pickers for the current graph
            document.querySelectorAll(`#addProductModal6 .modal-body form[id^="form-color-${key}"]`).forEach(form => form.style.display = 'block');

            const canvas = container.querySelector('.dynamic-chart');
            const chartInstanceId = extractNumericPart(canvas.id);
            currentChartDataKey = 'combinedData_' + chartInstanceId;

            const chartDataString = localStorage.getItem(currentChartDataKey);
            openModal(modal6);
            if (chartDataString) {
              try {
                const chartData = JSON.parse(chartDataString);
              } catch (error) {
                console.error("Error parsing chart data:", error);
              }
            } else {
              console.error("Chart data not found in local storage for key:", currentChartDataKey);
            }
          });

          var closeButtons = document.getElementsByClassName("close5");
          for (var i = 0; i < closeButtons.length; i++) {
            closeButtons[i].addEventListener('click', function () {
              var modal6 = document.getElementById("addProductModal6");
              modal6.style.display = "none";
            });
          }

          window.onclick = function (event) {
            var modal6 = document.getElementById("addProductModal6");
            if (event.target == modal6) {
              modal6.style.display = "none";
            }
          };

          cardContent.appendChild(openOptions);

          const graphPlaceholder = document.createElement('div');
          graphPlaceholder.classList.add('graph-placeholder');

          const canvas = document.createElement('canvas');
          canvas.setAttribute('id', `${key}-chart`);
          canvas.setAttribute('class', 'dynamic-chart');
          canvas.setAttribute('width', '600');
          canvas.setAttribute('height', '300');

          graphPlaceholder.appendChild(canvas);
          cardContent.appendChild(cardTitle);
          cardContent.appendChild(removeButton);
          cardContent.appendChild(graphPlaceholder);
          container.appendChild(cardContent);

          const combinedChartContainer = document.getElementById('cont');
          if (combinedChartContainer) {
            combinedChartContainer.appendChild(container);

            new Chart(canvas, {
              type: 'line',
              data: {
                labels: labels,
                datasets: datasets
              },
              options: {
                plugins: {
                  zoom: {
                    zoom: {
                      wheel: {
                        enabled: true,
                      },
                      pinch: {
                        enabled: true
                      },
                      mode: 'xy',
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: false,
                  }
                }
              }
            });
          } else {
            console.error("Container for chart not found.");
          }
        }
      } catch (error) {
        console.error(`Error parsing data for key ${key}:`, error);
      }
    });
  } else {
    console.error("No combined graph data found in local storage.");
  }
}




// Function to update the chart dataset with new data
function updateChartDataset(canvas, dataIndex, newData) {
  const chart = Chart.getChart(canvas); // Get the chart instance
  if (chart) {
    chart.data.datasets[dataIndex] = newData; // Update the dataset
    chart.update(); // Update the chart
  }
}









function extractNumericPart(str) {
  const numericPart = str.match(/\d+/);
  return numericPart ? numericPart[0] : null;
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
});
    
function hideMainContent() {
  const mainContent = document.querySelector('.container ');
  mainContent.style.display = 'none';
}

function getHomepage() {
  api("/", "GET").then((res) => {
    console.log("GANG GANG", res); // Log the actual response
  });
}

function createDynamicLabel(res) {
  // Create label element
  var label = document.createElement("label");

  // Set label text based on response object
  label.textContent = `Type: ${res.type}, Threshold: ${res.threshold}, Operator: ${res.comparison_operator}`;

  // Create delete button
  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function(event) {
    // Prevent the default behavior of the button (page reload)
    event.preventDefault();
    
    // Function to delete this label
    label.remove();
  });

  // Append delete button to label
  label.appendChild(deleteButton);

  // Append label to some container in your HTML
  var container = document.getElementById("labelContainer");
  container.appendChild(label);
}

function createDynamicLabel() {
  api("/getAlarm", "GET")
    .then((res) => {
      console.log("Response from API:", res);
      if (res.message === "Success" && Array.isArray(res.rows)) {
        res.rows.forEach((alarm) => {
          // Create label element
          var label = document.createElement("label");
          label.textContent = ` Sensor: ${alarm.id }  Type: ${alarm.type},  Value: ${alarm.threshold},  Operator: ${alarm.comparison_operator}`;
          label.style.display = "block";
          label.style.marginBottom = "10px";
          label.style.padding = "10px";
          label.style.border = "1px solid #ccc";
          label.style.borderRadius = "5px";
          label.style.backgroundColor = "#f9f9f9";

          // Create delete button
          var deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.style.backgroundColor = "#ff5252";
          deleteButton.style.color = "white";
          deleteButton.style.border = "none";
          deleteButton.style.border = "none";
          deleteButton.style.padding = "5px 10px";
          deleteButton.style.marginRight = "200px"; // Increase the margin to shift the button more to the right

          deleteButton.style.borderRadius = "5px";
          deleteButton.style.cursor = "pointer";

          // Add event listener to delete button
          deleteButton.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default behavior
            var alarmId = alarm.id_alert;
            deleteAlarm(alarmId);
            label.remove();
          });

          // Append delete button to label
          label.appendChild(deleteButton);

          // Append label to hallo101 div
          var container = document.getElementById("hallo101");
          container.appendChild(label);
        });
      } else {
        console.error("Error: Invalid response format - expected a 'Success' message and an array of 'rows'.");
      }
    })
    .catch((error) => {
      console.error("Error fetching alarms:", error);
    });
}






// Function to delete alarm
function deleteAlarm(id) {
  api(`/deleteAlarm/${id}`, "DELETE")
    .then((res) => {
      console.log("Response from delete API:", res);
      if (res.message === "Alarm settings deleted successfully") {
        console.log("Alarm deleted successfully");
      } else {
        console.error("Error deleting alarm:", res.error);
      }
    })
    .catch((error) => {
      console.error("Error deleting alarm:", error);
    });
}
function callOpenAndListenSerialPort() {
  // Call the openAndListenSerialPort API using your custom api() function
  api('/openAndListenSerialPort', "POST")
    .then((res) => {
      if (res.message === "Serial port opened and listening successfully") {
        console.log("Serial port opened and listening successfully");
        // Redirect to homepage.html after successful operation
        window.location.href = 'homepage.html'; // Ensure the path to homepage.html is correct
      } else {
        console.error("Error opening and listening to serial port:", res.error);
        // Display the error message on the HTML page
        displayErrorMessage('No device found. Please plug it in.');
      }
    })
    .catch((error) => {
     s
    });
}

    

function displayErrorMessage(message) {
  const errorMessageElement = document.getElementById('error-message');
  errorMessageElement.innerText = message;
  errorMessageElement.style.display = 'block';

  // Hide the error message after 3 seconds
  setTimeout(() => {
    errorMessageElement.style.display = 'none';
  }, 3000);
}



// You can add all the buttons you want to connect to the API or button functions
document.addEventListener("DOMContentLoaded", function () {
  connectButton("myButton", getHomepage);
  connectButton("usb-choice", callOpenAndListenSerialPort);
  createDynamicLabel();
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
    }
  });

  
  
  // Event listener for the combine-graph button
  const combineGraphButton = document.getElementById("combine-graph");

  var modal70 = document.getElementById("addProductModal");
  if (combineGraphButton) {

    function closeModal(modal) {
      console.log("Closing modal:", modal.id);
      modal.style.display = "none";
      // Remove the modal state from localStorage
      localStorage.removeItem(modal.id);
      localStorage.removeItem("activeTab");
    }
    var modal1 = document.getElementById("addProductModal");

  
    combineGraphButton.addEventListener("click", function(event) {
      // Prevent default form submission behavior
      event.preventDefault();
      event.stopPropagation(); // Stop event propagation
      
      // Generate combined graph based on selected items if at least one item is selected
      if (selectedItems.length >= 1) {
        generateCombinedGraph(selectedItems);
        closeModal(modal70);

        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
          const modalContainer = modalContent.parentElement;
          if (modalContainer) {
            modalContainer.style.display = 'none';
            // Add a 3-second delay before reloading the page
            setTimeout(() => {
              location.reload();

            }, 100);
          } else {
            console.error("Modal container not found.");
          }
        } else {
          console.error("Modal content not found.");
        }
      } else {
        console.error("No items selected to generate combined graph.");
      }
    });
  } else {
    console.error("Combine-graph button not found.");
  }
}  

// Function to remove the existing combined chart
function removeCombinedChart() {
  const combinedChartContainer = document.getElementById('cont');
  if (combinedChartContainer) {
    combinedChartContainer.innerHTML = ''; // Remove all contents inside the container
  } else {
    console.error("Container for chart not found.");
  }
}

function generateCombinedGraph(selectedItems) {
  // Fetch data for selected items from the database or elsewhere
  const promises = selectedItems.map(item => {
    return api(`/getDataFromDatabase?id=${item.id}&type=${item.type}`, 'GET');
  });

  // Wait for all data fetch requests to complete
  Promise.all(promises)
    .then(datasets => {
      console.log(promises);
      console.log('Datasets:', datasets); // Log datasets to check their structure

   // Extract labels and values for each dataset
   const combinedData = datasets.map(data => ({
    labels: data.map(entry => entry.TimeStamp),
    values: data.map(entry => entry.Value),
    id: data.map(entry => entry.Id),
    naam: document.getElementById('graph-input').value,
    color: "" // Creates an array with empty strings for each dataset
  }));
  


      // Save combined data to local storage with a unique key
      const currentTimestamp = Date.now(); // Generate a unique timestamp
      localStorage.setItem(`combinedData_${currentTimestamp}`, JSON.stringify(combinedData)); // Save combined graph data

      // Create a container for the combined chart
      const container = document.createElement('div');
      container.classList.add('card');
      container.classList.add('dynamic-chart-container');
      container.classList.add('drag'); // Add the 'drag' class to make it draggable
      container.classList.add('ui-draggable');
      container.classList.add('ui-draggable-handle');

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
        label: ` for ID ${selectedItems[0].id}`, // Using ID as label
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
