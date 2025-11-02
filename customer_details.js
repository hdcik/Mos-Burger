// ==========================
// Load existing customers from localStorage
let customers = [];
try {
  customers = JSON.parse(localStorage.getItem('customers')) || [];
} catch (e) {
  customers = [];
}

// Load existing orders from localStorage
let orders = [];
try {
  orders = JSON.parse(localStorage.getItem('orders')) || [];
} catch (e) {
  orders = [];
}

// ===============
// Add New Customer
function addNewCustomer() {
  const phone = document.getElementById("inputPhoneNumber").value.trim();
  const name = document.getElementById("inputName").value.trim();
  const address = document.getElementById("inputAddress").value.trim();
  const email = document.getElementById("inputEmail").value.trim();

  if (!phone || !name) {
    alert("Name and Phone are required.");
    return;
  }

  // Check if customer already exists
  const exists = customers.some(c => c.phone === phone);
  if (exists) {
    alert("Customer with this phone already exists.");
    return;
  }

  // Generate ID
  const customerID = "CUST" + String(customers.length + 1).padStart(3, '0');

  const newCustomer = {
    id: customerID,
    phone,
    name,
    address,
    email,
    orders: []
  };

  customers.push(newCustomer);
  localStorage.setItem('customers', JSON.stringify(customers));

  displayTempCustomer(newCustomer);
  updateCustomerOrderTable();
  Clear();
}

// ===============
// Show newly added customer in mini-list
function displayTempCustomer(cust) {
  const list = document.getElementById('tempCustomerList');
  const li = document.createElement('li');
  li.textContent = `${cust.name} (${cust.phone})`;
  list.appendChild(li);
}

// ===============
// Clear Input Fields
function Clear() {
  document.getElementById("inputCustomerID").value = '';
  document.getElementById("inputPhoneNumber").value = '';
  document.getElementById("inputName").value = '';
  document.getElementById("inputAddress").value = '';
  document.getElementById("inputEmail").value = '';
  clearOrderIdDisplay();
}

// ===============
// View Customer by Phone
function customerView() {
  const phone = document.getElementById("inputPhoneNumber").value.trim();
  if (!phone) {
    alert("Enter phone number to view");
    clearOrderIdDisplay();
    return;
  }

  const cust = customers.find(c => c.phone === phone);
  if (!cust) {
    alert("Customer not found");
    clearOrderIdDisplay();
    return;
  }

  document.getElementById("inputCustomerID").value = cust.id;
  document.getElementById("inputName").value = cust.name;
  document.getElementById("inputAddress").value = cust.address;
  document.getElementById("inputEmail").value = cust.email;

  displayOrderIdByPhone(phone);
}

// ===============
// Edit Customer
function customerEdit() {
  const phone = document.getElementById("inputPhoneNumber").value.trim();
  const name = document.getElementById("inputName").value.trim();
  const address = document.getElementById("inputAddress").value.trim();
  const email = document.getElementById("inputEmail").value.trim();

  const index = customers.findIndex(c => c.phone === phone);
  if (index === -1) {
    alert("Customer not found to edit");
    return;
  }

  customers[index].name = name;
  customers[index].address = address;
  customers[index].email = email;

  localStorage.setItem('customers', JSON.stringify(customers));
  alert("Customer updated");

  updateCustomerOrderTable();
  Clear();
}

// ===============
// Delete Customer
function customerDelete() {
  const phone = document.getElementById("inputPhoneNumber").value.trim();
  const index = customers.findIndex(c => c.phone === phone);
  if (index === -1) {
    alert("Customer not found to delete");
    return;
  }

  if (!confirm("Are you sure you want to delete this customer?")) return;

  customers.splice(index, 1);
  localStorage.setItem('customers', JSON.stringify(customers));

  alert("Customer deleted");
  updateCustomerOrderTable();
  Clear();
}

// ===============
// Display All Customers in Table
function updateCustomerOrderTable() {
  const tableBody = document.querySelector("#customerOrderTable tbody");
  tableBody.innerHTML = "";

  customers.forEach(cust => {
    const tr = document.createElement("tr");

    // Format orders
    let orderText = "No Orders";
    let total = "-";
    if (cust.orders && cust.orders.length > 0) {
      orderText = cust.orders.map(o => `${o.name} (x${o.qty})`).join(", ");
      total = "Rs. " + cust.orders.reduce((sum, o) => sum + (o.qty * o.price), 0);
    }

    tr.innerHTML = `
      <td>${cust.id}</td>
      <td>${cust.name}</td>
      <td>${cust.phone}</td>
      <td>${cust.address}</td>
      <td>${cust.email}</td>
      <td>${orderText}</td>
      <td>${total}</td>
    `;

    tableBody.appendChild(tr);
  });
}

// ===============
// Get Order ID by Phone Number
function getOrderIdByPhone(phone) {
  // orders array loaded from localStorage globally
  const order = orders.find(o => o.customerPhone === phone);
  return order ? order.id : null;
}

// ===============
// Display order ID for given phone number
function displayOrderIdByPhone(phone) {
  const orderId = getOrderIdByPhone(phone);
  const orderIdDisplay = document.getElementById('orderIdDisplay');
  if (!orderIdDisplay) return;

  if (orderId) {
    orderIdDisplay.textContent = `Order ID: ${orderId}`;
  } else {
    orderIdDisplay.textContent = 'No order found for this phone number.';
  }
}

// Clear Order ID display
function clearOrderIdDisplay() {
  const orderIdDisplay = document.getElementById('orderIdDisplay');
  if (!orderIdDisplay) return;
  orderIdDisplay.textContent = '';
}

// ===============
// On Phone Input change - update displayed customer info and order ID
document.getElementById('inputPhoneNumber').addEventListener('input', function () {
  const phone = this.value.trim();
  if (!phone) {
    Clear();
    clearOrderIdDisplay();
    return;
  }
  const cust = customers.find(c => c.phone === phone);
  if (cust) {
    document.getElementById("inputCustomerID").value = cust.id;
    document.getElementById("inputName").value = cust.name;
    document.getElementById("inputAddress").value = cust.address;
    document.getElementById("inputEmail").value = cust.email;
    displayOrderIdByPhone(phone);
  } else {
    Clear();
    clearOrderIdDisplay();
  }
});

// ===============
// Auto-load on page load
window.addEventListener("DOMContentLoaded", () => {
  updateCustomerOrderTable();
});
