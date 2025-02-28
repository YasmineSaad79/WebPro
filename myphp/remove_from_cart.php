<?php
session_start();

// قراءة البيانات القادمة من الطلب
$requestPayload = file_get_contents('php://input');
$data = json_decode($requestPayload, true);

// التحقق من صحة الطلب
if (!isset($_SESSION['user_id']) || !isset($data['book_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    exit();
}

// الحصول على معرّفات المستخدم والكتاب
$user_id = $_SESSION['user_id'];
$book_id = $data['book_id'];

// الاتصال بقاعدة البيانات
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user"; // اسم قاعدة البيانات
$port = 3306;

$db = new mysqli($host, $username, $password, $dbname, $port);
if ($db->connect_errno) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit();
}

// حذف الكتاب من السلة
$deleteQuery = "DELETE FROM cart WHERE user_id = ? AND book_id = ?";
$stmt = $db->prepare($deleteQuery);
$stmt->bind_param("ii", $user_id, $book_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to remove item from cart']);
}

// إغلاق الاتصال
$stmt->close();
$db->close();
?>
