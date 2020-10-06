<?php
//登入
function Login($params, $publicIP)
{
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/Interval/user?uid=@sapido@PaaS&attr=uID&valueStart=" . $params->uID . "&valueEnd=" . $params->uID;
    return array($url);
}
function ChangePwd($params, $publicIP)
{
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/user/update_User?uid=@sapido@PaaS";
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
    return array($url,$data);
}
