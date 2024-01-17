"use strict"
function DataTable(config, data) {
  const tableDiv = document.querySelector(config.parent);
  const table = document.createElement("table");
  tableDiv.appendChild(table);
  table.setAttribute("class","table");
  const initialId = getFirstId(data);
  
  createTitleRow(table, config);
  createMainRows(table, config, data, initialId);
  setupSortingEvents(table, users, config, initialId);
}
 
const config1 = {
  parent: '#usersTable',
  columns: [
    {title: 'Ім’я', value: 'name'},
    {title: 'Прізвище', value: 'surname'},
    {title: 'Вік', value: 'age'},
  ]
};
 
const users = [
  {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
  {id: 30051, name: 'Вася', surname: 'Васечкін', age: 15},
  {id: 30052, name: 'Ігор', surname: 'Ігоренко', age: 25},
  {id: 30053, name: 'Ольга', surname: 'Олійник', age: 30},
  {id: 30054, name: 'Михайло', surname: 'Михайлик', age: 18},
  {id: 30055, name: 'Ірина', surname: 'Іванова', age: 22},
  {id: 30056, name: 'Петро', surname: 'Петренко', age: 35},
  {id: 30057, name: 'Оксана', surname: 'Оксенчук', age: 28},
  {id: 30058, name: 'Андрій', surname: 'Андрійчук', age: 19},
  {id: 30059, name: 'Тетяна', surname: 'Тетянчук', age: 40},
  {id: 30060, name: 'Сергій', surname: 'Сергієнко', age: 32},
  {id: 30061, name: 'Наталія', surname: 'Наталюк', age: 29},
  {id: 30062, name: 'Дмитро', surname: 'Дмитренко', age: 24},
  {id: 30063, name: 'Людмила', surname: 'Людвіга', age: 27},
  {id: 30064, name: 'Максим', surname: 'Максимович', age: 31},
  {id: 30065, name: 'Галина', surname: 'Галенко', age: 23},
  {id: 30066, name: 'Євген', surname: 'Євгенчук', age: 26},
  {id: 30067, name: 'Катерина', surname: 'Катеринчук', age: 33},
  {id: 30068, name: 'Роман', surname: 'Романович', age: 17},
  {id: 30069, name: 'Анна', surname: 'Анненко', age: 20}
];


DataTable(config1, users);
DataTable(config1, users);

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
    th.classList.add(config.columns[i - 1].value);
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

function createMainRows(table, config, data, initialId) { // Create rows for table body
  let tbody = document.createElement("tbody");
  table.appendChild(tbody);

  // Create row
  for(let i = 0; i < data.length; i++){
    const tableRow = tbody.insertRow(i);

    const numberTd = document.createElement("td");
    const numberTdNode = document.createTextNode((data[i].id - initialId) + 1 ); // Calculation of numbers depending on first element id
    numberTd.appendChild(numberTdNode);
    tableRow.appendChild(numberTd);

    // Create sells
    for(let j = 1; j <= config.columns.length; j++){
      const td = document.createElement("td");
      const columnValue = config.columns[j - 1].value; // get value from config to use them like a key while creating node
      const node = document.createTextNode(data[i][columnValue]);
      td.appendChild(node);
      tableRow.appendChild(td);
    }   
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

    if(valueToCompare === "age" || valueToCompare === "id"){
      sortNumbers(data, image, valueToCompare);
    } else {
      sortStrings(data, image, valueToCompare);
    }
    
    console.log(data);
    createMainRows(table, config, data, initialId); // Rewrite body of the table
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