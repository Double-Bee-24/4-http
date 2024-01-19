"use strict"
async function DataTable(config) {
  const tableDiv = document.querySelector(config.parent);
  tableDiv.classList.add("parent")
  const table = document.createElement("table");
  tableDiv.appendChild(table);
  table.classList.add("table");

  const data = await getServerData(config);
  console.log(data.length + " length");

  createTitleRow(table, config);
  createMainRows(table, config, data);
  // setupSortingEvents(table, data, config);
}

const config1 = {
  parent: '#usersTable',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Вік', value: (user) => getAge(user.birthday) },
    { title: 'Фото', value: (user) => `<img src="${user.avatar}" alt="${user.name} ${user.surname}"/>` }
  ],
  apiUrl: "https://mock-api.shpp.me/bbilokin/users"
};

function getAge(age) {
  const millisecondsInMonth = (365.25 / 12) * 24 * 60 * 60 * 1000;
  const actualTime = Date.now();
  const dateOfBirth = Date.parse(age);
  const ageInMonths = Math.floor((actualTime - dateOfBirth) / millisecondsInMonth);
  let ageString;

  switch (ageInMonths) {
    case 0:
      ageString = "менше місяця";
      break;
    case 1:
      ageString = "1 місяць";
      break;
    case 2:
    case 3:
    case 4:
      ageString = `${ageInMonths} місяці`;
      break;
    default:
      ageString = `${ageInMonths} місяців`;
  }
  // return Date.parse(age);
  return ageString;
}

const config2 = {
  parent: '#productsTable',
  columns: [
    { title: 'Назва', value: 'title' },
    { title: 'Ціна', value: (product) => `${product.price} ${product.currency}` },
    { title: 'Колір', value: (product) => getColorLabel(product.color) },
  ],
  apiUrl: "https://mock-api.shpp.me/bbilokin/products"
};

function getColorLabel(productColor) {
  const colorBlock = document.createElement("div");
  colorBlock.classList.add("color-block")
  colorBlock.style.backgroundColor = productColor;
  return colorBlock;
}

DataTable(config1);
DataTable(config2);

async function getServerData(config) {
  try {
    const serverResponse = await fetch(config.apiUrl);

    const servereData = await serverResponse.json();
    console.log(servereData);

    return servereData;
  } catch (error) {
    console.log("Fetch error:", error);
  }
}

function createTitleRow(table, config) {
  let thead = document.createElement("thead");
  table.appendChild(thead);
  const titleRow = thead.insertRow(0);

  // Add symbol "№"
  const numberSymbolTh = document.createElement("th");
  const numberSymbolNode = document.createTextNode("№");
  numberSymbolTh.appendChild(numberSymbolNode);
  titleRow.appendChild(numberSymbolTh);
  numberSymbolTh.classList.add("id");

  addArrowImg(numberSymbolTh);

  for (let i = 1; i <= config.columns.length; i++) {
    const th = document.createElement("th");
    const node = document.createTextNode(config.columns[i - 1].title);
    th.appendChild(node);
    titleRow.appendChild(th);

    // alert(console.columnsTitle);
    if (config.columns[i - 1].title !== "Фото") {
      addArrowImg(th);
    }
  }

  // Add actions column
  const actionCell = document.createElement("th");
  actionCell.innerText = "Дії";
  titleRow.appendChild(actionCell);
  // numberSymbolTh.classList.add("id");
}

function getFirstId(data) {
  return data[0].id;
}

function addArrowImg(cell) {
  const arrowUp = document.createElement("img");
  arrowUp.setAttribute("src", "images/arrow-up.png");
  arrowUp.classList.add("arrow-iamge")
  cell.appendChild(arrowUp);
}

function createMainRows(table, config, data) { // Create rows for table body
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);
  const allUsersList = data.data;
  // Create row
  let rowNumber = 1;
  for (let row in allUsersList) {
    console.log(row + " row");
    const user = allUsersList[row];
    // Create number cell
    const tableRow = tbody.insertRow(rowNumber - 1);
    const numberTd = document.createElement("td");
    const numberTdNode = document.createTextNode(rowNumber);
    numberTd.appendChild(numberTdNode);
    tableRow.appendChild(numberTd);
    rowNumber++;
    // Create sells
    const columns = config.columns;
    for (let column of columns) {
      const td = document.createElement("td");
      const columnValue = column.value;
      const columnTitle = column.title;
      if (columnTitle !== "Фото") {

        if (typeof columnValue === 'function') {
          const value = columnValue(user);
          if (columnTitle === "Колір") {
            td.appendChild(value);
          } else {
            const node = document.createTextNode(value);
            td.appendChild(node);
          }
        } else {
          const node = document.createTextNode(user[columnValue]);
          td.appendChild(node);
        }
        tableRow.appendChild(td);
      } else {
        td.innerHTML = columnValue(user);
        tableRow.appendChild(td);
      }
    }

    // Create actions cell
    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    actionCell.append(deleteButton);
    deleteButton.innerText = "Видалити";
    deleteButton.onclick = function () { deleteItem(row, table, config, data) }

    tableRow.appendChild(actionCell);
  }
}

async function deleteItem(itemId, table, config, data) {
  // alert('Deleting item with id: ' + itemId);
  console.log(table.querySelector("tbody"))
  console.log("squirell");

  await fetch(`${config.apiUrl}/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Item deleted successfully:', data);
    })
    .catch(error => {
      console.error('Error deleting item: ' + error);
    });

  const updatedData = await getServerData(config);
  const tbody = table.querySelector("tbody");
  if (tbody !== undefined) {
    tbody.remove();
    // alert("aa");
  }

  createMainRows(table, config, updatedData);
}



// Providing table data sorting
function setupSortingEvents(table, data, config) {
  const titleCells = table.querySelectorAll("th");
  for (let i = 0; i < titleCells.length; i++) {
    titleCells[i].addEventListener("click", sort.bind(titleCells[i]));
  }

  function sort() {
    table.querySelector("tbody").remove();
    const image = this.querySelector("img");
    let valueToCompare = this.className;

    if (typeof +valueToCompare === "number") {
      sortNumbers(data, image, valueToCompare);
    } else {
      sortStrings(data, image, valueToCompare);
    }

    // console.log(data);
    createMainRows(table, config, data); // Rewrite body of the table
  }
}

function sortNumbers(data, image, valueToCompare) {
  const dataCopy = JSON.stringify(data); // Copy of an array for further comparison  
  data.sort((a, b) => a[valueToCompare] - b[valueToCompare]);
  image.setAttribute("src", "images/arrow-up.png");

  if (JSON.stringify(data) === dataCopy) { // Make reverse sort if it's already sorted
    data.sort((a, b) => b[valueToCompare] - a[valueToCompare]);
    image.setAttribute("src", "images/arrow-down.png");
  }
}

function sortStrings(data, image, valueToCompare) {
  const dataCopy = JSON.stringify(data); // Copy of an array for further comparison 
  data.sort((a, b) => a[valueToCompare].localeCompare(b[valueToCompare]));
  image.setAttribute("src", "images/arrow-up.png");

  if (JSON.stringify(data) === dataCopy) { // Make reverse sort if it's already sorted
    data.sort((a, b) => b[valueToCompare].localeCompare(a[valueToCompare]));
    image.setAttribute("src", "images/arrow-down.png");
  }
}