// ================================
// ✅✅✅ Load customers safely from localStorage 
let customers = [];
try {
  customers = JSON.parse(localStorage.getItem('customers')) || [];
} catch (e) {
  customers = [];
  console.warn("Corrupted customer data in localStorage");
}

// ✅✅✅ Temp selected items
let tempSelectItem = [];

// ✅✅✅ Temp customer holder
let tempCustomer = null;

// ✅✅✅ Fixed: localStorage NavBar values should use lowercase key 'link'
let newNavBar = [
  { name: "productPageLink", link: "productDetails.html" },
  { name: "orderPageLink", link: "orderDetails.html" },
  { name: "itemPageLink", link: "itemDetails.html" },
  { name: "customerPageLink", link: "customerDetails.html" },
];
localStorage.setItem("newNavBar", JSON.stringify(newNavBar));

// ✅ Default Product List
let mainProductList = [
  { name: "Classic Beef Burger", price: 850.00, Qty: 12, category: "burgers", image: "" },
  { name: "Spicy Chicken Burger", price: 750.00, Qty: 2, category: "burgers", image: "" },
  { name: "Big Burger", price: 650.00, Qty: 15, category: "burgers", image: "" },
  { name: "Cheese Burger", price: 700.00, Qty: 16, category: "burgers", image: "" },
  { name: "Veggie Burger", price: 600.00, Qty: 12, category: "burgers", image: "" },
  { name: "French Fries", price: 300.00, Qty: 12, category: "friesAndSides", image: "" },
  { name: "Coca Cola", price: 200.00, Qty: 12, category: "drinks", image: "" },
  { name: "Orange Drink", price: 450.00, Qty: 12, category: "drinks", image: "" },
  { name: "Orange Juice", price: 250.00, Qty: 12, category: "drinks", image: "" },
  { name: "Big Mac Burger", price: 650.00, Qty: 12, category: "burgers", image: "" },
  { name: "Ice Cream", price: 300.00, Qty: 12, category: "desserts", image: "" }
];
localStorage.setItem('mainProductList', JSON.stringify(mainProductList));

// ================================
// Utility function to generate unique Customer ID
function generateCustomerId() {
  return 'CUST-' + Date.now();
}

// Utility function to generate Order details (date & id)
function generateOrderDetails() {
  const orderDate = document.getElementById("order_date");
  const orderId = document.getElementById("order_id");
  const today = new Date();
  if(orderDate) orderDate.textContent = today.toLocaleDateString('en-GB');
  if(orderId) orderId.textContent = 'ORD-' + today.getTime();
}

// Check if customer has any orders (returns boolean)
function hasOrder(customerId) {
  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem('orders')) || [];
  } catch {
    orders = [];
  }
  return orders.some(order => order.customerId === customerId);
}

// ================================
// Filter by category buttons (assuming buttons have data-category attribute)
let tempCategory = 'all';
document.querySelectorAll('[data-category]').forEach(button => {
  button.addEventListener('click', () => {
    tempCategory = button.getAttribute('data-category');
    document.querySelectorAll('[data-category]').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const list = tempCategory === 'all' ? mainProductList : mainProductList.filter(p => p.category === tempCategory);
    displayCategoryList(list);
  });
});

// Search functionality
const searchBarInput = document.getElementById('searchBarInput');
if(searchBarInput) {
  searchBarInput.addEventListener('input', function () {
    const term = this.value.toLowerCase();
    const filtered = mainProductList.filter(item =>
      item.name.toLowerCase().includes(term) &&
      (tempCategory === 'all' || item.category === tempCategory));
    displayCategoryList(filtered);
  });
}

