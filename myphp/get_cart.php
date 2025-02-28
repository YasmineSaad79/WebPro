<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit();
}

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

$user_id = $_SESSION['user_id'];
$query = "SELECT c.book_id, b.title AS book_title, b.price, c.quantity, (b.price * c.quantity) AS total, b.image_url
          FROM cart c
          INNER JOIN books b ON c.book_id = b.id
          WHERE c.user_id = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$cart = [];

while ($row = $result->fetch_assoc()) {
    $cart[] = $row;
}

echo json_encode(['status' => 'success', 'cart' => $cart]);

$stmt->close();
$db->close();
?>
