import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from "axios";
import VueAxios from "vue-axios";
import BootstrapVue from "bootstrap-vue";

Vue.config.productionTip = false

import { library } from "@fortawesome/fontawesome-svg-core";
// import { faSave } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faDownload);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')


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
            //將commonquery init初始化
            router.app.$options.store.dispatch("commonquery/set_isInit", true);
            //將exportfile status初始化
            router.app.$options.store.dispatch("exportfile/set_ttfStatus", true);
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