// ================================
// Load or init data
let customers = [];
let orders = [];
let tempDiscounts = [];
let mainDiscounts = [];
let tempSelectItem = [];
let tempCustomer = null;

function saveAllData() {
  localStorage.setItem('customers', JSON.stringify(customers));
  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.setItem('tempDiscounts', JSON.stringify(tempDiscounts));
  localStorage.setItem('mainDiscounts', JSON.stringify(mainDiscounts));
  localStorage.setItem('tempSelectItem', JSON.stringify(tempSelectItem));
  if (tempCustomer) {
    localStorage.setItem('tempCustomer', JSON.stringify(tempCustomer));
  } else {
    localStorage.removeItem('tempCustomer');
  }
}

function loadAllData() {
  try {
    customers = JSON.parse(localStorage.getItem('customers')) || [];
  } catch { customers = []; }

  try {
    orders = JSON.parse(localStorage.getItem('orders')) || [];
  } catch { orders = []; }

  try {
    tempDiscounts = JSON.parse(localStorage.getItem('tempDiscounts')) || [];
  } catch { tempDiscounts = []; }

  try {
    mainDiscounts = JSON.parse(localStorage.getItem('mainDiscounts')) || [];
  } catch { mainDiscounts = []; }

  try {
    tempSelectItem = JSON.parse(localStorage.getItem('tempSelectItem')) || [];
  } catch { tempSelectItem = []; }

  try {
    tempCustomer = JSON.parse(localStorage.getItem('tempCustomer'));
  } catch { tempCustomer = null; }
}

// ================================
// Default Products
let mainProductList = JSON.parse(localStorage.getItem('mainProductList')) || [
  { name: "Classic Beef Burger", price: 850.00, discount: 5, Qty: 12, category: "burgers", image: "" },
  { name: "Spicy Chicken Burger", price: 750.00, discount: 0, Qty: 2, category: "burgers", image: "" },
  { name: "Big Burger", price: 650.00, discount: 4, Qty: 15, category: "burgers", image: "" },
  { name: "Cheese Burger", price: 700.00, discount: 0, Qty: 16, category: "burgers", image: "" },
  { name: "Veggie Burger", price: 600.00, discount: 0, Qty: 12, category: "burgers", image: "" },
  { name: "French Fries", price: 300.00, discount: 0, Qty: 12, category: "friesAndSides", image: "" },
  { name: "Coca Cola", price: 200.00, discount: 0, Qty: 12, category: "drinks", image: "" },
  { name: "Orange Drink", price: 450.00, discount: 0, Qty: 12, category: "drinks", image: "" },
  { name: "Orange Juice", price: 250.00, discount: 0, Qty: 12, category: "drinks", image: "" },
  { name: "Big Mac Burger", price: 650.00, discount: 0, Qty: 12, category: "burgers", image: "" },
  { name: "Ice Cream", price: 300.00, discount: 10, Qty: 12, category: "desserts", image: "" }
];
localStorage.setItem('mainProductList', JSON.stringify(mainProductList));

// Map product discounts for quick lookup
const productDiscounts = {};
mainProductList.forEach(p => productDiscounts[p.name] = p.discount || 0);

// ================================
// Util Functions
function generateCustomerId() {
  return 'CUST-' + Date.now();
}

function generateOrderId() {
  return 'ORD-' + Date.now();
}

// Check if customer has any orders
function hasOrder(customerId) {
  return orders.some(order => order.customerId === customerId);
}

// ================================
// Product display and filter

let tempCategory = 'all';
let searchTerm = '';

