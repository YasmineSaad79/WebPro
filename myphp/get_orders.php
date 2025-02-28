<?php
session_start();

// تأكد من أن المستخدم مسجل الدخول
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit();
}

// معلومات قاعدة البيانات
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user";
$port = 3306;

$db = new mysqli($host, $username, $password, $dbname, $port);

if ($db->connect_errno) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit();
}

// استعلام لجلب كل الطلبات من الجدول "orders"
$query = "SELECT name, address, phone, email, notes, date FROM orders";
$result = $db->query($query);

// تحقق إذا كانت هناك بيانات
if ($result->num_rows > 0) {
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    echo json_encode(['status' => 'success', 'orders' => $orders]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No orders found']);
}

$db->close();
?>
