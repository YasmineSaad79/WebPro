<?php
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'myphp/phpmailer-master/src/Exception.php';
require 'myphp/phpmailer-master/src/PHPMailer.php';
require 'myphp/phpmailer-master/src/SMTP.php';




if (isset($_POST["send"])) {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 's12112317@stu.najah.edu'; // بريدك الإلكتروني
    $mail->Password = 'mlmm fxgr bmpb ifcl'; // كلمة مرور التطبيق
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // استخدام التشفير الصحيح
    $mail->Port = 465; // المنفذ الصحيح


    $mail->setFrom('s12112317@stu.najah.edu'); // بريدك الإلكتروني
    $mail->addAddress($_POST["email"]);  // إضافة البريد الإلكتروني للمستقبل من النموذج

    $mail->isHTML(true);

    $mail->Subject = $_POST["subject"];
    $mail->Body = $_POST["message"];

    $mail->send();


}
?>
