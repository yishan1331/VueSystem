<?php
header('Access-Control-Allow-Origin: *');
include("../../globalvar.php");
$this_title = $_POST['title'];
$this_date = $_POST['date'];
$this_filename = $_POST['filename'];
$this_depID = $_POST['depID'];
$this_path = $_POST['path'];
$this_level = $_POST['level'];
$this_account = $_POST['account'];

$targetDir = "../../../meetingminutesfiles";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777);
}
$smbRootDir = "100.智能製造事業群/01.共用資源/01會議記錄/" . $this_path;

//先上傳檔案再新增資料
$msg = [];
$nofileupload = false;
if (count($_FILES) != 0) {
    $fileCount = count($_FILES['fileToUpload']['name']);
    $filecanupload = true;
    $success = 0;
    for ($i = 0; $i < $fileCount; $i++) {
        $finalfilename = $_FILES["fileToUpload"]["name"][$i];
        $targetFile = $targetDir . "/" . basename($finalfilename);
        // Check if file already exists
        if (file_exists($targetFile)) {
            array_push($msg, "檔名:'" . basename($_FILES["fileToUpload"]["name"][$i]) . "' 已經存在");
            array_push($msg, "新增失敗");
            $filecanupload = false;
        } else {
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"][$i], $targetFile)) {
                $success++;
                //進行壓縮
                // if (zip($targetDir . "/" . $finalfilename, $targetDir . "/" . $finalfilename . '.zip', $finalfilename)) {
                //     //若壓縮成功將原檔案刪除
                //     if (file_exists($targetDir . "/" . $finalfilename)) {
                //         unlink($targetDir . "/" . $finalfilename); //將檔案刪除
                //     }
                // }
            } else {
                array_push($msg, "檔名:" . basename($finalfilename) . "上傳失敗");
                array_push($msg, "系統將此次上傳檔案全部刪除");
                //若新增到後面檔案發生錯誤，把之前新增的全部刪除，以免不一致
                $filecanupload = false;
                fileUploadFailGoToUnlink($targetDir, $smbRootDir, true);
            }
        }
        // // Check file size
        // if ($_FILES["fileToUpload"]["size"][$i] > 1000000) {
        //     array_push($msg, "檔名:'" . basename($_FILES["fileToUpload"]["name"][$i]) . "' 檔案太大");
        //     array_push($msg, "新增失敗");
        //     $filecanupload = false;
        // }
    }
    //所有檔案已成功上傳至主機server再一併傳入88.100
    //smbclient參數介紹http://manpages.ubuntu.com/manpages/bionic/zh_TW/man1/smbclient.1.html
    //smbclient lcd為改變當前工作目錄 prompt OFF為關閉詢問提示 mput上傳當前目錄內所有匹配的文件 https://indradjy.wordpress.com/2010/04/14/getting-whole-folder-using-smbclient/
    exec("smbclient -c 'lcd $targetDir;prompt OFF;mput *' //192.168.88.100/sapidofile/ -D \"$smbRootDir\" -U mis_system%sapido123", $output, $return_var);
    //exec $return_var 0為執行成功 1為失敗 https://my.oschina.net/junn/blog/93028
    if (!$return_var) {
        //將client上傳的檔案成功傳送至88.100後，將本機的檔案刪除
        fileUploadFailGoToUnlink($targetDir, $smbRootDir, true);
    } else {
        array_push($msg, "檔案上傳至88.100失敗");
        array_push($msg, "系統將此次上傳檔案全部刪除");
        fileUploadFailGoToUnlink($targetDir, $smbRootDir, false);
        $filecanupload = false;
    }
    if (!$filecanupload) {
        echo json_encode($msg);
        return;
    }
} else {
    $nofileupload = true;
}

$url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/meetingMinutes?uid=@sapido@PaaS";
//The JSON data.
$data = array(
    "seq" => [""],
    "title" => ["$this_title"],
    "date" => ["$this_date"],
    "depID" => ["$this_depID"],
    "filename" => ["$this_filename"],
    "path" => ["$this_path"],
    "level" => ["$this_level"],
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
foreach ($Arr as $key => $value) {
    if ($key == 'Response' && $value == 'ok') { //先抓是否抓取成功，成功的話繼續執行
        if ($nofileupload) {
            array_push($msg, "資料新增成功");
            echo json_encode($msg);
            return;
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

// https://www.itread01.com/content/1548580524.html
// https://www.php.net/manual/en/ziparchive.open.php
// https://segmentfault.com/q/1010000010558345 -> addFile()內的第二個參數為壓縮檔案的目錄結構，若不設定則預設為第一個參數的目錄結構
function zip($fromName, $toName, $filename)
{
    if (!file_exists($fromName)) {
        return FALSE;
    }
    $zipArc = new ZipArchive();
    if (!$zipArc->open($toName, ZipArchive::CREATE)) {
        return FALSE;
    }
    $res = is_dir($fromName) ? $zipArc->addGlob("{$fromName}/*") : $zipArc->addFile($fromName, "./" . $filename);
    if (!$res) {
        $zipArc->close();
        return FALSE;
    }
    return $zipArc->close();
}

function fileUploadFailGoToUnlink($targetDir, $smbRootDir, $which)
{
    /**
     * @param string $targetDir 檔案路徑
     * @param bool $which 指定哪個伺服器(true->only本機 & false->本機+88.100)
     */
    $fileCount = count($_FILES['fileToUpload']['name']);
    //將已上傳的資料遞迴刪除
    for ($i = 0; $i < $fileCount; $i++) {
        $finalfilename = $_FILES["fileToUpload"]["name"][$i];
        $targetFile = $targetDir . "/" . basename($finalfilename);
        if ($which) {
            // Check if file already exists
            if (file_exists($targetFile)) {
                unlink($targetDir . "/" . $finalfilename); //將檔案刪除
            } else if (file_exists($targetFile . ".zip")) {
                unlink($targetDir . "/" . $finalfilename . ".zip"); //將檔案刪除
            }
        } else {
            exec("smbclient -c 'rm \"$finalfilename\"' //192.168.88.100/sapidofile/ -D \"$smbRootDir\" -U mis_system%sapido123", $output, $return_var);
            if (file_exists($targetFile)) {
                unlink($targetDir . "/" . $finalfilename); //將檔案刪除
            }
        }
    }
}
