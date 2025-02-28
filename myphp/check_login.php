<?php
session_start();

// تحقق إذا كان المستخدم مسجل دخوله
if (isset($_SESSION['user_id'])) {
    // إذا كان المستخدم مسجلاً
    echo json_encode(['logged_in' => true]);
} else {
    // إذا لم يكن المستخدم مسجلاً
    echo json_encode(['logged_in' => false]);
}
?>
