import Vue from 'vue'
import VueRouter from 'vue-router'
import login from "@/views/Login";

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: login
    },
]

const router = new VueRouter({
    // mode:'history',
    routes
})

export default router
