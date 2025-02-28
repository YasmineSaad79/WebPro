<?php
session_start();

// تمكين إظهار الأخطاء للتصحيح
error_reporting(E_ALL);
ini_set('display_errors', 1);

// إعدادات الاتصال بقاعدة البيانات
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user";
$port = 3306;

// تحقق إذا كانت البيانات قد تم إرسالها
$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->new_password)) {
    $email = $data->email;
    $newPassword = $data->new_password;

    // الاتصال بقاعدة البيانات
    $db = new mysqli($host, $username, $password, $dbname, $port);

    // التحقق من الاتصال بقاعدة البيانات
    if ($db->connect_errno) {
        echo json_encode(["status" => "error", "message" => "Database connection failed."]);
        exit();
    }

    // الاستعلام لتحديث كلمة المرور في قاعدة البيانات بدون تشفير
    $stmt = $db->prepare("UPDATE user_acounts1 SET password = ? WHERE email = ?");
    $stmt->bind_param("ss", $newPassword, $email);

    // تنفيذ الاستعلام
    if ($stmt->execute()) {
        // إذا تم التحديث بنجاح
        echo json_encode(["status" => "success", "message" => "Password changed successfully."]);
    } else {
        // في حالة فشل التحديث
        echo json_encode(["status" => "error", "message" => "Failed to update password."]);
    }

    // إغلاق الاستعلام والاتصال
    $stmt->close();
    $db->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
}
?>
