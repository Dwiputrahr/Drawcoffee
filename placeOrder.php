    <?php
    require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php'; // Sesuaikan path jika perlu

    // Set your Merchant Server Key
    \Midtrans\Config::$serverKey = 'Mid-server-XNJwZs2I1km7mTRvHRQRFxit'; // Ganti dengan Server Key Anda
    // Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
    \Midtrans\Config::$isProduction = false; // Ganti menjadi true jika sudah di Production
    // Set sanitization on (default)
    \Midtrans\Config::$isSanitized = true;
    // Set 3DS authentication for credit card (default)
    \Midtrans\Config::$is3ds = true;

header("Access-Control-Allow-Origin: https://drawcoffee.vercel.app");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
// ... kode lainnya ...

    header('Content-Type: application/json');

    $input = file_get_contents('php://input');
    $orderData = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['error' => 'Invalid JSON input', 'message' => json_last_error_msg()]);
        exit;
    }

    if (empty($orderData) || !isset($orderData['id'], $orderData['customer'], $orderData['total'], $orderData['items'])) {
        echo json_encode(['error' => 'Missing required order data']);
        exit;
    }

    $order_id = $orderData['id'];
    $customer_name = $orderData['customer'];
    $total_price = $orderData['total'];
    $items = $orderData['items'];

    // Prepare item details for Midtrans
    $item_details = [];
    foreach ($items as $item) {
        $item_details[] = [
            'id'       => $item['id'],
            'price'    => $item['price'],
            'quantity' => $item['quantity'],
            'name'     => $item['title'],
        ];
    }

    // Optional: Add shipping/handling fee if any
    // $item_details[] = [
    //     'id'       => 'shipping',
    //     'price'    => 10000, // Example shipping fee
    //     'quantity' => 1,
    //     'name'     => 'Biaya Pengiriman',
    // ];

    // Customer details
    $customer_details = [
        'first_name' => $customer_name,
        'last_name'  => '', // Anda bisa memecah nama depan/belakang jika ada
        'email'      => 'customer@example.com', // Ganti dengan email pelanggan jika ada
        'phone'      => '08123456789', // Ganti dengan nomor telepon pelanggan jika ada
    ];

    // Transaction details
    $transaction_details = [
        'order_id'     => $order_id,
        'gross_amount' => $total_price,
    ];

    // Optional: Custom expiry for transaction
    // $custom_expiry = [
    //     'start_time' => date('Y-m-d H:i:s O'),
    //     'unit'       => 'minute',
    //     'sum'        => 15
    // ];

    $params = [
        'transaction_details' => $transaction_details,
        'item_details'        => $item_details,
        'customer_details'    => $customer_details,
        // 'custom_expiry'       => $custom_expiry, // Uncomment if you want to set custom expiry
    ];

    try {
        $snapToken = \Midtrans\Snap::getSnapToken($params);
        echo json_encode(['token' => $snapToken]);
    } catch (Exception $e) {
        error_log("Midtrans Error: " . $e->getMessage()); // Log error for debugging
        echo json_encode(['error' => 'Failed to get Snap token', 'message' => $e->getMessage()]);
    }
    ?>
    
