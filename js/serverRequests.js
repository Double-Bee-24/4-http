 import { createTableBody } from "./data_table.js";

export async function sendData(event, tbody, config) {
    const inputFields = tbody.querySelectorAll("input");
    const selectFields = tbody.querySelectorAll("select");
    let selectIndex = 0;

    if (event.keyCode === 13) {
        let incorrectInputs = 0;

        for (let i = 0; i < inputFields.length; i++) { // Make red border to empty input fields
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
            createTableBody(table, config, updatedData);
        }
    }
}

export async function getServerData(config) {
    try {
        const serverResponse = await fetch(config.apiUrl);
        const serverData = await serverResponse.json();

        return serverData;
    } catch (error) {
        console.log("Fetch error:", error);
    }
}

export async function changeData(event, table, config, row, id) {
    const inputFields = row.querySelectorAll("input");
    const selectFields = row.querySelectorAll("select");
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
            const url = `${config.apiUrl}/${id}`;

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

                        if (arrayElement.type === "number") {
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
                    method: "PUT",
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
            createTableBody(table, config, updatedData);
        }
    }
}

export async function deleteItem(itemId, table, config) {
    const url = `${config.apiUrl}/${itemId}`

    try {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const json = await response.json();
    console.log("Succesfully:", JSON.stringify(json));
    } catch (error) {
        console.error("Mistake:", error);
    }


    const updatedData = await getServerData(config);
    createTableBody(table, config, updatedData);
}