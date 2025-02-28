<?php
// إعداد الاتصال بقاعدة البيانات
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user"; // اسم قاعدة البيانات
$port = 3306;

$conn = new mysqli($host, $username, $password, $dbname, $port);

// التحقق من فشل الاتصال
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// جلب جميع الكتب من قاعدة البيانات
$sql = "SELECT * FROM books";  // استعلام لاختيار جميع الكتب من الجدول
$result = $conn->query($sql);

// التحقق من وجود بيانات
if ($result->num_rows > 0) {
    // إذا كانت هناك كتب في القاعدة
    while ($row = $result->fetch_assoc()) {
        // عرض البيانات داخل الجدول
        echo "<tr>";
        echo "<td>" . $row['title'] . "</td>";
        echo "<td>" . $row['author'] . "</td>";
        echo "<td>" . $row['price'] . "</td>";
        echo "<td>" . $row['quantity'] . "</td>";
        // زر الحذف مع إضافة data-id الذي يحمل ID الكتاب من قاعدة البيانات
        echo "<td><button class='delete-btn' data-id='" . $row['id'] . "'>Delete</button></td>";
        echo "</tr>";
    }
} else {
    echo "<tr><td colspan='5'>No products found.</td></tr>";
}

// إغلاق الاتصال بقاعدة البيانات
$conn->close();
?>
