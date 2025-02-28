<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

$user_id = $_SESSION['user_id'];

// الاتصال بقاعدة البيانات
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user";
$port = 3306;

$db = new mysqli($host, $username, $password, $dbname, $port);
if ($db->connect_errno) {
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// استعلام لجلب الكتاب المفضل مع الصورة
$query = "SELECT b.id, b.title, b.author, b.price, b.image_url FROM books b
          JOIN favorites f ON b.id = f.book_id WHERE f.user_id = ?";

$stmt = $db->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$favorites = [];
while ($row = $result->fetch_assoc()) {
    $favorites[] = $row;
}

echo json_encode(['favorites' => $favorites]);

$stmt->close();
$db->close();
?>
