const itemForm = document.getElementById('item-form'); //submitButton
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function addItemForm(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  //Validate input
  if (newItem === '') {
    alert('Add an item please');
    return;
  }

  addItemToDOM(newItem);
  addItemToLocalStorage(newItem);
  //Hide filter and clear btn
  checkUI();
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  }
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    //Remove from DOM
    item.remove();
    //Remove from local storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

function removeItemFromStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  // console.log(itemsFromStorage); ["milk","cheese","eggs",]
  const filterFromStorage = itemsFromStorage.filter(
    (element) => element !== item
  );
  // console.log(filterFromStorage);
  localStorage.setItem('items', JSON.stringify(filterFromStorage));
}

function removeList() {
  if (confirm('Are you sure?')) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }
  }
  localStorage.clear();
  checkUI();
}

function checkUI() {
  //selecting items <li> every time we add an item
  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }
  // console.log(items);
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    // console.log(itemName);
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function addItemToDOM(item) {
  //Create list item
  const list = document.createElement('li');
  list.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  list.appendChild(button);

  //Append to the DOM
  itemList.appendChild(list);
  itemInput.value = '';
}

function addItemToLocalStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);

  //Convert to JSON and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

//Initialize App
function init() {
  //Event Listeners
  itemForm.addEventListener('submit', addItemForm);
  itemList.addEventListener('click', onClickItem); //event delegation to the li elements
  clearBtn.addEventListener('click', removeList);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  // //As soon as page loads (only once)
  // checkUI();
}

init();
