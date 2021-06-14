<?php
date_default_timezone_set("Asia/Taipei");
include("../../globalvar.php");
$postBody = file_get_contents("php://input");
$postBody = json_decode($postBody);
$this_seq = $postBody->seq;
$this_filename = $postBody->filename;
$this_path = $postBody->path;

$smbRootDir = "100.智能製造事業群/01.共用資源/01會議記錄/" . $this_path;

$nofiledelete = false;
$filecandelete = true;
$msg = [];
if ($this_filename == "") {
    $nofiledelete = true;
} else {
    $fileCount = count($this_filename);
    $success = 0;
    for ($i = 0; $i < $fileCount; $i++) {
        $thisfile = $this_filename[$i];
        exec("smbclient -c 'rm \"$thisfile\"' //192.168.88.100/sapidofile/ -D \"$smbRootDir\" -U mis_system%sapido123", $output, $return_var);
        if ($return_var) {
            array_push($msg, "SMB server 88.100檔案刪除失敗");
            $filecandelete = false;
        } else {
            $success++;
        }
    }
    if (!$filecandelete) {
        echo json_encode($msg);
        return;
    }
}
$url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/meetingMinutes?uid=@sapido@PaaS";
//The JSON data.
$data = array(
    "seq" => ["$this_seq"],
);
$options = array(
    'http' => array(
        'method' => 'DELETE',
        'content' => json_encode($data),
        'header' => "Content-Type: application/json\r\n" .
            "Accept: application/json\r\n"
    ),
    "ssl" => array(
        "verify_peer" => false,
        "verify_peer_name" => false,
    ),
);

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$Arr = json_decode($result, true);
foreach ($Arr as $key => $value) {
    if ($key == 'Response' && $value == 'ok') { //先抓是否抓取成功，成功的話繼續執行
        if ($nofiledelete) {
            array_push($msg, "資料刪除成功");
            echo json_encode($msg);
            return;
        }
        if ($success === $fileCount) {
            array_push($msg, "資料、檔案刪除成功");
        }
        echo json_encode($msg);
        return;
    } else if ($key == 'Response' && $value != 'ok') {
        echo json_encode($Arr);
        return;
    }
}
