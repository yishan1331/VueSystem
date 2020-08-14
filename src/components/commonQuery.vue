<template>
    <div class="commonQuery container">
        <div>
            <label>類別:</label>
            <b-form-select
                v-model="inputData.selected"
                :options="inputData.options"
                @change="onChange($event)"
            ></b-form-select>
        </div>
        <div v-if="selected == '部門名稱'" class="mt10px">
            <label>{{selected}}:</label>
            <b-form-select v-model="inputtext" :options="depDetail[0]"></b-form-select>
        </div>
        <div v-else-if="selected != ''" class="mt10px">
            <label>{{selected}}:</label>
            <b-form-input class="input-title" v-model="inputtext" type="text"></b-form-input>
        </div>
        <div class="mt10px">
            <label>時間:</label>
            <datepicker :date="startTime" :option="startoption"></datepicker>~
            <datepicker :date="endTime" :option="endoption" :limit="endoption.limit"></datepicker>
            <b-button variant="primary" @click="QueryData()" class="ml-2">查詢</b-button>
        </div>
        <b-form-checkbox
            v-model="notsettingtime"
            style="display:inline-block;margin-right:10px"
        >不指定時間</b-form-checkbox>
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
            notsettingtime: true,
        };
    },
    created: function () {
        this.DateFormat("Default");
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
            depDetail: "commonquery/get_depDetail",
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
            setalertMsg: "alertmodal/set_alertMsg",
            togglealertModal: "alertmodal/toggle_alertModal",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            setqueryResponse: "commonquery/set_queryResponse",
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
                    vm.setalertMsg("尚未輸入條件");
                    vm.settimeoutalertModal();
                    vm.changetableBusy();
                    return;
                }
            }
            //預設今天
            params["start_time"] = vm.startTime.time + " 00:00:00";
            params["end_time"] = vm.endTime.time + " 23:59:59";
            params["settingtime"] = vm.notsettingtime;
            params["table"] = vm.inputData.table;

            if (vm.inputData.selected == "ALL") {
                params["whichFunction"] = "CommonSimpleQuery";
                params["category"] = vm.inputData.selected;
                params["methods"] = "GET";
            } else {
                if (vm.inputData.table == "misBulletin") {
                    params["methods"] = "GET";
                    params["whichFunction"] = "CommonSimpleQuery";
                    params["category"] = "category";
                    params["categoryparameter"] = vm.inputData.selected;
                } else if (vm.inputData.table == "todoList") {
                    console.log(vm.inputData.selected);
                    params["methods"] = "POST";
                    params["whichFunction"] = "CommonSqlSyntaxQuery_";
                    params["condition"] = {
                        condition_1: {
                            table: "todoList",
                            where: {
                                depID: [vm.inputData.selected],
                            },
                            orderby: ["asc", "schedDate"],
                            limit: ["ALL"],
                            symbols: { depID: ["equal"] },
                        },
                    };
                } else {
                    params["whichFunction"] = "CommonSqlSyntaxQuery";
                    params["methods"] = "POST";
                    params["purpose"] = vm.inputData.querypurpose;
                    if (vm.selected != "") {
                        params["where"] = {};
                        if (
                            vm.inputData.table == "user" &&
                            vm.inputData.selected == "depName"
                        ) {
                            params["where"]["noumenonID"] = vm.inputtext.trim();
                        } else {
                            params["where"][
                                vm.inputData.selected
                            ] = vm.inputtext.trim();
                        }
                    }
                    if (!vm.notsettingtime) {
                        params["intervaltime"] = {
                            createTime: [
                                vm.startTime.time + " 00:00:00",
                                vm.endTime.time + " 23:59:59",
                            ],
                        };
                    }
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
                            vm.setalertMsg("查無資料");
                            vm.settimeoutalertModal();
                        }
                        vm.setqueryResponse("查無資料");
                    } else {
                        vm.setqueryResponse(result["QueryTableData"]);
                    }
                } else {
                    vm.setalertMsg(result["Response"]);
                    vm.settimeoutalertModal();
                }
            });
        },
        //時間格式化
        DateFormat(Default) {
            var vm = this;
            var now = new Date();
            if (Default === "Default") {
                var todayDate_start =
                    now.getFullYear() +
                    "-" +
                    (now.getMonth() + 1) +
                    "-" +
                    now.getDate();
                var todayDate_end =
                    now.getFullYear() +
                    "-" +
                    (now.getMonth() + 1) +
                    "-" +
                    now.getDate();
                vm.startoption.placeholder = todayDate_start;
                vm.startTime.time = todayDate_start;
                vm.endoption.placeholder = todayDate_end;
                vm.endTime.time = todayDate_end;
            } else {
                vm.setalertMsg("請稍候...");
                vm.togglealertModal(true);
                vm.reset([
                    "startTime",
                    "endTime",
                    "selected",
                    "inputtext",
                    "notsettingtime",
                ]);
                vm.changetableBusy();
                vm.QueryDataFunction();
            }
        },
        //查詢按鈕
        QueryData() {
            var vm = this;
            if (!vm.notsettingtime) {
                if (vm.startTime.time == "" || vm.endTime.time == "") {
                    if (vm.queryResponse == "時間尚未選擇") {
                        vm.setalertMsg("時間尚未選擇");
                        vm.settimeoutalertModal();
                    }
                    vm.setqueryResponse("時間尚未選擇");
                    return;
                }
            }
            vm.DateFormat(vm.selected);
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
</style>