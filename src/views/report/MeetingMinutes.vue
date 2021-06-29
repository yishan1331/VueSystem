<template>
    <div class="MeetingMinutes container">
        <b-row class="mb-3">
            <b-col sm="3">
                <h4>會議記錄</h4>
            </b-col>
            <!-- <b-col sm="9" class="text-right">
                <b-button
                    pill
                    v-if="
                        pageAccess.report.children.meetingminutes.remark.dataHandleAuthority.includes(
                            'add'
                        )
                    "
                    @click="toggleAddModal()"
                    variant="success"
                    >新增</b-button
                >
                <b-button
                    v-if="tabIndex == 0"
                    class="ml-1"
                    pill
                    v-b-toggle.collapse-1
                    variant="outline-info"
                    >選擇條件</b-button
                >
                <b-collapse
                    id="collapse-1"
                    v-model="commonqueryCollapseShow"
                    class="mt-2"
                >
                    <commonQuery />
                </b-collapse>
            </b-col> -->
        </b-row>
        <!-- <b-tabs v-model="tabIndex">
            <b-tab
                v-if="
                    pageAccess.report.children.meetingminutes.remark.dataHandleAuthority.includes(
                        'query'
                    )
                "
                title="查詢"
                active
            >
                <h5 v-if="items.length == 0" class="card-title mt-2">
                    查無資料
                </h5>
                <commonTable v-else></commonTable>
            </b-tab>
            <b-tab
                v-if="
                    pageAccess.report.children.meetingminutes.remark.dataHandleAuthority.includes(
                        'modify'
                    ) ||
                    pageAccess.report.children.meetingminutes.remark.dataHandleAuthority.includes(
                        'delete'
                    )
                "
                title="編輯"
            >
                <h5 v-if="items.length == 0" class="card-title mt-2">
                    查無資料
                </h5>
                <commonTable v-else></commonTable>
            </b-tab>
        </b-tabs> -->

        <!-- 新增modal -->
        <b-modal
            centered
            v-model="addModalShow"
            no-close-on-backdrop
            no-close-on-esc
            scrollable
            size="xl"
            hide-footer
        >
            <template v-slot:modal-header>
                <h5>新增會議記錄</h5>
            </template>
            <template v-slot:default>
                <b-row class="my-4">
                    <b-col sm="2">
                        <label for="input-default">會議日期:</label>
                    </b-col>
                    <b-col sm="5">
                        <datepicker
                            :date="form.date"
                            :option="datepickerOptions"
                        ></datepicker>
                    </b-col>
                </b-row>
                <b-row class="my-4">
                    <b-col sm="2">
                        <label for="input-default">會議標題:</label>
                    </b-col>
                    <b-col sm="10">
                        <b-form-input
                            v-model.trim="form.title"
                            type="text"
                        ></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="my-4">
                    <b-col sm="2">
                        <label for="textarea-large">
                            儲存路徑:
                            <br /><span
                                style="font-style: italic; font-size: 15px"
                                >根目錄:</span
                            >
                            <b-form-select
                                v-model="form.root"
                                :options="form.rootTree"
                                @change="rootChange($event)"
                                size="sm"
                                style="width: 100px !important"
                            >
                                <template v-slot:first>
                                    <b-form-select-option :value="null" disabled
                                        >選擇根目錄</b-form-select-option
                                    >
                                </template>
                            </b-form-select>
                        </label>
                    </b-col>
                    <b-col sm="8">
                        <div
                            v-for="(item, key) in form.pathTree"
                            :key="key"
                            style="display: inline-block; margin-right: 10px"
                        >
                            <b-form-select
                                v-model="form.path[key]"
                                :options="item"
                                @change="pathChange(true, $event, key)"
                            >
                                <template v-slot:first>
                                    <b-form-select-option :value="null" disabled
                                        >無選擇則放在此層目錄下</b-form-select-option
                                    >
                                </template>
                            </b-form-select>
                            /
                        </div>
                    </b-col>
                    <b-col sm="2" class="text-right">
                        <b-button
                            id="addFolder"
                            pill
                            @click="toggleAddSMBFolderModal(true)"
                            >新建資料夾</b-button
                        >
                        <b-tooltip target="addFolder">
                            <span>將會建在左側選單中的最後一層資料夾下</span>
                        </b-tooltip>
                    </b-col>
                </b-row>
                <b-row class="my-4">
                    <b-col sm="2">
                        <label for="textarea-large">
                            附件:
                            <br />(小於1000MB)
                        </label>
                    </b-col>
                    <b-col sm="10">
                        <b-form-file
                            v-model="form.files"
                            multiple
                            class="mb-2"
                            type="file"
                            ref="file"
                            :file-name-formatter="formatNames"
                            @change="fileChange"
                            accept="image/*, .pdf, .zip, audio/*"
                        ></b-form-file>
                    </b-col>
                </b-row>
                <b-row class="my-4">
                    <b-col sm="2">
                        <label for="textarea-large">機密:</label>
                    </b-col>
                    <b-col sm="10">
                        <b-form-checkbox
                            v-model="form.level"
                            switch
                        ></b-form-checkbox>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="12" class="pb-2">
                        <div class="text-center">
                            <b-button
                                type="submit"
                                variant="primary"
                                @click.prevent="addAction()"
                                >上傳</b-button
                            >
                        </div>
                        <div class="w-100">
                            <b-button
                                variant="light"
                                size="sm"
                                class="float-right"
                                @click.prevent="
                                    addModalShow = false;
                                    reset([
                                        'tabIndex',
                                        'depStaffRelation',
                                        'items',
                                    ]);
                                "
                                >Close</b-button
                            >
                        </div>
                    </b-col>
                </b-row>
            </template>
            <template v-slot:modal-footer></template>
        </b-modal>

        <!-- 編輯modal -->
        <b-modal
            centered
            v-model="modModalShow"
            no-close-on-backdrop
            no-close-on-esc
            scrollable
            size="xl"
            hide-footer
        >
            <template v-slot:modal-header>
                <h5>修改會議記錄</h5>
            </template>
            <template v-slot:default>
                <b-row class="my-4">
                    <b-col sm="2">
                        <label for="input-default">會議日期:</label>
                    </b-col>
                    <b-col sm="5">
                        <datepicker
                            :date="modfrom.date"
                            :option="datepickerOptions"
                        ></datepicker>
                    </b-col>
                </b-row>
                <b-row class="my-4">
                    <b-col sm="2">
                        <label for="input-default">會議標題:</label>
                    </b-col>
                    <b-col sm="10">
                        <b-form-input
                            v-model="modfrom.title"
                            type="text"
                        ></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="my-4">
                    <b-col sm="2">
                        <label for="textarea-large"
                            >原附件: <br />
                            <div style="font-style: italic; font-size: 15px">
                                <span>根目錄: </span
                                ><span v-if="modfrom.path != ''">{{
                                    modfrom.path
                                }}</span>
                                <span v-else>無設定根目錄，無法新增檔案</span>
                            </div>
                        </label>
                    </b-col>
                    <b-col sm="10">
                        <p v-if="modfrom.old_filename == ''">無</p>
                        <div
                            v-else
                            v-for="(item, key) in modfrom.old_filename.split(
                                ','
                            )"
                            :key="key"
                            style="
                                display: inline-block;
                                position: relative;
                                margin-right: 15px;
                                margin-bottom: 10px;
                            "
                        >
                            <b-button
                                pill
                                variant="outline-secondary"
                                disabled
                                >{{ item }}</b-button
                            >
                            <div
                                class="deletefilebtn"
                                @click.prevent="deletefile(item)"
                            ></div>
                        </div>
                    </b-col>
                </b-row>
                <b-row class="my-4">
                    <b-col sm="2">
                        <label for="textarea-large">
                            附件:
                            <br />(小於1000MB)
                        </label>
                    </b-col>
                    <b-col sm="10">
                        <b-form-file
                            :disabled="modfrom.path === ''"
                            v-model="modfrom.files"
                            multiple
                            class="mb-2"
                            type="file"
                            ref="file"
                            :file-name-formatter="formatNames"
                            @change="fileChange"
                            accept="image/*, .pdf, .zip, audio/*"
                        ></b-form-file>
                    </b-col>
                </b-row>
                <b-row class="my-4">
                    <b-col sm="2">
                        <label for="textarea-large">機密:</label>
                    </b-col>
                    <b-col sm="10">
                        <b-form-checkbox
                            v-model="modfrom.level"
                            switch
                        ></b-form-checkbox>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="12" class="pb-2">
                        <div class="text-center">
                            <b-button
                                type="submit"
                                variant="primary"
                                @click.prevent="modAction()"
                                >送出</b-button
                            >
                        </div>
                        <div class="w-100">
                            <b-button
                                variant="light"
                                size="sm"
                                class="float-right"
                                @click.prevent="
                                    reset([
                                        'tabIndex',
                                        'depStaffRelation',
                                        'items',
                                    ])
                                "
                                >Close</b-button
                            >
                        </div>
                    </b-col>
                </b-row>
            </template>
            <template v-slot:modal-footer></template>
        </b-modal>

        <!-- 新增SMB server folder modal -->
        <modal v-if="addFolderModalShow">
            <template v-slot:modalheader>
                <h5>新增資料夾</h5>
            </template>
            <template v-slot:default>
                <b-row class="my-4">
                    <b-col sm="8">
                        <div
                            v-for="(item, key) in addFolderItem.pathTree"
                            :key="key"
                            style="display: inline-block; margin-top: 10px"
                        >
                            <b-form-select
                                v-model="addFolderItem.path[key]"
                                :options="item"
                                @change="pathChange(false, $event, key)"
                            >
                                <template v-slot:first>
                                    <b-form-select-option :value="null" disabled
                                        >無選擇則放在此層目錄下</b-form-select-option
                                    >
                                </template>
                            </b-form-select>
                            /
                        </div>
                    </b-col>
                </b-row>
                <b-row class="my-4">
                    <b-col sm="3">
                        <label for="input-default">資料夾名稱:</label>
                    </b-col>
                    <b-col sm="7">
                        <b-form-input
                            type="text"
                            v-model.trim="addFolderItem.name"
                        ></b-form-input>
                    </b-col>
                </b-row>
            </template>
            <template v-slot:modalfooter>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="toggleAddSMBFolderModal(false)"
                        >Close</b-button
                    >
                    <b-button
                        variant="success"
                        size="sm"
                        class="float-right"
                        style="margin-right: 10px"
                        @click.prevent="addFolder()"
                        >送出</b-button
                    >
                </div>
            </template>
        </modal>
    </div>
