export const config1 = {
    parent: '#usersTable',
    columns: [
        { title: 'Ім’я', value: 'name' },
        { title: 'Прізвище', value: 'surname' },
        { title: 'Вік', value: (user) => getAge(user.birthday) },
        { title: 'Фото', value: (user) => `<img src="${user.avatar}" alt="${user.name} ${user.surname}"/>` }
    ],
    apiUrl: "https://mock-api.shpp.me/bbilokin/users"
};

export const config2 = {
    parent: '#productsTable',
    columns: [
        {
            title: 'Назва',
            value: 'title',
            input: { type: 'text' }
        },
        {
            title: 'Ціна',
            value: (product) => `${product.price} ${product.currency}`,
            input: [
                { type: 'number', name: 'price', label: 'Ціна' },
                { type: 'select', name: 'currency', label: 'Валюта', options: ['$', '€', '₴'], required: false }
            ]
        },
        {
            title: 'Колір',
            value: (product) => getColorLabel(product.color), 
            input: { type: 'color', name: 'color' }
        },
    ],
    apiUrl: "https://mock-api.shpp.me/bbilokin/products"
};

// Addition functions that provides correct work of configs
function getColorLabel(productColor) {
    const colorBlock = document.createElement("div");
    colorBlock.classList.add("color-block")
    colorBlock.style.backgroundColor = productColor;
    return colorBlock;
}

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