<?php
session_start();

header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents('php://input'), true);

// تحقق من أن البريد الإلكتروني ورمز OTP تم إرسالهما
if (isset($data['email']) && isset($data['otp_code'])) {
    $email = $data['email'];
    $otp_code = $data['otp_code'];

    // الاتصال بقاعدة البيانات "users"
    $db = new mysqli('localhost', 'root', '', 'user');
    if ($db->connect_error) {
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $db->connect_error]);
        exit();
    }

    // تحقق من وجود الرمز في قاعدة البيانات "users" في جدول reset_requests
    $stmt = $db->prepare("SELECT * FROM reset_requests WHERE email = ? AND otp_code = ? AND is_verified = 0");
    $stmt->bind_param('ss', $email, $otp_code);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // تحديث حالة الرمز إلى "تم التحقق"
        $updateStmt = $db->prepare("UPDATE reset_requests SET is_verified = 1 WHERE email = ? AND otp_code = ?");
        $updateStmt->bind_param('ss', $email, $otp_code);
        $updateStmt->execute();

        echo json_encode(['status' => 'success', 'message' => 'OTP verified successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid OTP code.']);
    }

    $stmt->close();
    $db->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Email and OTP are required.']);
}
?>
