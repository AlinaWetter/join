let collectedContact = [];
let initials = [];
let selectedCategory;
let prio;
let smallCirleColor = false;
let subtasks = [];
let subtaskStatus = [];

let contacts = [];
let categorys = [];
let category = [];

let tasks = [];

let task = {
  title: "",
  description: "",
  category: "",
  assigned_to: [],
  due_date: "",
  prio: "",
  subtasks: {
    name: [],
    status: [],
  },
  progress: "",
};


let newCategory;
let colorForNewCategory;
let required = true;
let initialsRenderd = false;

let currentProgress;


async function initAddTask() {
  await includePlusInit();
  saveCurrentUser();
  setProfilePicture();
  loadInfos();
  showCreateTaskBtn();
}

function loadInfos() {
  renderCategorys();
  renderContacts();
}


function changeProgress(progressColumn) {
  currentProgress = progressColumn;
}

/**
 * This function is used to change the height of a div and display its contents
 * if the height of a div was previously changed and you click on another,
 * the previous div is reduced again and the content is hidden.
 * The height of the clicked div is increased and the content is displayed
 *
 * @param {*} clicked - This is the id where a classlist should be changed
 * @param {*} notClicked - This is the id where a classlist should be changed
 * @param {*} visible - This is the id where the classlist "d-none" will removed
 * @param {*} notVisible - This is the id where the classlist "d-none" will added
 */

function pullDownMenu(clicked, notClicked, visible, notVisible) {
  let openMenu = document.getElementById(clicked).classList;
  if (openMenu == "dropdown-category-closed") {
    document.getElementById(clicked).classList.add("dropdown-category-open");
    document
      .getElementById(notClicked)
      .classList.remove("dropdown-category-open");
    document.getElementById(visible).classList.remove("d-none");
    document.getElementById(notVisible).classList.add("d-none");
    document.getElementById("initialsContainer").classList.add("d-none");
  } else {
    document.getElementById(clicked).classList.remove("dropdown-category-open");
    document.getElementById(visible).classList.add("d-none");
    document.getElementById(notVisible).classList.add("d-none");
    document.getElementById("initialsContainer").classList.remove("d-none");
  }
  if (clicked == "assingedTo") {
    switchContactIcons();
    renderInitials();
    initialsRenderd = false;
  }
}


function addTaskSetDate() {
  let today = new Date();
  let dateInput = document.getElementById('date');
  dateInput.value = today.toISOString().slice(0, 10);
}


function renderCategorys() {
  categoryContainer = document.getElementById("loadedCategorys");
  categoryContainer.innerHTML = "";
  for (let i = 0; i < categorys.length; i++) {
    let category = categorys[i].name;
    let categoryColor = categorys[i].color;
    categoryContainer.innerHTML += `
        <div class="dd-placeholder gray-hover" onclick="selectCategory('${category}', '${categoryColor}')">
            <div class="center">
                <div class="padding-17-right">${category}</div>
                <div class="category-color" style="background-color: ${categoryColor}"></div>
            </div>
        </div>`;
  }
}

/**
 * This function renders all available contact
 */
function renderContacts() {
  renderYouContact();
  contactContainer = document.getElementById("loadedContacts");
  contactContainer.innerHTML = "";

  for (let i = 0; i < contacts.length; i++) {
    let you = localStorage.getItem("currentUser");

    if (contacts[i]["email"] !== you) {
      let contactName = combineNames(contacts, i);
      let colorOfContact = contacts[i]["color"];
      contactContainer.innerHTML += `
        <div class="dd-placeholder gray-hover" onclick="selectedForTask('${contactName}', 'contactName${[
          i,
        ]}','${colorOfContact}')">
            <div>${contactName}</div>
            <div class="select-box center">
                <div id="contactName${[i]}"></div>
            </div>
        </div>`;
    }
  }
}

function renderYouContact() {
  let you = localStorage.getItem("currentUser");
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i]["email"] === you) {
      let contactName = combineNames(contacts, i);
      let color = contacts[i]["color"];
      renderYou(contactName, color);
    }
  }
}

function renderYou(contactName, colorOfContact) {
  let container = document.getElementById("selectYouContainer");
  container.innerHTML += `
    <div
      class="dd-placeholder gray-hover"
      id="youContact"
      onclick="selectedForTask('${contactName}', 'point','${colorOfContact}')"
    >
      <div>You</div>
      <div class="select-box center">
        <div id="point"></div>
      </div>
    </div>
  `;
}

