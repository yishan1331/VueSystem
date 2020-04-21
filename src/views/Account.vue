<template>
    <div class="Account container">
        <h4>帳號管理</h4>
        <commonQuery v-if="tabIndex != 0" />
        <b-card no-body>
            <b-tabs card v-model="tabIndex">
                <b-tab title="新增" active>
                    <systemForm />
                </b-tab>
                <b-tab title="修改">
                    <h5 class="card-title" v-if="items.length == 0">選擇查詢條件</h5>
                    <b-table
                        sticky-header="430px"
                        responsive
                        hover
                        :busy="tableBusy"
                        :items="items"
                        :fields="fields"
                        @row-clicked="onRowClicked"
                        head-variant="light"
                        v-if="items.length != 0"
                    >
                        <template v-slot:table-busy>
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Loading...</strong>
                            </div>
                        </template>
                    </b-table>
                </b-tab>
                <b-tab title="刪除">
                    <h5 class="card-title" v-if="items.length == 0">選擇查詢條件</h5>
                    <b-table
                        sticky-header="430px"
                        responsive
                        hover
                        :busy="tableBusy"
                        :items="items"
                        :fields="fields"
                        @row-clicked="onRowClicked"
                        head-variant="light"
                        v-if="items.length != 0"
                    >
                        <template v-slot:table-busy>
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Loading...</strong>
                            </div>
                        </template>
                    </b-table>
                </b-tab>
                <b-tab title="查詢">
                    <h5 class="card-title" v-if="items.length == 0">選擇查詢條件</h5>
                    <b-table
                        sticky-header="430px"
                        responsive
                        hover
                        :busy="tableBusy"
                        :items="items"
                        :fields="fields"
                        head-variant="light"
                        v-if="items.length != 0"
                    >
                        <template v-slot:table-busy>
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Loading...</strong>
                            </div>
                        </template>
                    </b-table>
                </b-tab>
            </b-tabs>
        </b-card>
        <alertModal />
        <!-- 帳號刪除modal -->
        <b-modal
            centered
            v-model="delAccountModalShow"
            hide-header
            hide-header-close
            no-close-on-backdrop
            no-close-on-esc
        >
            <template v-slot:default>
                <div class="d-block text-center">
                    <h3>確定要刪除此帳號嗎？</h3>
                </div>
            </template>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="delAccountModalShow = false"
                    >Close</b-button>
                    <b-button
                        variant="success"
                        size="sm"
                        class="float-right"
                        style="margin-right:10px"
                        @click.prevent="AccountDel()"
                    >確定刪除</b-button>
                </div>
            </template>
        </b-modal>
        <!-- 帳號修改modal -->
        <b-modal
            centered
            v-model="modAccountModalShow"
            size="xl"
            no-close-on-backdrop
            no-close-on-esc
        >
            <template v-slot:modal-header>
                <h5>帳號修改</h5>
            </template>
            <template v-slot:default>
                <systemForm />
            </template>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="modAccountModalShow = false"
                    >Close</b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import axios from "axios";
