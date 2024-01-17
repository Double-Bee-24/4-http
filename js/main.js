"use strict"
async function DataTable(config) {
  const tableDiv = document.querySelector(config.parent);
  tableDiv.classList.add("parent")
  const table = document.createElement("table");
  tableDiv.appendChild(table);
  table.classList.add("table");
  
  const data = await getServerData(config);
  console.log(data.length + " length");

  // console.log("fish");
  // console.log(data);
  // const initialId = getFirstId(data);
  createTitleRow(table, config);
  createMainRows(table, config, data);
  // setupSortingEvents(table, data, config);
}
 
const config1 = {
  parent: '#usersTable',
  columns: [
    // console.log(user);
    {title: 'Ім’я', value: 'name'},
    {title: 'Прізвище', value: 'surname'},
    {title: 'Вік', value: (user) => getAge(user.birthday)}, // функцію getAge вам потрібно створити
    {title: 'Фото', value: (user) => `<img src="${user.avatar}" alt="${user.name} ${user.surname}"/>`} 
  ],
  apiUrl: "https://mock-api.shpp.me/bbilokin/users"
};

function getAge(age){
  return age;
}

const config2 = {
  parent: '#productsTable',
  columns: [
    {title: 'Назва', value: 'title'},
    {title: 'Ціна', value: (product) => `${product.price} ${product.currency}`},
    {title: 'Колір', value: (product) => getColorLabel(product.color)}, // функцію getColorLabel вам потрібно створити
  ],
  apiUrl: "https://mock-api.shpp.me/bbilokin/products"
};

DataTable(config1);
// DataTable(config2);

async function getServerData (config) {
  try {
    const serverResponse = await fetch(config.apiUrl);

    const servereData = await serverResponse.json();
    console.log(servereData);
    console.log(servereData.data["1"]["name"] + " length");

    return servereData;
  } catch (error) {
    // console.log("Fetch error:", error);
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

  for(let i = 1; i <= config.columns.length; i++){
    const th = document.createElement("th");
    const node = document.createTextNode(config.columns[i - 1].title);
    th.appendChild(node);
    titleRow.appendChild(th);

    addArrowImg(th);
  }  
}

function getFirstId(data) {
  return data[0].id;
}

function addArrowImg(cell) {
  let arrowUp = document.createElement("img");
  arrowUp.setAttribute("src","images/arrow-up.png");
  cell.appendChild(arrowUp);
}

function createMainRows(table, config, data) { // Create rows for table body
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);
  const allUsersList = data.data;
  // Create row
  console.log(data.length + " length");
  let i = 0;
  for (let row in allUsersList) {
    const tableRow = tbody.insertRow(i);
    const numberTd = document.createElement("td");
    const numberTdNode = document.createTextNode(i + 1);
    numberTd.appendChild(numberTdNode);
    tableRow.appendChild(numberTd);
    
    // Create sells
    for(let cell in allUsersList[row]){
      console.log(allUsersList[row][cell]);
      const td = document.createElement("td");
      const columnValue = config.columns[cell].value;
      const node = document.createTextNode(allUsersList[row][columnValue]);
      td.appendChild(node);
      tableRow.appendChild(td);
    }
    i++; 
  }
}

// Providing table data sorting
function setupSortingEvents(table, data, config, initialId){
  const titleCells = table.querySelectorAll("th");
  for(let i = 0; i < titleCells.length; i++){
    titleCells[i].addEventListener("click", sort.bind(titleCells[i]));
  } 
  
  function sort() {
    table.querySelector("tbody").remove();
    const image = this.querySelector("img");
    let valueToCompare = this.className;

    if(typeof +valueToCompare === "number"){
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
  image.setAttribute("src","images/arrow-up.png");

  if(JSON.stringify(data) === dataCopy){ // Make reverse sort if it's already sorted
    data.sort((a, b) => b[valueToCompare] - a[valueToCompare]);
    image.setAttribute("src","images/arrow-down.png"); 
  }
}

function sortStrings(data, image, valueToCompare) {
  const dataCopy = JSON.stringify(data); // Copy of an array for further comparison 
  data.sort((a, b) => a[valueToCompare].localeCompare(b[valueToCompare]));
  image.setAttribute("src","images/arrow-up.png");

  if(JSON.stringify(data) === dataCopy){ // Make reverse sort if it's already sorted
    data.sort((a, b) => b[valueToCompare].localeCompare(a[valueToCompare]));
    image.setAttribute("src","images/arrow-down.png");  
  }
}