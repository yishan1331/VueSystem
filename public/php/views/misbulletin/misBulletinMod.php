<?php
header('Access-Control-Allow-Origin: *');
$this_seq = $_POST['seq'];
$url = "https://192.168.39.75:3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/misBulletin?uid=@sapido@PaaS";
$nofileupload = false;
$targetDir = "../../../misbulletinfiles/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777);
}
$msg = [];

if ($_POST['deletefile'] == "") {
    $this_seq = $_POST['seq'];
    $this_title = $_POST['title'];
    $this_category = $_POST['category'];
    $this_filename = $_POST['filename'];
    $this_content = $_POST['content'];
    $this_showhide = $_POST['showhide'];
    $this_account = $_POST['account'];
    if ($this_showhide == "true") {
        $this_showhide = 1;
    } else {
        $this_showhide = 0;
    }

    if (count($_FILES) != 0) {
        // $filecanupload = true;
        // $fileCount = count($_FILES['fileToUpload']['name']);
        // for ($i = 0; $i < $fileCount; $i++) {
        //     $targetFile = $targetDir . basename($_FILES["fileToUpload"]["name"][$i]);
        //     // Check file size < 10MB(1024*1024*10)
        //     if ($_FILES["fileToUpload"]["size"][$i] > (1024*1024*10)) {
        //         array_push($msg, "檔名:'" . basename($_FILES["fileToUpload"]["name"][$i]) . "' 檔案太大");
        //         array_push($msg, "修改失敗");
        //         $filecanupload = false;
        //     }
        // }
        // if (!$filecanupload) {
        //     echo json_encode($msg);
        //     exit;
        // }
    } else {
        $nofileupload = true;
    }
    //The JSON data.
    if ($this_filename != "") {
        $data = array(
            "old_seq" => ["$this_seq"],
            "category" => ["$this_category"],
            "title" => ["$this_title"],
            "content" => ["$this_content"],
            "filename" => ["$this_filename"],
            "showhide" => ["$this_showhide"],
            "creatorID" => ["$this_account"],
        );
    } else {
        $data = array(
            "old_seq" => ["$this_seq"],
            "category" => ["$this_category"],
            "title" => ["$this_title"],
            "content" => ["$this_content"],
            "showhide" => ["$this_showhide"],
            "creatorID" => ["$this_account"],
        );
    }
} else {
    $this_deletefile = $_POST['deletefile'];
    $this_remainfile = $_POST['remainfile'];
    $data = array(
        "old_seq" => ["$this_seq"],
        "filename" => ["$this_remainfile"],
    );
}

$options = array(
    'http' => array(
        'method' => 'PATCH',
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
            array_push($msg, "資料修改成功");
            echo json_encode($msg);
            exit;
        }
        if ($_POST['deletefile'] == "") {
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
        } else {
            $delpath = $targetDir . $this_deletefile;
            if (file_exists($delpath)) {
                unlink($delpath);
                array_push($msg, "檔案刪除成功");
            }
        }
        echo json_encode($msg);
        exit;
    } else if ($key == 'Response' && $value != 'ok') {
        echo json_encode($Arr);
        exit;
    }
}