</template>

<script>
import axios from "axios";
import datepicker from "vue-datepicker/vue-datepicker-es6.vue";
import commonQuery from "@/components/commonQuery.vue";
import commonTable from "@/components/commonTable.vue";
import modal from "@/components/modal.vue";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "MeetingMinutes",
    data() {
        return {
            tabIndex: 0,
            addModalShow: false,
            modModalShow: false,
            addFolderModalShow: false,
            commonqueryCollapseShow: false,
            form: {
                date: { time: "" },
                title: "",
                filename: [],
                files: [],
                level: false,
                root: null,
                rootTree: [],
                path: [],
                pathTree: [],
            },
            slotList: ["title", "filename"],
            fields: [
                {
                    key: "depID",
                    label: "部門",
                    sortable: true,
                },
                {
                    key: "title",
                    label: "會議標題",
                    sortable: true,
                },
                {
                    key: "date",
                    label: "會議日期",
                    sortable: true,
                },
                {
                    key: "filename",
                    label: "檔案列表",
                    sortable: false,
                },
                { key: "Action", label: "Action", sortable: false },
            ],
            items: [],
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
            depStaffRelation: null,
            modfrom: {
                index: "",
                date: { time: "" },
                title: "",
                old_filename: "",
                filename: [],
                files: [],
                level: false,
                path: "",
            },
            smbPathList: [],
            addFolderItem: {
                name: null,
                path: [],
                pathTree: [],
            },
        };
    },
    created: function () {
        let vm = this;
        // vm.SetCommonQueryData();
        // vm.getBelongDepStaff();

        // //設定commonTable SlotConfig
        // vm.settableSlotConfig({
        //     slotConfig: {
        //         depID: {
        //             value: "depID",
        //             conversiontable: Object.assign({}, vm.depDetail.config, {
        //                 common: "共用",
        //             }),
        //         },
        //         date: { value: "time" },
        //         filename: {
        //             value: "filename",
        //             download: {
        //                 location: "onDownload",
        //                 path: "./tempfiles/",
        //             },
        //         },
        //     },
        //     selectable: false,
        //     actionConfig: {
        //         edit: {
        //             authority: vm.pageAccess.report.children.meetingminutes.remark.dataHandleAuthority.includes(
        //                 "modify"
        //             ),
        //             type: "modal",
        //             location: "toggleModModal",
        //             goback: true,
        //         },
        //         del: {
        //             authority: vm.pageAccess.report.children.meetingminutes.remark.dataHandleAuthority.includes(
        //                 "delete"
        //             ),
        //             location: "delAction",
        //             delfield: ["seq", "filename", "path"],
        //         },
        //     },
        // });

        // //設定commonModal Config
        // vm.setcommonModalConfig(
        //     JSON.parse(JSON.stringify(vm.DEFAULT_commonModalConfig))
        // );
    },
    mounted: function () {
        // this.togglealertModal(true);
        // this.queryAgain();
    },
    components: {
        datepicker,
        commonQuery,
        modal,
        commonTable,
    },
    computed: {
        ...mapGetters({
            axiosResult: "commonaxios/get_axiosResult",
            pageAccess: "getlogin/get_pageAccess",
            loginData: "getlogin/get_loginData",
            depDetail: "getlogin/get_depDetail",
            queryResponse: "commonquery/get_queryResponse",
            DEFAULT_inputData: "commonquery/get_DEFAULT_inputData",
            DEFAULT_apiParams: "commonquery/get_DEFAULT_apiParams",
            getDate: "getdate/get_Date",
            DEFAULT_commonModalConfig: "usemodal/get_DEFAULT_commonModalConfig",
            tableResponse: "commontable/get_tableResponse",
        }),
    },
    watch: {
        queryResponse: {
            handler() {
                var vm = this;
                vm.togglealertModal(false);
                vm.reset(["tabIndex", "depStaffRelation"]);
                if (
                    vm.queryResponse == "查無資料" ||
                    vm.queryResponse == "時間尚未選擇"
                ) {
                    vm.setTimeOutAlertMsg(vm.queryResponse);
                    vm.settimeoutalertModal();

                    return;
                }
                console.log(vm.queryResponse);
                console.log(JSON.stringify(vm.queryResponse));
                vm.getDataList();
            },
        },
        tabIndex: {
            handler(value) {
                console.log(value);
                this.reset(["tabIndex", "depStaffRelation", "items"]);
                if (value === 0) this.fields.splice(4, 1);
                this.settableInWhichTab({
                    index: value,
                    which: "MeetingMinutes",
                });
                this.settableDetail({
                    items: this.items,
                    fields: this.fields,
                });
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
            alertProgressModal: "alertmodal/toggle_alertProgressModal",
            setalertMsgProgressValue: "alertmodal/set_alertMsgProgressValue",
            queryAgain: "commonquery/do_queryAgain",
            setinputData: "commonquery/set_inputData",
            setapiParams: "commonquery/set_apiParams",
            togglecommonModal: "usemodal/toggle_commonModal",
            setcommonModalConfig: "usemodal/set_commonModalConfig",
            setSystemFormCompletedData: "systemform/set_completedData",
            settableSlotConfig: "commontable/set_tableSlotConfig",
            settableDetail: "commontable/set_tableDetail",
            settableInWhichTab: "commontable/set_tableInWhichTab",
        }),

        SetCommonQueryData() {
            var vm = this;
            var meetingminutesqueryoptions = [];
            var meetingminutesqueryselected = "";
            vm.pageAccess.report.children.meetingminutes.remark.commonQueryCondition.main.map(
                (item) => {
                    let thistext = "";
                    if (vm.depDetail.config.hasOwnProperty(item)) {
                        thistext = vm.depDetail.config[item];
                    } else {
                        thistext = "共用";
                    }
                    meetingminutesqueryoptions.push({
                        text: thistext,
                        value: String(item),
                    });
                }
            );
            if (
                vm.pageAccess.report.children.meetingminutes.remark
                    .commonQueryCondition.main.length === 4
            ) {
                meetingminutesqueryoptions.push({ text: "全選", value: "ALL" });
                meetingminutesqueryselected = "ALL";
            } else {
                meetingminutesqueryselected = String(
                    vm.pageAccess.report.children.meetingminutes.remark
                        .commonQueryCondition.main[0]
                );
            }

            let obj = JSON.parse(JSON.stringify(vm.DEFAULT_inputData));
            obj.options = meetingminutesqueryoptions;
            obj.selected = meetingminutesqueryselected;
            vm.setinputData(obj);

            let commonApiParams = JSON.parse(
                JSON.stringify(vm.DEFAULT_apiParams)
            );
            commonApiParams.normal.table = "meetingMinutes";
            commonApiParams.normal.attr = "depID";
            commonApiParams.normal.timeattr = "date";
            commonApiParams.normal.intervaltime = {
                date: [
                    [
                        vm.getDate.thisweekday[0] + " 00:00:00",
                        vm.getDate.thisweekday[1] + " 23:59:59",
                    ],
                ],
            };
            //若職位階級為員工則資料只抓取非機密資料
            if (
                vm.pageAccess.report.children.meetingminutes.remark
                    .commonQueryCondition.secondary === "employee"
            ) {
                let thiswhere = 0;
                commonApiParams.customized = {
                    condition_1: {
                        where: { level: [thiswhere] },
                        symbols: { level: ["equal"] },
                    },
                };
            }
            vm.setapiParams(commonApiParams);
        },

        getBelongDepStaff() {
            let vm = this;
            var params = {};
            params["methods"] = "POST";
            params["whichFunction"] = "CommonSqlSyntaxQuery";
            console.log(vm.loginData);
            params["condition"] = {
                condition_1: {
                    table: "user",
                    fields: ["noumenonID"],
                    where: { uID: [vm.loginData.account] },
                    symbols: { uID: ["equal"] },
                },
            };
            console.log(params);
            console.log(JSON.stringify(params["condition"]));
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

                    if (result["Response"] == "ok") {
                        if (result["QueryTableData"].length == 0) {
                            vm.setTimeOutAlertMsg("查無資料");
                            anyerror = true;
                        } else {
                            vm.depStaffRelation =
                                result["QueryTableData"][0]["noumenonID"];
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
                    // console.log("done");
                    if (anyerror) vm.settimeoutalertModal();
                });
        },

        getDataList() {
            let vm = this;
            vm.togglealertModal(true);
            let itemsobj = {};
            let temp = [
                {
                    seq: 3,
                    lastUpdateTime: "2020-09-30 17:38:42",
                    level: 0,
                    title: "test5",
                    filename: "廠商基本資料.xlsx",
                    creatorID: 2493,
                    path: "雲端AI(智慧)平台部/PaaS/ggg",
                    date: "2020-09-30",
                    depID: 1003,
                    createTime: "2020-09-30 17:38:42",
                },
                {
                    seq: 2,
                    lastUpdateTime: "2020-09-30 17:38:25",
                    level: 0,
                    title: "test3",
                    filename: "報價單.docx",
                    creatorID: 2493,
                    path: "雲端AI(智慧)平台部/PaaS",
                    date: "2020-09-30",
                    depID: 1003,
                    createTime: "2020-09-30 17:38:25",
                },
                {
                    seq: 1,
                    lastUpdateTime: "2020-09-30 17:38:14",
                    level: 0,
                    title: "test2",
                    filename: "中獎.gif",
                    creatorID: 2493,
                    path: "雲端AI(智慧)平台部/MIS",
                    date: "2020-09-30",
                    depID: 1003,
                    createTime: "2020-09-30 17:38:14",
                },
                {
                    seq: 0,
                    lastUpdateTime: "2020-09-30 17:37:33",
                    level: 1,
                    title: "test",
                    filename: "分機表1090824.pdf",
                    creatorID: 2493,
                    path: "雲端AI(智慧)平台部",
                    date: "2020-09-30",
                    depID: 1003,
                    createTime: "2020-09-30 17:37:33",
                },
            ];
            // temp.forEach((element) => {
            vm.queryResponse.forEach((element) => {
                itemsobj = {
                    seq: element.seq,
                    depID: element.depID,
                    date: { time: element.date },
                    title: element.title,
                    filename: element.filename,
                    path: element.path,
                };
                let thislevel = false;
                if (element.level) thislevel = true;
                itemsobj["level"] = thislevel;
                if (
                    vm.pageAccess.report.children.meetingminutes.remark
                        .dataHandleAuthority == "query"
                ) {
                    if (!element.level) {
                        vm.items.push(itemsobj);
                    }
                } else {
                    vm.items.push(itemsobj);
                }
            });

            if (vm.tabIndex === 0) {
                vm.fields.splice(4, 1);
            }

            console.log(vm.items);
            vm.settableDetail({
                items: vm.items,
                fields: vm.fields,
                which: "meetingMinutes",
                children: {},
            });
            vm.togglealertModal(false);
        },

        //上傳
        addAction() {
            let vm = this;
            console.log("call api");
            console.log(vm.form);

            console.log(vm.form.path);
            let thispath = vm.form.root;
            if (this.form.files.length != 0) {
                if (thispath === null) {
                    vm.setTimeOutAlertMsg("尚未選擇根目錄");
                    vm.settimeoutalertModal();
                    return;
                }
                for (let i = 0; i < vm.form.path.length; i++) {
                    const element = vm.form.path[i];
                    if (element != null) {
                        thispath += "/" + element;
                    }
                }
            } else {
                thispath = "";
            }
            console.log(thispath);
            let formData = new FormData();
            console.log(this.form.files);
            for (var i = 0; i < this.form.files.length; i++) {
                let file = this.form.files[i];
                console.log(file);
                //檢察檔案大小是否大於10MB(1024*1024*1000)，若大於就不傳到後端
                if (file.size > 1024 * 1024 * 1000) {
                    vm.setTimeOutAlertMsg("檔名:" + file.name + "檔案太大");
                    vm.settimeoutalertModal(1200);
                    return;
                }
                formData.append("fileToUpload[" + i + "]", file);
            }

            let thislevel = 0;
            if (vm.form.level) thislevel = 1;
            let thisdepID = vm.depStaffRelation;
            if (vm.form.root === "共用") thisdepID = "common";
            formData.append("title", vm.form.title);
            formData.append("date", vm.form.date.time);
            formData.append("filename", vm.form.filename);
            formData.append("depID", thisdepID);
            formData.append("level", thislevel);
            formData.append("path", thispath);
            formData.append("account", vm.loginData.account);

            let config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };
            vm.alertProgressModal(true);
            const instance = axios.create({
                withCredentials: true,
                onUploadProgress: function (progressEvent) {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    vm.setalertMsgProgressValue(percentCompleted);
                },
            });
            instance
                .post(
                    "/php/views/meetingminutes/meetingMinutesAdd.php",
                    formData,
                    config
                )
                .then(
                    function (response) {
                        const result = response.data;
                        console.log(result);
                        vm.setTimeOutAlertMsg(result);
                        let altertime = 0;
                        if (result.length == 1) {
                            altertime = 1200;
                        } else if (result.length < 4) {
                            altertime = 1500;
                        } else {
                            altertime = 2500;
                        }
                        vm.settimeoutalertModal(altertime);
                        vm.reset(["tabIndex", "depStaffRelation", "items"]);
                    }.bind(this)
                )
                .catch(function (err) {
                    console.log(err);
                    console.log(err.response.status);
                    if (err.response.status === 413) {
                        vm.setTimeOutAlertMsg(
                            "Error 413: Request entity too large，檔案太大"
                        );
                    } else {
                        vm.setTimeOutAlertMsg(err);
                    }
                    vm.settimeoutalertModal();
                })
                .finally(() => {
                    console.log("done");
                    vm.alertProgressModal(false);
                    setTimeout(function () {
                        vm.queryAgain();
                    }, 1200);
                });
        },

        //檔名格式化
        formatNames(files) {
            var vm = this;
            for (var i = 0; i < files.length; i++) {
                if (vm.addModalShow) {
                    vm.form.filename.push(files[i].name);
                } else if (vm.modModalShow) {
                    vm.modfrom.filename.push(files[i].name);
                }

                // if (vm.tabIndex == 0) {
                //     vm.form.filename.push(files[i].name);
                // } else {
                //     vm.modfrom.filename.push(files[i].name);
                // }
            }
            console.log(vm.form.filename);
            if (files.length > 3) {
                return `${files.length} files selected`;
            } else {
                if (vm.addModalShow) {
                    return `${vm.form.filename}`;
                } else if (vm.modModalShow) {
                    return `${vm.modfrom.filename}`;
                }
                // if (vm.tabIndex == 0) {
                //     return `${vm.form.filename}`;
                // } else {
                //     return `${vm.modfrom.filename}`;
                // }
            }
        },

        //上傳file change
        fileChange() {
            let vm = this;
            if (vm.addModalShow) {
                vm.form.filename.length = 0;
            } else if (vm.modModalShow) {
                vm.modfrom.filename.length = 0;
            }
            // if (this.tabIndex == 0) {
            //     this.form.filename.length = 0;
            // } else {
            //     this.modfrom.filename.length = 0;
            // }
        },

        // //檔案預覽開啟頁面
        // previewfile(file) {
        //     console.log("./tempfiles/" + file);
        //     window.open(
        //         "./tempfiles/" + file,
        //         "vueSystem",
        //         "vueSystem",
        //         "statusbar=no,scrollbars=yes,status=yes,resizable=yes"
        //     );
        // },

        //附件下載
        onDownload(params) {
            const file = params.data;
            const path = params.data2;
            let vm = this;
            console.log(file);
            let anyerror = false;
            axios({
                url: "/php/views/meetingminutes/meetingMinutesSMBAction.php",
                method: "POST",
                data: {
                    whichFunction: "downloadFromSMB",
                    data: { file: file, path: path },
                },
            })
                .then((response) => {
                    console.log(response);
                    if (response.data == "ok") {
                        JSdownloadfile(file);
                    } else {
                        vm.setTimeOutAlertMsg(response.data);
                        anyerror = true;
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setTimeOutAlertMsg(err);
                    anyerror = true;
                })
                .finally(() => {
                    if (anyerror) vm.settimeoutalertModal(1500);
                });

            var JSdownloadfile = (file) => {
                console.log(file);
                vm.alertProgressModal(true);
                axios({
                    url: "./tempfiles/" + file,
                    method: "GET",
                    responseType: "blob",
                    onDownloadProgress: function (progressEvent) {
                        let percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        vm.setalertMsgProgressValue(percentCompleted);
                    },
                })
                    .then((response) => {
                        console.log(response);
                        var fileURL = window.URL.createObjectURL(
                            new Blob([response.data])
                        );
                        var fileLink = document.createElement("a");
                        fileLink.href = fileURL;
                        fileLink.setAttribute("download", file);
                        document.body.appendChild(fileLink);
                        fileLink.click();
                        document.body.removeChild(fileLink);
                        vm.alertProgressModal(false);
                        deldownloadfile(file);
                    })
                    .catch(function (err) {
                        console.log(err);
                        console.log(err.response.status);
                        vm.alertProgressModal(false);
                        vm.setTimeOutAlertMsg(err);
                        vm.settimeoutalertModal(1500);
                    });
            };

            var deldownloadfile = (file) => {
                axios({
                    url:
                        "/php/views/meetingminutes/meetingMinutesSMBAction.php",
                    method: "POST",
                    data: {
                        whichFunction: "deleteFileFromLocalhost",
                        data: file,
                    },
                })
                    .then((response) => {
                        console.log(response);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            };
        },

        //修改
        modAction() {
            var vm = this;
            console.log(vm.modfrom);
            if (vm.modfrom.files.length != 0) {
                if (vm.modfrom.old_filename != "") {
                    if (
                        vm.modfrom.filename.length >
                        vm.modfrom.old_filename.split(",").length
                    ) {
                        vm.setTimeOutAlertMsg("上傳附件數量大於原附件數量");
                        vm.settimeoutalertModal(1500);
                        vm.modfrom.files = "";
                        vm.modfrom.filename.length = 0;
                        return;
                    }
                    for (var i = 0; i < vm.modfrom.filename.length; i++) {
                        if (
                            vm.modfrom.old_filename
                                .split(",")
                                .indexOf(vm.modfrom.filename[i]) == -1
                        ) {
                            vm.setTimeOutAlertMsg(
                                "上傳附件檔名:" +
                                    vm.modfrom.filename[i] +
                                    "應與原附件名稱相同"
                            );
                            vm.settimeoutalertModal(1500);
                            vm.modfrom.files = "";
                            vm.modfrom.filename.length = 0;
                            return;
                        }
                    }
                }
            }

            let formData = new FormData();
            for (var i = 0; i < vm.modfrom.files.length; i++) {
                let file = vm.modfrom.files[i];
                //檢察檔案大小是否大於10MB(1024*1024*1000)，若大於就不傳到後端
                if (file.size > 1024 * 1024 * 1000) {
                    vm.setTimeOutAlertMsg("檔名:" + file.name + "檔案太大");
                    vm.settimeoutalertModal(1200);
                    return;
                }
                formData.append("fileToUpload[" + i + "]", file);
            }
            formData.append("deletefile", "");
            formData.append("seq", vm.modfrom.seq);
            formData.append("title", vm.modfrom.title);
            formData.append("date", vm.modfrom.date.time);
            let thislevel = 0;
            if (vm.modfrom.level) thislevel = 1;
            console.log(thislevel);
            formData.append("level", thislevel);
            formData.append("path", vm.modfrom.path);
            if (vm.modfrom.old_filename == "") {
                formData.append("filename", vm.modfrom.filename);
            } else {
                console.log(vm.modfrom.old_filename.split(","));
                formData.append("filename", vm.modfrom.old_filename);
            }
            formData.append("account", vm.loginData.account);
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };
            vm.alertProgressModal(true);
            const instance = axios.create({
                withCredentials: true,
                onUploadProgress: function (progressEvent) {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    vm.setalertMsgProgressValue(percentCompleted);
                },
            });
            instance
                .post(
                    "/php/views/meetingminutes/meetingMinutesMod.php",
                    formData,
                    config
                )
                .then(
                    function (response) {
                        console.log(response);
                        const result = response.data;
                        console.log(result);
                        vm.setTimeOutAlertMsg(result);
                        var altertime = 0;
                        if (result.length == 1) {
                            altertime = 1000;
                        } else if (result.length < 4) {
                            altertime = 1500;
                        } else {
                            altertime = 2500;
                        }
                        vm.settimeoutalertModal(altertime);
                        vm.reset(["tabIndex", "depStaffRelation", "items"]);
                    }.bind(this)
                )
                .catch(function (err) {
                    console.log(err);
                    console.log(err.response.status);
                    // if (err.response.status === 413) {
                    //     vm.setTimeOutAlertMsg(
                    //         "Error 413: Request entity too large，檔案太大"
                    //     );
                    // } else {
                    //     vm.setTimeOutAlertMsg(err);
                    // }
                    // vm.settimeoutalertModal();
                })
                .finally(() => {
                    // console.log("done");
                    vm.alertProgressModal(false);
                    setTimeout(function () {
                        vm.queryAgain();
                    }, 1200);
                });
        },

        //修改畫面刪除檔案
        deletefile(filename) {
            console.log(filename);
            var vm = this;
            var oldfilelist = vm.modfrom.old_filename.split(",");
            console.log(oldfilelist);
            oldfilelist.splice(oldfilelist.indexOf(filename), 1);
            var newfilestr = oldfilelist.join(",");
            console.log(newfilestr);
            let formData = new FormData();
            formData.append("seq", vm.modfrom.seq);
            formData.append("deletefile", filename);
            formData.append("path", vm.modfrom.path);
            formData.append("remainfile", newfilestr);
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };
            vm.togglealertModal(true);
            const instance = axios.create({
                withCredentials: true,
            });
            instance
                .post(
                    "/php/views/meetingminutes/meetingMinutesMod.php",
                    formData,
                    config
                )
                .then(
                    function (response) {
                        console.log(response);
                        const result = response.data;
                        console.log(result);
                        vm.modfrom.old_filename = newfilestr;
                        console.log(vm.modfrom.index);
                        vm.items[vm.modfrom.index].filename = newfilestr;
                        vm.setTimeOutAlertMsg(result);
                        vm.settimeoutalertModal(1000);
                    }.bind(this)
                )
                .catch(function (err) {
                    console.log(err);
                })
                .finally(() => {
                    vm.togglealertModal(false);
                });
        },

        //刪除
        delAction(params) {
            let filename = params.data.filename;
            if (filename != "") {
                filename = filename.split(",");
            }
            const seq = params.data.seq;
            const path = params.data.path;
            console.log(filename);
            console.log(seq);
            console.log(path);
            var vm = this;
            vm.togglealertModal(true);
            let apiparams = {};
            apiparams["filename"] = filename;
            apiparams["seq"] = seq;
            apiparams["path"] = path;
            console.log(apiparams);
            axios
                .post(
                    "/php/views/meetingminutes/meetingMinutesDel.php",
                    apiparams
                )
                .then(
                    function (response) {
                        console.log(response);
                        const result = response.data;
                        vm.setTimeOutAlertMsg(result);
                        vm.settimeoutalertModal();
                    }.bind(this)
                )
                .catch(function (err) {
                    console.log(err);
                })
                .finally(() => {
                    // console.log("done");
                    vm.togglealertModal(false);
                    vm.togglecommonModal(false);
                    setTimeout(function () {
                        vm.queryAgain();
                    }, 1200);
                });
        },

        toggleAddModal() {
            let vm = this;
            //根目錄更新(抓取有哪些根目錄可選擇)
            console.log(
                vm.pageAccess.report.children.meetingminutes.remark
                    .commonQueryCondition
            );
            vm.pageAccess.report.children.meetingminutes.remark.commonQueryCondition.main.map(
                (item) => {
                    let thistext = "";
                    if (vm.depDetail.config.hasOwnProperty(item)) {
                        thistext = vm.depDetail.config[item];
                    } else {
                        thistext = "共用";
                    }
                    vm.form.rootTree.push({
                        text: thistext,
                        value: thistext,
                    });
                }
            );
            console.log(vm.form.rootTree);
            vm.addModalShow = true;
            vm.form.date.time = vm.getDate.nowFormat;
        },

        //新建資料夾
        addFolder() {
            let vm = this;
            let thispath = vm.form.root;
            console.log(vm.addFolderItem.path);
            console.log(vm.addFolderItem.name);
            if (vm.addFolderItem.name == "" || vm.addFolderItem.name === null) {
                vm.setTimeOutAlertMsg("資料夾名稱不可為空");
                vm.settimeoutalertModal();
                return;
            }
            for (let i = 0; i < vm.addFolderItem.path.length; i++) {
                const element = vm.addFolderItem.path[i];
                if (element === null) {
                    if (vm.smbPathList.indexOf(vm.addFolderItem.name) != -1) {
                        vm.setTimeOutAlertMsg("資料夾名稱不可重複");
                        vm.settimeoutalertModal();
                        return;
                    }
                } else {
                    thispath += "/" + element;
                }
            }
            // thispath += vm.addFolderName;
            console.log(thispath);
            let anyerror = false;
            axios({
                url: "/php/views/meetingminutes/meetingMinutesSMBAction.php",
                method: "POST",
                data: {
                    whichFunction: "addNewSMBFolder",
                    data: { path: thispath, foldername: vm.addFolderItem.name },
                },
            })
                .then((response) => {
                    console.log(response);
                    vm.setTimeOutAlertMsg(response.data);
                    if (response.data == "ok") {
                        console.log(response.data);
                        vm.form.path.length = 0;
                        vm.form.pathTree.length = 0;
                        vm.smbPathList.length = 0;
                        let path = vm.form.root;
                        const asyncGetFolder = async () => {
                            return await vm.getSMBFolderList(path, true);
                        };
                        asyncGetFolder()
                            .then((value) => {
                                console.log(value);
                                if (value == "ok") {
                                    vm.setTimeOutAlertMsg("新增資料夾成功");
                                } else {
                                    vm.setTimeOutAlertMsg(value);
                                }
                            })
                            .catch((response) => {
                                console.log(response);
                                vm.setTimeOutAlertMsg(response);
                            })
                            .finally(() => {
                                vm.settimeoutalertModal();
                            });
                    } else {
                        anyerror = true;
                        vm.setTimeOutAlertMsg(response.data);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    anyerror = true;
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    if (anyerror) vm.settimeoutalertModal(1500);
                    vm.toggleAddSMBFolderModal(false);
                });
        },

        //toggle 新建資料夾modal
        toggleAddSMBFolderModal(status) {
            let vm = this;
            console.log(vm.form.root);
            if (vm.form.root === null) {
                vm.setTimeOutAlertMsg("請先選擇根目錄");
                vm.settimeoutalertModal();
                return;
            }
            if (status) {
                vm.addFolderItem.path = JSON.parse(
                    JSON.stringify(vm.form)
                ).path.map(() => {
                    return null;
                });
                vm.addFolderItem.pathTree = JSON.parse(
                    JSON.stringify(vm.form)
                ).pathTree;
            } else {
                vm.addFolderItem.name = null;
                vm.addFolderItem.path = [];
                vm.addFolderItem.pathTree = [];
            }
            vm.addFolderModalShow = status;
            vm.togglecommonModal(status);
        },

        //抓取smb server 資料夾列表
        getSMBFolderList(path, which) {
            console.log(path);
            let vm = this;
            return new Promise((resolve, reject) => {
                axios({
                    url:
                        "/php/views/meetingminutes/meetingMinutesSMBAction.php",
                    method: "POST",
                    data: {
                        whichFunction: "getSMBFoldersList",
                        data: path,
                    },
                })
                    .then((response) => {
                        console.log(response);
                        if (response.data.Response == "ok") {
                            console.log(response.data.data);
                            let smbFolder = [];
                            //去掉前後兩個不是內部資料的訊息
                            for (
                                let i = 2;
                                i < response.data.data.length - 2;
                                i++
                            ) {
                                //去掉為""的data
                                const filterList = response.data.data[i].filter(
                                    function (item) {
                                        if (item != "") {
                                            return item;
                                        }
                                    }
                                );
                                //擷取檔名、檔案型態
                                filterList.splice(
                                    filterList.length - 6,
                                    filterList.length
                                );
                                if (filterList[filterList.length - 1] == "D") {
                                    //若檔名有空格會先被拆開，此時將其還原
                                    if (filterList.length != 2) {
                                        let fileType =
                                            filterList[filterList.length - 1];
                                        filterList.splice(
                                            filterList.length - 1,
                                            1
                                        );
                                        let filename = filterList.join(" ");
                                        smbFolder.push({
                                            text: filename,
                                            value: filename,
                                        });
                                        vm.smbPathList.push(filename);
                                    } else {
                                        smbFolder.push({
                                            text: filterList[0],
                                            value: filterList[0],
                                        });
                                        vm.smbPathList.push(filterList[0]);
                                    }
                                }
                            }
                            if (smbFolder.length != 0) {
                                if (which) {
                                    vm.form.path.push(null);
                                    vm.form.pathTree.push(smbFolder);
                                } else {
                                    vm.addFolderItem.path.push(null);
                                    vm.addFolderItem.pathTree.push(smbFolder);
                                }
                            }
                            resolve("ok");
                        } else if (response.data.Response == "無資料夾") {
                            // console.log(response.data.Response);
                            resolve("ok");
                        } else {
                            reject(response.data.Response);
                        }
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            });
        },

        rootChange(path) {
            let vm = this;
            //抓此根目錄下有的資料夾
            let anyerror = false;
            console.log(path);
            vm.form.path = [];
            vm.form.pathTree = [];
            vm.smbPathList = [];
            console.log(vm.form.path);
            console.log(vm.form.pathTree);
            console.log(vm.smbPathList);
            const asyncGetFolder = async () => {
                return await vm.getSMBFolderList(path, true);
            };
            asyncGetFolder()
                .then((value) => {
                    console.log(value);
                })
                .catch((response) => {
                    console.log(response);
                    vm.setTimeOutAlertMsg(response);
                    vm.settimeoutalertModal();
                });
        },

        pathChange(which, event, key) {
            console.log(event);
            console.log(key);
            let vm = this;
            let temp = [];
            let temp2 = [];
            let thispath = vm.form.root;
            if (which) {
                temp = vm.form.path;
                temp2 = vm.form.pathTree;
            } else {
                temp = vm.addFolderItem.path;
                temp2 = vm.addFolderItem.pathTree;
            }
            temp.splice(key + 1, temp.length - key);
            temp2.splice(key + 1, temp2.length - key);
            console.log(temp);
            console.log(temp2);
            for (let i = 0; i < temp.length; i++) {
                const element = temp[i];
                if (element != null) {
                    thispath += "/" + element;
                }
            }
            console.log(thispath);
            const asyncGetFolder = async () => {
                return await vm.getSMBFolderList(thispath, which);
            };
            asyncGetFolder()
                .then((value) => {
                    console.log(value);
                    if (value == "ok") {
                    }
                })
                .catch((response) => {
                    console.log(response);
                });
        },

        toggleModModal(params) {
            const item = params.data;
            const index = params.data2;
            console.log(item);
            console.log(index);
            const thisitem = JSON.parse(JSON.stringify(item));
            let vm = this;
            vm.modfrom.index = index;
            vm.modfrom.seq = thisitem.seq;
            vm.modfrom.title = thisitem.title;
            vm.modfrom.date = thisitem.date;
            vm.modfrom.old_filename = thisitem.filename;
            let thislevel = false;
            if (thisitem.level) thislevel = true;
            vm.modfrom.level = thislevel;
            vm.modfrom.path = thisitem.path;
            vm.modModalShow = true;
            console.log(vm.modfrom);
        },

        getCellSlot(key) {
            return `cell(${key})`;
        },

        //資料reset
        reset(keep) {
            console.log(this.$options);
            console.log(this.$data);
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
.input-title {
    width: 200px !important;
}
h5 {
    margin: 0 auto;
}
.hide {
    display: none;
}
/*刪除圖示*/
.deletefilebtn {
    position: absolute;
    left: -13px;
    top: -10px;
    width: 25px;
    height: 25px;
    background: silver;
    border-radius: 25px;
    box-shadow: 2px 2px 5px 0px black;
    cursor: pointer;
}
.deletefilebtn:hover {
    background: red;
}
.deletefilebtn:before {
    position: absolute;
    content: "";
    width: 15px;
    height: 5px;
    background: white;
    transform: rotate(45deg);
    top: 10px;
    left: 5px;
}
.deletefilebtn:after {
    content: "";
    position: absolute;
    width: 15px;
    height: 5px;
    background: white;
    transform: rotate(-45deg);
    top: 10px;
    left: 5px;
}
::v-deep .tooltip-inner {
    max-width: 500px !important;
    text-align: left !important;
}
::v-deep .tooltip-inner p {
    margin-bottom: 5px !important;
}
.downloadfilebtn {
    position: absolute;
    top: 20px;
    cursor: pointer;
    right: -10px;
    width: 21.328px;
    height: 21.328px;
}
</style>

