<template>
    <div class="index">
        <!-- <nav
            class="navbar navbar-expand-lg navbar-light fixed-top"
            style="background-color:#7C93B6;"
        >-->
        <b-navbar
            toggleable="lg"
            type="dark"
            id="navbar"
            sticky
            style="background-color: #7c93b6"
        >
            <div>
                <router-link :to="'home'">
                    <img
                        class="navbar-brand"
                        src="../assets/sapidoLOGOw.png"
                        width="170px"
                    />
                </router-link>
            </div>
            <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link
                            class="nav-link"
                            v-show="pageAccess.misbulletinboard.authority"
                            :to="'misbulletinboard'"
                            >MIS公告區</router-link
                        >
                    </li>
                    <li class="nav-item">
                        <router-link
                            class="nav-link"
                            v-show="pageAccess.misbulletinmanage.authority"
                            :to="'misbulletinmanage'"
                            >MIS公告管理</router-link
                        >
                    </li>
                    <li class="nav-item dropdown">
                        <a
                            class="nav-link dropdown"
                            role="button"
                            v-show="
                                pageAccess.structure.authority ||
                                pageAccess.server.authority ||
                                pageAccess.storage.authority
                            "
                            >系統架構</a
                        >
                        <div class="dropdown-menu">
                            <router-link
                                class="nav-link"
                                v-show="pageAccess.structure.authority"
                                :to="'structure'"
                                >架構圖</router-link
                            >
                            <router-link
                                class="nav-link"
                                v-show="pageAccess.server.authority"
                                :to="'server'"
                                >伺服器狀態</router-link
                            >
                            <router-link
                                class="nav-link"
                                v-show="pageAccess.storage.authority"
                                :to="'storage'"
                                >儲存設備狀態</router-link
                            >
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a
                            class="nav-link dropdown"
                            role="button"
                            v-show="
                                pageAccess.todolist.authority ||
                                pageAccess.weeklyreport.authority ||
                                pageAccess.meetingminutes.authority
                            "
                            >報告</a
                        >
                        <div class="dropdown-menu">
                            <router-link
                                class="nav-link"
                                v-show="pageAccess.todolist.authority"
                                :to="'todolist'"
                                >待辦事項</router-link
                            >
                            <router-link
                                class="nav-link"
                                v-show="pageAccess.weeklyreport.authority"
                                :to="'weeklyreport'"
                                >工作週報</router-link
                            >
                            <router-link
                                class="nav-link"
                                v-show="pageAccess.meetingminutes.authority"
                                :to="'meetingminutes'"
                                >會議記錄</router-link
                            >
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a
                            class="nav-link dropdown"
                            role="button"
                            v-show="
                                pageAccess.department.authority ||
                                pageAccess.account.authority
                            "
                            >系統管理</a
                        >
                        <div class="dropdown-menu">
                            <router-link
                                class="nav-link"
                                v-show="pageAccess.department.authority"
                                :to="'department'"
                                >部門</router-link
                            >
                            <router-link
                                class="nav-link"
                                v-show="pageAccess.account.authority"
                                :to="'account'"
                                >帳號</router-link
                            >
                        </div>
                    </li>
                    <!-- <li class="nav-item dropdown">
                        <a class="nav-link dropdown" role="button">MIS</a>
                        <div class="dropdown-menu">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown" role="button">系統</a>
                                <div class="dropdown-menu dropdown-l2">
                                    <router-link class="nav-link" :to="''">架構</router-link>
                                    <router-link class="nav-link" :to="''">網路</router-link>
                                    <router-link class="nav-link" :to="''">儲存</router-link>
                                    <router-link class="nav-link" :to="''">伺服器</router-link>
                                </div>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown" role="button">報告</a>
                                <div class="dropdown-menu dropdown-l2">
                                    <router-link class="nav-link" :to="''">每日狀況回報</router-link>
                                    <router-link class="nav-link" :to="''">金智洋月報</router-link>
                                    <router-link class="nav-link" :to="''">易昇鋼鐵月報</router-link>
                                    <router-link class="nav-link" :to="'todolist'">待辦事項</router-link>
                                    <router-link class="nav-link" :to="''">Weekly Report</router-link>
                                </div>
                            </li>
                        </div>
                    </li>-->
                </ul>
                <form class="form-inline my-2 my-lg-0">
                    <div class="username">
                        <p v-if="loginData.username === null" class="account">
                            HI, xxxx
                        </p>
                        <p v-else class="account">
                            HI, {{ loginData.username }}
                        </p>
                    </div>
                    <a
                        class="changepwd a-hover"
                        style="float: right"
                        @click.prevent="toggleChangePWDModal(true)"
                        >更改密碼</a
                    >
                    <a
                        class="logout a-hover"
                        style="float: right"
                        @click.prevent="logout"
                        >登出</a
                    >
                </form>
            </div>
            <!-- </nav> -->
        </b-navbar>
        <b-container>
            <router-view style="margin-top: 10px"></router-view>
            <!-- <router-view style="position:absolute;margin-top:10px"></router-view> -->
        </b-container>
        <modal v-if="ChangePwdmodalShow">
            <template v-slot:modalheader>
                <h5>更改密碼</h5>
            </template>
            <template v-slot:default>
                <div class="inputdiv">
                    <label>舊密碼:</label>
                    <div>
                        <input
                            type="password"
                            id="change_oldpwd"
                            class="form-control"
                            style="background-color: white"
                            v-model="ChangePwdmodal.old_pwd"
                            v-bind:class="{
                                wrongoldpwd:
                                    ChangePwdmodal.wrongStatus.oldisWrong,
                            }"
                        />
                    </div>
                </div>
                <div class="inputdiv">
                    <label>新密碼:</label>
                    <div>
                        <input
                            type="password"
                            id="change_newpwd"
                            class="form-control"
                            v-model="ChangePwdmodal.change_newpwd"
                            v-bind:class="{
                                wrongnewpwd1:
                                    ChangePwdmodal.wrongStatus.new1isWrong,
                            }"
                        />
                    </div>
                </div>
                <div class="inputdiv">
                    <label>再次輸入新密碼:</label>
                    <div>
                        <input
                            type="password"
                            id="change_newpwd2"
                            class="form-control"
                            v-model="ChangePwdmodal.change_newpwd2"
                            v-bind:class="{
                                wrongnewpwd2:
                                    ChangePwdmodal.wrongStatus.new2isWrong,
                            }"
                        />
                    </div>
                </div>
            </template>
            <template v-slot:modalfooter>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="toggleChangePWDModal(false)"
                        >Close</b-button
                    >
                    <b-button
                        variant="success"
                        size="sm"
                        class="float-right"
                        style="margin-right: 10px"
                        @click.prevent="changepwd"
                        >更改密碼</b-button
                    >
                </div>
            </template>
        </modal>
        <alertModal />
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import modal from "@/components/modal.vue";
import alertModal from "@/components/alertModal.vue";
export default {
    name: "index",
    data() {
        return {
            ChangePwdmodalShow: false,
            ChangePwdmodal: {
                old_pwd: "",
                change_newpwd: "",
                change_newpwd2: "",
                wrongStatus: {
                    oldisWrong: false,
                    new1isWrong: false,
                    new2isWrong: false,
                },
            },
        };
    },
    computed: {
        ...mapGetters({
            axiosResult: "commonaxios/get_axiosResult",
            loginData: "getlogin/get_loginData",
            pageAccess: "getlogin/get_pageAccess",
            DEFAULT_commonModalConfig: "usemodal/get_DEFAULT_commonModalConfig",
        }),
    },
    created: function () {
        this.getNow();
        console.log(this.pageAccess);
    },
    components: {
        modal,
        alertModal,
    },
    methods: {
        ...mapActions({
            axiosAction: "commonaxios/axiosAction",
            change_loginData: "getlogin/change_loginData",
            togglecommonModal: "usemodal/toggle_commonModal",
            setcommonModalConfig: "usemodal/set_commonModalConfig",
            setTimeOutAlertMsg: "alertmodal/set_setTimeOutAlertMsg",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            setDate: "getdate/set_Date",
        }),
        getNow() {
            let vm = this;
            let weekdaysCountConfig = [
                [Number(-6), Number(0)],
                [Number(0), Number(6)],
                [Number(-1), Number(5)],
                [Number(-2), Number(4)],
                [Number(-3), Number(3)],
                [Number(-4), Number(2)],
                [Number(-5), Number(1)],
            ];
            let nowDate = new Date();
            let returnobj = {};
            returnobj = vm.dateFormat(nowDate);
            console.log(returnobj);
            let obj = {};
            obj.now =
                returnobj.weekday +
                ", " +
                returnobj.month +
                "月 " +
                returnobj.day +
                ", " +
                returnobj.year;

            obj.nowFormat =
                returnobj.year + "-" + returnobj.month + "-" + returnobj.day;

            Date.prototype.addDays = function (days) {
                this.setDate(this.getDate() + days);
                return this;
            };

            let thisweekdaystart = new Date();
            thisweekdaystart.addDays(
                weekdaysCountConfig[thisweekdaystart.getDay()][0]
            );
            let thisweekdaystartreturnobj = {};
            thisweekdaystartreturnobj = vm.dateFormat(thisweekdaystart);
            let thisweekdayend = new Date();
            thisweekdayend.addDays(
                weekdaysCountConfig[thisweekdayend.getDay()][1]
            );
            let thisweekdayendreturnobj = {};
            thisweekdayendreturnobj = vm.dateFormat(thisweekdayend);
            obj.thisweekday = [
                thisweekdaystartreturnobj.year +
                    "-" +
                    thisweekdaystartreturnobj.month +
                    "-" +
                    thisweekdaystartreturnobj.day,
                thisweekdayendreturnobj.year +
                    "-" +
                    thisweekdayendreturnobj.month +
                    "-" +
                    thisweekdayendreturnobj.day,
            ];
            vm.setDate(obj);
        },
        dateFormat(time) {
            let vm = this;
            let weekdays = [
                "星期日",
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六",
            ];
            let thisDay = time.getDate();
            if (thisDay < 10) thisDay = "0" + thisDay;
            let thisMonth = time.getMonth() + 1;
            if (thisMonth < 10) thisMonth = "0" + thisMonth;
            return {
                year: time.getFullYear(),
                month: thisMonth,
                day: thisDay,
                weekday: weekdays[time.getDay()],
            };
        },
        logout() {
            var vm = this;
            var obj = {};
            obj.account = null;
            obj.status = false;
            obj.username = null;
            obj.accesslist = null;
            vm.change_loginData(obj);
            vm.$router.push("/");
        },
        changepwd() {
            var vm = this;
            vm.ChangePwdmodal.wrongStatus = vm.$options.data().ChangePwdmodal.wrongStatus;
            vm.ChangePwdmodal.old_pwd = vm.ChangePwdmodal.old_pwd.trim();
            vm.ChangePwdmodal.change_newpwd = vm.ChangePwdmodal.change_newpwd.trim();
            vm.ChangePwdmodal.change_newpwd2 = vm.ChangePwdmodal.change_newpwd2.trim();
            if (
                vm.ChangePwdmodal.old_pwd === "" ||
                vm.ChangePwdmodal.change_newpwd === "" ||
                vm.ChangePwdmodal.change_newpwd2 === ""
            ) {
                vm.setTimeOutAlertMsg("不能為空");
                vm.settimeoutalertModal();
                return;
            }
            if (vm.ChangePwdmodal.old_pwd === vm.ChangePwdmodal.change_newpwd) {
                vm.setTimeOutAlertMsg("新密碼不能與舊密碼相同");
                vm.settimeoutalertModal();
                vm.ChangePwdmodal.change_newpwd = "";
                vm.ChangePwdmodal.wrongStatus.oldisWrong = true;
                vm.ChangePwdmodal.wrongStatus.new1isWrong = true;
                return;
            }
            vm.ChangePwdmodal.wrongStatus = vm.$options.data().ChangePwdmodal.wrongStatus;
            if (
                vm.ChangePwdmodal.change_newpwd !=
                vm.ChangePwdmodal.change_newpwd2
            ) {
                vm.setTimeOutAlertMsg("兩次密碼輸入不相符");
                vm.settimeoutalertModal();
                vm.ChangePwdmodal.change_newpwd = "";
                vm.ChangePwdmodal.change_newpwd2 = "";
                vm.ChangePwdmodal.wrongStatus.new1isWrong = true;
                vm.ChangePwdmodal.wrongStatus.new2isWrong = true;
                return;
            }
            vm.ChangePwdmodal.wrongStatus = vm.$options.data().ChangePwdmodal.wrongStatus;
            var params = {};
            params["methods"] = "GET";
            params["whichFunction"] = "Login";
            params["uID"] = vm.loginData.account;
            vm.axiosAction(params).then(() => {
                var result = vm.axiosResult;
                if (result["Response"] != "ok") {
                    vm.setTimeOutAlertMsg(result["Response"]);
                    vm.settimeoutalertModal();
                } else {
                    if (
                        vm.ChangePwdmodal.old_pwd ===
                        result["QueryTableData"][0].pwd
                    ) {
                        params = {};
                        params["methods"] = "POST";
                        params["whichFunction"] = "ChangePwd";
                        params["uID"] = String(result["QueryTableData"][0].uID);
                        params["noumenonType"] =
                            result["QueryTableData"][0].noumenonType;
                        params["uInfo"] = result["QueryTableData"][0].uInfo;
                        params["accessList"] =
                            result["QueryTableData"][0].accessList;
                        params["uName"] = result["QueryTableData"][0].uName;
                        params["pwd"] = vm.ChangePwdmodal.change_newpwd;
                        params["noumenonID"] = String(
                            result["QueryTableData"][0].noumenonID
                        );
                        params["creatorID"] = String(
                            result["QueryTableData"][0].creatorID
                        );
                        console.log(params);
                        vm.axiosAction(params).then(() => {
                            var result = vm.axiosResult;
                            if (result["Response"] != "ok") {
                                vm.setTimeOutAlertMsg(result["Response"]);
                                vm.settimeoutalertModal();
                            } else {
                                vm.setTimeOutAlertMsg("修改成功請重新登入");
                                vm.settimeoutalertModal();
                                var obj = {};
                                obj.account = null;
                                obj.status = false;
                                obj.username = null;
                                obj.accesslist = null;
                                vm.change_loginData(obj);
                                vm.reset();
                                vm.togglecommonModal(false);
                                vm.ChangePwdmodalShow = false;
                                setTimeout(function () {
                                    vm.$router.push("/");
                                }, 900);
                            }
                        });
                    } else {
                        vm.ChangePwdmodal.old_pwd = "";
                        vm.ChangePwdmodal.wrongStatus.oldisWrong = true;
                        vm.setTimeOutAlertMsg("舊密碼不符合");
                        vm.settimeoutalertModal();
                    }
                }
            });
        },

        toggleChangePWDModal(status) {
            let vm = this;
            console.log(status);
            if (status) {
                let commonModalConfig = JSON.parse(
                    JSON.stringify(vm.DEFAULT_commonModalConfig)
                );
                console.log(commonModalConfig);
                vm.setcommonModalConfig(commonModalConfig);
            } else {
                vm.reset();
            }
            vm.ChangePwdmodalShow = status;
            vm.togglecommonModal(status);
        },

        //資料reset
        reset() {
            var def = this.$options.data();
            Object.assign(this.$data, def);
            //https://codepen.io/karimcossutti/pen/ObXyKq
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-item .nav-link {
    color: #eefbf0;
    font-size: 20px;
}
.dropdown-menu .nav-link:hover {
    background-color: lightgrey;
}
.username {
    height: 24px;
}
.form-inline a,
.form-inline p {
    color: #eefbf0;
    margin-left: 15px;
}
.dropdown-menu {
    margin: 0;
    margin-top: 0px;
    background-color: #97a7c0;
    width: 125px !important;
    /* min-width: 127px !important; */
}
.dropdown-l2 {
    top: 0;
    left: 75px;
    background-color: #8b99b1 !important;
}
.dropdown:hover > .dropdown-menu {
    display: block;
}

.dropleft:hover > .dropdown-menu {
    display: block;
    margin-right: 0px;
}
.dropdown-item {
    padding-left: 10px;
    width: 125px !important;
}
.dropdown-item:hover {
    background-color: #ffffff;
}
.wrongoldpwd,
.wrongnewpwd1,
.wrongnewpwd2 {
    border: 1px solid red;
}
h5 {
    margin: 0 auto;
}
.a-hover:hover {
    text-decoration: unset;
    color: rgba(255, 255, 255, 0.75);
    cursor: pointer;
}
</style>

