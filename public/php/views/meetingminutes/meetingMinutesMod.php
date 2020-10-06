<?php
header('Access-Control-Allow-Origin: *');
include("../../globalvar.php");
$this_seq = $_POST['seq'];
$this_path = $_POST['path'];
$smbRootDir = "100.智能製造事業群/01.共用資源/01會議記錄/" . $this_path;

$url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/meetingMinutes?uid=@sapido@PaaS";
$targetDir = "../../../meetingminutesfiles/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777);
}
$msg = [];
$filecanupload = true;
$nofileupload = false;

if ($_POST['deletefile'] == "") {
    $this_title = $_POST['title'];
    $this_date = $_POST['date'];
    $this_filename = $_POST['filename'];
    $this_level = $_POST['level'];
    $this_account = $_POST['account'];

    if (count($_FILES) != 0) {
        $fileCount = count($_FILES['fileToUpload']['name']);
        $success = 0;
        for ($i = 0; $i < $fileCount; $i++) {
            $finalfilename = $_FILES["fileToUpload"]["name"][$i];
            $targetFile = $targetDir . "/" . basename($finalfilename);
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"][$i], $targetFile)) {
                $success++;
            } else {
                array_push($msg, "檔名:" . basename($finalfilename) . "上傳本機server失敗");
                $filecanupload = false;
            }
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
            array_push($msg, "檔名:" . basename($finalfilename) . "上傳至SMB server 88.100失敗");
            $filecanupload = false;
        }
        if (!$filecanupload) {
            echo json_encode($msg);
            return;
        }
    } else {
        $nofileupload = true;
    }
    //The JSON data.
    if ($this_filename != "") {
        $data = array(
            "old_seq" => ["$this_seq"],
            "title" => ["$this_title"],
            "date" => ["$this_date"],
            "filename" => ["$this_filename"],
            "level" => ["$this_level"],
            "creatorID" => ["$this_account"],
        );
    } else {
        $data = array(
            "old_seq" => ["$this_seq"],
            "title" => ["$this_title"],
            "date" => ["$this_date"],
            "level" => ["$this_level"],
            "creatorID" => ["$this_account"],
        );
    }
} else {
    $this_deletefile = $_POST['deletefile'];
    $this_remainfile = $_POST['remainfile'];

    exec("smbclient -c 'rm \"$this_deletefile\"' //192.168.88.100/sapidofile/ -D \"$smbRootDir\" -U mis_system%sapido123", $output, $return_var);
    if ($return_var) {
        array_push($msg, "SMB server 88.100檔案刪除失敗");
        echo json_encode($msg);
        return;
    }

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
            return;
        }
        if ($_POST['deletefile'] != "") {
            array_push($msg, "檔案刪除成功");
        } else {
            array_push($msg, "檔案、資料修改成功");
        }
        echo json_encode($msg);
        return;
    } else if ($key == 'Response' && $value != 'ok') {
        echo json_encode($Arr);
        return;
    }
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
