<?php
header('Access-Control-Allow-Origin: *');
$this_title = $_POST['title'];
$this_date = $_POST['date'];
$this_filename = $_POST['filename'];
$this_depID = $_POST['depID'];
$this_account = $_POST['account'];


// https://www.itread01.com/content/1548580524.html
// https://www.php.net/manual/en/ziparchive.open.php
function zip($fromName, $toName)
{
    if (!file_exists($fromName)) {
        return FALSE;
    }
    $zipArc = new ZipArchive();
    if (!$zipArc->open($toName, ZipArchive::CREATE)) {
        return FALSE;
    }
    $res = is_dir($fromName) ? $zipArc->addGlob("{$fromName}/*") : $zipArc->addFile($fromName);
    if (!$res) {
        $zipArc->close();
        return FALSE;
    }
    return $zipArc->close();
}

$targetDir = "../../../meetingminutesfiles/";
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
        // // Check file size
        // if ($_FILES["fileToUpload"]["size"][$i] > 1000000) {
        //     array_push($msg, "檔名:'" . basename($_FILES["fileToUpload"]["name"][$i]) . "' 檔案太大");
        //     array_push($msg, "新增失敗");
        //     $filecanupload = false;
        // }
    }
    if (!$filecanupload) {
        echo json_encode($msg);
        return;
    }
} else {
    $nofileupload = true;
}
$url = "https://192.168.39.75:3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/meetingMinutes?uid=@sapido@PaaS";
//The JSON data.
$data = array(
    "seq" => [""],
    "title" => ["$this_title"],
    "date" => ["$this_date"],
    "depID" => ["$this_depID"],
    "filename" => ["$this_filename"],
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
            return;
        }
        $fileCount = count($_FILES['fileToUpload']['name']);
        for ($i = 0; $i < $fileCount; $i++) {
            $finalfilename = $_FILES["fileToUpload"]["name"][$i];
            $targetFile = $targetDir . basename($finalfilename);
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"][$i], $targetFile)) {
                $success++;
                if (zip($targetDir . "/" . $finalfilename, $targetDir . "/" . $finalfilename . '.zip')) {
                    //若壓縮成功將原檔案刪除
                    if (file_exists($targetDir . "/" . $finalfilename)) {
                        unlink($targetDir . "/" . $finalfilename); //將檔案刪除
                    }
                }
            } else {
                array_push($msg, "檔名:" . basename($finalfilename) . "上傳失敗");
            }
        }
        if ($success === $fileCount) {
            array_push($msg, "資料、檔案上傳成功");
        }
        echo json_encode($msg);
        return;
    } else if ($key == 'Response' && $value != 'ok') {
        echo json_encode($Arr);
        return;
    }
}
