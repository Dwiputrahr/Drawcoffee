/* kasir.js - Cashier Dashboard Functionality */

// Function to get orders from localStorage
function getOrders() {
    return JSON.parse(localStorage.getItem('kafe_orders')) || [];
}

// Function to save orders to localStorage
function saveOrders(orders) {
    localStorage.setItem('kafe_orders', JSON.stringify(orders));
}

// Function to update order status
function updateOrderStatus(orderId, newStatus) {
    let orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id == orderId);
    if (orderIndex > -1) {
        orders[orderIndex].status = newStatus;
        saveOrders(orders);
        loadOrders(document.getElementById('statusFilter').value); // Reload with current filter
    }
}

function loadOrders(filter = 'all') {
    const ordersGrid = document.getElementById('ordersGrid');
    ordersGrid.innerHTML = '';
    
    const orders = getOrders();
    const filtered = filter === 'all' ? 
        orders : 
        orders.filter(o => o.status === filter);

    if (filtered.length === 0) {
        ordersGrid.innerHTML = '<p>Tidak ada pesanan ditemukan.</p>';
        return;
    }

    filtered.forEach(order => {
        const orderEl = document.createElement('div');
        orderEl.className = 'order-card';
        orderEl.innerHTML = `
            <h3>Order #${order.id}</h3>
            <p>Pelanggan: ${order.customer || 'N/A'}</p>
            <p>Meja: ${order.table || 'N/A'}</p>
            <p>Status: <span class="status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
            <p>Total: Rp ${order.total.toLocaleString()}</p>
            <p>Waktu: ${new Date(order.timestamp).toLocaleString()}</p>
            <button class="btn" data-id="${order.id}">Detail</button>
        `;
        ordersGrid.appendChild(orderEl);
    });

    // Add event listeners to detail buttons
    document.querySelectorAll('.order-card .btn').forEach(button => {
        button.addEventListener('click', (e) => viewOrderDetails(e.target.dataset.id));
    });
}

function viewOrderDetails(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id == orderId);
    if (!order) return;

    document.getElementById('orderId').textContent = order.id;
    document.getElementById('modalCustomerName').textContent = order.customer || 'N/A';
    document.getElementById('modalTableNumber').textContent = order.table || 'N/A';
    document.getElementById('orderTime').textContent = new Date(order.timestamp).toLocaleString();
    
    const itemsHtml = order.items.map(item => `
        <div class="receipt-item">
            <span>${item.quantity}x ${item.title}</span>
            <span>Rp ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');

    document.getElementById('modalOrderItems').innerHTML = itemsHtml;
    document.getElementById('modalTotalPrice').textContent = `Rp ${order.total.toLocaleString()}`;
    
    // Show appropriate action buttons
    const processBtn = document.getElementById('processOrderBtn');
    const completeBtn = document.getElementById('completeOrderBtn');
    
    processBtn.style.display = order.status === 'pending' ? 'block' : 'none';
    completeBtn.style.display = order.status === 'processing' ? 'block' : 'none';

    // Set data-id on buttons for easy access in event listeners
    processBtn.dataset.orderId = order.id;
    completeBtn.dataset.orderId = order.id;
    document.getElementById('printReceiptBtn').dataset.orderId = order.id;
    
    // Show modal
    document.getElementById('orderModal').style.display = 'flex';
}

window.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const loginForm = document.getElementById('cashierLoginForm');
    const dashboard = document.getElementById('cashierDashboard');
    const ordersGrid = document.getElementById('ordersGrid');
    const statusFilter = document.getElementById('statusFilter');
    const orderModal = document.getElementById('orderModal');
    const closeModalBtn = orderModal.querySelector('.close-modal');

    // Toggle login/dashboard views
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Simple login for demonstration. In a real app, validate credentials.
        const username = loginForm.querySelector('input[type="text"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        if (username === 'kasir' && password === 'admin123') { // Example credentials
            document.getElementById('loginForm').style.display = 'none';
            dashboard.style.display = 'block';
            loadOrders(); // Load all orders initially
        } else {
            alert('Username atau password salah!');
        }
    });

    // Filter orders by status
    statusFilter.addEventListener('change', (e) => {
        loadOrders(e.target.value);
    });

    // Close order detail modal
    closeModalBtn.addEventListener('click', () => {
        orderModal.style.display = 'none';
    });

    // Process order button handler
    document.getElementById('processOrderBtn').addEventListener('click', function() {
        const orderId = this.dataset.orderId;
        updateOrderStatus(orderId, 'processing');
        alert('Pesanan sedang diproses!');
        orderModal.style.display = 'none';
    });
    
    // Complete order button handler
    document.getElementById('completeOrderBtn').addEventListener('click', function() {
        const orderId = this.dataset.orderId;
        updateOrderStatus(orderId, 'completed');
        alert('Pesanan selesai!');
        orderModal.style.display = 'none';
    });

    // Print receipt button handler (basic implementation)
    document.getElementById('printReceiptBtn').addEventListener('click', function() {
        const orderId = this.dataset.orderId;
        const orders = getOrders();
        const orderToPrint = orders.find(o => o.id == orderId);

        if (orderToPrint) {
            let printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Struk Pesanan</title>');
            printWindow.document.write('<style>');
            printWindow.document.write(`
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; }
                .receipt-header { text-align: center; margin-bottom: 20px; }
                .receipt-header h2 { margin: 0; color: #333; }
                .receipt-header p { font-size: 0.9em; color: #555; }
                .receipt-info p { margin: 5px 0; }
                .receipt-items { margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 10px; }
                .receipt-item { display: flex; justify-content: space-between; padding: 5px 0; }
                .receipt-total { border-top: 1px dashed #ccc; margin-top: 15px; padding-top: 10px; display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em; }
                .thank-you { text-align: center; margin-top: 30px; font-style: italic; color: #777; }
            `);
            printWindow.document.write('</style></head><body>');
            printWindow.document.write('<div class="receipt-header"><h2>DRAWCOFFEE</h2><p>Jl. Tamansari No.3a, Kota Bandung</p><p>Telp: (021) 1234-5678</p></div>');
            printWindow.document.write('<div class="receipt-info">');
            printWindow.document.write(`<p><strong>Order ID:</strong> #${orderToPrint.id}</p>`);
            printWindow.document.write(`<p><strong>Pelanggan:</strong> ${orderToPrint.customer || 'N/A'}</p>`);
            printWindow.document.write(`<p><strong>Meja:</strong> ${orderToPrint.table || 'N/A'}</p>`);
            printWindow.document.write(`<p><strong>Waktu:</strong> ${new Date(orderToPrint.timestamp).toLocaleString()}</p>`);
            printWindow.document.write('</div>');
            printWindow.document.write('<div class="receipt-items">');
            orderToPrint.items.forEach(item => {
                printWindow.document.write(`<div class="receipt-item"><span>${item.quantity}x ${item.title}</span><span>Rp ${(item.price * item.quantity).toLocaleString()}</span></div>`);
            });
            printWindow.document.write('</div>');
            printWindow.document.write(`<div class="receipt-total"><span>Total:</span><span>Rp ${orderToPrint.total.toLocaleString()}</span></div>`);
            printWindow.document.write('<div class="thank-you"><p>Terima kasih atas kunjungan Anda!</p></div>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        } else {
            alert('Detail pesanan tidak ditemukan untuk dicetak.');
        }
    });
});
