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
    addButton.addEventListener("click", () => addInputRow(tableDiv, config));
}

function addInputRow(tableDiv, config) {
    const tbody = tableDiv.querySelector("tbody");
    const inputRow = tbody.insertRow(0);

    const columns = config.columns;
    const numberCell = document.createElement("td");
    numberCell.innerText = "№";
    inputRow.append(numberCell);

    for (let column of columns) {
        const cell = document.createElement("td");
        cell.contentEditable = "true";
        cell.innerText = "Bob";
        const inputsList = column.input;
        console.log(JSON.stringify(inputsList));
        console.log("doubledoor");

        for(const inputElement in inputsList){
            const input = document.createElement("input");
            for (const inputValue in inputElement) {
                input[inputValue] = inputElement[inputValue];
            }
            cell.appendChild(input);
        }

        inputRow.append(cell);
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

function getFirstId(data) {
    return data[0].id;
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
        deleteButton.onclick = function () { deleteItem(row, table, config) }

        tableRow.appendChild(actionCell);
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
            console.log('Item deleted successfully: ' +  data);
        })
        .catch(error => {
            console.error('Error deleting item: ' + error);
        });

    const updatedData = await getServerData(config);

    createTableBody(table, config, updatedData);
}