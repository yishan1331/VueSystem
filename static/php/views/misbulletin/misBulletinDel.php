<?php
date_default_timezone_set("Asia/Taipei");
$postBody = file_get_contents("php://input");
$postBody = json_decode($postBody);
$this_seq = $postBody->seq;
$this_filename = $postBody->filename;
$nofiledelete = false;
if ($this_filename == "") {
    $nofiledelete = true;
} else {
    $targetDir = "../../../../misbulletinfiles/";
}
$msg = [];

$url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/commonuse/delete/misBulletin?uid=@sapido@PaaS";
//The JSON data.
$data = array(
    "seq" => ["$this_seq"],
);
$options = array(
    'http' => array(
        'method' => 'POST',
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
$success = 0;
foreach ($Arr as $key => $value) {
    if ($key == 'Response' && $value == 'ok') { //先抓是否抓取成功，成功的話繼續執行
        if ($nofiledelete) {
            array_push($msg, "資料刪除成功");
            echo json_encode($msg);
            exit;
        }
        $fileCount = count($this_filename);
        for ($i = 0; $i < $fileCount; $i++) {
            $delpath = $targetDir . $this_filename[$i];
            if (file_exists($delpath)) {
                unlink($delpath);
            }
            $success++;
        }
        if ($success === $fileCount) {
            array_push($msg, "資料、檔案刪除成功");
        }
        echo json_encode($msg);
        exit;
    } else if ($key == 'Response' && $value != 'ok') {
        echo json_encode($Arr);
        exit;
    }
}
