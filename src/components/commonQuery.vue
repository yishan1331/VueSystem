<template>
    <div class="commonQuery container mb-2">
        <div :class="{'inline-block':!inputData.usetime}">
            <div>
                <label>類別:</label>
                <b-form-select
                    v-model="inputData.selected"
                    :options="inputData.options"
                    @change="onChange($event)"
                ></b-form-select>
            </div>
            <div v-if="selected == '部門名稱'" class="mt-1">
                <label>{{selected}}:</label>
                <b-form-select v-model="inputtext" :options="depDetail[0]"></b-form-select>
            </div>
            <div v-else-if="selected != ''" class="mt-1">
                <label>{{selected}}:</label>
                <b-form-input class="input-title" v-model="inputtext" type="text"></b-form-input>
            </div>
        </div>
        <div class="mt-2" :class="{'inline-block':!inputData.usetime}">
            <div v-if="inputData.usetime" class="inline-block">
                <label>時間:</label>
                <datepicker :date="startTime" :option="startoption"></datepicker>~
                <datepicker :date="endTime" :option="endoption" :limit="endoption.limit"></datepicker>
            </div>
            <div class="inline-block">
                <b-button variant="primary" @click="QueryData($event)" class="ml-2">查詢</b-button>
            </div>
        </div>
        <b-form-checkbox
            v-if="inputData.usetime"
            v-model="settingtime"
            class="inline-block"
            style="margin-right:10px"
        >指定時間</b-form-checkbox>
        <br />
    </div>
</template>

