<template>
    <div class="WeeklyReport">
        <div id="bluebg">
            <img src="../assets/todolist.png" />
            Weekly Report
        </div>
        <b-row class="mb-3 mt-1">
            <b-col sm="3">
                <h5 style="margin-top:5px">{{now}}</h5>
            </b-col>
            <b-col sm="9" class="text-right">
                <b-button pill v-b-toggle.collapse-1 variant="light">選擇條件</b-button>
                <b-collapse id="collapse-1" v-model="selectDepCollapseShow" class="mt-2">
                    <commonQuery />
                </b-collapse>
            </b-col>
        </b-row>
        <b-row class="mb-1">
            <b-col sm="12" class="text-right">
                <b-button
                    pill
                    class="ml-2"
                    variant="success"
                    @click="addTaskModalShow = !addTaskModalShow"
                >
                    ✚
                    <span style="font-weight:bold">add</span>
                </b-button>
                <b-button pill class="ml-2" @click="checkExportFileLegal()">匯出</b-button>
            </b-col>
        </b-row>
        <b-tabs v-model="tabIndex">
            <b-tab title="本週" active></b-tab>
            <b-tab title="下週重點"></b-tab>
            <h5 v-if="items.length == 0" class="mt-2">選擇查詢條件</h5>
            <b-table
                sticky-header="550px"
                responsive
                :items="items"
                :fields="fields"
                head-variant="dark"
                v-if="items.length != 0"
                class="text-center mt-2"
                :tbody-tr-attr="rowClass"
            >
                <template v-slot:cell(Group)="row">
                    <div :class="{hide:activeItemsSeq == row.item.seq}">{{row.item.Group}}</div>
                    <div :class="{hide:activeItemsSeq != row.item.seq}">
                        <b-form-input list="input-list-Group" v-model.trim="row.item.Group"></b-form-input>
                        <b-form-datalist
                            id="input-list-Group"
                            :options="getDataListFromDBTable['Group'][pageAccess.weeklyreport.remark]"
                            v-model.trim="row.item.Group"
                        ></b-form-datalist>
                    </div>
                </template>
                <template v-slot:cell(Item)="row">
                    <div :class="{hide:activeItemsSeq == row.item.seq}">{{row.item.Item}}</div>
                    <div :class="{hide:activeItemsSeq != row.item.seq}">
                        <b-form-input list="input-list-Item" v-model.trim="row.item.Item"></b-form-input>
                        <b-form-datalist
                            id="input-list-Item"
                            :options="getDataListFromDBTable['Item'][pageAccess.weeklyreport.remark]"
                            v-model.trim="row.item.Item"
                        ></b-form-datalist>
                    </div>
                </template>
                <template v-slot:cell(Date)="row">
                    <template v-if="row.item.Date.time == '' && activeItemsSeq != row.item.seq">尚未指定</template>
                    <template v-else>
                        <div :class="{hide:activeItemsSeq == row.item.seq}">{{row.item.Date.time}}</div>
                    </template>
                    <div :class="{hide:activeItemsSeq != row.item.seq}">
                        <datepicker :date="row.item.Date" :option="datepickerOptions"></datepicker>
                    </div>
                </template>
                <template v-slot:cell(Status)="row">
                    <div :class="{hide:activeItemsSeq == row.item.seq}">{{row.item.Status}}</div>
                    <div :class="{hide:activeItemsSeq != row.item.seq}">
                        <b-form-input
                            class="input-text"
                            type="text"
                            v-model="row.item.Status"
                            @click="editLongData(row,'Status',true)"
                        ></b-form-input>
                    </div>
                </template>
                <template v-slot:cell(Progress)="row">
                    <div :class="{hide:activeItemsSeq == row.item.seq}">
                        <p style="color:green">{{row.item.Progress}}%</p>
                    </div>
                    <div :class="{hide:activeItemsSeq != row.item.seq}">
                        <b-form-input class="input-text" type="number" v-model="row.item.Progress"></b-form-input>
                    </div>
                </template>
                <template v-slot:cell(Action)="row">
                    <div :class="{hide:activeItemsSeq == row.item.seq}">{{row.item.Action}}</div>
                    <div :class="{hide:activeItemsSeq != row.item.seq}">
                        <b-form-input
                            class="input-text"
                            type="text"
                            v-model="row.item.Action"
                            @click="editLongData(row,'Action',true)"
                        ></b-form-input>
                    </div>
                </template>
                <template v-slot:cell(Remark)="row">
                    <div :class="{hide:activeItemsSeq == row.item.seq}">{{row.item.Remark}}</div>
                    <div :class="{hide:activeItemsSeq != row.item.seq}">
                        <b-form-input class="input-text" type="text" v-model="row.item.Remark"></b-form-input>
                    </div>
                </template>
                <template v-slot:cell(Owner)="row">
                    <div :class="{hide:activeItemsSeq == row.item.seq}">
                        <span v-for="(item,index) in row.item.Owner.split(',')" :key="index">
                            {{staffConfig[item]}}
                            <span
                                v-if="index != row.item.Owner.split(',').length -1"
                            >,</span>
                        </span>
                    </div>
                    <div :class="{hide:activeItemsSeq != row.item.seq}">
                        <b-form-input
                            class="input-text"
                            type="text"
                            v-model="row.item.Owner"
                            @click="editLongData(row,'Owner',true)"
                        ></b-form-input>
                    </div>
                </template>
                <template v-slot:cell(Dep)="row">
                    <div
                        :class="{hide:activeItemsSeq == row.item.seq}"
                    >{{depConfig[row.item.depID]}}</div>
                    <div :class="{hide:activeItemsSeq != row.item.seq}">
                        <b-form-select v-model="row.item.depID" :options="depOptions"></b-form-select>
                    </div>
                </template>
                <template v-slot:cell(Edit)="row">
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
        </b-tabs>
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
                <h5 v-if="addTaskWhich == null">新增事項</h5>
                <h5 v-else-if="addTaskWhich == 'weeklyReport'">新增本週事項</h5>
                <h5 v-else-if="addTaskWhich == 'workedKey'">新增下週重點事項</h5>
            </template>
            <template v-slot:default>
                <div class="text-center" v-if="addTaskWhich == null">
                    <b-button
                        pill
                        class="ml-2"
                        variant="info"
                        @click="addTaskWhich='weeklyReport'"
                    >本週</b-button>
                    <b-button
                        pill
                        class="ml-2"
                        variant="primary"
                        @click="addTaskWhich='workedKey'"
                    >下週</b-button>
                </div>
                <b-form v-if="addTaskWhich != null" @submit="addTask">
                    <b-row class="my-4" v-for="(item,index,key) in addTaskDetail" :key="key">
                        <!-- <b-row class="my-4" v-for="(item,index,key) in $v.addTaskDetail" :key="key"> -->
                        <b-col sm="2">
                            <label :for="'input-'+index">{{index}}:</label>
                        </b-col>
                        <template v-if="$v.addTaskDetail.hasOwnProperty(index)">
                            <b-col
                                sm="10"
                                :class="{ 'form-group--error': $v.addTaskDetail[index].value.$error }"
                            >
                                <b-form-input
                                    v-if="index == 'Progress'"
                                    :id="'input-'+index"
                                    v-model.trim="$v.addTaskDetail.Progress.$model.value"
                                    class="input-title"
                                    type="number"
                                ></b-form-input>
                                <b-form-select
                                    :id="'input-'+index"
                                    v-else-if="index == 'Owner'"
                                    v-model="$v.addTaskDetail.Owner.$model.value"
                                    :options="getStaffOptions"
                                    size="sm"
                                    multiple
                                ></b-form-select>
                                <b-form-select
                                    :id="'input-'+index"
                                    v-else-if="index == 'Dep'"
                                    v-model="$v.addTaskDetail.Dep.$model.value"
                                    :options="depOptions"
                                    size="sm"
                                >
                                    <template v-slot:first>
                                        <b-form-select-option
                                            :value="null"
                                            disabled
                                        >-- Please select an option --</b-form-select-option>
                                    </template>
                                </b-form-select>
                                <template v-else-if="index == 'Group' || index == 'Item'">
                                    <b-form-input
                                        :id="'input-'+index"
                                        :list="'input-list'+index"
                                        v-model.trim="$v.addTaskDetail[index].$model.value"
                                    ></b-form-input>
                                    <b-form-datalist
                                        :id="'input-list'+index"
                                        :options="getDataListFromDBTable[index][pageAccess.weeklyreport.remark]"
                                        v-model.trim="$v.addTaskDetail[index].$model.value"
                                    ></b-form-datalist>
                                </template>
                                <b-form-input
                                    v-else
                                    :id="'input-'+index"
                                    v-model.trim="$v.addTaskDetail[index].$model.value"
                                    class="input-title"
                                    type="text"
                                ></b-form-input>
                                <template
                                    v-if="check_required($v.addTaskDetail[index].value.required,$v.addTaskDetail[index].$model)"
                                >
                                    <div class="error">Is required</div>
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
                                <template v-else-if="index == 'Action' || index == 'Status'">
                                    <b-form-textarea
                                        :id="'input-'+index"
                                        v-model="addTaskDetail[index]"
                                        rows="4"
                                        max-rows="12"
                                    ></b-form-textarea>
                                </template>
                                <template v-else>
                                    <b-form-input
                                        :id="'input-'+index"
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
                    <b-row>
                        <b-col sm="6">
                            <b-button
                                pill
                                variant="success"
                                @click="exportfile('CSV')"
                                style="position: relative;transform: translateY(50%)"
                            >CSV</b-button>
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
                                @click="exportfile('PDF')"
                                v-b-tooltip.hover
                                title="合併儲存格會因資料長度太長可能出現排版問題(大約50chars、115bytes左右)，此時可以下載不合併的版本或分成多筆資料"
                            >PDF</b-button>
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
                    >Close</b-button>
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
                    <b-form-textarea v-else v-model="editActionItems.Data" rows="6" max-rows="12"></b-form-textarea>
                </div>
            </template>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="editActionModalShow = !editActionModalShow"
                    >Close</b-button>
                    <b-button
                        variant="success"
                        size="sm"
                        class="float-right"
                        style="margin-right:10px"
                        @click.prevent="editLongData(null,null,false)"
                    >確定</b-button>
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
                { key: "Owner", sortable: true },
                { key: "Dep", sortable: true },
                { key: "Edit", sortable: false },
            ],
            items: [],
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
                "1001": "資訊通訊部",
                "1002": "系統研發部",
                "1003": "雲端AI(智慧)平台部",
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
                Owner: {
                    key: "Owner",
                    value: [],
                    invalid: false,
                },
                Dep: {
                    key: "Dep",
                    value: null,
                    invalid: false,
                },
            },
            addTaskWhich: null,
            getStaffOptions: [],
            staffConfig: {},
            depStaffRelation: {},
            getDataListFromDBTable: {
                Group: { "1001": [], "1002": [], "1003": [], ALL: [] },
                Item: { "1001": [], "1002": [], "1003": [], ALL: [] },
            },
            delTaskModalShow: false,
            selectDepCollapseShow: false,
            exportModalShow: false,
            exportPDFoptions: [
                { value: true, text: "合併儲存格" },
                { value: false, text: "不合併儲存格" },
            ],
            exportPDFselected: true,
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
                    },
                },
                Owner: {
                    value: {
                        required,
                    },
                },
                Dep: {
                    value: {
                        required,
                    },
                },
            },
        };
        console.log(this.addTaskWhich);
        if (this.addTaskWhich == "workedKey") {
            delete setvalid.addTaskDetail.Progress;
            delete setvalid.addTaskDetail.Owner;
            console.log(setvalid);
            return setvalid;
        } else if (this.addTaskWhich == "weeklyReport") {
            delete setvalid.addTaskDetail.Dep;
            return setvalid;
        } else {
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
            inputData: "commonquery/get_inputData",
            ttfStatus: "exportfile/get_ttfStatus",
        }),
    },
    created: function () {
        let vm = this;
        vm.getNow();
        if (vm.pageAccess.weeklyreport.remark != "ALL") {
            vm.setalertMsg("請稍候....");
            vm.togglealertModal(true);
        } else {
            vm.selectDepCollapseShow = true;
        }
        vm.SetCommonQueryData();
        vm.getBelongDepStaff();
    },
    mounted: function () {
        this.fields.splice(8, 1);
    },
    watch: {
        tabIndex: {
            handler(value) {
                var vm = this;
                vm.reset([
                    "tabIndex",
                    "getStaffOptions",
                    "staffConfig",
                    "depStaffRelation",
                    "depOptions",
                    "now",
                    "nowFormat",
                    "thisweekday",
                    "selectDepCollapseShow",
                ]);
                let commonApiParams = {};
                if (vm.tabIndex == 0) {
                    commonApiParams = {
                        table: "weeklyReport",
                        attr: "depID",
                        timeattr: "date",
                        intervaltime: {
                            date: [
                                [
                                    vm.thisweekday[0] + " 00:00:00",
                                    vm.thisweekday[1] + " 23:59:59",
                                ],
                            ],
                        },
                    };
                    vm.fields.splice(8, 1);
                } else {
                    commonApiParams = {
                        table: "workedKey",
                        attr: "depID",
                        timeattr: "date",
                        intervaltime: {
                            date: [
                                [
                                    vm.thisweekday[0] + " 00:00:00",
                                    vm.thisweekday[1] + " 23:59:59",
                                ],
                            ],
                        },
                    };
                    vm.fields.splice(2, 1);
                    vm.fields.splice(3, 4);
                }
                vm.setapiParams(commonApiParams);
            },
        },
        queryResponse: {
            handler() {
                var vm = this;
                vm.reset([
                    "fields",
                    "tabIndex",
                    "getStaffOptions",
                    "staffConfig",
                    "depStaffRelation",
                    "depOptions",
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
                console.log(JSON.stringify(vm.queryResponse));
                vm.getTaskList();
            },
        },
        addTaskWhich: {
            handler() {
                var vm = this;
                console.log(vm.addTaskWhich);
                if (vm.addTaskWhich == "workedKey") {
                    console.log(vm.addTaskDetail);
                    delete vm.addTaskDetail.Date;
                    delete vm.addTaskDetail.Progress;
                    delete vm.addTaskDetail.Action;
                    delete vm.addTaskDetail.Remark;
                    delete vm.addTaskDetail.Owner;
                } else if (vm.addTaskWhich == "weeklyReport") {
                    delete vm.addTaskDetail.Dep;
                    vm.addTaskDetail.Date.time = vm.nowFormat;
                }
                console.log(vm.addTaskDetail);
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
            var todolistqueryoptions = [];
            var todolistqueryselected = "ALL";
            if (vm.pageAccess.weeklyreport.remark == "ALL") {
                todolistqueryoptions = [
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
                todolistqueryoptions = [
                    {
                        text: vm.depConfig[vm.pageAccess.weeklyreport.remark],
                        value: String(vm.pageAccess.weeklyreport.remark),
                    },
                ];
                todolistqueryselected = vm.pageAccess.weeklyreport.remark;
                vm.depOptions = [
                    {
                        text: vm.depConfig[vm.pageAccess.weeklyreport.remark],
                        value: String(vm.pageAccess.weeklyreport.remark),
                    },
                ];
            }
            var obj = {
                options: todolistqueryoptions,
                selected: todolistqueryselected,
                inputtext: "",
            };
            vm.setinputData(obj);
            let commonApiParams = {
                table: "weeklyReport",
                attr: "depID",
                timeattr: "date",
                intervaltime: {
                    date: [
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
        getTaskList() {
            let vm = this;
            vm.setalertMsg("請稍候....");
            vm.togglealertModal(true);
            vm.selectDepCollapseShow = false;
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
                let itemsobj = {};
                if (vm.tabIndex == 0) {
                    itemsobj = {
                        seq: element.seq,
                        depID: element.depID,
                        Group: element.groupID,
                        Item: element.item,
                        Date: { time: element.date },
                        Status: vm.replaceContentData(element.status, false),
                        Progress: element.progress,
                        Action: vm.replaceContentData(element.action, false),
                        Remark: element.remark,
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
            if (vm.pageAccess.weeklyreport.remark === "ALL") {
                thiswhere = Object.keys(vm.depConfig);
                thissymbols = ["equal", "equal", "equal"];
            } else {
                thiswhere.push(vm.pageAccess.weeklyreport.remark);
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
                            if (vm.pageAccess.weeklyreport.remark != "ALL") {
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
                    if (vm.pageAccess.weeklyreport.remark === "ALL")
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
            console.log(row);
            if (status) {
                vm.editActionItems.seq = row.item.seq;
                vm.editActionItems.which = which;
                if (which === "Owner") {
                    vm.editActionItems.Data = row.item.Owner.split(",");
                } else {
                    vm.editActionItems.Data = vm.replaceContentData(
                        row.item[which],
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
                            thisdata = vm.replaceContentData(thisdata, true);
                            console.log(thisdata);
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
            console.log(vm.addTaskWhich);
            let checkvalid = ["Group", "Item", "Progress", "Owner"];
            if (vm.addTaskWhich == "workedKey") checkvalid = ["Group", "Item"];
            console.log(checkvalid);
            checkvalid.forEach((element) => {
                console.log(element);
                console.log(vm.addTaskDetail[element]);
                if (!vm.addTaskDetail[element].invalid) status = false;
            });
            console.log(status);
            console.log(vm.addTaskDetail);
            if (status) {
                let params = {};
                if (vm.addTaskWhich == "workedKey") {
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
                } else if (vm.addTaskWhich == "weeklyReport") {
                    params = {
                        methods: "POST",
                        whichFunction: "CommonRegister",
                        table: "weeklyReport",
                        postdata: {
                            seq: [""],
                            depID: [
                                vm.depStaffRelation[
                                    vm.addTaskDetail.Owner.value[0]
                                ],
                            ],
                            groupID: [vm.addTaskDetail.Group.value],
                            item: [vm.addTaskDetail.Item.value],
                            date: [vm.addTaskDetail.Date.time],
                            status: [
                                vm.replaceContentData(
                                    vm.addTaskDetail.Status,
                                    true
                                ),
                            ],
                            // status: [vm.addTaskDetail.Status],
                            progress: [vm.addTaskDetail.Progress.value],
                            action: [
                                vm.replaceContentData(
                                    vm.addTaskDetail.Action,
                                    true
                                ),
                            ],
                            // action: [vm.addTaskDetail.Action],
                            remark: [vm.addTaskDetail.Remark],
                            owner: [vm.addTaskDetail.Owner.value.join(",")],
                            creatorID: [vm.loginData.account],
                        },
                    };
                }
                console.log(params);
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
            // vm.setalertMsg("請稍候.....");
            // vm.togglealertModal(true);
            console.log(items);
            let thiscompletedDate = "";
            if (items.status) thiscompletedDate = vm.nowFormat;
            console.log(vm.nowFormat);
            console.log(items);
            let params = {};
            let checkvalid = [];
            if (vm.tabIndex == 0) {
                checkvalid = ["Group", "Item", "Progress", "Owner"];
                for (let i = 0; i < checkvalid.length; i++) {
                    if (items[checkvalid[i]] == "") {
                        vm.setalertMsg("尚有未輸入的值");
                        vm.settimeoutalertModal();
                        return;
                    }
                }
                params = {
                    methods: "PATCH",
                    whichFunction: "CommonUpdate",
                    table: "weeklyReport",
                    postdata: {
                        old_seq: [items.seq],
                        depID: [vm.depStaffRelation[items.Owner.split(",")[0]]],
                        groupID: [items.Group],
                        item: [items.Item],
                        date: [items.Date.time],
                        status: [vm.replaceContentData(items.Status, true)],
                        progress: [items.Progress],
                        action: [vm.replaceContentData(items.Action, true)],
                        remark: [items.Remark],
                        owner: [String(items.Owner)],
                    },
                };
            } else {
                checkvalid = ["Group", "Item"];
                for (let i = 0; i < checkvalid.length; i++) {
                    if (items[checkvalid[i]] == "") {
                        vm.setalertMsg("尚有未輸入的值");
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
                        vm.queryAgain();
                    }, 1200);
                });
        },
        delTask() {
            let vm = this;
            console.log(vm.delItemSeq);
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
                Owner: {
                    key: "Owner",
                    value: [],
                    invalid: false,
                },
                Dep: {
                    key: "Dep",
                    value: null,
                    invalid: false,
                },
            };
            console.log(vm.addTaskDetail);
            vm.$nextTick(() => {
                console.log("%%%%%%%%%%");
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
            console.log(vm.tabIndex);
            if (vm.tabIndex != 0) {
                vm.setalertMsg("必須查詢本週的報表資料才可進行匯出");
                vm.settimeoutalertModal(1500);
                vm.tabIndex = 0;
                vm.selectDepCollapseShow = true;
                return;
            }
            vm.exportModalShow = true;
        },
        getNextWeekData() {
            let vm = this;
            //清空
            vm.nextWeekData = [];
            vm.setalertMsg("請稍候....");
            vm.togglealertModal(true);
            //抓下週工作重點
            var params = {};
            params["methods"] = "POST";
            params["whichFunction"] = "CommonSqlSyntaxQuery_";
            let thiswhere = [];
            let thissymbols = [];
            if (vm.inputData.selected === "ALL") {
                thiswhere = Object.keys(vm.depConfig);
                thissymbols = ["equal", "equal", "equal"];
            } else {
                thiswhere.push(vm.inputData.selected);
                thissymbols = ["equal"];
            }
            params["condition"] = {
                condition_1: {
                    table: "workedKey",
                    where: { depID: thiswhere, date: [vm.thisweekday[0]] },
                    limit: ["ALL"],
                    symbols: { depID: thissymbols, date: ["equal"] },
                },
            };
            console.log(params);
            let anyerror = false;
            return new Promise((resolve, reject) => {
                vm.axiosAction(params)
                    .then(() => {
                        var result = vm.axiosResult;
                        console.log(result);
                        console.log(JSON.stringify(result["QueryTableData"]));
                        if (result["Response"] == "ok") {
                            if (result["QueryTableData"].length != 0) {
                                result["QueryTableData"].forEach((element) => {
                                    let itemsobj = {};
                                    itemsobj = {
                                        Group: element.groupID,
                                        Item: element.item,
                                        Status: element.detail,
                                    };
                                    vm.nextWeekData.push(itemsobj);
                                });
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
                        console.log(anyerror);
                        if (anyerror) {
                            vm.settimeoutalertModal();
                            reject();
                        } else {
                            resolve();
                        }
                        return anyerror;
                    });
            });
        },
        exportfile(filetype) {
            let vm = this;
            console.log(vm.items);
            if (vm.items.length == 0) {
                vm.setalertMsg("無資料可匯出");
                vm.settimeoutalertModal();
                return;
            }
            vm.getNextWeekData().then(() => {
                let thisweekexportdata = JSON.parse(JSON.stringify(vm.items));
                thisweekexportdata.map(function (item) {
                    delete item.seq;
                    delete item.depID;
                    item.Date = item.Date.time;
                    // item.depID = vm.depConfig[item.depID];
                    console.log(item.Owner);
                    let thisOwner = item.Owner.split(",");
                    for (let i = 0; i < thisOwner.length; i++) {
                        thisOwner[i] = vm.staffConfig[thisOwner[i]];
                        if (i == thisOwner.length - 1) {
                            item.Owner = thisOwner.join(",");
                        }
                    }
                });
                console.log(thisweekexportdata);
                console.log(JSON.stringify(thisweekexportdata));

                let nextWeekData = JSON.parse(JSON.stringify(vm.nextWeekData));
                console.log(nextWeekData);
                console.log(JSON.stringify(nextWeekData));
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
                console.log(nextweekexportdata);
                console.log(nextweekothersexportdata);

                let thisdep = "全部門";
                if (vm.inputData.selected != "ALL") {
                    thisdep = vm.depConfig[vm.inputData.selected];
                }
                console.log(thisdep);
                const fileName = thisdep + "的WeeklyReport_" + vm.nowFormat;

                if (filetype === "CSV") {
                    const data = thisweekexportdata.map((itemsdata) =>
                        Object.values(itemsdata)
                    );
                    console.log(data);
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
                    let mergecells = {};
                    if (vm.exportPDFselected)
                        mergecells = { rowSpan: ["Group", "Item"] };
                    //本週
                    const thisweekfinalexportdata = vm.adjustExportDataDataFormat(
                        thisweekexportdata, //欲匯出的data
                        mergecells, //哪些key需要合併儲存格
                        {
                            halign: "left",
                        }, //欲匯出autoTable data的預設格式
                        [false], //是否有分隔線
                        true //是否要填色
                    );
                    console.log(thisweekfinalexportdata);
                    //下週
                    const nextweekfinalexportdata = vm.adjustExportDataDataFormat(
                        nextweekexportdata, //欲匯出的data
                        Object.assign(mergecells, {
                            colSpan: { Status: 6, Separate: 8 },
                        }), //哪些key需要合併儲存格
                        {
                            halign: "left",
                        }, //欲匯出autoTable data的預設格式
                        [true, { Separate: "下週工作重點" }], //是否有分隔線
                        true //是否要填色
                    );
                    console.log(nextweekfinalexportdata);
                    //Others
                    const nextweekothersfinalexportdata = vm.adjustExportDataDataFormat(
                        nextweekothersexportdata, //欲匯出的data
                        Object.assign(mergecells, {
                            colSpan: { Status: 6, Separate: 8 },
                        }), //哪些key需要合併儲存格
                        {
                            halign: "left",
                        }, //欲匯出autoTable data的預設格式
                        [true, { Separate: "Others" }], //是否有分隔線
                        false //是否要填色
                    );
                    console.log(nextweekothersfinalexportdata);
                    console.log(
                        thisweekfinalexportdata
                            .concat(nextweekfinalexportdata)
                            .concat(nextweekothersfinalexportdata)
                    );
                    vm.setautoTable({
                        body: thisweekfinalexportdata
                            .concat(nextweekfinalexportdata)
                            .concat(nextweekothersfinalexportdata),
                        columns: [
                            { header: "Group", dataKey: "Group" },
                            { header: "Item", dataKey: "Item" },
                            { header: "Date", dataKey: "Date" },
                            { header: "Status", dataKey: "Status" },
                            { header: "Progress%", dataKey: "Progress" },
                            { header: "Action", dataKey: "Action" },
                            { header: "Remark", dataKey: "Remark" },
                            { header: "Owner", dataKey: "Owner" },
                        ],
                        columnStyles: {
                            Group: { font: "msjh" },
                            Item: { font: "msjh" },
                            Date: { font: "msjh" },
                            Status: { font: "msjh" },
                            Progress: { font: "msjh" },
                            Action: { font: "msjh" },
                            Remark: { font: "msjh" },
                            Owner: { font: "msjh" },
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
                    });
                }
                setTimeout(() => {
                    vm.exportModalShow = false;
                }, 1000);
            });
        },

        adjustExportDataDataFormat(
            data,
            spanKeys,
            autoTableStyle,
            haveSeparate,
            haveColor
        ) {
            let vm = this;
            let checkduplicate = {};
            let checkduplicate1 = {};
            let checkduplicatefinalNum = {};
            let checkduplicatefinalNum1 = {};
            console.log(spanKeys);
            console.log(data);
            console.log(spanKeys.hasOwnProperty("rowSpan"));
            if (spanKeys.hasOwnProperty("rowSpan")) {
                data = data.sort(
                    vm.dataSorted([
                        ["Group", "asc"],
                        ["Item", "desc"],
                    ])
                );
                console.log(data);
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
                        if (checkduplicate[spanKeysrowSpan[i]]) {
                            if (
                                !checkduplicate[spanKeysrowSpan[i]][
                                    data[q][spanKeysrowSpan[i]]
                                ]
                            ) {
                                checkduplicate[spanKeysrowSpan[i]][
                                    data[q][spanKeysrowSpan[i]]
                                ] = {};
                                checkduplicate[spanKeysrowSpan[i]][
                                    data[q][spanKeysrowSpan[i]]
                                ]["COUNT"] = 1;
                            } else {
                                checkduplicate[spanKeysrowSpan[i]][
                                    data[q][spanKeysrowSpan[i]]
                                ]["COUNT"] += 1;
                            }
                            if (
                                typeof checkduplicate[spanKeysrowSpan[i]][
                                    data[q][spanKeysrowSpan[i]]
                                ]["INDEX"] == "undefined"
                            ) {
                                checkduplicate[spanKeysrowSpan[i]][
                                    data[q][spanKeysrowSpan[i]]
                                ]["INDEX"] = thisq;
                            }
                        } else {
                            checkduplicate = vm.checkduplicateFunc(
                                data[q],
                                spanKeysrowSpan[i],
                                spanKeysrowSpan,
                                checkduplicate,
                                thisq
                            );
                            console.log(checkduplicate);
                        }
                    }
                }

                // spanKeys.rowSpan.forEach((key) => {
                //     if (!checkduplicate1[key]) {
                //         checkduplicate1[key] = {};
                //         checkduplicatefinalNum1[key] = {};
                //     }
                //     data.map(function (item, index) {
                //         if (!checkduplicate1[key][item[key]]) {
                //             checkduplicate1[key][item[key]] = 1;
                //             if (haveSeparate[0]) {
                //                 checkduplicatefinalNum1[key][item[key]] =
                //                     index + 1;
                //             } else {
                //                 checkduplicatefinalNum1[key][item[key]] = index;
                //             }
                //         } else {
                //             checkduplicate1[key][item[key]] += 1;
                //         }
                //     });
                // });
            }
            if (data.length != 0 && haveSeparate[0]) {
                data.unshift(haveSeparate[1]);
            }
            console.log(data);
            console.log(checkduplicate);
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
                        if (checkduplicate[key_]) {
                            thisINDEX =
                                checkduplicate[key_][thiscontent]["INDEX"];
                            thisrowSpan =
                                checkduplicate[key_][thiscontent]["COUNT"];

                            let totalGroup = Object.keys(checkduplicate[key_]);
                            console.log(totalGroup);
                            //自定義格式
                            if (haveColor && key_ === "Group") {
                                console.log(totalGroup.indexOf(thiscontent));
                                console.log(
                                    totalGroup.indexOf(thiscontent) % 10
                                );
                                thisfillColor =
                                    tempColor[
                                        totalGroup.indexOf(thiscontent) % 10
                                    ];
                            }
                        } else {
                            let temp = spanKeys.rowSpan.slice();
                            temp.splice(
                                temp.indexOf(key_),
                                temp.length - temp.indexOf(key_)
                            );
                            let thischeckduplicate = {};
                            for (let i = 0; i < temp.length; i++) {
                                if (i == 0) {
                                    thischeckduplicate = checkduplicate;
                                }
                                thischeckduplicate = vm.catchFather(
                                    data[q],
                                    temp[i],
                                    thischeckduplicate
                                );
                            }
                            thisINDEX =
                                thischeckduplicate[key_][thiscontent]["INDEX"];
                            thisrowSpan =
                                thischeckduplicate[key_][thiscontent]["COUNT"];
                        }
                        if (q == thisINDEX) {
                            thishalign = "center";
                            // if (thiscontent == "") thisrowSpan = 0;
                            row.push({
                                colSpan: thiscolSpan,
                                rowSpan: thisrowSpan,
                                content: data[q][key_],
                                styles: {
                                    valign: "middle",
                                    halign: thishalign,
                                    fillColor: thisfillColor,
                                },
                            });
                        }
                    } else {
                        //自定義格式
                        if (key_ === "Progress") {
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
                                valign: "middle",
                                halign: thishalign,
                                fillColor: thisfillColor,
                            },
                        });
                    }
                }
                body.push(row);
            }
            return body;
        },
        catchFather(data, thiskey, thischeckduplicate) {
            return thischeckduplicate[thiskey][data[thiskey]];
        },
        checkduplicateFunc(
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
            let thischeckduplicate = {};
            for (let i = 0; i < temp.length; i++) {
                if (i == 0) {
                    thischeckduplicate = checkduplicate;
                }
                thischeckduplicate = vm.catchFather(
                    data,
                    temp[i],
                    thischeckduplicate
                );
                if (i == temp.length - 1) {
                    thischeckduplicate = vm.adjust(
                        thischeckduplicate,
                        thiskey,
                        data,
                        thisq
                    );
                }
            }
            return checkduplicate;
        },
        adjust(thischeckduplicate, thiskey, data, thisq) {
            if (!thischeckduplicate[thiskey]) {
                thischeckduplicate[thiskey] = {};
            }
            if (!thischeckduplicate[thiskey][data[thiskey]]) {
                thischeckduplicate[thiskey][data[thiskey]] = {};
                thischeckduplicate[thiskey][data[thiskey]]["COUNT"] = 1;
            } else {
                thischeckduplicate[thiskey][data[thiskey]]["COUNT"] += 1;
            }
            if (
                typeof thischeckduplicate[thiskey][data[thiskey]]["INDEX"] ==
                "undefined"
            ) {
                thischeckduplicate[thiskey][data[thiskey]]["INDEX"] = thisq;
            }
            return thischeckduplicate;
        },

        replaceContentData(content, status) {
            console.log(content);
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
                    .replace(/&nbsp;/g, "");
            }
        },

        //達到可以同時多key sort //https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
        compareValues(key, order = "asc") {
            return function innerSort(a, b) {
                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                    return 0;
                }

                const varA =
                    typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
                const varB =
                    typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

                let comparison = 0;
                if (varA > varB) {
                    comparison = -1;
                } else if (varA < varB) {
                    comparison = 1;
                }
                return order === "desc" ? comparison * -1 : comparison;
            };
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
::v-deep #choose .choose_content {
    opacity: 0 !important;
}
</style>
