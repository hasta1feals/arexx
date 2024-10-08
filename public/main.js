document.addEventListener('DOMContentLoaded', function () {
  function setActiveTab(tabName) {
    // Store the active tab state in localStorage
    localStorage.setItem("activeTab", tabName);
    // Update the active tab visually
    openTab(tabName);
  }

  var activeTabName = localStorage.getItem("activeTab");
  if (activeTabName) {
    openTab(activeTabName);
    console.log("Active tab:", activeTabName);
  }


  // Function to open a tab
  function openTab(tabName) {
    // Hide all tab content
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Remove active class from all tab buttons
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab and add active class to the button
    document.getElementById(tabName).style.display = "block";
    document.querySelector("[data-tab='" + tabName + "']").className += " active";
  }

  var modalOffset = document.getElementById('addProductModal34');
  
  // Add event listener to the "Notes" button
  var modalAdmin = document.getElementById('addproductnotes');
  var buttontab200000 = document.getElementById("modaltab4442");
  var buttontab2 = document.getElementById("modaltab5552");
  var buttontab27 = document.getElementById("modaltab27");
  var buttontab47 = document.getElementById("modaltab47");

  function closeModal(modal) {
    console.log("Closing modal:", modal.id);
    modal.style.display = "none";
    // Remove the modal state from localStorage
    localStorage.removeItem(modal.id);
    localStorage.removeItem("activeTab");
  }



 
  if (localStorage.getItem(modalOffset.id) === "open") {
    openModal(modalOffset);
  }



  document.getElementById('offsetModalOpen').addEventListener('click', function () {
    console.log('hello');
    openModal(modalOffset);
  });

  function openModal(modal) {
    console.log("Opening modal:", modal.id);
    modal.style.display = "block";
    localStorage.setItem(modal.id, "open");
  }
});



document.addEventListener('DOMContentLoaded', () => {


  

  const savedLanguage = localStorage.getItem('language') || 'en';
  applyTranslation(savedLanguage);

  document.querySelectorAll('.emoji-button').forEach(button => {
    button.addEventListener('click', () => {
      const language = button.getAttribute('data-lang');
      setLanguage(language);
    });
  });

  // Sidebar toggle functionality
  let sidebar = document.querySelector(".sidebar");
  let closeBtn = document.querySelector("#btn");

  closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange();

    // Add or remove the search icon inside the input based on sidebar state
    if (sidebar.classList.contains("open")) {
      document.querySelector(".searchbox i.bx").style.display = "block";
    } else {
      document.querySelector(".searchbox i.bx").style.display = "none";
    }
  });

  function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
      closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else {
      closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
  }
});

function setLanguage(language) {
  localStorage.setItem('language', language);
  applyTranslation(language);
  window.location.reload();
}

function applyTranslation(language) {
  const elements = document.querySelectorAll('[data-translate]');
  elements.forEach(element => {
    const translation = element.getAttribute(`data-${language}`);
    if (translation) {
      element.innerText = translation;
      
    }
  });
}


document.addEventListener('DOMContentLoaded', function() {


  console.log('Document loaded, running script...'); // Initial debug log

  // Function to ping the server and update the image
  const pingServer = () => {
    console.log('Attempting to ping the server...');
    api('/pingLocal', 'POST')
      .then(data => {
        console.log('Received response from server:', data);
        const img = document.getElementById('img-cc');
        if (data.alive) {
          img.src = 'img/connection.svg';
          img.alt = 'Connected';
          console.log('Server is alive. Updated image to connected.');
        } else {
          img.src = 'img/no_connection.svg';
          img.alt = 'No Connection';
          console.log('Server is not alive. Updated image to no connection.');
        }
      })
      .catch(error => {
        console.error('Error while pinging the server:', error);
        const img = document.getElementById('img-cc');
        img.src = 'img/no_connection.svg';
        img.alt = 'No Connection';
        console.log('Failed to reach server. Updated image to no connection.');
      });
  };

  // Ping the server immediately on startup
  pingServer();

  // Set an interval to ping the server every minute (60000 milliseconds)
  setInterval(pingServer,10000 );
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
//makes the excel
try {
  document.getElementById('exceldownload').addEventListener('click', async () => {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
      alert('Please select both start date and end date.');
      return;
    }

    try {
      const data = await api(`/getDate?startDate=${startDate}&endDate=${endDate}`, "GET");
      
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

      // Set the headers
      const headers = ['Id', 'Value', 'Type', 'Unit', 'TimeStamp', 'Nickname'];
      XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

      // Style the header
      const headerCellStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '4F81BD' } },
        alignment: { horizontal: 'center' }
      };

      headers.forEach((header, index) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
        if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
        worksheet[cellAddress].s = headerCellStyle;
      });

      // Style the data
      for (let R = 1; R <= data.length; ++R) {
        for (let C = 0; C < headers.length; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
          worksheet[cellAddress].s = { alignment: { horizontal: 'center' } };
        }
      }

      // Set column widths
      worksheet['!cols'] = headers.map(header => ({ wch: Math.max(header.length, 20) }));

      // Create the Excel file
      XLSX.writeFile(workbook, 'data.xlsx');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch data or generate Excel file.');
    }
  });
} catch (error) {
  // Intentionally left empty to prevent page break
}
document.addEventListener('DOMContentLoaded', function () {
  function setActiveTab(tabName) {
    // Store the active tab state in localStorage
    localStorage.setItem("activeTab", tabName);
    // Update the active tab visually
    openTab(tabName);
  }

  var activeTabName = localStorage.getItem("activeTab");
  if (activeTabName) {
    openTab(activeTabName);
    console.log("Active tab:", activeTabName);
  }

  // Function to open a tab
  function openTab(tabName) {
    // Hide all tab content
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Remove active class from all tab buttons
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab and add active class to the button
    document.getElementById(tabName).style.display = "block";
    document.querySelector("[data-tab='" + tabName + "']").className += " active";
  }

  var modalOffset = document.getElementById('addProductModal34');
  
  // Add event listener to the "Notes" button
  var modalAdmin = document.getElementById('addproductnotes');
  var buttontab200000 = document.getElementById("modaltab4442");
  var buttontab2 = document.getElementById("modaltab5552");
  var buttontab27 = document.getElementById("modaltab27");
  var buttontab47 = document.getElementById("modaltab47");

  function closeModal(modal) {
    console.log("Closing modal:", modal.id);
    modal.style.display = "none";
    // Remove the modal state from localStorage
    localStorage.removeItem(modal.id);
    localStorage.removeItem("activeTab");
  }


  function closeModal2(modal,e) {
    e.preventDefault();
    console.log("Closing modal:", modal.id);
    modal.style.display = "none";
    // Remove the modal state from localStorage
    localStorage.removeItem(modal.id);
    localStorage.removeItem("activeTab");
  }


  buttontab200000.onclick = function () {
    setActiveTab("tab50002");
  };

  buttontab2.onclick = function () {
    setActiveTab("tab60002");
  };


  document.getElementById('closeNotesModal22').addEventListener('click', function () {
    console.log('hello');
    closeModal(modalAdmin);
    window.location.reload();

  });

  document.getElementById('closeThis').addEventListener('click', function () {
    console.log('hello');
    closeModal(modalOffset);
  });

  document.getElementById('close-button3').addEventListener('click', function () {
    console.log('hello');
    closeModal(modalOffset);
  });

  


  if (localStorage.getItem(modalAdmin.id) === "open") {
    openModal(modalAdmin);
  }



  document.getElementById('adminModalOpen').addEventListener('click', function () {
    console.log('hello');
    openModal(modalAdmin);
  });



  function openModal(modal) {
    console.log("Opening modal:", modal.id);
    modal.style.display = "block";
    localStorage.setItem(modal.id, "open");
  }
});