import alertModal from "@/components/alertModal.vue";
import systemForm from "@/components/systemForm.vue";
import commonQuery from "@/components/commonQuery.vue";
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
                    sortable: true
                },
                {
                    key: "uName",
                    label: "姓名",
                    sortable: true
                },
                {
                    key: "uInfo",
                    label: "使用者介紹",
                    sortable: true
                },
                {
                    key: "noumenonID",
                    label: "部門",
                    sortable: true
                },
                {
                    key: "accessList",
                    label: "權限列表",
                    sortable: true
                }
            ],
            items: [],
            modAccountModalShow: false,
            delmodalcontent: {
                uID: ""
            },
            delAccountModalShow: false,
            depDetail: []
        };
    },
    created: function() {
        this.SetSystemFormData();
        this.SetSystemFormSelectOptionsFunc();
        this.SetCommonQueryData();
    },
    mounted: function() {},
    components: {
        alertModal,
        commonQuery,
        systemForm
    },
    computed: {
        ...mapGetters({
            axiosResult: "commonaxios/get_axiosResult",
            loginData: "getlogin/get_loginData",
            pageAccess: "getlogin/get_pageAccess",
            commonQueryResponse: "commonquery/get_queryResponse",
            tableBusy: "commonquery/get_tableBusy",
            systemFormCompletedData: "systemform/get_completedData"
        })
    },
    watch: {
        commonQueryResponse: {
            handler() {
                var vm = this;
                vm.reset(["tabIndex", "depDetail"]);
                if (
                    vm.commonQueryResponse == "查無資料" ||
                    vm.commonQueryResponse == "時間尚未選擇"
                ) {
                    vm.setalertMsg(vm.commonQueryResponse);
                    vm.settimeoutalertModal();
                    return;
                }
                var itemsarray = [];
                for (var i = 0; i < vm.commonQueryResponse.length; i++) {
                    var itemsobj = {};
                    itemsobj["uID"] = vm.commonQueryResponse[i]["uID"];
                    itemsobj["uName"] = vm.commonQueryResponse[i]["uName"];
                    itemsobj["uInfo"] = vm.commonQueryResponse[i]["uInfo"];
                    itemsobj["noumenonID"] =
                        vm.depDetail[0][
                            vm.commonQueryResponse[i]["noumenonID"]
                        ];
                    itemsobj["accessList"] = JSON.parse(
                        vm.commonQueryResponse[i]["accessList"]
                    );
                    itemsarray.push(itemsobj);
                }
                console.log(itemsarray);
                if (itemsarray.length != 0) {
                    vm.items = itemsarray;
                }
            }
        },
        tabIndex: {
            handler(value) {
                var vm = this;
                vm.reset(["tabIndex", "depDetail"]);
                if (vm.tabIndex == 0) {
                    vm.SetSystemFormData();
                    vm.SetCommonQueryData();
                }
                vm.setsystemFormResponse();
                vm.setSystemFormCompletedData({});
            }
        },
        systemFormCompletedData: {
            handler() {
                var vm = this;
                console.log(vm.systemFormCompletedData);
                var msg = [];
                if (Object.keys(vm.systemFormCompletedData).length != 0) {
                    if (vm.tabIndex == 0) {
                        if (vm.systemFormCompletedData.uID == "") {
                            msg.push("帳號尚未輸入");
                        }
                        if (vm.systemFormCompletedData.noumenonID == "") {
                            msg.push("部門尚未選擇");
                        }
                    }
                    if (vm.systemFormCompletedData.pwd == "") {
                        msg.push("密碼尚未輸入");
                    }
                    console.log(msg);
                    if (msg.length != 0) {
                        vm.setalertMsg(msg);
                        vm.settimeoutalertModal(1200);
                        vm.setSystemFormCompletedData({});
                        return;
                    } else {
                        if (vm.tabIndex == 0) {
                            vm.AccountAdd();
                        } else if (vm.tabIndex == 1) {
                            vm.AccountMod();
                        }
                    }
                }
            }
        }
    },
    methods: {
        ...mapActions({
            axiosAction: "commonaxios/axiosAction",
            setalertMsg: "alertmodal/set_alertMsg",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            setinputData: "commonquery/set_inputData",
            setdepDetail: "commonquery/set_depDetail",
            queryAgain: "commonquery/do_queryAgain",
            setvforData: "systemform/set_vforData",
            setsystemFormResponse: "systemform/set_systemFormResponse",
            setSystemFormCompletedData: "systemform/set_completedData",
            setSystemFormSelectOptions: "systemform/set_selectOptions"
        }),
        SetSystemFormData(moditemobj) {
            var vforData = {};
            vforData["uID"] = ["text", "帳號"];
            vforData["pwd"] = ["text", "密碼"];
            vforData["uName"] = ["text", "姓名"];
            vforData["uInfo"] = ["text", "介紹"];
            vforData["noumenonID"] = ["depselect", "部門"];
            vforData["accessList"] = ["accesscheckbox", "使用者權限"];
            if (this.tabIndex == 0) {
                vforData["button"] = ["Add", "新增"];
            } else if (this.tabIndex == 1) {
                vforData["uID"] = ["readonly", "帳號", moditemobj.uID];
                vforData["pwd"] = ["text", "密碼", moditemobj.pwd];
                vforData["uName"] = ["text", "姓名", moditemobj.uName];
                vforData["uInfo"] = ["text", "介紹", moditemobj.uInfo];
                vforData["noumenonID"] = [
                    "depselect",
                    "部門",
                    moditemobj.noumenonID
                ];
                vforData["accessList"] = [
                    "accesscheckbox",
                    "使用者權限",
                    moditemobj.accessList
                ];
                vforData["button"] = ["Mod", "修改"];
            }
            console.log(vforData);
            this.setvforData(vforData);
        },
        SetSystemFormSelectOptionsFunc() {
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
                    depDetail[0] = {}; //key為depID
                    depDetail[1] = {}; //key為depName
                    for (var i = 0; i < result["QueryTableData"].length; i++) {
                        var systemformselectoptions = {};
                        depDetail[0][result["QueryTableData"][i]["depID"]] = result["QueryTableData"][i]["depName"];
                        depDetail[1][result["QueryTableData"][i]["depName"]] = result["QueryTableData"][i]["depID"];
                        systemformselectoptions["text"] =
                            result["QueryTableData"][i]["depName"];
                        systemformselectoptions["value"] =
                            result["QueryTableData"][i]["depID"];
                        systemformselectoptions["accessList"] = JSON.parse(
                            result["QueryTableData"][i]["accessList"]
                        );
                        array.push(systemformselectoptions);
                    }
                    vm.setSystemFormSelectOptions(array);
                    vm.depDetail = depDetail;
                    vm.setdepDetail(depDetail);
                } else {
                    vm.setalertMsg(result["Response"]);
                    vm.settimeoutalertModal();
                }
            });
        },
        SetCommonQueryData() {
            var vm = this;
            var obj = {};
            var misbulletinqueryselected = "ALL";
            var misbulletinqueryoptions = [
                { value: "uID", text: "帳號" },
                { value: "uName", text: "姓名" },
                { value: "noumenonID", text: "部門編號" },
                { value: "depName", text: "部門名稱" },
                { value: "ALL", text: "全選" }
            ];
            obj.options = misbulletinqueryoptions;
            obj.selected = misbulletinqueryselected;
            obj.table = "user";
            obj.inputtext = "text";
            obj.querypurpose = "query_like";
            vm.setinputData(obj);
        },
        onRowClicked(items, index, event) {
            var vm = this;
            //two level deep copy
            var thisitemobj = JSON.parse(JSON.stringify(items));
            if (vm.tabIndex == 1) {
                //抓取其密碼
                var params = {};
                params["methods"] = "GET";
                params["whichFunction"] = "Login";
                params["uID"] = thisitemobj.uID;
                vm.axiosAction(params).then(() => {
                    var result = vm.axiosResult;
                    if (result["Response"] == "ok") {
                        var thispwd = result["QueryTableData"][0].pwd;
                        thisitemobj["pwd"] = thispwd;
                    }
                    thisitemobj["noumenonID"] = vm.depDetail[1][thisitemobj["noumenonID"]]
                    console.log(thisitemobj);
                    vm.SetSystemFormData(thisitemobj);
                    vm.modAccountModalShow = true;
                });
            } else {
                vm.delmodalcontent.uID = items.uID;
                vm.delAccountModalShow = true;
            }
        },
        AccountMod() {
            var vm = this;
            var params = {};
            params["methods"] = "POST";
            params["whichFunction"] = "AccountMod";
            params["uID"] = vm.systemFormCompletedData.uID;
            params["pwd"] = vm.systemFormCompletedData.pwd;
            params["uName"] = vm.systemFormCompletedData.uName;
            params["uInfo"] = vm.systemFormCompletedData.uInfo;
            params["noumenonID"] = vm.systemFormCompletedData.noumenonID;
            if (
                Object.values(vm.systemFormCompletedData.accessList).indexOf(
                    false
                ) != -1
            ) {
                params["accessList"] = JSON.stringify(
                    vm.systemFormCompletedData.accessList
                );
            } else {
                params["accessList"] = '"ALL"';
            }
            params["creatorID"] = vm.loginData.account;
            vm.axiosAction(params).then(() => {
                vm.setSystemFormCompletedData({});
                var result = vm.axiosResult;
                var msg = "";
                if (result["Response"] == "ok") {
                    vm.setsystemFormResponse();
                    msg = "修改成功";
                } else {
                    msg = result["Response"];
                }
                vm.setalertMsg(msg);
                vm.settimeoutalertModal();
                vm.modAccountModalShow = false;
                vm.queryAgain();
            });
        },
        AccountAdd() {
            var vm = this;
            var params = {};
            params["methods"] = "POST";
            params["whichFunction"] = "AccountAdd";
            params["uID"] = vm.systemFormCompletedData.uID;
            params["pwd"] = vm.systemFormCompletedData.pwd;
            params["uName"] = vm.systemFormCompletedData.uName;
            params["uInfo"] = vm.systemFormCompletedData.uInfo;
            params["noumenonID"] = vm.systemFormCompletedData.noumenonID;
            if (
                Object.values(vm.systemFormCompletedData.accessList).indexOf(
                    false
                ) != -1
            ) {
                params["accessList"] = JSON.stringify(
                    vm.systemFormCompletedData.accessList
                );
            } else {
                params["accessList"] = '"ALL"';
            }
            params["creatorID"] = vm.loginData.account;

            vm.axiosAction(params).then(() => {
                var result = vm.axiosResult;
                console.log(result);
                vm.setSystemFormCompletedData({});
                var msg = "";
                if (result["Response"] == "ok") {
                    vm.setsystemFormResponse();
                    msg = "新增成功";
                } else {
                    msg = result["Response"];
                }
                vm.setalertMsg(msg);
                vm.settimeoutalertModal();
            });
        },
        AccountDel() {
            var vm = this;
            var params = {};
            params["methods"] = "GET";
            params["whichFunction"] = "AccountDel";
            params["uID"] = vm.delmodalcontent.uID;
            vm.axiosAction(params).then(() => {
                var result = vm.axiosResult;
                console.log(result);
                var msg = "";
                if (result["Response"] == "ok") {
                    msg = "刪除成功";
                } else {
                    msg = result["Response"];
                }
                vm.delAccountModalShow = false;
                vm.setalertMsg(msg);
                vm.settimeoutalertModal();
                vm.queryAgain();
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
        }
    }
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
