<?php
function DepartmentAdd($params, $returnData)
{
    $this_accessList = json_decode($params->accessList);
    $url = "https://192.168.39.75:3687/api/SAPIDOSYSTEM/1.0/my/department/registerDep?uid=@sapido@PaaS";
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
    $returnData[0] = $url;
    $returnData[1] = $data;
    return $returnData;
}
function DepartmentMod($params, $returnData)
{
    $this_accessList = json_decode($params->accessList);
    $url = "https://192.168.39.75:3687/api/SAPIDOSYSTEM/1.0/my/department/update_Department?uid=@sapido@PaaS";
    $data = array(
        'depID' => $params->depID,
        'depName' => $params->depName,
        'accessList' => $this_accessList,
        'depInfo' => $params->depInfo,
    );
    $returnData[0] = $url;
    $returnData[1] = $data;
    return $returnData;
}
function AccountAdd($params, $returnData)
{
    $this_accessList = json_decode($params->accessList);
    $url = "https://192.168.39.75:3687/api/SAPIDOSYSTEM/1.0/my/user/reg_User?uid=@sapido@PaaS";
    $data = array(
        'uID' => $params->uID,
        'pwd' => $params->pwd,
        'uName' => $params->uName,
        'uInfo' => $params->uInfo,
        'noumenonType' => "dep",
        'noumenonID' => $params->noumenonID,
        'accessList' => $this_accessList,
        'creatorID' => $params->creatorID,
    );
    $returnData[0] = $url;
    $returnData[1] = $data;
    return $returnData;
}
function AccountMod($params, $returnData)
{
    $this_accessList = json_decode($params->accessList);
    $url = "https://192.168.39.75:3687/api/SAPIDOSYSTEM/1.0/my/user/update_User?uid=@sapido@PaaS";
    $data = array(
        'old_uID' => $params->uID,
        'new_uID' => $params->uID,
        'uName' => $params->uName,
        'pwd' => $params->pwd,
        'uInfo' => $params->uInfo,
        'noumenonType' => "dep",
        'noumenonID' => $params->noumenonID,
        'accessList' => $this_accessList,
        'creatorID' => $params->creatorID,
    );
    $returnData[0] = $url;
    $returnData[1] = $data;
    return $returnData;
}
function AccountDel($params, $returnData)
{
    $url = "https://192.168.39.75:3687/api/SAPIDOSYSTEM/1.0/my/user/delete_User?uid=@sapido@PaaS&del_uID=" . $params->uID;
    $returnData[0] = $url;
    return $returnData;
}
