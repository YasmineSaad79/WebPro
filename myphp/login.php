<?php
session_start();

// تفعيل الإبلاغ عن الأخطاء لتسهيل تصحيح الكود
error_reporting(E_ALL);
ini_set('display_errors', 1);

// إعدادات قاعدة البيانات
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user";
$port = 3306;

// التحقق من إرسال البريد الإلكتروني وكلمة المرور
if (isset($_POST['email']) && isset($_POST['password'])) {
    // استلام القيم من النموذج
    $uEmail = $_POST['email'];
    $uPass = $_POST['password'];

    // الاتصال بقاعدة البيانات
    $db = new mysqli($host, $username, $password, $dbname, $port);

    // التحقق من الاتصال بقاعدة البيانات
    if ($db->connect_errno) {
        die("Database connection failed: " . $db->connect_error);
    }

    // استعلام لاسترجاع بيانات المستخدم من جدول المستخدمين
    $stmt = $db->prepare("SELECT id, first_name, password FROM user_acounts1 WHERE email = ?");
    $stmt->bind_param("s", $uEmail);
    $stmt->execute();
    $stmt->store_result();

    // إذا تم العثور على المستخدم
    if ($stmt->num_rows > 0) {
        // ربط النتائج بالمتحولات
        $stmt->bind_result($userId, $firstName, $hashedPassword);
        $stmt->fetch();

        // التحقق من صحة كلمة المرور
        if ($uPass === $hashedPassword) {
            // إذا كانت كلمة المرور صحيحة، قم بتخزين معرف المستخدم في الجلسة
            $_SESSION['user_id'] = $userId;

            // إرسال استجابة ناجحة
            echo "success:$firstName"; // يمكن إرسال اسم المستخدم أو أي بيانات أخرى
            exit();
        } else {
            // إذا كانت كلمة المرور غير صحيحة
            echo "error";
            exit();
        }
    } else {
        // إذا لم يتم العثور على المستخدم بالبريد الإلكتروني
        echo "error";
        exit();
    }

    // إغلاق الاتصال بالقاعدة
    $stmt->close();
    $db->close();
} else {
    // إذا لم يتم إرسال البريد الإلكتروني أو كلمة المرور
    echo "error";
    exit();
}
?>
