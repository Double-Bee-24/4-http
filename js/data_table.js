import { sendData, getServerData, changeData, deleteItem } from "./server_requests.js";

export async function DataTable(config) {
    const tableDiv = document.querySelector(config.parent);
    tableDiv.classList.add("parent")
    const table = document.createElement("table");

    const data = await getServerData(config);
    createAddButton(tableDiv, config, data);
    tableDiv.appendChild(table);
    table.classList.add("table");

    createTableHead(table, config);
    createTableBody(table, config, data, tableDiv);
}

function createAddButton(tableDiv, config, data) {
    const addButton = document.createElement("button");
    addButton.innerText = "Додати";
    addButton.classList.add("add-button");
    tableDiv.appendChild(addButton);
    addButton.addEventListener("click", () => addInputRow(tableDiv, config, data));
}

function addInputRow(tableDiv, config, data, tableRow = 0) {
    const tbody = tableDiv.querySelector("tbody");
    const table = tableDiv.querySelector("table");

    let rowIndex;
    let actualUser;

    if (typeof tableRow === "number") {
        rowIndex = tableRow;
    } else {
        rowIndex = tableRow.querySelector("td").innerText; // take a number from number column
        actualUser = data.data[tableRow.id];
    }

    let inputRow = tableDiv.querySelector(".input-row");

    if (inputRow === null) {
        // tableRow.classList.add("hidden");

        inputRow = tbody.insertRow(rowIndex);
        inputRow.classList.add("input-row");
        // const actualObject = tableRow.id;

        const columns = config.columns;
        const numberCell = document.createElement("td");
        numberCell.innerText = rowIndex || "№";
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
                        inputElement.addEventListener("input", () => setDefaultFrame(inputElement));

                        if (actualUser) {
                            inputElement.value = actualUser[arrayElement.name];
                            inputElement.addEventListener("keydown",
                                () => changeData(event, table, config, inputRow, tableRow.id, tableDiv));
                        } else {
                            inputElement.addEventListener("keydown",
                                () => sendData(event, tbody, config, tableDiv));
                        }

                        for (const inputValue in arrayElement) {
                            inputElement[inputValue] = arrayElement[inputValue];
                        }
                        cell.appendChild(inputElement);
                    }
                }
            } else { // If we have only one input - it is an object in configurations
                const inputElement = document.createElement("input");
                inputElement.addEventListener("input", () => setDefaultFrame(inputElement));

                if (actualUser) { // If we need to edit an existing row
                    inputElement.value = actualUser[column.value] || actualUser[column.input.name];
                    if (inputElement.type === "date") {
                        const date = actualUser[column.input.name].split("T")[0];
                        inputElement.value = date;
                    }
                    inputElement.addEventListener("keydown",
                        () => changeData(event, table, config, inputRow, tableRow.id, tableDiv));
                } else {
                    inputElement.value = "";
                    inputElement.addEventListener("keydown",
                        () => sendData(event, tbody, config, tableDiv));
                }

                for (const inputValue in columnInput) {
                    inputElement[inputValue] = columnInput[inputValue];
                }
                cell.appendChild(inputElement);
            }

            inputRow.append(cell);
        }
    } else {
        inputRow.remove();
        // tableRow.classList.remove("hidden");
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

export function createTableBody(table, config, data, tableDiv) { // Create rows for table body
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
        tableRow.id = row;
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
        deleteButton.onclick = function () { deleteItem(row, table, config, tableDiv) }

        const editButton = document.createElement("button");
        editButton.classList.add("delete-button");
        editButton.classList.add("edit-button");
        actionCell.append(editButton);
        editButton.innerText = "Редагувати";
        // editButton.addEventListener("click", () => setInputRow(tableRow, config, allUsersList, table, editButton));
        editButton.addEventListener("click", () => addInputRow(tableDiv, config, data, tableRow));

        tableRow.appendChild(actionCell);
    }
}