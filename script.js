// Menu Data
const menuItems = [
    { id: 1, title: "Nasi Goreng Draw", price: 35000, category: "makanan", description: "Nasi goreng dengan campuran daging ayam, udang, sayuran, dan telur", image: "https://sanex.co.id/wp-content/uploads/2024/11/2734.jpg" },
    { id: 2, title: "Mie Ayam Jamur", price: 30000, category: "makanan", description: "Mie ayam dengan jamur kancing dan pilihan pangsit goreng atau rebus", image: "https://www.masakapahariini.com/wp-content/uploads/2018/04/End-shot-500x300.jpg" },
    { id: 3, title: "Nasi Ayam Bakar ", price: 45000, category: "makanan", description: "Ayam bakar dengan bumbu rujak pedas manis disajikan dengan lalapan", image: "https://cdn.yummy.co.id/content-images/images/20230616/gLgq90cnqMwWn6bLkm9vmwQplaEVXDQO-31363836383839393137d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp" },
    { id: 4, title: "Cap Cay Kuah", price: 20000, category: "makanan", description: "Cap cay dengan berbagai sayuran segar dan pilihan topping daging", image: "https://assets.unileversolutions.com/v1/123216474.png" },
    { id: 5, title: "Kopi Signature", price: 25000, category: "minuman", description: "Kopi susu gula aren khas Drawcoffee yang creamy", image: "kosu.jpg" },
    { id: 6, title: "Americano", price: 25000, category: "minuman", description: "Kopi hitam double espreso ", image: "Americano.jpg" },
    { id: 7, title: "Latte", price: 20000, category: "minuman", description: "Kopi susu tanpa gula", image: "tb.jpg" },
    { id: 8, title: "Chocolate Fungky", price: 22000, category: "minuman", description: "Minuman chocolate segar dengan strawberry, vanilla, dan creamy", image: "cp.jpg" },
    { id: 9, title: "Kentang Goreng", price: 20000, category: "snack", description: "Kentang goreng renyah dengan saus sambal dan mayones", image: "https://static01.nyt.com/images/2018/09/16/magazine/16mag-eat/16mag-eat-jumbo.png" },
    { id: 10, title: "Onion Ring", price: 18000, category: "snack", description: "Bawang bombay goreng tepung dengan saus thousand island", image: "https://hips.hearstapps.com/hmg-prod/images/onion-rings-recipe-2-6414b30a09cd1.jpg" },
    { id: 11, title: "Tahu Cabe Garam", price: 22000, category: "snack", description: "Tahu krispi dengan bumbu gurih dan cabai", image: "https://asset.kompas.com/crops/6Un1QLjT8AHx6cJtvyP5v-0vlPA=/0x0:4240x2827/1200x800/data/photo/2022/02/27/621b75f410d96.jpg" },
    { id: 12, title: "Cireng Rujak", price: 15000, category: "snack", description: "Cireng krispi dengan bumbu rujak", image: "https://cdn1-production-images-kly.akamaized.net/a79XYy_C49SJ1C01dy6kog8susI=/800x800/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3535886/original/062497100_1628523130-IG_resepmasakanrumah__.jpg" }
];

// Order Data (shared between customer and cashier)
let orderItems = JSON.parse(localStorage.getItem('kafeCurrentOrderItems')) || [];
let totalPrice = parseFloat(localStorage.getItem('kafeCurrentOrderTotalPrice')) || 0;

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const orderItemsEl = document.getElementById('orderItems');
const totalPriceEl = document.getElementById('totalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.querySelector('.close-modal');
const closeSuccessModalBtn = document.getElementById('closeSuccessModal');
const customerNameInput = document.getElementById('customerName');
const tableNumberInput = document.getElementById('tableNumber');
const receiptContentEl = document.getElementById('receiptContent');
const orderTrackingBtn = document.getElementById('orderTrackingBtn');
const trackOrderModal = document.getElementById('trackOrderModal');
const trackOrderModalCloseBtn = trackOrderModal.querySelector('.close-modal');
const orderIdInputTracking = document.getElementById('orderIdInput'); // Input ID pesanan di modal tracking
const checkOrderBtn = document.getElementById('checkOrderBtn');
const trackingResultDiv = document.getElementById('trackingResult');
const orderDetailsDiv = document.getElementById('orderDetails');
        

// Display Menu Items
function displayMenuItems(items) {
    menuGrid.innerHTML = '';
    
    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');
        menuItem.dataset.category = item.category;
        menuItem.innerHTML = `
            <div class="menu-item-img">
                <img src="${item.image}" alt="${item.title} - ${item.description}">
            </div>
            <div class="menu-item-content">
                <div class="menu-item-title">
                    <h3>${item.title}</h3>
                    <span class="menu-item-price">Rp ${item.price.toLocaleString()}</span>
                </div>
                <p class="menu-item-desc">${item.description}</p>
                <div class="menu-item-footer">
                    <div class="quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity-value">0</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="btn add-to-cart" data-id="${item.id}">Tambah</button>
                </div>
            </div>
        `;
        
        menuGrid.appendChild(menuItem);
    });
    
    
    // Add event listeners
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', incrementQuantity);
    });
    
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', decrementQuantity);
    });
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

