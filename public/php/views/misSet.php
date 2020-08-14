<?php
function TodoListAdd($params, $returnData)
{
    $url = "https://192.168.39.75:3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/todoList?uid=@sapido@PaaS";
    $data = array(
        "seq" => [""],
        'depID' => $params->depID,
        'taskInfo' => $params->taskInfo,
        'schedDate' => $params->schedDate,
        'priority' => $params->priority,
        'assignTo' => $params->assignTo,
        'status' => [0],
        'completedDate' => $params->completedDate,
        'creatorID' => $params->creatorID,
    );
    $returnData[0] = $url;
    $returnData[1] = $data;
    return $returnData;
}