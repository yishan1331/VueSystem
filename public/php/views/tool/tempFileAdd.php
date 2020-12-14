<?php
header('Access-Control-Allow-Origin: *');
include("../../globalvar.php");

$targetDir = "/var/www/html/download/files/";
$msg = [];
if (count($_FILES) != 0) {
    $fileCount = count($_FILES['fileToUpload']['name']);
    $filecanupload = true;
    $success = 0;
    for ($i = 0; $i < $fileCount; $i++) {
        $finalfilename = $_FILES["fileToUpload"]["name"][$i];
        $targetFile = $targetDir . basename($finalfilename);
        // Check if file already exists
        if (file_exists($targetFile)) {
            array_push($msg, "檔名:'" . basename($_FILES["fileToUpload"]["name"][$i]) . "' 已經存在");
            array_push($msg, "新增失敗");
            $filecanupload = false;
        } else {
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"][$i], $targetFile)) {
                $success++;
            } else {
                array_push($msg, "檔名:" . basename($finalfilename) . "上傳失敗");
                array_push($msg, "系統將此次上傳檔案全部刪除");
                //若新增到後面檔案發生錯誤，把之前新增的全部刪除，以免不一致
                $filecanupload = false;
                fileUploadFailGoToUnlink($targetDir);
            }
        }
        // // Check file size
        // if ($_FILES["fileToUpload"]["size"][$i] > 1000000) {
        //     array_push($msg, "檔名:'" . basename($_FILES["fileToUpload"]["name"][$i]) . "' 檔案太大");
        //     array_push($msg, "新增失敗");
        //     $filecanupload = false;
        // }
    }
    if ($filecanupload) {
        array_push($msg, "檔案上傳成功");
    }
    echo json_encode($msg);
    return;
}

function fileUploadFailGoToUnlink($targetDir)
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
        // Check if file already exists
        if (file_exists($targetFile)) {
            unlink($targetDir . "/" . $finalfilename); //將檔案刪除
        } else if (file_exists($targetFile . ".zip")) {
            unlink($targetDir . "/" . $finalfilename . ".zip"); //將檔案刪除
        }
    }
}
