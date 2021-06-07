<template>
    <div class="index">
        <b-navbar
            toggleable="lg"
            type="dark"
            id="navbar"
            sticky
            style="background-color: #7c93b6"
        >
            <div>
                <router-link :to="'#'">
                    <img
                        class="navbar-brand"
                        src="../assets/yishan_logo1.png"
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
                    <li
                        class="nav-item dropdown"
                        v-if="
                            pageAccess.hasOwnProperty('bulletin') &&
                            pageAccess.bulletin.authority
                        "
                    >
                        <a class="nav-link dropdown" role="button">系統公告</a>
                        <div class="dropdown-menu">
                            <router-link
                                class="nav-link"
                                v-if="
                                    pageAccess.bulletin.children.hasOwnProperty(
                                        'board'
                                    ) &&
                                    pageAccess.bulletin.children.board.authority
                                "
                                :to="'/index/bulletin/board'"
                                >公告區</router-link
                            >
                            <router-link
                                class="nav-link"
                                v-if="
                                    pageAccess.bulletin.children.hasOwnProperty(
                                        'manage'
                                    ) &&
                                    pageAccess.bulletin.children.manage
                                        .authority
                                "
                                :to="'/index/bulletin/manage'"
                                >公告管理</router-link
                            >
                        </div>
                    </li>
                    <li
                        class="nav-item dropdown"
                        v-if="
                            pageAccess.hasOwnProperty('architecture') &&
                            pageAccess.architecture.authority
                        "
                    >
                        <a class="nav-link dropdown" role="button">系統架構</a>
                        <div class="dropdown-menu">
                            <router-link
                                class="nav-link"
                                v-if="
                                    pageAccess.architecture.children.hasOwnProperty(
                                        'structure'
                                    ) &&
                                    pageAccess.architecture.children.structure
                                        .authority
                                "
                                :to="'/index/architecture/structure'"
                                >架構圖</router-link
                            >
                            <router-link
                                class="nav-link"
                                v-if="
                                    pageAccess.architecture.children.hasOwnProperty(
                                        'server'
                                    ) &&
                                    pageAccess.architecture.children.server
                                        .authority
                                "
                                :to="'/index/architecture/server'"
                                >伺服器狀態</router-link
                            >
                            <router-link
                                class="nav-link"
                                v-if="
                                    pageAccess.architecture.children.hasOwnProperty(
                                        'storage'
                                    ) &&
                                    pageAccess.architecture.children.storage
                                        .authority
                                "
                                :to="'/index/architecture/storage'"
                                >儲存設備狀態</router-link
                            >
                        </div>
                    </li>
                    <li
                        class="nav-item dropdown"
                        v-if="
                            pageAccess.hasOwnProperty('report') &&
                            pageAccess.report.authority
                        "
                    >
                        <a class="nav-link dropdown" role="button">報告</a>
                        <div class="dropdown-menu">
                            <router-link
                                class="nav-link"
                                v-if="
                                    pageAccess.report.children.hasOwnProperty(
                                        'todolist'
                                    ) &&
                                    pageAccess.report.children.todolist
                                        .authority
                                "
                                :to="'/index/report/todolist'"
                                >待辦事項</router-link
                            >
                            <router-link
                                class="nav-link"
                                v-if="
                                    pageAccess.report.children.hasOwnProperty(
                                        'weeklyreport'
                                    ) &&
                                    pageAccess.report.children.weeklyreport
                                        .authority
                                "
                                :to="'/index/report/weeklyreport'"
                                >工作週報</router-link
                            >
                            <router-link
                                class="nav-link"
                                v-if="
                                    pageAccess.report.children.hasOwnProperty(
                                        'meetingminutes'
                                    ) &&
                                    pageAccess.report.children.meetingminutes
                                        .authority
                                "
                                :to="'/index/report/meetingminutes'"
                                >會議記錄</router-link
                            >
                            <router-link
                                class="nav-link"
                                v-if="
                                    pageAccess.report.children.hasOwnProperty(
                                        'sop'
                                    ) &&
                                    pageAccess.report.children.sop.authority
                                "
                                :to="'/index/report/sop'"
                                >SOP文件</router-link
                            >
                        </div>
                    </li>
                    <li
                        class="nav-item dropdown"
                        v-if="
                            pageAccess.hasOwnProperty('tool') &&
                            pageAccess.tool.authority
                        "
                    >
                        <a class="nav-link dropdown" role="button">工具</a>
                        <div class="dropdown-menu">
                            <router-link
                                class="nav-link"
                                v-if="
                                    pageAccess.tool.children.hasOwnProperty(
                                        'fileupdownload'
                                    ) &&
                                    pageAccess.tool.children.fileupdownload
                                        .authority
                                "
                                :to="'/index/tool/fileupdownload'"
                                >檔案上傳下載</router-link
                            >
                        </div>
                    </li>
                    <li
                        class="nav-item dropdown"
                        v-if="
                            pageAccess.hasOwnProperty('management') &&
                            pageAccess.management.authority
                        "
                    >
                        <a class="nav-link dropdown" role="button">系統管理</a>
                        <div class="dropdown-menu">
                            <router-link
                                class="nav-link"
                                v-if="
                                    pageAccess.management.children.hasOwnProperty(
                                        'department'
                                    ) &&
                                    pageAccess.management.children.department
                                        .authority
                                "
                                :to="'/index/management/department'"
                                >部門</router-link
                            >
                            <router-link
                                class="nav-link"
                                v-if="
                                    pageAccess.management.children.hasOwnProperty(
                                        'account'
                                    ) &&
                                    pageAccess.management.children.account
                                        .authority
                                "
                                :to="'/index/management/account'"
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
                        class="logout a-hover"
                        style="float: right"
                        @click.prevent="logout"
                        >登出</a
                    >
                </form>
            </div>
        </b-navbar>
        <b-container>
            <router-view style="margin-top: 10px"></router-view>
            <!-- <router-view style="position:absolute;margin-top:10px"></router-view> -->
        </b-container>
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
        console.log(this.$router);
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

