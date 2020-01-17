<?php
header('Access-Control-Allow-Origin: *');
$this_title = $_POST['title'];
$this_category = $_POST['category'];
$this_content = $_POST['content'];
$this_filename = $_POST['filename'];
$this_account = $_POST['account'];

$targetDir = "../../../../misbulletinfiles/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777);
}
$msg = [];
$nofileupload = false;
if (count($_FILES) != 0) {
    $filecanupload = true;
    $fileCount = count($_FILES['fileToUpload']['name']);
    for ($i = 0; $i < $fileCount; $i++) {
        $targetFile = $targetDir . basename($_FILES["fileToUpload"]["name"][$i]);
        // Check if file already exists
        if (file_exists($targetFile)) {
            array_push($msg, "檔名:'" . basename($_FILES["fileToUpload"]["name"][$i]) . "' 已經存在");
            array_push($msg, "新增失敗");
            $filecanupload = false;
        }
        // Check file size
        if ($_FILES["fileToUpload"]["size"][$i] > 1000000) {
            array_push($msg, "檔名:'" . basename($_FILES["fileToUpload"]["name"][$i]) . "' 檔案太大");
            array_push($msg, "新增失敗");
            $filecanupload = false;
        }
    }
    if (!$filecanupload) {
        echo json_encode($msg);
        exit;
    }
} else {
    $nofileupload = true;
}
$url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/commonuse/register/misBulletin?uid=@sapido@PaaS";
//The JSON data.
$data = array(
    "seq" => [""],
    "category" => ["$this_category"],
    "title" => ["$this_title"],
    "content" => ["$this_content"],
    "filename" => ["$this_filename"],
    "showhide" => ["1"],
    "creatorID" => ["$this_account"],
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
        if ($nofileupload) {
            array_push($msg, "資料新增成功");
            echo json_encode($msg);
            exit;
        }
        $fileCount = count($_FILES['fileToUpload']['name']);
        for ($i = 0; $i < $fileCount; $i++) {
            $targetFile = $targetDir . basename($_FILES["fileToUpload"]["name"][$i]);
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"][$i], $targetFile)) {
                $success++;
            } else {
                array_push($msg, "檔名:" . basename($_FILES["fileToUpload"]["name"][$i]) . "上傳失敗");
            }
        }
        if ($success === $fileCount) {
            array_push($msg, "資料、檔案上傳成功");
        }
        echo json_encode($msg);
        exit;
    } else if ($key == 'Response' && $value != 'ok') {
        echo json_encode($Arr);
        exit;
    }
}
