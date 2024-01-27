import {sendData, getServerData, changeData, deleteItem} from "./serverRequests.js";

export async function DataTable(config) {
    const tableDiv = document.querySelector(config.parent);
    tableDiv.classList.add("parent")
    const table = document.createElement("table");

    createAddButton(tableDiv, config);
    tableDiv.appendChild(table);
    table.classList.add("table");

    const data = await getServerData(config);

    createTableHead(table, config);
    createTableBody(table, config, data);
}

function createAddButton(tableDiv, config) {
    const addButton = document.createElement("button");
    addButton.innerText = "Додати";
    addButton.classList.add("add-button");
    tableDiv.appendChild(addButton);
    addButton.addEventListener("click", () => addInputRow(tableDiv, config, 0));
}

function addInputRow(tableDiv, config, index) {
    const tbody = tableDiv.querySelector("tbody");

    if (tableDiv.querySelector(".input-row") === null) {
        const inputRow = tbody.insertRow(index);
        inputRow.classList.add("input-row");

        const columns = config.columns;
        const numberCell = document.createElement("td");
        numberCell.innerText = "№";
        inputRow.append(numberCell);

        for (let column of columns) {
            const cell = document.createElement("td");
            const columnInput = column.input;

            // If we have more than one input - it is an array with objects in configurations
            if (Array.isArray(columnInput)) {
                for (let arrayElement of columnInput) {
                    // Create select element
                    if (arrayElement.type === "select") {
                        const selectElement = document.createElement("select");
                        for (const inputValue in arrayElement) {
                            if (inputValue === "options") {
                                const options = arrayElement[inputValue];

                                for (const option of options) {
                                    const optionElement = document.createElement("option");
                                    optionElement.value = option;
                                    optionElement.innerText = option;
                                    selectElement.appendChild(optionElement);
                                }
                            } else {
                                selectElement.setAttribute(inputValue, arrayElement[inputValue]);
                            }
                        }

                        cell.appendChild(selectElement);
                    } else {
                        // Create input element
                        const inputElement = document.createElement("input");
                        inputElement.addEventListener("keydown", () => sendData(event, tbody, config));
                        inputElement.addEventListener("input", () => setDefaultFrame(inputElement));
                        for (const inputValue in arrayElement) {
                            inputElement[inputValue] = arrayElement[inputValue];
                        }
                        cell.appendChild(inputElement);
                    }
                }
            } else { // If we have only one input - it is an object in configurations
                const inputElement = document.createElement("input");
                inputElement.addEventListener("keydown", () => sendData(event, tbody, config));
                inputElement.addEventListener("input", () => setDefaultFrame(inputElement));
                for (const inputValue in columnInput) {
                    inputElement[inputValue] = columnInput[inputValue];
                }
                cell.appendChild(inputElement);
            }

            inputRow.append(cell);
        }
    }
}

function setDefaultFrame(inputElement) {
    inputElement.style.outline = "initial";
}

function createTableHead(table, config) {
    let thead = document.createElement("thead");
    table.appendChild(thead);
    const titleRow = thead.insertRow(0);

    const numberSymbolTh = document.createElement("th"); // Add symbol "№"
    numberSymbolTh.innerText = "№";

    titleRow.appendChild(numberSymbolTh);
    numberSymbolTh.classList.add("id");

    config.columns.forEach(element => {
        const th = document.createElement("th");
        th.innerText = element.title;
        titleRow.appendChild(th);
    });

    const actionCell = document.createElement("th"); // Add actions column
    actionCell.innerText = "Дії";
    titleRow.appendChild(actionCell);
}

