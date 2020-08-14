<template>
    <div class="TodoList">
        <div id="bluebg">
            <img src="../assets/todolist.png" />
            待辦事項清單
        </div>
        <b-row class="mb-3 mt-1">
            <b-col sm="3">
                <h5 style="margin-top:5px">{{now}}</h5>
            </b-col>
            <b-col sm="9" class="text-right">
                <b-button
                    pill
                    variant="light"
                    @click="selectDepModalShow = !selectDepModalShow;selectDepModalOpacity = false"
                    v-if="pageAccess.todolist.remark === 'ALL'"
                >選擇條件</b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="2">
                <b-table-simple small responsive borderless style="width:300px;margin-bottom:20px">
                    <b-tbody>
                        <b-tr>
                            <b-td class="text-right" variant="dark" style="width:100px">今天到期：</b-td>
                            <b-td variant="secondary" style="width:200px">{{dueTodayNum}}</b-td>
                        </b-tr>
                        <b-tr>
                            <b-td class="text-right" variant="dark" style="width:100px">逾期：</b-td>
                            <b-td variant="secondary" style="width:200px">{{overDueNum}}</b-td>
                        </b-tr>
                    </b-tbody>
                </b-table-simple>
            </b-col>
            <b-col sm="10" class="text-right">
                <div>
                    <b-button
                        pill
                        variant="primary"
                        @click="addTaskModalShow = !addTaskModalShow;addTaskDetail.schedDate.time=nowFormat"
                    >新增事項</b-button>
                    <b-button pill class="ml-2" @click="exportCSV()">匯出CSV</b-button>
                </div>
            </b-col>
        </b-row>

        <h3 v-if="items.length == 0">查無資料</h3>
        <b-table
            sticky-header="600px"
            responsive
            :items="items"
            :fields="fields"
            head-variant="dark"
            v-if="items.length != 0"
            class="text-center"
            :tbody-tr-attr="rowClass"
        >
            <template v-slot:cell(status)="row">
                <div :class="{hide:activeItemsIndex == row.index,completedTask:row.item.status}">
                    <b-form-checkbox disabled v-model="row.item.status">
                        <span v-if="row.item.status">完成日期({{row.item.completedDate}})</span>
                    </b-form-checkbox>
                </div>
                <div :class="{hide:activeItemsIndex != row.index}">
                    <b-form-checkbox v-model="row.item.status" size="lg"></b-form-checkbox>
                </div>
            </template>
            <template v-slot:cell(taskInfo)="row">
                <div
                    :class="{hide:activeItemsIndex == row.index,completedTask:row.item.status}"
                >{{row.item.taskInfo}}</div>
                <div :class="{hide:activeItemsIndex != row.index}">
                    <b-form-input class="input-text" type="text" v-model="row.item.taskInfo"></b-form-input>
                </div>
            </template>
            <template v-slot:cell(schedDate)="row">
                <template v-if="row.item.schedDate.time == '' && activeItemsIndex != row.index">尚未指定</template>
                <template v-else>
                    <div
                        :class="{hide:activeItemsIndex == row.index,completedTask:row.item.status}"
                    >{{row.item.schedDate.time}}</div>
                </template>
                <div :class="{hide:activeItemsIndex != row.index}">
                    <datepicker :date="row.item.schedDate" :option="datepickerOptions"></datepicker>
                </div>
            </template>
            <template v-slot:cell(priority)="row">
                <div
                    :class="{hide:activeItemsIndex == row.index,completedTask:row.item.status}"
                >{{priorityConfig[row.item.priority]}}</div>
                <div :class="{hide:activeItemsIndex != row.index}">
                    <b-form-select v-model="row.item.priority" :options="priorityOptions"></b-form-select>
                </div>
            </template>
            <template v-slot:cell(assignTo)="row">
                <div
                    :class="{hide:activeItemsIndex == row.index,completedTask:row.item.status}"
                >{{staffConfig[row.item.assignTo]}}</div>
                <div :class="{hide:activeItemsIndex != row.index}">
                    <b-form-select v-model="row.item.assignTo" :options="getStaffOptions"></b-form-select>
                </div>
            </template>
            <template v-slot:cell(startDate)="row">
                <div
                    :class="{hide:activeItemsIndex == row.index,completedTask:row.item.status}"
                >{{row.item.startDate.time}}</div>
                <div :class="{hide:activeItemsIndex != row.index}">
                    <datepicker :date="row.item.startDate" :option="datepickerOptions"></datepicker>
                </div>
            </template>
            <template v-slot:cell(action)="row">
                <template v-if="activeItemsIndex != row.index">
                    <b-button
                        v-if="activeItemsIndex == null"
                        @click="activeItemsIndex = row.index"
                    >編輯</b-button>
                    <b-button v-else disabled>編輯</b-button>
                </template>
                <template v-else-if="activeItemsIndex == row.index">
                    <b-button @click="activeItemsIndex = null;modTask(row.item)">完成編輯</b-button>
                </template>
                <b-button
                    variant="danger"
                    @click="delTaskModalShow = !delTaskModalShow;delItemSeq = row.item.seq"
                    style="margin-left:10px"
                >刪除</b-button>
            </template>
        </b-table>
        <!-- 新增事項modal -->
        <b-modal
            centered
            hide-footer
            v-model="addTaskModalShow"
            size="lg"
            no-close-on-backdrop
            no-close-on-esc
        >
            <template v-slot:modal-header>
                <h5>新增待辦事項</h5>
            </template>
            <template v-slot:default>
                <!-- <b-form @submit="uploadFormSubmit" > -->
                <b-form @submit="addTask">
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="input-default">發起日:</label>
                        </b-col>
                        <b-col sm="10">
                            <datepicker :date="addTaskDetail.startDate" :option="datepickerOptions"></datepicker>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="input-default">描述:</label>
                        </b-col>
                        <b-col
                            sm="10"
                            :class="{ 'form-group--error': $v.addTaskDetail.taskInfo.value.$error }"
                        >
                            <b-form-input
                                v-model.trim="$v.addTaskDetail.taskInfo.$model.value"
                                class="input-title"
                                type="text"
                            ></b-form-input>
                            <template
                                v-if="check_required($v.addTaskDetail.taskInfo.value.required,$v.addTaskDetail.taskInfo.$model)"
                            >
                                <div class="error">Is required</div>
                            </template>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="input-default">預計完成日期:</label>
                        </b-col>
                        <b-col sm="10">
                            <datepicker :date="addTaskDetail.schedDate" :option="datepickerOptions"></datepicker>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="textarea-large">優先順序:</label>
                        </b-col>
                        <b-col
                            sm="5"
                            :class="{ 'form-group--error': $v.addTaskDetail.priority.value.$error }"
                        >
                            <b-form-select
                                v-model="$v.addTaskDetail.priority.$model.value"
                                :options="priorityOptions"
                                size="sm"
                            >
                                <template v-slot:first>
                                    <b-form-select-option
                                        :value="null"
                                        disabled
                                    >-- Please select an option --</b-form-select-option>
                                </template>
                            </b-form-select>
                            <template
                                v-if="check_required($v.addTaskDetail.priority.value.required,$v.addTaskDetail.priority.$model)"
                            >
                                <div class="error">Is required</div>
                            </template>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="textarea-large">指派對象:</label>
                        </b-col>
                        <b-col
                            sm="5"
                            :class="{ 'form-group--error': $v.addTaskDetail.assignTo.value.$error }"
                        >
                            <b-form-select
                                v-model="$v.addTaskDetail.assignTo.$model.value"
                                :options="getStaffOptions"
                                size="sm"
                            >
                                <template v-slot:first>
                                    <b-form-select-option
                                        :value="null"
                                        disabled
                                    >-- Please select an option --</b-form-select-option>
                                </template>
                            </b-form-select>
                            <template
                                v-if="check_required($v.addTaskDetail.assignTo.value.required,$v.addTaskDetail.assignTo.$model)"
                            >
                                <div class="error">Is required</div>
                            </template>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col lg="12" class="pb-2">
                            <div class="w-100">
                                <b-button
                                    variant="light"
                                    size="sm"
                                    class="float-right"
                                    @click.prevent="addTaskClose()"
                                >Close</b-button>
                            </div>
                            <div class="text-right">
                                <b-button
                                    type="submit"
                                    variant="success"
                                    size="sm"
                                    class="float-right"
                                    @click="$v.addTaskDetail.$touch"
                                    style="margin-right:5px"
                                >送出</b-button>
                                <!-- @click.prevent="onModify()" -->
                            </div>
                        </b-col>
                    </b-row>
                </b-form>
            </template>
        </b-modal>
        <!-- 刪除事項modal -->
        <b-modal
            centered
            v-model="delTaskModalShow"
            hide-header
            hide-header-close
            no-close-on-backdrop
            no-close-on-esc
        >
            <template v-slot:default>
                <div class="d-block text-center">
                    <h3>確定要刪除此事項嗎？</h3>
                </div>
            </template>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="delTaskModalShow = !delTaskModalShow"
                    >Close</b-button>
                    <b-button
                        variant="success"
                        size="sm"
                        class="float-right"
                        style="margin-right:10px"
                        @click.prevent="delTask()"
                    >確定刪除</b-button>
                </div>
            </template>
        </b-modal>
        <!-- 選擇條件modal -->
        <b-modal
            centered
            v-model="selectDepModalShow"
            hide-header
            hide-header-close
            no-close-on-backdrop
            no-close-on-esc
            id="choose"
            :content-class="{choose_content : selectDepModalOpacity}"
        >
            <template v-slot:default>
                <div class="d-block">
                    <commonQuery />
                </div>
            </template>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="selectDepModalShow = !selectDepModalShow"
                    >Close</b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import modal from "@/components/modal.vue";
