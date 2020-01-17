<?php
function CommonQuery($params, $returnData)
{
    if ($params->category == "ALL") {
        if (!$params->settingtime) {
            $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/commonuse/queryRows/Interval/" . $params->table . "?uid=@sapido@PaaS&attr=lastUpdateTime&valueStart=" . $params->start_time . "&valueEnd=" . $params->end_time;
        } else {
            $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/commonuse/query/tableData?uid=@sapido@PaaS&table=" . $params->table;
        }
    } else if ($params->category == "systemformselectoptions") {
        $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/commonuse/query/tableData?uid=@sapido@PaaS&table=" . $params->table;
    } else {
        if (!$params->settingtime) {
            $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/commonuse/queryRows/Interval/" . $params->table . "?uid=@sapido@PaaS&attr=lastUpdateTime&valueStart=" . $params->start_time . "&valueEnd=" . $params->end_time . "&whereParameter=" . $params->category . "&whereValue=" . $params->categoryparameter;
        } else {
            $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/commonuse/queryRows/Interval/" . $params->table . "?uid=@sapido@PaaS&attr=" . $params->category . "&valueStart=" . $params->categoryparameter . "&valueEnd=" . $params->categoryparameter;
        }
    }
    $returnData[0] = $url;
    return $returnData;
}