function displayCategoryList(items) {
  const container = document.getElementById('mainProductList');
  if (!container) return;
  container.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cardmenu-iteme';
    div.style = "width:180px;border:1px solid #ddd;padding:10px;border-radius:6px;text-align:center;cursor:pointer;margin:5px;";
    div.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}" style="width:150px;height:150px;object-fit:cover;" />
      <h5>${item.name}</h5>
      <p>Rs. ${item.price.toFixed(2)}</p>
      <p>Discount. ${item.discount}%</p>
      <p>Qty. ${item.Qty}</p>
      <button class="btn btn-primary btn-sm" type="button" onclick="addOrderFunction('${item.name}', ${item.price})">Add</button>`;
    container.appendChild(div);
  });
}

function filterAndDisplay() {
  let filtered = mainProductList;

  if (tempCategory !== 'all') {
    filtered = filtered.filter(p => p.category === tempCategory);
  }
  if (searchTerm) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  displayCategoryList(filtered);
}

// ================================
// Add product to order

function addOrderFunction(name, price) {
  const existing = tempSelectItem.find(i => i.name === name);
  if (existing) existing.qty++;
  else tempSelectItem.push({ name, price, qty: 1 });
  saveAllData();
  addOrderDisplay();
}

// Increase quantity
function increasingQty(index) {
  tempSelectItem[index].qty++;
  saveAllData();
  addOrderDisplay();
}

// Reduce quantity or remove
function reductionQty(index) {
  if (tempSelectItem[index].qty > 1) tempSelectItem[index].qty--;
  else tempSelectItem.splice(index, 1);
  saveAllData();
  addOrderDisplay();
}

// ================================
// Display order list and calculate discounts

function getDiscountForPhone(phone) {
  // old customer fixed 10%
  let tempDisc = tempDiscounts.find(d => d.phone === phone);
  if (tempDisc) return tempDisc.discount;

  // manual discounts
  let mainDisc = mainDiscounts.find(d => d.phone === phone);
  if (mainDisc) return mainDisc.discount;

  return 0;
}

function addOrderDisplay() {
  const container = document.getElementById('customerChoiceItem');
  const totalEl = document.getElementById('totalCount');
  if (!container || !totalEl) return;

  container.innerHTML = '';

  let total = 0;
  let productSpecificBestDiscountAmount = 0;

  tempSelectItem.forEach((item, i) => {
    const qty = isNaN(item.qty) ? 0 : item.qty;
    const itemTotal = item.price * qty;
    total += itemTotal;

    const prodDiscPercent = productDiscounts[item.name] || 0;
    const prodDiscAmount = itemTotal * (prodDiscPercent / 100);
    if (prodDiscAmount > productSpecificBestDiscountAmount) {
      productSpecificBestDiscountAmount = prodDiscAmount;
    }

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

  const phone = document.getElementById('inputPhoneNumber') ? document.getElementById('inputPhoneNumber').value.trim() : '';
  const discountPercent = getDiscountForPhone(phone);

  const totalQty = tempSelectItem.reduce((sum, i) => sum + i.qty, 0);
  let qtyDiscountAmount = 0;
  if (totalQty >= 5) {
    qtyDiscountAmount = total * 0.05;
  }

  const oldOrManualDiscountAmount = total * (discountPercent / 100);

  let bestDiscountAmount = 0;
  let discountType = '';

  if (productSpecificBestDiscountAmount > bestDiscountAmount) {
    bestDiscountAmount = productSpecificBestDiscountAmount;
    discountType = 'Product Specific Discount';
  }
  if (qtyDiscountAmount > bestDiscountAmount) {
    bestDiscountAmount = qtyDiscountAmount;
    discountType = 'Quantity Discount (5% for 5+ items)';
  }
  if (oldOrManualDiscountAmount > bestDiscountAmount) {
    bestDiscountAmount = oldOrManualDiscountAmount;
    discountType = discountPercent === 10 ? 'Old Customer Discount (10%)' : 'Manual Discount';
  }

  const finalPrice = total - bestDiscountAmount;

  totalEl.innerHTML = `
    Total: LKR ${total.toFixed(2)}<br>
    Discount (${discountType}): LKR ${bestDiscountAmount.toFixed(2)}<br>
    Price to Pay: LKR ${finalPrice.toFixed(2)}
  `;

  saveAllData();
}

function getOldCustomerOrderId(phone) {
  const order = orders.find(order => order.customerPhone === phone);
  return order ? order.orderId : null;
}
// ================================
// Customer phone input check

function checkPhoneNumberCustomer() {
  const phone = document.getElementById('inputPhoneNumber').value.trim();
  const discountField = document.getElementById('inputDiscount');
  const idField = document.getElementById('inputCustomerID');

  if (!phone) {
    if (document.getElementById('inputName')) document.getElementById('inputName').value = '';
    if (document.getElementById('inputAddress')) document.getElementById('inputAddress').value = '';
    if (document.getElementById('inputEmail')) document.getElementById('inputEmail').value = '';
    if (idField) idField.value = '';
    if (discountField) {
      discountField.value = '';
      discountField.disabled = false;
    }
    addOrderDisplay();
    return;
  }

  const customer = customers.find(c => c.phone === phone);

  if (customer) {
    document.getElementById('inputName').value = customer.name;
    document.getElementById('inputAddress').value = customer.address;
    document.getElementById('inputEmail').value = customer.email;
    if (idField) idField.value = customer.id;

    if (customer) {
      tempCustomer = {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        email: customer.email
      };

      const orderId = getOldCustomerOrderId(customer.phone);
      if (orderId) {
        tempCustomer.orderId = orderId;
      }
    }

    if (hasOrder(customer.id)) {
      if (!tempDiscounts.find(d => d.phone === phone)) {
        tempDiscounts.push({ phone, discount: 10 });
      }
      discountField.value = "10";
      discountField.disabled = true;

      mainDiscounts = mainDiscounts.filter(d => d.phone !== phone);
    } else {
      discountField.disabled = false;

      const manualDiscount = mainDiscounts.find(d => d.phone === phone);
      discountField.value = manualDiscount ? manualDiscount.discount : '';

      tempDiscounts = tempDiscounts.filter(d => d.phone !== phone);
    }
  } else {
    if (document.getElementById('inputName')) document.getElementById('inputName').value = '';
    if (document.getElementById('inputAddress')) document.getElementById('inputAddress').value = '';
    if (document.getElementById('inputEmail')) document.getElementById('inputEmail').value = '';
    if (idField) idField.value = generateCustomerId();
    discountField.value = '';
    discountField.disabled = false;

    tempDiscounts = tempDiscounts.filter(d => d.phone !== phone);
    mainDiscounts = mainDiscounts.filter(d => d.phone !== phone);
  }
  saveAllData();
  addOrderDisplay();
  renderTempCustomer();
}

// ================================
// Discount input change handler

function onDiscountInputChange() {
  const phone = document.getElementById('inputPhoneNumber').value.trim();
  const discountField = document.getElementById('inputDiscount');
  if (!phone) return;

  if (!discountField.disabled) {
    let discountVal = parseFloat(discountField.value);
    if (isNaN(discountVal) || discountVal < 0) discountVal = 0;

    const existingIndex = mainDiscounts.findIndex(d => d.phone === phone);
    if (existingIndex > -1) {
      mainDiscounts[existingIndex].discount = discountVal;
    } else {
      mainDiscounts.push({ phone, discount: discountVal });
    }
    saveAllData();
    addOrderDisplay();
  }
}

// ================================
// Add new customer (temporary until order placed)

function addNewCustomer() {
  const phone = document.getElementById("inputPhoneNumber").value.trim();
  const name = document.getElementById("inputName").value.trim();
  const address = document.getElementById("inputAddress").value.trim();
  const email = document.getElementById("inputEmail").value.trim();
  let discountVal = document.getElementById("inputDiscount").value.trim();

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

  if (!discountVal) discountVal = "0";

  const availableCust = customers.find(c => c.phone === phone)
  if (availableCust) {
    alert("Customer already exists. Please select existing customer.");
    const orderId = getOldCustomerOrderId(phone);

    // Old Customer Data 

    tempCustomer = {
      id: availableCust.id,
      phone: availableCust.phone,
      name: availableCust.name,
      address: availableCust.address,
      email: availableCust.email,

      orderId: orderId ? orderId : null
    };
    saveAllData();
    renderTempCustomer();
    return;
  }

  // New Customer Create 

  tempCustomer = {
    id: generateCustomerId(),
    phone,
    name,
    address,
    email,
    discount: discountVal + '0%',
    orderId: null
  };

  alert("Customer added temporarily. Confirm order to save permanently.");
  saveAllData();
  renderTempCustomer();
}

// ================================
function tempOldOrderId(orderId) {
  let displyOrderId = "";
  if (orderId) {
    displyOrderId = `${orderId}`;
  } else {
    displyOrderId = "No Order Id";
  }
  return displyOrderId;
}
  // ================================
  // Render temp customer list

  function renderTempCustomer() {
    const tempList = document.getElementById('tempCustomerList');
    if (!tempList) return;


    tempList.innerHTML = '';
    if (tempCustomer) {
      const li = document.createElement('li');




      li.textContent = `${tempCustomer.name} - ${tempCustomer.phone} - ${tempCustomer.address} - ${tempOldOrderId(tempCustomer.orderId)}`;
      li.style.padding = "5px 10px";
      li.style.border = "1px solid #ddd";
      li.style.marginTop = "5px";
      tempList.appendChild(li);

    }
  }

  // ================================
  // Clear inputs and temp data

  function Clear() {
    document.getElementById("inputPhoneNumber").value = '';
    document.getElementById("inputName").value = '';
    document.getElementById("inputAddress").value = '';
    document.getElementById("inputEmail").value = '';
    const discountField = document.getElementById("inputDiscount");
    if (discountField) {
      discountField.value = '';
      discountField.disabled = false;
    }
    document.getElementById("inputCustomerID").value = '';
    tempCustomer = null;
    saveAllData();
    renderTempCustomer();
    renderCustomerList();
    generateOrderDetails();
  }
  // New function: Display Order ID and Order Date
  function generateOrderDetails(orderId = null, orderDate = null, orderTime = null) {
    const orderIdElem = document.getElementById('order_id');
    const orderDateElem = document.getElementById('order_date');
    const orderTimeElem = document.getElementById('order_time');
    if (!orderIdElem || !orderDateElem || !orderTimeElem) return;

    const now = new Date();

    if (!orderId) {
      orderId = 'ORD-' + Date.now();
    }
    if (!orderDate) {

      orderDate = now.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    }
    orderIdElem.textContent = orderId;
    orderDateElem.textContent = orderDate;

    function updateTime() {
      if (!orderTime) {

        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // convert 0 to 12

        const time = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;

        orderTimeElem.textContent = time;
      }
    }
    updateTime();
    setInterval(updateTime, 1000)
  }
  // ================================
  // Place order and save permanently

  function placeCheckout() {
    if (tempSelectItem.length === 0) {
      alert("No items selected.");
      return;
    }

    const phone = document.getElementById("inputPhoneNumber").value.trim();
    const name = document.getElementById("inputName").value.trim();
    const address = document.getElementById("inputAddress").value.trim();
    const email = document.getElementById("inputEmail").value.trim();

    if (!phone || !name || !address || !email) {
      alert("Please complete customer details.");
      return;
    }

    let total = 0;
    let productSpecificBestDiscountAmount = 0;

    tempSelectItem.forEach(i => {
      total += i.price * i.qty;
      const prodDiscPercent = productDiscounts[i.name] || 0;
      const prodDiscAmount = (i.price * i.qty) * (prodDiscPercent / 100);
      if (prodDiscAmount > productSpecificBestDiscountAmount) {
        productSpecificBestDiscountAmount = prodDiscAmount;
      }
    });

    const discountPercent = getDiscountForPhone(phone);
    const totalQty = tempSelectItem.reduce((sum, i) => sum + i.qty, 0);
    const qtyDiscountAmount = totalQty >= 5 ? total * 0.05 : 0;
    const oldOrManualDiscountAmount = total * (discountPercent / 100);

    let bestDiscountAmount = 0;
    let discountType = '';

    if (productSpecificBestDiscountAmount > bestDiscountAmount) {
      bestDiscountAmount = productSpecificBestDiscountAmount;
      discountType = 'Product Specific Discount';
    }
    if (qtyDiscountAmount > bestDiscountAmount) {
      bestDiscountAmount = qtyDiscountAmount;
      discountType = 'Quantity Discount (5% for 5+ items)';
    }
    if (oldOrManualDiscountAmount > bestDiscountAmount) {
      bestDiscountAmount = oldOrManualDiscountAmount;
      discountType = discountPercent === 10 ? 'Old Customer Discount (10%)' : 'Manual Discount';
    }

    const finalPrice = total - bestDiscountAmount;

    // Save new customer permanently if tempCustomer exists and not in customers
    if (tempCustomer && !customers.find(c => c.phone === phone)) {
      customers.push({
        id: tempCustomer.id,
        phone: tempCustomer.phone,
        name: tempCustomer.name,
        address: tempCustomer.address,
        email: tempCustomer.email,
        orderId: tempCustomer.orderId || null
      });
    }

    // Create new order object
    const newOrder = {
      id: generateOrderId(),
      customerId: customers.find(c => c.phone === phone)?.id || generateCustomerId(),
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      customerEmail: email,
      orderDate: new Date().toISOString(),
      items: tempSelectItem.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
      total: total,
      discount: bestDiscountAmount,
      finalPrice: finalPrice,
      discountType: discountType
    };

    orders.push(newOrder);

    // Reset current order and temp customer
    tempSelectItem = [];
    tempCustomer = null;

    alert(`Order placed successfully!\nOrder ID: ${newOrder.id}\nTotal to pay: LKR ${finalPrice.toFixed(2)}`);

    Clear();
    saveAllData();
    filterAndDisplay();
    addOrderDisplay();
    renderCustomerList();

    generateOrderDetails(newOrder.id, new Date(newOrder.orderDate).toLocaleDateString('en-GB'));
  }

  // ================================
  // Render full customer list

  function renderCustomerList() {
    const container = document.getElementById('fullCustomerList');
    if (!container) return;
    container.innerHTML = '';

    customers.forEach(cust => {
      const div = document.createElement('div');
      div.textContent = `${cust.name} (${cust.phone})`;
      div.style.padding = '3px 5px';
      div.style.borderBottom = '1px solid #ddd';
      container.appendChild(div);
    });
  }

  // ================================
  // Event listeners

  window.onload = function () {
    loadAllData();
    filterAndDisplay();
    addOrderDisplay();
    renderCustomerList();
    renderTempCustomer();
    generateOrderDetails();

    // Category buttons
    document.querySelectorAll('button[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        tempCategory = btn.getAttribute('data-category');
        document.querySelectorAll('button[data-category]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterAndDisplay();
      });
    });

    // Search input
    const searchInput = document.getElementById('searchBarInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        filterAndDisplay();
      });
    }

    // Phone input change
    const phoneInput = document.getElementById('inputPhoneNumber');
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        checkPhoneNumberCustomer();
      });
    }

    // Discount input change
    const discountInput = document.getElementById('inputDiscount');
    if (discountInput) {
      discountInput.addEventListener('input', () => {
        onDiscountInputChange();
      });
    }
  };
