<?php
function DepartmentAdd($params, $publicIP)
{
    $this_accessList = json_decode($params->accessList);
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/department/registerDep?uid=@sapido@PaaS";
    $data = array(
        'depID' => $params->depID,
        'depName' => $params->depName,
        'noumenonType' => "",
        'noumenonID' => "",
        'accessList' => $this_accessList,
        'depInfo' => $params->depInfo,
        'creatorID' => $params->creatorID,
        'creDB' => "no",
    );
    return array($url, $data);
}
function DepartmentMod($params, $publicIP)
{
    $this_accessList = json_decode($params->accessList);
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/department/update_Department?uid=@sapido@PaaS";
    $data = array(
        'depID' => $params->depID,
        'depName' => $params->depName,
        'accessList' => $this_accessList,
        'depInfo' => $params->depInfo,
    );
    return array($url, $data);
}
function AccountAdd($params, $publicIP)
{
    $this_accessList = json_decode($params->accessList);
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/user/reg_User?uid=@sapido@PaaS";
    $data = array(
        'uID' => $params->uID,
        'pwd' => $params->pwd,
        'uName' => $params->uName,
        'uInfo' => $params->uInfo,
        'email' => $params->email,
        'noumenonType' => "dep",
        'noumenonID' => $params->noumenonID,
        'accessList' => $this_accessList,
        'creatorID' => $params->creatorID,
    );
    return array($url, $data);
}
function AccountMod($params, $publicIP)
{
    $this_accessList = json_decode($params->accessList);
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/user/update_User?uid=@sapido@PaaS";
    $data = array(
        'old_uID' => $params->uID,
        'new_uID' => $params->uID,
        'uName' => $params->uName,
        'pwd' => $params->pwd,
        'uInfo' => $params->uInfo,
        'email' => $params->email,
        'noumenonType' => "dep",
        'noumenonID' => $params->noumenonID,
        'accessList' => $this_accessList,
        'creatorID' => $params->creatorID,
    );
    return array($url, $data);
}
function AccountDel($params, $publicIP)
{
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/user/delete_User?uid=@sapido@PaaS";
    $data = array(
        'uID' => $params->uID,
    );
    return array($url, $data);
}
