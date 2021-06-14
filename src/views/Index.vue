<template>
    <div class="index">
        <b-navbar
            toggleable="lg"
            type="dark"
            id="navbar"
            sticky
            style="background-color: #7c93b6"
        >
            <b-navbar-brand>
                <router-link :to="'/index/bulletin/board'">
                    <img
                        class="navbar-brand"
                        src="../assets/yishan_logo1.png"
                        width="170px"
                    />
                </router-link>
            </b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <!-- Right aligned nav items -->
                <b-navbar-nav>
                    <div
                        v-for="(item, key) in Object.keys(navbarItems)"
                        :key="key"
                    >
                        <b-nav-item-dropdown
                            v-if="
                                pageAccess.hasOwnProperty(item) &&
                                pageAccess[item].authority
                            "
                            :text="navbarItems[item].title"
                            style="float: left !important; font-size: 20px"
                            right
                        >
                            <div
                                v-for="(item2, key2, index2) in pageAccess[item]
                                    .children"
                                :key="index2"
                            >
                                <b-dropdown-item
                                    v-if="
                                        pageAccess[
                                            item
                                        ].children.hasOwnProperty(key2) &&
                                        pageAccess[item].children[key2]
                                            .authority
                                    "
                                    :to="'/index/' + item + '/' + key2"
                                >
                                    {{ navbarItems[item].children[key2].title }}
                                </b-dropdown-item>
                            </div>
                        </b-nav-item-dropdown>
                    </div>
                </b-navbar-nav>
                <b-navbar-nav class="ml-auto">
                    <template v-if="loginData.username === null">
                        <b-nav-text class="account">HI, xxxx</b-nav-text>
                    </template>
                    <template v-else>
                        <b-nav-text class="account"
                            >HI, {{ loginData.username }}</b-nav-text
                        >
                    </template>
                    <b-nav-item @click.prevent="logout">登出</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
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
            navbarItems: {
                bulletin: {
                    title: "系統公告",
                    children: {
                        board: {
                            title: "公告區",
                        },
                        manage: {
                            title: "公告管理",
                        },
                    },
                },
                architecture: {
                    title: "系統架構",
                    children: {
                        structure: {
                            title: "架構圖",
                        },
                        server: {
                            title: "伺服器狀態",
                        },
                        storage: {
                            title: "儲存設備狀態",
                        },
                    },
                },
                report: {
                    title: "報告",
                    children: {
                        todolist: {
                            title: "待辦事項",
                        },
                        weeklyreport: {
                            title: "工作週報",
                        },
                        meetingminutes: {
                            title: "會議記錄",
                        },
                        sop: {
                            title: "SOP文件",
                        },
                    },
                },
                tool: {
                    title: "工具",
                    children: {
                        fileupdownload: {
                            title: "檔案上傳下載",
                        },
                    },
                },
                management: {
                    title: "系統管理",
                    children: {
                        department: {
                            title: "部門",
                        },
                        account: {
                            title: "帳號",
                        },
                    },
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