// Filter Menu Items
function filterMenu(category) {
    if (category === 'all') {
        displayMenuItems(menuItems);
    } else {
        const filteredItems = menuItems.filter(item => item.category === category);
        displayMenuItems(filteredItems);
    }
}

// Increment Quantity
function incrementQuantity(e) {
    const id = parseInt(e.target.dataset.id);
    const quantityValue = e.target.parentElement.querySelector('.quantity-value');
    let quantity = parseInt(quantityValue.textContent);
    quantity++;
    quantityValue.textContent = quantity;
}

// Decrement Quantity
function decrementQuantity(e) {
    const id = parseInt(e.target.dataset.id);
    const quantityValue = e.target.parentElement.querySelector('.quantity-value');
    let quantity = parseInt(quantityValue.textContent);
    if (quantity > 0) {
        quantity--;
        quantityValue.textContent = quantity;
    }
}

// Add to Cart
function addToCart(e) {
    const id = parseInt(e.target.dataset.id);
    const menuItem = menuItems.find(item => item.id === id);
    const quantityEl = e.target.parentElement.querySelector('.quantity-value');
    const quantity = parseInt(quantityEl.textContent);
    
    if (quantity === 0) {
        alert('Silakan masukkan jumlah pesanan terlebih dahulu');
        return;
    }
    
    const existingItem = orderItems.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        orderItems.push({
            ...menuItem,
            quantity: quantity
        });
    }
    
    // Reset quantity
    quantityEl.textContent = 0;
    
    // Update order summary
    updateOrderSummary();
    
    // Show confirmation
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = `${menuItem.title} ditambahkan ke keranjang`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Update Order Summary
function updateOrderSummary() {
    if (orderItems.length === 0) {
        orderItemsEl.innerHTML = '<p class="empty-order">Belum ada pesanan</p>';
        totalPriceEl.textContent = 'Rp 0';
        totalPrice = 0;
        localStorage.removeItem('kafeCurrentOrderItems');
        localStorage.removeItem('kafeCurrentOrderTotalPrice');
        return;
    }
    
    let html = '';
    totalPrice = 0;
    
    orderItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        html += `
            <div class="order-item">
                <div class="order-item-info">
                    <div class="order-item-name">${item.title}</div>
                    <div class="order-item-price">Rp ${item.price.toLocaleString()} x ${item.quantity}</div>
                </div>
                <div class="order-item-total">Rp ${itemTotal.toLocaleString()}</div>
                <span class="order-item-remove" data-id="${item.id}">Hapus</span>
            </div>
        `;
    });
    
    orderItemsEl.innerHTML = html;
    totalPriceEl.textContent = `Rp ${totalPrice.toLocaleString()}`;

    // Save current order to localStorage (for persistence if user navigates away)
    localStorage.setItem('kafeCurrentOrderItems', JSON.stringify(orderItems));
    localStorage.setItem('kafeCurrentOrderTotalPrice', totalPrice);
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.order-item-remove').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
}

// Remove from Cart
function removeFromCart(e) {
    const id = parseInt(e.target.dataset.id);
    orderItems = orderItems.filter(item => item.id !== id);
    updateOrderSummary();
}

