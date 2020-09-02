<template>
    <div class="Department container">
        <h4>部門管理</h4>
        <commonQuery v-if="tabIndex != 0" />
        <b-card no-body>
            <b-tabs card v-model="tabIndex">
                <b-tab title="新增" active>
                    <systemForm />
                </b-tab>
                <b-tab title="修改">
                    <h5 class="card-title" v-if="items.length == 0">選擇查詢條件</h5>
                    <b-table
                        sticky-header="550px"
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
                    <h5 class="card-title">尚未開放刪除</h5>
                    <!-- <b-table
            sticky-header="550px"
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
                    </b-table>-->
                </b-tab>
                <b-tab title="查詢">
                    <h5 class="card-title" v-if="items.length == 0">選擇查詢條件</h5>
                    <b-table
                        sticky-header="550px"
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
        <!-- 部門刪除modal -->
        <b-modal
            centered
            v-model="delDepartmentModalShow"
            hide-header
            hide-header-close
            no-close-on-backdrop
            no-close-on-esc
        >
            <template v-slot:default>
                <div class="d-block text-center">
                    <h3>確定要刪除此部門嗎？</h3>
                </div>
            </template>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="delDepartmentModalShow = false"
                    >Close</b-button>
                    <b-button
                        variant="success"
                        size="sm"
                        class="float-right"
                        style="margin-right:10px"
                        @click.prevent="DepDel()"
                    >確定刪除</b-button>
                </div>
            </template>
        </b-modal>
        <!-- 部門修改modal -->
        <b-modal
            centered
            v-model="modDepartmentModalShow"
            size="xl"
            no-close-on-backdrop
            no-close-on-esc
        >
            <template v-slot:modal-header>
                <h5>部門修改</h5>
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
                        @click.prevent="modDepartmentModalShow = false"
                    >Close</b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import axios from "axios";
