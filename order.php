<?php
$name 	= $_POST["name"];
$phone 	= $_POST["phone"];	
$email 	= $_POST["email"];	
$goods  = $_POST["goods"];	
$to		= "login@gmail.com";

$user_message = "Вы заказали:".$goods;
$shop_message = "Заказ с сайта:".$goods."<br>Имя:".$name."<br>Контакты:".$phone." ".$email;
$subject = "Заказ с сайта";
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: order@shop.com" . "\r\n";

mail($email,$subject,$user_message,$headers);
mail($to,$subject,$shop_message,$headers);
?>{"message" : "Заказ принят. Менеджер свяжется с Вами в течении часа"}