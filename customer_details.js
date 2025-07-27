// ==========================
// Load existing customers from localStorage
let customers = [];
try {
  customers = JSON.parse(localStorage.getItem('customers')) || [];
} catch (e) {
  customers = [];
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
    email
  };

  customers.push(newCustomer);
  localStorage.setItem('customers', JSON.stringify(customers));

  displayTempCustomer(newCustomer);
  Clear();
}

// ===============
// Show newly added customer
function displayTempCustomer(cust) {
  const list = document.getElementById('tempCustomerList');
  const li = document.createElement('li');
  li.textContent = `${cust.name} (${cust.phone})`;
  list.appendChild(li);
}

// ===============
// Clear Inputs
function Clear() {
  document.getElementById("inputCustomerID").value = '';
  document.getElementById("inputPhoneNumber").value = '';
  document.getElementById("inputName").value = '';
  document.getElementById("inputAddress").value = '';
  document.getElementById("inputEmail").value = '';
}

// ===============
// View Customer (based on phone number)
function customerView() {
  const phone = document.getElementById("inputPhoneNumber").value.trim();
  if (!phone) {
    alert("Enter phone number to view");
    return;
  }

  const cust = customers.find(c => c.phone === phone);
  if (!cust) {
    alert("Customer not found");
    return;
  }

  document.getElementById("inputCustomerID").value = cust.id;
  document.getElementById("inputName").value = cust.name;
  document.getElementById("inputAddress").value = cust.address;
  document.getElementById("inputEmail").value = cust.email;
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
  Clear();
}