function getColorFromSelectedContact(contacts, i) {
  document.documentElement.style.setProperty("--userColor", contacts[i].color);
}

function combineNames(contacts, i) {
  let firstname = contacts[i].firstname;
  let lastname = contacts[i].lastname;
  let contact = firstname + " " + lastname;
  return contact;
}

function selectCategory(category, categoryColor) {
  document.getElementById("chosenCategory").innerHTML = `
            <div class="center">
                <div class="padding-17-right">${category}</div>
                <div class="category-color" style="background-color: ${categoryColor};"></div>
            </div>`;
  selectedCategory = category;
  openOrClose = document.getElementById("category").classList[1];
  if (openOrClose == "dropdown-category-open") {
    pullDownMenu("category", "edTo", "moreCategorys", "moreContacts");
  }
}

function selectedForTask(selectedContact, selected, colorOfContact) {
  if (collectedContact.includes(selectedContact) == false) {
    collectedContact.push(selectedContact);
    addSelectedPoint(selected);
    manageInitials(selectedContact, colorOfContact);
    switchContactIcons();
  } else {
    contactToRemove = collectedContact.indexOf(selectedContact);
    collectedContact.splice(contactToRemove, 1);
    manageInitials(selectedContact, colorOfContact);
    document.getElementById(selected).classList.remove("selection-point");
    switchContactIcons();
  }
}

function addSelectedPoint(selected) {
  document.getElementById(selected).classList.add("selection-point");
}

function manageInitials(selectedContact, colorOfContact) {
  let initial = getFirstLetters(selectedContact);
  const exists = initials.some((obj) => obj.initial === initial);

  if (!exists) {
    initials.push({
      initial: initial,
      color: colorOfContact,
    });
    selectedContact = "";
  } else {
    const indexToRemove = initials.findIndex((obj) => obj.initial === initial);
    initials.splice(indexToRemove, 1);
    selectedContact = "";
  }
}

function switchContactIcons() {
  if (collectedContact.length == false || initialsRenderd == true) {
    document.getElementById("clearAddButtons").classList.add("d-none");
    document.getElementById("ddArrow").classList.remove("d-none");
    setTimeout(setAttribute, 200);
  } else {
    document.getElementById("clearAddButtons").classList.remove("d-none");
    document.getElementById("ddArrow").classList.add("d-none");
    document
      .getElementById("contactsToAssingContainer")
      .removeAttribute("onclick");
  }
}

function setAttribute() {
  document
    .getElementById("contactsToAssingContainer")
    .setAttribute(
      "onclick",
      "pullDownMenu('assingedTo', 'category', 'moreContacts', 'moreCategorys')"
    );
}

function getFirstLetters(name) {
  firstLetters = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
  return firstLetters;
}


function clearContacts() {
  let you = document.getElementById("point");
  if (you) {
    you.classList.remove("selection-point");
  }
  pullDownMenu("assingedTo", "category", "moreContacts", "moreCategorys");
  collectedContact = [];
  initials = [];
  switchContactIcons();
  renderContacts();
  renderInitials();
}

function addContacts() {
  initialsRenderd = true;
  switchContactIcons();
  renderInitials();
  pullDownMenu("assingedTo", "category", "moreContacts", "moreCategorys");
}

function renderInitials() {
  initialsContainer = document.getElementById("initialsContainer");
  initialsContainer.innerHTML = "";

  for (let i = 0; i < initials.length; i++) {
    initialsContainer.innerHTML += `
    <div style="background-color:${initials[i]["color"]
      }" class="initials" id="contactInitials${[i]}">${initials[i]["initial"]
      }</div>`;
  }
}

/**
 * @param {*} clicked
 * @param {*} notClicked
 * @param {*} alsoNotClicked
 */
function priority(clicked, notClicked, alsoNotClicked, img) {
  resetPrioButton(notClicked, alsoNotClicked);
  if (clicked == "prioHigh") {
    document.getElementById(
      clicked
    ).style = `background-color: rgb(236, 85, 32); color: white`;
    changeColor(img);
    prio = "urgent";
  }
  if (clicked == "prioMedium") {
    document.getElementById(
      clicked
    ).style = `background-color: rgb(243, 173, 50); color: white`;
    changeColor(img);
    prio = "medium";
  }
  if (clicked == "prioLow") {
    document.getElementById(
      clicked
    ).style = `background-color: rgb(147, 222, 70); color: white`;
    changeColor(img);
    prio = "low";
  }
}

