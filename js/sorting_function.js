// Providing table data sorting
export function setupSortingEvents(table, data, config) {
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
        createTableBody(table, config, data); // Rewrite body of the table
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