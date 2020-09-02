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
                <b-button pill v-b-toggle.collapse-1 variant="light">選擇條件</b-button>
                <b-collapse id="collapse-1" :visible="selectDepCollapseShow" class="mt-2">
                    <commonQuery />
                </b-collapse>
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
                        @click="addTaskModalShow = !addTaskModalShow;addTaskDetail.schedDate.time=nowFormat;addTaskDetail.startDate.time=nowFormat"
                    >新增事項</b-button>
                    <b-button pill class="ml-2" @click="exportModalShow = !exportModalShow">匯出</b-button>
                </div>
            </b-col>
        </b-row>

        <h3 v-if="items.length == 0">查無資料</h3>
        <b-table
            sticky-header="550px"
            responsive
            :items="items"
            :fields="fields"
            head-variant="dark"
            v-if="items.length != 0"
            class="text-center"
            :tbody-tr-attr="rowClass"
        >
            <template v-slot:cell(status)="row">
                <div :class="{hide:activeItemsSeq == row.item.seq,completedTask:row.item.status}">
                    <b-form-checkbox disabled v-model="row.item.status">
                        <span v-if="row.item.status">完成日期({{row.item.completedDate}})</span>
                    </b-form-checkbox>
                </div>
                <div :class="{hide:activeItemsSeq != row.item.seq}">
                    <b-form-checkbox v-model="row.item.status" size="lg"></b-form-checkbox>
                </div>
            </template>
            <template v-slot:cell(taskInfo)="row">
                <div
                    :class="{hide:activeItemsSeq == row.item.seq,completedTask:row.item.status}"
                >{{row.item.taskInfo}}</div>
                <div :class="{hide:activeItemsSeq != row.item.seq}">
                    <b-form-input class="input-text" type="text" v-model="row.item.taskInfo"></b-form-input>
                </div>
            </template>
            <template v-slot:cell(schedDate)="row">
                <template
                    v-if="row.item.schedDate.time == '' && activeItemsSeq != row.item.seq"
                >尚未指定</template>
                <template v-else>
                    <div
                        :class="{hide:activeItemsSeq == row.item.seq,completedTask:row.item.status}"
                    >{{row.item.schedDate.time}}</div>
                </template>
                <div :class="{hide:activeItemsSeq != row.item.seq}">
                    <datepicker :date="row.item.schedDate" :option="datepickerOptions"></datepicker>
                </div>
            </template>
            <template v-slot:cell(priority)="row">
                <div
                    :class="{hide:activeItemsSeq == row.item.seq,completedTask:row.item.status}"
                >{{priorityConfig[row.item.priority]}}</div>
                <div :class="{hide:activeItemsSeq != row.item.seq}">
                    <b-form-select v-model="row.item.priority" :options="priorityOptions"></b-form-select>
                </div>
            </template>
            <template v-slot:cell(assignTo)="row">
                <div
                    :class="{hide:activeItemsSeq == row.item.seq,completedTask:row.item.status}"
                >{{staffConfig[row.item.assignTo]}}</div>
                <div :class="{hide:activeItemsSeq != row.item.seq}">
                    <b-form-select v-model="row.item.assignTo" :options="getStaffOptions"></b-form-select>
                </div>
            </template>
            <template v-slot:cell(startDate)="row">
                <div
                    :class="{hide:activeItemsSeq == row.item.seq,completedTask:row.item.status}"
                >{{row.item.startDate.time}}</div>
                <div :class="{hide:activeItemsSeq != row.item.seq}">
                    <datepicker :date="row.item.startDate" :option="datepickerOptions"></datepicker>
                </div>
            </template>
            <template v-slot:cell(action)="row">
                <template v-if="activeItemsSeq != row.item.seq">
                    <b-button
                        v-if="activeItemsSeq == null"
                        @click="activeItemsSeq = row.item.seq;tempOldItemAction(true,row.item)"
                    >編輯</b-button>
                    <b-button v-else disabled>編輯</b-button>
                    <b-button
                        v-if="activeItemsSeq == null"
                        variant="danger"
                        @click="delTaskModalShow = !delTaskModalShow;delItemSeq = row.item.seq"
                        style="margin-left:10px"
                    >刪除</b-button>
                    <b-button v-else disabled variant="danger" style="margin-left:10px">刪除</b-button>
                </template>
                <template v-else-if="activeItemsSeq == row.item.seq">
                    <b-button @click="modTask(row.item)">完成編輯</b-button>
                    <b-button
                        variant="light"
                        @click="activeItemsSeq = null;tempOldItemAction(false,row.item)"
                        style="margin-left:10px"
                    >取消</b-button>
                </template>
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
        <!-- export modal -->
        <b-modal
            centered
            v-model="exportModalShow"
            hide-header
            hide-header-close
            no-close-on-backdrop
            no-close-on-esc
            size="sm"
        >
            <template v-slot:default>
                <div class="d-block text-center">
                    <b-button pill variant="success" class="ml-2" @click="exportfile('CSV')">匯出CSV</b-button>
                    <b-button
                        pill
                        variant="warning"
                        class="ml-2"
                        :disabled="ttfStatus"
                        @click="exportfile('PDF')"
                    >匯出PDF</b-button>
                </div>
            </template>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="exportModalShow = !exportModalShow"
                    >Close</b-button>
                </div>
            </template>
        </b-modal>
        <exportFile />
    </div>
