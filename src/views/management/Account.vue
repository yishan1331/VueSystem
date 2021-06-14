<template>
    <div class="Account container">
        <b-row class="mb-3">
            <b-col sm="3">
                <h4>帳號管理</h4>
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

        <!-- 新增帳號 modal -->
        <modal v-if="addModalShow">
            <template v-slot:modalheader>
                <h5 style="margin: 0 auto">新增帳號</h5>
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

        <!-- 帳號修改 modal -->
        <modal v-if="modModalShow">
            <template v-slot:modalheader>
                <h5 style="margin: 0 auto">帳號修改</h5>
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
                            modModalShow = false;
                            togglecommonModal(false);
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
    name: "Account",
    data() {
        return {
            tabIndex: 0,
            fields: [
                {
                    key: "uID",
                    label: "帳號",
                    sortable: true,
                },
                {
                    key: "uName",
                    label: "姓名",
                    sortable: true,
                },
                {
                    key: "uInfo",
                    label: "使用者介紹",
                    sortable: true,
                },
                {
                    key: "noumenonID",
                    label: "部門",
                    sortable: true,
                },
                {
                    key: "email",
                    label: "公司信箱",
                    sortable: false,
                },
                // {
                //     key: "accessList",
                //     label: "權限列表",
                //     sortable: true,
                // },
                { key: "Action", label: "編輯按鈕", sortable: false },
            ],
            items: [],
            depDetail: [],
            collapseVisible: false,
            modModalShow: false,
            addModalShow: false,
        };
    },
    created: function () {
        this.SetSystemFormSelectOptionsFunc();
        this.SetCommonQueryData();

        //設定modal config
        let commonModalConfig = JSON.parse(
            JSON.stringify(this.DEFAULT_commonModalConfig)
        );
        commonModalConfig.size = "xl";
        commonModalConfig.modalClassFull = true;
        this.setcommonModalConfig(commonModalConfig);
    },
    mounted: function () {
        // this.getAccountList();
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
                vm.reset(["tabIndex", "depDetail"]);
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
                vm.collapseVisible = false;
                vm.getAccountList();
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
                this.reset(["tabIndex", "depDetail", "items"]);
                if (value === 0) this.fields.splice(5, 1);
                this.settableInWhichTab({
                    index: value,
                    which: "user",
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
                console.log(vm.addModalShow);
                console.log(vm.modModalShow);
                var msg = [];
                const regex =
                    /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if (Object.keys(vm.systemFormCompletedData).length != 0) {
                    if (vm.systemFormCompletedData.uID == "") {
                        msg.push("帳號尚未輸入");
                    }
                    if (vm.systemFormCompletedData.noumenonID == "") {
                        msg.push("部門尚未選擇");
                    }
                    if (vm.systemFormCompletedData.pwd == "") {
                        msg.push("密碼尚未輸入");
                    }
                    if (!regex.test(vm.systemFormCompletedData.email)) {
                        msg.push("公司信箱尚未輸入或格式錯誤");
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
                        vm.togglealertModal(true);
                        if (vm.addModalShow) {
                            vm.AccountAdd();
                        } else {
                            vm.AccountMod();
                        }
                    }
                }
            },
        },
    },
    methods: {
        ...mapActions({
            axiosGetAction: "commonaxios/axiosGetAction",
            axiosPostAction: "commonaxios/axiosPostAction",
            axiosPatchAction: "commonaxios/axiosPatchAction",
            axiosDeleteAction: "commonaxios/axiosDeleteAction",
            setTimeOutAlertMsg: "alertmodal/set_setTimeOutAlertMsg",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            togglealertModal: "alertmodal/toggle_alertModal",
            setinputData: "commonquery/set_inputData",
            setapiParams: "commonquery/set_apiParams",
            setconditionOptions: "commonquery/set_conditionOptions",
            queryAgain: "commonquery/do_queryAgain",
            setvforData: "systemform/set_vforData",
            setsystemFormResponse: "systemform/set_systemFormResponse",
            setSystemFormCompletedData: "systemform/set_completedData",
            setSystemFormSelectOptions: "systemform/set_selectOptions",
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
                vforData["uID"] = ["readonly", "帳號", moditemobj.uID];
                vforData["pwd"] = ["text", "密碼", moditemobj.pwd];
                vforData["uName"] = ["text", "姓名", moditemobj.uName];
                vforData["uInfo"] = ["text", "介紹", moditemobj.uInfo];
                vforData["email"] = ["text", "公司信箱", moditemobj.email];
                vforData["noumenonID"] = [
                    "depselect",
                    "部門",
                    moditemobj.noumenonID,
                ];
                vforData["accessList"] = [
                    "accesscheckbox",
                    "使用者權限",
                    moditemobj.accessList,
                ];
                vforData["button"] = ["Mod", "修改"];
            } else {
                vforData["uID"] = ["text", "帳號"];
                vforData["pwd"] = ["text", "密碼"];
                vforData["uName"] = ["text", "姓名"];
                vforData["uInfo"] = ["text", "介紹"];
                vforData["email"] = ["email", "公司信箱"];
                vforData["noumenonID"] = ["depselect", "部門"];
                vforData["accessList"] = ["accesscheckbox", "使用者權限"];
                vforData["button"] = ["Add", "新增"];
            }
            vforData["textclass"] = true;
            console.log(vforData);
            this.setvforData(vforData);
        },

        SetSystemFormSelectOptionsFunc() {
            var vm = this;
            let params = {};
            params["url"] = "api/YS/1.0/my/CommonUse/TableData";
            params["urlparams"] = {
                table: "department",
            };
            let anyerror = false;
            vm.axiosGetAction(params)
                .then(() => {
                    var result = vm.axiosResult;
                    var array = [];
                    if (result.status != 200) {
                        anyerror = true;
                        vm.setTimeOutAlertMsg(result.data);
                        return;
                    }

                    if (result.data["Response"] === "ok") {
                        var depDetail = [];
                        depDetail[0] = {}; //key為depID
                        // depDetail[1] = {}; //key為depName
                        for (
                            var i = 0;
                            i < result.data["QueryTableData"].length;
                            i++
                        ) {
                            var systemformselectoptions = {};
                            depDetail[0][
                                result.data["QueryTableData"][i]["depID"]
                            ] = result.data["QueryTableData"][i]["depName"];
                            // depDetail[1][result.data["QueryTableData"][i]["depName"]] =
                            //     result.data["QueryTableData"][i]["depID"];
                            systemformselectoptions["text"] =
                                result.data["QueryTableData"][i]["depName"];
                            systemformselectoptions["value"] =
                                result.data["QueryTableData"][i]["depID"];
                            systemformselectoptions["accessList"] = JSON.parse(
                                result.data["QueryTableData"][i]["accessList"]
                            );
                            array.push(systemformselectoptions);
                        }
                        console.log(array);
                        vm.setSystemFormSelectOptions(array);
                        console.log(depDetail);
                        vm.depDetail = depDetail;
                        vm.setconditionOptions(array);
                        vm.setTableSlotConfig();
                    } else {
                        anyerror = true;
                        vm.setTimeOutAlertMsg(result.data["Response"]);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    anyerror = true;
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    console.log("done");
                    if (anyerror) vm.settimeoutalertModal();
                });
        },

        SetCommonQueryData() {
            var vm = this;
            var accountqueryselected = "ALL";
            var accountqueryoptions = [
                { value: "uID", text: "帳號" },
                { value: "uName", text: "姓名" },
                { value: "noumenonID", text: "部門編號" },
                { value: "depName", text: "部門名稱" },
                { value: "ALL", text: "全選" },
            ];
            let obj = JSON.parse(JSON.stringify(vm.DEFAULT_inputData));
            obj.options = accountqueryoptions;
            obj.selected = accountqueryselected;
            obj.conversiontable = {
                noumenonID: "部門編號",
                depName: "部門名稱",
                uID: "帳號",
                uName: "姓名",
            };
            vm.setinputData(obj);

            let commonApiParams = JSON.parse(
                JSON.stringify(vm.DEFAULT_apiParams)
            );
            commonApiParams.normal.table = "user";
            vm.setapiParams(commonApiParams);
        },

        setTableSlotConfig() {
            //設定commonTable SlotConfig
            this.settableSlotConfig({
                slotConfig: {
                    uID: {
                        value: "uID",
                        "v-html": true,
                    },
                    uName: {
                        value: "uName",
                        "v-html": true,
                    },
                    uInfo: {
                        value: "uInfo",
                        "v-html": true,
                    },
                    email: {
                        value: "email",
                        "v-html": true,
                    },
                    noumenonID: {
                        value: "uID",
                        conversiontable: this.depDetail[0],
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
                        authority: true,
                        location: "AccountDel",
                        delfield: ["uID"],
                    },
                },
            });
        },

        getAccountList() {
            let vm = this;
            var itemsarray = [];
            vm.queryResponse.forEach((element) => {
                let itemsobj = {};
                itemsobj["uID"] = element["uID"];
                itemsobj["uName"] = element["uName"];
                itemsobj["uInfo"] = element["uInfo"];
                itemsobj["email"] = element["email"];
                itemsobj["noumenonID"] = element["noumenonID"];
                itemsobj["accessList"] = JSON.parse(element["accessList"]);
                itemsarray.push(itemsobj);
            });
            console.log(itemsarray);
            vm.items = itemsarray;
            console.log(vm.items);

            if (vm.tabIndex === 0) {
                vm.fields.splice(5, 1);
            }

            vm.settableDetail({
                items: vm.items,
                fields: vm.fields,
                which: "user",
                children: {},
            });
        },

        toggleAddModal(status) {
            let vm = this;
            if (status) {
                //設定modal config
                let commonModalConfig = JSON.parse(
                    JSON.stringify(this.DEFAULT_commonModalConfig)
                );
                commonModalConfig.size = "xl";
                commonModalConfig.modalClassFull = true;
                vm.setcommonModalConfig(commonModalConfig);
                vm.SetSystemFormData();
            }
            vm.togglecommonModal(status);
            vm.addModalShow = status;
        },

        toggleModModal(params) {
            let vm = this;
            console.log(params);
            //設定modal config
            let commonModalConfig = JSON.parse(
                JSON.stringify(this.DEFAULT_commonModalConfig)
            );
            commonModalConfig.size = "xl";
            commonModalConfig.modalClassFull = true;
            this.setcommonModalConfig(commonModalConfig);

            //two level deep copy
            let thisitemobj = JSON.parse(JSON.stringify(params.data));
            //抓取其密碼
            let apiparams = {};
            apiparams["url"] = "api/YS/1.0/my/CommonUse/Interval/user";
            apiparams["urlparams"] = {
                attr: "uID",
                valueStart: thisitemobj.uID,
                valueEnd: thisitemobj.uID,
            };
            let anyerror = false;
            console.log(apiparams);
            vm.axiosGetAction(apiparams)
                .then(() => {
                    var result = vm.axiosResult;
                    console.log(result);
                    if (result.status != 200) {
                        anyerror = true;
                        vm.setTimeOutAlertMsg(result.data);
                        return;
                    }
                    if (result.data["Response"] === "ok") {
                        var thispwd = result.data["QueryTableData"][0].pwd;
                        thisitemobj["pwd"] = thispwd;
                    } else {
                        anyerror = true;
                        vm.setTimeOutAlertMsg(result.data["Response"]);
                    }
                    console.log(thisitemobj);
                    vm.modModalShow = true;
                    vm.SetSystemFormData(thisitemobj);
                    vm.togglecommonModal(true);
                })
                .catch(function (err) {
                    console.log(err);
                    anyerror = true;
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    console.log("done");
                    if (anyerror) vm.settimeoutalertModal();
                });
        },

        AccountMod() {
            var vm = this;
            let params = {};
            params["url"] = "api/YS/1.0/my/user/update_User";
            params["postdata"] = {
                old_uID: String(vm.systemFormCompletedData.uID),
                new_uID: String(vm.systemFormCompletedData.uID),
                pwd: vm.systemFormCompletedData.pwd,
                uName: String(vm.systemFormCompletedData.uName),
                uInfo: String(vm.systemFormCompletedData.uInfo),
                email: String(vm.systemFormCompletedData.email),
                noumenonType: "dep",
                noumenonID: String(vm.systemFormCompletedData.noumenonID),
                accessList: vm.systemFormCompletedData.accessList,
                creatorID: String(vm.loginData.account),
            };
            console.log(params);
            let success = false;
            vm.axiosPatchAction(params)
                .then(() => {
                    vm.togglealertModal(false);
                    vm.setSystemFormCompletedData({});
                    var result = vm.axiosResult;
                    console.log(result);
                    if (result.status != 200) {
                        vm.setTimeOutAlertMsg(result.data);
                        return;
                    }
                    if (result.data["Response"] === "ok") {
                        vm.setsystemFormResponse();
                        vm.setTimeOutAlertMsg("修改成功");
                        success = true;
                    } else {
                        vm.setTimeOutAlertMsg(result.data["Response"]);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    vm.settimeoutalertModal();
                    vm.modModalShow = false;
                    vm.togglecommonModal(false);
                    if (success) {
                        setTimeout(function () {
                            vm.queryAgain();
                        }, 1200);
                    }
                });
        },

        AccountAdd() {
            var vm = this;
            let params = {};
            params["url"] = "api/YS/1.0/my/user/reg_User";
            params["postdata"] = {
                uID: String(vm.systemFormCompletedData.uID),
                pwd: vm.systemFormCompletedData.pwd,
                uName: String(vm.systemFormCompletedData.uName),
                uInfo: String(vm.systemFormCompletedData.uInfo),
                email: String(vm.systemFormCompletedData.email),
                noumenonType: "dep",
                noumenonID: String(vm.systemFormCompletedData.noumenonID),
                accessList: vm.systemFormCompletedData.accessList,
                creatorID: String(vm.loginData.account),
            };
            console.log(params);
            let success = false;
            vm.axiosPostAction(params)
                .then(() => {
                    vm.togglealertModal(false);
                    var result = vm.axiosResult;
                    console.log(result);
                    vm.setSystemFormCompletedData({});
                    if (result.status != 200) {
                        vm.setTimeOutAlertMsg(result.data);
                        return;
                    }
                    if (result.data["Response"] === "ok") {
                        vm.setsystemFormResponse();
                        vm.setTimeOutAlertMsg("新增成功");
                        success = true;
                    } else {
                        vm.setTimeOutAlertMsg(result.data["Response"]);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    vm.settimeoutalertModal();
                    vm.toggleAddModal(false);
                    vm.SetSystemFormData(null);
                    if (success) {
                        setTimeout(function () {
                            vm.queryAgain();
                        }, 1200);
                    }
                });
        },

        AccountDel(params) {
            var vm = this;
            var apiparams = {};
            apiparams["url"] = "api/YS/1.0/my/user/delete_User";
            apiparams["postdata"] = {
                uID: String(params.data.uID),
            };
            console.log(apiparams);
            vm.togglealertModal(true);
            let success = false;
            vm.axiosDeleteAction(apiparams)
                .then(() => {
                    var result = vm.axiosResult;
                    console.log(result);
                    vm.togglealertModal(false);
                    if (result.status != 200) {
                        vm.setTimeOutAlertMsg(result.data);
                        return;
                    }
                    if (result.data["Response"] === "ok") {
                        vm.setTimeOutAlertMsg("刪除成功");
                        success = true;
                    } else {
                        vm.setTimeOutAlertMsg(result.data["Response"]);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    vm.settimeoutalertModal();
                    vm.SetSystemFormData(null);
                    if (success) {
                        setTimeout(function () {
                            vm.queryAgain();
                        }, 1200);
                    }
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
