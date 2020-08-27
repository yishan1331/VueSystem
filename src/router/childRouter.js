import index from "@/views/Index";
import home from "@/views/Home";
import misbulletinboard from "@/views/MISBulletinBoard";
import misbulletinmanage from "@/views/MISBulletinManage";
import department from "@/views/Department";
import account from "@/views/Account";
import todolist from "@/views/TodoList";
import weeklyreport from "@/views/WeeklyReport";
import structure from "@/views/Structure";
// import pagenotfound from "@/views/PageNotFound";

export const childRouter = [
    {
        path: "/index",
        // redirect: '/index/home',
        redirect: "/index/misbulletinboard",
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
                path: "misbulletinboard",
                component: misbulletinboard,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "misbulletinmanage",
                component: misbulletinmanage,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "department",
                component: department,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "account",
                component: account,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "todolist",
                component: todolist,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "weeklyreport",
                component: weeklyreport,
                meta: {
                    needLogin: true
                }
            },
            {
                path: "structure",
                component: structure,
                meta: {
                    needLogin: true
                }
            }
        ]
    },
    //   {
    //     path: "/404",
    //     component: pagenotfound
    //   },
];
