<template>
    <div class="Server container">
        <b-row class="mb-3">
            <b-col sm="3">
                <h4>伺服器狀態</h4>
            </b-col>
            <b-col sm="9" class="text-right">
                <b-button pill @click="toggleAddModal(true)" variant="success"
                    >新增</b-button
                >
                <b-button class="ml-1" pill @click="toggleVMListModal(true)"
                    >虛擬機列表</b-button
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
        <b-breadcrumb>
            <b-breadcrumb-item
                v-for="(item, index) in breadcrumbList"
                :key="index"
                :active="item.active"
                @click="breadcrumbClick(item.text, item.active, index)"
                >{{ item.text }}</b-breadcrumb-item
            >
        </b-breadcrumb>
        <b-tabs v-model="tabIndex">
            <b-tab title="查詢" active>
                <h5 v-if="items.length == 0" class="mt-2">查無資料</h5>
                <b-table
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
                                v-if="fields.length > 2"
                                @click.prevent="
                                    removeHeaderFields(key, row.column)
                                "
                            ></div>
                        </div>
                    </template>

                    <template
                        v-slot:[getCellSlot(data)]="row"
                        v-for="(data, key) in slotList"
                    >
                        <div
                            v-if="data == 'status'"
                            :key="String(row.item.seq) + '_' + String(key)"
                        >
                            {{
                                statusConfig[breadcrumbWhich][
                                    String(row.item.status)
                                ]
                            }}
                        </div>
                        <div
                            v-else
                            :key="String(row.item.seq) + '_' + String(key)"
                            v-html="row.item[data]"
                        ></div>
                    </template>

                    <template v-slot:cell(Action)="row">
                        <span
                            v-if="breadcrumbWhich == 'Server'"
                            :id="String(row.item.seq) + '_' + String(row.index)"
                            tabindex="0"
                        >
                            <b-button
                                @click="onRowClicked(row.item)"
                                :disabled="VMItems[row.item.seq].length == 0"
                                >查看VM</b-button
                            >
                            <!-- :disabled="VMItems[row.item.seq].length != 0" -->
                            <b-tooltip
                                :target="
                                    String(row.item.seq) +
                                    '_' +
                                    String(row.index)
                                "
                            >
                                <span v-if="VMItems[row.item.seq].length == 0"
                                    >此Server查無VM</span
                                >
                                <span v-else
                                    >共有{{
                                        VMItems[row.item.seq].length
                                    }}個VM</span
                                >
                            </b-tooltip>
                        </span>
                        <b-button v-else @click="onRowClicked(row.item)"
                            >返回</b-button
                        >
                    </template>
                </b-table>
            </b-tab>
            <b-tab title="編輯">
                <h5 v-if="items.length == 0" class="card-title mt-2">
                    查無資料
                </h5>
                <b-table
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
                    <!-- Yishan 09162020 Dynamic Slot https://stackoverflow.com/questions/58140842/vue-and-bootstrap-vue-dynamically-use-slots/58143362#58143362 -->
                    <template
                        v-slot:[getCellSlot(data)]="row"
                        v-for="(data, key) in slotList"
                    >
                        <template>
                            <div
                                :key="String(row.item.seq) + '_' + String(key)"
                                :class="{
                                    hide: activeItemsSeq == row.item.seq,
                                }"
                            >
                                <span v-if="data == 'status'">{{
                                    statusConfig[breadcrumbWhich][
                                        String(row.item.status)
                                    ]
                                }}</span>
                                <span v-else v-html="row.item[data]"></span>
                            </div>
                        </template>
                        <template>
                            <div
                                :key="String(row.item.seq) + '__' + String(key)"
                                :class="{
                                    hide: activeItemsSeq != row.item.seq,
                                }"
                            >
                                <b-form-checkbox
                                    v-if="data == 'status'"
                                    switch
                                    size="lg"
                                    v-model="row.item.status"
                                ></b-form-checkbox>
                                <b-form-select
                                    v-else-if="data == 'noumenonID'"
                                    v-model="row.item[data]"
                                    :options="serverIDList"
                                ></b-form-select>
                                <b-form-input
                                    v-else
                                    class="input-text"
                                    type="text"
                                    v-model="row.item[data]"
                                    @click="editLongData(row, data, true)"
                                ></b-form-input>
                            </div>
                        </template>
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
                </b-table>
            </b-tab>
        </b-tabs>

        <!-- vm列表modal -->
        <modal v-if="vmListModalShow">
            <template v-slot:modalheader>
                <h5>VM列表</h5>
            </template>
            <template v-slot:default>
                <div v-if="vmList.length == 0" class="d-block text-center">
                    <h3>查無資料</h3>
                </div>
                <b-table
                    v-else
                    sticky-header="650px"
                    responsive
                    :items="vmList"
                    :fields="VMFields"
                    head-variant="light"
                    class="mt-2"
                >
                    <template
                        v-slot:[getCellSlot(data)]="row"
                        v-for="(data, key) in slotList"
                    >
                        <div
                            v-if="data == 'status'"
                            :key="String(row.item.seq) + '_' + String(key)"
                        >
                            {{
                                statusConfig[breadcrumbWhich][
                                    String(row.item.status)
                                ]
                            }}
                        </div>
                        <div
                            v-else
                            :key="String(row.item.seq) + '_' + String(key)"
                            v-html="row.item[data]"
                        ></div>
                    </template>
                </b-table>
            </template>
            <template v-slot:modalfooter>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="toggleVMListModal(false)"
                        >Close</b-button
                    >
                </div>
            </template>
        </modal>

        <!-- 新增事項modal -->
        <modal v-if="addModalShow">
            <template v-slot:modalheader>
                <h5 v-if="addWhich == null">新增</h5>
                <h5 v-else-if="addWhich">新增Server</h5>
                <h5 v-else>新增VM</h5>
            </template>
            <template v-slot:default>
                <div class="text-center" v-if="addWhich == null">
                    <b-button
                        pill
                        class="ml-2"
                        variant="info"
                        @click.prevent="setSystemFormData(true)"
                        >Server</b-button
                    >
                    <b-button
                        pill
                        class="ml-2"
                        variant="primary"
                        @click.prevent="setSystemFormData(false)"
                        >VM</b-button
                    >
                </div>
                <systemForm v-else />
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
                        @click.prevent="delAction(null)"
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
import modal from "@/components/modal.vue";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "Server",
    data() {
        return {
            tabIndex: 0,
            commonqueryCollapseShow: false,
            addModalShow: false,
            delModalShow: false,
            vmListModalShow: false,
            addWhich: null, //true -> Server | false -> VM
            breadcrumbWhich: "Server",
            breadcrumbList: [
                {
                    text: "Server",
                    active: true,
                },
            ],
            statusConfig: {
                Server: {
                    1: "運作中",
                    0: "非運作中",
                },
                VM: { 1: "已開啟電源", 0: "已關閉電源" },
            },
            fields: [],
            items: [],
            slotList: [
                "seq",
                "status",
                "type",
                "manufacturer",
                "model",
                "cpu",
                "memory",
                "HDD",
                "NIC",
                "OS",
                "PM",
                "note",
                "noumenonID",
                "name",
                "provisionedSpace",
                "usedSpace",
                "application",
                "property",
                "installtionService",
                "computerName",
                "systemLocation",
                "privateIP",
                "publicIP",
                "port",
                "DM",
                "remark",
            ],
            serverFields: [
                { key: "seq", label: "編號", sortable: true },
                { key: "status", label: "狀態", sortable: true },
                { key: "type", label: "Type", sortable: true },
                { key: "manufacturer", label: "製造商", sortable: false },
                { key: "model", label: "型號", sortable: false },
                { key: "cpu", label: "CPU", sortable: false },
                { key: "memory", label: "記憶體", sortable: false },
                { key: "HDD", label: "HDD", sortable: false },
                { key: "NIC", label: "網卡", sortable: false },
                { key: "OS", label: "作業系統", sortable: false },
                { key: "PM", label: "實體機", sortable: false },
                { key: "note", label: "Note", sortable: false },
                { key: "Action", label: "Action", sortable: false },
            ],
            serverItems: [],
            VMFields: [
                // { key: "seq", label: "編號", sortable: true },
                { key: "noumenonID", label: "隸屬server編號", sortable: true },
                { key: "name", label: "VM名稱", sortable: false },
                { key: "application", label: "用途", sortable: false },
                { key: "OS", label: "作業系統", sortable: false },
                { key: "privateIP", label: "內部IP", sortable: true },
                { key: "publicIP", label: "對外IP", sortable: true },
                { key: "port", label: "Port", sortable: false },
                { key: "status", label: "狀態", sortable: true },
                {
                    key: "provisionedSpace",
                    label: "佈建的空間",
                    sortable: false,
                },
                { key: "usedSpace", label: "已使用的空間", sortable: false },
                { key: "memory", label: "記憶體", sortable: false },
                { key: "property", label: "性質", sortable: false },
                {
                    key: "installtionService",
                    label: "安裝服務",
                    sortable: false,
                },
                { key: "computerName", label: "電腦名稱", sortable: false },
                { key: "systemLocation", label: "系統位置", sortable: false },
                { key: "DM", label: "Disk保護機制", sortable: false },
                { key: "remark", label: "備註", sortable: false },
                { key: "Action", label: "Action", sortable: false },
            ],
            VMItems: {},
            vmList: [],
            activeItemsSeq: null,
            serverIDList: [],
            thisVMBelong: null,
            delItemSeq: null,
            tempThisOldItem: {},
            editActionModalShow: false,
            editActionItems: {
                seq: null,
                Data: "",
                which: "",
            },
            commonApiParams: {
                type: "join",
                customized: {
                    condition_1: {
                        tables: ["server", "virtualMachine"],
                        fields: "",
                        orderby: "",
                        limit: "",
                        where: "",
                        symbols: "",
                        join: {
                            server: [
                                {
                                    virtualMachine: { seq: "noumenonID" },
                                },
                            ],
                        },
                        jointype: {
                            server_virtualMachine: "left",
                        },
                    },
                },
            },
        };
    },
    created: function () {
        this.setCommonQueryData();
    },
    mounted: function () {
        this.togglealertModal(true);
        this.queryAgain();
    },
    components: {
        commonQuery,
        systemForm,
        modal,
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
            thisSortData: "sort/get_thisSortData",
        }),
    },
    watch: {
        tabIndex: {
            handler(value) {
                this.reset([
                    "tabIndex",
                    "breadcrumbWhich",
                    "breadcrumbList",
                    "serverIDList",
                    "thisVMBelong",
                    // "fields",
                    "items",
                    "serverItems",
                    "VMItems",
                    "vmList",
                ]);
                if (this.breadcrumbWhich === "Server") {
                    this.fields = this.serverFields;
                } else {
                    this.fields = this.VMFields;
                }
                if (value === 1) {
                    this.slotList.splice(0, 1);
                }
                this.$nextTick(() => {
                    //等渲染完畢才執行
                    if (this.items.length != 0) {
                        if (value === 0) {
                            //表格scroll移至最左
                            this.$refs.queryTable.$el.scrollLeft = 0;
                        } else {
                            //表格scroll移至最右
                            this.$refs.editTable.$el.scrollLeft = document.getElementById(
                                "editTable"
                            ).scrollWidth;
                        }
                    }
                });
            },
        },
        systemFormCompletedData: {
            handler() {
                var vm = this;
                console.log(vm.systemFormCompletedData);
                if (Object.keys(vm.systemFormCompletedData).length != 0) {
                    if (vm.addWhich) {
                        vm.togglealertModal(true);
                        vm.serverAdd();
                    } else {
                        console.log(vm.systemFormCompletedData.noumenonID);
                        if (vm.systemFormCompletedData.noumenonID === "") {
                            vm.setTimeOutAlertMsg("未選擇隸屬server編號!!!");
                            vm.settimeoutalertModal();
                            vm.setSystemFormCompletedData({});
                            return;
                        }
                        vm.togglealertModal(true);
                        vm.VMAdd();
                    }
                }
            },
        },
        queryResponse: {
            handler() {
                var vm = this;
                console.log("////////////////////////////");
                vm.reset([
                    "tabIndex",
                    "breadcrumbWhich",
                    "breadcrumbList",
                    "serverIDList",
                    "thisVMBelong",
                ]);
                // // vm.changetableBusy();
                if (
                    vm.queryResponse == "查無資料" ||
                    vm.queryResponse == "時間尚未選擇"
                ) {
                    vm.setTimeOutAlertMsg(vm.queryResponse);
                    vm.settimeoutalertModal();
                    vm.togglealertModal(false);
                    return;
                }
                console.log(vm.queryResponse);
                console.log(JSON.stringify(vm.queryResponse));
                vm.getDataList();
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
            setthisSortData: "sort/set_thisSortData",
        }),

        setSystemFormData(which) {
            console.log(which);
            let vforData = {};
            if (which) {
                vforData["status"] = ["checkbox_switch", "狀態"];
                vforData["type"] = ["text", "Type"];
                vforData["manufacturer"] = ["text", "製造商"];
                vforData["model"] = ["text", "型號"];
                vforData["cpu"] = ["text", "CPU"];
                vforData["memory"] = ["text", "記憶體"];
                vforData["HDD"] = ["text", "HDD"];
                vforData["NIC"] = ["text", "網卡"];
                vforData["OS"] = ["text", "作業系統"];
                vforData["PM"] = ["text", "實體機"];
                vforData["note"] = ["textarea", "Note"];
                vforData["button"] = ["Add", "新增"];
                vforData["textclass"] = false;
            } else {
                vforData["noumenonID"] = ["select", "隸屬server編號"];
                vforData["name"] = ["text", "VM名稱"];
                vforData["status"] = ["checkbox_switch", "狀態"];
                vforData["provisionedSpace"] = ["text", "佈建的空間"];
                vforData["usedSpace"] = ["text", "已使用的空間"];
                vforData["memory"] = ["text", "記憶體"];
                vforData["application"] = ["text", "用途"];
                vforData["property"] = ["text", "性質"];
                vforData["installtionService"] = ["text", "安裝服務"];
                vforData["computerName"] = ["text", "電腦名稱"];
                vforData["OS"] = ["text", "作業系統"];
                vforData["systemLocation"] = ["text", "系統位置"];
                vforData["privateIP"] = ["text", "內部IP"];
                vforData["publicIP"] = ["text", "對外IP"];
                vforData["port"] = ["text", "Port"];
                vforData["DM"] = ["text", "Disk保護機制"];
                vforData["remark"] = ["textarea", "備註"];
                vforData["button"] = ["Add", "新增"];
                vforData["textclass"] = false;
            }
            console.log(vforData);
            this.setvforData(vforData);
            this.addWhich = which;
        },

        setCommonQueryData() {
            var vm = this;
            var serverqueryselected = "ALL";
            var serverqueryoptions = [
                { value: "ALL", text: "Server+VM" },
                { value: "server", text: "Server" },
                { value: "virtualMachine", text: "VM" },
            ];
            let obj = JSON.parse(JSON.stringify(vm.DEFAULT_inputData));
            obj.options = serverqueryoptions;
            obj.selected = serverqueryselected;
            obj.usetime = false;
            vm.setinputData(obj);

            let commonApiParams = JSON.parse(
                JSON.stringify(vm.DEFAULT_apiParams)
            );
            commonApiParams = Object.assign(
                {},
                commonApiParams,
                vm.commonApiParams
            );
            console.log(commonApiParams);
            vm.setapiParams(commonApiParams);
        },

        serverAdd() {
            var vm = this;
            Object.keys(vm.systemFormCompletedData).map(function (item) {
                if (item != "status") {
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
                table: "server",
                postdata: {
                    seq: [""],
                    status: [vm.systemFormCompletedData.status],
                    type: [vm.systemFormCompletedData.type],
                    manufacturer: [vm.systemFormCompletedData.manufacturer],
                    model: [vm.systemFormCompletedData.model],
                    cpu: [vm.systemFormCompletedData.cpu],
                    memory: [vm.systemFormCompletedData.memory],
                    HDD: [vm.systemFormCompletedData.HDD],
                    NIC: [vm.systemFormCompletedData.NIC],
                    OS: [vm.systemFormCompletedData.OS],
                    PM: [vm.systemFormCompletedData.PM],
                    note: [vm.systemFormCompletedData.note],
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
                    console.log("done");
                    vm.togglealertModal(false);
                    vm.settimeoutalertModal();
                    vm.toggleAddModal(false);
                    vm.queryAgain();
                });
        },

        VMAdd() {
            var vm = this;
            Object.keys(vm.systemFormCompletedData).map(function (item) {
                if (item != "status" && item != "noumenonID") {
                    vm.systemFormCompletedData[item] = vm.replaceContentData(
                        String(vm.systemFormCompletedData[item]),
                        true
                    );
                }
            });
            var params = {
                methods: "POST",
                whichFunction: "CommonRegister",
                table: "virtualMachine",
                postdata: {
                    seq: [""],
                    noumenonID: [vm.systemFormCompletedData.noumenonID],
                    name: [vm.systemFormCompletedData.name],
                    status: [vm.systemFormCompletedData.status],
                    provisionedSpace: [
                        vm.systemFormCompletedData.provisionedSpace,
                    ],
                    usedSpace: [vm.systemFormCompletedData.usedSpace],
                    memory: [vm.systemFormCompletedData.memory],
                    application: [vm.systemFormCompletedData.application],
                    property: [vm.systemFormCompletedData.property],
                    installtionService: [
                        vm.systemFormCompletedData.installtionService,
                    ],
                    computerName: [vm.systemFormCompletedData.computerName],
                    OS: [vm.systemFormCompletedData.OS],
                    systemLocation: [vm.systemFormCompletedData.systemLocation],
                    privateIP: [vm.systemFormCompletedData.privateIP],
                    publicIP: [vm.systemFormCompletedData.publicIP],
                    port: [vm.systemFormCompletedData.port],
                    DM: [vm.systemFormCompletedData.DM],
                    remark: [vm.systemFormCompletedData.remark],
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
                    console.log("done");
                    vm.togglealertModal(false);
                    vm.settimeoutalertModal();
                    vm.toggleAddModal(false);
                    vm.queryAgain();
                });
        },

        modAction(items) {
            let vm = this;
            vm.togglealertModal(true);
            console.log(items);
            Object.keys(items).map(function (item) {
                if (item != "seq" && item != "status" && item != "noumenonID") {
                    items[item] = vm.replaceContentData(
                        String(items[item]),
                        true
                    );
                }
            });

            let params = {};
            if (vm.breadcrumbWhich == "Server") {
                params = {
                    methods: "PATCH",
                    whichFunction: "CommonUpdate",
                    table: "server",
                    postdata: {
                        old_seq: [items.seq],
                        status: [items.status],
                        type: [items.type],
                        manufacturer: [items.manufacturer],
                        model: [items.model],
                        cpu: [items.cpu],
                        memory: [items.memory],
                        HDD: [items.HDD],
                        NIC: [items.NIC],
                        OS: [items.OS],
                        PM: [items.PM],
                        note: [items.note],
                    },
                };
            } else {
                params = {
                    methods: "PATCH",
                    whichFunction: "CommonUpdate",
                    table: "virtualMachine",
                    postdata: {
                        old_seq: [items.seq],
                        noumenonID: [items.noumenonID],
                        name: [items.name],
                        status: [items.status],
                        provisionedSpace: [items.provisionedSpace],
                        usedSpace: [items.usedSpace],
                        memory: [items.memory],
                        application: [items.application],
                        property: [items.property],
                        installtionService: [items.installtionService],
                        computerName: [items.computerName],
                        OS: [items.OS],
                        systemLocation: [items.systemLocation],
                        privateIP: [items.privateIP],
                        publicIP: [items.publicIP],
                        port: [items.port],
                        DM: [items.DM],
                        remark: [items.remark],
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

        delAction(apiparams) {
            let vm = this;
            let params = {};
            vm.togglealertModal(true);
            if (apiparams != null) {
                params = apiparams;
            } else {
                console.log(vm.delItemSeq);
                if (vm.breadcrumbWhich == "Server") {
                    let thisserverchildvm = vm.VMItems[String(vm.delItemSeq)];
                    params = {
                        methods: "DELETE",
                        whichFunction: "CommonDelete",
                        table: "server",
                        postdata: {
                            seq: [vm.delItemSeq],
                        },
                    };
                    if (thisserverchildvm.length != 0) {
                        //刪除隸屬此server的所有VM
                        const delvmdata = thisserverchildvm.map(
                            (itemsdata) => itemsdata.seq
                        );
                        console.log(delvmdata);
                        vm.delAction({
                            methods: "DELETE",
                            whichFunction: "CommonDelete",
                            table: "virtualMachine",
                            postdata: {
                                seq: delvmdata,
                            },
                        });
                    }
                } else {
                    params = {
                        methods: "DELETE",
                        whichFunction: "CommonDelete",
                        table: "virtualMachine",
                        postdata: {
                            seq: [vm.delItemSeq],
                        },
                    };
                }
            }

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
            let serveritems = {};
            let serverIDList = [];
            let vmitems = {};
            let vmList = [];
            console.log(vmitems);
            console.log(serveritems);
            vm.togglealertModal(true);
            vm.queryResponse.forEach((element) => {
                // console.log(element);
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

                if (
                    !Object.keys(serveritems).includes(
                        String(element["server$seq"])
                    )
                ) {
                    console.log(element["server$status"]);
                    let itemsobj = {
                        seq: element["server$seq"],
                        status: element["server$status"],
                        type: element["server$type"],
                        manufacturer: element["server$manufacturer"],
                        model: element["server$model"],
                        cpu: element["server$cpu"],
                        memory: element["server$memory"],
                        HDD: element["server$HDD"],
                        NIC: element["server$NIC"],
                        OS: element["server$OS"],
                        PM: element["server$PM"],
                        note: element["server$note"],
                    };
                    serveritems[String(element["server$seq"])] = itemsobj;
                    serverIDList.push(element["server$seq"]); //抓所有server的seq給VM放隸屬編號
                    vmitems[String(element["server$seq"])] = [];
                }

                //去掉有些server尚未有vm的資料(sql join語法會給null)
                if (element["virtualMachine$seq"] != null) {
                    let itemsobj2 = {
                        seq: element["virtualMachine$seq"],
                        noumenonID: element["virtualMachine$noumenonID"],
                        name: element["virtualMachine$name"],
                        status: element["virtualMachine$status"],
                        provisionedSpace:
                            element["virtualMachine$provisionedSpace"],
                        usedSpace: element["virtualMachine$usedSpace"],
                        memory: element["virtualMachine$memory"],
                        application: element["virtualMachine$application"],
                        property: element["virtualMachine$property"],
                        installtionService:
                            element["virtualMachine$installtionService"],
                        computerName: element["virtualMachine$computerName"],
                        OS: element["virtualMachine$OS"],
                        systemLocation:
                            element["virtualMachine$systemLocation"],
                        privateIP: element["virtualMachine$privateIP"],
                        publicIP: element["virtualMachine$publicIP"],
                        port: element["virtualMachine$port"],
                        DM: element["virtualMachine$DM"],
                        remark: element["virtualMachine$remark"],
                    };
                    vmitems[String(element["server$seq"])].push(itemsobj2);
                    vmList.push(itemsobj2);
                }
            });

            console.log(serverIDList);
            serverIDList.sort((a, b) => {
                return a - b;
            });
            console.log(serveritems);
            console.log(vmitems);
            console.log(Object.values(vmitems));

            Object.values(vmitems).forEach((element) => {
                vm.setthisSortData({
                    data: element,
                    sortKey: [["privateIP", "asc"]],
                });
            });
            console.log(vmitems);

            vm.serverItems = JSON.parse(
                JSON.stringify(Object.values(serveritems))
            );
            vm.VMItems = JSON.parse(JSON.stringify(vmitems));

            vm.setSystemFormSelectOptions(serverIDList); //丟入systemFrom當下拉式選單
            vm.serverIDList = serverIDList;
            console.log(vm.serverIDList);

            console.log(vmList);
            vm.setthisSortData({
                data: vmList,
                sortKey: [["noumenonID", "asc"]],
            });
            vm.vmList = JSON.parse(JSON.stringify(vmList));

            console.log(vm.thisVMBelong);
            if (vm.breadcrumbWhich == "Server") {
                vm.items = vm.serverItems;
                vm.fields = vm.serverFields;
            } else {
                vm.items = vm.VMItems[String(vm.thisVMBelong)];
                if (this.tabIndex === 0) {
                    vm.VMFields.splice(0, 1);
                    if (vm.slotList.indexOf("noumenonID") != -1)
                        vm.slotList.splice(
                            vm.slotList.indexOf("noumenonID"),
                            1
                        );
                }
                vm.fields = vm.VMFields;
            }
            vm.togglealertModal(false);
        },

        onRowClicked(items) {
            var vm = this;
            if (vm.breadcrumbWhich == "Server") {
                console.log(items);
                let thisseq = items.seq;
                vm.thisVMBelong = thisseq;
                console.log(thisseq);
                console.log(vm.VMItems[String(thisseq)]);
                vm.items = vm.VMItems[String(thisseq)];

                vm.VMFields.splice(0, 1);
                if (vm.slotList.indexOf("noumenonID") != -1)
                    vm.slotList.splice(vm.slotList.indexOf("noumenonID"), 1);

                vm.fields = vm.VMFields;
                vm.breadcrumbList[0]["active"] = false;
                vm.breadcrumbList[0]["text"] = "Server_" + thisseq;
                vm.breadcrumbList.push({ text: "VM", active: true });
                vm.breadcrumbWhich = "VM";
            } else {
                vm.items = vm.serverItems;
                vm.fields = vm.serverFields;
                vm.breadcrumbList[0]["active"] = true;
                vm.breadcrumbList[0]["text"] = "Server";
                vm.breadcrumbList.splice(1, 1);
                vm.breadcrumbWhich = "Server";
                vm.thisVMBelong = null;
            }
            this.$nextTick(() => {
                //表格scroll移至最左
                this.$refs.queryTable.$el.scrollLeft = 0;
            });
        },

        breadcrumbClick(item, active, index) {
            let vm = this;
            console.log(item, active, index);
            if (item.split("_")[0] == "Server") {
                vm.items = vm.serverItems;
                vm.fields = vm.serverFields;
                vm.breadcrumbList[0]["active"] = true;
                vm.breadcrumbList[0]["text"] = "Server";
                vm.breadcrumbList.splice(1, 1);
                vm.breadcrumbWhich = "Server";
                vm.thisVMBelong = null;
                this.$nextTick(() => {
                    //表格scroll移至最左
                    this.$refs.queryTable.$el.scrollLeft = 0;
                });
            }
        },

        rowClass(item, type) {
            if (!item || type !== "row") return;
            if (item.status)
                return { style: "background-color:rgba(0, 0, 0, 0.144)" };
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
            console.log(item.status);
            let vm = this;
            if (status) {
                if (item.status === 1) {
                    item.status = true;
                } else {
                    item.status = false;
                }
                Object.assign(vm.tempThisOldItem, item);
            } else {
                if (vm.tempThisOldItem.status) {
                    vm.tempThisOldItem.status = 1;
                } else {
                    vm.tempThisOldItem.status = 0;
                }
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
            if (status) {
                setTimeout(() => {
                    this.$nextTick(() => this.$refs.editlongdata.focus());
                }, 0);
            }
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
                vm.addWhich = null;
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

        toggleVMListModal(status) {
            let vm = this;
            console.log(status);
            vm.reset([
                "tabIndex",
                "breadcrumbWhich",
                "breadcrumbList",
                "serverIDList",
                "thisVMBelong",
                "fields",
                "items",
                "serverItems",
                "VMItems",
                "vmList",
                "slotList",
            ]);
            if (status) {
                let commonModalConfig = JSON.parse(
                    JSON.stringify(vm.DEFAULT_commonModalConfig)
                );
                commonModalConfig.size = "xl";
                // commonModalConfig.centered = false;
                commonModalConfig.modalClassFull = true;
                console.log(commonModalConfig);
                vm.setcommonModalConfig(commonModalConfig);
                vm.VMFields.splice(17, 1);
            }
            vm.vmListModalShow = status;
            vm.togglecommonModal(status);
        },

        removeHeaderFields(key, column) {
            console.log(key);
            console.log(column);
            let thisindex = null;
            this.fields.map(function (item, index) {
                if (item.key == column) thisindex = index;
            });
            console.log(thisindex);
            this.fields.splice(thisindex, 1);
            this.slotList.splice(this.slotList.indexOf(column), 1);
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
