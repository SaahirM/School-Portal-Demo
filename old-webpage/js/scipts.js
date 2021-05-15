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
 * Method displayTableBody(objectArray):
 * Displays information passed to function into a table inserted into the HTML
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
    for (var i = 0; i < objectArray.length; i++) {
      let tableData = "<tr>";
      for (var objectDetails in objectArray[i]) {
        tableData += `<td>${objectArray[i][objectDetails]}</td>`;
      }
      displayedResults += `${tableData}</tr>`;
    }
    failureTarget.innerHTML = '<h2 id="no-results-target"></h2>';
    tableTarget.innerHTML = displayedResults;
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
    displayTableHead(libraryData);
    displayTableBody(libraryData);
  } else {
    pageMode = "StudentName";
    pageData = studentData;
    currentDatabase.innerHTML = "Student Database";
    toggleModeButton.innerHTML = "Library";
    input.value = "";
    displayTableHead(studentData);
    displayTableBody(studentData);
  }
}

//Generate full table when page loads/scripts link
displayTableHead(studentData);
displayTableBody(studentData);