function resetPrioButton(notClicked, alsoNotClicked) {
  document.getElementById(notClicked).style = ``;
  document.getElementById(alsoNotClicked).style = ``;
  document.getElementById("prioHighImg").src = `assets/img/prio_high.svg`;
  document.getElementById("prioMediumImg").src = `assets/img/prio_medium.svg`;
  document.getElementById("prioLowImg").src = `assets/img/prio_low.svg`;
}

function changeColor(img) {
  imgPath = document.getElementById(img);
  if (img == "prioHighImg") {
    imgPath.src = `assets/img/prio_high_white.svg`;
  }
  if (img == "prioMediumImg") {
    imgPath.src = `assets/img/prio_medium_white.svg`;
  }
  if (img == "prioLowImg") {
    imgPath.src = `assets/img/prio_low_white.svg`;
  }
}

function addSubtask() {
  let subtaskInput = document.getElementById("subtaskInput");
  if (subtaskInput.value.length > 0) {
    subtasks.push(subtaskInput.value);
    subtaskStatus.push(false);
    renderSubtasks();
    switchSubtaskIcons();
  }
}

function removeSubtask(i) {
  subtasks.splice(i, 1);
  subtaskStatus.splice(i, 1)
  renderSubtasks();
}

function renderSubtasks() {
  let subtaskContainer = document.getElementById("addedSubtasks");
  subtaskContainer.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    let setClass = getClass(i);
    subtaskContainer.innerHTML +=
      `<div class="sub-task">
          <div onclick="setStatus('selectboxSubtask${i}', ${i})" class="selectbox-subtask">
            <img class="subtaskDone ${setClass}" id="selectboxSubtask${i}" src="assets/img/create_subtask.png">
          </div>
          <div class="subtask-text">${subtasks[i]}</div>
            <img class="clear-input pointer delete-subtask" onclick="removeSubtask(${i}), ${i}" src="assets/img/Clear_task_input.png" alt="${subtasks[i]}">
        </div>
        `;
  }
}

/**
 * this function changes the class of the input field.
 * If you click in the input field, add a subtask or press cancel,
 * you will switch between 2 different views on the right side of the input field.
 */
function switchSubtaskIcons() {
  let addSubtask = document.getElementById("addSubtask");
  let createSubtask = document.getElementById("createSubtask");
  let subtaskInput = document.getElementById("subtaskInput");
  let createSubtaskClass = createSubtask.classList.value;
  let divClass = "d-none";

  if (createSubtaskClass.includes(divClass) == true) {
    subtaskInput.removeAttribute("onclick");
    createSubtask.classList.remove("d-none");
    addSubtask.classList.add("d-none");
    subtaskInput.focus();
  } else {
    subtaskInput.setAttribute("onclick", "switchSubtaskIcons()");
    createSubtask.classList.add("d-none");
    addSubtask.classList.remove("d-none");
    subtaskInput.blur();
    subtaskInput.value = "";
  }
}

function getClass(i) {
  if (subtaskStatus[i] == true) {
    return (setClass = "");
  } else {
    return (setClass = "d-none");
  }
}

function setStatus(divID, i) {
  if (subtaskStatus[i] == false) {
    document.getElementById(divID).classList.remove("d-none");
    subtaskStatus.splice(i, 1, true);
  } else {
    document.getElementById(divID).classList.add("d-none");
    subtaskStatus.splice(i, 1, false);
  }
}


function openCreateCategory() {
  document.getElementById("categoryPlaceholder").classList.add("d-none");
  document.getElementById("newCategoryContainer").classList.remove("d-none");
  document.getElementById("color-picker").classList.remove("d-none");
  pullDownMenu("category", "assingedTo", "moreCategorys", "moreContacts");
  getRandomColor();
}

function closeCreateCategory() {
  document.getElementById("categoryPlaceholder").classList.remove("d-none");
  document.getElementById("newCategoryContainer").classList.add("d-none");
  document.getElementById("color-picker").classList.add("d-none");
}

function addCategory() {
  categoryInputFiled = document.getElementById("categoryInput");
  newCategory = categoryInputFiled.value;
  if (categoryInputFiled.value.length > 0 && smallCirleColor) {
    closeCreateCategory();
    selectCategory(newCategory, colorForNewCategory);
    removeClassFromColorPicker();
    smallCirleColor = false;
  }
}

