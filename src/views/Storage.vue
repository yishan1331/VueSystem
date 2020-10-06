<template>
    <div class="Storage container">
        <b-row class="mb-3">
            <b-col sm="3">
                <h4>儲存設備狀態</h4>
            </b-col>
            <b-col sm="9" class="text-right">
                <b-button pill @click="toggleAddModal(true)" variant="success"
                    >新增</b-button
                >
                <!-- 將『選擇條件』功能隱藏，直接預設搜尋所有server join vm的資料 -->
                <!-- <b-button
                    v-show="false"
                    class="ml-1"
                    pill
                    v-b-toggle.collapse-1
                    variant="light"
                >選擇條件</b-button>
                <b-collapse id="collapse-1" v-model="commonqueryCollapseShow" class="mt-2">-->
                <commonQuery v-show="false" />
                <!-- </b-collapse> -->
            </b-col>
        </b-row>
        <b-tabs v-model="tabIndex">
            <b-tab title="查詢" active>
                <h5 v-if="items.length == 0" class="mt-2">查無資料</h5>
                <commonTable v-else></commonTable>
                <!-- <b-table
                    v-else
                    ref="queryTable"
                    id="queryTable"
                    sticky-header="650px"
                    responsive
                    :items="items"
                    :fields="fields"
                    head-variant="light"
                    class="mt-2"
                >
                    <template
                        v-slot:[getHeaderSlot(data)]="row"
                        v-for="(data, key) in slotList"
                    >
                        <div :key="key" style="position: relative">
                            {{ row.label }}
                            <div
                                class="deletefilebtn"
                                v-if="slotList.length > 1"
                                @click.prevent="removeHeaderFields(key)"
                            ></div>
                        </div>
                    </template>
                    <template
                        v-slot:[getCellSlot(data)]="row"
                        v-for="(data, key) in slotList"
                    >
                        <div
                            :key="String(row.item.seq) + '_' + String(key)"
                            v-html="row.item[data]"
                        ></div>
                    </template>
                </b-table> -->
            </b-tab>
            <b-tab title="編輯">
                <h5 v-if="items.length == 0" class="card-title mt-2">
                    查無資料
                </h5>
                <commonTable v-else></commonTable>
                <!-- <b-table
                    v-else
                    ref="editTable"
                    id="editTable"
                    sticky-header="550px"
                    responsive
                    :items="items"
                    :fields="fields"
                    head-variant="light"
                    class="mt-2"
                >
                    Yishan 09162020 Dynamic Slot https://stackoverflow.com/questions/58140842/vue-and-bootstrap-vue-dynamically-use-slots/58143362#58143362
                    <template
                        v-slot:[getCellSlot(data)]="row"
                        v-for="(data, key) in slotList"
                    >
                        <div
                            :key="String(row.item.seq) + '_' + String(key)"
                            :class="{ hide: activeItemsSeq == row.item.seq }"
                            v-html="row.item[data]"
                        ></div>
                        <div
                            :key="String(row.item.seq) + '__' + String(key)"
                            :class="{ hide: activeItemsSeq != row.item.seq }"
                        >
                            <b-form-input
                                v-if="data == 'size' || data == 'subSize'"
                                type="number"
                                v-model="row.item[data]"
                                min="0"
                                step="20"
                            ></b-form-input>
                            <b-form-input
                                v-else
                                class="input-text"
                                type="text"
                                v-model="row.item[data]"
                                @click="editLongData(row, data, true)"
                            ></b-form-input>
                        </div>
                    </template>
                    <template v-slot:cell(Action)="row">
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
                                @click="toggleDelModal(true, row.item.seq)"
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
                            <b-button @click="modAction(row.item)"
                                >完成編輯</b-button
                            >
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
                </b-table> -->
            </b-tab>
        </b-tabs>

        <!-- 新增modal -->
        <modal v-if="addModalShow">
            <template v-slot:modalheader>
                <h5>新增Storage</h5>
            </template>
            <template v-slot:default>
                <systemForm />
            </template>
            <template v-slot:modalfooter>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="toggleAddModal(false)"
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
                            editActionModalShow = false;
                            togglecommonModal(false);
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

        <!-- 刪除事項modal -->
        <modal v-if="delModalShow">
            <template v-slot:default>
                <div class="d-block text-center">
                    <h3>確定要刪除嗎？</h3>
                </div>
            </template>
            <template v-slot:modalfooter>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="toggleDelModal(false, null)"
                        >Close</b-button
                    >
                    <b-button
                        variant="success"
                        size="sm"
                        class="float-right"
                        style="margin-right: 10px"
                        @click.prevent="delAction()"
                        >確定刪除</b-button
                    >
                </div>
            </template>
        </modal>
    </div>
