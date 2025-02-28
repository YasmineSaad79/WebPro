<?php
session_start();

// تأكد من أن المستخدم مسجل الدخول
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit();
}

// معلومات الاتصال بقاعدة البيانات
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user";
$port = 3306;

$db = new mysqli($host, $username, $password, $dbname, $port);

if ($db->connect_errno) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $db->connect_error]);
    exit();
}

// قراءة البيانات القادمة من الطلب
$data = json_decode(file_get_contents('php://input'), true);

// التحقق من البيانات المستلمة
error_log("Received data: " . json_encode($data));

$name = trim($data['name'] ?? '');
$address = trim($data['address'] ?? '');
$phone = trim($data['phone'] ?? '');
$email = trim($data['email'] ?? '');
$notes = trim($data['notes'] ?? '');
$date = $data['date'] ?? '';

// التحقق من الحقول الأساسية
if (empty($name) || empty($address) || empty($phone) || empty($email) || empty($date)) {
    error_log("Missing required fields: " . json_encode($data));
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit();
}

// إضافة البيانات إلى جدول "orders"
$user_id = $_SESSION['user_id'];
$query = "INSERT INTO orders (user_id, name, address, phone, email, notes, date) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $db->prepare($query);

if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $db->error]);
    exit();
}

$stmt->bind_param("issssss", $user_id, $name, $address, $phone, $email, $notes, $date);

// تحقق من نتيجة التنفيذ
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Order placed successfully']);
} else {
    error_log("Execute failed: " . $stmt->error);
    echo json_encode(['status' => 'error', 'message' => 'Failed to place order']);
}

$stmt->close();
$db->close();
?>
