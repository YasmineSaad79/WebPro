<?php
// التحقق من أن ID الكتاب موجود
if (isset($_POST['book_id'])) {
    $book_id = $_POST['book_id'];

    // إعداد الاتصال بقاعدة البيانات
    $host = "localhost";
    $username = "root";
    $password = "";
    $dbname = "user";  // اسم قاعدة البيانات
    $port = 3306;

    $conn = new mysqli($host, $username, $password, $dbname, $port);

    // التحقق من فشل الاتصال
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // استعلام لحذف الكتاب باستخدام ID
    $sql = "DELETE FROM books WHERE id = ?";

    // تحضير الاستعلام
    if ($stmt = $conn->prepare($sql)) {
        // ربط المعاملات
        $stmt->bind_param("i", $book_id);

        // تنفيذ الاستعلام
        if ($stmt->execute()) {
            echo "success"; // إرجاع "success" إذا تم الحذف بنجاح
        } else {
            echo "Error: Could not delete book.";
        }

        // إغلاق الاستعلام
        $stmt->close();
    } else {
        echo "Error: Could not prepare statement.";
    }

    // إغلاق الاتصال بقاعدة البيانات
    $conn->close();
} else {
    echo "No book ID provided.";
}
?>
