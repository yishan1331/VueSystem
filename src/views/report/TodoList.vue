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
                        <b-button
                            pill
                            class="ml-2"
                            variant="warning"
                            @click="transferDataModal(true)"
                            id="transfer"
                            >轉移</b-button
                        >
                        <b-tooltip target="transfer" variant="warning"
                            ><strong
                                >將完成的待辦事項<br />轉移至工作週報</strong
                            ></b-tooltip
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
                    </b-form-checkbox>
                    <p v-if="row.item.status">
                        完成日期({{ row.item.completedDate }})
                    </p>
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
                    v-html="row.item.taskInfo"
                ></div>
                <div :class="{ hide: activeItemsSeq != row.item.seq }">
                    <b-form-input
                        class="input-text"
                        type="text"
                        v-model="row.item.taskInfo"
                        @click="editLongData(row, 'taskInfo', true)"
                    ></b-form-input>
                </div>
            </template>
            <template v-slot:cell(taskDetail)="row">
                <div
                    :class="{
                        hide: activeItemsSeq == row.item.seq,
                        completedTask: row.item.status,
                    }"
                    v-html="row.item.taskDetail"
                ></div>
                <div :class="{ hide: activeItemsSeq != row.item.seq }">
                    <b-form-input
                        class="input-text"
                        type="text"
                        v-model="row.item.taskDetail"
                        @click="editLongData(row, 'taskDetail', true)"
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
                    {{ staffIDName[row.item.assignTo] }}
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
            <template v-slot:cell(creatorID)="row">
                <div :class="{ completedTask: row.item.status }">
                    {{ staffIDName[row.item.creatorID] }}
                </div>
            </template>
            <template v-slot:cell(Action)="row">
                <template v-if="activeItemsSeq != row.item.seq">
                    <b-button
                        v-if="activeItemsSeq == null && !row.item.status"
                        @click="
                            activeItemsSeq = row.item.seq;
                            tempOldItemAction(true, row.item);
                        "
                        >編輯</b-button
                    >
                    <b-button v-else disabled>編輯</b-button>
                    <b-button
                        v-if="activeItemsSeq == null && !row.item.status"
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
                            <label for="input-default">執行細項:</label>
                        </b-col>
                        <b-col sm="10">
                            <b-form-input
                                v-model.trim="addTaskDetail.taskDetail"
                                class="input-title"
                                type="text"
                            ></b-form-input>
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
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="textarea-large">Email提醒:</label>
                        </b-col>
                        <b-col sm="10">
                            <b-form-checkbox
                                v-model="addTaskDetail.email"
                                switch
                            ></b-form-checkbox>
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

        <!-- 轉移完成資料 modal -->
        <modal v-if="transferDataModalShow">
            <template v-slot:modalheader>
                <h5 style="margin: 0 auto">轉移資料</h5>
            </template>
            <template v-slot:default>
                <commonTable />
            </template>
            <template v-slot:modalfooter>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="transferDataModal(false)"
                        >Close</b-button
                    >
                </div>
            </template>
        </modal>

        <!-- edit LongData modal -->
        <modal v-if="editActionModalShow">
            <template v-slot:default>
                <div class="d-block text-center">
                    <b-form-textarea
                        ref="editlongdata"
                        v-model="editActionItems.Data"
                        rows="6"
                        max-rows="12"
                    ></b-form-textarea>
                </div>
            </template>
            <template v-slot:modalfooter>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="
                            editActionModalShow = !editActionModalShow
                        "
                        >Close</b-button
                    >
                    <b-button
                        variant="success"
                        size="sm"
                        class="float-right"
                        style="margin-right: 10px"
                        @click.prevent="editLongData(null, null, false)"
                        >確定</b-button
                    >
                </div>
            </template>
        </modal>

        <exportFile />
    </div>
</template>

