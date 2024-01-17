# Data tables

Data tables is a Javascipt library for creating tables with particular configurations

## Installation

To get a copy of this repository, open terminal and enter next command:

```bash
git clone https://github.com/Double-Bee-24/3-data-tables.git

```

## Navigation

'images' directory contains pngs of up arrow and down arrow.

'js' - the actual directory with the library.

'styles' directory contains table styles document .
 

## About project

https://double-bee-24.github.io/3-data-tables/ - here you can see how the tables look like

This project is a JavaScript DataTable component that allows you to display and interact with tabular data. The DataTable is designed to be easily configurable and provides sorting functionality for each column.

## Features

- **Dynamic Table Creation:** The DataTable dynamically creates an HTML table based on the provided configuration and data.

- **Sorting Functionality:** Clicking on column headers triggers sorting, with arrow indicators showing the sorting direction.

## Usage

To use the DataTable component in your project, follow these steps:

1. Include the DataTable script in your HTML file.
2. Create a configuration object specifying the parent container and columns.
3. Prepare your data as an array of objects.
4. Call the `DataTable` function with the configuration and data.

Example:

```html
<script src="datatable.js"></script>

<script>
  const config = {
    parent: '#tableContainer',
    columns: [
      { title: 'Name', value: 'name' },
      { title: 'Surname', value: 'surname' },
      { title: 'Age', value: 'age' },
    ],
  };

  const data = [
    // Your data objects here
  ];

  DataTable(config, data);
</script>
```

## Contacts

bodya24102001@gmail.com
