import index from "@/views/Index";
import home from "@/views/Home";
import board from "@/views/bulletin/BulletinBoard";
import manage from "@/views/bulletin/BulletinManage";
import department from "@/views/management/Department";
import account from "@/views/management/Account";
import todolist from "@/views/report/TodoList";
import weeklyreport from "@/views/report/WeeklyReport";
import meetingminutes from "@/views/report/MeetingMinutes";
import sop from "@/views/report/SOP";
import structure from "@/views/architecture/Structure";
import server from "@/views/architecture/Server";
import storage from "@/views/architecture/Storage";
import fileupdownload from "@/views/tool/FileUpDownload";
// import pagenotfound from "@/views/PageNotFound";

export const childRouter = [
    {
        path: "/index",
        // redirect: '/index/home',
        redirect: "/index/bulletin/board",
        component: index,
        children: [
            {
                path: "home",
                component: home,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "bulletin/board",
                component: board,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "bulletin/manage",
                component: manage,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "management/department",
                component: department,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "management/account",
                component: account,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "report/todolist",
                component: todolist,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "report/weeklyreport",
                component: weeklyreport,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "report/meetingminutes",
                component: meetingminutes,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "report/sop",
                component: sop,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "architecture/structure",
                component: structure,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "architecture/server",
                component: server,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "architecture/storage",
                component: storage,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "tool/fileupdownload",
                component: fileupdownload,
                meta: {
                    needLogin: true
                }
            },
        ]
    },
    //   {
    //     path: "/404",
    //     component: pagenotfound
    //   },
];