<script>
import axios from "axios";
import datepicker from "vue-datepicker/vue-datepicker-es6.vue";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "commonQuery",
    data() {
        return {
            startTime: {
                time: "",
            },
            endTime: {
                time: "",
            },
            startoption: {
                type: "day",
                week: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                month: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
                format: "YYYY-MM-DD",
                placeholder: "",
                inputStyle: {
                    display: "inline-block",
                    padding: "6px",
                    "line-height": "22px",
                    "font-size": "16px",
                    border: "2px solid #fff",
                    "box-shadow": "0 1px 3px 0 rgba(0, 0, 0, 0.2)",
                    "border-radius": "2px",
                    color: "#5F5F5F",
                    width: "110px",
                },
                color: {
                    header: "#ccc",
                    headerText: "#f00",
                },
                overlayOpacity: 0.5, // 0.5 as default
                dismissible: true, // as true as default
            },
            endoption: {
                type: "day",
                week: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                month: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
                format: "YYYY-MM-DD",
                placeholder: "",
                inputStyle: {
                    display: "inline-block",
                    padding: "6px",
                    "line-height": "22px",
                    "font-size": "16px",
                    border: "2px solid #fff",
                    "box-shadow": "0 1px 3px 0 rgba(0, 0, 0, 0.2)",
                    "border-radius": "2px",
                    color: "#5F5F5F",
                    width: "110px",
                },
                color: {
                    header: "#ccc",
                    headerText: "#f00",
                },
                overlayOpacity: 0.5, // 0.5 as default
                dismissible: true, // as true as default
                limit: [
                    {
                        type: "fromto",
                        from: "1995-01-01",
                        to: "9999-01-01",
                    },
                ],
            },
            inputtext: "",
            selected: "",
            selectedCH: {
                depID: "部門編號",
                noumenonID: "部門編號",
                depName: "部門名稱",
                uID: "帳號",
                uName: "姓名",
            },
            settingtime: false,
        };
    },
    created: function () {
        this.DefaultDate("Default");
    },
    components: {
        datepicker,
    },
    computed: {
        ...mapGetters({
            axiosResult: "commonaxios/get_axiosResult",
            queryResponse: "commonquery/get_queryResponse",
            receivequeryAgain: "commonquery/receive_queryAgain",
            inputData: "commonquery/get_inputData",
            apiParams: "commonquery/get_apiParams",
            isInit: "commonquery/get_isInit",
            depDetail: "commonquery/get_depDetail",
            getDate: "getdate/get_Date",
        }),
    },
    watch: {
        "startTime.time": {
            handler(value) {
                var vm = this;
                if (
                    Date.parse(vm.endTime.time).valueOf() <
                    Date.parse(value).valueOf()
                ) {
                    vm.endTime.time = "";
                    vm.endoption.placeholder = "";
                }
                vm.endoption.limit[0].from = value;
                vm.endoption.limit[0].to = "";
            },
            // deep: true
        },
        "endTime.time": {
            handler(value) {
                var vm = this;
                // vm.setthisQueryTimeInterval([
                //     vm.startTime.time,
                //     vm.endTime.time,
                // ]);
            },
        },
        receivequeryAgain: {
            handler() {
                console.log("$$$$$$$$$$$$$$");
                this.QueryData();
            },
        },
    },
    methods: {
        ...mapActions({
            axiosAction: "commonaxios/axiosAction",
            setTimeOutAlertMsg: "alertmodal/set_setTimeOutAlertMsg",
            togglealertModal: "alertmodal/toggle_alertModal",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            setqueryResponse: "commonquery/set_queryResponse",
            setthisQueryTimeInterval: "commonquery/set_thisQueryTimeInterval",
            setisInit: "commonquery/set_isInit",
            changetableBusy: "commonquery/change_tableBusy",
        }),
        onChange(event) {
            console.log(event);
            var vm = this;
            if (typeof this.selectedCH[event] != "undefined") {
                vm.selected = vm.selectedCH[event];
            } else {
                vm.selected = "";
            }
            vm.inputtext = "";
        },
        //查詢API
        QueryDataFunction() {
            var vm = this;
            var params = {};
            if (vm.selected != "") {
                if (vm.inputtext == "") {
                    vm.setTimeOutAlertMsg("尚未輸入條件");
                    vm.settimeoutalertModal();
                    vm.changetableBusy();
                    return;
                }
            }
            console.log(vm.selected);
            vm.togglealertModal(true);
            //預設今天
            params["timeattr"] = vm.apiParams.normal.timeattr;
            params["start_time"] = vm.startTime.time + " 00:00:00";
            params["end_time"] = vm.endTime.time + " 23:59:59";
            params["settingtime"] = vm.settingtime;

            if (vm.apiParams.type == "normal") {
                if (vm.inputData.selected == "ALL") {
                    params["whichFunction"] = "IntervalQuery";
                    params["methods"] = "GET";
                    params["table"] = vm.apiParams.normal.table;
                    //設定此次抓取的時間區間
                    vm.setthisQueryTimeInterval("ALL");
                } else {
                    params["methods"] = "POST";
                    params["whichFunction"] = "CommonSqlSyntaxQuery_";
                    //default params
                    let fieldsparams = "";
                    let orderbyparams = ["desc", "lastUpdateTime"];
                    let limitparams = ["ALL"];
                    let whereparams = {};
                    let symbolsparams = {};
                    let intervaltimeparams = {};
                    if (vm.settingtime) {
                        intervaltimeparams[vm.apiParams.normal.timeattr] = [
                            [
                                vm.startTime.time + " 00:00:00",
                                vm.endTime.time + " 23:59:59",
                            ],
                        ];
                        //設定此次抓取的時間區間
                        vm.setthisQueryTimeInterval([
                            vm.startTime.time,
                            vm.endTime.time,
                        ]);
                    } else {
                        //若是第一次查詢才找是否有defaul參數intervaltime
                        console.log(vm.isInit);
                        if (
                            vm.isInit &&
                            Object.keys(vm.apiParams.normal.intervaltime)
                                .length != 0
                        ) {
                            intervaltimeparams =
                                vm.apiParams.normal.intervaltime;
                            // vm.setisInit(false);
                            //設定此次抓取的時間區間
                            vm.setthisQueryTimeInterval("DEFAULT");
                        } else {
                            intervaltimeparams = "";
                            //設定此次抓取的時間區間
                            vm.setthisQueryTimeInterval("ALL");
                        }
                        console.log(vm.isInit);
                    }
                    console.log(vm.apiParams.normal);
                    if (vm.apiParams.normal.attr == "") {
                        if (
                            vm.apiParams.normal.table == "user" &&
                            vm.inputData.selected == "depName"
                        ) {
                            whereparams["noumenonID"] = [vm.inputtext.trim()];
                            symbolsparams["noumenonID"] = ["like"];
                        } else {
                            whereparams[vm.inputData.selected] = [
                                vm.inputtext.trim(),
                            ];
                            symbolsparams[vm.inputData.selected] = ["like"];
                        }
                    } else {
                        whereparams[vm.apiParams.normal.attr] = [
                            vm.inputData.selected,
                        ];
                        symbolsparams[vm.apiParams.normal.attr] = ["like"];
                        if (vm.apiParams.normal.table == "todoList") {
                            orderbyparams = ["asc", "schedDate"];
                        }
                        if (vm.apiParams.normal.table == "weeklyReport") {
                            orderbyparams = ["asc", "date"];
                        }
                    }
                    params["condition"] = {
                        condition_1: {
                            table: vm.apiParams.normal.table,
                            fields: fieldsparams,
                            orderby: orderbyparams,
                            limit: limitparams,
                            where: whereparams,
                            symbols: symbolsparams,
                            intervaltime: intervaltimeparams,
                        },
                    };
                }
            } else if (vm.apiParams.type == "join") {
                if (vm.inputData.selected == "ALL") {
                    params["methods"] = "POST";
                    params["whichFunction"] = "CommonJoinMultiTable_";
                    params["condition"] = vm.apiParams.customized;
                }
            }
            console.log(params);
            vm.axiosAction(params).then(() => {
                var result = vm.axiosResult;
                console.log(result);
                vm.togglealertModal(false);
                vm.changetableBusy();
                if (result["Response"] == "ok") {
                    result["QueryTableData"] = result["QueryTableData"].sort(
                        function (a, b) {
                            return a.lastUpdateTime < b.lastUpdateTime ? 1 : -1;
                        }
                    );
                    if (result["QueryTableData"].length == 0) {
                        if (vm.queryResponse == "查無資料") {
                            vm.setTimeOutAlertMsg("查無資料");
                            vm.settimeoutalertModal();
                        }
                        vm.setqueryResponse("查無資料");
                    } else {
                        vm.setqueryResponse(result["QueryTableData"]);
                    }
                } else {
                    vm.setTimeOutAlertMsg(result["Response"]);
                    vm.settimeoutalertModal();
                }
            });
        },
        //時間格式化
        DefaultDate(Default) {
            var vm = this;
            if (Default === "Default") {
                console.log(vm.getDate);
                vm.startoption.placeholder = vm.getDate.thisweekday[0];
                vm.startTime.time = vm.getDate.thisweekday[0];
                vm.endoption.placeholder = vm.getDate.thisweekday[1];
                vm.endTime.time = vm.getDate.thisweekday[1];
                vm.endoption.limit[0].from = vm.getDate.thisweekday[1];
            } else {
                vm.reset([
                    "startTime",
                    "endTime",
                    "selected",
                    "inputtext",
                    "settingtime",
                ]);
                vm.changetableBusy();
                vm.QueryDataFunction();
            }
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
        //查詢按鈕
        QueryData(event) {
            console.log(event);
            var vm = this;
            //抓取是否是點擊查詢btn的查詢，若是將commonquery init設為false
            if (typeof event != "undefined") {
                vm.setisInit(false);
            }
            if (vm.settingtime) {
                if (vm.startTime.time == "" || vm.endTime.time == "") {
                    if (vm.queryResponse == "時間尚未選擇") {
                        vm.setTimeOutAlertMsg("時間尚未選擇");
                        vm.settimeoutalertModal();
                    }
                    vm.setqueryResponse("時間尚未選擇");
                    return;
                }
            }
            vm.DefaultDate(vm.selected);
        },
        //data reset
        reset(keep) {
            var def = this.$options.data();
            for (var i = 0; i < keep.length; i++) {
                def[keep[i]] = this[keep[i]];
            }
            Object.assign(this.$data, def);
            //https://codepen.io/karimcossutti/pen/ObXyKq
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.custom-select {
    width: 200px !important;
}
.card-title {
    font-size: 25px;
}
.input-title {
    width: 200px !important;
    display: inline-block;
    margin-top: 5px;
}
.mt10px {
    margin-top: 10px;
}
.datepicker-overlay {
    z-index: 9999 !important;
}
.inline-block {
    display: inline-block;
}
</style>