async function getRandomColor() {
  categoryInputFiled = document.getElementById("categoryInput");
  for (let index = 0; index < 6; index++) {
    generatedColor = await generateRandomColor();
    onclickColor = `selectedColor(#${generatedColor})`;
    colorCircle = document.getElementById("colorPickCircle" + index);
    colorCircle.style = `background-color: ${generatedColor}`;
    setOnclickForColorpicker(colorCircle, index);
  }
}

async function generateRandomColor() {
  let color = "#" + Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  while (r + g + b < (255 * 3) / 2) {
    color = "#" + Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
    r = parseInt(color.substring(1, 3), 16);
    g = parseInt(color.substring(3, 5), 16);
    b = parseInt(color.substring(5, 7), 16);
  }
  return color;
}

function setOnclickForColorpicker(colorCircle, index) {
  rgbColor = colorCircle.style["cssText"];
  i = rgbColor.length;
  onclickColor = rgbColor.slice(22, i - 2);
  colorCircle.setAttribute("onclick", `selectedColor(${onclickColor}, ${index})`);
}


function selectedColor(r, g, b, index) {
  removeClassFromColorPicker();
  smallCirleColor = true;
  // Der ausgewählten Farbkreis die Klasse 'choosenCategory' hinzufügen
  let selectedCircle = document.getElementById('colorPickCircle' + index);
  selectedCircle.classList.add('choosenCategory');

  colorForNewCategory = `rgb(${r}, ${g}, ${b})`;
}


function removeClassFromColorPicker() {
  // Alle Farbkreise abrufen
  let colorCircles = document.querySelectorAll('[id^="colorPickCircle"]');

  // Von allen Farbkreisen die Klasse 'choosenCategory' entfernen
  colorCircles.forEach((circle) => {
    circle.classList.remove('choosenCategory');
  });
}



async function saveNewCategory() {
  category = {
    name: `${newCategory}`,
    color: `${colorForNewCategory}`,
  };
  await pushCategoryInCategorys();
}

async function pushCategoryInCategorys() {
  i = categorys.length;
  categorys.splice(i, 0, category);
  jsonFromServer["categorys"] = categorys;
  renderCategorys();
  await saveJSONToServer();
}

function getTitle() {
  let title = document.getElementById("titleInput").value;
  if (title == "") {
    document.getElementById("titleReport").classList.remove("d-none");
    required = true;
  } else {
    required = false;
    document.getElementById("titleReport").classList.add("d-none");
    return title;
  }
}

function getDescription() {
  let description = document.getElementById("descriptionInput").value;
  if (description == "") {
    document.getElementById("descriptionReport").classList.remove("d-none");
    required = true;
  } else {
    required = false;
    document.getElementById("descriptionReport").classList.add("d-none");
    return description;
  }
}

function getCategory() {
  if (selectedCategory == undefined) {
    document.getElementById("categoryReport").classList.remove("d-none");
    required = true;
  } else {
    required = false;
    document.getElementById("categoryReport").classList.add("d-none");
    return selectedCategory;
  }
}

function getContact() {
  if (collectedContact == "") {
    document.getElementById("contactReport").classList.remove("d-none");
    required = true;
  } else {
    required = false;
    document.getElementById("contactReport").classList.add("d-none");
    return collectedContact;
  }
}

function getDate() {
  let chosenDate = document.getElementById("date").value;
  if (chosenDate == "") {
    document.getElementById("dateReport").classList.remove("d-none");
    required = true;
  } else {
    document.getElementById("dateReport").classList.add("d-none");
    required = false;
    return chosenDate;
  }
}


function getPrio() {
  if (prio == undefined) {
    document.getElementById("prioReport").classList.remove("d-none");
    required = true;
  } else {
    required = false;
    document.getElementById("prioReport").classList.add("d-none");
    return prio;
  }
}


function pushSubtask() {
  for (let i = 0; i < subtasks.length; i++) {
    task.subtasks.name.push(subtasks[i]) || [];
  }
}


function pushStatus() {
  for (let i = 0; i < subtaskStatus.length; i++) {
    task.subtasks.status.push(subtaskStatus[i]);
  }
}


function collectAllInfos() {

  task.title = getTitle();
  task.description = getDescription();
  task.category = getCategory();
  task.assigned_to = getContact();
  task.due_date = getDate();
  task.prio = getPrio();
  task.progress = currentProgress ? currentProgress : 'TODO';

  pushSubtask();
  pushStatus();

  if (collectedContact.length > 0 && task.category && task.title && task.description && task.assigned_to && task.due_date) {
    pushTaskInTasks();
    saveNewCategory();
  }
}

function closeAddTask() {
  pullDownMenu('assingedTo', 'category', 'moreContacts', 'moreCategorys');
  clearTaskFields();
  clearContacts();
}

