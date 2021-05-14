/**
 * File: scripts.js
 * Author: Saahir Monowar
 * Desc: Script for School-Portal-Dummy index.html. Saves dummy school and library data,
 * 		 and displays it onto a table. Also supports table-filtering by name.
 *     Soon to support responsiveness when switching to reduced/increased screen width
 */


//Initialization
let studentData = JSON.parse(jsonDataSchool);
let libraryData = JSON.parse(jsonDataLibrary);
let pageMode = "StudentName"; //Default page view (Shows student information by default)
let pageData = studentData;

let input = document.getElementById("filter-names");
let filterButton = document.getElementById("filter-names-button");
let toggleModeButton = document.getElementById("toggle-mode");
let tableTarget = document.querySelector("tbody");
let tableHeadTarget = document.querySelector("thead");
let failureTarget = document.getElementById("no-results-target");
filterButton.addEventListener("click", filter);
toggleModeButton.addEventListener("click", toggleMode);

// Handle window resizing with events (Display table differently if on mobile)
let width = window.innerWidth;
let pageView = isMobile();
addEventListener("resize", function() {
  width = window.innerWidth;
  if (pageView != isMobile()) {
    displayTable();
    pageView = isMobile();
  }
});

function isMobile() {
  return width < 840;
}

/**
 * Method filter(event):
 * obtains value in searchbox, passes it into search() function, then passes result into
 * displayTableBody() function to show the new, filtered information to the user
 * Returns: void
 */
function filter(event) {
  let filterText = input.value.toLowerCase().trim();
  let nameResults = search(pageData, pageMode, filterText);
  displayTableBody(nameResults);
}

/**
 * Method search(jsonData, propertyName, word):
 * searches the propertyName property in every object of the given array of objects
 * for the passed word
 * Returns:
 * array of objects with Names that have a substring of the given
 * word in it somewhere
 */
function search(jsonData, propertyName, word) {
  let matches = [];
  for (var i = 0; i < jsonData.length; i++) {
    let name = jsonData[i][propertyName].toLowerCase();
    if (name.indexOf(word) >= 0 || name.replace(" ", "").indexOf(word) >= 0) {
      //"First Last" || "FirstLast"
      matches.push(jsonData[i]);
    }
  }
  return matches;
}

/**
 * // TODO: expand() method creates a popup on screen to display all
 *          information in entry
 */
function expand(entry) {
  console.log("an entry was clicked");
  console.log(entry);
}

/**
 * Method displayTableBody(objectArray):
 * Displays information passed to function into a table inserted into the HTML.
 * If on mobile, also add event listeners to table rows to allow "expansion"
 * (Css hides all collumns except first two on mobile)
 * Returns: void
 */
function displayTableBody(objectArray) {
  if (objectArray.length == 0) {
    //If no succesful name matches
    failureTarget.innerHTML = '<h2 id="no-results-target">No results found</h2>';
    tableTarget.innerHTML = "";
  } else {
    //Otherwise, if atleast one name match was found
    let displayedResults = "";
    let properties = Object.keys(objectArray[0]);
    for (var i = 0; i < objectArray.length; i++) {
      let tableData = "<tr>";
      for (let j = 0; j < properties.length; j++) {
        let objectDetails = properties[j];
        tableData += `<td>${objectArray[i][objectDetails]}</td>`;
      }
      displayedResults += `${tableData}</tr>`;
    }
    failureTarget.innerHTML = '<h2 id="no-results-target"></h2>';
    tableTarget.innerHTML = displayedResults;

    // Turn table entries into buttons on mobile
    if (isMobile()) {
      // for (let entry of tableTarget.children) {
      //   entry.addEventListener("click", function() {
      //     expand(entry); //pass entry to expand() function
      //   });
      // }
      for (let i = 0; i < objectArray.length; i++) {
        let htmlRow = tableTarget.children[i];
        htmlRow.addEventListener("click", function() {
          expand(objectArray[i]); //pass entry to expand() function
        });
      }
    }
  }
}

/**
 * Method displayTableHead(objectArray):
 * Populates Table header with the names of every property of the first object
 * in the array of objects passed to the function
 * Returns: void
 */
function displayTableHead(objectArray) {
  let displayedResults = "<tr>";
  let properties = Object.keys(objectArray[0])
  for (let i = 0; i < properties.length; i++) {
    displayedResults += `<td>${properties[i]}</td>`;
  }
  displayedResults += "</tr>";
  tableHeadTarget.innerHTML = displayedResults;
}

/**
 * Wrapper function to display Table
 */
function displayTable(pagaData) {
  displayTableHead(pageData);
  displayTableBody(pageData);
}

/**
 * Method toggleMode(event):
 * Toggles page between displaying student information or librarby information
 * Returns: void
 */
function toggleMode(event) {
  let currentDatabase = document.getElementById("current-database");
  if(pageMode == "StudentName") {
    pageMode = "BookName";
    pageData = libraryData;
    currentDatabase.innerHTML = "Library Database";
    toggleModeButton.innerHTML = "Students";
    input.value = "";
    displayTable(libraryData)
  } else {
    pageMode = "StudentName";
    pageData = studentData;
    currentDatabase.innerHTML = "Student Database";
    toggleModeButton.innerHTML = "Library";
    input.value = "";
    displayTable(studentData);
  }
}

//Generate full table when page loads/scripts link
displayTable(studentData);
