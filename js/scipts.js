/**
 * File: scripts.js
 * Author: Saahir Monowar
 * Desc: Script for School-Portal-Dummy index.html. Saves dummy school and library data,
 * 	  	 and displays it onto a table. Also supports table-filtering by name.
 *       Additionally, allows clicking table entries on mobile for more details about
 *       that entry
 */


//Initialization
let studentData = JSON.parse(jsonDataSchool);
let libraryData = JSON.parse(jsonDataLibrary);
let pageMode = "StudentName"; //Default page view (Shows student information by default)
let pageData = studentData;

let main = document.querySelector("main");
let input = document.getElementById("filter-names");
let filterButton = document.getElementById("filter-names-button");
let toggleModeButton = document.getElementById("toggle-mode");
let tableTarget = document.querySelector("tbody");
let tableHeadTarget = document.querySelector("thead");
let failureTarget = document.getElementById("no-results-target");
filterButton.addEventListener("click", filter);
toggleModeButton.addEventListener("click", toggleMode);

let MOBILE_MAX_WIDTH = 930;
let mobileNotif = document.createElement("p");
mobileNotif.innerHTML = "*Note: Due to reduced screen width, the table has been simplified. Tap/click on an entry below to expand it for more information. Or click <a href='./old-webpage/old-index.html'>here</a> for the entire table (which may not fit on screen)"
mobileNotif.setAttribute("id", "mobile-notif");

let blurBackground = document.createElement("div");
blurBackground.setAttribute("id", "blur-background");
let entryExpansion = document.createElement("div");
entryExpansion.setAttribute("id", "entry-expansion");

// Handle window resizing with events (Display table differently if on mobile)
let pageView = isMobile();
addEventListener("resize", function() {
  if (pageView != isMobile()) {
    pageView = isMobile();
    displayTable();
  }
});

function isMobile() {
  return window.innerWidth < MOBILE_MAX_WIDTH;
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
 * Creates a popup on screen to display information in given entry.
 * Also creates event listener for clicks on blurred background
 * (to unexpand)
 */
function expand(entry) {
  main.insertBefore(blurBackground, mobileNotif);
  blurBackground.addEventListener("click", unexpand);
  main.insertBefore(entryExpansion, blurBackground);

  let properties = Object.keys(entry);
  for (let property of properties) {
    entryExpansion.innerHTML += `<p><strong>${property}:</strong> ${entry[property]}</p>`;
  }
}

/**
 * Reverses expansion changes (see expand())
 */
function unexpand() {
  main.removeChild(blurBackground);
  main.removeChild(entryExpansion);
  entryExpansion.innerHTML = "";
  blurBackground.removeEventListener("click", unexpand);
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
  if (isMobile()) {
    main.insertBefore(mobileNotif, document.getElementById("info-table"));
  } else {
    if (document.querySelector("#mobile-notif")) {
      main.removeChild(mobileNotif);
    }
    if (document.querySelector("#blur-background")) {
      unexpand();
    }
  }
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
