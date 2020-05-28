<?php
function CommonSimpleQuery($params, $returnData)
{
    if ($params->category == "ALL") {
        if (!$params->settingtime) {
            $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/CommonUse/Interval/" . $params->table . "?uid=@sapido@PaaS&attr=lastUpdateTime&valueStart=" . $params->start_time . "&valueEnd=" . $params->end_time;
        } else {
            $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/CommonUse/TableData?uid=@sapido@PaaS&table=" . $params->table;
        }
    } else if ($params->category == "systemformselectoptions") {
        $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/CommonUse/TableData?uid=@sapido@PaaS&table=" . $params->table;
    } else {
        if (!$params->settingtime) {
            $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/CommonUse/Interval/" . $params->table . "?uid=@sapido@PaaS&attr=lastUpdateTime&valueStart=" . $params->start_time . "&valueEnd=" . $params->end_time . "&whereParameter=" . $params->category . "&whereValue=" . $params->categoryparameter;
        } else {
            $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/CommonUse/Interval/" . $params->table . "?uid=@sapido@PaaS&attr=" . $params->category . "&valueStart=" . $params->categoryparameter . "&valueEnd=" . $params->categoryparameter;
        }
    }
    $returnData[0] = $url;
    return $returnData;
}

function CommonSqlSyntaxQuery($params, $returnData)
{
    (!property_exists($params,'purpose'))? $purpose="":$purpose=$params->purpose;
    (!property_exists($params,'fields'))? $fields="":$fields=$params->fields;
    (!property_exists($params,'where'))? $where="":$where=$params->where;
    (!property_exists($params,'orderby'))? $orderby="":$orderby=$params->orderby;
    (!property_exists($params,'limit'))? $limit="":$limit=$params->limit;
    (!property_exists($params,'symbols'))? $symbols="":$symbols=$params->symbols;
    (!property_exists($params,'intervaltime'))? $intervaltime="":$intervaltime=$params->intervaltime;

    $url = "https://192.168.39.75:3687/api/sapidoSystem/1.0/my/CommonUse/SqlSyntax/" . $params->table . "?uid=@sapido@PaaS";
    $data = array(
        'purpose' => $purpose,
        'fields' => $fields,
        'where' => $where,
        'orderby' => $orderby,
        'limit' => $limit,
        'symbols' => $symbols,
        'intervaltime' => $intervaltime
    );
    $returnData[0] = $url;
    $returnData[1] = $data;
    return $returnData;
}