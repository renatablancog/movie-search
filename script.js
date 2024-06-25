const itemForm = document.getElementById('item-form'); //submitButton
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');

function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  //Validate input 
  if (newItem === '') {
    alert('Add an item please')
    return;
  }

  //Create list item 
  const list = document.createElement('li');
  list.appendChild(document.createTextNode(newItem));

  const button = createButton('remove-item btn-link text-red');
  list.appendChild(button);

  itemList.appendChild(list);
  itemInput.value = '';

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


//Event Listeners
itemForm.addEventListener('submit', addItem)