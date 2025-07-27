// Sample Order List (This can come from localStorage too)
let orders = JSON.parse(localStorage.getItem("orderList")) || [
    { id: 1, customer: "John Doe", item: "Burger", quantity: 2 },
    { id: 2, customer: "Jane Smith", item: "Pizza", quantity: 1 },
    { id: 3, customer: "Tom Lee", item: "Fried Rice", quantity: 3 }
];

// Show orders inside the div
function orderView() {
    const container = document.getElementById("order_datails_col");
    container.innerHTML = ""; // clear old content

    if (orders.length === 0) {
        container.innerHTML = "<p>No orders to display.</p>";
        return;
    }

    orders.forEach((order, index) => {
        const div = document.createElement("div");
        div.className = "order-card";
        div.innerHTML = `
            <p><strong>Customer:</strong> ${order.customer}</p>
            <p><strong>Item:</strong> ${order.item}</p>
            <p><strong>Quantity:</strong> ${order.quantity}</p>
            <hr>
        `;
        container.appendChild(div);
    });
}

// Edit an order (by customer name)
function orderEdit() {
    const name = prompt("Enter customer name to edit:");

    const order = orders.find(o => o.customer.toLowerCase() === name?.toLowerCase());
    if (!order) {
        alert("Order not found.");
        return;
    }

    const newItem = prompt("Enter new item:", order.item);
    const newQty = prompt("Enter new quantity:", order.quantity);

    if (newItem && newQty && !isNaN(newQty)) {
        order.item = newItem;
        order.quantity = parseInt(newQty);
        alert("Order updated!");
        localStorage.setItem("orderList", JSON.stringify(orders));
        orderView();
    } else {
        alert("Invalid input.");
    }
}

// Delete an order (by customer name)
function orderDelete() {
    const name = prompt("Enter customer name to delete:");

    const index = orders.findIndex(o => o.customer.toLowerCase() === name?.toLowerCase());
    if (index === -1) {
        alert("Order not found.");
        return;
    }

    const confirmDelete = confirm(`Are you sure to delete ${orders[index].customer}'s order?`);
    if (confirmDelete) {
        orders.splice(index, 1);
        alert("Order deleted.");
        localStorage.setItem("orderList", JSON.stringify(orders));
        orderView();
    }
}
