let collectedContact = [];
let initials = [];
let selectedCategory;
let prio;
let subtasks = [];
let subtaskStatus = [];
let contacts = [];
let categorys = [];
let category = [];
let tasks = [];
let task = {
    "title": "",
    "description": "",
    "category": "",
    "assigned_to": [],
    "due_date": "",
    "prio": "",
    "subtasks": {
        "name": [],
        "status": []
    },
    "progress": ""
};
let newCategory;
let colorForNewCategory;
let required = true;
let initialsRenderd = false;

async function loadInfos() {
    await downloadFromServer();
    await includeHTML();
    // tasks = JSON.parse(backend.getItem('tasks'));
    tasks = jsonFromServer['tasks']
    // contacts = JSON.parse(backend.getItem('contacts'));
    contacts = jsonFromServer['contacts']
    // categorys = JSON.parse(backend.getItem('categorys'));
    categorys = jsonFromServer['categorys']
    renderCategorys();
    renderContacts();
    datePicker();
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
    if (openMenu == 'dropdown-category-closed') {
        document.getElementById(clicked).classList.add('dropdown-category-open');
        document.getElementById(notClicked).classList.remove('dropdown-category-open');
        document.getElementById(visible).classList.remove('d-none');
        document.getElementById(notVisible).classList.add('d-none');
        document.getElementById('initialsContainer').classList.add('d-none');
    } else {
        document.getElementById(clicked).classList.remove('dropdown-category-open');
        document.getElementById(visible).classList.add('d-none');
        document.getElementById(notVisible).classList.add('d-none');
        document.getElementById('initialsContainer').classList.remove('d-none');
    } if (clicked == 'assingedTo') {
        switchContactIcons();
        renderInitials();
        initialsRenderd = false;
    }
}


/**
 * This function shows a datepicker.
 * Source: https://github.com/qodesmith/datepicker
 */
function datePicker() {
    const picker = datepicker('#date', {
        startDay: 1,
        formatter: (input, date, instance) => {
            const value = date.toLocaleDateString()
            input.value = value // => '1/1/2099'
        }
    })
}


function renderCategorys() {
    categoryContainer = document.getElementById('loadedCategorys');
    categoryContainer.innerHTML = '';
    // categorys =jsonFromServer['categorys'];
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
    contactContainer = document.getElementById('loadedContacts');
    contactContainer.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let contact = (combineNames(contacts, i))
        contactContainer.innerHTML += `
        <div class="dd-placeholder gray-hover" onclick="selectedForTask('${contact}', 'contact${[i]}')">
            <div>${contact}</div>
            <div class="select-box center">
                <div id="contact${[i]}"></div>
            </div>
        </div>`;
    }
}


function combineNames(contacts, i) {
    let firstname = contacts[i].firstname;
    let lastname = contacts[i].lastname;
    let contact = firstname + ' ' + lastname;
    return contact;
}


function selectCategory(category, categoryColor) {
    document.getElementById('chosenCategory').innerHTML = `
            <div class="center">
                <div class="padding-17-right">${category}</div>
                <div class="category-color" style="background-color: ${categoryColor};"></div>
            </div>`
    selectedCategory = category;
    openOrClose = document.getElementById('category').classList[1];
    if (openOrClose == 'dropdown-category-open') {
        pullDownMenu('category', 'assingedTo', 'moreCategorys', 'moreContacts');
    }
}


function selectedForTask(selectedContact, selected) {
    if (collectedContact.includes(selectedContact) == false) {
        collectedContact.push(selectedContact);
        addSelectedPoint(selected);
        manageInitials(selectedContact);
        switchContactIcons();
    } else {
        contactToRemove = collectedContact.indexOf(selectedContact)
        collectedContact.splice(contactToRemove, 1);
        manageInitials(selectedContact);
        document.getElementById(selected).classList.remove('selection-point');
        switchContactIcons();
    }
}


function addSelectedPoint(selected) {
    document.getElementById(selected).classList.add('selection-point');
}


function manageInitials(selectedContact) {
    initial = getFirstLetters(selectedContact);
    if (initials.includes(initial) == false) {
        initials.push(initial);
        selectedContact = '';
    } else {
        initialToRemove = initials.indexOf(initial);
        initials.splice(initialToRemove, 1);
        selectedContact = '';
    }
}


function switchContactIcons() {
    if (collectedContact.length == false || initialsRenderd == true) {
        document.getElementById('clearAddButtons').classList.add('d-none');
        document.getElementById('ddArrow').classList.remove('d-none');
        setTimeout(setAttribute, 200)
    } else {
        document.getElementById('clearAddButtons').classList.remove('d-none');
        document.getElementById('ddArrow').classList.add('d-none');
        document.getElementById('contactsToAssingContainer').removeAttribute("onclick");
    }
}


function setAttribute() {
    document.getElementById('contactsToAssingContainer').setAttribute("onclick", "pullDownMenu('assingedTo', 'category', 'moreContacts', 'moreCategorys')");
}