import systemForm from "@/components/systemForm.vue";
import commonQuery from "@/components/commonQuery.vue";
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
                {
                    key: "accessList",
                    label: "權限列表",
                    sortable: true,
                },
            ],
            items: [],
            modDepartmentModalShow: false,
            delmodalcontent: {
                depID: "",
            },
            delDepartmentModalShow: false,
        };
    },
    created: function () {
        this.SetSystemFormData();
        this.SetDepDetail();
        this.SetCommonQueryData();
    },
    mounted: function () {},
    components: {
        commonQuery,
        systemForm,
    },
    computed: {
        ...mapGetters({
            axiosResult: "commonaxios/get_axiosResult",
            loginData: "getlogin/get_loginData",
            pageAccess: "getlogin/get_pageAccess",
            commonQueryResponse: "commonquery/get_queryResponse",
            tableBusy: "commonquery/get_tableBusy",
            systemFormCompletedData: "systemform/get_completedData",
        }),
    },
    watch: {
        commonQueryResponse: {
            handler() {
                var vm = this;
                vm.reset(["tabIndex"]);
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
                    itemsobj["depID"] = vm.commonQueryResponse[i]["depID"];
                    itemsobj["depName"] = vm.commonQueryResponse[i]["depName"];
                    itemsobj["depInfo"] = vm.commonQueryResponse[i]["depInfo"];
                    itemsobj["accessList"] =
                        vm.commonQueryResponse[i]["accessList"];
                    itemsarray.push(itemsobj);
                }
                if (itemsarray.length != 0) {
                    vm.items = itemsarray;
                }
            },
        },
        tabIndex: {
            handler(value) {
                var vm = this;
                vm.reset(["tabIndex"]);
                if (vm.tabIndex == 0) {
                    vm.SetSystemFormData();
                    vm.SetCommonQueryData();
                }
                vm.setsystemFormResponse();
                vm.setSystemFormCompletedData({});
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
                    console.log(
                        vm.systemFormCompletedData.accessList.todolist.remark
                    );
                    if (
                        vm.systemFormCompletedData.accessList.todolist.status &&
                        vm.systemFormCompletedData.accessList.todolist.remark ==
                            null
                    ) {
                        msg.push("權限:『待辦事項』需選擇指定部門");
                    }
                    if (
                        vm.systemFormCompletedData.accessList.weeklyreport
                            .status &&
                        vm.systemFormCompletedData.accessList.weeklyreport
                            .remark == null
                    ) {
                        msg.push("權限:『Weekly Report』需選擇指定部門");
                    }
                    console.log(msg);
                    if (msg.length != 0) {
                        vm.setalertMsg(msg);
                        vm.settimeoutalertModal(1200);
                        vm.setSystemFormCompletedData({});
                        return;
                    } else {
                        if (vm.tabIndex == 0) {
                            vm.DepAdd();
                        } else if (vm.tabIndex == 1) {
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
            setalertMsg: "alertmodal/set_alertMsg",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            setinputData: "commonquery/set_inputData",
            setapiParams: "commonquery/set_apiParams",
            setdepDetail: "commonquery/set_depDetail",
            queryAgain: "commonquery/do_queryAgain",
            setvforData: "systemform/set_vforData",
            setsystemFormResponse: "systemform/set_systemFormResponse",
            setSystemFormCompletedData: "systemform/set_completedData",
        }),
        SetSystemFormData(moditemobj) {
            var vforData = {};
            vforData["depID"] = ["text", "部門編號"];
            vforData["depName"] = ["text", "部門名稱"];
            vforData["depInfo"] = ["text", "部門介紹"];
            vforData["accessList"] = ["accesscheckbox", "部門權限"];
            if (this.tabIndex == 0) {
                vforData["button"] = ["Add", "新增"];
            } else if (this.tabIndex == 1) {
                vforData["depID"] = ["readonly", "部門編號", moditemobj.depID];
                vforData["depName"] = ["text", "部門名稱", moditemobj.depName];
                vforData["depInfo"] = ["text", "部門介紹", moditemobj.depInfo];
                vforData["accessList"] = [
                    "accesscheckbox",
                    "部門權限",
                    moditemobj.accessList,
                ];
                vforData["button"] = ["Mod", "修改"];
            }
            console.log(vforData);
            this.setvforData(vforData);
        },
        SetCommonQueryData() {
            var vm = this;
            var departmentqueryselected = "ALL";
            var departmentqueryoptions = [
                { value: "depID", text: "部門編號" },
                { value: "depName", text: "部門名稱" },
                { value: "ALL", text: "全選" },
            ];
            var obj = {
                options: departmentqueryoptions,
                selected: departmentqueryselected,
                inputtext: "text",
            };
            vm.setinputData(obj);
            let commonApiParams = {
                table: "department",
                timeattr: "lastUpdateTime",
                attr: "",
                intervaltime: {},
            };
            vm.setapiParams(commonApiParams);
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
                    depDetail[0] = {};
                    for (var i = 0; i < result["QueryTableData"].length; i++) {
                        depDetail[0][result["QueryTableData"][i]["depName"]] =
                            result["QueryTableData"][i]["depName"];
                    }
                    vm.setdepDetail(depDetail);
                } else {
                    vm.setalertMsg(result["Response"]);
                    vm.settimeoutalertModal();
                }
            });
        },
        onRowClicked(items, index, event) {
            var vm = this;
            //two level deep copy
            var thisitemobj = JSON.parse(JSON.stringify(items));
            if (vm.tabIndex == 1) {
                vm.SetSystemFormData(thisitemobj);
                vm.modDepartmentModalShow = true;
            } else {
                vm.delmodalcontent.depID = items.depID;
                // vm.delDepartmentModalShow = true;
            }
        },
        DepMod() {
            var vm = this;
            var params = {};
            params["methods"] = "POST";
            params["whichFunction"] = "DepartmentMod";
            params["depID"] = String(vm.systemFormCompletedData.depID);
            params["depName"] = String(vm.systemFormCompletedData.depName);
            params["depInfo"] = String(vm.systemFormCompletedData.depInfo);
            params["accessList"] = JSON.stringify(
                vm.systemFormCompletedData.accessList
            );
            console.log(params);
            vm.axiosAction(params).then(() => {
                vm.setSystemFormCompletedData({});
                var result = vm.axiosResult;
                console.log(result);
                var msg = "";
                if (result["Response"] == "ok") {
                    vm.setsystemFormResponse();
                    msg = "修改成功";
                    setTimeout(function () {
                        vm.queryAgain();
                    }, 500);
                } else {
                    msg = result["Response"];
                }
                vm.setalertMsg(msg);
                vm.settimeoutalertModal();
                vm.modDepartmentModalShow = false;
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
            vm.axiosAction(params).then(() => {
                vm.setSystemFormCompletedData({});
                var result = vm.axiosResult;
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
        DepDel() {},
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

