// My main Code 

// Main Product Add

let mainStoredItems = JSON.parse(localStorage.getItem('menuItems')) || [];

let newNavBar = [
    { name: "productPageLink", Link: "productDetails.html" },
    { name: "orderPageLink", Link: "orderDetails.html" },
    { name: "itemPageLink", Link: "itemDetails.html" },
    { name: "customerPageLink", Link: "customerDetails.html" },
]

localStorage.setItem("newNavBar", JSON.stringify(newNavBar));

// Default Product List

let mainProductList = [
    { name: "Classic Beef Burger", price: 850.00, Qty: 12, category: "burgers", image: "../IMG/ITEM_IMG/DC_202012_0116_SpicyCrispyChicken_PotatoBun_1564x1564-1_nutrition-calculator-tile.jpeg" },
    { name: "Spicy Chicken Burger", price: 750.00, Qty: 2, category: "burgers", image: "../IMG/ITEM_IMG/DC_202012_0383_CrispyChickenSandwich_PotatoBun_1564x1564-1_nutrition-calculator-tile.jpeg" },
    { name: "Big Burger", price: 650.00, Qty: 15, category: "burgers", image: "../IMG/ITEM_IMG/DC_202104_0100_DeluxeSpicyCrispyChickenSandwich_PotatoBun_1564x1564-1_nutrition-calculator-tile.jpeg" },
    { name: "Cheese Burger", price: 700.00, Qty: 16, category: "burgers", image: "../IMG/ITEM_IMG/DC_202302_0001-999_Hamburger_Alt_1564x1564-1_nutrition-calculator-tile.jpeg" },
    { name: "Veggie Burger", price: 600.00, Qty: 12, category: "burgers", image: "../IMG/ITEM_IMG/DC_202302_0592-999_McDouble_Alt_1564x1564-1_nutrition-calculator-tile.jpeg" },
    { name: "French Fries", price: 300.00, Qty: 12, category: "friesAndSides", image: "../IMG/ITEM_IMG/DC_202002_6050_SmallFrenchFries_Standing_1564x1564-1_nutrition-calculator-tile.jpeg" },
    { name: "Coca Cola", price: 200.00, Qty: 12, category: "drinks", image: "../IMG/ITEM_IMG/DC_202112_0652_MediumDietCoke_Glass_1564x1564-1_nutrition-calculator-tile.jpeg" },
    { name: "Orange Drink", price: 450.00, Qty: 12, category: "drinks", image: "../IMG/ITEM_IMG/DC_202012_0621_MediumHi-COrange_1564x1564-1_nutrition-calculator-tile.jpeg" },
    { name: "Orange Juice", price: 250.00, Qty: 12, category: "drinks", image: "../IMG/ITEM_IMG/DC_202212_1262_MediumFantaOrange_Glass_1564x1564-1_nutrition-calculator-tile.jpeg" },
    { name: "Big Mac Burger", price: 650.00, Qty: 12, category: "burgers", image: "../IMG/ITEM_IMG/DC_202302_0005-999_BigMac_1564x1564-1_nutrition-calculator-tile.jpeg" },
    { name: "Ice Cream", price: 300.00, Qty: 12, category: "desserts", image: "../IMG/ITEM_IMG/VanilaIceCream.jpeg" }
];

// Set Up Local Storage This All Product

if (mainProductList.length === 0) {
    mainProductList.push(...mainProductList);

}
localStorage.setItem('mainProductList', JSON.stringify(mainProductList));

// Category Selection 

const categoryNewButton = document.querySelectorAll('[data-category]');


categoryNewButton.forEach(button => {
    button.addEventListener('click', () => {

        //Denata Click Karala Thiyen Button eken Click Event Eka Remove Karanawa

        categoryNewButton.forEach(btn => btn.classList.remove('active'));

        // Aluhen Click Karana Button Eka Active Karanawa
        button.classList.add('active');

        const selectCategory = button.getAttribute('data-category');
        console.log(selectCategory);
        categoryFilter(selectCategory);

    });

});