<script>
import modal from "@/components/modal.vue";
import datepicker from "vue-datepicker/vue-datepicker-es6.vue";
import commonQuery from "@/components/commonQuery.vue";
import commonTable from "@/components/commonTable.vue";
import exportFile from "@/components/exportFile.vue";
import { validationMixin } from "vuelidate"; // 表單驗證
import { required, minLength, between } from "vuelidate/lib/validators";
import { mapGetters, mapActions } from "vuex";
import Email from "../../../public/js/smtp/smtp";
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
                {
                    key: "status",
                    label: "完成",
                    sortable: true,
                    tdClass: "w100px",
                    thClass: "w100px",
                },
                // { key: "show_details", label: "完成日期"},
                // { key: "completedDate", label: "完成日期", sortable: false },
                { key: "taskInfo", label: "描述", sortable: false },
                { key: "schedDate", label: "預計完成日期", sortable: true },
                {
                    key: "priority",
                    label: "優先順序",
                    sortable: true,
                    tdClass: "w100px",
                    thClass: "w100px",
                },
                {
                    key: "assignTo",
                    label: "指派對象",
                    sortable: true,
                    tdClass: "w100px",
                    thClass: "w100px",
                },
                { key: "taskDetail", label: "執行細項", sortable: false },
                { key: "startDate", label: "發起日", sortable: true },
                {
                    key: "creatorID",
                    label: "發起人",
                    sortable: true,
                    tdClass: "w100px",
                    thClass: "w100px",
                },
                { key: "Action", label: "編輯按鈕", sortable: false },
            ],
            items: [],
            activeItemsSeq: null,
            tempThisOldItem: {
                status: null,
                completedDate: null,
                taskInfo: null,
                taskDetail: null,
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
                1020: "智能製造事業處", //副總部門
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
                taskDetail: "",
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
                email: true,
            },
            getStaffOptions: [],
            staffIDName: {},
            staffIDEmail: {},
            depStaffRelation: {},
            delTaskModalShow: false,
            exportModalShow: false,
            collapseVisible: true,
            transferDataModalShow: false,
            editActionModalShow: false,
            editActionItems: {
                seq: null,
                Data: "",
                which: "",
            },
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
        commonTable,
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
            DEFAULT_commonModalConfig: "usemodal/get_DEFAULT_commonModalConfig",
            tableResponse: "commontable/get_tableResponse",
            contentData: "adjustdata/get_contentData",
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
                    "staffIDName",
                    "staffIDEmail",
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
                // console.log(JSON.stringify(vm.queryResponse));
                vm.getTodoList();
            },
        },
        tableResponse: {
            handler() {
                let vm = this;
                console.log(vm.tableResponse);
                vm[vm.tableResponse.function](vm.tableResponse.params);
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
            setcommonModalConfig: "usemodal/set_commonModalConfig",
            togglecommonModal: "usemodal/toggle_commonModal",
            settableSlotConfig: "commontable/set_tableSlotConfig",
            settableDetail: "commontable/set_tableDetail",
            settableInWhichTab: "commontable/set_tableInWhichTab",
            adjustContentData: "adjustdata/adjust_ContentData",
        }),
        SetCommonQueryData() {
            var vm = this;
            var todolistqueryoptions = [];
            var todolistqueryselected = "ALL";
            if (
                vm.pageAccess.report.children.todolist.remark
                    .commonQueryCondition.main == "ALL"
            ) {
                todolistqueryoptions = [
                    { text: "雲端AI(智慧)平台部", value: "1003" },
                    { text: "系統研發部", value: "1002" },
                    { text: "資訊通訊部", value: "1001" },
                    { text: "智能製造事業處", value: "ALL" },
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
                            vm.pageAccess.report.children.todolist.remark
                                .commonQueryCondition.main
                        ),
                    },
                ];
                todolistqueryselected =
                    vm.pageAccess.report.children.todolist.remark
                        .commonQueryCondition.main;
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

            commonApiParams.customized = {
                condition_1: {
                    union: ["condition_2", true],
                },
                condition_2: {
                    table: "todoListComplt",
                    fields: "",
                    orderby: "",
                    limit: "",
                    where: "condition_1",
                    symbols: "condition_1",
                    intervaltime: "condition_1",
                    subquery: "",
                },
            };

            vm.setapiParams(commonApiParams);
        },

        getTodoList() {
            let vm = this;
            vm.togglealertModal(true);
            vm.collapseVisible = false;
            console.log(vm.inputData.selected);
            vm.queryResponse.forEach((element) => {
                let thisstatus = false;
                if (element.status) thisstatus = true;
                let itemsobj = {
                    seq: element.seq,
                    depID: element.depID,
                    status: thisstatus,
                    completedDate: element.completedDate,
                    taskInfo: element.taskInfo,
                    taskDetail: element.taskDetail,
                    schedDate: { time: element.schedDate },
                    priority: element.priority,
                    assignTo: element.assignTo,
                    startDate: { time: element.startDate },
                    creatorID: element.creatorID,
                };
                //判斷此帳號若為副總賬號，只顯示他create的資料
                if (vm.loginData.account == "2496") {
                    if (vm.inputData.selected == "ALL") {
                        if (element.creatorID == "2496")
                            vm.items.push(itemsobj);
                    } else {
                        vm.items.push(itemsobj);
                    }
                } else {
                    vm.items.push(itemsobj);
                }
            });
            vm.checkDueNum();
            console.log("*************");
            vm.togglealertModal(false);
        },

        getBelongDepStaff() {
            let vm = this;
            var params = {};
            params["methods"] = "POST";
            params["whichFunction"] = "CommonSqlSyntaxQuery";
            let thiswhere = [];
            let thissymbols = [];
            if (
                vm.pageAccess.report.children.todolist.remark
                    .commonQueryCondition.main == "ALL"
            ) {
                thiswhere = Object.keys(vm.depConfig);
                Object.keys(vm.depConfig).map((element) => {
                    thissymbols.push("equal");
                });
            } else {
                thiswhere.push(
                    vm.pageAccess.report.children.todolist.remark
                        .commonQueryCondition.main
                );
                thissymbols.push("equal");
            }
            params["condition"] = {
                condition_1: {
                    table: "user",
                    fields: [
                        "uID",
                        "uName",
                        "noumenonID",
                        "noumenonType",
                        "email",
                    ],
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
                    if (
                        Object.prototype.toString.call(result) !=
                        "[object Object]"
                    ) {
                        vm.setTimeOutAlertMsg(result);
                        anyerror = true;
                        return;
                    }

                    // console.log(JSON.stringify(result["QueryTableData"]));
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
                            let staffIDName = {};
                            let depStaffRelation = {};
                            let staffIDEmail = {};
                            result["QueryTableData"].forEach((element) => {
                                let getStaffOptions = {
                                    value: element.uID,
                                    text: element.uName,
                                };
                                if (element.noumenonID != "1020") {
                                    vm.getStaffOptions.push(getStaffOptions);
                                } else if (
                                    vm.pageAccess.report.children.todolist
                                        .remark.commonQueryCondition.main ==
                                    "ALL"
                                ) {
                                    vm.getStaffOptions.push(getStaffOptions);
                                }
                                staffIDName[element.uID] = String(
                                    element.uName
                                );
                                staffIDEmail[element.uID] = String(
                                    element.email
                                );
                                depStaffRelation[element.uID] = String(
                                    element.noumenonID
                                );
                            });
                            vm.staffIDName = staffIDName;
                            vm.staffIDEmail = staffIDEmail;
                            vm.depStaffRelation = depStaffRelation;
                            console.log(vm.staffIDEmail);
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
                        vm.pageAccess.report.children.todolist.remark
                            .commonQueryCondition.main != "ALL"
                    )
                        vm.togglealertModal(false);
                });
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
                vm.tempThisOldItem.taskDetail = item.taskDetail;
                vm.tempThisOldItem.schedDate.time = item.schedDate.time;
                vm.tempThisOldItem.priority = item.priority;
                vm.tempThisOldItem.assignTo = item.assignTo;
                vm.tempThisOldItem.startDate.time = item.startDate.time;
            } else {
                item.status = vm.tempThisOldItem.status;
                item.completedDate = vm.tempThisOldItem.completedDate;
                item.taskInfo = vm.tempThisOldItem.taskInfo;
                item.taskDetail = vm.tempThisOldItem.taskDetail;
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
            checkvalid.forEach((element) => {
                if (!vm.addTaskDetail[element].invalid) status = false;
            });
            let emailData = {
                assignTo: vm.addTaskDetail.assignTo.value,
                taskInfo: vm.addTaskDetail.taskInfo.value,
                schedDate: vm.addTaskDetail.schedDate.time,
                startDate: vm.addTaskDetail.startDate.time,
                creatorID: vm.loginData.account,
            };
            if (status) {
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
                        taskDetail: [vm.addTaskDetail.taskDetail],
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

                console.log("-----before add-----");
                console.log(new Date());
                const response = async () => {
                    let addResult = await vm.addTaskFunc(params);
                    console.log(addResult);
                    let sendemailResult = "ok";
                    if (vm.addTaskDetail.email) {
                        console.log(new Date());
                        sendemailResult = await vm.sendEmail(emailData);
                    }
                    console.log(sendemailResult);
                    if (addResult === "ok" && sendemailResult === "ok") {
                        return "ok";
                    } else {
                        return `${addResult}, ${sendemailResult}`;
                    }
                };
                response()
                    .then((value) => {
                        console.log(value);
                        console.log("-----get add-----");
                        console.log(new Date());
                        if (value == "ok") {
                            if (vm.addTaskDetail.email) {
                                vm.setTimeOutAlertMsg(
                                    "新增完成並發送email給指派對象"
                                );
                            } else {
                                vm.setTimeOutAlertMsg("新增完成");
                            }
                        } else {
                            vm.setTimeOutAlertMsg(value);
                        }
                    })
                    .catch((response) => {
                        console.log(response);
                        vm.setTimeOutAlertMsg(response);
                    })
                    .finally(() => {
                        console.log("-----finally add-----");
                        console.log(new Date());
                        vm.togglealertModal(false);
                        vm.settimeoutalertModal();
                        vm.formReset();
                        setTimeout(function () {
                            vm.queryAgain();
                        }, 1200);
                        vm.addTaskModalShow = !vm.addTaskModalShow;
                    });
            }
        },

        addTaskFunc(params) {
            let vm = this;
            return new Promise((resolve, reject) => {
                vm.axiosAction(params)
                    .then(() => {
                        var result = vm.axiosResult;
                        console.log(result);
                        if (
                            Object.prototype.toString.call(result) !=
                            "[object Object]"
                        ) {
                            reject(result);
                        }

                        if (result["Response"] == "ok") {
                            console.log(new Date());
                            resolve("ok");
                        } else {
                            reject(result["Response"]);
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                        reject(err);
                    });
            });
        },

        addTaskClose() {
            var vm = this;
            vm.addTaskDetail = this.$options.data().addTaskDetail;
            vm.formReset();
            vm.addTaskModalShow = !vm.addTaskModalShow;
        },

        //send email
        //https://oranwind.org/gmail-smtp/
        //https://www.smtpjs.com
        //https://medium.com/misa-design-堯舜設計/不用懂後端也可以寫線上寄信功能-smtpjs-靠-javascript-實現-e85875456d01
        sendEmail(emailData) {
            let vm = this;
            console.log(new Date());
            console.log(vm.staffIDEmail);
            console.log(emailData);
            console.log(vm.staffIDEmail[emailData["assignTo"]]);
            return new Promise((resolve, reject) => {
                Email.send({
                    // SecureToken: "f3c99514-8aad-4588-be73-968e4568652f",
                    assignTo: vm.staffIDName[emailData["assignTo"]],
                    assignToEmail: vm.staffIDEmail[emailData["assignTo"]],
                    status: "新發起",
                    taskInfo: emailData["taskInfo"],
                    creatorIDName: vm.staffIDName[emailData["creatorID"]],
                    creatorIDEmail: vm.staffIDEmail[emailData["creatorID"]],
                    schedDate: emailData["schedDate"],
                    startDate: emailData["startDate"],
                })
                    .then((message) => {
                        console.log(new Date());
                        resolve(message.Response);
                    })
                    .catch((response) => reject(response));
            });
        },

        modTask(items) {
            let vm = this;
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
                    taskDetail: [items.taskDetail],
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
                    if (
                        Object.prototype.toString.call(result) !=
                        "[object Object]"
                    ) {
                        vm.setTimeOutAlertMsg(result);
                        vm.settimeoutalertModal(2000);
                        return;
                    }

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
                    if (
                        Object.prototype.toString.call(result) !=
                        "[object Object]"
                    ) {
                        vm.setTimeOutAlertMsg(result);
                        vm.settimeoutalertModal(2000);
                        return;
                    }

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

        editLongData(row, which, status) {
            let vm = this;
            if (status) {
                let commonModalConfig = JSON.parse(
                    JSON.stringify(vm.DEFAULT_commonModalConfig)
                );
                commonModalConfig.size = "xl";
                commonModalConfig.hideModalHeader = true;
                commonModalConfig.hideModalHeaderClose = true;
                vm.setcommonModalConfig(commonModalConfig);

                vm.editActionItems.seq = row.item.seq;
                vm.editActionItems.which = which;
                vm.adjustContentData({
                    content: String(row.item[which]),
                    status: false,
                });
                console.log(vm.contentData);
                vm.editActionItems.Data = vm.contentData;
            } else {
                vm.items.filter(function (element) {
                    if (element.seq == vm.editActionItems.seq) {
                        console.log(vm.editActionItems.Data);
                        let thisdata = vm.editActionItems.Data;
                        console.log(thisdata);
                        vm.adjustContentData({
                            content: String(thisdata),
                            status: true,
                        });
                        console.log(thisdata);
                        console.log(vm.contentData);
                        element[vm.editActionItems.which] = vm.contentData;
                        console.log(JSON.stringify(element));
                    }
                });
            }
            console.log(vm.editActionItems);
            vm.editActionModalShow = !vm.editActionModalShow;
            vm.togglecommonModal(status);
            if (status)
                setTimeout(() => {
                    this.$nextTick(() => this.$refs.editlongdata.focus());
                }, 0);
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
                taskDetail: "",
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
                email: true,
            };
            vm.$nextTick(() => {
                vm.$v.$reset();
            });
        },

        //toggle 轉移資料modal
        transferDataModal(status) {
            console.log(status);
            let vm = this;
            if (status) {
                vm.togglealertModal(true);
                let commonModalConfig = JSON.parse(
                    JSON.stringify(vm.DEFAULT_commonModalConfig)
                );
                commonModalConfig.size = "xl";
                commonModalConfig.modalClassFull = true;
                vm.setcommonModalConfig(commonModalConfig);

                //設定commonTable SlotConfig
                vm.settableSlotConfig({
                    slotConfig: {
                        completedDate: {
                            value: "completedDate",
                            "v-html": true,
                        },
                        taskInfo: {
                            value: "taskInfo",
                            "v-html": true,
                        },
                        taskDetail: {
                            value: "taskDetail",
                            "v-html": true,
                        },
                        schedDate: {
                            value: "schedDate",
                            "v-html": true,
                        },
                        priority: {
                            value: "priority",
                            conversiontable: vm.priorityConfig,
                        },
                        assignTo: {
                            value: "assignTo",
                            conversiontable: vm.staffIDName,
                        },
                        startDate: {
                            value: "startDate",
                            "v-html": true,
                        },
                        creatorID: {
                            value: "creatorID",
                            conversiontable: vm.staffIDName,
                        },
                    },
                    selectable: true,
                    selectlebel: "轉移",
                });

                var params = {};
                params["methods"] = "POST";
                params["whichFunction"] = "CommonSqlSyntaxQuery";
                let thiswhere = [];
                let thissymbols = [];
                if (
                    vm.pageAccess.report.children.todolist.remark
                        .commonQueryCondition.main == "ALL"
                ) {
                    thiswhere = Object.keys(vm.depConfig);
                    Object.keys(vm.depConfig).map((element) => {
                        thissymbols.push("equal");
                    });
                } else {
                    thiswhere.push(
                        vm.pageAccess.report.children.todolist.remark
                            .commonQueryCondition.main
                    );
                    thissymbols = ["equal"];
                }
                params["condition"] = {
                    condition_1: {
                        table: "todoList",
                        where: { depID: thiswhere, status: [1] },
                        orderby: ["desc", "lastUpdateTime"],
                        limit: ["ALL"],
                        symbols: { depID: thissymbols, status: ["equal"] },
                    },
                };
                console.log(params);
                let anyerror = false;
                vm.axiosAction(params)
                    .then(() => {
                        var result = vm.axiosResult;
                        console.log(result);
                        console.log(JSON.stringify(result["QueryTableData"]));

                        let thisitems = [];
                        result["QueryTableData"].forEach((element) => {
                            let thisstatus = false;
                            if (element.status) thisstatus = true;
                            let itemsobj = {
                                seq: element.seq,
                                depID: element.depID,
                                status: thisstatus,
                                completedDate: element.completedDate,
                                taskInfo: element.taskInfo,
                                taskDetail: element.taskDetail,
                                schedDate: element.schedDate,
                                priority: element.priority,
                                assignTo: element.assignTo,
                                startDate: element.startDate,
                                creatorID: element.creatorID,
                            };
                            thisitems.push(itemsobj);
                        });

                        vm.settableDetail({
                            items: thisitems,
                            fields: [
                                {
                                    key: "completedDate",
                                    label: "完成日期",
                                    sortable: false,
                                },
                                {
                                    key: "taskInfo",
                                    label: "描述",
                                    sortable: false,
                                },
                                {
                                    key: "taskDetail",
                                    label: "執行細項",
                                    sortable: false,
                                },
                                {
                                    key: "schedDate",
                                    label: "預計完成日期",
                                    sortable: true,
                                },
                                {
                                    key: "priority",
                                    label: "優先順序",
                                    sortable: true,
                                },
                                {
                                    key: "assignTo",
                                    label: "指派對象",
                                    sortable: true,
                                },
                                {
                                    key: "startDate",
                                    label: "發起日",
                                    sortable: true,
                                },
                                {
                                    key: "creatorID",
                                    label: "發起人",
                                    sortable: true,
                                },
                            ],
                            which: "todoList",
                            children: {},
                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                        vm.setTimeOutAlertMsg(err);
                        anyerror = true;
                    })
                    .finally(() => {
                        if (anyerror) vm.settimeoutalertModal();
                    });
            }
            vm.transferDataModalShow = status;
            vm.togglecommonModal(status);
            vm.togglealertModal(false);
        },

        transferData(params) {
            let vm = this;
            console.log(params);
            let todolistcomplt_dataparams = {
                seq: [],
                depID: [],
                status: [],
                completedDate: [],
                taskInfo: [],
                taskDetail: [],
                schedDate: [],
                priority: [],
                assignTo: [],
                startDate: [],
                creatorID: [],
            };

            let weeklyreport_dataparams = {
                seq: [],
                depID: [],
                groupID: [],
                item: [],
                date: [],
                status: [],
                progress: [],
                action: [],
                remark: [],
                priority: [],
                owner: [],
                creatorID: [],
            };
            console.log(weeklyreport_dataparams);
            let delseq = [];

            params.data.map((item) => {
                console.log(item);
                delseq.push(item.seq);

                todolistcomplt_dataparams.seq.push("");
                todolistcomplt_dataparams.depID.push(item.depID);
                todolistcomplt_dataparams.status.push(item.status);
                todolistcomplt_dataparams.completedDate.push(
                    item.completedDate
                );
                todolistcomplt_dataparams.taskInfo.push(item.taskInfo);
                todolistcomplt_dataparams.taskDetail.push(item.taskDetail);
                todolistcomplt_dataparams.schedDate.push(item.schedDate);
                todolistcomplt_dataparams.priority.push(item.priority);
                todolistcomplt_dataparams.assignTo.push(item.assignTo);
                todolistcomplt_dataparams.startDate.push(item.startDate);
                todolistcomplt_dataparams.creatorID.push(item.creatorID);

                weeklyreport_dataparams.seq.push("");
                weeklyreport_dataparams.depID.push(item.depID);
                weeklyreport_dataparams.groupID.push("");
                weeklyreport_dataparams.item.push("");
                weeklyreport_dataparams.date.push(item.completedDate);
                weeklyreport_dataparams.status.push(item.taskInfo);
                weeklyreport_dataparams.progress.push(100);
                weeklyreport_dataparams.action.push(item.taskDetail);
                weeklyreport_dataparams.remark.push("");
                weeklyreport_dataparams.priority.push(1);
                weeklyreport_dataparams.owner.push(item.assignTo);
                weeklyreport_dataparams.creatorID.push(item.creatorID);
            });
            console.log(delseq);
            console.log(weeklyreport_dataparams);

            const response = async () => {
                let addResult = await vm.transferDataAddFunc(
                    "todoListComplt",
                    todolistcomplt_dataparams,
                    weeklyreport_dataparams
                );
                console.log(addResult);
                let delResult = await vm.transferDataDelFunc(delseq);
                console.log(delResult);
                if (addResult === "ok" && delResult === "ok") {
                    return "ok";
                } else {
                    return `${addResult}, ${delResult}`;
                }
            };
            response()
                .then((value) => {
                    console.log(value);
                    if (value == "ok") {
                        vm.setTimeOutAlertMsg("轉移成功");
                        vm.settimeoutalertModal();
                        vm.transferDataModal(false);
                        setTimeout(function () {
                            vm.queryAgain();
                        }, 1200);
                    }
                })
                .catch((response) => {
                    console.log(response);
                });
        },

        transferDataAddFunc(step, todolistcomplt_params, weeklyreport_params) {
            let vm = this;
            let apiparams = {};
            if (step === "todoListComplt") {
                apiparams = {
                    methods: "POST",
                    whichFunction: "CommonRegister",
                    table: "todoListComplt",
                    postdata: todolistcomplt_params,
                };
            } else {
                apiparams = {
                    methods: "POST",
                    whichFunction: "CommonRegister",
                    table: "weeklyReport",
                    postdata: weeklyreport_params,
                };
            }
            console.log(apiparams);
            let anyerror = false;
            return new Promise((resolve, reject) => {
                vm.axiosAction(apiparams)
                    .then(() => {
                        var result = vm.axiosResult;
                        console.log(result);
                        if (
                            Object.prototype.toString.call(result) !=
                            "[object Object]"
                        ) {
                            reject("新增失敗");
                        }

                        if (result["Response"] == "ok") {
                            if (step === "todoListComplt") {
                                vm.transferDataAddFunc(
                                    "weeklyReport",
                                    {},
                                    weeklyreport_params
                                ).then((response) => {
                                    console.log(response);
                                    resolve(response);
                                });
                            } else {
                                resolve("ok");
                            }
                        } else {
                            vm.setTimeOutAlertMsg(result["Response"]);
                            anyerror = true;
                            reject("新增失敗");
                        }
                    })
                    .catch(function (err) {
                        vm.setTimeOutAlertMsg(err);
                        anyerror = true;
                        reject("新增失敗");
                    })
                    .finally(() => {
                        if (anyerror) vm.settimeoutalertModal();
                    });
            });
        },

        transferDataDelFunc(params) {
            let vm = this;
            let apiparams = {
                methods: "DELETE",
                whichFunction: "CommonDelete",
                table: "todoList",
                postdata: { seq: params },
            };
            console.log(apiparams);
            let anyerror = false;
            return new Promise((resolve, reject) => {
                vm.axiosAction(apiparams)
                    .then(() => {
                        var result = vm.axiosResult;
                        console.log(result);
                        if (
                            Object.prototype.toString.call(result) !=
                            "[object Object]"
                        ) {
                            vm.setTimeOutAlertMsg(result);
                            anyerror = true;
                            reject("刪除失敗");
                        }

                        if (result["Response"] == "ok") {
                            resolve("ok");
                        } else {
                            vm.setTimeOutAlertMsg(result["Response"]);
                            anyerror = true;
                            reject("刪除失敗");
                        }
                    })
                    .catch(function (err) {
                        vm.setTimeOutAlertMsg(err);
                        anyerror = true;
                        reject("刪除失敗");
                    })
                    .finally(() => {
                        if (anyerror) vm.settimeoutalertModal();
                    });
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
                item.taskInfo = vm.adjustContentData({
                    content: String(item.taskInfo),
                    status: false,
                });
                item.taskDetail = vm.adjustContentData({
                    content: String(item.taskDetail),
                    status: false,
                });
                item.schedDate = item.schedDate.time;
                item.startDate = item.startDate.time;
                item.depID = vm.depConfig[item.depID];
                item.assignTo = vm.staffIDName[item.assignTo];
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
                        { header: "執行細項", dataKey: "taskDetail" },
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
                        taskDetail: { font: "msjh" },
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
::v-deep .w100px {
    width: 100px !important;
    min-width: 100px !important;
}
</style>
