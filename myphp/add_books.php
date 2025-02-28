<?php
session_start();

// إعداد الاتصال بقاعدة البيانات
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user"; // اسم قاعدة البيانات الخاصة بك
$port = 3306;

$conn = new mysqli($host, $username, $password, $dbname, $port);

// التحقق من فشل الاتصال
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// التحقق من وجود البيانات المرسلة عبر POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['title'], $_POST['author'], $_POST['price'], $_POST['quantity'], $_FILES['image'])) {
    $title = $_POST['title'];
    $author = $_POST['author'];
    $price = $_POST['price'];
    $quantity = $_POST['quantity'];

    // التعامل مع رفع الصورة
    $image = $_FILES['image'];
    $imageName = $image['name'];
    $imageTmpName = $image['tmp_name'];
    $imageSize = $image['size'];
    $imageError = $image['error'];

    // التأكد من عدم وجود أخطاء في رفع الصورة
    if ($imageError === 0) {
        $imageExt = strtolower(pathinfo($imageName, PATHINFO_EXTENSION));
        $allowedExts = ['jpg', 'jpeg', 'png', 'gif']; // أنواع الصور المسموح بها

        if (in_array($imageExt, $allowedExts)) {
            // توليد اسم جديد للصورة لتخزينها
            $newImageName = uniqid('', true) . '.' . $imageExt;
            $imageUploadPath = '../images/' . $newImageName;

            // نقل الصورة إلى مجلد الصور
            if (move_uploaded_file($imageTmpName, $imageUploadPath)) {
                // إدخال الكتاب إلى قاعدة البيانات
                $sql = "INSERT INTO books (title, author, price, quantity, image_url) VALUES (?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('ssdis', $title, $author, $price, $quantity, $newImageName);

                if ($stmt->execute()) {
                    echo "Product added successfully!";
                } else {
                    echo "Error adding product: " . $stmt->error;
                }

                $stmt->close();
            } else {
                echo "Error uploading image.";
            }
        } else {
            echo "Invalid image format. Only JPG, JPEG, PNG, and GIF are allowed.";
        }
    } else {
        echo "Error uploading image.";
    }
}

// إغلاق الاتصال بقاعدة البيانات
$conn->close();
?>
