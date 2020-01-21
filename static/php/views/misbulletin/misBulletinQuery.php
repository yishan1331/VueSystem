<?php
//查詢
function BulletinDataQuery($params, $returnData)
{
    if ($params->category == "ALL") {
        if (!$params->settingtime) {
            $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/commonuse/queryRows/Interval/misBulletin?uid=@sapido@PaaS&attr=lastUpdateTime&valueStart=" . $params->start_time . "&valueEnd=" . $params->end_time;
        } else {
            $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/commonuse/query/tableData?uid=@sapido@PaaS&table=misBulletin";
        }
    } else {
        if (!$params->settingtime) {
            $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/commonuse/queryRows/Interval/misBulletin?uid=@sapido@PaaS&attr=lastUpdateTime&valueStart=" . $params->start_time . "&valueEnd=" . $params->end_time . "&whereParameter=category&whereValue=" . $params->category;
        } else {
            $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/commonuse/queryRows/Interval/misBulletin?uid=@sapido@PaaS&attr=category&valueStart=" . $params->category . "&valueEnd=" . $params->category;
        }
    }
    $returnData[0] = $url;
    return $returnData;
}
function LatestBulletinDataQuery($params, $returnData)
{
    $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/commonuse/query/sqlsyntax/misBulletin?uid=@sapido@PaaS";

    $whereAttr = new stdClass();
    $whereAttr->showhide = "1";
    $symbols = new stdClass();
    $symbols->showhide = "equal";
    $data = array(
        'purpose' => "query",
        'fields' => "",
        'where' => $whereAttr,
        'orderby' => ["desc", "lastUpdateTime"],
        'limit' => ["0", "5"],
        'symbols' => $symbols
    );


    $returnData[0] = $url;
    $returnData[1] = $data;
    return $returnData;
}
