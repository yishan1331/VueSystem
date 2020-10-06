<?php
function IntervalQuery($params, $publicIP)
{
    if ($params->settingtime) {
        $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/Interval/" . $params->table . "?uid=@sapido@PaaS&attr=" . $params->timeattr . "&valueStart=" . $params->start_time . "&valueEnd=" . $params->end_time;
    } else {
        $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/TableData?uid=@sapido@PaaS&table=" . $params->table;
    }
    return array($url);
}

function CommonSimpleQuery($params, $publicIP)
{
    if ($params->category == "ALL") {
        if (!$params->settingtime) {
            $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/Interval/" . $params->table . "?uid=@sapido@PaaS&attr=lastUpdateTime&valueStart=" . $params->start_time . "&valueEnd=" . $params->end_time;
        } else {
            $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/TableData?uid=@sapido@PaaS&table=" . $params->table;
        }
    } else if ($params->category == "systemformselectoptions") {
        $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/TableData?uid=@sapido@PaaS&table=" . $params->table;
    } else {
        if (!$params->settingtime) {
            $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/Interval/" . $params->table . "?uid=@sapido@PaaS&attr=lastUpdateTime&valueStart=" . $params->start_time . "&valueEnd=" . $params->end_time . "&whereParameter=" . $params->category . "&whereValue=" . $params->categoryparameter;
        } else {
            $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/Interval/" . $params->table . "?uid=@sapido@PaaS&attr=" . $params->category . "&valueStart=" . $params->categoryparameter . "&valueEnd=" . $params->categoryparameter;
        }
    }
    return array($url);
}

function CommonSqlSyntaxQuery($params, $publicIP)
{
    (!property_exists($params, 'purpose')) ? $purpose = "" : $purpose = $params->purpose;
    (!property_exists($params, 'fields')) ? $fields = "" : $fields = $params->fields;
    (!property_exists($params, 'where')) ? $where = "" : $where = $params->where;
    (!property_exists($params, 'orderby')) ? $orderby = "" : $orderby = $params->orderby;
    (!property_exists($params, 'limit')) ? $limit = "" : $limit = $params->limit;
    (!property_exists($params, 'symbols')) ? $symbols = "" : $symbols = $params->symbols;
    (!property_exists($params, 'intervaltime')) ? $intervaltime = "" : $intervaltime = $params->intervaltime;

    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/SqlSyntax/" . $params->table . "?uid=@sapido@PaaS";
    $data = array(
        'purpose' => $purpose,
        'fields' => $fields,
        'where' => $where,
        'orderby' => $orderby,
        'limit' => $limit,
        'symbols' => $symbols,
        'intervaltime' => $intervaltime
    );
    return array($url, $data);
}
function CommonSqlSyntaxQuery_($params, $publicIP)
{
    $postdata = new stdClass();
    foreach ($params->condition as $key => $value) {
        $postdata->$key = new stdClass();
        (!property_exists($value, 'table')) ? $table = "" : $table = $value->table;
        (!property_exists($value, 'fields')) ? $fields = "" : $fields = $value->fields;
        (!property_exists($value, 'where')) ? $where = "" : $where = $value->where;
        (!property_exists($value, 'orderby')) ? $orderby = "" : $orderby = $value->orderby;
        (!property_exists($value, 'limit')) ? $limit = "" : $limit = $value->limit;
        (!property_exists($value, 'symbols')) ? $symbols = "" : $symbols = $value->symbols;
        (!property_exists($value, 'intervaltime')) ? $intervaltime = "" : $intervaltime = $value->intervaltime;
        $postdata->$key->table = $table;
        $postdata->$key->fields = $fields;
        $postdata->$key->where = $where;
        $postdata->$key->orderby = $orderby;
        $postdata->$key->limit = $limit;
        $postdata->$key->symbols = $symbols;
        $postdata->$key->intervaltime = $intervaltime;
    }
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/SqlSyntax_?uid=@sapido@PaaS&getSqlSyntax=yes";
    return array($url, $postdata);
}

function CommonJoinMultiTable_($params, $publicIP)
{
    $postdata = new stdClass();
    foreach ($params->condition as $key => $value) {
        $postdata->$key = new stdClass();
        (!property_exists($value, 'tables')) ? $tables = "" : $tables = $value->tables;
        (!property_exists($value, 'fields')) ? $fields = "" : $fields = $value->fields;
        (!property_exists($value, 'orderby')) ? $orderby = "" : $orderby = $value->orderby;
        (!property_exists($value, 'limit')) ? $limit = "" : $limit = $value->limit;
        (!property_exists($value, 'where')) ? $where = "" : $where = $value->where;
        (!property_exists($value, 'symbols')) ? $symbols = "" : $symbols = $value->symbols;
        (!property_exists($value, 'join')) ? $join = "" : $join = $value->join;
        (!property_exists($value, 'jointype')) ? $jointype = "" : $jointype = $value->jointype;
        $postdata->$key->tables = $tables;
        $postdata->$key->fields = $fields;
        $postdata->$key->orderby = $orderby;
        $postdata->$key->limit = $limit;
        $postdata->$key->where = $where;
        $postdata->$key->symbols = $symbols;
        $postdata->$key->join = $join;
        $postdata->$key->jointype = $jointype;
    }
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/SqlSyntax/JoinMultiTable_?uid=@sapido@PaaS&getSqlSyntax=yes";
    return array($url, $postdata);
}

function CommonRegister($params, $publicIP)
{
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/" . $params->table . "?uid=@sapido@PaaS";
    return array($url, $params->postdata);
}

function CommonUpdate($params, $publicIP)
{
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/" . $params->table . "?uid=@sapido@PaaS";
    return array($url, $params->postdata);
}

function CommonDelete($params, $publicIP)
{
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/" . $params->table . "?uid=@sapido@PaaS";
    return array($url, $params->postdata);
}
