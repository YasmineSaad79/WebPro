<?php
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'C:/xampp/htdocs/BookStore/myphp/phpmailer-master/src/Exception.php';
require 'C:/xampp/htdocs/BookStore/myphp/phpmailer-master/src/PHPMailer.php';
require 'C:/xampp/htdocs/BookStore/myphp/phpmailer-master/src/SMTP.php';
require 'C:/xampp/htdocs/BookStore/myphp/vendor/autoload.php';


header('Content-Type: application/json');

// استقبال البيانات
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['email'])) {
    $email = $data['email'];

    // الاتصال بقاعدة البيانات "user"
    $db = new mysqli('localhost', 'root', '', 'user');

    if ($db->connect_error) {
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $db->connect_error]);
        exit();
    }

    // التحقق إذا كان الإيميل موجودًا في قاعدة البيانات
    $stmt = $db->prepare("SELECT email FROM user_acounts1 WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // إنشاء رمز OTP
        $otp_code = rand(100000, 999999);

        // تخزين رمز OTP في قاعدة البيانات "users" في جدول reset_requests
        $stmt = $db->prepare("INSERT INTO reset_requests (email, otp_code, created_at, is_verified) VALUES (?, ?, NOW(), 0)");
        $stmt->bind_param('ss', $email, $otp_code);

        if ($stmt->execute()) {
            // إرسال البريد الإلكتروني باستخدام PHPMailer
            try {
                $mail = new PHPMailer(true);

                // إعدادات SMTP
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 's12112317@stu.najah.edu'; // بريدك الإلكتروني
                $mail->Password = 'mlmm fxgr bmpb ifcl'; // كلمة مرور التطبيق الخاصة بـ Gmail
                $mail->SMTPSecure = 'ssl';
                $mail->Port = 465;

                // إعداد المرسل والمستقبل
                $mail->setFrom('s12112317@stu.najah.edu');
                $mail->addAddress($email);  // إضافة البريد الإلكتروني للمستقبل

                // إعدادات البريد
                $mail->isHTML(true);
                $mail->Subject = 'Password Reset Code';
                $mail->Body = "Your OTP Code is: $otp_code";

                // إرسال البريد
                $mail->send();

                echo json_encode(['status' => 'success', 'message' => 'Reset code sent to your email!']);
            } catch (Exception $e) {
                echo json_encode(['status' => 'error', 'message' => 'Failed to send reset code via PHPMailer. Error: ' . $mail->ErrorInfo]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to store OTP in database.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Email not found in our records.']);
    }

    $stmt->close();
    $db->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Email is required.']);
}
?>