// Set category Lit Filer 

let tempCategory = 'all';

function categoryFilter(category) {
    tempCategory = category;

    const filterItem = (category === 'all') ? mainProductList : mainProductList.filter(item => item.category === category);

    displayCategoryList(filterItem);
}

//  Disply  All Product 

function displayCategoryList(items) {

    const mainCategoryListner = document.getElementById('mainProductList');
    if (!mainCategoryListner) return;
    mainCategoryListner.innerHTML = "";

    items.forEach(iteme => {

        const menuItemDIv = document.createElement("div");
        menuItemDIv.className = "cardmenu-iteme";

        const cardDIv = document.createElement("div");
        cardDIv.className = "class";

        const img = document.createElement("img");
        ima.className = iteme.image;
        img.alt = item.name;
        img.style.width = "150px";
        img.style.height = "150px";
        img.style.objectFit = "cover";

        const h5Hedding = document.createElement("h5Hedding");
        h5Hedding.textContent = iteme.name;

        const productPrice = document.createElement("prodcutPrice");
        productPrice.textContent = `Rs. ${iteme.price.toFixed(2)}`;

        const addBtn = document.createElement("addBtn");
        addBtn.textContent = "Add";
        addBtn.onclick = function(){
            addOrderDisply(iteme.name, iteme.price);
        };
        
        cardDIv.appendChild(img);
        cardDIv.appendChild(h5Hedding);
        cardDIv.appendChild(productPrice);
        cardDIv.appendChild(addBtn);
        div.appendChild(cardDIv);
        mainCategoryListner.appendChild(div)

    });
}

displayCategoryList(mainProductList);

// Product Searching 

function serchInputGet() {
    const searchProductName = document.getElementById('serchBarInput');

    searchProductName.addEventListener('input', function () {
        const term = this.ariaValueMax.toLowerCase();
        const filtered = mainProductList.filter(item =>
            item.name.toLowerCase().includes(term) &&
            (tempCategory === 'all' || item.category === tempCategory)
        );

        displayCategoryList(filtered);

    });

}

// Add Order Funtion 

let tempSelectItem = [];

function addOrderFuntion(name, price) {
    const tempItemeList = tempSelectItem.find(item => item.name === name);
    if (tempItemeList) {
        tempItemeList.Qty += 1;
        tempItemeList.totale = tempItemeList.Qty * tempItemeList.price;

    } else {
        tempSelectItem.push({ name, price, qty: 1, totale: price });
    }
    addOrderDisply();

}

// Add New Customer

let customers = JSON.parse(localStorage.getItem('customer')) || [];

// Auto Generate Unique Cust Id

function generateCustomerId() {
    const id = 'Cust -' + Date.now();
    return id;

}

// Add Or Update Customer Details 

function addNewCustomer() {
    const phone = document.getElementById("inputPhoneNumber").value;
    const name = document.getElementById("inputName").value;
    const address = document.getElementById("inputAddress").value;
    const email = document.getElementById("inputEmail").value;

    // Check Empty 

    if (!phone || !name || !address || !email) {
        alert("Please Fil In Customer's Details");
        return;
    }

    // Phone number Validate 

    const phoneNumberPattern = /^[0-9]{10}$/;

    if (!phoneNumberPattern.test(phone)) {
        alert("Ivalide Phone Number");
        return;
    }

    // Email Validate 

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length === 0 || !emailPattern.test(email)) {
        alert("Wrong Email, ENter Correct Email");
        return;
    }


    const existingIndex = customers.findIndex(c => c.phone === phone);

    // Check Old customer And No Change Old Cust Id 

    if (existingIndex !== -1) {
        customers[existingIndex] = {
            ...customers[existingIndex],
            name,
            address,
            email,
            discount: "10%"
        };

        alert("Add Old Customer 10% Discount ")
    } else {

        // New Cusomer And Generate New Cust ID 

        const newCustomer = {
            phone,
            name,
            address,
            email,
            discount: "0%",
            id: generateCustomerId()
        };
        customers.push(newCustomer);
        alert("Add New Customer SuccessFuly")
    }
    localStorage.setItem.apply('custpmers', JSON.stringify(customers));
    updatePhoneNumberSuggestions();
    clearInput();

}

