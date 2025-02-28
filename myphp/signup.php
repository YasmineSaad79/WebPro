<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
$fn=0;
$ln=0;
$uPass=0;
$uEmail=0;
$uGender='';
if(isset($_POST['first-name']) and isset($_POST['last-name']) and isset($_POST['email']) and isset($_POST['password'])
and !empty($_POST['first-name']) and !empty($_POST['last-name']) and !empty($_POST['email']) and !empty($_POST['password']))  {

    $fn= $_POST['first-name'];
    $ln = $_POST['last-name'];
    $uEmail = $_POST['email'];
    $uPass = $_POST['password'];
    $uGender = $_POST['gender'];


    $host = "localhost";
    $username = "root";
    $password = "";
    $dbname = "user";
    $port = 3306;

    $db = new mysqli($host, $username, $password, $dbname, $port);
    $qs = "INSERT INTO user_acounts1 (first_name, last_name, email, password, gender) VALUES ('$fn', '$ln', '$uEmail', '$uPass', '$uGender')";
    $db->query($qs);
    $db-> commit();
    $db->close();

}
?>
















<!--<!doctype html>-->
<!--<html lang="en">-->
<!--<head>-->
<!--    <meta charset="UTF-8">-->
<!--    <meta name="viewport"-->
<!--          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">-->
<!--    <meta http-equiv="X-UA-Compatible" content="ie=edge">-->
<!--    <title>Document</title>-->
<!--</head>-->
<!--<body>-->
<!---->
<!--<form action="signup.php" method="post">-->
<!--    <table>-->
<!--        <tr>-->
<!--            <td>choose user login :</td>-->
<!--            <td><input type="text" name="txtuLogin" id="txtuLogin"></td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--            <td>write your new password:</td>-->
<!--            <td><input type="text" name="txtuPass" id=""></td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--            <td></td>-->
<!--            <td><input type="submit" value="register"></td>-->
<!--        </tr>-->
<!---->
<!--    </table>-->
<!--</form>-->