// ================================
// Show products in UI
function displayCategoryList(items) {
  const container = document.getElementById('mainProductList');
  if (!container) return;
  container.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = "cardmenu-iteme";
    div.style = "width:180px;border:1px solid #ddd;padding:10px;border-radius:6px;text-align:center;cursor:pointer";
    div.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}" style="width:150px;height:150px;object-fit:cover;" />
      <h5>${item.name}</h5>
      <p>Rs. ${item.price.toFixed(2)}</p>
      <button class="btn btn-primary btn-sm" type="button" onclick="addOrderFunction('${item.name}', ${item.price})">Add</button>`;
    container.appendChild(div);
  });
}

// ================================
// Add product to order list
function addOrderFunction(name, price) {
  const existing = tempSelectItem.find(i => i.name === name);
  if (existing) existing.qty++;
  else tempSelectItem.push({ name, price, qty: 1 });
  addOrderDisply();
}

// Increase quantity of an item
function increasingQty(index) {
  tempSelectItem[index].qty++;
  addOrderDisply();
}

// Reduce quantity of an item or remove
function reductionQty(index) {
  if (tempSelectItem[index].qty > 1) tempSelectItem[index].qty--;
  else tempSelectItem.splice(index, 1);
  addOrderDisply();
}

// ================================
// Display order list and total price + discount
function addOrderDisply() {
  const container = document.getElementById('customerChoiceItem');
  const totalEl = document.getElementById('totalCount');
  if (!container || !totalEl) return;

  container.innerHTML = '';

  let total = 0;
  tempSelectItem.forEach((item, i) => {
    const qty = isNaN(item.qty) ? 0 : item.qty;
    total += item.price * qty;
    const div = document.createElement('div');
    div.className = "order-item";
    div.style = "display:flex;justify-content:space-between;margin-bottom:8px";
    div.innerHTML = `
      <span>${item.name}</span>
      <div>
        <button class="btn btn-danger btn-sm" onclick="reductionQty(${i})">-</button>
        <span style="margin:0 8px">${qty}</span>
        <button class="btn btn-success btn-sm" onclick="increasingQty(${i})">+</button>
      </div>
      <span>LKR ${(item.price * qty).toFixed(2)}</span>`;
    container.appendChild(div);
  });

  const discountPercent = getDiscountPercent();
  const discountAmount = total * (discountPercent / 100);
  const finalPrice = total - discountAmount;

  totalEl.innerHTML = discountPercent > 0 ?
    `Total: LKR ${total.toFixed(2)}<br>Discount: ${discountPercent}%<br>Price: LKR ${finalPrice.toFixed(2)}` :
    `Total: LKR ${total.toFixed(2)}`;
}

// ================================
// Get discount percent from input, validated
function getDiscountPercent() {
  const discountField = document.getElementById('inputDiscount');
  if(!discountField) return 0;
  let str = discountField.value.trim();
  if (str.endsWith('%')) str = str.slice(0, -1);
  let num = parseFloat(str);
  if (isNaN(num) || num < 0) num = 0;
  return num;
}

// ================================
// Check phone number, fill customer data, control discount input disabled for old customers with orders
function checkPhoneNumberCustomer() {
  const phone = document.getElementById('inputPhoneNumber').value.trim();
  const discountField = document.getElementById('inputDiscount');
  const idField = document.getElementById('inputCustomerID');

  if (!phone) {
    document.getElementById('inputName').value = '';
    document.getElementById('inputAddress').value = '';
    document.getElementById('inputEmail').value = '';
    if(idField) idField.value = '';
    if(discountField) {
      discountField.value = '';
      discountField.disabled = false;  // manual discount allowed for new customer
    }
    addOrderDisply();
    return;
  }

  const customer = customers.find(c => c.phone === phone);

  if (customer) {
    document.getElementById('inputName').value = customer.name;
    document.getElementById('inputAddress').value = customer.address;
    document.getElementById('inputEmail').value = customer.email;
    if(idField) idField.value = customer.id;

    if (hasOrder(customer.id)) {
      // Old customer with orders - discount fixed 10%, no manual edit
      if(discountField) {
        discountField.value = "10";
        discountField.disabled = true;
      }
    } else {
      // Customer exists but no orders yet - manual discount allowed
      if(discountField) {
        discountField.value = customer.discount ? customer.discount.replace('%','') : '';
        discountField.disabled = false;
      }
    }
  } else {
    // New customer - manual discount allowed
    document.getElementById('inputName').value = '';
    document.getElementById('inputAddress').value = '';
    document.getElementById('inputEmail').value = '';
    if(idField) idField.value = generateCustomerId();
    if(discountField) {
      discountField.value = '';
      discountField.disabled = false;
    }
  }
  addOrderDisply();
}

// ================================
// Add new customer temporarily (triggered by Add Customer button)
function addNewCustomer() {
  const phone = document.getElementById("inputPhoneNumber").value.trim();
  const name = document.getElementById("inputName").value.trim();
  const address = document.getElementById("inputAddress").value.trim();
  const email = document.getElementById("inputEmail").value.trim();
  let discount = document.getElementById("inputDiscount").value.trim();

  if (!phone || !name || !address || !email) {
    alert("Please fill all fields.");
    return;
  }

  const phoneNumberPattern = /^[0-9]{10}$/;
  if (!phoneNumberPattern.test(phone)) {
    alert("Invalid Phone Number");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Invalid Email");
    return;
  }

  if (discount && !discount.endsWith('%')) discount += '%';
  if (!discount) discount = "0%";

  // Prevent adding temp customer if phone already exists
  if (customers.find(c => c.phone === phone)) {
    alert("Customer already exists. Please select existing customer.");
    return;
  }

  tempCustomer = {
    id: generateCustomerId(),
    phone,
    name,
    address,
    email,
    discount
  };

  alert("Customer added temporarily. Confirm order to save permanently.");
  renderTempCustomer();
}

// ================================
// Render temporary customer list (only one temp customer at a time)
function renderTempCustomer() {
  const tempList = document.getElementById('tempCustomerList');
  if (!tempList) return;

  tempList.innerHTML = '';
  if (tempCustomer) {
    const li = document.createElement('li');
    li.textContent = `${tempCustomer.name} - ${tempCustomer.phone}`;
    li.style.padding = "5px 10px";
    li.style.border = "1px solid #ddd";
    li.style.marginTop = "5px";
    tempList.appendChild(li);
  }
}

// ================================
// Clear input fields and temp data
function Clear() {
  document.getElementById("inputPhoneNumber").value = '';
  document.getElementById("inputName").value = '';
  document.getElementById("inputAddress").value = '';
  document.getElementById("inputEmail").value = '';
  const discountField = document.getElementById("inputDiscount");
  if(discountField) {
    discountField.value = '';
    discountField.disabled = false;
  }
  document.getElementById("inputCustomerID").value = '';
  tempCustomer = null;
  renderTempCustomer();
  renderCustomerList();
}

// ================================
// Place the order and save to localStorage, save customer if new
function placeCheckout() {
  if (tempSelectItem.length === 0) {
    alert("No items selected.");
    return;
  }

  const phone = document.getElementById("inputPhoneNumber").value.trim();
  const name = document.getElementById("inputName").value.trim();
  const address = document.getElementById("inputAddress").value.trim();
  const email = document.getElementById("inputEmail").value.trim();
  const discountPercent = getDiscountPercent();

  if (!phone || !name || !address || !email) {
    alert("Please complete customer details.");
    return;
  }

  let total = 0;
  tempSelectItem.forEach(i => total += i.price * i.qty);
  const finalPrice = total - total * (discountPercent / 100);

  if (!confirm(`Confirm order?\nTotal: LKR ${total.toFixed(2)}\nDiscount: ${discountPercent}%\nPrice: LKR ${finalPrice.toFixed(2)}`)) {
    return;
  }

  // Save new customer permanently if not exists
  if (!customers.some(c => c.phone === phone)) {
    const newCustomer = {
      id: generateCustomerId(),
      phone,
      name,
      address,
      email,
      discount: discountPercent + '%'
    };
    customers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(customers));
    updatePhoneNumberSuggestions();
    renderCustomerList();
  }

  const orderId = document.getElementById("order_id") ? document.getElementById("order_id").textContent : '';
  const customerId = document.getElementById("inputCustomerID").value;

  const order = {
    orderId,
    customerId,
    customerName: name,
    customerPhone: phone,
    customerAddress: address,
    customerEmail: email,
    items: [...tempSelectItem],
    discountPercent,
    totalAmount: total,
    finalPrice,
    orderDate: new Date().toISOString(),
  };

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  alert("Order placed!");
  tempSelectItem = [];
  addOrderDisply();
  Clear();
  generateOrderDetails();
  renderOrderList();
  tempCustomer = null;
  renderTempCustomer();
}

// ================================
// Update datalist options for phone numbers
function updatePhoneNumberSuggestions() {
  const datalist = document.getElementById('phoneList');
  if(!datalist) return;
  datalist.innerHTML = '';
  customers.forEach(c => {
    const option = document.createElement('option');
    option.value = c.phone;
    datalist.appendChild(option);
  });
}

// ================================
// Render customer list with clickable items
function renderCustomerList() {
  const customerListDisplay = document.getElementById('customerListDisplay');
  if (!customerListDisplay) return;
  customerListDisplay.innerHTML = '';
  customers.forEach(customer => {
    const li = document.createElement('li');
    li.textContent = `${customer.name} - ${customer.phone}`;
    li.style.cursor = "pointer";
    li.style.padding = "5px 10px";
    li.style.borderBottom = "1px solid #ddd";
    li.addEventListener('click', () => {
      document.getElementById('inputCustomerID').value = customer.id;
      document.getElementById('inputPhoneNumber').value = customer.phone;
      document.getElementById('inputName').value = customer.name;
      document.getElementById('inputAddress').value = customer.address;
      document.getElementById('inputEmail').value = customer.email;

      const discountField = document.getElementById('inputDiscount');

      if (hasOrder(customer.id)) {
        discountField.value = "10";
        discountField.disabled = true;
      } else {
        discountField.value = customer.discount ? customer.discount.replace('%','') : '';
        discountField.disabled = false;
      }
      addOrderDisply();
    });
    customerListDisplay.appendChild(li);
  });
}

// ================================
// Render orders list
function renderOrderList() {
  const orderListDisplay = document.getElementById('orderListDisplay');
  if (!orderListDisplay) return;

  orderListDisplay.innerHTML = '';

  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem('orders')) || [];
  } catch {
    orders = [];
  }

  if (orders.length === 0) {
    orderListDisplay.innerHTML = '<p>No orders found.</p>';
    return;
  }

  orders.forEach(order => {
    const li = document.createElement('li');
    li.style.padding = "8px";
    li.style.borderBottom = "1px solid #ddd";
    li.innerHTML = `
      <strong>Order ID:</strong> ${order.orderId}<br>
      <strong>Customer:</strong> ${order.customerName} (${order.customerPhone})<br>
      <strong>Total Amount:</strong> LKR ${order.totalAmount.toFixed(2)}<br>
      <strong>Discount:</strong> ${order.discountPercent}%<br>
      <strong>Final Price:</strong> LKR ${order.finalPrice.toFixed(2)}<br>
      <strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}
    `;
    orderListDisplay.appendChild(li);
  });
}

// ================================
// Event listeners for discount input and phone input
const discountInput = document.getElementById('inputDiscount');
if (discountInput) {
  discountInput.addEventListener('input', () => {
    if (!discountInput.disabled) addOrderDisply();
  });
}

const phoneInput = document.getElementById('inputPhoneNumber');
if (phoneInput) {
  phoneInput.addEventListener('input', checkPhoneNumberCustomer);
}

// ================================
// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  generateOrderDetails();
  updatePhoneNumberSuggestions();
  displayCategoryList(mainProductList);
  renderCustomerList();
  renderOrderList();
  addOrderDisply();
});
