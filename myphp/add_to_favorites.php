<?php
session_start();

// تحقق من أن المستخدم مسجل دخوله
if (!isset($_SESSION['user_id'])) {
    echo "You must be logged in to add to favorites.";
    exit();
}

// الاتصال بقاعدة البيانات
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user";
$port = 3306;

$db = new mysqli($host, $username, $password, $dbname, $port);

// التحقق من الاتصال بقاعدة البيانات
if ($db->connect_errno) {
    echo "Database connection failed: " . $db->connect_error;
    exit();
}

// تحقق إذا تم إرسال كتاب عبر POST
if (isset($_POST['book_id'])) {
    $user_id = $_SESSION['user_id']; // استرجاع معرف المستخدم من الجلسة
    $book_id = $_POST['book_id']; // استرجاع معرف الكتاب

    // التحقق إذا كان الكتاب بالفعل في المفضلة
    $checkQuery = "SELECT * FROM favorites WHERE user_id = ? AND book_id = ?";
    $stmt = $db->prepare($checkQuery);
    $stmt->bind_param("ii", $user_id, $book_id);
    $stmt->execute();
    $stmt->store_result();

    // إذا الكتاب غير موجود في المفضلة، أضفه
    if ($stmt->num_rows == 0) {
        $insertQuery = "INSERT INTO favorites (user_id, book_id) VALUES (?, ?)";
        $stmt = $db->prepare($insertQuery);
        $stmt->bind_param("ii", $user_id, $book_id);
        $stmt->execute();

        echo "Book added to favorites successfully!";
    } else {
        echo "This book is already in your favorites!";
    }

    $stmt->close();
    $db->close();
} else {
    echo "No book selected.";
}
?>
