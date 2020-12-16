<template>
    <div class="Department container">
        <b-row class="mb-3">
            <b-col sm="3">
                <h4>部門管理</h4>
            </b-col>
            <b-col sm="9" class="text-right">
                <div style="opacity: 0.5">
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
            </b-col>
        </b-row>
        <b-collapse v-model="collapseVisible">
            <b-row>
                <b-col sm="10">
                    <commonQuery />
                </b-col>
                <b-col sm="2">
                    <div class="text-right">
                        <b-button
                            pill
                            variant="success"
                            @click="toggleAddModal(true)"
                            >新增</b-button
                        >
                    </div>
                </b-col>
            </b-row>
        </b-collapse>

        <b-tabs v-model="tabIndex">
            <b-tab title="查詢" active>
                <h5 v-if="items.length == 0" class="card-title mt-2">
                    查無資料
                </h5>
                <commonTable v-else></commonTable>
            </b-tab>
            <b-tab title="編輯">
                <h5 v-if="items.length == 0" class="card-title mt-2">
                    查無資料
                </h5>
                <commonTable v-else></commonTable>
            </b-tab>
        </b-tabs>

        <!-- 新增部門 modal -->
        <modal v-if="addModalShow">
            <template v-slot:modalheader>
                <h5 style="margin: 0 auto">新增部門</h5>
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
                        @click.prevent="
                            toggleAddModal(false);
                            resetSystemForm();
                        "
                        >Close</b-button
                    >
                </div>
            </template>
        </modal>

        <!-- 部門修改modal -->
        <modal v-if="modModalShow">
            <template v-slot:modalheader>
                <h5 style="margin: 0 auto">部門修改</h5>
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
                        @click.prevent="
                            togglecommonModal(false);
                            modModalShow = false;
                            resetSystemForm();
                        "
                        >Close</b-button
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
export default {
    name: "Department",
    data() {
        return {
            tabIndex: 0,
            fields: [
                {
                    key: "depID",
                    label: "部門編號",
                    sortable: true,
                },
                {
                    key: "depName",
                    label: "部門名稱",
                    sortable: true,
                },
                {
                    key: "depInfo",
                    label: "部門介紹",
                    sortable: true,
                },
                // {
                //     key: "accessList",
                //     label: "權限列表",
                //     sortable: true,
                // },
                { key: "Action", label: "編輯按鈕", sortable: false },
            ],
            items: [],
            modDepartmentModalShow: false,
            delDepartmentModalShow: false,
            collapseVisible: false,
            modModalShow: false,
            addModalShow: false,
        };
    },
    created: function () {
        this.SetSystemFormData(null);
        this.SetDepDetail();
        this.SetCommonQueryData();

        //設定modal config
        let commonModalConfig = JSON.parse(
            JSON.stringify(this.DEFAULT_commonModalConfig)
        );
        commonModalConfig.size = "xl";
        commonModalConfig.modalClassFull = true;
        this.setcommonModalConfig(commonModalConfig);

        //設定commonTable SlotConfig
        this.settableSlotConfig({
            slotConfig: {
                depID: {
                    value: "depID",
                    "v-html": true,
                },
                depName: {
                    value: "depName",
                    "v-html": true,
                },
                depInfo: {
                    value: "depInfo",
                    "v-html": true,
                },
            },
            selectable: false,
            actionConfig: {
                edit: {
                    authority: true,
                    type: "modal",
                    location: "toggleModModal",
                    goback: true,
                },
                del: {
                    authority: false,
                    // location: "AccountDel",
                    // delfield: ["uID"],
                },
            },
        });
    },
    mounted: function () {
        // this.getDepList();
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
            DEFAULT_inputData: "commonquery/get_DEFAULT_inputData",
            DEFAULT_apiParams: "commonquery/get_DEFAULT_apiParams",
            systemFormCompletedData: "systemform/get_completedData",
            DEFAULT_commonModalConfig: "usemodal/get_DEFAULT_commonModalConfig",
            tableResponse: "commontable/get_tableResponse",
        }),
    },
    watch: {
        queryResponse: {
            handler() {
                var vm = this;
                vm.reset(["tabIndex"]);
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
                vm.collapseVisible = false;
                vm.getDepList();
            },
        },

        tableResponse: {
            handler() {
                let vm = this;
                console.log(vm.tableResponse);
                vm[vm.tableResponse.function](vm.tableResponse.params);
            },
        },

        tabIndex: {
            handler(value) {
                console.log(value);
                this.reset(["tabIndex", "items"]);
                if (value === 0) this.fields.splice(3, 1);
                this.settableInWhichTab({
                    index: value,
                    which: "department",
                });
                this.settableDetail({
                    items: this.items,
                    fields: this.fields,
                });
            },
        },

        systemFormCompletedData: {
            handler() {
                var vm = this;
                console.log(vm.systemFormCompletedData);
                var msg = [];
                if (Object.keys(vm.systemFormCompletedData).length != 0) {
                    if (vm.systemFormCompletedData.depID == "") {
                        msg.push("部門編號尚未輸入");
                    }
                    //權限設定檢查
                    if (
                        vm.systemFormCompletedData.accessList.report.authority
                    ) {
                        if (
                            vm.systemFormCompletedData.accessList.report
                                .children.todolist.authority &&
                            vm.systemFormCompletedData.accessList.report
                                .children.todolist.remark.commonQueryCondition
                                .main === null
                        ) {
                            msg.push("權限:『待辦事項』需選擇指定部門");
                        }
                        if (
                            vm.systemFormCompletedData.accessList.report
                                .children.weeklyreport.authority &&
                            vm.systemFormCompletedData.accessList.report
                                .children.weeklyreport.remark
                                .commonQueryCondition.main === null
                        ) {
                            msg.push("權限:『工作週報』需選擇指定部門");
                        }
                        if (
                            vm.systemFormCompletedData.accessList.report
                                .children.meetingminutes.authority
                        ) {
                            if (
                                vm.systemFormCompletedData.accessList.report
                                    .children.meetingminutes.remark
                                    .commonQueryCondition.main.length === 0
                            ) {
                                msg.push("權限:『會議記錄』需選擇指定查詢條件");
                            }
                            if (
                                vm.systemFormCompletedData.accessList.report
                                    .children.meetingminutes.remark
                                    .commonQueryCondition.secondary === null
                            ) {
                                msg.push("權限:『會議記錄』需選擇指定員工階級");
                            }
                            if (
                                vm.systemFormCompletedData.accessList.report
                                    .children.meetingminutes.remark
                                    .dataHandleAuthority.length === 0
                            ) {
                                msg.push("權限:『會議記錄』需選擇指定執行權限");
                            } else if (
                                !vm.systemFormCompletedData.accessList.report.children.meetingminutes.remark.dataHandleAuthority.includes(
                                    "query"
                                )
                            ) {
                                msg.push(
                                    "權限:『會議記錄』- 指定執行權限至少要有查詢"
                                );
                            }
                        }
                    }
                    console.log(msg);
                    if (msg.length != 0) {
                        vm.setTimeOutAlertMsg(msg);
                        vm.settimeoutalertModal(1200);
                        vm.setSystemFormCompletedData({});
                        return;
                    } else {
                        if (vm.addModalShow) {
                            vm.DepAdd();
                        } else {
                            vm.DepMod();
                        }
                    }
                }
            },
        },
    },
    methods: {
        ...mapActions({
            axiosAction: "commonaxios/axiosAction",
            setTimeOutAlertMsg: "alertmodal/set_setTimeOutAlertMsg",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            setinputData: "commonquery/set_inputData",
            setapiParams: "commonquery/set_apiParams",
            setconditionOptions: "commonquery/set_conditionOptions",
            queryAgain: "commonquery/do_queryAgain",
            setvforData: "systemform/set_vforData",
            setsystemFormResponse: "systemform/set_systemFormResponse",
            setSystemFormCompletedData: "systemform/set_completedData",
            togglecommonModal: "usemodal/toggle_commonModal",
            setcommonModalConfig: "usemodal/set_commonModalConfig",
            settableSlotConfig: "commontable/set_tableSlotConfig",
            settableDetail: "commontable/set_tableDetail",
            settableInWhichTab: "commontable/set_tableInWhichTab",
        }),
        SetSystemFormData(moditemobj) {
            let vm = this;
            var vforData = {};
            console.log(vm.modModalShow);
            if (vm.modModalShow) {
                vforData["depID"] = ["readonly", "部門編號", moditemobj.depID];
                vforData["depName"] = ["text", "部門名稱", moditemobj.depName];
                vforData["depInfo"] = ["text", "部門介紹", moditemobj.depInfo];
                vforData["accessList"] = [
                    "accesscheckbox",
                    "部門權限",
                    moditemobj.accessList,
                ];
                vforData["button"] = ["Mod", "修改"];
            } else {
                vforData["depID"] = ["text", "部門編號"];
                vforData["depName"] = ["text", "部門名稱"];
                vforData["depInfo"] = ["text", "部門介紹"];
                vforData["accessList"] = ["accesscheckbox", "部門權限"];
                vforData["button"] = ["Add", "新增"];
            }
            vforData["textclass"] = true;
            console.log(vforData);
            vm.setvforData(vforData);
        },

        SetCommonQueryData() {
            var vm = this;
            var departmentqueryselected = "ALL";
            var departmentqueryoptions = [
                { value: "depID", text: "部門編號" },
                { value: "depName", text: "部門名稱" },
                { value: "ALL", text: "全選" },
            ];
            let obj = JSON.parse(JSON.stringify(vm.DEFAULT_inputData));
            obj.options = departmentqueryoptions;
            obj.selected = departmentqueryselected;
            obj.conversiontable = {
                depID: "部門編號",
                depName: "部門名稱",
            };
            vm.setinputData(obj);

            let commonApiParams = JSON.parse(
                JSON.stringify(vm.DEFAULT_apiParams)
            );
            commonApiParams.normal.table = "department";
            vm.setapiParams(commonApiParams);
        },

        getDepList() {
            let vm = this;
            var itemsarray = [];
            let temp = [
                {
                    depInfo: "雲端AI(智慧)平台部",
                    lastUpdateTime: "2020-10-16 17:38:02",
                    noumenonType: "",
                    dbName: "sapidoSystem",
                    accessList: {
                        report: {
                            children: {
                                meetingminutes: {
                                    remark: {
                                        commonQueryCondition: {
                                            main: [],
                                            secondary: null,
                                        },
                                        dataHandleAuthority: [],
                                    },
                                    authority: false,
                                },
                                sop: {
                                    remark: {
                                        commonQueryCondition: {
                                            main: null,
                                            secondary: null,
                                        },
                                        dataHandleAuthority: [],
                                    },
                                    authority: false,
                                },
                                weeklyreport: {
                                    remark: {
                                        commonQueryCondition: { main: null },
                                    },
                                    authority: false,
                                },
                                todolist: {
                                    remark: {
                                        commonQueryCondition: { main: null },
                                    },
                                    authority: false,
                                },
                            },
                            authority: false,
                        },
                        management: {
                            children: {
                                department: { authority: false },
                                account: { authority: false },
                            },
                            authority: false,
                        },
                        architecture: {
                            children: {
                                storage: { authority: true },
                                structure: { authority: true },
                                server: { authority: true },
                            },
                            authority: true,
                        },
                        bulletin: {
                            children: {
                                manage: { authority: true },
                                board: { authority: true },
                            },
                            authority: true,
                        },
                    },
                    noumenonID: "",
                    creatorID: 2493,
                    depName: "雲端AI(智慧)平台部",
                    depID: 1003,
                    createTime: "2020-04-07 11:23:10",
                },
                {
                    depInfo: "",
                    lastUpdateTime: "2020-10-16 17:09:00",
                    noumenonType: "",
                    dbName: "",
                    accessList: {
                        report: {
                            children: {
                                meetingminutes: {
                                    remark: {
                                        commonQueryCondition: {
                                            main: ["1003"],
                                            secondary: [],
                                        },
                                        dataHandleAuthority: ["query"],
                                    },
                                    authority: true,
                                },
                                sop: {
                                    remark: {
                                        commonQueryCondition: {
                                            main: [],
                                            secondary: [],
                                        },
                                        dataHandleAuthority: ["query"],
                                    },
                                    authority: true,
                                },
                                weeklyreport: {
                                    remark: {
                                        commonQueryCondition: { main: [] },
                                    },
                                    authority: true,
                                },
                                todolist: {
                                    remark: {
                                        commonQueryCondition: { main: [] },
                                    },
                                    authority: true,
                                },
                            },
                            authority: true,
                        },
                        management: {
                            children: {
                                department: { authority: false },
                                account: { authority: false },
                            },
                            authority: false,
                        },
                        architecture: {
                            children: {
                                storage: { authority: false },
                                structure: { authority: false },
                                server: { authority: false },
                            },
                            authority: false,
                        },
                        bulletin: {
                            children: {
                                manage: { authority: true },
                                board: { authority: true },
                            },
                            authority: true,
                        },
                    },
                    noumenonID: "",
                    creatorID: "admin",
                    depName: "test",
                    depID: "test",
                    createTime: "2020-10-16 17:04:16",
                },
            ];
            // temp.forEach((element) => {
            vm.queryResponse.forEach((element) => {
                let itemsobj = {};
                itemsobj["depID"] = element["depID"];
                itemsobj["depName"] = element["depName"];
                itemsobj["depInfo"] = element["depInfo"];
                itemsobj["accessList"] = element["accessList"];
                itemsarray.push(itemsobj);
            });
            console.log(itemsarray);
            vm.items = itemsarray;
            console.log(vm.items);

            if (vm.tabIndex === 0) {
                vm.fields.splice(3, 1);
            }

            vm.settableDetail({
                items: vm.items,
                fields: vm.fields,
                which: "department",
                children: {},
            });
        },

        SetDepDetail() {
            var vm = this;
            var params = {};
            params["methods"] = "GET";
            params["whichFunction"] = "CommonSimpleQuery";
            params["category"] = "systemformselectoptions";
            params["table"] = "department";
            vm.axiosAction(params).then(() => {
                var result = vm.axiosResult;
                var array = [];
                if (result["Response"] == "ok") {
                    var depDetail = [];
                    for (var i = 0; i < result["QueryTableData"].length; i++) {
                        let obj = {};
                        obj["text"] = result["QueryTableData"][i]["depName"];
                        obj["value"] = result["QueryTableData"][i]["depName"];
                        depDetail.push(obj);
                    }
                    console.log(JSON.stringify(depDetail));
                    vm.setconditionOptions(depDetail);
                } else {
                    vm.setTimeOutAlertMsg(result["Response"]);
                    vm.settimeoutalertModal();
                }
            });

            // vm.setconditionOptions([
            //     { text: "資訊通訊部", value: "資訊通訊部" },
            //     { text: "系統研發部", value: "系統研發部" },
            //     { text: "雲端AI(智慧)平台部", value: "雲端AI(智慧)平台部" },
            //     { text: "工程課", value: "工程課" },
            //     { text: "生管課", value: "生管課" },
            //     { text: "行政總務課", value: "行政總務課" },
            //     { text: "品管課", value: "品管課" },
            //     { text: "採購課", value: "採購課" },
            //     { text: "清潔人員", value: "清潔人員" },
            //     { text: "智能製造事業處", value: "智能製造事業處" },
            //     { text: "董事長室", value: "董事長室" },
            //     { text: "打件課", value: "打件課" },
            //     { text: "組裝課", value: "組裝課" },
            //     { text: "警衛室", value: "警衛室" },
            //     { text: "人資課", value: "人資課" },
            //     { text: "業務課", value: "業務課" },
            //     { text: "產品企劃行銷課", value: "產品企劃行銷課" },
            //     { text: "代工事業處", value: "代工事業處" },
            //     { text: "長榮專案組", value: "長榮專案組" },
            //     { text: "test", value: "test" },
            // ]);
        },

        toggleAddModal(status) {
            let vm = this;
            if (status) {
                vm.SetSystemFormData();
            }
            vm.togglecommonModal(status);
            vm.addModalShow = status;
        },

        toggleModModal(params) {
            let vm = this;
            console.log(params);
            //two level deep copy
            let thisitemobj = JSON.parse(JSON.stringify(params.data));

            console.log(thisitemobj);
            vm.modModalShow = true;
            vm.SetSystemFormData(thisitemobj);
            vm.togglecommonModal(true);
        },

        DepMod() {
            var vm = this;
            var params = {};
            params["methods"] = "PATCH";
            params["whichFunction"] = "DepartmentMod";
            params["depID"] = String(vm.systemFormCompletedData.depID);
            params["depName"] = String(vm.systemFormCompletedData.depName);
            params["depInfo"] = String(vm.systemFormCompletedData.depInfo);
            params["accessList"] = JSON.stringify(
                vm.systemFormCompletedData.accessList
            );
            console.log(params);
            vm.axiosAction(params)
                .then(() => {
                    vm.setSystemFormCompletedData({});
                    var result = vm.axiosResult;
                    console.log(result);
                    var msg = "";
                    if (result["Response"] == "ok") {
                        vm.setsystemFormResponse();
                        msg = "修改成功";
                    } else {
                        msg = result["Response"];
                    }
                    vm.setTimeOutAlertMsg(msg);
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    vm.settimeoutalertModal();
                    vm.modModalShow = false;
                    vm.togglecommonModal(false);
                    vm.queryAgain();
                });
        },

        DepAdd() {
            var vm = this;
            var params = {};
            params["methods"] = "POST";
            params["whichFunction"] = "DepartmentAdd";
            params["depID"] = String(vm.systemFormCompletedData.depID);
            params["depName"] = String(vm.systemFormCompletedData.depName);
            params["accessList"] = JSON.stringify(
                vm.systemFormCompletedData.accessList
            );
            params["depInfo"] = String(vm.systemFormCompletedData.depInfo);
            params["creatorID"] = String(vm.loginData.account);
            console.log(params);
            vm.axiosAction(params)
                .then(() => {
                    vm.setSystemFormCompletedData({});
                    var result = vm.axiosResult;
                    var msg = "";
                    if (result["Response"] == "ok") {
                        vm.setsystemFormResponse();
                        msg = "新增成功";
                    } else {
                        msg = result["Response"];
                    }
                    vm.setTimeOutAlertMsg(msg);
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    vm.settimeoutalertModal();
                    vm.toggleAddModal(false);
                    vm.SetSystemFormData(null);
                    vm.queryAgain();
                });
        },

        resetSystemForm() {
            let vm = this;
            vm.SetSystemFormData(null);
            vm.setsystemFormResponse();
            vm.setSystemFormCompletedData({});
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
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.custom-select {
    width: 200px !important;
}
#input-title {
    width: 200px !important;
}
.formtitlewrong,
.formcontentwrong {
    border: 1px solid red;
}
h5 {
    margin: 0 auto;
}
/*關閉圖示*/
.close {
    position: absolute;
    left: -10px;
    top: -15px;
    width: 25px;
    height: 25px;
    background: silver;
    border-radius: 25px;
    box-shadow: 2px 2px 5px 0px black;
    cursor: pointer;
}
.close:hover {
    background: red;
}
.close:before {
    position: absolute;
    content: "";
    width: 15px;
    height: 5px;
    background: white;
    transform: rotate(45deg);
    top: 10px;
    left: 5px;
}
.close:after {
    content: "";
    position: absolute;
    width: 15px;
    height: 5px;
    background: white;
    transform: rotate(-45deg);
    top: 10px;
    left: 5px;
}
</style>

