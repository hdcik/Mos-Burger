// Sample order list
let orders = [
    { id: 1, customer: "John Doe", item: "Burger", quantity: 2 },
    { id: 2, customer: "Jane Smith", item: "Pizza", quantity: 1 },
    { id: 3, customer: "Tom Lee", item: "Fried Rice", quantity: 3 }
];

// View all orders
function orderView() {
    if (orders.length === 0) {
        alert("No orders available.");
        return;
    }

    let message = "Order List:\n\n";
    orders.forEach((order, index) => {
        message += `#${index + 1}\nCustomer: ${order.customer}\nItem: ${order.item}\nQuantity: ${order.quantity}\n\n`;
    });

    alert(message);
}

// Edit an order by customer name
function orderEdit() {
    const customerName = prompt("Enter the customer name to edit:");
    if (!customerName) {
        alert("Customer name is required.");
        return;
    }

    const order = orders.find(o => o.customer.toLowerCase() === customerName.toLowerCase());
    if (!order) {
        alert("Order not found.");
        return;
    }

    const newItem = prompt("Enter new item:", order.item);
    const newQuantity = prompt("Enter new quantity:", order.quantity);

    if (newItem && newQuantity && !isNaN(newQuantity)) {
        order.item = newItem;
        order.quantity = parseInt(newQuantity);
        alert("Order updated successfully.");
    } else {
        alert("Invalid input. Edit cancelled.");
    }
}

// Delete an order by customer name
function orderDelete() {
    const customerName = prompt("Enter the customer name to delete order:");
    if (!customerName) {
        alert("Customer name is required.");
        return;
    }

    const index = orders.findIndex(o => o.customer.toLowerCase() === customerName.toLowerCase());
    if (index === -1) {
        alert("Order not found.");
        return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete ${orders[index].customer}'s order?`);
    if (confirmDelete) {
        orders.splice(index, 1);
        alert("Order deleted successfully.");
    }
}
