import Vue from "vue";
import Router from "vue-router";
import store from "../store";
// import index from '@/views/Index'
import login from "@/views/Login";
// import home from '@/views/Home'
// import misbulletinboard from '@/views/MISBulletinBoard'
// import misbulletinmanage from '@/views/MISBulletinManage'
// import department from '@/views/Department'
// import account from '@/views/Account'

Vue.use(Router);

export default new Router({
  // mode:'history',
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      component: login
    },
  ]
});
