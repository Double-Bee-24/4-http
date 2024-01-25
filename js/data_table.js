import { setupSortingEvents } from "./sorting_function.js"

export async function DataTable(config) {
    const tableDiv = document.querySelector(config.parent);
    tableDiv.classList.add("parent")
    const table = document.createElement("table");

    createAddButton(tableDiv, config);
    tableDiv.appendChild(table);
    table.classList.add("table");

    const data = await getServerData(config);
    console.log(data.length + " length");

    createTableHead(table, config);
    createTableBody(table, config, data);
    // setupSortingEvents(table, data, config);
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
    const thisIndex = index;
    // console.log(tableDiv.querySelector(".input-row"));
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
                                console.log(options + " options");
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
                        // inputElement.addEventListener("focus", () => inputElement.style.border = "1px solid red");
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

async function sendData(event, tbody, config) {
    const inputFields = tbody.querySelectorAll("input");
    const selectFields = tbody.querySelectorAll("select");
    let selectIndex = 0;

    if (event.keyCode === 13) {
        let incorrectInputs = 0;

        for (let i = 0; i < inputFields.length; i++) { // Make red border to empty input fields
            console.log(inputFields[i].required);
            if (inputFields[i].value === "" && inputFields[i].required === true) { // 'type: file' is for images
                inputFields[i].style.outline = "2px solid red";
                incorrectInputs++;
            }
        }

        if (incorrectInputs === 0) {
            const url = config.apiUrl;

            // Gain data to send
            const data = {};
            const columns = config.columns;
            for (let i = 0; i < inputFields.length; i++) {
                const column = columns[i];
                const columnInput = column.input;

                if (Array.isArray(columnInput)) {
                    for (const arrayElement of columnInput) {
                        const columnName = arrayElement.name;

                        data[columnName] = inputFields[i].value;
                        if (arrayElement.type === "select") {
                            data[columnName] = selectFields[selectIndex++].value;
                        }

                        if (columnName === "price") {
                            data[columnName] = +inputFields[i].value;
                        }
                    }
                } else {
                    const columnName = columnInput.name || column.value;
                    data[columnName] = inputFields[i].value;

                    if (columnName === "avatar" && inputFields[i].value === "") { // Set default no-avatar image
                        data[columnName] = "../images/no-avatar.jpg";
                    }
                }
            }

            try {
                const response = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const json = await response.json();
                console.log("Succesfully:", JSON.stringify(json));
            } catch (error) {
                console.error("Mistake:", error);
            }

            const updatedData = await getServerData(config);
            const table = tbody.parentNode;
            // console.log(table + " parentNode")
            createTableBody(table, config, updatedData);
        }
    }
}

async function getServerData(config) {
    try {
        const serverResponse = await fetch(config.apiUrl);

        const serverData = await serverResponse.json();
        console.log(serverData);

        return serverData;
    } catch (error) {
        console.log("Fetch error: " + error);
    }
}

function createTableHead(table, config) {
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

function addArrowImg(cell) {
    const arrowUp = document.createElement("img");
    arrowUp.setAttribute("src", "images/arrow-up.png");
    arrowUp.classList.add("arrow-iamge")
    cell.appendChild(arrowUp);
}

function createTableBody(table, config, data) { // Create rows for table body
    if (table.querySelector("tbody") !== null) {
        table.querySelector("tbody").remove();
    }

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    const allUsersList = data.data;
    // Create row
    let rowNumber = 1;
    for (let row in allUsersList) {
        // console.log(row + " row");
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

                if (typeof columnValue === "function") {
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
        editButton.addEventListener("click", () => setInputRow(tableRow, config, allUsersList));

        tableRow.appendChild(actionCell);
    }
}

function setInputRow(row, config, allUsersList) {
    const cells = row.querySelectorAll("td");
    
    const rowNumber = cells[0].innerText;
    let objectIndex = 1;
    let actualObject;

    for(const key in allUsersList){
        if(objectIndex === +rowNumber){
            actualObject = allUsersList[key];
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
                                console.log(options + " options");
                                for (const option of options) {
                                    const optionElement = document.createElement("option");
                                    // optionElement.value = actualObject[column][value];
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
                            arrayElement.value = "fish";
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
                    inputElement.value = actualObject[column.value]  || actualObject[column.input.name];
                    console.log(actualObject[column.input.name]);
                    console.log(inputElement.value);
                    if(inputElement.type === "date"){

                    }
                }
                cell.appendChild(inputElement);
            }

        }
    }
}

async function deleteItem(itemId, table, config) {
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
            console.error('Error deleting item:', error);
        });

    const updatedData = await getServerData(config);

    createTableBody(table, config, updatedData);
}