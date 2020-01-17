// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import BootstrapVue from "bootstrap-vue";
import App from "./App";
import router from "./router";
import store from "./store";

// import { library } from "@fortawesome/fontawesome-svg-core";
// import { faSave } from "@fortawesome/free-regular-svg-icons";
// import {
//   faPhone,
//   faHammer,
//   faExclamationCircle,
//   faEnvelopeOpen,
//   faCalendarTimes
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// library.add(
//   faPhone,
//   faSave,
//   faHammer,
//   faExclamationCircle,
//   faEnvelopeOpen,
//   faCalendarTimes
// );
// Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});

router.beforeEach((to, from, next) => {
  console.log(to);
  if (to.matched.length === 0) {
    router.app.$options.store.dispatch("alertmodal/set_alertMsg", "請先登入");
    router.app.$options.store.dispatch("alertmodal/settimeout_alertModal");
    next("/login");
    //   next('/404') // 判断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
  }
  if (to.meta.needLogin) {
    console.log("!!!!!!");
    console.log(router.app.$options.store);
    var loginData = router.app.$options.store.getters["getlogin/get_loginData"];
    console.log(loginData);
    console.log(router.app.$options.store.getters["getlogin/get_pageAccess"]);
    if (loginData.status) {
      next();
    } else {
      router.app.$options.store.dispatch("alertmodal/set_alertMsg", "請先登入");
      router.app.$options.store.dispatch("alertmodal/settimeout_alertModal");
      var obj = {};
      obj.account = null;
      obj.status = false;
      obj.username = null;
      obj.accesslist = null;
      router.app.$options.store.dispatch("getlogin/change_loginData", obj);
      next("/login");
    }
  } else {
    next();
  }
});
