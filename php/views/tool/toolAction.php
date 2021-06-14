<?php
function FileList($params, $publicIP)
{
    $url = "https://" . $publicIP . ":3687/api/PaaS/1.0/Customized/Show/DownloadFiles?uid=@sapido@PaaS";
    return array($url);
}

function CreateDownloadFileIdPwd($params, $publicIP)
{
    $url = "https://" . $publicIP . ":3687/api/PaaS/1.0/Customized/Create/DownloadFiles/IdPwd?uid=@sapido@PaaS";
    return array($url, $params->data);
}

function DeleteFile($params, $publicIP)
{
    $this_filename = $params->filename;
    $targetDir = "/var/www/html/download/files/";
    $msg = [];
    $delpath = $targetDir . $this_filename;
    if (file_exists($delpath)) {
        unlink($delpath);
        array_push($msg, "檔案刪除成功");
    }
    echo json_encode($msg);
    return;
}