function clearTaskFields() {
  let valuesOfInputs = getIdsOfInputFields();
  setPrioButtonsToDefault();
  clearValues(valuesOfInputs);
  task = {
    title: "",
    description: "",
    category: "",
    assigned_to: [],
    due_date: "",
    prio: "",
    subtasks: {
      name: [],
      status: [],
    },
    progress: "",
  };
}

function getIdsOfInputFields() {
  let titleField = document.getElementById("titleInput");
  let descriptionField = document.getElementById("descriptionInput");
  let chosenDateField = document.getElementById("date");
  let categoryField = document.getElementById("chosenCategory");
  let contactField = document.getElementById("initialsContainer");

  return {
    titleField,
    descriptionField,
    chosenDateField,
    categoryField,
    contactField,
  };
}

function setPrioButtonsToDefault() {
  let highPrio = document.getElementById("prioHigh");
  let midPrio = document.getElementById("prioMedium");
  let lowPrio = document.getElementById("prioLow");

  highPrio.style.background = "white";
  midPrio.style.background = "white";
  lowPrio.style.background = "white";

  document.getElementById("prioHighImg").src = `assets/img/prio_high.svg`;
  document.getElementById("prioMediumImg").src = `assets/img/prio_medium.svg`;
  document.getElementById("prioLowImg").src = `assets/img/prio_low.svg`;
}

function clearValues(valuesOfInputs) {
  subtasks = [];
  renderSubtasks();

  valuesOfInputs.titleField.value = ``;
  valuesOfInputs.descriptionField.value = ``;
  valuesOfInputs.chosenDateField.value = ``;
  valuesOfInputs.categoryField.innerHTML = `Select task category`;
  valuesOfInputs.categoryField.value = ``;
  valuesOfInputs.contactField.innerHTML = ``;
}

async function pushTaskInTasks() {
  if (required == false) {
    tasks.push(task);
    jsonFromServer["tasks"] = tasks;
    await saveJSONToServer();
    taskUploaded();
    // await backend.deleteItem("users");
  }
}


function showCreateTaskBtn() {
  if (window.location.href == 'http://127.0.0.1:5501/add_task.html' || window.location.href == 'https://gruppe-join-421.developerakademie.net/add_task.html') {
    document.getElementById('addTaskBtn').classList.remove('d-none')
  } else {
    document.getElementById('addTaskBtn').classList.add('d-none')
  }
}


function taskUploaded() {
  // Hier muss das Url noch dynamisch angepasst werden, erst wenn das Projekt fertig auf dem Server liegt
  if (window.location.href == 'http://127.0.0.1:5501/board.html' || window.location.href == 'https://gruppe-join-421.developerakademie.net/board.html') {

    closeAddTask();
    closeAddTaskWrapper();
    initBoard();

  } else {
    let popUpId = document.getElementById("successfulUpload");
    popUpId.classList.remove("d-none");
    popUpId.classList.add("popUp");

    setTimeout(function () {
      popUpId.innerHTML = `redirecting to the board...`;
      clearTaskFields();
    }, 500);

    setTimeout(function () {
      window.location.href = "board.html";
    }, 1000);
  }

}

function directToNewContact() {
  localStorage.setItem('inviteContact', true);
  window.location.href = 'contacts.html';
}


/**
 * This function is opening the addTask container
 */
function openAddTaskContainer(idx) {
  let greyBackground = document.getElementById("greyBackground");
  let addTaskPopUp = document.getElementById("addTaskWrapper");
  let profile = document.getElementById('userPicture');
  let addTaskBtn = document.getElementById("addTaskBtn");

  if (window.innerWidth < 1300) {

    greyBackground.classList.add("d-none");
    addTaskPopUp.classList.remove("slide-out");
    addTaskPopUp.classList.add("slide-in");
    addTaskPopUp.classList.remove("d-none");
    profile.classList.add("d-none");
    addTaskBtn.classList.remove("d-none");
  } else {
    greyBackground.classList.remove("d-none");
    addTaskPopUp.classList.remove("slide-out");
    addTaskPopUp.classList.add("slide-in");
    addTaskPopUp.classList.remove("d-none");
  }

  loadInfos();
  if (idx) {
    selectedForTask(combineNames(contacts, idx), `contactName${idx}`, contacts[idx]["color"]);
  }
  pullDownMenu('assingedTo', 'category', 'moreContacts', 'moreCategorys');
  addContacts();
}