</template>

<script>
import modal from "@/components/modal.vue";
import datepicker from "vue-datepicker/vue-datepicker-es6.vue";
import commonQuery from "@/components/commonQuery.vue";
import exportFile from "@/components/exportFile.vue";
import { validationMixin } from "vuelidate"; // 表單驗證
import { required, minLength, between } from "vuelidate/lib/validators";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "TodoList",
    data() {
        return {
            now: "",
            nowFormat: "",
            thisweekday: [],
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
            activeItemsSeq: null,
            tempThisOldItem: {
                status: null,
                completedDate: null,
                taskInfo: null,
                schedDate: { time: null },
                priority: null,
                assignTo: null,
                startDate: { time: null },
            },
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
            selectDepCollapseShow: false,
            exportModalShow: false,
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
        exportFile,
    },
    computed: {
        ...mapGetters({
            alertModalShow: "alertmodal/get_alertModalShow",
            partitionStatus: "home/get_getpartitionStatus",
            loginData: "getlogin/get_loginData",
            axiosResult: "commonaxios/get_axiosResult",
            pageAccess: "getlogin/get_pageAccess",
            queryResponse: "commonquery/get_queryResponse",
            thisQueryTimeInterval: "commonquery/get_thisQueryTimeInterval",
            inputData: "commonquery/get_inputData",
            ttfStatus: "exportfile/get_ttfStatus",
        }),
    },
    created: function () {
        let vm = this;
        vm.getNow();
        if (vm.pageAccess.todolist.remark != "ALL") {
            vm.setalertMsg("請稍候....");
            vm.togglealertModal(true);
        } else {
            vm.selectDepCollapseShow = true;
        }
        vm.SetCommonQueryData();
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
                    "thisweekday",
                    "selectDepCollapseShow",
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
            setapiParams: "commonquery/set_apiParams",
            queryAgain: "commonquery/do_queryAgain",
            setautoTable: "exportfile/set_autoTable",
        }),
        SetCommonQueryData() {
            var vm = this;
            var todolistqueryoptions = [];
            var todolistqueryselected = "ALL";
            if (vm.pageAccess.todolist.remark == "ALL") {
                todolistqueryoptions = [
                    { text: "雲端AI(智慧)平台部", value: "1003" },
                    { text: "系統研發部", value: "1002" },
                    { text: "資訊通訊部", value: "1001" },
                    { text: "全選", value: "ALL" },
                ];
            } else {
                todolistqueryoptions = [
                    {
                        text: vm.depConfig[vm.pageAccess.todolist.remark],
                        value: String(vm.pageAccess.todolist.remark),
                    },
                ];
                todolistqueryselected = vm.pageAccess.todolist.remark;
            }
            var obj = {
                options: todolistqueryoptions,
                selected: todolistqueryselected,
                inputtext: "",
            };
            vm.setinputData(obj);
            let commonApiParams = {
                table: "todoList",
                attr: "depID",
                timeattr: "schedDate",
                intervaltime: {
                    schedDate: [
                        [
                            vm.thisweekday[0] + " 00:00:00",
                            vm.thisweekday[1] + " 23:59:59",
                        ],
                    ],
                },
            };
            console.log(commonApiParams);
            vm.setapiParams(commonApiParams);
        },
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
            vm.now =
                returnobj.weekday +
                ", " +
                returnobj.month +
                "月 " +
                returnobj.day +
                ", " +
                returnobj.year;

            vm.nowFormat =
                returnobj.year + "-" + returnobj.month + "-" + returnobj.day;
            console.log(vm.nowFormat);

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
            vm.thisweekday = [
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
            console.log(vm.thisweekday);
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
        getTodoList() {
            let vm = this;
            vm.setalertMsg("請稍候....");
            vm.togglealertModal(true);
            vm.selectDepCollapseShow = false;
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
                                vm.queryAgain();
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
        //紀錄舊的temp item data,若取消編輯可恢復資料
        tempOldItemAction(status, item) {
            let vm = this;
            if (status) {
                vm.tempThisOldItem.status = item.status;
                vm.tempThisOldItem.completedDate = item.completedDate;
                vm.tempThisOldItem.taskInfo = item.taskInfo;
                vm.tempThisOldItem.schedDate.time = item.schedDate.time;
                vm.tempThisOldItem.priority = item.priority;
                vm.tempThisOldItem.assignTo = item.assignTo;
                vm.tempThisOldItem.startDate.time = item.startDate.time;
            } else {
                item.status = vm.tempThisOldItem.status;
                item.completedDate = vm.tempThisOldItem.completedDate;
                item.taskInfo = vm.tempThisOldItem.taskInfo;
                item.schedDate.time = vm.tempThisOldItem.schedDate.time;
                item.priority = vm.tempThisOldItem.priority;
                item.assignTo = vm.tempThisOldItem.assignTo;
                item.startDate.time = vm.tempThisOldItem.startDate.time;
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
                // vm.setalertMsg("請稍候...");
                // vm.togglealertModal(true);
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
                            vm.queryAgain();
                        }, 1200);
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
            // vm.setalertMsg("請稍候.....");
            // vm.togglealertModal(true);
            console.log(items);
            let thiscompletedDate = "";
            if (items.status) thiscompletedDate = vm.nowFormat;
            console.log(vm.nowFormat);
            console.log(items);
            let checkvalid = ["taskInfo"];
            for (let i = 0; i < checkvalid.length; i++) {
                if (items[checkvalid[i]] == "") {
                    vm.setalertMsg("尚有未輸入的值");
                    vm.settimeoutalertModal();
                    return;
                }
            }
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
            vm.activeItemsSeq = null;
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
                        vm.queryAgain();
                    }, 1200);
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
                        vm.queryAgain();
                    }, 1200);
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
        exportfile(filetype) {
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
            let thisdep = "全部門";
            if (vm.inputData.selected != "ALL") {
                thisdep = vm.depConfig[vm.inputData.selected];
            }
            console.log(thisdep);
            const fileName = thisdep + "的待辦事項_" + vm.nowFormat;
            const data = thisexportdata.map((itemsdata) =>
                Object.values(itemsdata)
            );
            if (filetype === "CSV") {
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
                vm.setautoTable({
                    body: data,
                    exportfilename: fileName,
                    exportfiletype: filetype,
                });
            } else {
                console.log(vm.thisweekday);
                //抓取此次時間區段
                let thistimeinterval = "";
                console.log(vm.thisQueryTimeInterval);
                if (vm.thisQueryTimeInterval == "DEFAULT") {
                    thistimeinterval = vm.thisweekday.join(" ~ ");
                } else if (vm.thisQueryTimeInterval == "ALL") {
                    thistimeinterval = "資料表內所有資料";
                } else {
                    thistimeinterval = vm.thisQueryTimeInterval.join(" ~ ");
                }
                console.log(thistimeinterval);
                vm.setautoTable({
                    body: data,
                    columns: [
                        { header: "部門", dataKey: "depID" },
                        { header: "完成", dataKey: "status" },
                        { header: "完成日期", dataKey: "completedDate" },
                        { header: "描述", dataKey: "taskInfo" },
                        { header: "預計完成日期", dataKey: "schedDate" },
                        { header: "優先順序", dataKey: "priority" },
                        { header: "指派對象", dataKey: "assignTo" },
                        { header: "發起日", dataKey: "startDate" },
                    ],
                    columnStyles: {
                        depID: { font: "msjh" },
                        status: { font: "msjh" },
                        completedDate: { font: "msjh" },
                        taskInfo: { font: "msjh" },
                        schedDate: { font: "msjh" },
                        priority: { font: "msjh" },
                        assignTo: { font: "msjh" },
                        startDate: { font: "msjh" },
                    },
                    headStyles: {
                        font: "msjh",
                        fillColor: [160, 215, 255],
                        valign: "middle",
                        halign: "center",
                        textColor: 10,
                        lineWidth: 1,
                        cellPadding: 3,
                        minCellWidth: 50,
                    },
                    exportfilename: fileName,
                    exportfiletype: filetype,
                    text: [thisdep, thistimeinterval],
                });
            }
            setTimeout(() => {
                vm.exportModalShow = false;
            }, 1000);
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