function getFirstLetters(name) {
    firstLetters = name
        .split(' ')
        .map(word => word.charAt(0))
        .join('');
    return firstLetters;
}


function clearContacts() {
    document.getElementById('point').classList.remove('selection-point');
    pullDownMenu('assingedTo', 'category', 'moreContacts', 'moreCategorys');
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
    pullDownMenu('assingedTo', 'category', 'moreContacts', 'moreCategorys');
}


function renderInitials() {
    initialsContainer = document.getElementById('initialsContainer');
    initialsContainer.innerHTML = '';
    for (let i = 0; i < initials.length; i++) {
        initialsContainer.innerHTML += `
    <div class="initials" id="contactInitials${[i]}">${initials[i]}</div>`
    }
}

/**
 * @param {*} clicked 
 * @param {*} notClicked 
 * @param {*} alsoNotClicked 
 */
function priority(clicked, notClicked, alsoNotClicked, img) {
    resetPrioButton(notClicked, alsoNotClicked);
    if (clicked == 'prioHigh') {
        document.getElementById(clicked).style = `background-color: rgb(236, 85, 32);`
        changeColor(img);
        prio = 'high';
    } if (clicked == 'prioMedium') {
        document.getElementById(clicked).style = `background-color: rgb(243, 173, 50);`
        changeColor(img);
        prio = 'mid';
    } if (clicked == 'prioLow') {
        document.getElementById(clicked).style = `background-color: rgb(147, 222, 70);`
        changeColor(img);
        prio = 'low';
    }
}


function resetPrioButton(notClicked, alsoNotClicked) {
    document.getElementById(notClicked).style = ``;
    document.getElementById(alsoNotClicked).style = ``;
    document.getElementById('prioHighImg').src = `assets/img/prio_high.svg`;
    document.getElementById('prioMediumImg').src = `assets/img/prio_medium.svg`;
    document.getElementById('prioLowImg').src = `assets/img/prio_low.svg`;
}


function changeColor(img) {
    imgPath = document.getElementById(img)
    if (img == 'prioHighImg') {
        imgPath.src = `assets/img/prio_high_white.svg`
    } if (img == 'prioMediumImg') {
        imgPath.src = `assets/img/prio_medium_white.svg`
    } if (img == 'prioLowImg') {
        imgPath.src = `assets/img/prio_low_white.svg`
    }
}


function addSubtask() {
    let subtaskInput = document.getElementById('subtaskInput');
    subtasks.push(subtaskInput.value);
    subtaskStatus.push(false);
    renderSubtasks();
    switchSubtaskIcons();
}


function removeSubtask(i) {
    subtasks.splice(i, 1);
    renderSubtasks();
}


function renderSubtasks() {
    let subtaskContainer = document.getElementById('addedSubtasks');
    subtaskContainer.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        let setClass = getClass(i);
        subtaskContainer.innerHTML += `<div class="sub-task">
        <div onclick="setStatus('selectboxSubtask${i}', ${i})" class="selectbox-subtask">
        <img class="subtaskDone ${setClass}" id="selectboxSubtask${i}" src="assets/img/create_subtask.png">
        </div>
        <div onclick="removeSubtask(${i}), ${i}">${subtasks[i]}</div>
        </div>`
    }
}


/**
 * this function changes the class of the input field.
 * If you click in the input field, add a subtask or press cancel,
 * you will switch between 2 different views on the right side of the input field.
 */
function switchSubtaskIcons() {
    let addSubtask = document.getElementById('addSubtask');
    let createSubtask = document.getElementById('createSubtask');
    let subtaskInput = document.getElementById('subtaskInput');
    let createSubtaskClass = createSubtask.classList.value;
    let divClass = 'd-none';

    if (createSubtaskClass.includes(divClass) == true) {
        subtaskInput.removeAttribute("onclick");
        createSubtask.classList.remove('d-none');
        addSubtask.classList.add('d-none');
        subtaskInput.focus();
    } else {
        subtaskInput.setAttribute("onclick", "switchSubtaskIcons()");
        createSubtask.classList.add('d-none');
        addSubtask.classList.remove('d-none');
        subtaskInput.blur();
        subtaskInput.value = '';
    }
}


function getClass(i) {
    if (subtaskStatus[i] == true) {
        return setClass = '';
    } else {
        return setClass = 'd-none';
    }
}


function setStatus(divID, i) {
    if (subtaskStatus[i] == false) {
        document.getElementById(divID).classList.remove('d-none');
        subtaskStatus.splice(i, 1, true);
    } else {
        document.getElementById(divID).classList.add('d-none')
        subtaskStatus.splice(i, 1, false);
    }
}


function openCreateCategory() {
    document.getElementById('categoryPlaceholder').classList.add('d-none');
    document.getElementById('newCategoryContainer').classList.remove('d-none');
    document.getElementById('color-picker').classList.remove('d-none');
    pullDownMenu('category', 'assingedTo', 'moreCategorys', 'moreContacts');
    getRandomColor();
}


