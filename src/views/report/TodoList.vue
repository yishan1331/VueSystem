<template>
    <div class="TodoList">
        <div id="bluebg" class="mb-2">
            <b-row>
                <b-col sm="1">
                    <img src="../../assets/todolist.png" />
                </b-col>
                <b-col class="title" sm="8">待辦事項清單</b-col>
                <b-col sm="3">
                    <p
                        class="text-right"
                        style="
                            color: oldlace;
                            font-size: 1.05rem;
                            margin: 5px 10px 0 0;
                        "
                    >
                        {{ now }}
                    </p>
                </b-col>
            </b-row>
        </div>
        <div class="text-right" style="opacity: 0.5">
            <template v-if="collapseVisible">
                <b-icon
                    icon="arrows-collapse"
                    scale="1.5"
                    @click="collapseVisible = !collapseVisible"
                ></b-icon>
            </template>
            <template v-else>
                <b-icon
                    icon="arrows-expand"
                    scale="1.5"
                    @click="collapseVisible = !collapseVisible"
                ></b-icon>
            </template>
        </div>
        <b-collapse v-model="collapseVisible" class="mt-2">
            <b-row class="mb-3 mt-3">
                <b-col sm="10">
                    <commonQuery />
                </b-col>
                <b-col sm="2">
                    <b-table-simple
                        small
                        responsive
                        borderless
                        style="width: 200px; margin-bottom: 20px"
                    >
                        <b-tbody>
                            <b-tr>
                                <b-td
                                    class="text-right"
                                    variant="dark"
                                    style="width: 100px"
                                    >今天到期：</b-td
                                >
                                <b-td
                                    variant="secondary"
                                    style="width: 100px"
                                    >{{ dueTodayNum }}</b-td
                                >
                            </b-tr>
                            <b-tr>
                                <b-td
                                    class="text-right"
                                    variant="dark"
                                    style="width: 100px"
                                    >逾期：</b-td
                                >
                                <b-td
                                    variant="secondary"
                                    style="width: 100px"
                                    >{{ overDueNum }}</b-td
                                >
                            </b-tr>
                        </b-tbody>
                    </b-table-simple>
                    <div class="text-right">
                        <b-button
                            pill
                            variant="success"
                            @click="
                                addTaskModalShow = !addTaskModalShow;
                                addTaskDetail.schedDate.time = nowFormat;
                                addTaskDetail.startDate.time = nowFormat;
                            "
                            >新增</b-button
                        >
                        <b-button
                            pill
                            class="ml-2"
                            @click="exportModalShow = !exportModalShow"
                            >匯出</b-button
                        >
                    </div>
                </b-col>
            </b-row>
        </b-collapse>

        <h3 v-if="items.length == 0">查無資料</h3>
        <b-table
            sticky-header="550px"
            responsive
            :items="items"
            :fields="fields"
            head-variant="light"
            v-if="items.length != 0"
            class="mt-2"
            :tbody-tr-attr="rowClass"
        >
            <template v-slot:cell(status)="row">
                <div
                    :class="{
                        hide: activeItemsSeq == row.item.seq,
                        completedTask: row.item.status,
                    }"
                >
                    <b-form-checkbox disabled v-model="row.item.status">
                        <span v-if="row.item.status"
                            >完成日期({{ row.item.completedDate }})</span
                        >
                    </b-form-checkbox>
                </div>
                <div :class="{ hide: activeItemsSeq != row.item.seq }">
                    <b-form-checkbox
                        v-model="row.item.status"
                        size="lg"
                    ></b-form-checkbox>
                </div>
            </template>
            <template v-slot:cell(taskInfo)="row">
                <div
                    :class="{
                        hide: activeItemsSeq == row.item.seq,
                        completedTask: row.item.status,
                    }"
                >
                    {{ row.item.taskInfo }}
                </div>
                <div :class="{ hide: activeItemsSeq != row.item.seq }">
                    <b-form-input
                        class="input-text"
                        type="text"
                        v-model="row.item.taskInfo"
                    ></b-form-input>
                </div>
            </template>
            <template v-slot:cell(schedDate)="row">
                <template
                    v-if="
                        row.item.schedDate.time == '' &&
                        activeItemsSeq != row.item.seq
                    "
                    >尚未指定</template
                >
                <template v-else>
                    <div
                        :class="{
                            hide: activeItemsSeq == row.item.seq,
                            completedTask: row.item.status,
                        }"
                    >
                        {{ row.item.schedDate.time }}
                    </div>
                </template>
                <div :class="{ hide: activeItemsSeq != row.item.seq }">
                    <datepicker
                        :date="row.item.schedDate"
                        :option="datepickerOptions"
                    ></datepicker>
                </div>
            </template>
            <template v-slot:cell(priority)="row">
                <div
                    :class="{
                        hide: activeItemsSeq == row.item.seq,
                        completedTask: row.item.status,
                    }"
                >
                    {{ priorityConfig[row.item.priority] }}
                </div>
                <div :class="{ hide: activeItemsSeq != row.item.seq }">
                    <b-form-select
                        v-model="row.item.priority"
                        :options="priorityOptions"
                    ></b-form-select>
                </div>
            </template>
            <template v-slot:cell(assignTo)="row">
                <div
                    :class="{
                        hide: activeItemsSeq == row.item.seq,
                        completedTask: row.item.status,
                    }"
                >
                    {{ staffConfig[row.item.assignTo] }}
                </div>
                <div :class="{ hide: activeItemsSeq != row.item.seq }">
                    <b-form-select
                        v-model="row.item.assignTo"
                        :options="getStaffOptions"
                    ></b-form-select>
                </div>
            </template>
            <template v-slot:cell(startDate)="row">
                <div
                    :class="{
                        hide: activeItemsSeq == row.item.seq,
                        completedTask: row.item.status,
                    }"
                >
                    {{ row.item.startDate.time }}
                </div>
                <div :class="{ hide: activeItemsSeq != row.item.seq }">
                    <datepicker
                        :date="row.item.startDate"
                        :option="datepickerOptions"
                    ></datepicker>
                </div>
            </template>
            <template v-slot:cell(action)="row">
                <template v-if="activeItemsSeq != row.item.seq">
                    <b-button
                        v-if="activeItemsSeq == null"
                        @click="
                            activeItemsSeq = row.item.seq;
                            tempOldItemAction(true, row.item);
                        "
                        >編輯</b-button
                    >
                    <b-button v-else disabled>編輯</b-button>
                    <b-button
                        v-if="activeItemsSeq == null"
                        variant="danger"
                        @click="
                            delTaskModalShow = !delTaskModalShow;
                            delItemSeq = row.item.seq;
                        "
                        style="margin-left: 10px"
                        >刪除</b-button
                    >
                    <b-button
                        v-else
                        disabled
                        variant="danger"
                        style="margin-left: 10px"
                        >刪除</b-button
                    >
                </template>
                <template v-else-if="activeItemsSeq == row.item.seq">
                    <b-button @click="modTask(row.item)">完成編輯</b-button>
                    <b-button
                        variant="light"
                        @click="
                            activeItemsSeq = null;
                            tempOldItemAction(false, row.item);
                        "
                        style="margin-left: 10px"
                        >取消</b-button
                    >
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
                            <datepicker
                                :date="addTaskDetail.startDate"
                                :option="datepickerOptions"
                            ></datepicker>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="input-default">描述:</label>
                        </b-col>
                        <b-col
                            sm="10"
                            :class="{
                                'form-group--error':
                                    $v.addTaskDetail.taskInfo.value.$error,
                            }"
                        >
                            <b-form-input
                                v-model.trim="
                                    $v.addTaskDetail.taskInfo.$model.value
                                "
                                class="input-title"
                                type="text"
                            ></b-form-input>
                            <template
                                v-if="
                                    check_required(
                                        $v.addTaskDetail.taskInfo.value
                                            .required,
                                        $v.addTaskDetail.taskInfo.$model
                                    )
                                "
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
                            <datepicker
                                :date="addTaskDetail.schedDate"
                                :option="datepickerOptions"
                            ></datepicker>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="textarea-large">優先順序:</label>
                        </b-col>
                        <b-col
                            sm="5"
                            :class="{
                                'form-group--error':
                                    $v.addTaskDetail.priority.value.$error,
                            }"
                        >
                            <b-form-select
                                v-model="$v.addTaskDetail.priority.$model.value"
                                :options="priorityOptions"
                                size="sm"
                            >
                                <template v-slot:first>
                                    <b-form-select-option :value="null" disabled
                                        >-- Please select an option
                                        --</b-form-select-option
                                    >
                                </template>
                            </b-form-select>
                            <template
                                v-if="
                                    check_required(
                                        $v.addTaskDetail.priority.value
                                            .required,
                                        $v.addTaskDetail.priority.$model
                                    )
                                "
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
                            :class="{
                                'form-group--error':
                                    $v.addTaskDetail.assignTo.value.$error,
                            }"
                        >
                            <b-form-select
                                v-model="$v.addTaskDetail.assignTo.$model.value"
                                :options="getStaffOptions"
                                size="sm"
                            >
                                <template v-slot:first>
                                    <b-form-select-option :value="null" disabled
                                        >-- Please select an option
                                        --</b-form-select-option
                                    >
                                </template>
                            </b-form-select>
                            <template
                                v-if="
                                    check_required(
                                        $v.addTaskDetail.assignTo.value
                                            .required,
                                        $v.addTaskDetail.assignTo.$model
                                    )
                                "
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
                                    >Close</b-button
                                >
                            </div>
                            <div class="text-right">
                                <b-button
                                    type="submit"
                                    variant="success"
                                    size="sm"
                                    class="float-right"
                                    @click="$v.addTaskDetail.$touch"
                                    style="margin-right: 5px"
                                    >送出</b-button
                                >
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
                        >Close</b-button
                    >
                    <b-button
                        variant="success"
                        size="sm"
                        class="float-right"
                        style="margin-right: 10px"
                        @click.prevent="delTask()"
                        >確定刪除</b-button
                    >
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
                    <b-button
                        pill
                        variant="success"
                        class="ml-2"
                        @click="exportfile('CSV')"
                        >匯出CSV</b-button
                    >
                    <b-button
                        pill
                        variant="warning"
                        class="ml-2"
                        :disabled="ttfStatus"
                        @click="exportfile('PDF')"
                        >匯出PDF</b-button
                    >
                </div>
            </template>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="exportModalShow = !exportModalShow"
                        >Close</b-button
                    >
                </div>
            </template>
        </b-modal>
        <!-- <exportFile /> -->
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
                1001: "資訊通訊部",
                1002: "系統研發部",
                1003: "雲端AI(智慧)平台部",
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
            exportModalShow: false,
            collapseVisible: true,
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
            DEFAULT_inputData: "commonquery/get_DEFAULT_inputData",
            DEFAULT_apiParams: "commonquery/get_DEFAULT_apiParams",
            ttfStatus: "exportfile/get_ttfStatus",
            getDate: "getdate/get_Date",
        }),
    },
    created: function () {
        let vm = this;
        vm.now = vm.getDate.now;
        vm.nowFormat = vm.getDate.nowFormat;
        vm.thisweekday = vm.getDate.thisweekday;
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
                ]);
                // vm.changetableBusy();
                if (
                    vm.queryResponse == "查無資料" ||
                    vm.queryResponse == "時間尚未選擇"
                ) {
                    vm.setTimeOutAlertMsg(vm.queryResponse);
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
            setTimeOutAlertMsg: "alertmodal/set_setTimeOutAlertMsg",
            togglealertModal: "alertmodal/toggle_alertModal",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            changesetPartitionStatus: "home/change_setPartitionStatus",
            setinputData: "commonquery/set_inputData",
            setconditionOptions: "commonquery/set_conditionOptions",
            setapiParams: "commonquery/set_apiParams",
            queryAgain: "commonquery/do_queryAgain",
            setautoTable: "exportfile/set_autoTable",
            setautoTableStatus: "exportfile/set_autoTableStatus",
        }),
        SetCommonQueryData() {
            var vm = this;
            var todolistqueryoptions = [];
            var todolistqueryselected = "ALL";
            if (
                vm.pageAccess.report.children.todolist.remark.commonQueryCondition.main == "ALL"
            ) {
                todolistqueryoptions = [
                    { text: "雲端AI(智慧)平台部", value: "1003" },
                    { text: "系統研發部", value: "1002" },
                    { text: "資訊通訊部", value: "1001" },
                    { text: "全選", value: "ALL" },
                ];
            } else {
                todolistqueryoptions = [
                    {
                        text:
                            vm.depConfig[
                                vm.pageAccess.report.children.todolist.remark
                                    .commonQueryCondition.main
                            ],
                        value: String(
                            vm.pageAccess.report.children.todolist.remark.commonQueryCondition
                                .main
                        ),
                    },
                ];
                todolistqueryselected =
                    vm.pageAccess.report.children.todolist.remark.commonQueryCondition.main;
            }
            let obj = JSON.parse(JSON.stringify(vm.DEFAULT_inputData));
            obj.options = todolistqueryoptions;
            obj.selected = todolistqueryselected;
            obj.label = "部門";
            obj.childcondition = "select";
            obj.secondcondition = [
                true,
                { label: "狀態", condition: "select", attr: "status" },
            ];
            obj.second_selected = [1, 0];
            vm.setinputData(obj);
            vm.setconditionOptions([
                { text: "完成", value: [1] },
                { text: "未完成", value: [0] },
                { text: "全選", value: [1, 0] },
            ]);

            let commonApiParams = JSON.parse(
                JSON.stringify(vm.DEFAULT_apiParams)
            );
            commonApiParams.normal.table = "todoList";
            commonApiParams.normal.attr = "depID";
            commonApiParams.normal.timeattr = "schedDate";
            commonApiParams.normal.intervaltime = {
                schedDate: [
                    [
                        vm.thisweekday[0] + " 00:00:00",
                        vm.thisweekday[1] + " 23:59:59",
                    ],
                ],
            };
            vm.setapiParams(commonApiParams);
        },
        getTodoList() {
            let vm = this;
            vm.togglealertModal(true);
            vm.collapseVisible = false;
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
            if (
                vm.pageAccess.report.children.todolist.remark.commonQueryCondition.main == "ALL"
            ) {
                thiswhere = Object.keys(vm.depConfig);
                thissymbols = ["equal", "equal", "equal"];
            } else {
                thiswhere.push(
                    vm.pageAccess.report.children.todolist.remark.commonQueryCondition.main
                );
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
                            vm.setTimeOutAlertMsg("查無資料");
                            anyerror = true;
                        } else {
                            //抓todoList
                            if (
                                vm.pageAccess.report.children.todolist.remark
                                    .commonQueryCondition.main != "ALL"
                            ) {
                                vm.togglealertModal(true);
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
                        vm.setTimeOutAlertMsg(result["Response"]);
                        anyerror = true;
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setTimeOutAlertMsg(err);
                    anyerror = true;
                })
                .finally(() => {
                    console.log("done");
                    if (anyerror) vm.settimeoutalertModal();
                    if (
                        vm.pageAccess.report.children.todolist.remark.commonQueryCondition
                            .main == "ALL"
                    )
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
                            vm.setTimeOutAlertMsg("新增成功");
                        } else {
                            vm.setTimeOutAlertMsg(result["Response"]);
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                        vm.setTimeOutAlertMsg(err);
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
            // vm.togglealertModal(true);
            console.log(items);
            let thiscompletedDate = "";
            if (items.status) thiscompletedDate = vm.nowFormat;
            console.log(vm.nowFormat);
            console.log(items);
            let checkvalid = ["taskInfo"];
            for (let i = 0; i < checkvalid.length; i++) {
                if (items[checkvalid[i]] == "") {
                    vm.setTimeOutAlertMsg("尚有未輸入的值");
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
                        vm.setTimeOutAlertMsg("修改成功");
                    } else {
                        vm.setTimeOutAlertMsg(result["Response"]);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setTimeOutAlertMsg(err);
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
                        vm.setTimeOutAlertMsg("刪除成功");
                    } else {
                        vm.setTimeOutAlertMsg(result["Response"]);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setTimeOutAlertMsg(err);
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
                vm.setTimeOutAlertMsg("無資料可匯出");
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
                vm.setautoTableStatus(true);
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
<style scoped src="../../../public/css/vuelidateYS.css"></style>
<style scoped>
#bluebg {
    min-height: 70px;
    background-color: rgb(80, 114, 226);
}
#bluebg img {
    height: 70px;
    padding: 5px;
    margin: 0 30px 0 10px;
}
#bluebg .title {
    font-size: 40px;
    color: rgb(231, 241, 79);
    line-height: 70px;
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
