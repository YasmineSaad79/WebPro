<?php
session_start();
// تحقق من أن المستخدم مسجل دخوله
if (!isset($_SESSION['user_id'])) {
    echo "You must be logged in to view your favorites.";
    exit();
}

// الاتصال بقاعدة البيانات
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user";
$port = 3306;

$db = new mysqli($host, $username, $password, $dbname, $port);
if ($db->connect_errno) {
    echo "Database connection failed: " . $db->connect_error;
    exit();
}

$user_id = $_SESSION['user_id'];
$query = "SELECT b.id, b.title, b.author, b.price FROM books b
          JOIN favorites f ON b.id = f.book_id WHERE f.user_id = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();



$stmt->close();
$db->close();