// Generate Receipt Content for Modal
function generateReceiptContent(orderData) {
    let receiptHtml = `
        <div class="receipt">
            <h4>Detail Pesanan #${orderData.id}</h4>
            <p><strong>Nama:</strong> ${orderData.customer}</p>
            <p><strong>Meja:</strong> ${orderData.table}</p>
            <p><strong>Waktu:</strong> ${new Date(orderData.timestamp).toLocaleString()}</p>
            <hr>
            <div class="receipt-items">
    `;
    orderData.items.forEach(item => {
        receiptHtml += `
            <div class="receipt-item">
                <span>${item.quantity}x ${item.title}</span>
                <span>Rp ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `;
    });
    receiptHtml += `
            </div>
            <hr>
            <div class="receipt-total">
                <strong>Total:</strong> <span>Rp ${orderData.total.toLocaleString()}</span>
            </div>
        </div>
    `;
    return receiptHtml;
}

// Checkout
async function checkout() {
    const customerName = customerNameInput.value.trim();
    const tableNumber = tableNumberInput.value.trim();

    if (orderItems.length === 0) {
        alert('Keranjang Anda masih kosong. Silakan pilih menu terlebih dahulu.');
        return;
    }

    if (!customerName || !tableNumber) {
        alert('Mohon lengkapi Nama dan Nomor Meja Anda.');
        return;
    }

    const now = new Date();
    const orderId = 'ORD-' + now.getTime(); // Unique ID for the order

    const orderData = {
        id: orderId,
        customer: customerName,
        table: tableNumber,
        items: orderItems.map(item => ({ // Kirim hanya data yang relevan untuk backend
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity
        })),
        total: totalPrice,
        timestamp: now.toISOString(),
        status: 'pending' // Initial status
    };

    try {
        // 1. Kirim data pesanan ke backend (placeOrder.php) untuk mendapatkan token Midtrans
        const response = await fetch('http://drawcoffee.kesug.com/placeOrder.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (data.token) {
            // 2. Panggil Midtrans Snap dengan token yang diterima
            snap.pay(data.token, {
                onSuccess: function(result) {
                    /* Callback jika pembayaran berhasil */
                    alert("Pembayaran Berhasil!");
                    console.log(result);
                    // Simpan pesanan ke localStorage dengan status 'processing' atau 'completed'
                    // Tergantung pada logika bisnis Anda setelah pembayaran sukses
                    saveOrderToLocalStorage(orderData.id, 'processing', orderData); // Menggunakan orderData lengkap
                    displaySuccessModal(orderData); // Tampilkan modal sukses setelah pembayaran berhasil
                },
                onPending: function(result) {
                    /* Callback jika pembayaran pending */
                    alert("Pembayaran Pending! Silakan selesaikan pembayaran Anda.");
                    console.log(result);
                    saveOrderToLocalStorage(orderData.id, 'pending', orderData); // Simpan ke localStorage dengan status pending
                    displaySuccessModal(orderData); // Tampilkan modal sukses juga untuk status pending
                },
                onError: function(result) {
                    /* Callback jika pembayaran gagal */
                    alert("Pembayaran Gagal! Silakan coba lagi.");
                    console.log(result);
                    // Opsional: Tampilkan pesan error yang lebih spesifik atau jangan tampilkan modal sukses
                },
                onClose: function() {
                    /* Callback jika jendela pembayaran ditutup oleh pengguna */
                    alert('Anda menutup jendela pembayaran. Pesanan tidak akan diproses jika pembayaran belum selesai.');
                    // Opsional: Hapus pesanan dari localStorage jika tidak jadi bayar
                    // Atau biarkan dengan status 'pending' jika Anda ingin kasir bisa melihatnya
                }
            });
        } else {
            alert('Gagal mendapatkan token pembayaran dari server: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    }
}

// Fungsi baru untuk menyimpan pesanan ke localStorage setelah pembayaran
// Menambahkan parameter orderData agar data lengkap tersedia
function saveOrderToLocalStorage(orderId, status, completeOrderData) {
    const allOrders = JSON.parse(localStorage.getItem('kafe_orders')) || [];
    const existingOrderIndex = allOrders.findIndex(o => o.id === orderId);

    if (existingOrderIndex > -1) {
        // Update status jika pesanan sudah ada
        allOrders[existingOrderIndex].status = status;
    } else {
        // Jika pesanan belum ada, tambahkan data pesanan lengkap
        // Pastikan completeOrderData sudah berisi semua informasi yang diperlukan
        completeOrderData.status = status; // Update status di objek data sebelum disimpan
        allOrders.push(completeOrderData);
    }
    localStorage.setItem('kafe_orders', JSON.stringify(allOrders));

    // Reset order for the customer (keranjang belanja)
    orderItems = [];
    updateOrderSummary(); // Ini juga akan menghapus localStorage untuk current order
    customerNameInput.value = '';
    tableNumberInput.value = '';
}

// Fungsi untuk menampilkan modal sukses (dipanggil setelah pembayaran berhasil/pending)
function displaySuccessModal(orderData) {
    receiptContentEl.innerHTML = generateReceiptContent(orderData);
    successModal.style.display = 'flex';
}




// Close Modal
function closeModal() {
    successModal.style.display = 'none';
}


        function showTrackOrderModal() {
            trackOrderModal.style.display = 'flex';
            trackingResultDiv.style.display = 'none'; // Sembunyikan hasil sebelumnya
            orderIdInputTracking.value = ''; // Kosongkan input
        }

        function closeTrackOrderModal() {
            trackOrderModal.style.display = 'none';
        }
        

        function getOrdersFromLocalStorage() {
            return JSON.parse(localStorage.getItem('kafe_orders')) || [];
        }

        function displayTrackingDetails(order) {
            orderDetailsDiv.innerHTML = `
                <p><strong>Order ID:</strong> #${order.id}</p>
                <p><strong>Pelanggan:</strong> ${order.customer || 'N/A'}</p>
                <p><strong>Meja:</strong> ${order.table || 'N/A'}</p>
                <p><strong>Total:</strong> Rp ${order.total.toLocaleString()}</p>
                <p><strong>Waktu Pesan:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
                <p><strong>Status:</strong> <span class="status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
                <h4>Item Pesanan:</h4>
                <div class="receipt-items">
                    ${order.items.map(item => `
                        <div class="receipt-item">
                            <span>${item.quantity}x ${item.title}</span>
                            <span>Rp ${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
            `;

            // Update status progress bar
            const statusSteps = trackOrderModal.querySelectorAll('.status-step');
            statusSteps.forEach(step => step.classList.remove('active', 'completed'));

            if (order.status === 'pending') {
                trackOrderModal.querySelector('.status-step.pending').classList.add('active');
            } else if (order.status === 'processing') {
                trackOrderModal.querySelector('.status-step.pending').classList.add('completed');
                trackOrderModal.querySelector('.status-step.processing').classList.add('active');
            } else if (order.status === 'completed') {
                trackOrderModal.querySelector('.status-step.pending').classList.add('completed');
                trackOrderModal.querySelector('.status-step.processing').classList.add('completed');
                trackOrderModal.querySelector('.status-step.completed').classList.add('active');
            }

            trackingResultDiv.style.display = 'block';
        }

        function checkOrderStatusInModal() {
            const orderId = orderIdInputTracking.value.trim();
            if (!orderId) {
                alert('Silakan masukkan ID Pesanan.');
                return;
            }

            const orders = getOrdersFromLocalStorage();
            const foundOrder = orders.find(o => o.id === orderId);

            if (foundOrder) {
                displayTrackingDetails(foundOrder);
            } else {
                orderDetailsDiv.innerHTML = '<p>Pesanan tidak ditemukan.</p>';
                trackingResultDiv.style.display = 'block';
            }
        }
        

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Display all menu items initially
    displayMenuItems(menuItems);
    
    // Load any existing order from localStorage on page load
    updateOrderSummary();

    // Order Tracking Button
    orderTrackingBtn.addEventListener('click', showTrackOrderModal);
    trackOrderModalCloseBtn.addEventListener('click', closeTrackOrderModal);
    checkOrderBtn.addEventListener('click', checkOrderStatusInModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModal();
        }
        if (e.target === trackOrderModal) { // Tambahkan ini untuk modal tracking
            closeTrackOrderModal();
        }
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMenu(btn.dataset.category);
        });
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', checkout);
    
    // Close modal buttons
    closeModalBtn.addEventListener('click', closeModal);
    closeSuccessModalBtn.addEventListener('click', closeModal);
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModal();
        }
        
    });
    



});