</template>

<script>
import axios from "axios";
import systemForm from "@/components/systemForm.vue";
import commonQuery from "@/components/commonQuery.vue";
import commonTable from "@/components/commonTable.vue";
import modal from "@/components/modal.vue";
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
    name: "Storage",
    data() {
        return {
            tabIndex: 0,
            commonqueryCollapseShow: false,
            addModalShow: false,
            delModalShow: false,
            vmListModalShow: false,
            slotList: [
                "species",
                "type",
                "name",
                "size",
                "subSize",
                "note",
                "IP",
            ],
            fields: [
                // { key: "seq", label: "編號", sortable: true },
                { key: "species", label: "種類", sortable: true },
                { key: "type", label: "類型", sortable: false },
                { key: "name", label: "名稱", sortable: false },
                { key: "size", label: "SIZE(GB)", sortable: false },
                { key: "subSize", label: "SUB SIZE(GB)", sortable: false },
                { key: "note", label: "內容說明", sortable: false },
                { key: "IP", label: "對應的server IP", sortable: false },
                { key: "Action", label: "Action", sortable: false },
            ],
            items: [],
            activeItemsSeq: null,
            delItemSeq: null,
            tempThisOldItem: {},
            editActionModalShow: false,
            editActionItems: {
                seq: null,
                Data: "",
                which: "",
            },
            commonTableSlotConfig: {
                slotConfig: {
                    species: {
                        value: "species",
                        "v-html": true,
                        removeHeader: true,
                        edit: {
                            type: "input",
                        },
                    },
                    type: {
                        value: "type",
                        "v-html": true,
                        removeHeader: false,
                        edit: {
                            type: "input",
                        },
                    },
                    name: {
                        value: "name",
                        "v-html": true,
                        removeHeader: true,
                        edit: {
                            type: "input",
                        },
                    },
                    size: {
                        value: "size",
                        "v-html": true,
                        removeHeader: true,
                        edit: {
                            type: "number",
                        },
                    },
                    subSize: {
                        value: "subSize",
                        "v-html": true,
                        removeHeader: true,
                        edit: {
                            type: "number",
                        },
                    },
                    note: {
                        value: "note",
                        "v-html": true,
                        removeHeader: true,
                        edit: {
                            type: "input",
                        },
                    },
                    IP: {
                        value: "IP",
                        "v-html": true,
                        removeHeader: true,
                        edit: {
                            type: "input",
                        },
                    },
                },
                actionConfig: {
                    edit: {
                        type: "self",
                        location: "modAction",
                    },
                    del: {
                        location: "delAction",
                        delfield: ["seq"],
                    },
                },
            },
        };
    },
    created: function () {
        this.setCommonQueryData();
        this.setSystemFormData();

        //設定commonTable SlotConfig
        this.settableSlotConfig(this.commonTableSlotConfig);
    },
    mounted: function () {
        this.togglealertModal(true);
        // this.getDataList();
        this.queryAgain();
    },
    components: {
        commonQuery,
        systemForm,
        modal,
        commonTable,
    },
    computed: {
        ...mapGetters({
            axiosResult: "commonaxios/get_axiosResult",
            loginData: "getlogin/get_loginData",
            queryResponse: "commonquery/get_queryResponse",
            tableBusy: "commonquery/get_tableBusy",
            systemFormCompletedData: "systemform/get_completedData",
            inputData: "commonquery/get_inputData",
            DEFAULT_inputData: "commonquery/get_DEFAULT_inputData",
            apiParams: "commonquery/get_apiParams",
            DEFAULT_apiParams: "commonquery/get_DEFAULT_apiParams",
            isInit: "commonquery/get_isInit",
            DEFAULT_commonModalConfig: "usemodal/get_DEFAULT_commonModalConfig",
            tableResponse: "commontable/get_tableResponse",
        }),
    },
    watch: {
        tabIndex: {
            handler(value) {
                this.reset(["tabIndex", "items"]);
                if (value === 0) this.fields.splice(7, 1);
                this.settableInWhichTabIndex(value);
                this.settableDetail({
                    items: this.items,
                    fields: this.fields,
                });
                // this.$nextTick(() => {
                //     //等渲染完畢才執行
                //     if (this.items.length != 0) {
                //         if (value === 0) {
                //             //表格scroll移至最左
                //             this.$refs.commonTable.$el.scrollLeft = 0;
                //         } else {
                //             //表格scroll移至最右
                //             this.$refs.commonTable.$el.scrollLeft = document.getElementById(
                //                 "commonTable"
                //             ).scrollWidth;
                //         }
                //     }
                // });
            },
        },
        systemFormCompletedData: {
            handler() {
                var vm = this;
                console.log(vm.systemFormCompletedData);
                if (Object.keys(vm.systemFormCompletedData).length != 0) {
                    vm.storageAdd();
                }
            },
        },
        queryResponse: {
            handler() {
                var vm = this;
                vm.togglealertModal(false);
                console.log("////////////////////////////");
                vm.reset(["tabIndex"]);
                // // vm.changetableBusy();
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
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            togglealertModal: "alertmodal/toggle_alertModal",
            setinputData: "commonquery/set_inputData",
            setapiParams: "commonquery/set_apiParams",
            queryAgain: "commonquery/do_queryAgain",
            setvforData: "systemform/set_vforData",
            setsystemFormResponse: "systemform/set_systemFormResponse",
            setSystemFormCompletedData: "systemform/set_completedData",
            setSystemFormSelectOptions: "systemform/set_selectOptions",
            togglecommonModal: "usemodal/toggle_commonModal",
            setcommonModalConfig: "usemodal/set_commonModalConfig",
            settableSlotConfig: "commontable/set_tableSlotConfig",
            settableDetail: "commontable/set_tableDetail",
            settableInWhichTabIndex: "commontable/set_tableInWhichTabIndex",
            setactiveItemsSeq: "commontable/set_activeItemsSeq",
        }),

        setSystemFormData() {
            let vforData = {};
            vforData = {
                species: ["text", "種類"],
                type: ["textarea", "類型"],
                name: ["text", "名稱"],
                size: ["number", "SIZE(GB)"],
                subSize: ["number", "SUB SIZE(GB)"],
                note: ["textarea", "內容說明"],
                IP: ["text", "對應的server IP"],
                textclass: false,
                button: ["Add", "新增"],
            };
            console.log(vforData);
            this.setvforData(vforData);
        },

        setCommonQueryData() {
            var vm = this;
            var storagequeryselected = "ALL";
            var storagequeryoptions = [{ value: "ALL", text: "全選" }];
            let obj = JSON.parse(JSON.stringify(vm.DEFAULT_inputData));
            obj.options = storagequeryoptions;
            obj.selected = storagequeryselected;
            obj.usetime = false;
            vm.setinputData(obj);

            let commonApiParams = JSON.parse(
                JSON.stringify(vm.DEFAULT_apiParams)
            );
            commonApiParams.normal.table = "storage";
            console.log(commonApiParams);
            vm.setapiParams(commonApiParams);
        },

        storageAdd() {
            var vm = this;
            vm.togglealertModal(true);
            Object.keys(vm.systemFormCompletedData).map(function (item) {
                if (item != "size" && item != "subsize") {
                    vm.systemFormCompletedData[item] = vm.replaceContentData(
                        String(vm.systemFormCompletedData[item]),
                        true
                    );
                }
            });
            console.log(vm.systemFormCompletedData);
            var params = {
                methods: "POST",
                whichFunction: "CommonRegister",
                table: "storage",
                postdata: {
                    seq: [""],
                    species: [vm.systemFormCompletedData.species],
                    type: [vm.systemFormCompletedData.type],
                    name: [vm.systemFormCompletedData.name],
                    size: [vm.systemFormCompletedData.size],
                    subSize: [vm.systemFormCompletedData.subSize],
                    note: [vm.systemFormCompletedData.note],
                    IP: [vm.systemFormCompletedData.IP],
                    creatorID: [vm.loginData.account],
                },
            };
            console.log(params);
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
                    vm.togglealertModal(false);
                    vm.settimeoutalertModal();
                    vm.toggleAddModal(false);
                    vm.queryAgain();
                });
        },

        modAction(params) {
            let vm = this;
            const items = params.data;
            console.log(items);
            let checkvalid = ["size", "subSize"];
            for (let i = 0; i < checkvalid.length; i++) {
                console.log(items[checkvalid[i]]);
                if (items[checkvalid[i]] === "") {
                    console.log(items[checkvalid[i]]);
                    vm.setTimeOutAlertMsg("尚有未輸入的值");
                    vm.settimeoutalertModal();
                    return;
                }
                if (!positivenumvalidator(items[checkvalid[i]])) {
                    vm.setTimeOutAlertMsg("數字必須為正整數");
                    vm.settimeoutalertModal();
                    return;
                }
            }
            vm.togglealertModal(true);

            Object.keys(items).map(function (item) {
                if (item != "seq") {
                    items[item] = vm.replaceContentData(
                        String(items[item]),
                        true
                    );
                }
            });

            let apiparams = {};
            apiparams = {
                methods: "PATCH",
                whichFunction: "CommonUpdate",
                table: "storage",
                postdata: {
                    old_seq: [items.seq],
                    species: [items.species],
                    type: [items.type],
                    name: [items.name],
                    size: [items.size],
                    subSize: [items.subSize],
                    note: [items.note],
                    IP: [items.IP],
                },
            };
            vm.setactiveItemsSeq(null);
            console.log(apiparams);
            vm.axiosAction(apiparams)
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
                    //console.log(err);
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    //console.log("done");
                    vm.togglealertModal(false);
                    vm.settimeoutalertModal();
                    vm.queryAgain();
                });
        },

        delAction(params) {
            console.log(params);
            let vm = this;
            const delseq = params.data.seq;
            vm.togglealertModal(true);
            let apiparams = {};
            console.log(delseq);
            apiparams = {
                methods: "DELETE",
                whichFunction: "CommonDelete",
                table: "storage",
                postdata: {
                    seq: [delseq],
                },
            };

            console.log(apiparams);
            vm.axiosAction(apiparams)
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
                    //console.log(err);
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    //console.log("done");
                    vm.togglealertModal(false);
                    vm.settimeoutalertModal();
                    vm.toggleDelModal(false, null);
                    vm.queryAgain();
                });
        },

        getDataList() {
            let vm = this;
            vm.togglealertModal(true);
            let itemsobj = {};
            let temp = [
                {
                    name: "Temp",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "",
                    subSize: 0,
                    species: "NAS",
                    note: "空的",
                    creatorID: 2521,
                    type: "CIFS",
                    createTime: "2020-09-22 18:32:57",
                    seq: 15,
                    size: 0,
                },
                {
                    name: "Sapido_MES",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "",
                    subSize: 0,
                    species: "NAS",
                    note:
                        "Sapido_MES正式區備份，定期每個月15日清理上個月的資料",
                    creatorID: 2521,
                    type: "CIFS",
                    createTime: "2020-09-22 18:32:34",
                    seq: 14,
                    size: 28,
                },
                {
                    name: "Sapido_FTP",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "",
                    subSize: 0,
                    species: "NAS",
                    note: "Administrator@WIN-KORJS10775V的D-disk備份2018",
                    creatorID: 2521,
                    type: "CIFS",
                    createTime: "2020-09-22 18:32:01",
                    seq: 13,
                    size: 258,
                },
                {
                    name: "Sapido_Emaker",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "",
                    subSize: 0,
                    species: "NAS",
                    note:
                        "Sapido_Emaker正式區備份，定期每個月15日清理上個月的資料",
                    creatorID: 2521,
                    type: "CIFS",
                    createTime: "2020-09-22 18:31:30",
                    seq: 12,
                    size: 1070,
                },
                {
                    name: "Ofco_Data",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "",
                    subSize: 0,
                    species: "NAS",
                    note: "已清理",
                    creatorID: 2521,
                    type: "CIFS",
                    createTime: "2020-09-22 18:30:59",
                    seq: 11,
                    size: 0,
                },
                {
                    name: "OFCO",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "",
                    subSize: 0,
                    species: "NAS",
                    note: "2020/1/19上傳的PDM-VM檔",
                    creatorID: 2521,
                    type: "CIFS",
                    createTime: "2020-09-22 18:30:34",
                    seq: 10,
                    size: 8,
                },
                {
                    name: "NetBackup",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "",
                    subSize: 0,
                    species: "NAS",
                    note: "空的",
                    creatorID: 2521,
                    type: "CIFS",
                    createTime: "2020-09-22 18:30:04",
                    seq: 9,
                    size: 0,
                },
                {
                    name: "GitlabBackup",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "",
                    subSize: 0,
                    species: "NAS",
                    note: "已清理",
                    creatorID: 2521,
                    type: "CIFS",
                    createTime: "2020-09-22 18:29:49",
                    seq: 8,
                    size: 0,
                },
                {
                    name: "ESS_Backup",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "",
                    subSize: 0,
                    species: "NAS",
                    note: "ESS易昇備份",
                    creatorID: 2521,
                    type: "CIFS",
                    createTime: "2020-09-22 18:29:04",
                    seq: 7,
                    size: 24,
                },
                {
                    name: "CameoFTP",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "",
                    subSize: 0,
                    species: "NAS",
                    note: "給友勁使用的FTP資料夾",
                    creatorID: 2521,
                    type: "CIFS",
                    createTime: "2020-09-22 18:28:10",
                    seq: 6,
                    size: 0,
                },
                {
                    name: "Amigo_Emaker",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "",
                    subSize: 0,
                    species: "NAS",
                    note:
                        "Amigo_Emaker正式區備份，定期每個月15日清理上個月的資料",
                    creatorID: 2521,
                    type: "CIFS",
                    createTime: "2020-09-22 18:27:25",
                    seq: 5,
                    size: 462,
                },
                {
                    name: "ActiveBackupforBusiness",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "",
                    subSize: 0,
                    species: "NAS",
                    note: "NAS軟體備份的VM檔案",
                    creatorID: 2521,
                    type: "CIFS",
                    createTime: "2020-09-22 18:26:28",
                    seq: 4,
                    size: 325,
                },
                {
                    name: "SQL&nbsp;backup(SQL-Backup)",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "192.168.88.14",
                    subSize: 0,
                    species: "NAS",
                    note: "192.168.88.14，SQL&nbsp;BACKUP",
                    creatorID: 2521,
                    type: "LUN",
                    createTime: "2020-09-22 18:25:24",
                    seq: 3,
                    size: 1500,
                },
                {
                    name: "File&nbsp;server(FILEsvr01)",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "192.168.88.100",
                    subSize: 0,
                    species: "NAS",
                    note: "共用資料夾區",
                    creatorID: 2521,
                    type: "LUN",
                    createTime: "2020-09-22 18:24:37",
                    seq: 2,
                    size: 3000,
                },
                {
                    name: "Log-backup(88-236-log-backup)",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "192.168.99.236",
                    subSize: 0,
                    species: "NAS",
                    note: "存放長榮保全EgsVoice_log、EgsDeviceSet_log",
                    creatorID: 2521,
                    type: "LUN",
                    createTime: "2020-09-22 18:23:38",
                    seq: 1,
                    size: 200,
                },
                {
                    name: "VM&nbsp;storage(88-20-VMStorage)",
                    lastUpdateTime: "2020-09-25 11:20:08",
                    IP: "192.168.88.20",
                    subSize: 0,
                    species: "NAS",
                    note:
                        "含VM(IP-192.168.88.10)長榮保全測試主機及其他儲存資料",
                    creatorID: 2521,
                    type: "LUN",
                    createTime: "2020-09-22 18:22:37",
                    seq: 0,
                    size: 1000,
                },
            ];
            // temp.forEach((element) => {
            vm.queryResponse.forEach((element) => {
                // Object.keys(element).map(function (item) {
                //     //將&nbsp;跟<br/>去除
                //     if (
                //         item != "server$seq" &&
                //         item != "server$status" &&
                //         item != "virtualMachine$seq" &&
                //         item != "virtualMachine$status" &&
                //         item != "virtualMachine$noumenonID"
                //     ) {
                //         element[item] = vm.replaceContentData(
                //             String(element[item]),
                //             false
                //         );
                //     }
                // });
                itemsobj = {
                    seq: element.seq,
                    species: element.species,
                    type: element.type,
                    name: element.name,
                    size: element.size,
                    subSize: element.subSize,
                    note: element.note,
                    IP: element.IP,
                };
                vm.items.push(itemsobj);
            });

            if (vm.tabIndex === 0) {
                vm.fields.splice(7, 1);
            }

            vm.settableDetail({
                items: vm.items,
                fields: vm.fields,
            });
            vm.togglealertModal(false);
        },

        getHeaderSlot(key) {
            return `head(${key})`;
        },

        getCellSlot(key) {
            return `cell(${key})`;
        },

        //紀錄舊的temp item data,若取消編輯可恢復資料
        tempOldItemAction(status, item) {
            console.log(status);
            let vm = this;
            if (status) {
                Object.assign(vm.tempThisOldItem, item);
            } else {
                Object.assign(item, vm.tempThisOldItem);
                vm.tempThisOldItem = {};
            }
            console.log(vm.tempThisOldItem);
        },

        editLongData(row, which, status) {
            let vm = this;
            console.log(row);
            console.log(which);
            console.log(status);
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
                vm.editActionItems.Data = vm.replaceContentData(
                    String(row.item[which]),
                    false
                );
                console.log(vm.editActionItems.Data);
            } else {
                vm.items.filter(function (element) {
                    if (element.seq == vm.editActionItems.seq) {
                        let thisdata = vm.editActionItems.Data;
                        thisdata = vm.replaceContentData(
                            String(thisdata),
                            true
                        );
                        console.log(thisdata);
                        element[vm.editActionItems.which] = thisdata;
                    }
                });
            }
            vm.editActionModalShow = status;
            vm.togglecommonModal(status);
            setTimeout(() => {
                this.$nextTick(() => this.$refs.editlongdata.focus());
            }, 0);
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

        toggleAddModal(status) {
            let vm = this;
            if (status) {
                let commonModalConfig = JSON.parse(
                    JSON.stringify(vm.DEFAULT_commonModalConfig)
                );
                commonModalConfig.size = "xl";
                vm.setcommonModalConfig(commonModalConfig);
            } else {
                vm.setSystemFormCompletedData({});
            }
            vm.addModalShow = status;
            vm.togglecommonModal(status);
        },

        toggleDelModal(status, thisseq) {
            let vm = this;
            if (status) {
                let commonModalConfig = JSON.parse(
                    JSON.stringify(vm.DEFAULT_commonModalConfig)
                );
                commonModalConfig.hideModalHeader = true;
                commonModalConfig.hideModalHeaderClose = true;
                vm.setcommonModalConfig(commonModalConfig);
            }
            vm.delItemSeq = thisseq;
            vm.delModalShow = status;
            vm.togglecommonModal(status);
        },

        removeHeaderFields(params) {
            let vm = this;
            const key = params.data;
            console.log(key);
            console.log(vm.commonTableSlotConfig);
            delete vm.commonTableSlotConfig.slotConfig.key;
            vm.settableSlotConfig(vm.commonTableSlotConfig);

            vm.fields.map((item, index) => {
                if (item.key == key) {
                    vm.fields.splice(index, 1);
                }
            });
            vm.settableDetail({
                items: vm.items,
                fields: vm.fields,
            });
        },

        //資料reset
        reset(keep) {
            console.log(keep.length);
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
h5 {
    margin: 0 auto;
}
.hide {
    display: none;
}
/*刪除圖示*/
.deletefilebtn {
    position: absolute;
    left: -12px;
    top: -12px;
    width: 14px;
    height: 14px;
    background: silver;
    /* background: rgb(88, 85, 85); */
    border-radius: 25px;
    box-shadow: 1px 1px 5px 0px black;
    cursor: pointer;
}
.deletefilebtn:hover {
    background: red;
}
.deletefilebtn:before {
    position: absolute;
    content: "";
    width: 9px;
    height: 3px;
    background: white;
    /* background: rgb(192, 192, 192); */
    transform: rotate(45deg);
    top: 5px;
    left: 2px;
}
.deletefilebtn:after {
    content: "";
    position: absolute;
    width: 9px;
    height: 3px;
    background: white;
    /* background: rgb(192, 192, 192); */
    transform: rotate(-45deg);
    top: 5px;
    left: 2px;
}
</style>
