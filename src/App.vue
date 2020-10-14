<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import "jquery";
import "bootstrap";
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import { childRouter } from "@/router/childRouter";
export default {
    name: "App",
    computed: {
        ...mapGetters({
            loginData: "getlogin/get_loginData",
            DEFAULT_pageAccess: "getlogin/get_DEFAULT_pageAccess",
        }),
    },
    methods: {
        ...mapActions({
            change_loginData: "getlogin/change_loginData",
            change_pageAccess: "getlogin/change_pageAccess",
        }),
    },
    created: function () {
        console.log(sessionStorage.getItem("loginStatus"));
        var vm = this;
        console.log(vm.$router.currentRoute.path);
        if (vm.$router.currentRoute.path != "/login") {
            //在頁面載入時讀取sessionStorage裡的狀態資訊並更新vuex資料，更新完成後remove sessionStorage
            if (
                sessionStorage.getItem("loginStatus") != null &&
                sessionStorage.getItem("loginStatus") != "undefined"
            ) {
                var obj = {};
                obj.account = sessionStorage.getItem("loginAccount");
                obj.status = Boolean(sessionStorage.getItem("loginStatus"));
                obj.username = sessionStorage.getItem("loginUsername");
                obj.accesslist = JSON.parse(
                    sessionStorage.getItem("loginAccessList")
                );
                var access = JSON.parse(
                    sessionStorage.getItem("loginAccessList")
                );
                vm.change_loginData(obj);
                let trueList = [];
                Object.entries(access).forEach((element) => {
                    if (element[1]["authority"]) {
                        if (element[1].hasOwnProperty("children")) {
                            Object.keys(element[1].children).map((item) => {
                                if (element[1].children[item].authority) {
                                    trueList.push(element[0] + "/" + item);
                                }
                            });
                        } else {
                            trueList.push(element[0]);
                        }
                    }
                });
                console.log(trueList);
                trueList.push("home");
                childRouter[0].children = childRouter[0].children.filter(
                    (item) => trueList.includes(item.path)
                );
                vm.change_pageAccess(access);
                console.log(childRouter);
                vm.$router.addRoutes(childRouter);
                sessionStorage.removeItem("loginStatus");
                sessionStorage.removeItem("loginUsername");
                sessionStorage.removeItem("loginAccount");
                sessionStorage.removeItem("loginAccessList");
            } else {
                vm.$router.push("/login");
            }
        }
        // console.log(vm.loginData);
        // console.log(vm.loginData.status);
        //在頁面重新整理時將vuex裡的資訊儲存到localStorage裡
        window.addEventListener("beforeunload", () => {
            if (vm.loginData.status === true) {
                sessionStorage.setItem(
                    "loginStatus",
                    Boolean(vm.loginData.status)
                );
                sessionStorage.setItem("loginUsername", vm.loginData.username);
                sessionStorage.setItem("loginAccount", vm.loginData.account);
                sessionStorage.setItem(
                    "loginAccessList",
                    JSON.stringify(vm.loginData.accesslist)
                );
            } else {
                var obj = {};
                obj.account = null;
                obj.status = false;
                obj.username = null;
                obj.accesslist = null;
                var obj2 = {};
                //Deep copy
                var pageAccessobj = Object.assign({}, vm.DEFAULT_pageAccess);
                vm.change_pageAccess(pageAccessobj);
                vm.change_loginData(obj);
                vm.$router.push("/login");
            }
        });
    },
};
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index.scss";
* {
    font-family: "微軟正黑體";
    outline: none; //去除點擊的藍邊框
}
.container {
    min-width: 100%;
}
th {
    min-width: 150px;
}
</style>