function closeCreateCategory() {
    document.getElementById('categoryPlaceholder').classList.remove('d-none');
    document.getElementById('newCategoryContainer').classList.add('d-none');
    document.getElementById('color-picker').classList.add('d-none');
}


function addCategory() {
    categoryInputFiled = document.getElementById('categoryInput');
    newCategory = categoryInputFiled.value;
    if (newCategory == undefined || colorForNewCategory == undefined) {
        if (newCategory == '') {
            alert('Please insert new Category')
        }
        if (colorForNewCategory == undefined) {
            alert('Please collect new Color')
        }
    } else {
        console.log('New category', newCategory);
        categoryInputFiled.value = '';
        closeCreateCategory();
        selectCategory(newCategory, colorForNewCategory);
        saveNewCategory();
    }

}


function getRandomColor() {
    for (let index = 0; index < 6; index++) {
        generatedColor = generateRandomColor();
        onclickColor = `selectedColor(#${generatedColor})`;
        colorCircle = document.getElementById('colorPickCircle' + index);
        colorCircle.style = `background-color: #${generatedColor}`;
        setOnclickForColorpicker(colorCircle);
    }
}


function generateRandomColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor
}


function setOnclickForColorpicker(colorCircle) {
    rgbColor = colorCircle.style['cssText'];
    i = rgbColor.length;
    onclickColor = rgbColor.slice(22, i - 2);
    colorCircle.setAttribute("onclick", `selectedColor(${onclickColor})`);
}


function selectedColor(r, g, b) {
    colorForNewCategory = `rgb(${r}, ${g}, ${b})`;
}


async function saveNewCategory() {
    category = {
        "name": `${newCategory}`,
        "color": `${colorForNewCategory}`
    };
    await pushCategoryInCategorys();
}


async function pushCategoryInCategorys() {
    i = categorys.length;
    categorys.splice(i, 0, category);
    jsonFromServer['categorys'] = categorys
    renderCategorys();
    await saveJSONToServer();
}


function getTitle() {
    let title = document.getElementById('titleInput').value;
    if (title == '') {
        document.getElementById('titleReport').classList.remove('d-none');
        required = true;
    } else {
        required = false;
        return title;
    }
}

function getDescription() {
    let description = document.getElementById('descriptionInput').value;
    if (description == '') {
        document.getElementById('descriptionReport').classList.remove('d-none');
        required = true;
    } else {
        required = false;
        return description;
    }
}


function getCategory() {
    if (selectedCategory == undefined) {
        document.getElementById('categoryReport').classList.remove('d-none');
        required = true;
    } else {
        required = false;
        return selectedCategory;
    }
}


function getContact() {
    if (collectedContact == '') {
        document.getElementById('contactReport').classList.remove('d-none');
        required = true;
    } else {
        required = false;
        return collectedContact;
    }
}


function getDate() {
    let chosenDate = document.getElementById('date').value;
    if (chosenDate == '') {
        document.getElementById('dateReport').classList.remove('d-none');
        required = true;
    }
    // if (chosenDate == ) {

    // } 
    else {
        required = false;
        return chosenDate;
    }
}


function getPrio() {
    if (prio == undefined) {
        document.getElementById('prioReport').classList.remove('d-none');
        required = true;
    } else {
        required = false;
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


async function collectAllInfos() {
    task.title = getTitle();
    task.description = getDescription();
    task.category = getCategory();
    task.assigned_to = getContact();
    task.due_date = getDate();
    task.prio = getPrio();
    pushSubtask();
    pushStatus();
    task.progress = 'TODO';
    pushTaskInTasks()
    clearTaskFields();
}

function clearTaskFields() {
    let title = document.getElementById('titleInput');
    let description = document.getElementById('descriptionInput');
    let chosenDate = document.getElementById('date');
    let category = document.getElementById('chosenCategory');
    let contact = document.getElementById('initialsContainer');

    let high = document.getElementById('prioHigh');
    let mid = document.getElementById('prioMedium');
    let low = document.getElementById('prioLow');

    high.style.background = 'white';
    mid.style.background = 'white';
    low.style.background = 'white';
    
    document.getElementById('prioHighImg').src = `assets/img/prio_high.svg`;
    document.getElementById('prioMediumImg').src = `assets/img/prio_medium.svg`;
    document.getElementById('prioLowImg').src = `assets/img/prio_low.svg`;

    subtasks = [];
    renderSubtasks()



    title.value = ``;
    description.value = ``;
    chosenDate.value = ``;
    category.innerHTML = `Select task category`;
    category.value = ``;
    contact.innerHTML = ``;


}


async function pushTaskInTasks() {
    if (required == false) {
        // i = tasks.length;
        // tasks.splice(i, 0, task);
        // await saveOnServer('tasks', tasks);
        tasks.push(task);
        jsonFromServer['tasks'] = tasks;
        await saveJSONToServer()
    }
    console.log(tasks)
}


// async function saveOnServer(key, item) {
//     itemAsString = JSON.stringify(item);
//     await backend.setItem(key, itemAsString);
// }