document.addEventListener('DOMContentLoaded', function () {



  async function fillSelectID() {
    try {
      const data = await api('/getUniqueIDsFromDatabase', 'GET');
      const selectID = document.getElementById('select-id');

      // Clear existing options
      selectID.innerHTML = '';

      // Populate new options
      data.forEach(id => {

        const option = document.createElement('option');
        option.value = id.Id;
        option.textContent = id.Id;
        console.log(id.Id);
        selectID.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching unique IDs:', error);
    }
  }


  async function fillSelectID2() {
    try {
      const data = await api('/getUniqueIDsFromDatabase', 'GET');
      const selectID2 = document.getElementById('select-id2');

      // Clear existing options
      selectID.innerHTML = '';

      // Populate new options
      data.forEach(id => {

        const option = document.createElement('option');
        option.value = id.Id;
        option.textContent = id.Id;
        console.log(id.Id);
        selectID.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching unique IDs:', error);
    }
  }




  async function fillSelectType() {
    try {
      const data = await api('/getUniqueTypeFromDatabase', 'GET');
      const selectType = document.getElementById('select-type');

      // Clear existing options
      selectType.innerHTML = '';

      // Populate new options
      data.forEach(id => {

        const option = document.createElement('option');
        option.value = id.Type;
        option.textContent = id.Type;
        console.log(id.Id);
        selectType.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching unique IDs:', error);
    }
  }
  fillSelectID();
  fillSelectType();
  fillSelectID2()


  function setActiveTab(tabName) {
    // Store the active tab state in localStorage
    localStorage.setItem("activeTab", tabName);
    // Update the active tab visually
    openTab(tabName);
  }

  var activeTabName = localStorage.getItem("activeTab");
  if (activeTabName) {
    openTab(activeTabName);
    console.log("Active tab:", activeTabName);
  }

  // Function to open a tab
  function openTab(tabName) {
    // Hide all tab content
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Remove active class from all tab buttons
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab and add active class to the button
    document.getElementById(tabName).style.display = "block";
    document.querySelector("[data-tab='" + tabName + "']").className += " active";
  }

  var modalOffset = document.getElementById('addProductModal34');
  
  // Add event listener to the "Notes" button
  var modalAdmin = document.getElementById('addproductnotes');
  var buttontab200000 = document.getElementById("modaltab4442");
  var buttontab2 = document.getElementById("modaltab5552");
  var buttontab27 = document.getElementById("modaltab27");
  var buttontab47 = document.getElementById("modaltab47");

  function closeModal(modal) {
    console.log("Closing modal:", modal.id);
    modal.style.display = "none";
    // Remove the modal state from localStorage
    localStorage.removeItem(modal.id);
    localStorage.removeItem("activeTab");
  }



 
  if (localStorage.getItem(modalOffset.id) === "open") {
    openModal(modalOffset);
  }



  document.getElementById('offsetModalOpen').addEventListener('click', function () {
    console.log('hello');
    openModal(modalOffset);
  });

  function openModal(modal) {
    console.log("Opening modal:", modal.id);
    modal.style.display = "block";
    localStorage.setItem(modal.id, "open");
  }
});

function adminLogin(){
  const username = document.getElementById('admin-u').value

  const password =  document.getElementById('admin-p').value;

  api('/login', 'POST', { username, password })
      .then(data => {
          if (data.success) {
            window.location.href = 'admin.html';          } else {
              alert(data.error);
          }
      })
      .catch(error => {
          console.error('Error:', error);
      });

}



function openModal(modal) {
  console.log("Opening modal:", modal.id);
  modal.style.display = "block";
  // Store the modal state in localStorage
  localStorage.setItem(modal.id, "open");
}


document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired");

  // Load the HTML content into the "nav-placeholder" element
  $("#nav-placeholder").load("navbar.html");

  // Get the modals and their respective buttons
  var modal1 = document.getElementById("addProductModal");
  var btn1 = document.getElementById("myBtn3");
  var btnNotes = document.getElementById("myBtn5");
  var btnNotes2 = document.getElementById("adminModalOpen");


  var span5_1 = document.getElementsByClassName("close5")[1];
  var discardButton = document.getElementById("closemodal5");
  var discardButton2000 = document.getElementById("closemodal2000");

  var discardButton2 = document.getElementById("close-button3");

  var modal3 = document.getElementById("addProductModal3");
  var modal2000 = document.getElementById("addProductModal2000");
  var modalNotes = document.getElementById("notesModal");

  var btn3 = document.getElementById("myBtn6");
  var span5_3 = document.getElementsByClassName("close5")[2];
  var span5_4 = document.getElementsByClassName("close5")[3];
  var span5_5 = document.getElementsByClassName("close5")[4];
  var span5_6 = document.getElementsByClassName("close5")[0];



  var modal209 = document.getElementById("addProductModal6"); 
  var modal333 = document.getElementById("addproductnotes"); 

  var modalAdmin = document.getElementById("adminModal"); 
  var adminModal = document.getElementById("notesModal2"); 

  

  var btn6 = document.getElementById("changecolorASAH");
  var bt7 = document.getElementById("discardcolor");

  span5_3.onclick = function() {
    closeModal(modal3);
  };

  span5_4.onclick = function() {
    closeModal(modal209);
  };
  span5_5.onclick = function() {
    closeModal(modal2000);
  };

  span5_6.onclick = function() {
    closeModal(modalNotes);
  };
  discardButton.onclick = function() {
    closeModal(modal1);
  };


  discardButton2000.onclick = function() {
    closeModal(modal2000);
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

  var buttontab1 = document.getElementById("modaltab1");
  var buttontab2 = document.getElementById("modaltab2");
  var buttontab4 = document.getElementById("modaltab4");
  var buttontab100 = document.getElementById("modaltab100");
  var buttontab2000 = document.getElementById("modaltab2000");

  var buttontab50000 = document.getElementById("modaltab444");
  var buttontab60000 = document.getElementById("modaltab555");



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

  if (localStorage.getItem(modal2000.id) === "open") {
    openModal(modal2000);
  }


  if (localStorage.getItem(modalNotes.id) === "open") {
    openModal(modalNotes);
  }

  // Add event listeners to open and close the modals
  btn1.onclick = function () {
    openModal(modal1);
  };

  span5_1.onclick = function () {
    closeModal(modal1);
  };

  buttontab1.onclick = function () {
    setActiveTab("tab1");
  };

  buttontab2.onclick = function () {
    setActiveTab("tab2");
  };

  buttontab4.onclick = function () {
    setActiveTab("tab4");
  };

  buttontab50000.onclick = function () {
    setActiveTab("tab5000");
  };


  buttontab60000.onclick = function () {
    setActiveTab("tab6000");
  };

  buttontab100.onclick = function () {
    setActiveTab("tab100");
  };


  
  buttontab2000.onclick = function () {
    setActiveTab("tab20000");
  };


  // Function to set the active tab
  function setActiveTab(tabName) {
    // Store the active tab state in localStorage
    localStorage.setItem("activeTab", tabName);
    // Update the active tab visually
    openTab(tabName);
  }

  // Function to open a tab
  function openTab(tabName) {
    // Hide all tab content
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Remove active class from all tab buttons
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab and add active class to the button
    document.getElementById(tabName).style.display = "block";
    document.querySelector("[data-tab='" + tabName + "']").className += " active";
  }

  var activeTabName = localStorage.getItem("activeTab");
  if (activeTabName) {
    openTab(activeTabName);
    console.log("Active tab:", activeTabName);
  }

  btn3.onclick = function () {
    openModal(modal3);
  };

  var btn2000 = document.getElementById("myBtn20001");
  btn2000.onclick = function () {
    openModal(modal2000);
  };

  btnNotes.onclick = function () {
    openModal(modalNotes);  
  };


  btnNotes2.onclick = function () {
console.log("sasdds");
  }


  modalAdmin.onclick = function () {
    openModal(adminModal);
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

    if (event.target == modal2000) {
      closeModal(modal2000);
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


  
// Declare selectedChoice2 in the global scope if it needs to be used elsewhere
var selectedChoice2 = null;

// function populateDropdown444() {
//   console.log("Initiating API request to fetch unique types...");

//   // Simulated API response data
//   const data = [
//     { "Type": "" },  // Empty option for placeholder or default
//     { "Type": "RH" },
//     { "Type": "Volt" },
//     { "Type": "Unknown" },
//     { "Type": "Temp" }
//   ];

//   // Proceed with the existing logic using the simulated data
//   var select = document.getElementById("dropdown5");
//   console.log("Received data:", data);

//   // Clear previous options
//   select.innerHTML = '';

//   // Check if the response is an array
//   if (Array.isArray(data)) {
//     // Iterate over the data and add options to the dropdown
//     data.forEach(function(row) {
//       if (row.Type !== undefined) {  // Check if Type is defined
//         var option34 = document.createElement("option");
//         option34.value = row.Type;
//         option34.textContent = row.Type;
//         select.appendChild(option);
//       } else {
//         console.warn("Skipping row with undefined Type:", row);
//       }
//     });
//   } else {
//     console.error("Response is not an array:", data);
//   }

//   // Attach event listener to the dropdown
//   select.addEventListener("change", function(event) {
//     // Update the selected value variable
//     selectedChoice2 = event.target.value;
//     console.log("Selected choice in dropdown 3:", selectedChoice2); // Log the selected value
//   });
// }

// Call the function to populate the dropdown
// populateDropdown444();




function sendmail() {
  var email = document.getElementById("inputBox100").value;

  if (!email) {
    console.error("Email is required");
    return;
  }

  var data = {
    email: email,
  };

  api("/update-email", "POST", data)
    .then(function(response) {
      console.log("Raw response:", response); // Log the raw response
      try {
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          // If response is JSON, parse it
          return response.json().then(function(jsonResponse) {
            console.log("Email updated successfully:", jsonResponse);
          });
        } else {
          // If response is not JSON, handle it as text
          return response.text().then(function(textResponse) {
            console.log("Non-JSON response:", textResponse);
          });
        }
      } catch (e) {
        console.error("Failed to parse response:", e);
        console.log("Response:", response);
      }
    })
    .catch(function(error) {
      console.error("Error updating email:", error);
      console.log(data);
    });
}

  document.addEventListener("DOMContentLoaded", function () {
    try {
      let notes = JSON.parse(localStorage.getItem("notes")) || [];
  
      function renderNotes() {
        const notesList = document.getElementById("notesList");
        notesList.innerHTML = "";
        notes.forEach((note, index) => {
          const noteDiv = document.createElement("div");
          noteDiv.className = "note";
          noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="deleteNote(${index})">Delete</button>
          `;
          notesList.appendChild(noteDiv);
        });
      }
  
      function saveNote() {
        const title = document.getElementById("noteTitle").value;
        const content = document.getElementById("noteContent").value;
        const messageElement = document.getElementById("noteMessage");
        if (title && content) {
          notes.push({ title, content });
          localStorage.setItem("notes", JSON.stringify(notes));
          document.getElementById("noteTitle").value = "";
          document.getElementById("noteContent").value = "";
          localStorage.removeItem("noteTitle");
          localStorage.removeItem("noteContent");
          messageElement.textContent = "Note saved!";
          messageElement.style.color = "green";
        } else {
          messageElement.textContent = "Please fill in both fields.";
          messageElement.style.color = "red";
        }
        renderNotes();
      }
  
      function deleteNote(index) {
        notes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        renderNotes();
      }
  
      function saveDraft() {
        const title = document.getElementById("noteTitle").value;
        const content = document.getElementById("noteContent").value;
        localStorage.setItem("noteTitle", title);
        localStorage.setItem("noteContent", content);
      }
  
      // Load draft
      if (localStorage.getItem("noteTitle")) {
        document.getElementById("noteTitle").value = localStorage.getItem("noteTitle");
      }
      if (localStorage.getItem("noteContent")) {
        document.getElementById("noteContent").value = localStorage.getItem("noteContent");
      }
  
      document.getElementById("noteTitle").addEventListener("input", saveDraft);
      document.getElementById("noteContent").addEventListener("input", saveDraft);
      document.getElementById("saveNote").onclick = saveNote;
  
      // Expose deleteNote function to global scope
      window.deleteNote = deleteNote;
  
      // Render notes on load
      renderNotes();
    } catch (error) {
    }

  });
  

  document.addEventListener("DOMContentLoaded", function () {
    try {
      let adminNotes = JSON.parse(localStorage.getItem("adminNotes")) || [];
  
      function renderAdminNotes() {
        const adminNotesList = document.getElementById("notesList");
        adminNotesList.innerHTML = "";
        adminNotes.forEach((note, index) => {
          const noteDiv = document.createElement("div");
          noteDiv.className = "adminNote";
          noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button id="hello" onclick="deleteAdminNote(${index})">Delete</button>
          `;
          adminNotesList.appendChild(noteDiv);
        });
      }
  
      function saveAdminNote() {
        const title = document.getElementById("noteTitle").value;
        const content = document.getElementById("noteContent").value;
        const messageElement = document.getElementById("noteMessage");
        if (title && content) {
          adminNotes.push({ title, content });
          localStorage.setItem("adminNotes", JSON.stringify(adminNotes));
          document.getElementById("noteTitle").value = "";
          document.getElementById("noteContent").value = "";
          localStorage.removeItem("adminNoteTitle");
          localStorage.removeItem("adminNoteContent");
          messageElement.textContent = "Note saved!";
          messageElement.style.color = "green";
        } else {
          messageElement.textContent = "Please fill in both fields.";
          messageElement.style.color = "red";
        }
        renderAdminNotes();
      }
  
      function deleteAdminNote(index) {
        adminNotes.splice(index, 1);
        localStorage.setItem("adminNotes", JSON.stringify(adminNotes));
        renderAdminNotes();
      }
  
      function saveAdminDraft() {
        const title = document.getElementById("noteTitle").value;
        const content = document.getElementById("noteContent").value;
        localStorage.setItem("adminNoteTitle", title);
        localStorage.setItem("adminNoteContent", content);
      }
  
      // Load draft
      if (localStorage.getItem("adminNoteTitle")) {
        document.getElementById("noteTitle").value = localStorage.getItem("adminNoteTitle");
      }
      if (localStorage.getItem("adminNoteContent")) {
        document.getElementById("noteContent").value = localStorage.getItem("adminNoteContent");
      }
  
      document.getElementById("noteTitle").addEventListener("input", saveAdminDraft);
      document.getElementById("noteContent").addEventListener("input", saveAdminDraft);
      document.getElementById("saveNoteAdmin").onclick = function() {
        saveAdminNote();
    
        setTimeout(function() {
            document.getElementById("noteTitle").value = "";
            document.getElementById("noteContent").value = "";
        }, 1000); // 1000 milliseconds = 1 second
    };
    
  
      // Expose deleteAdminNote function to global scope
      window.deleteAdminNote = deleteAdminNote;
  
      // Render notes on load
      renderAdminNotes();
    } catch (error) {
      console.error("Error loading admin notes:", error);
    }
  });
  
  
  

  document.getElementById('send-email').addEventListener('click', function(event) {
    
    var modal2000 = document.getElementById('addProductModal3')

    function closeModal(modal) {
      console.log("Closing modal:", modal.id);
      modal.style.display = "none";
      // Remove the modal state from localStorage
      localStorage.removeItem(modal.id);
      localStorage.removeItem("activeTab");
    }
    

    closeModal(modal2000);
    // Call the setAlertParameters function
    sendmail();
  });


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
              const Nickname = typeEntry.Nickname; // get the
              // Create a container and chart for the current ID and Type
              const label = `${Nickname} - ${type}`; // Create label with ID and Type
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

    window.location.reload();
  });


  
} catch (error) {
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
  // populateDropdown444();
  var xyz = document.getElementById('addProductModal34');

  document.getElementById('create-Offset').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default behavior

    function closeModal(modal) {
      console.log("Closing modal:", modal.id);
      modal.style.display = "none";
      // Remove the modal state from localStorage
      localStorage.removeItem(modal.id);
      localStorage.removeItem("activeTab");
    }

    closeModal(xyz);
    // Log before calling the function
    console.log('Calling setOffsetParameters3');
    // Call the setAlertParameters function
    setOffsetParameters3();
    window.location.reload();
  });

  if (minimizeBtn && graphList && showGraphListBtn) {
    minimizeBtn.addEventListener('click', function() {
      graphList.style.display = 'none';
    });

    showGraphListBtn.addEventListener('click', function() {
      graphList.style.display = 'block';
    });
  }
});

function setOffsetParameters3() {
  console.log('Inside setOffsetParameters3');
  var dropdown = document.getElementById("dropdown5");
  var selectedValue = dropdown.value;
  // Get values from global variables
  const offset = selectedValue;
  const value = document.getElementById('setOffsetParameters').value; // Assuming inputBox1 is the ID for the value input box

  // Check if all required parameters are available
  if (!offset || !value) {
    console.error('Missing required parameters');
    return;
  }

  // Log the values before making the API call
  console.log('Offset:', offset);
  console.log('Value:', value);

  // Prepare data for the POST request
  const data = {
    offset: offset,
    value: value,
  };

  // Make the POST request using the api function
  api('/setOffset', 'POST', data)
    .then(response => {
      console.log('Alert parameters set successfully:', response);
    })
    .catch(error => {
      console.error('Error setting alert parameters:', error);
    });
}
function createDynamicLabel2() {
  api("/getOffset", "GET")
    .then((res) => {
      console.log("Response from API:", res);
      if (res.message === "Success" && Array.isArray(res.rows)) {
        var container = document.getElementById("hallo1013");
        container.innerHTML = ''; // Clear existing labels

        res.rows.forEach((offset) => {
          // Create label element
          var label = document.createElement("label");
          label.textContent = `Offset: ${offset.offset}  Value: ${offset.value}`;
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
          deleteButton.style.padding = "5px 10px";
          deleteButton.style.marginRight = "200px"; // Increase the margin to shift the button more to the right
          deleteButton.style.borderRadius = "5px";
          deleteButton.style.cursor = "pointer";

          // Add event listener to delete button
          deleteButton.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default behavior
            event.preventDefault(); // Prevent default behavior

            var offsetID = offset.id; // Assuming offset has an id_alert property
            deleteOffset(offsetID);
            label.remove();
          });

          // Append delete button to label
          label.appendChild(deleteButton);

          // Append label to hallo1013 div
          container.appendChild(label);
        });
      } else {
        console.error("Error: Invalid response format - expected a 'Success' message and an array of 'rows'.");
      }
    })
    .catch((error) => {
      console.error("Error fetching offsets:", error);
    });
}

