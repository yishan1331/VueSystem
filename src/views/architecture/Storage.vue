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
                <commonQuery v-show="false" />
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
                <commonTable v-else></commonTable>
            </b-tab>
            <b-tab title="編輯" v-if="breadcrumbWhich != 'Species'">
                <h5 v-if="items.length == 0" class="card-title mt-2">
                    查無資料
                </h5>
                <commonTable v-else></commonTable>
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
    </div>
</template>

<script>
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
            addModalShow: false,
            fields: [
                // { key: "seq", label: "編號", sortable: true },
                { key: "species", label: "種類", sortable: true },
                { key: "type", label: "類型", sortable: false },
                { key: "name", label: "名稱", sortable: false },
                { key: "size", label: "SIZE(GB)", sortable: false },
                { key: "subSize", label: "SUB SIZE(GB)", sortable: false },
                { key: "note", label: "內容說明", sortable: false },
                { key: "IP", label: "對應的server IP", sortable: false },
                {
                    key: "Action",
                    label: "功能",
                    sortable: false,
                    tdClass: "w150px",
                    thClass: "w150px",
                },
            ],
            items: [],
            speciesItem: {},
            childrenLen: {},
            breadcrumbWhich: "Species",
            breadcrumbList: [
                {
                    text: "種類",
                    active: true,
                },
            ],
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
                    query: {
                        location: "toggleItems",
                        Species: { havedata: "查看", nodata: "查無資料" },
                    },
                    edit: {
                        authority: true,
                        type: "self",
                        location: "modAction",
                    },
                    del: {
                        authority: true,
                        location: "delAction",
                        delfield: ["seq"],
                    },
                },
                selectable: false,
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
            DEFAULT_apiParams: "commonquery/get_DEFAULT_apiParams",
            isInit: "commonquery/get_isInit",
            DEFAULT_commonModalConfig: "usemodal/get_DEFAULT_commonModalConfig",
            tableResponse: "commontable/get_tableResponse",
        }),
    },
    watch: {
        tabIndex: {
            handler(value) {
                this.reset([
                    "tabIndex",
                    "speciesItem",
                    "childrenLen",
                    "items",
                    "fields",
                    "breadcrumbWhich",
                    "breadcrumbList",
                ]);
                console.log(this.breadcrumbWhich);
                this.settableInWhichTab({
                    index: value,
                    which: this.breadcrumbWhich,
                });
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
                vm.reset(["tabIndex", "breadcrumbWhich", "breadcrumbList"]);
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
            axiosPostAction: "commonaxios/axiosPostAction",
            axiosPatchAction: "commonaxios/axiosPatchAction",
            axiosDeleteAction: "commonaxios/axiosDeleteAction",
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
            settableInWhichTab: "commontable/set_tableInWhichTab",
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
            let params = {};
            params["url"] = "api/YS/1.0/my/CommonUse/storage";
            params["postdata"] = {
                seq: [""],
                species: [vm.systemFormCompletedData.species],
                type: [vm.systemFormCompletedData.type],
                name: [vm.systemFormCompletedData.name],
                size: [vm.systemFormCompletedData.size],
                subSize: [vm.systemFormCompletedData.subSize],
                note: [vm.systemFormCompletedData.note],
                IP: [vm.systemFormCompletedData.IP],
                creatorID: [vm.loginData.account],
            };
            console.log(params);
            vm.axiosPostAction(params)
                .then(() => {
                    var result = vm.axiosResult;
                    console.log(result);
                    if (result.status != 200) {
                        vm.setTimeOutAlertMsg(result.data);
                        return;
                    }
                    if (result.data["Response"] === "ok") {
                        vm.setTimeOutAlertMsg("新增成功");
                    } else {
                        vm.setTimeOutAlertMsg(result.data["Response"]);
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
                    setTimeout(function () {
                        vm.queryAgain();
                    }, 1200);
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
            apiparams["url"] = "api/YS/1.0/my/CommonUse/storage";
            apiparams["postdata"] = {
                old_seq: [items.seq],
                species: [items.species],
                type: [items.type],
                name: [items.name],
                size: [items.size],
                subSize: [items.subSize],
                note: [items.note],
                IP: [items.IP],
            };
            vm.setactiveItemsSeq(null);
            console.log(apiparams);
            vm.axiosPatchAction(apiparams)
                .then(() => {
                    var result = vm.axiosResult;
                    console.log(result);
                    if (result.status != 200) {
                        vm.setTimeOutAlertMsg(result.data);
                        return;
                    }
                    if (result.data["Response"] === "ok") {
                        vm.setTimeOutAlertMsg("修改成功");
                    } else {
                        vm.setTimeOutAlertMsg(result.data["Response"]);
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
                    setTimeout(function () {
                        vm.queryAgain();
                    }, 1200);
                });
        },

        delAction(params) {
            console.log(params);
            let vm = this;
            const delseq = params.data.seq;
            vm.togglealertModal(true);
            console.log(delseq);
            let apiparams = {};
            apiparams["url"] = "api/YS/1.0/my/CommonUse/storage";
            apiparams["postdata"] = {
                seq: [delseq],
            };
            console.log(apiparams);
            vm.axiosDeleteAction(apiparams)
                .then(() => {
                    var result = vm.axiosResult;
                    console.log(result);
                    if (result.status != 200) {
                        vm.setTimeOutAlertMsg(result.data);
                        return;
                    }
                    if (result.data["Response"] === "ok") {
                        vm.setTimeOutAlertMsg("刪除成功");
                    } else {
                        vm.setTimeOutAlertMsg(result.data["Response"]);
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
                    setTimeout(function () {
                        vm.queryAgain();
                    }, 1200);
                });
        },

        getDataList() {
            let vm = this;
            vm.togglealertModal(true);
            let itemsobj = {};
            let speciesitemsobj = {};
            let children = {};
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

                if (!speciesitemsobj.hasOwnProperty(String(element.species))) {
                    speciesitemsobj[String(element.species)] = [];
                    children[String(element.species)] = 0;
                }

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
                speciesitemsobj[String(element.species)].push(itemsobj);
                children[String(element.species)] += 1;
            });
            console.log(speciesitemsobj);
            console.log(children);
            vm.speciesItem = JSON.parse(JSON.stringify(speciesitemsobj));
            vm.childrenLen = JSON.parse(JSON.stringify(children));

            let thischildren = {};
            if (!vm.speciesItem.hasOwnProperty(vm.breadcrumbWhich))
                vm.breadcrumbWhich = "Species";

            if (vm.breadcrumbWhich === "Species") {
                vm.fields.splice(1, 6);
                console.log(vm.fields);
                Object.keys(vm.speciesItem).forEach((element) => {
                    vm.items.push({ species: element });
                });
                console.log(vm.items);
                thischildren = vm.childrenLen;
                vm.breadcrumbList[0]["active"] = true;
                vm.breadcrumbList.splice(1, 1);
            } else {
                vm.fields.splice(0, 1);
                vm.items = vm.speciesItem[vm.breadcrumbWhich];
            }
            console.log(thischildren);
            vm.settableDetail({
                items: vm.items,
                fields: vm.fields,
                which: vm.breadcrumbWhich,
                children: thischildren,
            });

            vm.settableInWhichTab({
                index: vm.tabIndex,
                which: vm.breadcrumbWhich,
            });
            vm.togglealertModal(false);
        },

        getHeaderSlot(key) {
            return `head(${key})`;
        },

        getCellSlot(key) {
            return `cell(${key})`;
        },

        toggleItems(params) {
            let vm = this;
            console.log(params);
            vm.reset([
                "tabIndex",
                "speciesItem",
                "childrenLen",
                "breadcrumbWhich",
            ]);
            let thiswhich = "Species";
            let children = {};
            if (params.data != "backtrack") {
                vm.fields.splice(0, 1);
                console.log(vm.speciesItem);
                console.log(vm.speciesItem[params.data]);
                console.log(vm.fields);
                vm.items = vm.speciesItem[params.data];
                thiswhich = params.data;
                vm.breadcrumbList[0]["active"] = false;
                vm.breadcrumbList.push({ text: params.data, active: true });
                vm.breadcrumbWhich = params.data;
            } else {
                vm.fields.splice(1, 6);
                console.log(vm.fields);
                Object.keys(vm.speciesItem).forEach((element) => {
                    vm.items.push({ species: element });
                });
                vm.breadcrumbList[0]["active"] = true;
                vm.breadcrumbList.splice(1, 1);
                vm.breadcrumbWhich = "Species";
                children = vm.childrenLen;
            }
            console.log(children);
            vm.settableDetail({
                items: vm.items,
                fields: vm.fields,
                which: thiswhich,
                children: children,
            });
            vm.settableInWhichTab({
                index: vm.tabIndex,
                which: vm.breadcrumbWhich,
            });
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
                which: vm.breadcrumbWhich,
            });
            vm.settableInWhichTab({
                index: vm.tabIndex,
                which: vm.breadcrumbWhich,
            });
        },

        breadcrumbClick(item, active, index) {
            let vm = this;
            console.log(item, active, index);
            if (item === "種類") {
                vm.toggleItems({ data: "backtrack" });
            }
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