import datepicker from "vue-datepicker/vue-datepicker-es6.vue";
import commonQuery from "@/components/commonQuery.vue";
import { validationMixin } from "vuelidate"; // 表單驗證
import { required, minLength, between } from "vuelidate/lib/validators";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "TodoList",
    data() {
        return {
            now: "",
            nowFormat: "",
            //今天到期數量
            dueTodayNum: 0,
            overDueNum: 0,
            fields: [
                { key: "status", label: "完成", sortable: true },
                // { key: "show_details", label: "完成日期"},
                // { key: "completedDate", label: "完成日期", sortable: false },
                { key: "taskInfo", label: "描述", sortable: false },
                { key: "schedDate", label: "預計完成日期", sortable: true },
                { key: "priority", label: "優先順序", sortable: true },
                { key: "assignTo", label: "指派對象", sortable: true },
                { key: "startDate", label: "發起日", sortable: true },
                { key: "action", label: "編輯按鈕", sortable: false },
            ],
            items: [],
            activeItemsIndex: null,
            delItemSeq: null,
            datepickerOptions: {
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
                    padding: "5px",
                    "line-height": "22px",
                    "font-size": "16px",
                    "text-align": "center",
                    border: "2px solid #fff",
                    "box-shadow": "0 1px 3px 0 rgba(0, 0, 0, 0.2)",
                    "border-radius": "2px",
                    color: "#5F5F5F",
                    width: "150px",
                },
                color: {
                    header: "#ccc",
                    headerText: "#f00",
                },
                overlayOpacity: 0.5, // 0.5 as default
                dismissible: true, // as true as default
            },
            depConfig: {
                "1001": "資訊通訊部",
                "1002": "系統研發部",
                "1003": "雲端AI(智慧)平台部",
            },
            priorityOptions: [
                { value: "low", text: "低" },
                { value: "medium", text: "中" },
                { value: "hight", text: "高" },
            ],
            priorityConfig: {
                low: "低",
                medium: "中",
                hight: "高",
            },
            addTaskModalShow: false,
            addTaskDetail: {
                taskInfo: {
                    key: "taskInfo",
                    value: null,
                    invalid: false,
                },
                schedDate: { time: "" },
                startDate: { time: "" },
                priority: {
                    key: "priority",
                    value: null,
                    invalid: false,
                },
                assignTo: {
                    key: "assignTo",
                    value: null,
                    invalid: false,
                },
            },
            getStaffOptions: [],
            staffConfig: {},
            depStaffRelation: {},
            delTaskModalShow: false,
            selectDepModalShow: false,
            selectDepModalOpacity: true,
        };
    },
    // 表單驗證引入
    mixins: [validationMixin],
    //驗證欄位參數
    validations() {
        let setvalid = {
            addTaskDetail: {
                taskInfo: {
                    value: {
                        required,
                    },
                },
                priority: {
                    value: {
                        required,
                    },
                },
                assignTo: {
                    value: {
                        required,
                    },
                },
            },
        };
        console.log(setvalid);
        return setvalid;
    },
    components: {
        modal,
        datepicker,
        commonQuery,
    },
    computed: {
        ...mapGetters({
            alertModalShow: "alertmodal/get_alertModalShow",
            partitionStatus: "home/get_getpartitionStatus",
            loginData: "getlogin/get_loginData",
            axiosResult: "commonaxios/get_axiosResult",
            pageAccess: "getlogin/get_pageAccess",
            queryResponse: "commonquery/get_queryResponse",
            inputData: "commonquery/get_inputData",
        }),
    },
    created: function () {
        let vm = this;
        vm.getNow();
        if (vm.pageAccess.todolist.remark === "ALL") {
            vm.SetCommonQueryData();
        } else {
            vm.setalertMsg("請稍候....");
            vm.togglealertModal(true);
        }
        vm.getBelongDepStaff();
    },
    mounted: function () {},
    watch: {
        queryResponse: {
            handler() {
                var vm = this;
                vm.reset([
                    "getStaffOptions",
                    "staffConfig",
                    "depStaffRelation",
                    "now",
                    "nowFormat",
                ]);
                // vm.changetableBusy();
                if (
                    vm.queryResponse == "查無資料" ||
                    vm.queryResponse == "時間尚未選擇"
                ) {
                    vm.setalertMsg(vm.queryResponse);
                    vm.settimeoutalertModal();
                    return;
                }
                console.log(vm.queryResponse);
                vm.getTodoList();
            },
        },
    },
    methods: {
        ...mapActions({
            axiosAction: "commonaxios/axiosAction",
            setalertMsg: "alertmodal/set_alertMsg",
            togglealertModal: "alertmodal/toggle_alertModal",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            showalertMsgProgress: "alertmodal/show_alertMsgProgress",
            setalertMsgProgressValue: "alertmodal/set_alertMsgProgressValue",
            changesetPartitionStatus: "home/change_setPartitionStatus",
            setinputData: "commonquery/set_inputData",
            queryAgain: "commonquery/do_queryAgain",
        }),
        SetCommonQueryData() {
            var vm = this;
            var obj = {};
            var todolistqueryselected = "ALL";
            var todolistqueryoptions = [
                { text: "雲端AI(智慧)平台部", value: "1003" },
                { text: "系統研發部", value: "1002" },
                { text: "資訊通訊部", value: "1001" },
                { text: "全選", value: "ALL" },
            ];
            obj.options = todolistqueryoptions;
            obj.selected = todolistqueryselected;
            obj.table = "todoList";
            obj.inputtext = "";
            vm.setinputData(obj);
            vm.selectDepModalOpacity = false;
            vm.selectDepModalShow = true;
        },
        getNow() {
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
            let nowDate = new Date();
            vm.now =
                weekdays[nowDate.getDay()] +
                ", " +
                (nowDate.getMonth() + 1) +
                "月 " +
                nowDate.getDate() +
                ", " +
                nowDate.getFullYear();

            let thisDay = nowDate.getDate();
            let thisMonth = nowDate.getMonth() + 1;
            if (thisDay < 10) thisDay = "0" + thisDay;
            if (thisMonth < 10) thisMonth = "0" + thisMonth;
            vm.nowFormat =
                nowDate.getFullYear() + "-" + thisMonth + "-" + thisDay;
            console.log(vm.nowFormat);
        },
        getTodoList() {
            let vm = this;
            // vm.items = [];
            // vm.activeItemsIndex = null;
            // var params = {};
            // params["methods"] = "POST";
            // params["whichFunction"] = "CommonSqlSyntaxQuery_";
            // params["condition"] = {
            //     condition_1: {
            //         table: "todoList",
            //         where: { depID: ["1003"] },
            //         orderby: ["asc", "schedDate"],
            //         limit: ["ALL"],
            //         symbols: { depID: ["equal"] },
            //     },
            // };
            // console.log(params);
            vm.setalertMsg("請稍候....");
            vm.togglealertModal(true);
            // let anyerror = false;
            // vm.axiosAction(params)
            //     .then(() => {
            //         var result = vm.axiosResult;
            //         console.log(result);
            //         console.log(JSON.stringify(result["QueryTableData"]));
            //         if (result["Response"] == "ok") {
            //             if (result["QueryTableData"].length == 0) {
            //                 vm.setalertMsg("查無資料");
            //                 anyerror = true;
            //             } else {
            //                 result["QueryTableData"].forEach((element) => {
            //                     let thisstatus = false;
            //                     if (element.status) thisstatus = true;
            //                     let itemsobj = {
            //                         seq: element.seq,
            //                         status: thisstatus,
            //                         completedDate: element.completedDate,
            //                         taskInfo: element.taskInfo,
            //                         schedDate: { time: element.schedDate },
            //                         priority: element.priority,
            //                         assignTo: element.assignTo,
            //                         createTime: element.createTime.split(
            //                             " "
            //                         )[0],
            //                     };
            //                     vm.items.push(itemsobj);
            //                 });
            //                 vm.checkDueNum();
            //                 vm.togglealertModal(false);
            //             }
            //         } else {
            //             vm.setalertMsg(result["Response"]);
            //             anyerror = true;
            //         }
            //     })
            //     .catch(function (err) {
            //         console.log(err);
            //         vm.setalertMsg(err);
            //         anyerror = true;
            //     })
            //     .finally(() => {
            //         console.log("done");
            //         if (anyerror) vm.settimeoutalertModal();
            //     });

            vm.queryResponse.forEach((element) => {
                let thisstatus = false;
                if (element.status) thisstatus = true;
                let itemsobj = {
                    seq: element.seq,
                    depID: element.depID,
                    status: thisstatus,
                    completedDate: element.completedDate,
                    taskInfo: element.taskInfo,
                    schedDate: { time: element.schedDate },
                    priority: element.priority,
                    assignTo: element.assignTo,
                    startDate: { time: element.startDate },
                };
                vm.items.push(itemsobj);
            });
            vm.checkDueNum();
            console.log("*************");
            vm.togglealertModal(false);
        },
        getBelongDepStaff() {
            let vm = this;
            var params = {};
            params["methods"] = "POST";
            params["whichFunction"] = "CommonSqlSyntaxQuery_";
            let thiswhere = [];
            let thissymbols = [];
            if (vm.pageAccess.todolist.remark === "ALL") {
                thiswhere = Object.keys(vm.depConfig);
                thissymbols = ["equal", "equal", "equal"];
            } else {
                thiswhere.push(vm.pageAccess.todolist.remark);
                thissymbols = ["equal"];
            }
            params["condition"] = {
                condition_1: {
                    table: "user",
                    fields: ["uID", "uName", "noumenonID", "noumenonType"],
                    where: { noumenonID: thiswhere },
                    orderby: ["desc", "lastUpdateTime"],
                    limit: ["ALL"],
                    symbols: { noumenonID: thissymbols },
                },
            };
            console.log(params);
            let anyerror = false;
            vm.axiosAction(params)
                .then(() => {
                    var result = vm.axiosResult;
                    console.log(result);
                    console.log(JSON.stringify(result["QueryTableData"]));
                    if (result["Response"] == "ok") {
                        if (result["QueryTableData"].length == 0) {
                            vm.setalertMsg("查無資料");
                            anyerror = true;
                        } else {
                            //抓todoList
                            if (vm.pageAccess.todolist.remark != "ALL") {
                                vm.setinputData({
                                    selected: vm.pageAccess.todolist.remark,
                                    table: "todoList",
                                });
                                console.log("~~~~~~~~~~");
                                vm.queryAgainAction("twice");
                            }
                            // vm.getTodoList();
                            let itemsobj = {};
                            let itemsobj2 = {};
                            result["QueryTableData"].forEach((element) => {
                                let itemsobj3 = {
                                    value: element.uID,
                                    text: element.uName,
                                };
                                itemsobj[element.uID] = String(element.uName);
                                itemsobj2[element.uID] = String(
                                    element.noumenonID
                                );
                                vm.getStaffOptions.push(itemsobj3);
                            });
                            vm.staffConfig = itemsobj;
                            vm.depStaffRelation = itemsobj2;
                        }
                    } else {
                        vm.setalertMsg(result["Response"]);
                        anyerror = true;
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setalertMsg(err);
                    anyerror = true;
                })
                .finally(() => {
                    console.log("done");
                    if (anyerror) vm.settimeoutalertModal();
                    if (vm.pageAccess.todolist.remark === "ALL")
                        vm.togglealertModal(false);
                });
            // vm.getTodoList();
            // let temp = [
            //     { uName: "蔡宜珊", uID: 2493 },
            //     { uName: "洪誌宏", uID: 2521 },
            //     { uName: "曾冠力", uID: 2581 },
            //     { uName: "吳文瑞", uID: 2547 },
            //     { uName: "吳俊輝", uID: 2522 },
            // ];
            // let itemsobj = {};
            // temp.forEach((element) => {
            //     console.log(element);
            //     let itemsobj2 = {
            //         value: element.uID,
            //         text: element.uName,
            //     };
            //     itemsobj[element.uID] = element.uName;
            //     vm.getStaffOptions.push(itemsobj2);
            // });
            // vm.staffConfig = itemsobj;
        },
        checkDueNum() {
            let vm = this;
            vm.dueTodayNum = 0;
            vm.overDueNum = 0;
            if (vm.items.length != 0) {
                vm.items.forEach((element) => {
                    if (
                        Date.parse(vm.nowFormat).valueOf() ==
                        Date.parse(element.schedDate.time).valueOf()
                    )
                        vm.dueTodayNum += 1;
                    if (
                        Date.parse(vm.nowFormat).valueOf() >
                            Date.parse(element.schedDate.time).valueOf() &&
                        !element.status
                    )
                        vm.overDueNum += 1;
                });
            }
        },
        addTask(evt) {
            evt.preventDefault();
            let vm = this;
            let checkvalid = ["taskInfo", "priority", "assignTo"];
            let status = true;
            console.log(checkvalid);
            checkvalid.forEach((element) => {
                console.log(element);
                console.log(vm.addTaskDetail[element]);
                if (!vm.addTaskDetail[element].invalid) status = false;
            });
            console.log(status);
            console.log(vm.addTaskDetail);
            if (status) {
                vm.setalertMsg("請稍候...");
                vm.togglealertModal(true);
                var params = {
                    methods: "POST",
                    whichFunction: "CommonRegister",
                    table: "todoList",
                    postdata: {
                        seq: [""],
                        depID: [
                            vm.depStaffRelation[
                                vm.addTaskDetail.assignTo.value
                            ],
                        ],
                        taskInfo: [vm.addTaskDetail.taskInfo.value],
                        schedDate: [vm.addTaskDetail.schedDate.time],
                        priority: [vm.addTaskDetail.priority.value],
                        assignTo: [vm.addTaskDetail.assignTo.value],
                        status: [false],
                        completedDate: [""],
                        creatorID: [vm.loginData.account],
                        startDate: [vm.addTaskDetail.startDate.time],
                    },
                };
                console.log(params);
                let anyerror = false;
                vm.axiosAction(params)
                    .then(() => {
                        var result = vm.axiosResult;
                        console.log(result);
                        if (result["Response"] == "ok") {
                            vm.setalertMsg("新增成功");
                        } else {
                            vm.setalertMsg(result["Response"]);
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                        vm.setalertMsg(err);
                    })
                    .finally(() => {
                        console.log("done");
                        vm.settimeoutalertModal();
                        vm.formReset();
                        setTimeout(function () {
                            // vm.getTodoList();
                            vm.queryAgainAction("once");
                        }, 500);
                        vm.addTaskModalShow = !vm.addTaskModalShow;
                    });
            }
        },
        addTaskClose() {
            var vm = this;
            vm.addTaskDetail = this.$options.data().addTaskDetail;
            vm.formReset();
            vm.addTaskModalShow = !vm.addTaskModalShow;
        },
        modTask(items) {
            let vm = this;
            vm.setalertMsg("請稍候.....");
            vm.togglealertModal(true);
            console.log(items);
            let thiscompletedDate = "";
            if (items.status) thiscompletedDate = vm.nowFormat;
            console.log(vm.nowFormat);
            console.log(items);
            var params = {
                methods: "PATCH",
                whichFunction: "CommonUpdate",
                table: "todoList",
                postdata: {
                    old_seq: [items.seq],
                    status: [items.status],
                    taskInfo: [items.taskInfo],
                    schedDate: [items.schedDate.time],
                    priority: [items.priority],
                    assignTo: [items.assignTo],
                    completedDate: [thiscompletedDate],
                    startDate: [items.startDate.time],
                },
            };
            console.log(params);
            vm.axiosAction(params)
                .then(() => {
                    var result = vm.axiosResult;
                    console.log(result);
                    if (result["Response"] == "ok") {
                        vm.setalertMsg("修改成功");
                    } else {
                        vm.setalertMsg(result["Response"]);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setalertMsg(err);
                })
                .finally(() => {
                    console.log("done");
                    vm.settimeoutalertModal();
                    setTimeout(function () {
                        // vm.getTodoList();
                        vm.queryAgainAction("once");
                        console.log("&&&&&&&&&");
                    }, 500);
                });
        },
        delTask() {
            let vm = this;
            console.log(vm.delItemSeq);
            var params = {
                methods: "DELETE",
                whichFunction: "CommonDelete",
                table: "todoList",
                postdata: {
                    seq: [vm.delItemSeq],
                },
            };
            console.log(params);
            vm.axiosAction(params)
                .then(() => {
                    var result = vm.axiosResult;
                    console.log(result);
                    if (result["Response"] == "ok") {
                        vm.setalertMsg("刪除成功");
                    } else {
                        vm.setalertMsg(result["Response"]);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setalertMsg(err);
                })
                .finally(() => {
                    console.log("done");
                    vm.settimeoutalertModal();
                    setTimeout(function () {
                        // vm.getTodoList();
                        vm.queryAgainAction("once");
                    }, 500);
                    vm.delTaskModalShow = !vm.delTaskModalShow;
                });
        },
        dateDisabled(ymd, date) {
            // Disable weekends (Sunday = `0`, Saturday = `6`) and
            // disable days that fall on the 13th of the month
            const weekday = date.getDay();
            const day = date.getDate();
            // Return `true` if the date should be disabled
            return weekday === 0 || weekday === 6;
        },
        queryAgainAction(times) {
            let vm = this;
            vm.selectDepModalOpacity = true;
            vm.selectDepModalShow = true;
            console.log("@@@@@@@@@@@");
            setTimeout(() => {
                vm.queryAgain();
                // if (times === "twice") vm.queryAgain();
            }, 0);
        },
        rowClass(item, type) {
            // console.log(item);
            // console.log(type);
            if (!item || type !== "row") return;
            if (item.status)
                return { style: "background-color:rgba(0, 0, 0, 0.144)" };
        },
        check_required(required, model) {
            // console.log(required);
            // console.log(model);
            model.invalid = required;
            return !required;
        },
        //validation表單reset
        formReset() {
            let vm = this;
            //reset valid_data
            vm.addTaskDetail = {
                taskInfo: {
                    key: "taskInfo",
                    value: null,
                    invalid: false,
                },
                schedDate: { time: "" },
                startDate: { time: "" },
                priority: {
                    key: "priority",
                    value: null,
                    invalid: false,
                },
                assignTo: {
                    key: "assignTo",
                    value: null,
                    invalid: false,
                },
            };
            vm.$nextTick(() => {
                vm.$v.$reset();
            });
        },
        //資料reset
        reset(keep) {
            var def = this.$options.data();
            for (var i = 0; i < keep.length; i++) {
                def[keep[i]] = this[keep[i]];
            }
            Object.assign(this.$data, def);
            //https://codepen.io/karimcossutti/pen/ObXyKq
        },
        //匯出csv檔
        exportCSV() {
            let vm = this;
            console.log(vm.items);
            if (vm.items.length == 0) {
                vm.setalertMsg("無資料可匯出");
                vm.settimeoutalertModal();
                return;
            }
            let thisexportdata = JSON.parse(JSON.stringify(vm.items));
            thisexportdata.map(function (item) {
                delete item.seq;
                if (item.status) {
                    item.status = "完成";
                } else {
                    item.status = "尚未完成";
                }
                item.schedDate = item.schedDate.time;
                item.startDate = item.startDate.time;
                item.depID = vm.depConfig[item.depID];
                item.assignTo = vm.staffConfig[item.assignTo];
                item.priority = vm.priorityConfig[item.priority];
            });
            const data = thisexportdata.map((itemsdata) =>
                Object.values(itemsdata)
            );
            console.log(data);
            //加入空白，匯出Excel不會改變格式
            data.forEach((item) => {
                item[0] = " " + item[0];
            });
            //加表頭
            data.unshift([
                "部門",
                "完成",
                "完成日期",
                "描述",
                "預計完成日期",
                "優先順序",
                "指派對象",
                "發起日",
            ]);
            console.log(data);
            let thisdep = "全部門";
            if (vm.inputData.selected != "ALL") {
                thisdep = vm.depConfig[vm.inputData.selected];
            }
            console.log(thisdep);
            const fileName = thisdep + "的待辦事項_" + vm.nowFormat;
            this.toCSV(data, fileName);
        },
        toCSV(data, outputName) {
            const csvContent = data.map((row) => row.join(",")).join("\n");
            const link = document.createElement("a");
            link.setAttribute(
                "href",
                "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent)
            );
            link.style = "visibility:hidden";
            link.download = outputName + ".csv";
            // link.setAttribute("download", `${outputName}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData =
                typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;

            var CSV = "";
            //Set Report title in first row or line

            CSV += ReportTitle + "\r\n\n";

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {
                    //Now convert each value to string and comma-seprated
                    row += index + ",";
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + "\r\n";
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + "\r\n";
            }

            if (CSV == "") {
                alert("Invalid data");
                return;
            }
            console.log(CSV);

            //Generate a file name
            var fileName = "";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g, "_");

            //Initialize file format you want csv or xls
            // var uri = "data:text/csv;charset=utf-8" + escape(CSV);
            var uri = "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="../../public/css/vuelidateYS.css"></style>
<style scoped>
#bluebg {
    min-height: 80px;
    background-color: rgb(80, 114, 226);
    font-size: 40px;
    color: rgba(139, 15, 15, 0.555);
}
#bluebg img {
    height: 80px;
    padding: 5px;
    margin: 0 30px 0 10px;
}
.hide {
    display: none;
}
.completedTask {
    color: lightslategrey;
    text-decoration: line-through;
}
::v-deep #choose .choose_content {
    opacity: 0 !important;
}
</style>