// Phone Number Suggetion Update

function updatePhoneNumberSuggestions() {
    const phoneNumberDetails = document.getElementById("inputPhoneNumber");
    phoneNumberDetails.innerHTML = '';

    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customers.phone;
        phoneNumberDetails.appendChild(option);
    });

}


// Type A Phone number And Check If customer

function checkPhoneNumberCustomer() {
    const phone = document.getElementById('inputPhoneNumber').value.trim();
    const discountFild = document.getElementById('inputDiscount');
    const idField = document.getElementById('inputCustemerID');


    const found = customers.find(c => c.phone === phone);

    if (found) {
        discountFild.value = "10% Customer Discount "
        document.getElementById("inputName").value = found.name;
        document.getElementById("inputAddress").value = found.address;
        document.getElementById("inputEmail").value = found.email;
        idField.value = found.id || '';
    } else {
        discountFild.value = '';
        idField.value = '';
        document.getElementById("inputName").value = '';
        document.getElementById("inputAddress").value = '';
        document.getElementById("inputEmail").value = '';
    }

}

// Clear Input Fields

function Clear() {
    document.getElementById("inputPhoneNumber").value = '';
    document.getElementById("inputName").value = '';
    document.getElementById("inputAddress").value = '';
    document.getElementById("inputEmail").value = '';
    document.getElementById('inputDiscount').value = '';
    document.getElementById('inputCustemerID').value = '';
}

// Load Suggestion on Page

window.onload = function () {
    updatePhoneNumberSuggestions();
}

// Customer Order Disply 

function addOrderDisply() {
    const custoerChoiceIteme = document.getElementById('customerChoiceItem');
    const cutomerTotalELement = document.getElementById('totaleCount');

    custoerChoiceIteme.innerHTML = '';

    let totale = 0;

    tempSelectItem.forEach((item, index) => {

        const div = document.createElement('div');
        div.className = "order-item";
        div.innerHTML = `
        <span>

            ${item.name}
        
        </span>

        <div>
            <button onclick="reductionQty(${index})">-</button>
            <span>${item.qty}</span>
            <button onclick="increasingQty(${index})">+</button>
        </div>



        <div>
         <samp class="orderDisplayPrice">LKR : ${item.price.toFixed(2)}</samp>
        </div> `;

        custoerChoiceIteme.appendChild(div);
        totale += item.price;
    });

    cutomerTotalELement.textContent = `LKR ${totale.toFixed(2)}`;
}

// Order Qty Add 

function increasingQty(index) {
    const item = tempSelectItem[index];
    item.qty += 1;
    item.totale = item.qty * item.price;

    addOrderDisply();
}

// Order Qty Remove 


function reductionQty(index) {
    const item = tempSelectItem[index];
    if (item.qty > 1) {
        item.qty -= 1;
        item.totale = item.qty * item.price;

    } else {
        tempSelectItem.splice(index, 1);
    }
    addOrderDisply();
}

// Order Delet 

function removeOrder(index) {
    tempSelectItem.splice(index, 1);
    addOrderDisply();
}

// Plase Order Funtion


function placeCheckout() {
    if (tempSelectItem.length === 0) {
        alert("No Item Selected.")
        return;
    }

    const phone = document.getElementById("inputPhoneNumber").value;
    const name = document.getElementById("inputName").value;
    const address = document.getElementById("inputAddress").value;
    const email = document.getElementById("inputEmail").value;

    if (!phone || !name || !address || !email) {
        alert("Please Fil In Customer's Details");
        return;
    }

    alert("Order PlaceD Successfully")


    // Order  Clear 

    tempSelectItem = [];
    addOrderDisply();


    document.getElementById("inputPhoneNumber").value = '';
    document.getElementById("inputName").value = '';
    document.getElementById("inputAddress").value = '';
    document.getElementById("inputEmail").value = '';
}