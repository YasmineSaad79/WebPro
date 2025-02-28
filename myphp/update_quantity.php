<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'You must be logged in.']);
    exit();
}

$host = "localhost";
$username = "root";
$password = "";
$dbname = "user";
$port = 3306;

// الاتصال بقاعدة البيانات
$db = new mysqli($host, $username, $password, $dbname, $port);

if ($db->connect_errno) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $db->connect_error]);
    exit();
}

// قراءة البيانات القادمة من الـ AJAX
$data = json_decode(file_get_contents("php://input"), true);
$book_id = $data['book_id'];
$quantity = $data['quantity'];
$user_id = $_SESSION['user_id'];

// تحقق من أن الكمية أكبر من صفر
if ($quantity <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid quantity.']);
    exit();
}

// استرجاع سعر الكتاب من قاعدة البيانات
$getPriceQuery = "SELECT price FROM books WHERE id = ?";
$stmt = $db->prepare($getPriceQuery);
$stmt->bind_param("i", $book_id);
$stmt->execute();
$stmt->bind_result($price);
$stmt->fetch();
$stmt->close();

if (!$price) {
    echo json_encode(['status' => 'error', 'message' => 'Book not found.']);
    exit();
}

// حساب المجموع الجديد
$total_price = $price * $quantity;

// تحديث الكمية والمجموع في جدول السلة
$updateCartQuery = "UPDATE cart SET quantity = ?, total_price = ? WHERE user_id = ? AND book_id = ?";
$stmt = $db->prepare($updateCartQuery);
$stmt->bind_param("idii", $quantity, $total_price, $user_id, $book_id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Cart updated successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update cart.']);
}

$stmt->close();
$db->close();
?>
