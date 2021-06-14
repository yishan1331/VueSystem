<template>
    <div class="WeeklyReport">
        <h4>工作週報</h4>
        <!-- <div id="bluebg" class="mb-2">
            <b-row>
                <b-col sm="1">
                    <img src="../../assets/todolist.png" />
                </b-col>
                <b-col class="title" sm="8">工作週報</b-col>
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
            <b-row>
                <b-col sm="10" :class="{ opacity_: tabIndex == 1 }">
                    <commonQuery />
                </b-col>
                <b-col sm="2" class="text-right">
                    <b-button
                        pill
                        class="ml-2"
                        variant="success"
                        @click="
                            addTaskModalShow = !addTaskModalShow;
                            addTaskWhich = tabIndex;
                        "
                    >
                        新增
                    </b-button>
                    <b-button pill class="ml-2" @click="checkExportFileLegal()"
                        >匯出</b-button
                    >
                </b-col>
            </b-row>
        </b-collapse>

        <b-tabs v-model="tabIndex">
            <b-tab title="本週" active></b-tab>
            <b-tab title="下週重點"></b-tab>
            <h5 v-if="items.length == 0" class="mt-2">選擇查詢條件</h5>
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
                <template v-slot:cell(Group)="row">
                    <div :class="{ hide: activeItemsSeq == row.item.seq }">
                        {{ row.item.Group }}
                    </div>
                    <div :class="{ hide: activeItemsSeq != row.item.seq }">
                        <b-form-input
                            list="input-list-Group"
                            v-model.trim="row.item.Group"
                        ></b-form-input>
                        <b-form-datalist
                            id="input-list-Group"
                            :options="
                                getDataListFromDBTable['Group'][
                                    pageAccess.report.children.weeklyreport
                                        .remark.commonQueryCondition.main
                                ]
                            "
                            v-model.trim="row.item.Group"
                        ></b-form-datalist>
                    </div>
                </template>
                <template v-slot:cell(Item)="row">
                    <div :class="{ hide: activeItemsSeq == row.item.seq }">
                        {{ row.item.Item }}
                    </div>
                    <div :class="{ hide: activeItemsSeq != row.item.seq }">
                        <b-form-input
                            list="input-list-Item"
                            v-model.trim="row.item.Item"
                        ></b-form-input>
                        <b-form-datalist
                            id="input-list-Item"
                            :options="
                                getDataListFromDBTable['Item'][
                                    pageAccess.report.children.weeklyreport
                                        .remark.commonQueryCondition.main
                                ]
                            "
                            v-model.trim="row.item.Item"
                        ></b-form-datalist>
                    </div>
                </template>
                <template v-slot:cell(Date)="row">
                    <template
                        v-if="
                            row.item.Date.time == '' &&
                            activeItemsSeq != row.item.seq
                        "
                        >尚未指定</template
                    >
                    <template v-else>
                        <div :class="{ hide: activeItemsSeq == row.item.seq }">
                            {{ row.item.Date.time }}
                        </div>
                    </template>
                    <div :class="{ hide: activeItemsSeq != row.item.seq }">
                        <datepicker
                            :date="row.item.Date"
                            :option="datepickerOptions"
                        ></datepicker>
                    </div>
                </template>
                <template v-slot:cell(Status)="row">
                    <div
                        :class="{ hide: activeItemsSeq == row.item.seq }"
                        v-html="row.item.Status"
                    ></div>
                    <div :class="{ hide: activeItemsSeq != row.item.seq }">
                        <b-form-input
                            class="input-text"
                            type="text"
                            v-model="row.item.Status"
                            @click="editLongData(row, 'Status', true)"
                        ></b-form-input>
                    </div>
                </template>
                <template v-slot:cell(Progress)="row">
                    <div :class="{ hide: activeItemsSeq == row.item.seq }">
                        <p style="color: green">{{ row.item.Progress }}%</p>
                    </div>
                    <div :class="{ hide: activeItemsSeq != row.item.seq }">
                        <b-form-input
                            class="input-text"
                            type="number"
                            v-model="row.item.Progress"
                            min="0"
                            step="20"
                        ></b-form-input>
                    </div>
                </template>
                <template v-slot:cell(Action)="row">
                    <div
                        :class="{ hide: activeItemsSeq == row.item.seq }"
                        v-html="row.item.Action"
                    ></div>
                    <div :class="{ hide: activeItemsSeq != row.item.seq }">
                        <b-form-input
                            class="input-text"
                            type="text"
                            v-model="row.item.Action"
                            @click="editLongData(row, 'Action', true)"
                        ></b-form-input>
                    </div>
                </template>
                <template v-slot:cell(Remark)="row">
                    <div :class="{ hide: activeItemsSeq == row.item.seq }">
                        {{ row.item.Remark }}
                    </div>
                    <div :class="{ hide: activeItemsSeq != row.item.seq }">
                        <b-form-input
                            class="input-text"
                            type="text"
                            v-model="row.item.Remark"
                        ></b-form-input>
                    </div>
                </template>
                <template v-slot:cell(Priority)="row">
                    <div :class="{ hide: activeItemsSeq == row.item.seq }">
                        {{ row.item.Priority }}
                    </div>
                    <div :class="{ hide: activeItemsSeq != row.item.seq }">
                        <b-form-input
                            class="input-text"
                            type="number"
                            v-model="row.item.Priority"
                            min="0"
                            max="100"
                            step="20"
                        ></b-form-input>
                    </div>
                </template>
                <template v-slot:cell(Dep)="row">
                    <div :class="{ hide: activeItemsSeq == row.item.seq }">
                        {{ depConfig[row.item.depID] }}
                    </div>
                    <div :class="{ hide: activeItemsSeq != row.item.seq }">
                        <b-form-select
                            v-model="row.item.depID"
                            :options="depOptions"
                        ></b-form-select>
                    </div>
                </template>
                <template v-slot:cell(Owner)="row">
                    <div :class="{ hide: activeItemsSeq == row.item.seq }">
                        <span
                            v-for="(item, index) in row.item.Owner.split(',')"
                            :key="index"
                        >
                            {{ staffConfig[item] }}
                            <span
                                v-if="
                                    index !=
                                    row.item.Owner.split(',').length - 1
                                "
                                >,</span
                            >
                        </span>
                    </div>
                    <div :class="{ hide: activeItemsSeq != row.item.seq }">
                        <b-form-input
                            class="input-text"
                            type="text"
                            v-model="row.item.Owner"
                            @click="editLongData(row, 'Owner', true)"
                        ></b-form-input>
                    </div>
                </template>
                <template v-slot:cell(Edit)="row">
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
        </b-tabs> -->

        <!-- 新增事項modal -->
        <b-modal
            centered
            hide-footer
            v-model="addTaskModalShow"
            size="xl"
            no-close-on-backdrop
            no-close-on-esc
        >
            <template v-slot:modal-header>
                <h5 v-if="tabIndex == 0">新增本週事項</h5>
                <h5 v-else-if="tabIndex == 1">新增下週重點事項</h5>
            </template>
            <template v-slot:default>
                <b-form v-if="addTaskWhich != null" @submit="addTask">
                    <b-row
                        class="my-4"
                        v-for="(item, index, key) in addTaskDetail"
                        :key="key"
                    >
                        <!-- <b-row class="my-4" v-for="(item,index,key) in $v.addTaskDetail" :key="key"> -->
                        <b-col sm="2">
                            <label :for="'input-' + index">{{ index }}:</label>
                        </b-col>
                        <template v-if="$v.addTaskDetail.hasOwnProperty(index)">
                            <b-col
                                sm="10"
                                :class="{
                                    'form-group--error':
                                        $v.addTaskDetail[index].value.$error,
                                }"
                            >
                                <b-form-input
                                    v-if="
                                        index == 'Progress' ||
                                        index == 'Priority'
                                    "
                                    :id="'input-' + index"
                                    v-model.trim="
                                        $v.addTaskDetail[index].$model.value
                                    "
                                    class="input-title"
                                    type="number"
                                    min="0"
                                    max="100"
                                ></b-form-input>
                                <b-form-select
                                    :id="'input-' + index"
                                    v-else-if="index == 'Dep'"
                                    v-model="$v.addTaskDetail.Dep.$model.value"
                                    :options="depOptions"
                                    size="sm"
                                >
                                    <template v-slot:first>
                                        <b-form-select-option
                                            :value="null"
                                            disabled
                                            >-- Please select an option
                                            --</b-form-select-option
                                        >
                                    </template>
                                </b-form-select>
                                <b-form-select
                                    :id="'input-' + index"
                                    v-else-if="index == 'Owner'"
                                    v-model="
                                        $v.addTaskDetail.Owner.$model.value
                                    "
                                    :options="getStaffOptions"
                                    size="sm"
                                    multiple
                                ></b-form-select>
                                <template
                                    v-else-if="
                                        index == 'Group' || index == 'Item'
                                    "
                                >
                                    <b-form-input
                                        :id="'input-' + index"
                                        :list="'input-list' + index"
                                        v-model.trim="
                                            $v.addTaskDetail[index].$model.value
                                        "
                                    ></b-form-input>
                                    <b-form-datalist
                                        :id="'input-list' + index"
                                        :options="
                                            getDataListFromDBTable[index][
                                                pageAccess.report.children
                                                    .weeklyreport.remark
                                                    .commonQueryCondition.main
                                            ]
                                        "
                                        v-model.trim="
                                            $v.addTaskDetail[index].$model.value
                                        "
                                    ></b-form-datalist>
                                </template>
                                <b-form-input
                                    v-else
                                    :id="'input-' + index"
                                    v-model.trim="
                                        $v.addTaskDetail[index].$model.value
                                    "
                                    class="input-title"
                                    type="text"
                                ></b-form-input>
                                <template
                                    v-if="
                                        check_required(
                                            $v.addTaskDetail[index].value
                                                .required,
                                            $v.addTaskDetail[index].$model
                                        )
                                    "
                                >
                                    <div class="error">Is required</div>
                                </template>
                                <template
                                    v-else-if="
                                        index == 'Progress' ||
                                        index == 'Priority'
                                    "
                                >
                                    <div
                                        class="jsonerror"
                                        v-if="
                                            check_positivenumvalid(
                                                $v.addTaskDetail[index].value
                                                    .positivenumvalidator,
                                                $v.addTaskDetail[index].$model
                                            )
                                        "
                                    >
                                        必須是正整數
                                    </div>
                                </template>
                            </b-col>
                        </template>
                        <template v-else>
                            <b-col sm="10">
                                <template v-if="index == 'Date'">
                                    <datepicker
                                        :date="addTaskDetail[index]"
                                        :option="datepickerOptions"
                                    ></datepicker>
                                </template>
                                <template
                                    v-else-if="
                                        index == 'Action' || index == 'Status'
                                    "
                                >
                                    <b-form-textarea
                                        :id="'input-' + index"
                                        v-model="addTaskDetail[index]"
                                        rows="4"
                                        max-rows="12"
                                    ></b-form-textarea>
                                </template>
                                <template v-else>
                                    <b-form-input
                                        :id="'input-' + index"
                                        v-model.trim="addTaskDetail[index]"
                                        class="input-title"
                                        type="text"
                                    ></b-form-input>
                                </template>
                            </b-col>
                        </template>
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
                    <b-row>
                        <b-col sm="6">
                            <b-button
                                pill
                                variant="success"
                                @click="exportFile('CSV')"
                                style="
                                    position: relative;
                                    transform: translateY(50%);
                                "
                                >CSV</b-button
                            >
                        </b-col>
                        <b-col sm="6" style="border-left: 1px solid">
                            <b-form-select
                                v-model="exportPDFselected"
                                :options="exportPDFoptions"
                                size="sm"
                            ></b-form-select>
                            <b-button
                                pill
                                variant="warning"
                                class="mt-2"
                                :disabled="ttfStatus"
                                @click="exportFile('PDF')"
                                v-b-tooltip.hover
                                title="合併儲存格會因資料長度太長可能出現排版問題(大約50chars、115bytes左右)，此時可以下載不合併的版本或分成多筆資料"
                                >PDF</b-button
                            >
                        </b-col>
                    </b-row>
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

        <!-- edit LongData modal -->
        <b-modal
            centered
            v-model="editActionModalShow"
            hide-header
            hide-header-close
            no-close-on-backdrop
            no-close-on-esc
            size="xl"
        >
            <template v-slot:default>
                <div class="d-block text-center">
                    <b-form-select
                        v-if="editActionItems.which == 'Owner'"
                        v-model="editActionItems.Data"
                        :options="getStaffOptions"
                        multiple
                    ></b-form-select>
                    <b-form-textarea
                        v-else
                        v-model="editActionItems.Data"
                        rows="6"
                        max-rows="12"
                    ></b-form-textarea>
                </div>
            </template>
            <template v-slot:modal-footer>
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
//設置Positive Number validator
const positivenumvalidator = (num) => {
    //console.log(num);
    let isPositiveNum = (val) => {
        return /^[0-9]+$/.test(val);
    };
    //console.log(isPositiveNum(num));
    return isPositiveNum(num);
};
export default {
    name: "WeeklyReport",
    data() {
        return {
            now: "",
            nowFormat: "",
            thisweekday: [],
            tabIndex: 0,
            fields: [
                { key: "Group", sortable: true },
                { key: "Item", sortable: true },
                { key: "Date", sortable: true },
                { key: "Status", sortable: false },
                { key: "Progress", sortable: true },
                { key: "Action", sortable: false },
                { key: "Remark", sortable: false },
                { key: "Priority", sortable: true },
                { key: "Dep", sortable: true },
                { key: "Owner", sortable: true },
                { key: "Edit", sortable: false },
            ],
            items: [],
            tempData: [],
            nextWeekData: [],
            activeItemsSeq: null,
            tempThisOldItem: {},
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
            depOptions: [],
            addTaskModalShow: false,
            addTaskDetail: {
                Group: {
                    key: "Group",
                    value: null,
                    invalid: false,
                },
                Date: { time: "" },
                Item: {
                    key: "Item",
                    value: null,
                    invalid: false,
                },
                Status: "",
                Progress: {
                    key: "Progress",
                    value: null,
                    invalid: false,
                },
                Action: "",
                Remark: "",
                Priority: {
                    key: "Priority",
                    value: null,
                    invalid: false,
                },
                Dep: {
                    key: "Dep",
                    value: null,
                    invalid: false,
                },
                Owner: {
                    key: "Owner",
                    value: [],
                    invalid: false,
                },
            },
            addTaskWhich: null,
            getStaffOptions: [],
            staffConfig: {},
            depStaffRelation: {},
            getDataListFromDBTable: {
                Group: { 1001: [], 1002: [], 1003: [], ALL: [] },
                Item: { 1001: [], 1002: [], 1003: [], ALL: [] },
            },
            delTaskModalShow: false,
            collapseVisible: true,
            //about export
            exportModalShow: false,
            exportPDFoptions: [
                { value: true, text: "合併儲存格" },
                { value: false, text: "不合併儲存格" },
            ],
            exportPDFselected: true,
            exportTitle: "",
            exportDate: "",
            exportColumns: [
                { header: "Group", dataKey: "Group" },
                { header: "Item", dataKey: "Item" },
                { header: "Date", dataKey: "Date" },
                { header: "Status", dataKey: "Status" },
                { header: "Progress%", dataKey: "Progress" },
                { header: "Action", dataKey: "Action" },
                { header: "Remark", dataKey: "Remark" },
                { header: "Owner", dataKey: "Owner" },
            ],
            exportColumnStyles: {
                Group: { font: "msjh" },
                Item: { font: "msjh" },
                Date: { font: "msjh" },
                Status: { font: "msjh" },
                Progress: { font: "msjh", fontSize: 12 },
                Action: { font: "msjh" },
                Remark: { font: "msjh" },
                Owner: { font: "msjh" },
            },
            exportHeadStyles: {
                font: "msjh",
                fillColor: [160, 215, 255],
                valign: "middle",
                halign: "center",
                textColor: 10,
                lineWidth: 1,
                cellPadding: 3,
                minCellWidth: 50,
            },
            //about export end
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
                Group: {
                    value: {
                        required,
                    },
                },
                Item: {
                    value: {
                        required,
                    },
                },
                Progress: {
                    value: {
                        required,
                        positivenumvalidator,
                    },
                },
                Priority: {
                    value: {
                        required,
                        positivenumvalidator,
                    },
                },
                Dep: {
                    value: {
                        required,
                    },
                },
                Owner: {
                    value: {
                        required,
                    },
                },
            },
        };
        //console.log(this.addTaskWhich);
        if (this.addTaskWhich == 1) {
            delete setvalid.addTaskDetail.Progress;
            delete setvalid.addTaskDetail.Owner;
            delete setvalid.addTaskDetail.Priority;
            //console.log(setvalid);
            return setvalid;
        }
        // else if (this.addTaskWhich == 0) {
        //     delete setvalid.addTaskDetail.Dep;
        //     return setvalid;
        // }
        else {
            return setvalid;
        }
    },
    components: {
        modal,
        datepicker,
        commonQuery,
        exportFile,
    },
    computed: {
        ...mapGetters({
            loginData: "getlogin/get_loginData",
            axiosResult: "commonaxios/get_axiosResult",
            pageAccess: "getlogin/get_pageAccess",
            queryResponse: "commonquery/get_queryResponse",
            thisQueryTimeInterval: "commonquery/get_thisQueryTimeInterval",
            inputData: "commonquery/get_inputData",
            DEFAULT_inputData: "commonquery/get_DEFAULT_inputData",
            DEFAULT_apiParams: "commonquery/get_DEFAULT_apiParams",
            ttfStatus: "exportfile/get_ttfStatus",
            errorFormat: "exportfile/get_errorFormat",
            isInit: "commonquery/get_isInit",
            getDate: "getdate/get_Date",
        }),
    },
    created: function () {
        let vm = this;
        // vm.now = vm.getDate.now;
        // vm.nowFormat = vm.getDate.nowFormat;
        // vm.thisweekday = vm.getDate.thisweekday;
        // vm.SetCommonQueryData();
        // vm.getBelongDepStaff();
    },
    mounted: function () {
        let vm = this;
        // vm.fields.splice(9, 1);
    },
    watch: {
        tabIndex: {
            handler(value) {
                var vm = this;
                let saveData = [
                    "tabIndex",
                    "getStaffOptions",
                    "staffConfig",
                    "depStaffRelation",
                    "depOptions",
                    "now",
                    "nowFormat",
                    "thisweekday",
                    "collapseVisible",
                    "exportModalShow",
                ];
                saveData.push("items", "tempData");
                vm.reset(saveData);

                //console.log("..........");
                let temp1 = vm.items.slice();
                let temp2 = vm.tempData.slice();
                vm.tempData = temp1;
                vm.items = temp2;

                let commonApiParams = JSON.parse(
                    JSON.stringify(vm.DEFAULT_apiParams)
                );
                if (vm.tabIndex == 0) {
                    commonApiParams.normal.table = "weeklyReport";
                    commonApiParams.normal.attr = "depID";
                    commonApiParams.normal.timeattr = "date";
                    commonApiParams.normal.intervaltime = {
                        date: [
                            [
                                vm.thisweekday[0] + " 00:00:00",
                                vm.thisweekday[1] + " 23:59:59",
                            ],
                        ],
                    };
                    vm.setapiParams(commonApiParams);
                    // vm.fields.splice(9, 1);
                } else {
                    commonApiParams.normal.table = "workedKey";
                    commonApiParams.normal.attr = "depID";
                    commonApiParams.normal.timeattr = "date";
                    commonApiParams.normal.intervaltime = {
                        date: [
                            [
                                vm.thisweekday[0] + " 00:00:00",
                                vm.thisweekday[1] + " 23:59:59",
                            ],
                        ],
                    };
                    vm.setapiParams(commonApiParams);
                    vm.fields.splice(2, 1);
                    vm.fields.splice(3, 4);
                    vm.fields.splice(4, 1);

                    if (vm.items.length == 0) {
                        //console.log("@@@@@@@@@");
                        vm.queryAgain();
                    }
                }
            },
        },

        queryResponse: {
            handler() {
                var vm = this;
                //console.log("////////////////////////////");
                //console.log(vm.items);
                //console.log(vm.tempData);
                let saveData = [
                    "fields",
                    "tabIndex",
                    "getStaffOptions",
                    "staffConfig",
                    "depStaffRelation",
                    "depOptions",
                    "now",
                    "nowFormat",
                    "thisweekday",
                    "collapseVisible",
                    "exportModalShow",
                ];
                if (vm.tabIndex == 1) {
                    saveData.push("tempData");
                }
                vm.reset(saveData);
                // vm.changetableBusy();
                if (
                    vm.queryResponse == "查無資料" ||
                    vm.queryResponse == "時間尚未選擇"
                ) {
                    vm.setTimeOutAlertMsg(vm.queryResponse);
                    vm.settimeoutalertModal();
                    return;
                }
                //console.log(vm.queryResponse);
                //console.log(JSON.stringify(vm.queryResponse));
                vm.getTaskList();
            },
        },

        addTaskWhich: {
            handler() {
                var vm = this;
                //console.log(vm.addTaskWhich);
                if (vm.addTaskWhich == 1) {
                    //console.log(vm.addTaskDetail);
                    delete vm.addTaskDetail.Date;
                    delete vm.addTaskDetail.Progress;
                    delete vm.addTaskDetail.Action;
                    delete vm.addTaskDetail.Remark;
                    delete vm.addTaskDetail.Priority;
                    delete vm.addTaskDetail.Owner;
                } else if (vm.addTaskWhich == 0) {
                    // delete vm.addTaskDetail.Dep;
                    vm.addTaskDetail.Date.time = vm.nowFormat;
                }
                //console.log(vm.addTaskDetail);
            },
        },
    },
    methods: {
        ...mapActions({
            axiosAction: "commonaxios/axiosAction",
            setTimeOutAlertMsg: "alertmodal/set_setTimeOutAlertMsg",
            setTimeOutAlertMsg: "alertmodal/set_setTimeOutAlertMsg",
            togglealertModal: "alertmodal/toggle_alertModal",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            changesetPartitionStatus: "home/change_setPartitionStatus",
            setinputData: "commonquery/set_inputData",
            setapiParams: "commonquery/set_apiParams",
            queryAgain: "commonquery/do_queryAgain",
            setautoTable: "exportfile/set_autoTable",
            seterrorFormat: "exportfile/set_errorFormat",
            setautoTableStatus: "exportfile/set_autoTableStatus",
        }),

        dataSorted(sortKey) {
            let config = {
                asc: { greater: 1, less: -1 },
                desc: { greater: -1, less: 1 },
            };
            return function innerSort(a, b) {
                let i = 0;
                while (i < sortKey.length) {
                    if (i == sortKey.length) return -1;
                    if (a[sortKey[i][0]] > b[sortKey[i][0]])
                        return config[sortKey[i][1]]["greater"];
                    if (a[sortKey[i][0]] < b[sortKey[i][0]])
                        return config[sortKey[i][1]]["less"];
                    i++;
                }
            };
        },

        SetCommonQueryData() {
            var vm = this;
            var weeklyreportqueryoptions = [];
            var weeklyreportqueryselected = "ALL";
            if (
                vm.pageAccess.report.children.weeklyreport.remark
                    .commonQueryCondition.main == "ALL"
            ) {
                weeklyreportqueryoptions = [
                    { text: "雲端AI(智慧)平台部", value: "1003" },
                    { text: "系統研發部", value: "1002" },
                    { text: "資訊通訊部", value: "1001" },
                    { text: "全選", value: "ALL" },
                ];
                vm.depOptions = [
                    { text: "雲端AI(智慧)平台部", value: "1003" },
                    { text: "系統研發部", value: "1002" },
                    { text: "資訊通訊部", value: "1001" },
                ];
            } else {
                weeklyreportqueryoptions = [
                    {
                        text:
                            vm.depConfig[
                                vm.pageAccess.report.children.weeklyreport
                                    .remark.commonQueryCondition.main
                            ],
                        value: String(
                            vm.pageAccess.report.children.weeklyreport.remark
                                .commonQueryCondition.main
                        ),
                    },
                ];
                weeklyreportqueryselected =
                    vm.pageAccess.report.children.weeklyreport.remark
                        .commonQueryCondition.main;
                vm.depOptions = [
                    {
                        text:
                            vm.depConfig[
                                vm.pageAccess.report.children.weeklyreport
                                    .remark.commonQueryCondition.main
                            ],
                        value: String(
                            vm.pageAccess.report.children.weeklyreport.remark
                                .commonQueryCondition.main
                        ),
                    },
                ];
            }
            let obj = JSON.parse(JSON.stringify(vm.DEFAULT_inputData));
            obj.options = weeklyreportqueryoptions;
            obj.selected = weeklyreportqueryselected;
            obj.label = "部門";
            vm.setinputData(obj);

            let commonApiParams = JSON.parse(
                JSON.stringify(vm.DEFAULT_apiParams)
            );
            commonApiParams.normal.table = "weeklyReport";
            commonApiParams.normal.attr = "depID";
            commonApiParams.normal.timeattr = "date";
            commonApiParams.normal.intervaltime = {
                date: [
                    [
                        vm.thisweekday[0] + " 00:00:00",
                        vm.thisweekday[1] + " 23:59:59",
                    ],
                ],
            };
            vm.setapiParams(commonApiParams);
        },

        getTaskList() {
            let vm = this;
            vm.togglealertModal(true);
            vm.collapseVisible = false;
            let itemsobj = {};
            vm.queryResponse.forEach((element) => {
                if (
                    !vm.getDataListFromDBTable.Group[element.depID].includes(
                        element.groupID
                    )
                ) {
                    vm.getDataListFromDBTable.Group[element.depID].push(
                        element.groupID
                    );
                    if (
                        !vm.getDataListFromDBTable.Group["ALL"].includes(
                            element.groupID
                        )
                    )
                        vm.getDataListFromDBTable.Group["ALL"].push(
                            element.groupID
                        );
                }
                if (
                    !vm.getDataListFromDBTable.Item[element.depID].includes(
                        element.item
                    )
                ) {
                    vm.getDataListFromDBTable.Item[element.depID].push(
                        element.item
                    );
                    if (
                        !vm.getDataListFromDBTable.Item["ALL"].includes(
                            element.item
                        )
                    )
                        vm.getDataListFromDBTable.Item["ALL"].push(
                            element.item
                        );
                }
                if (vm.tabIndex == 0) {
                    itemsobj = {
                        seq: element.seq,
                        depID: element.depID,
                        Group: element.groupID,
                        Item: element.item,
                        Date: { time: element.date },
                        Status: element.status,
                        // Status: vm.replaceContentData(
                        //     String(element.status),
                        //     false
                        // ),
                        Progress: element.progress,
                        Action: element.action,
                        // Action: vm.replaceContentData(
                        //     String(element.action),
                        //     false
                        // ),
                        Remark: element.remark,
                        Priority: element.priority,
                        Owner: String(element.owner),
                    };
                } else {
                    itemsobj = {
                        seq: element.seq,
                        depID: element.depID,
                        Group: element.groupID,
                        Item: element.item,
                        Status: element.detail,
                    };
                }
                vm.items.push(itemsobj);
            });
            //console.log("*************");
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
                vm.pageAccess.report.children.weeklyreport.remark
                    .commonQueryCondition.main == "ALL"
            ) {
                thiswhere = Object.keys(vm.depConfig);
                thissymbols = ["equal", "equal", "equal"];
            } else {
                thiswhere.push(
                    vm.pageAccess.report.children.weeklyreport.remark
                        .commonQueryCondition.main
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
            //console.log(params);
            let anyerror = false;
            vm.axiosAction(params)
                .then(() => {
                    var result = vm.axiosResult;
                    if (
                        Object.prototype.toString.call(result) !=
                        "[object Object]"
                    ) {
                        vm.setTimeOutAlertMsg(result);
                        vm.settimeoutalertModal(2000);
                        return;
                    }

                    //console.log(result);
                    //console.log(JSON.stringify(result["QueryTableData"]));
                    if (result["Response"] == "ok") {
                        if (result["QueryTableData"].length == 0) {
                            vm.setTimeOutAlertMsg("查無資料");
                            anyerror = true;
                        } else {
                            //抓todoList
                            if (
                                vm.pageAccess.report.children.weeklyreport
                                    .remark.commonQueryCondition.main != "ALL"
                            ) {
                                vm.togglealertModal(true);
                                vm.queryAgain();
                            }
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
                    //console.log(err);
                    vm.setTimeOutAlertMsg(err);
                    anyerror = true;
                })
                .finally(() => {
                    //console.log("done");
                    if (anyerror) vm.settimeoutalertModal();
                    if (
                        vm.pageAccess.report.children.weeklyreport.remark
                            .commonQueryCondition.main == "ALL"
                    )
                        vm.togglealertModal(false);
                });
        },

        //紀錄舊的temp item data,若取消編輯可恢復資料
        tempOldItemAction(status, item) {
            let vm = this;
            if (status) {
                Object.assign(vm.tempThisOldItem, item);
            } else {
                Object.assign(item, vm.tempThisOldItem);
            }
        },

        editLongData(row, which, status) {
            let vm = this;
            //console.log(row);
            if (status) {
                vm.editActionItems.seq = row.item.seq;
                vm.editActionItems.which = which;
                if (which === "Owner") {
                    vm.editActionItems.Data = row.item.Owner.split(",");
                } else {
                    vm.editActionItems.Data = vm.replaceContentData(
                        String(row.item[which]),
                        false
                    );
                }
            } else {
                vm.items.filter(function (element) {
                    if (element.seq == vm.editActionItems.seq) {
                        let thisdata = vm.editActionItems.Data;
                        if (Array.isArray(thisdata)) {
                            thisdata = thisdata.join(",");
                        } else {
                            thisdata = vm.replaceContentData(
                                String(thisdata),
                                true
                            );
                            //console.log(thisdata);
                        }
                        element[vm.editActionItems.which] = thisdata;
                    }
                });
            }
            vm.editActionModalShow = !vm.editActionModalShow;
        },

        addTask(evt) {
            evt.preventDefault();
            let vm = this;
            let status = true;
            //console.log(vm.addTaskWhich);
            let checkvalid = ["Group", "Item", "Progress", "Priority", "Owner","Dep"];
            if (vm.tabIndex == 1) checkvalid = ["Group", "Item", "Dep"];
            //console.log(checkvalid);
            checkvalid.forEach((element) => {
                //console.log(element);
                //console.log(vm.addTaskDetail[element]);
                if (!vm.addTaskDetail[element].invalid) status = false;
            });
            //console.log(status);
            //console.log(vm.addTaskDetail);
            if (status) {
                let params = {};
                if (vm.tabIndex == 1) {
                    params = {
                        methods: "POST",
                        whichFunction: "CommonRegister",
                        table: "workedKey",
                        postdata: {
                            seq: [""],
                            depID: [vm.addTaskDetail.Dep.value],
                            groupID: [vm.addTaskDetail.Group.value],
                            date: [vm.thisweekday[0]],
                            item: [vm.addTaskDetail.Item.value],
                            detail: [vm.addTaskDetail.Status],
                            creatorID: [vm.loginData.account],
                        },
                    };
                } else if (vm.tabIndex == 0) {
                    params = {
                        methods: "POST",
                        whichFunction: "CommonRegister",
                        table: "weeklyReport",
                        postdata: {
                            seq: [""],
                            // depID: [
                            //     vm.depStaffRelation[
                            //         vm.addTaskDetail.Owner.value[0]
                            //     ],
                            // ],
                            depID: [vm.addTaskDetail.Dep.value],
                            groupID: [vm.addTaskDetail.Group.value],
                            item: [vm.addTaskDetail.Item.value],
                            date: [vm.addTaskDetail.Date.time],
                            status: [
                                vm.replaceContentData(
                                    String(vm.addTaskDetail.Status),
                                    true
                                ),
                            ],
                            progress: [vm.addTaskDetail.Progress.value],
                            action: [
                                vm.replaceContentData(
                                    String(vm.addTaskDetail.Action),
                                    true
                                ),
                            ],
                            remark: [vm.addTaskDetail.Remark],
                            priority: [vm.addTaskDetail.Priority.value],
                            owner: [vm.addTaskDetail.Owner.value.join(",")],
                            creatorID: [vm.loginData.account],
                        },
                    };
                }
                //console.log(params);
                vm.axiosAction(params)
                    .then(() => {
                        var result = vm.axiosResult;
                        //console.log(result);
                        if (
                            Object.prototype.toString.call(result) !=
                            "[object Object]"
                        ) {
                            vm.setTimeOutAlertMsg(result);
                            vm.settimeoutalertModal(2000);
                            return;
                        }

                        if (result["Response"] == "ok") {
                            vm.setTimeOutAlertMsg("新增成功");
                        } else {
                            vm.setTimeOutAlertMsg(result["Response"]);
                        }
                    })
                    .catch(function (err) {
                        //console.log(err);
                        vm.setTimeOutAlertMsg(err);
                    })
                    .finally(() => {
                        //console.log("done");
                        vm.settimeoutalertModal();
                        vm.formReset();
                        setTimeout(function () {
                            vm.queryAgain();
                        }, 1200);
                        vm.addTaskModalShow = !vm.addTaskModalShow;
                        vm.addTaskWhich = null;
                    });
            }
        },

        addTaskClose() {
            var vm = this;
            vm.addTaskDetail = this.$options.data().addTaskDetail;
            vm.formReset();
            vm.addTaskModalShow = !vm.addTaskModalShow;
            vm.addTaskWhich = null;
        },

        modTask(items) {
            let vm = this;
            // vm.togglealertModal(true);
            //console.log(items);
            let thiscompletedDate = "";
            if (items.status) thiscompletedDate = vm.nowFormat;
            //console.log(vm.nowFormat);
            //console.log(items);
            let params = {};
            let checkvalid = [];
            if (vm.tabIndex == 0) {
                checkvalid = ["Group", "Item", "Progress", "Priority", "Owner","Dep"];
                for (let i = 0; i < checkvalid.length; i++) {
                    if (items[checkvalid[i]] == "") {
                        vm.setTimeOutAlertMsg("尚有未輸入的值");
                        vm.settimeoutalertModal();
                        return;
                    }
                    if (
                        checkvalid[i] == "Progress" ||
                        checkvalid[i] == "Priority"
                    ) {
                        if (!positivenumvalidator(items[checkvalid[i]])) {
                            vm.setTimeOutAlertMsg("數字必須為正整數");
                            vm.settimeoutalertModal();
                            return;
                        }
                        if (items[checkvalid[i]] > 100) {
                            vm.setTimeOutAlertMsg("數字必須小於100");
                            vm.settimeoutalertModal();
                            return;
                        }
                    }
                }
                params = {
                    methods: "PATCH",
                    whichFunction: "CommonUpdate",
                    table: "weeklyReport",
                    postdata: {
                        old_seq: [items.seq],
                        // depID: [vm.depStaffRelation[items.Owner.split(",")[0]]],
                        depID: [items.depID],
                        groupID: [items.Group],
                        item: [items.Item],
                        date: [items.Date.time],
                        status: [
                            vm.replaceContentData(String(items.Status), true),
                        ],
                        progress: [items.Progress],
                        action: [
                            vm.replaceContentData(String(items.Action), true),
                        ],
                        remark: [items.Remark],
                        priority: [items.Priority],
                        owner: [String(items.Owner)],
                    },
                };
            } else {
                checkvalid = ["Group", "Item", "Dep"];
                for (let i = 0; i < checkvalid.length; i++) {
                    if (items[checkvalid[i]] == "") {
                        vm.setTimeOutAlertMsg("尚有未輸入的值");
                        vm.settimeoutalertModal();
                        return;
                    }
                }
                params = {
                    methods: "PATCH",
                    whichFunction: "CommonUpdate",
                    table: "workedKey",
                    postdata: {
                        old_seq: [items.seq],
                        depID: [items.depID],
                        groupID: [items.Group],
                        item: [items.Item],
                        detail: [items.Status],
                    },
                };
            }
            vm.activeItemsSeq = null;
            //console.log(params);
            vm.axiosAction(params)
                .then(() => {
                    var result = vm.axiosResult;
                    //console.log(result);
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
                    //console.log(err);
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    //console.log("done");
                    vm.settimeoutalertModal();
                    setTimeout(function () {
                        vm.queryAgain();
                    }, 1200);
                });
        },

        delTask() {
            let vm = this;
            //console.log(vm.delItemSeq);
            let params = {};
            if (vm.tabIndex == 0) {
                params = {
                    methods: "DELETE",
                    whichFunction: "CommonDelete",
                    table: "weeklyReport",
                    postdata: {
                        seq: [vm.delItemSeq],
                    },
                };
            } else {
                params = {
                    methods: "DELETE",
                    whichFunction: "CommonDelete",
                    table: "workedKey",
                    postdata: {
                        seq: [vm.delItemSeq],
                    },
                };
            }
            //console.log(params);
            vm.axiosAction(params)
                .then(() => {
                    var result = vm.axiosResult;
                    //console.log(result);
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
                    //console.log(err);
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    //console.log("done");
                    vm.settimeoutalertModal();
                    setTimeout(function () {
                        //先清空以防連續查無資料的bug
                        vm.items = [];
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
            if (!item || type !== "row") return;
            if (item.status)
                return { style: "background-color:rgba(0, 0, 0, 0.144)" };
        },

        check_required(required, model) {
            model.invalid = required;
            return !required;
        },

        check_positivenumvalid(positivenumvalid, model) {
            model.positivenumvalid = positivenumvalid;
            return !positivenumvalid;
        },

        //validation表單reset
        formReset() {
            let vm = this;
            //reset valid_data
            vm.addTaskDetail = {
                Group: {
                    key: "Group",
                    value: null,
                    invalid: false,
                },
                Date: { time: "" },
                Item: {
                    key: "Item",
                    value: null,
                    invalid: false,
                },
                Status: "",
                Progress: {
                    key: "Progress",
                    value: null,
                    invalid: false,
                },
                Action: "",
                Remark: "",
                Priority: {
                    key: "Priority",
                    value: null,
                    invalid: false,
                },
                Dep: {
                    key: "Dep",
                    value: null,
                    invalid: false,
                },
                Owner: {
                    key: "Owner",
                    value: [],
                    invalid: false,
                },
            };
            //console.log(vm.addTaskDetail);
            vm.$nextTick(() => {
                //console.log("%%%%%%%%%%");
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

        //亂數sort func
        shuffle(a, b) {
            var num = Math.random() > 0.5 ? -1 : 1;
            return num;
        },

        checkExportFileLegal() {
            let vm = this;
            //console.log(vm.tabIndex);
            //console.log(vm.items);
            if (vm.items.length == 0) {
                vm.setTimeOutAlertMsg("無資料可匯出");
                vm.settimeoutalertModal();
                return;
            }
            if (vm.tabIndex == 0) {
                vm.setTimeOutAlertMsg(
                    "系統將自動查詢該時間區段的『下週重點』資料"
                );
                vm.settimeoutalertModal();
                vm.tabIndex = 1;
                setTimeout(() => {
                    vm.exportModalShow = true;
                }, 200);
            } else {
                vm.exportModalShow = true;
            }
        },

        exportFile(filetype) {
            let vm = this;
            vm.togglealertModal(true);
            setTimeout(() => {
                let thisweekexportdata = JSON.parse(
                    JSON.stringify(vm.tempData)
                );
                // //console.log(thisweekexportdata);
                thisweekexportdata.map(function (item) {
                    delete item.seq;
                    delete item.depID;
                    item.Date = item.Date.time;
                    item.Status = vm.replaceContentData(
                        String(item.Status),
                        false
                    );
                    item.Action = vm.replaceContentData(
                        String(item.Action),
                        false
                    );
                    // item.depID = vm.depConfig[item.depID];
                    // //console.log(item.Owner);
                    let thisOwner = item.Owner.split(",");
                    for (let i = 0; i < thisOwner.length; i++) {
                        thisOwner[i] = vm.staffConfig[thisOwner[i]];
                        if (i == thisOwner.length - 1) {
                            item.Owner = thisOwner.join(",");
                        }
                    }
                });
                // console.log(thisweekexportdata);
                // //console.log(JSON.stringify(thisweekexportdata));

                let nextWeekData = JSON.parse(JSON.stringify(vm.items));
                console.log(nextWeekData);
                // //console.log(JSON.stringify(nextWeekData));
                let othersOption = [
                    "人事",
                    "困難與問題",
                    "會議",
                    "拜訪",
                    "測試",
                ];
                let othersOptiontemp = [
                    "人事",
                    "困難與問題",
                    "會議",
                    "拜訪",
                    "測試",
                ];
                let nextweekexportdata = [];
                let nextweekothersexportdata = [];

                nextWeekData.map(function (item) {
                    delete item.seq;
                    delete item.depID;
                    item.Status = vm.replaceContentData(
                        String(item.Status),
                        false
                    );
                });

                nextWeekData.filter(function (item) {
                    if (!othersOption.includes(item.Group)) {
                        nextweekexportdata.push(item);
                    } else {
                        othersOptiontemp.splice(
                            othersOptiontemp.indexOf(item.Group),
                            1
                        );
                        nextweekothersexportdata.push(item);
                    }
                });
                if (nextweekothersexportdata.length == 0) {
                    othersOption.forEach((element) => {
                        let temp = {
                            Group: element,
                            Item: "",
                            Status: "",
                        };
                        nextweekothersexportdata.push(temp);
                    });
                } else if (nextweekothersexportdata.length < 5) {
                    othersOptiontemp.forEach((element) => {
                        let temp = {
                            Group: element,
                            Item: "",
                            Status: "",
                        };
                        nextweekothersexportdata.push(temp);
                    });
                }
                //console.log(nextweekexportdata);
                //console.log(nextweekothersexportdata);

                let thisdep = "全部門";
                if (vm.inputData.selected != "ALL") {
                    thisdep = vm.depConfig[vm.inputData.selected];
                }
                console.log(thisdep);
                // const fileName = thisdep + "的WeeklyReport_" + vm.nowFormat;
                console.log(vm.thisQueryTimeInterval);
                console.log(vm.loginData.username);
                const fileName =
                    "Weekly Report_" +
                    vm.thisQueryTimeInterval[0].replace(/-/g, "") +
                    "-" +
                    vm.thisQueryTimeInterval[1].split("-")[1] +
                    vm.thisQueryTimeInterval[1].split("-")[2] +
                    "_" +
                    thisdep +
                    "_" +
                    vm.loginData.username;
                vm.exportTitle = thisdep;
                console.log(vm.exportTitle);

                if (filetype === "CSV") {
                    thisweekexportdata.map(function (item) {
                        delete item.priority;
                    });
                    const data = thisweekexportdata.map((itemsdata) =>
                        Object.values(itemsdata)
                    );
                    //console.log(data);
                    //加入空白，匯出Excel不會改變格式
                    data.forEach((item) => {
                        item[0] = " " + item[0];
                    });
                    //加表頭
                    data.unshift([
                        "Group",
                        "Item",
                        "Date",
                        "Status",
                        "Progress%",
                        "Action",
                        "Remark",
                        "Owner",
                    ]);
                    vm.setautoTable({
                        body: data,
                        exportfilename: fileName,
                        exportfiletype: filetype,
                    });
                } else {
                    //抓取此次時間區段
                    let thistimeinterval = "";
                    //console.log(vm.thisQueryTimeInterval);
                    if (vm.thisQueryTimeInterval == "DEFAULT") {
                        thistimeinterval = vm.thisweekday.join(" ~ ");
                    } else if (vm.thisQueryTimeInterval == "ALL") {
                        thistimeinterval = "資料表內所有資料";
                    } else {
                        thistimeinterval = vm.thisQueryTimeInterval.join(" ~ ");
                    }
                    vm.exportDate = thistimeinterval;
                    console.log(vm.exportDate);

                    let mergecells = {};
                    if (vm.exportPDFselected)
                        mergecells = {
                            // rowSpan: ["Group", "Item"],
                            // rowSpanOrderBy: ["asc", "desc"],
                            rowSpan: ["Group"],
                            rowSpanOrderBy: ["asc"],
                        };

                    console.log(new Date());
                    //https://wcc723.github.io/javascript/2017/12/30/javascript-async-await/
                    const getThreePartData = async () => {
                        //本週
                        let thisweekfinalexportdata = await vm.adjustExportDataFormat(
                            thisweekexportdata, //欲匯出的data
                            mergecells, //哪些key需要合併儲存格
                            {
                                halign: "left",
                            }, //欲匯出autoTable data的預設格式
                            [false], //是否有分隔線
                            true, //是否要填色
                            [
                                // ["Item", "desc"],
                                ["Priority", "asc"],
                            ] //特殊指定排序欄位
                        );
                        //console.log(
                        //     "thisweekfinalexportdata :>> ",
                        //     thisweekfinalexportdata
                        // );
                        console.log(new Date());
                        //下週
                        let nextweekfinalexportdata = await vm.adjustExportDataFormat(
                            nextweekexportdata, //欲匯出的data
                            Object.assign(mergecells, {
                                colSpan: { Status: 6, Separate: 8 },
                            }), //哪些key需要合併儲存格
                            {
                                halign: "left",
                            }, //欲匯出autoTable data的預設格式
                            [true, { Separate: "下週工作重點" }], //是否有分隔線
                            true, //是否要填色
                            [["Item", "desc"]] //特殊指定排序欄位
                        );
                        //console.log(
                        //     "nextweekfinalexportdata :>> ",
                        //     nextweekfinalexportdata
                        // );
                        console.log(new Date());
                        //Others
                        let nextweekothersfinalexportdata = await vm.adjustExportDataFormat(
                            nextweekothersexportdata, //欲匯出的data
                            Object.assign(mergecells, {
                                colSpan: { Status: 6, Separate: 8 },
                            }), //哪些key需要合併儲存格
                            {
                                halign: "left",
                            }, //欲匯出autoTable data的預設格式
                            [true, { Separate: "Others" }], //是否有分隔線
                            false,
                            [["Item", "desc"]] //是否要填色 //特殊指定排序欄位
                        );
                        //console.log(
                        //     "nextweekothersfinalexportdata :>> ",
                        //     nextweekothersfinalexportdata
                        // );
                        console.log(new Date());
                        return thisweekfinalexportdata
                            .concat(nextweekfinalexportdata)
                            .concat(nextweekothersfinalexportdata);
                    };

                    getThreePartData()
                        .then((value) => {
                            console.log(value);
                            vm.setautoTableStatus(true); //true為正式匯出
                            vm.setautoTable({
                                body: value,
                                columns: vm.exportColumns,
                                columnStyles: vm.exportColumnStyles,
                                headStyles: vm.exportHeadStyles,
                                exportfilename: fileName,
                                exportfiletype: "PDF",
                                text: [vm.exportTitle, vm.exportDate],
                            });
                        })
                        .catch((response) => {
                            //console.log(response);
                        });
                }
                //console.log("!!!!!!!!!!!!!!!!!!");
                vm.exportModalShow = false;
            }, 100);
        },

        adjustExportDataFormat(
            data,
            spanKeys,
            autoTableStyle,
            haveSeparate,
            haveColor,
            sortby = []
        ) {
            /* 
            1.排序要匯出的資料(看spanKeys丟入的是什麼來排序，目前系統以'Group'->'Item'->'Priority')
            2.整理有相同的指定key個數(在表格中要來rowsapn的數量，目前系統只以'Group'來合併儲存格)
            */
            let vm = this;
            let checkduplicate = {};
            let checkduplicatefinalNum = {};
            //console.log(vm.errorFormat);
            if (spanKeys.hasOwnProperty("rowSpan")) {
                const thissort = spanKeys.rowSpan
                    .map((item, index) => [
                        item,
                        spanKeys.rowSpanOrderBy[index],
                    ])
                    .concat(sortby);
                //console.log(thissort);
                data = data.sort(vm.dataSorted(thissort));
                //console.log(data);
                //排序完成後，移除特殊指定排序欄位 -> Priority
                data.map(function (item) {
                    delete item.Priority;
                });
                // //console.log(data);
                let spanKeysrowSpan = spanKeys.rowSpan;
                for (let q = 0; q < data.length; q++) {
                    for (let i = 0; i < spanKeysrowSpan.length; i++) {
                        if (i == 0) {
                            if (!checkduplicate[spanKeysrowSpan[i]])
                                checkduplicate[spanKeysrowSpan[i]] = {};
                        }
                        let thisq = q;
                        if (haveSeparate[0]) {
                            thisq += 1;
                        }
                        checkduplicate = vm.adjustCheckDuplicateObj(
                            data[q],
                            spanKeysrowSpan[i],
                            spanKeysrowSpan,
                            checkduplicate,
                            thisq
                        );
                    }
                }
            } else {
                if (sortby.length != 0) data = data.sort(vm.dataSorted(sortby));
            }
            if (data.length != 0 && haveSeparate[0]) {
                data.unshift(haveSeparate[1]);
            }
            //console.log(data);
            //console.log(checkduplicate);
            //console.log(JSON.stringify(checkduplicate));

            //當動作完畢丟入adjustPDFbody，整理匯出符合jsPDF-autoTable的最後格式
            return new Promise((resolve, reject) => {
                vm.adjustPDFbody(
                    data,
                    autoTableStyle,
                    spanKeys,
                    checkduplicate,
                    haveColor
                ).then((response) => {
                    // console.log(response);
                    resolve(response);
                });
            });
        },

        adjustPDFbody(
            data,
            autoTableStyle,
            spanKeys,
            checkduplicate,
            haveColor
        ) {
            /* 
            1.將要匯出的資料整理成符合jsPDF-autoTable需要的格式
            2.每一段資料都丟入測試格式是否會有問題(跨頁合併儲存格)
            3.若有問題就再重新整理一次，直到沒問題才回傳整理好的資料(body)
            */
            console.log(new Date());
            return new Promise((resolve, reject) => {
                let vm = this;
                //複製一份checkduplicate
                let checkduplicateCopy = JSON.parse(
                    JSON.stringify(checkduplicate)
                );
                //亂數10種顏色供Group換色
                let tempColor = [
                    [238, 174, 145],
                    [221, 160, 221],
                    [244, 164, 96],
                    [222, 184, 135],
                    [144, 238, 144],
                    [240, 230, 140],
                    [210, 180, 140],
                    [255, 182, 193],
                    [255, 222, 173],
                    [143, 188, 143],
                ];
                // tempColor = tempColor.sort(vm.shuffle);
                var body = [];
                for (let q = 0; q < data.length; q++) {
                    let row = [];
                    for (let key_ in data[q]) {
                        let thiscolSpan = 0;
                        let thishalign = autoTableStyle.halign;
                        let thisfillColor = [255, 255, 255];
                        let thistextColor = [0, 0, 0];
                        let thiscontent = data[q][key_];
                        if (
                            spanKeys.hasOwnProperty("colSpan") &&
                            spanKeys.colSpan.hasOwnProperty(key_)
                        )
                            thiscolSpan = spanKeys.colSpan[key_];
                        if (
                            spanKeys.hasOwnProperty("rowSpan") &&
                            spanKeys.rowSpan.includes(key_)
                        ) {
                            let thisINDEX = 0;
                            let thisrowSpan = 0;
                            let thischeckduplicate = checkduplicate;
                            if (!checkduplicate[key_]) {
                                let temp = spanKeys.rowSpan.slice();
                                temp.splice(
                                    temp.indexOf(key_),
                                    temp.length - temp.indexOf(key_)
                                );
                                for (let i = 0; i < temp.length; i++) {
                                    thischeckduplicate = vm.catchFather(
                                        data[q],
                                        temp[i],
                                        thischeckduplicate
                                    );
                                }
                            }

                            let tempIndex =
                                thischeckduplicate[key_][thiscontent]["INDEX"];
                            let tempCount =
                                thischeckduplicate[key_][thiscontent]["COUNT"];
                            thisINDEX = tempIndex[0];
                            thisrowSpan = tempCount[0];
                            if (q == thisINDEX) {
                                tempCount.splice(0, 1);
                                tempIndex.splice(0, 1);
                            }

                            //自定義格式
                            if (haveColor && key_ === "Group") {
                                let totalGroup = Object.keys(
                                    checkduplicate[key_]
                                );
                                thisfillColor =
                                    tempColor[
                                        totalGroup.indexOf(thiscontent) % 10
                                    ];
                            }

                            if (q == thisINDEX) {
                                thishalign = "center";
                                // if (thiscontent == "") thisrowSpan = 0;
                                row.push({
                                    colSpan: thiscolSpan,
                                    rowSpan: thisrowSpan,
                                    content: data[q][key_],
                                    styles: {
                                        textColor: thistextColor,
                                        valign: "middle",
                                        halign: thishalign,
                                        fillColor: thisfillColor,
                                    },
                                });
                            }
                        } else {
                            //自定義格式
                            if (key_ === "Progress") {
                                if (Number(thiscontent) >= 100)
                                    thistextColor = [0, 179, 60];
                                thiscontent = thiscontent + "%";
                                thishalign = "center";
                            }
                            if (key_ === "Separate") {
                                thisfillColor = [211, 211, 211];
                                thishalign = "center";
                            }
                            row.push({
                                colSpan: thiscolSpan,
                                content: thiscontent,
                                styles: {
                                    textColor: thistextColor,
                                    valign: "middle",
                                    halign: thishalign,
                                    fillColor: thisfillColor,
                                },
                            });
                        }
                    }
                    body.push(row);
                }

                //Yishan 09082020
                //丟去製作pdf測試格式是否有問題，目前jsPDF-autoTable遇到跨頁rowSpan會格式跑掉
                //sol:每一段data都丟去jsPDF-autoTable的js做內容高度與頁內最大高度判斷
                //    若內容高度會大於頁內最大高度，將取Math.celi(內容高度/頁內最大高度)無條件進入當成縮小倍數，將rowSpan縮小
                //    將內容高度控制在頁內最大高度，可避免跨頁rowSpan
                //console.log("body :>> ", body);
                let params = {
                    body: body,
                    columns: vm.exportColumns,
                    columnStyles: vm.exportColumnStyles,
                    headStyles: vm.exportHeadStyles,
                    exportfiletype: "PDF",
                    text: [vm.exportTitle, vm.exportDate],
                };
                vm.setautoTableStatus(false); //false為測試格式
                vm.setautoTable(params)
                    .then(() => {
                        //console.log("errorFormat :>> ", vm.errorFormat);
                        //格式沒問題
                        if (vm.errorFormat.length == 0) {
                            resolve(body);
                        } else {
                            console.log(JSON.stringify(checkduplicateCopy));
                            //console.log(data);
                            vm.errorFormat.forEach((element) => {
                                //console.log(element.index);
                                //console.log(element.division);
                                //目前只有Group會合併儲存格所以先寫死抓Group
                                //console.log(data[element.index].Group);
                                //console.log(
                                //     checkduplicateCopy.Group[
                                //         data[element.index].Group
                                //     ]
                                // );

                                // {"Group":{"MIS":{"COUNT":[20],"INDEX":[0]},"PaaS":{"COUNT":[7],"INDEX":[20]}}}
                                // {"Group":{"MIS":{"COUNT":[10,10],"INDEX":[0,10]},"PaaS":{"COUNT":[7],"INDEX":[20]}}}

                                const divideNum = vm.getDivideNumber(
                                    checkduplicateCopy.Group[
                                        data[element.index].Group
                                    ]["COUNT"],
                                    checkduplicateCopy.Group[
                                        data[element.index].Group
                                    ]["INDEX"],
                                    element.division,
                                    element.index
                                );
                                //console.log("divideNum :>> ", divideNum);
                                checkduplicateCopy.Group[
                                    data[element.index].Group
                                ]["COUNT"] = divideNum[1];
                                checkduplicateCopy.Group[
                                    data[element.index].Group
                                ]["INDEX"] = divideNum[0];
                                console.log(JSON.stringify(checkduplicateCopy));
                            });
                            //再重新跑一次整理func
                            vm.adjustPDFbody(
                                data,
                                autoTableStyle,
                                spanKeys,
                                checkduplicateCopy,
                                haveColor
                            ).then((response) => {
                                //console.log(response);
                                resolve(response);
                            });
                        }
                    })
                    .catch(function (err) {
                        //console.log(err);
                    });
            });
            // return body;
        },

        getDivideNumber(countNum, indexNum, division, index) {
            console.log("countNum :>> ", countNum);
            console.log("indexNum :>> ", indexNum);
            console.log("division :>> ", division);
            console.log("index :>> ", index);
            let numberCOUNTAry = [];
            let numberINDEXAry = [];
            //表示已經跑過檢查格式，但還是有問題
            if (countNum.length > 1) {
                numberINDEXAry = indexNum.slice(0, indexNum.indexOf(index));
                numberCOUNTAry = countNum.slice(0, indexNum.indexOf(index));
            }
            console.log("numberCOUNTAry :>> ", numberCOUNTAry);
            console.log("numberINDEXAry :>> ", numberINDEXAry);
            let childNum = Math.ceil(
                countNum[indexNum.indexOf(index)] / division
            );
            console.log("childNum :>> ", childNum);
            for (let i = 0; i < division; i++) {
                numberINDEXAry.push(index + childNum * i);
                //如果餘數為0表示整除
                if (countNum[indexNum.indexOf(index)] % division == 0) {
                    numberCOUNTAry.push(childNum);
                } else {
                    if (i == division - 1) {
                        numberCOUNTAry.push(
                            countNum[indexNum.indexOf(index)] - childNum * i
                        );
                    } else {
                        numberCOUNTAry.push(childNum);
                    }
                }
            }
            return [numberINDEXAry, numberCOUNTAry];
        },

        catchFather(data, thiskey, thischeckduplicate) {
            return thischeckduplicate[thiskey][data[thiskey]];
        },

        adjustCheckDuplicateObj(
            data,
            thiskey,
            spanKeysrowSpan,
            checkduplicate,
            thisq
        ) {
            let vm = this;
            let temp = spanKeysrowSpan.slice();
            temp.splice(
                temp.indexOf(thiskey),
                temp.length - temp.indexOf(thiskey)
            );
            //因為沒有deep copy所以小孩改變爸爸也會一起改變
            let thischeckduplicate = checkduplicate;
            if (temp.length != 0) {
                for (let i = 0; i < temp.length; i++) {
                    thischeckduplicate = vm.catchFather(
                        data,
                        temp[i],
                        thischeckduplicate
                    );
                }
            }
            thischeckduplicate = vm.adjustCheckDuplicateObj2(
                thischeckduplicate,
                thiskey,
                data,
                thisq
            );
            return checkduplicate;
        },

        adjustCheckDuplicateObj2(thischeckduplicate, thiskey, data, thisq) {
            if (!thischeckduplicate[thiskey]) {
                thischeckduplicate[thiskey] = {};
            }
            if (!thischeckduplicate[thiskey][data[thiskey]]) {
                thischeckduplicate[thiskey][data[thiskey]] = {};
                thischeckduplicate[thiskey][data[thiskey]]["COUNT"] = [1];
            } else {
                thischeckduplicate[thiskey][data[thiskey]]["COUNT"][0] += 1;
            }
            if (
                typeof thischeckduplicate[thiskey][data[thiskey]]["INDEX"] ==
                "undefined"
            ) {
                thischeckduplicate[thiskey][data[thiskey]]["INDEX"] = [thisq];
            }
            return thischeckduplicate;
        },

        replaceContentData(content, status) {
            if (status) {
                return (
                    content // .replace(/\r\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
                        .replace(/\r\n/g, "<br/>")
                        // .replace(/\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
                        .replace(/\n/g, "<br/>")
                        .replace(/\s/g, "&nbsp;")
                );
            } else {
                return content
                    .replace(/<br\s*[\/]?>/g, "\n")
                    .replace(/&nbsp;/g, " ");
            }
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
::v-deep #choose .choose_content {
    opacity: 0 !important;
}
.opacity_ {
    opacity: 0;
}
</style>
