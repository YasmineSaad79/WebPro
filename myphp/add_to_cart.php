<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    echo "You must be logged in to add to the cart.";
    exit();
}

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

if (isset($_POST['book_id'])) {
    $user_id = $_SESSION['user_id'];
    $book_id = $_POST['book_id'];

    $checkQuery = "SELECT * FROM cart WHERE user_id = ? AND book_id = ? ";
    $stmt = $db->prepare($checkQuery);
    $stmt->bind_param("ii", $user_id, $book_id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows == 0) {
        $insertQuery = "INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, 1)";
        $stmt = $db->prepare($insertQuery);
        $stmt->bind_param("ii", $user_id, $book_id);
        $stmt->execute();

        echo "Book added to cart successfully!";
    } else {
        echo "This book is already in your cart!";
    }

    $stmt->close();
    $db->close();
} else {
    echo "No book selected.";
}
?>
