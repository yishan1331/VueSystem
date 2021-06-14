<?php
//https://blog.csdn.net/leedaning/article/details/72781734
if (filter_var($_SERVER['HTTP_HOST'], FILTER_VALIDATE_IP)) {
    $publicIP = $_SERVER['HTTP_HOST'];
} else {
    $publicIP = "192.168.88.75";
}
$publicPort = "3687";