export function createTableBody(table, config, data) { // Create rows for table body
    if (table.querySelector("tbody") !== null) {
        table.querySelector("tbody").remove();
    }

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    const allUsersList = data.data;
    // Create row
    let rowNumber = 1;
    for (let row in allUsersList) {
 
        const user = allUsersList[row];
        // Create number cell
        const tableRow = tbody.insertRow(rowNumber - 1);
        const numberTd = document.createElement("td");
        numberTd.innerText = rowNumber
        tableRow.appendChild(numberTd);
        rowNumber++;
        // Create cells
        const columns = config.columns;
        for (let column of columns) {
            const td = document.createElement("td");
            const columnValue = column.value;
            const columnTitle = column.title;
            if (columnTitle !== "Фото") {

                if (typeof columnValue === "function") {
                    const value = columnValue(user);
                    if (columnTitle === "Колір") {
                        td.appendChild(value);
                    } else {
                        td.innerText = value
                    }
                } else {
                    td.innerText = user[columnValue];
                }
                tableRow.appendChild(td);
            } else {
                td.innerHTML = columnValue(user);
                tableRow.appendChild(td);
            }
        }

        // Create actions cell
        const actionCell = document.createElement("td");
        actionCell.classList.add("action-cell");

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        actionCell.append(deleteButton);
        deleteButton.innerText = "Видалити";
        deleteButton.onclick = function () { deleteItem(row, table, config) }

        const editButton = document.createElement("button");
        editButton.classList.add("delete-button");
        editButton.classList.add("edit-button");
        actionCell.append(editButton);
        editButton.innerText = "Редагувати";
        editButton.addEventListener("click", () => setInputRow(tableRow, config, allUsersList, table, editButton));

        tableRow.appendChild(actionCell);
    }
}

function setInputRow(row, config, allUsersList, table) {
    const cells = row.querySelectorAll("td");
    
    const rowNumber = cells[0].innerText;
    let objectIndex = 1;
    let actualObject;
    let actualObjectId;

    for(const key in allUsersList){
        if(objectIndex === +rowNumber){
            actualObject = allUsersList[key];
            actualObjectId = key;
            break;
        }
        objectIndex++;
    }

    if (row.querySelector("input") === null) {

        const columns = config.columns;

        let cellIndex = 1;

        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];
            const columnInput = column.input;
            let cell = cells[cellIndex++];

            // If we have more than one input - it is an array with objects in configurations
            if (Array.isArray(columnInput)) {
                for (let arrayElement of columnInput) {
                    // Create select element
                    if (arrayElement.type === "select") {
                        const selectElement = document.createElement("select");
                        for (const inputValue in arrayElement) {
                            if (inputValue === "options") {
                                const options = arrayElement[inputValue];

                                for (const option of options) {
                                    const optionElement = document.createElement("option");
                                    optionElement.innerText = option;
                                    selectElement.appendChild(optionElement);
                                }
                            } else {
                                selectElement.setAttribute(inputValue, arrayElement[inputValue]);
                            }
                        }

                        cell.appendChild(selectElement);
                    } else {
                        // Create input element
                        const inputElement = document.createElement("input");
                        inputElement.value = actualObject[arrayElement.name];
                        inputElement.type = arrayElement.type;

                        
                        // alert(row);
                        inputElement.addEventListener("keydown", () => changeData(event, table, config, row, actualObjectId));
                        inputElement.addEventListener("input", () => setDefaultFrame(inputElement));
                        cell.innerText = "";
                        cell.appendChild(inputElement);
                    }
                }
            } else { // If we have only one input - it is an object in configurations
                const inputElement = document.createElement("input");
                // alert(row);

                inputElement.addEventListener("keydown", () => changeData(event, table, config, row, actualObjectId));
                inputElement.addEventListener("input", () => setDefaultFrame(inputElement));

                for (const inputValue in columnInput) {
                    inputElement[inputValue] = columnInput[inputValue];
                    inputElement.value = actualObject[column.value]  || actualObject[column.input.name];
                    if(inputElement.type === "date"){
                        const date = actualObject[column.input.name].split("T")[0];
                        inputElement.value = date;
                    }
                }
                cell.innerText = "";
                cell.appendChild(inputElement);
            }

        }
    } 
}