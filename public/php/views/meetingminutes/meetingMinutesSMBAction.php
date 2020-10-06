<?php
date_default_timezone_set("Asia/Taipei");
$postBody = file_get_contents("php://input");
$postBody = json_decode($postBody);

$data = $postBody->data;
$whichFunction = $postBody->whichFunction;

$postdata = $whichFunction($data);
echo json_encode($postdata);

function downloadFromSMB($data)
{
    $targetDir = "../../../meetingminutesfiles/";
    $smbRootDir = "100.智能製造事業群/01.共用資源/01會議記錄/" . $data->path;
    //先去88.100下載回本機
    exec("smbclient -c 'lcd $targetDir;get \"$data->file\"' //192.168.88.100/sapidofile/ -D \"$smbRootDir\" -U mis_system%sapido123", $output, $return_var);
    if (!$return_var) {
        $msg = "ok";
    } else {
        $msg = array_merge(["檔名:" . basename($data) . "下載失敗"], $output);
    }
    return $msg;
}

function deleteFileFromLocalhost($data)
{
    $targetDir = "../../../meetingminutesfiles/";
    //將檔案刪除
    if (file_exists($targetDir . $data)) {
        if (unlink($targetDir . $data)) {
            $msg = "ok";
        } else {
            $msg = "檔名:" . basename($data) . "在server端刪除失敗";
        }
    }
    return $msg;
}

function getSMBFoldersList($data)
{
    $smbRootDir = "100.智能製造事業群/01.共用資源/01會議記錄/" . $data;
    $returnObj = new stdClass();
    exec("smbclient -c 'ls' //192.168.88.100/sapidofile/ -D \"$smbRootDir\" -U mis_system%sapido123", $output, $return_var);
    if (!$return_var) {
        if (count($output) == 4) { //表示沒有任何資料夾
            $returnObj->Response = "無資料夾";
        } else {
            $returnObj->Response = "ok";
            $array = [];
            foreach ($output as $value) {
                $value = trim($value);
                $expoldevalue = explode(" ", $value);
                array_push($array, $expoldevalue);
            }
            $returnObj->data = $array;
        }
    } else {
        $returnObj->Response = "抓取SMB server資料夾列表失敗";
    }
    return $returnObj;
}

function addNewSMBFolder($data)
{
    $smbRootDir = "100.智能製造事業群/01.共用資源/01會議記錄/" . $data->path;
    $newFolderName = $data->foldername;
    exec("smbclient -c 'mkdir \"$newFolderName\"' //192.168.88.100/sapidofile/ -D \"$smbRootDir\" -U mis_system%sapido123", $output, $return_var);
    if (!$return_var) {
        $msg = "ok";
    } else {
        $msg = "在SMB server建立資料表失敗";
    }
    return $msg;
}
