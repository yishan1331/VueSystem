<?php
function TodoListAdd($params, $publicIP)
{
    $url = "https://" . $publicIP . ":3687/api/SAPIDOSYSTEM/1.0/my/CommonUse/todoList?uid=@sapido@PaaS";
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
    return array($url, $data);
}