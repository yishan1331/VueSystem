<?php
//登入
function Login($params, $returnData)
{
    $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/CommonUse/Interval/user?uid=@sapido@PaaS&attr=uID&valueStart=" . $params->uID . "&valueEnd=" . $params->uID;
    $returnData[0] = $url;
    return $returnData;
}
function ChangePwd($params, $returnData)
{
    $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/user/update_User?uid=@sapido@PaaS";
    //The JSON data.
    $data = array(
        'old_uID' => $params->uID,
        'new_uID' => $params->uID,
        'uName' => $params->uName,
        'pwd' => $params->pwd,
        'uInfo' => $params->uInfo,
        'noumenonType' => $params->noumenonType,
        'noumenonID' => $params->noumenonID,
        'accessList' => $params->accessList,
        'creatorID' => $params->creatorID,
    );
    $returnData[0] = $url;
    $returnData[1] = $data;
    return $returnData;
}