createDynamicLabel2();
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
        idElement.textContent = `${entry.Nickname[0]}`;
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
        createCombinedChartFromLocalStorage();
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
  // Clear existing chart containers
  const existingContainers = document.querySelectorAll('.dynamic-chart-container');
  existingContainers.forEach(container => container.remove());

  const combinedDataKeys = Object.keys(localStorage).filter(key => key.startsWith('combinedData_'));

  if (combinedDataKeys.length > 0) {
    combinedDataKeys.forEach(key => {
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
            // Set initial display state from localStorage
            colorForm.style.display = localStorage.getItem(colorFormId) || 'none';

            // Create a label element to display the ID above the color picker
            const idLabel = document.createElement('label');
            idLabel.textContent = `ID: ${data.Nickname[0]}`;
            colorForm.appendChild(idLabel);

            colorForm.innerHTML += `<input type="color" id="${colorFormId}-input" value="${data.color}">`;
            document.querySelector('#addProductModal6 .modal-body').appendChild(colorForm);

            const colorInput = colorForm.querySelector(`#${colorFormId}-input`);
            colorInput.addEventListener('change', (function (data) {
              return function (event) {
                data.borderColor = hexToRGBA(event.target.value, 0.1);
                data.color = event.target.value;
                data.backgroundColor = hexToRGBA(event.target.value, 0.1);
                updateLocalStorage(key, JSON.stringify(combinedData));
                // Recreate charts to reflect color changes
                createCombinedChartFromLocalStorage();
              };
            })(data));

            return {
              label: `Data for ${data.Nickname[0]} - ${data.type[0]}`,
              data: data.values,
              borderColor: data.color,
              backgroundColor: hexToRGBA(data.color, 0.1),
              naam: data.naam,
              color: data.color,
              sensornickname: data.sensornickname
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

          cardContent.appendChild(cardTitle);
          cardContent.appendChild(removeButton);

          const openOptions = document.createElement('button');
          openOptions.classList.add('open-options');
          openOptions.innerHTML = '<i class="fas fa-cog"></i>';
          openOptions.addEventListener('click', function () {
            // Hide all color pickers first
            document.querySelectorAll('#addProductModal6 .modal-body form').forEach(form => {
              form.style.display = 'none';
              localStorage.setItem(form.id, 'none');
            });

            // Show only the relevant color pickers for the current graph
            document.querySelectorAll(`#addProductModal6 .modal-body form[id^="form-color-${key}"]`).forEach(form => {
              form.style.display = 'block';
              localStorage.setItem(form.id, 'block');
            });

            openModal(document.getElementById("addProductModal6"));
          });

          cardContent.appendChild(openOptions);

          const graphPlaceholder = document.createElement('div');
          graphPlaceholder.classList.add('graph-placeholder');

          const canvas = document.createElement('canvas');
          canvas.setAttribute('id', `${key}-chart`);
          canvas.setAttribute('class', 'dynamic-chart');
          canvas.setAttribute('width', '600');
          canvas.setAttribute('height', '300');

          graphPlaceholder.appendChild(canvas);
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




// Optional: Add a listener to update charts when localStorage changes
window.addEventListener('storage', (event) => {
  if (event.key && event.key.startsWith('combinedData_')) {
    createCombinedChartFromLocalStorage();
  }
});







function extractNumericPart(str) {
  const numericPart = str.match(/\d+/);
  return numericPart ? numericPart[0] : null;
}


// $(document).ready(function() {
//   // Initialize draggability for elements with the 'drag' class
//   $(".drag").draggable();
// });




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





document.addEventListener('DOMContentLoaded', function () {
  function itemsLoad() {
    api("/getAllitems", "GET")
      .then((res) => {
        const tableBody = document.querySelector("#myTable tbody");
        tableBody.innerHTML = ''; // Clear existing rows

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
            <td>${row.Nickname}</td>
            <td><button class="btn-get-id" data-id="${row.Id}" data-type="${row.Type}">Graph</button></td>
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
       // 10 seconds in milliseconds
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        // In case of an error, set newDataReceived to false
        newDataReceived = false;
        localStorage.setItem('newDataReceived', 'false');
      });
  }

  try {
    function itemsLoad2() {
      api("/getAll", "GET")
        .then((res) => {
          const tableBody = document.querySelector("#myTable2 tbody");
          tableBody.innerHTML = ''; // Clear existing rows
  
          // Check if new data is received
          const hasNewData = res.rows && res.rows.length > 0;
  
          // Loop through the items and add them to the table
          if (hasNewData) {
            res.rows.forEach((row) => {
              const newRow = document.createElement("tr");
              newRow.innerHTML = `
                <td>${row.Id}</td>
                <td>${row.Value}</td>
                <td>${row.Type}</td>
                <td>${row.TimeStamp}</td>
                <td>${row.Nickname}</td>
                
              `;
              tableBody.appendChild(newRow);
            });
          }
        })
        .catch((error) => {
          console.error('Error loading items:', error);
        });
    }
  
    // Call the function to load items
    itemsLoad2();
  } catch (error) {
    console.error('Error:', error);
  }
  



 

  // Initial table update
  itemsLoad();
  // itemsLoad2();
  // Periodically update the table every 5 seconds
  setInterval(itemsLoad, 5000);
});




function searchTable4() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable2");
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




function handleKeyupEvent() {
  searchTable4();
  searchTable();

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



function deleteOffset(id) {
  api(`/deleteOffset/${id}`, "DELETE")
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
  try {
      connectButton("myButton", getHomepage);
      connectButton("usb-choice", callOpenAndListenSerialPort);
      connectButton("admin-login", adminLogin);
      
      createDynamicLabel();
      createDynamicLabel2();

  } catch (error) {
      // Catch block left intentionally empty
  }
});




document.addEventListener('DOMContentLoaded', function() {
  api("/getEmail", "GET").then((res) => {
    document.getElementById('activeEmail').value = res[0].email || "SLATTTT";

    console.log(res[0].email);
  });

  console.log("Email");
});

function connectButton(id, event) {
  let element = document.getElementById(id);
  if (element) {
    element.addEventListener("click", event);
  }
}

// API function to get info from the server to frontend
function api(endpoint, method = "GET", data = {}) {
  const API = "http://localhost:3000";

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







function api2(endpoint, method = "GET", data = {}) {
  const API = "http://192.168.4.1/";

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

  return fetch(API + endpoint, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
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
    Nickname: data.map(entry => entry.Nickname),
    type: data.map(entry => entry.Type),
    naam: document.getElementById('graph-input').value,
    color: "",// Creates an array with empty strings for each dataset
    sensornickname:"",
    linechoices:"",
    lineThickness:"",
    datechoices:""

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

document.getElementById("setting-logo").addEventListener("click", function() {
  var loadingIndicator = document.getElementById("loading-indicator");

  // Show the loading indicator
  loadingIndicator.style.display = "block";

  // Create a timeout promise that rejects after 10 seconds
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Please connect to the 'arexx_multilogger' wifi!"));
    }, 10000);
  });

  // Call the API and race it against the timeout promise
  Promise.race([
    api("/pingLocal", "POST"),
    timeoutPromise
  ])
  .then((res) => {
    console.log("Response from API:", res); // Log the actual response

    // Check if the server is alive
    if (res.alive === true) {
      window.location.href = "setting.html";
    } else {
      // Show alert if the server is not alive
      alert("Please connect to the 'arexx_multilogger' wifi!");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    alert(error.message); // Display error message to user
  })
  .finally(() => {
    // Hide the loading indicator when done
    loadingIndicator.style.display = "none";
  });
});




function saveLineChoice(id, lineStyle) {
  const lineChoicesKey = 'lineChoices';
  const storedLineChoices = JSON.parse(localStorage.getItem(lineChoicesKey)) || {};
  storedLineChoices[id] = lineStyle;
  localStorage.setItem(lineChoicesKey, JSON.stringify(storedLineChoices));
}

function addLineStyleOptions(form, id, key, index, data) {
  const lineStyleId = `line-style-${key}-${index}`;
  const lineStyleSelect = document.createElement('select');
  lineStyleSelect.setAttribute('id', lineStyleId);

  const lineStyles = ['solid', 'dashed', 'dotted'];
  lineStyles.forEach(style => {
    const option = document.createElement('option');
    option.value = style;
    option.text = style.charAt(0).toUpperCase() + style.slice(1);
    option.selected = data.linechoices === style;
    lineStyleSelect.appendChild(option);
  });

  lineStyleSelect.addEventListener('change', (event) => {
    saveLineChoice(id, event.target.value);
    createCombinedChartFromLocalStorage();
  });

  form.appendChild(lineStyleSelect);
}

function updateLocalStorage(key, value) {
  localStorage.setItem(key, value);
}


function createCombinedChartFromLocalStorage() {
  // Clear existing chart containers
  const existingContainers = document.querySelectorAll('.dynamic-chart-container');
  existingContainers.forEach(container => container.remove());

  const combinedDataKeys = Object.keys(localStorage).filter(key => key.startsWith('combinedData_'));

  if (combinedDataKeys.length > 0) {
    combinedDataKeys.forEach(key => {
      const combinedDataString = localStorage.getItem(key);
      try {
        const combinedData = JSON.parse(combinedDataString);

        if (Array.isArray(combinedData) && combinedData.length > 0) {
          const labels = combinedData[0].labels;

          const datasets = combinedData.map((data, index) => {
            const lineChoicesKey = 'lineChoices';
            const lineThicknessKey = 'lineThickness';
            const dateChoicesKey = 'datechoices';
            const storedLineChoices = JSON.parse(localStorage.getItem(lineChoicesKey)) || {};
            const storedLineThickness = JSON.parse(localStorage.getItem(lineThicknessKey)) || {};
            const storedDateChoices = JSON.parse(localStorage.getItem(dateChoicesKey)) || {};
            const lineStyle = storedLineChoices[data.id[0]] || 'solid';
            const lineThickness = storedLineThickness[data.id[0]] || 1;
            const startDate = storedDateChoices[data.id[0]] ? new Date(storedDateChoices[data.id[0]].startDate) : null;
            const endDate = storedDateChoices[data.id[0]] ? new Date(storedDateChoices[data.id[0]].endDate) : null;

            const colorFormId = `form-color-${key}-${index}`;
            let colorForm = document.getElementById(colorFormId);
            if (colorForm) {
              colorForm.parentNode.removeChild(colorForm);
            }
            colorForm = document.createElement('form');
            colorForm.setAttribute('id', colorFormId);
            // Set initial display state from localStorage
            colorForm.style.display = localStorage.getItem(colorFormId) || 'none';
            colorForm.style.border = '1px solid #ccc';
            colorForm.style.padding = '10px';
            colorForm.style.marginBottom = '10px';

            // Create a label element to display the ID above the color picker
            const idLabel = document.createElement('label');
            idLabel.textContent = `ID: ${data.id[0]}`;
            colorForm.appendChild(idLabel);
            colorForm.appendChild(document.createElement('br'));

            // Color picker label
            const colorPickerLabel = document.createElement('label');
            colorPickerLabel.setAttribute('data-translate', '');
            colorPickerLabel.setAttribute('data-eng', 'Line Color: ');
            colorPickerLabel.setAttribute('data-fr', 'Couleur de la ligne: ');
            colorPickerLabel.setAttribute('data-de', 'Linienfarbe: ');
            colorPickerLabel.setAttribute('data-nl', 'Lijnkleur: ');
            colorPickerLabel.textContent = 'Line Color: ';
            colorForm.appendChild(colorPickerLabel);

            // Color picker input
            colorForm.innerHTML += `<input type="color" id="${colorFormId}-input" value="${data.color}">`;
            document.querySelector('#addProductModal6 .modal-body').appendChild(colorForm);

            const colorInput = colorForm.querySelector(`#${colorFormId}-input`);
            colorInput.addEventListener('change', (function (data) {
              return function (event) {
                data.borderColor = hexToRGBA(event.target.value, 0.1);
                data.color = event.target.value;
                data.backgroundColor = hexToRGBA(event.target.value, 0.1);
                updateLocalStorage(key, JSON.stringify(combinedData));
                // Recreate charts to reflect color changes
                createCombinedChartFromLocalStorage();
              };
            })(data));
            colorForm.appendChild(document.createElement('br'));

            // Line style label
            const lineStyleLabel = document.createElement('label');
            lineStyleLabel.setAttribute('data-translate', '');
            lineStyleLabel.setAttribute('data-eng', 'Line Style: ');
            lineStyleLabel.setAttribute('data-fr', 'Style de ligne: ');
            lineStyleLabel.setAttribute('data-de', 'Linienstil: ');
            lineStyleLabel.setAttribute('data-nl', 'Lijnstijl: ');
            lineStyleLabel.textContent = 'Line Style: ';
            colorForm.appendChild(lineStyleLabel);

            // Line style select
            const lineStyleId = `line-style-${key}-${index}`;
            const lineStyleSelect = document.createElement('select');
            lineStyleSelect.setAttribute('id', lineStyleId);

            const lineStyles = ['solid', 'dashed', 'dotted'];
            lineStyles.forEach(style => {
              const option = document.createElement('option');
              option.value = style;
              option.text = style.charAt(0).toUpperCase() + style.slice(1);
              option.selected = lineStyle === style;
              lineStyleSelect.appendChild(option);
            });

            lineStyleSelect.addEventListener('change', (function (data) {
              return function (event) {
                const style = event.target.value;
                data.linechoices = style;
                const storedLineChoices = JSON.parse(localStorage.getItem(lineChoicesKey)) || {};
                storedLineChoices[data.id[0]] = style;
                localStorage.setItem(lineChoicesKey, JSON.stringify(storedLineChoices));
                createCombinedChartFromLocalStorage();
              };
            })(data));

            colorForm.appendChild(lineStyleSelect);
            colorForm.appendChild(document.createElement('br'));

            // Line thickness label
            const lineThicknessLabel = document.createElement('label');
            lineThicknessLabel.setAttribute('data-translate', '');
            lineThicknessLabel.setAttribute('data-eng', 'Line Thickness (1-9): ');
            lineThicknessLabel.setAttribute('data-fr', 'Épaisseur de la ligne (1-9): ');
            lineThicknessLabel.setAttribute('data-de', 'Linienstärke (1-9): ');
            lineThicknessLabel.setAttribute('data-nl', 'Lijndikte (1-9): ');
            lineThicknessLabel.textContent = 'Line Thickness (1-9): ';
            colorForm.appendChild(lineThicknessLabel);

            // Line thickness input
            const lineThicknessId = `line-thickness-${key}-${index}`;
            const lineThicknessInput = document.createElement('input');
            lineThicknessInput.setAttribute('type', 'number');
            lineThicknessInput.setAttribute('id', lineThicknessId);
            lineThicknessInput.setAttribute('min', '1');
            lineThicknessInput.setAttribute('max', '9');
            lineThicknessInput.setAttribute('value', lineThickness);

            lineThicknessInput.addEventListener('change', (function (data) {
              return function (event) {
                const thickness = event.target.value;
                data.lineThickness = thickness;
                const storedLineThickness = JSON.parse(localStorage.getItem(lineThicknessKey)) || {};
                storedLineThickness[data.id[0]] = thickness;
                localStorage.setItem(lineThicknessKey, JSON.stringify(storedLineThickness));
                createCombinedChartFromLocalStorage();
              };
            })(data));

            colorForm.appendChild(lineThicknessInput);
            colorForm.appendChild(document.createElement('br'));

            // Date range filter label
            colorForm.appendChild(document.createElement('br'));

            const dateRangeLabel = document.createElement('label');
            dateRangeLabel.setAttribute('data-translate', '');
            dateRangeLabel.setAttribute('data-eng', 'Date Range: ');
            dateRangeLabel.setAttribute('data-fr', 'Plage de dates: ');
            dateRangeLabel.setAttribute('data-de', 'Datumsbereich: ');
            dateRangeLabel.setAttribute('data-nl', 'Datumbereik: ');
            dateRangeLabel.textContent = 'Date Range: ';
            colorForm.appendChild(dateRangeLabel);
            colorForm.appendChild(document.createElement('br'));

            // Start date input
            const startDateLabel = document.createElement('label');
            startDateLabel.setAttribute('data-translate', '');
            startDateLabel.setAttribute('data-eng', 'Start Date:');
            startDateLabel.setAttribute('data-fr', 'Date de début:');
            startDateLabel.setAttribute('data-de', 'Anfangsdatum:');
            startDateLabel.setAttribute('data-nl', 'Begindatum:');
            startDateLabel.textContent = 'Start Date:';
            colorForm.appendChild(startDateLabel);

            const startDateInput = document.createElement('input');
            startDateInput.setAttribute('type', 'date');
            startDateInput.setAttribute('id', `start-date-${key}-${index}`);
            startDateInput.value = storedDateChoices[data.id[0]] ? storedDateChoices[data.id[0]].startDate : '';
            colorForm.appendChild(startDateInput);
            colorForm.appendChild(document.createElement('br'));

            // End date input
            const endDateLabel = document.createElement('label');
            endDateLabel.setAttribute('data-translate', '');
            endDateLabel.setAttribute('data-eng', 'End Date:');
            endDateLabel.setAttribute('data-fr', 'Date de fin:');
            endDateLabel.setAttribute('data-de', 'Enddatum:');
            endDateLabel.setAttribute('data-nl', 'Einddatum:');
            endDateLabel.textContent = 'End Date:';
            colorForm.appendChild(endDateLabel);

            const endDateInput = document.createElement('input');
            endDateInput.setAttribute('type', 'date');
            endDateInput.setAttribute('id', `end-date-${key}-${index}`);
            endDateInput.value = storedDateChoices[data.id[0]] ? storedDateChoices[data.id[0]].endDate : '';
            colorForm.appendChild(endDateInput);
            colorForm.appendChild(document.createElement('br'));

            const applyFilterButton = document.createElement('button');
            applyFilterButton.setAttribute('type', 'button');
            applyFilterButton.setAttribute('data-translate', '');
            applyFilterButton.setAttribute('data-eng', 'Apply Filter');
            applyFilterButton.setAttribute('data-fr', 'Appliquer le filtre');
            applyFilterButton.setAttribute('data-de', 'Filter anwenden');
            applyFilterButton.setAttribute('data-nl', 'Filter toepassen');
            applyFilterButton.textContent = 'Apply Filter';
            applyFilterButton.style.padding = '5px 10px';
            applyFilterButton.style.marginTop = '10px';
            applyFilterButton.style.backgroundColor = '#007bff';
            applyFilterButton.style.color = 'white';
            applyFilterButton.style.border = 'none';
            applyFilterButton.style.borderRadius = '4px';
            applyFilterButton.style.cursor = 'pointer';

            applyFilterButton.addEventListener('click', () => {
              const startDate = document.getElementById(`start-date-${key}-${index}`).value;
              const endDate = document.getElementById(`end-date-${key}-${index}`).value;
              const storedDateChoices = JSON.parse(localStorage.getItem(dateChoicesKey)) || {};
              storedDateChoices[data.id[0]] = { startDate, endDate };
              localStorage.setItem(dateChoicesKey, JSON.stringify(storedDateChoices));
              createCombinedChartFromLocalStorage();
            });

            colorForm.appendChild(applyFilterButton);

            const resetFilterButton = document.createElement('button');
            resetFilterButton.setAttribute('type', 'button');
            resetFilterButton.setAttribute('data-translate', '');
            resetFilterButton.setAttribute('data-eng', 'Reset Filter');
            resetFilterButton.setAttribute('data-fr', 'Réinitialiser le filtre');
            resetFilterButton.setAttribute('data-de', 'Filter zurücksetzen');
            resetFilterButton.setAttribute('data-nl', 'Filter resetten');
            resetFilterButton.textContent = 'Reset Filter';
            resetFilterButton.style.padding = '5px 10px';
            resetFilterButton.style.marginTop = '10px';
            resetFilterButton.style.marginLeft = '10px';
            resetFilterButton.style.backgroundColor = '#dc3545';
            resetFilterButton.style.color = 'white';
            resetFilterButton.style.border = 'none';
            resetFilterButton.style.borderRadius = '4px';
            resetFilterButton.style.cursor = 'pointer';

            resetFilterButton.addEventListener('click', () => {
              startDateInput.value = '';
              endDateInput.value = '';
              const storedDateChoices = JSON.parse(localStorage.getItem(dateChoicesKey)) || {};
              delete storedDateChoices[data.id[0]];
              localStorage.setItem(dateChoicesKey, JSON.stringify(storedDateChoices));
              createCombinedChartFromLocalStorage();
            });

            colorForm.appendChild(resetFilterButton);

            document.querySelector('#addProductModal6 .modal-body').appendChild(colorForm);

            const filteredValues = data.values.filter((value, index) => {
              const date = new Date(data.labels[index]);
              return (!startDate || date >= startDate) && (!endDate || date <= endDate);
            });
            const filteredLabels = data.labels.filter((label, index) => {
              const date = new Date(label);
              return (!startDate || date >= startDate) && (!endDate || date <= endDate);
            });

            return {
              label: `Data for ${data.id[0]}`,
              data: filteredValues,
              borderColor: data.color,
              backgroundColor: hexToRGBA(data.color, 0.1),
              borderDash: lineStyle === 'dashed' ? [5, 5] : lineStyle === 'dotted' ? [1, 1] : [],
              borderWidth: lineThickness,
              labels: filteredLabels,
              naam: data.naam,
              color: data.color,
              sensornickname: data.sensornickname
            };
          });

          const container = document.createElement('div');
          container.classList.add('card');
          container.classList.add('dynamic-chart-container');
          container.setAttribute('id', `${key}-container`);
          container.classList.add('drag');

          const cardContent = document.createElement('div');
          cardContent.classList.add('card-content');

          const cardTitle = document.createElement('div');
          cardTitle.classList.add('card-title');
          const nam = datasets[0].naam;
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

          cardContent.appendChild(cardTitle);
          cardContent.appendChild(removeButton);

          const openOptions = document.createElement('button');
          openOptions.classList.add('open-options');
          openOptions.setAttribute('data-translate', '');
          openOptions.setAttribute('data-eng', 'Open Options');
          openOptions.setAttribute('data-fr', 'Ouvrir les options');
          openOptions.setAttribute('data-de', 'Optionen öffnen');
          openOptions.setAttribute('data-nl', 'Opties openen');
          openOptions.innerHTML = '<i class="fas fa-cog"></i>';
          openOptions.addEventListener('click', function () {
            // Hide all color pickers first
            document.querySelectorAll('#addProductModal6 .modal-body form').forEach(form => {
              form.style.display = 'none';
              localStorage.setItem(form.id, 'none');
            });

            // Show only the relevant color pickers for the current graph
            document.querySelectorAll(`#addProductModal6 .modal-body form[id^="form-color-${key}"]`).forEach(form => {
              form.style.display = 'block';
              localStorage.setItem(form.id, 'block');
            });

            openModal(document.getElementById("addProductModal6"));
          });

          cardContent.appendChild(openOptions);

          const graphPlaceholder = document.createElement('div');
          graphPlaceholder.classList.add('graph-placeholder');

          const canvas = document.createElement('canvas');
          canvas.setAttribute('id', `${key}-chart`);
          canvas.setAttribute('class', 'dynamic-chart');
          canvas.setAttribute('width', '1200');
          canvas.setAttribute('height', '800'); // Adjust the height as needed

          graphPlaceholder.appendChild(canvas);
          cardContent.appendChild(graphPlaceholder);
          container.appendChild(cardContent);

          const combinedChartContainer = document.getElementById('cont');
          if (combinedChartContainer) {
            combinedChartContainer.appendChild(container);

            new Chart(canvas, {
              type: 'line',
              data: {
                labels: datasets[0].labels,
                datasets: datasets
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                  padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50
                  }
                },
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
                  x: {
                    grid: {
                      display: true,
                      color: 'rgba(0, 0, 0, 0.1)'
                    },
                    title: {
                      display: true,
                      text: 'Time'
                    }
                  },
                  y: {
                    beginAtZero: false,
                    min: Math.min(...datasets.flatMap(data => data.data)) - 1, // Ensure some padding below min value
                    max: Math.max(...datasets.flatMap(data => data.data)) + 1, // Ensure some padding above max value
                    grid: {
                      display: true,
                      color: 'rgba(0, 0, 0, 0.1)'
                    },
                    title: {
                      display: true,
                      text: 'Value'
                    }
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



  

document.getElementById("cn").addEventListener("click", function() {
  console.log("Hello");

  fetch("http://multilogger.local/get-wifi", {
    method: "GET"
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Response from API:", data); // Log the actual response
    const helpElement = document.getElementById("current");
    
      helpElement.innerText = data.STA.SSID;
    
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
});

function sendWifi(e) {
  e.preventDefault(); // Prevent the default form submission behavior

  var ssid = document.getElementById("ssid").value;
  var password = document.getElementById("password").value;
  var adminKey = "admin";

  fetch("http://multilogger.local/set-wifi-sta", {
      method: "POST",
      body: JSON.stringify({ 
          STA: {
              SSID: ssid, 
              PWD: password
          },
          "admin-key": adminKey // Use quotes for property names with hyphens
      })
  })
  .then(response => response.text()) // Read the response as text
  .then(text => {
      try {
          const data = JSON.parse(text); // Try to parse the response as JSON
          console.log("Response from API:", data); // Log the actual response if it's valid JSON
      } catch {
          console.log("Response from API:", text); // Log the response as plain text if it's not JSON
          if(text.trim() === "AP credentials successfully updated") {
            document.getElementById("statusMessage").innerHTML = '<span style="color: red;">&#10060; ' + text + '</span>';

             
          } else if (!text.includes("successfully")) { // Check if the response text indicates an error
            document.getElementById("statusMessage").innerHTML = '<span style="color: green;">&#10004; AP credentials successfully updated</span> <br> <span> Please unplug and plug your device!</span>';
            setTimeout(() => {
                window.location.href = "choice.html"; // Change to your desired page
            }, 5000);
          }
      }
  })
  .catch(error => {
      console.error("Error:", error.message); // Log any errors
      document.getElementById("statusMessage").innerHTML = '<span style="color: red;">&#10060; ' + error.message + '</span>';
  });
}

var sendwifiBtn = document.getElementById("sendWifibtn");

sendwifiBtn.onclick = function (e) {
  sendWifi(e); // Pass the event object to the sendWifi function
}

function sendMQTT(e) {
  e.preventDefault(); // Prevent the default form submission behavior

  var broker = document.getElementById("broker").value;
  var port = document.getElementById("port").value;
  var username = document.getElementById("username").value;
  var password = document.getElementById("mqtt-password").value;
  var topic = document.getElementById("topic").value;
  var adminKey = document.getElementById("admin-key").value;

  fetch("http://multilogger.local/set-mqtt", {
      method: "POST",
      body: JSON.stringify({
          MQTT: {
              BROKER: broker,
              PORT: port,
              USERNAME: username,
              PWD: password,
              TOPIC: topic
          },
          "admin-key": adminKey // Use quotes for property names with hyphens
      })
  })
  .then(response => response.text()) // Read the response as text
  .then(text => {
      try {
          const data = JSON.parse(text); // Try to parse the response as JSON
          console.log("Response from API:", data); // Log the actual response if it's valid JSON
      } catch {
          console.log("Response from API:", text); // Log the response as plain text if it's not JSON'
          if (text.trim() === "MQTT settings successfully updated") {
              document.getElementById("mqttStatusMessage").innerHTML = '<span style="color: red;">&#10060; ' + text + '</span>';
              setTimeout(() => {
                  window.location.href = "choice.html"; // Change to your desired page
              }, 5000);
          } else if (!text.includes("successfully")) { // Check if the response text indicates an error
              document.getElementById("mqttStatusMessage").innerHTML = 
              '<span style="color: green;">&#10004; ' + text + '</span> <br> <span> Please unplug and plug your device!</span>';
              setTimeout(() => {
                window.location.href = "choice.html"; // Change to your desired page
            }, 5000);
          }
      }
  })
  .catch(error => {
      console.error("Error:", error.message); // Log any errors
      document.getElementById("mqttStatusMessage").innerHTML = '<span style="color: red;">&#10060; ' + error.message + '</span>';
  });
}

var sendMQTTBtn = document.getElementById("sendMQTTbtn");

sendMQTTBtn.onclick = function (e) {
  sendMQTT(e); // Pass the event object to the sendMQTT function
  console.log("iworke")
}



function fetchCurrentMQTTSettings() {
  fetch("http://multilogger.local/get-mqtt")
      .then(response => response.json()) // Parse the response as JSON
      .then(data => {
          document.getElementById("current-mqtt").innerText = `
              Broker: ${data.MQTT.BROKER}
              Port: ${data.MQTT.PORT}
              Username: ${data.MQTT.USERNAME}
              Password: ${data.MQTT.PWD}
              Topic: ${data.MQTT.TOPIC}
          `;
      })
      .catch(error => {
          console.error("Error fetching MQTT settings:", error);
          document.getElementById("current-mqtt").innerText = "Error loading MQTT settings.";
      });
}

document.getElementById("cn-mqtt").addEventListener("click", function() {
  fetch("http://multilogger.local/get-current-network")
      .then(response => response.json())
      .then(data => {
          document.getElementById("current").innerText = data.network;
      })
      .catch(error => {
          console.error("Error fetching network settings:", error);
          document.getElementById("current").innerText = "Error loading network settings.";
      });
});

document.getElementsByClassName("tablink")[3].addEventListener("click", fetchCurrentMQTTSettings);
