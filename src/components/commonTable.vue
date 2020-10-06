<template>
    <div class="commonTable">
        <b-table
            ref="commonTable"
            id="commonTable"
            sticky-header="550px"
            responsive
            hover
            :items="tableDetail.items"
            :fields="tableDetail.fields"
            head-variant="light"
            v-if="tableDetail.items.length != 0"
            class="mt-2"
        >
            <!-- table header -->
            <template
                v-slot:[getHeaderSlot(key)]="row"
                v-for="(data, key, index) in tableSlotConfig.slotConfig"
            >
                <div :key="index" style="position: relative">
                    {{ row.label }}
                    <div
                        v-if="
                            data.hasOwnProperty('removeHeader') &&
                            tableInWhichTabIndex == 0
                        "
                        class="deletefilebtn"
                        @click.prevent="removeHeaderFields(key)"
                    ></div>
                </div>
            </template>
            <!-- table cell slot -->
            <template
                v-slot:[getCellSlot(key)]="row"
                v-for="(data, key, index) in tableSlotConfig.slotConfig"
            >
                <div
                    :key="String(row.item.seq) + '_' + String(index)"
                    :class="{
                        hide: activeItemsSeq == row.item.seq,
                    }"
                >
                    <template v-if="data.hasOwnProperty('conversiontable')">
                        {{ data.conversiontable[row.item[key]] }}
                    </template>
                    <template v-else-if="data.hasOwnProperty('v-html')">
                        <div v-html="row.item[data.value]"></div>
                    </template>
                    <template v-else-if="data.hasOwnProperty('download')">
                        <div v-if="row.item[data.value] == ''">無</div>
                        <div
                            v-else
                            v-for="(file, file_key) in row.item[
                                data.value
                            ].split(',')"
                            :key="file_key"
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
                                >{{ file }}</b-button
                            >
                            <div
                                class="downloadfilebtn"
                                v-if="tableInWhichTabIndex == 0"
                            >
                                <b-icon
                                    icon="cloud-download-fill"
                                    scale="1.5"
                                    target="_blank"
                                    @click="
                                        download(
                                            file,
                                            row.item.path,
                                            data.download.location
                                        )
                                    "
                                ></b-icon>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        {{ row.item[key][data.value] }}
                    </template>
                </div>

                <div
                    :key="String(row.item.seq) + '__' + String(index)"
                    v-if="
                        tableInWhichTabIndex == 1 &&
                        tableSlotConfig.actionConfig.edit.type == 'self'
                    "
                    :class="{
                        hide: activeItemsSeq != row.item.seq,
                    }"
                >
                    <b-form-input
                        v-if="data.edit.type == 'number'"
                        type="number"
                        v-model="row.item[data.value]"
                        min="0"
                        step="20"
                    ></b-form-input>
                    <b-form-input
                        v-else-if="data.edit.type == 'input'"
                        class="input-text"
                        type="text"
                        v-model="row.item[data.value]"
                        @click="editLongData(row, key, true)"
                    ></b-form-input>
                </div>
            </template>
            <!-- table 編輯按鈕欄位 -->
            <template
                v-slot:cell(Action)="row"
                v-if="tableInWhichTabIndex == 1"
            >
                <template
                    v-if="tableSlotConfig.actionConfig.edit.type == 'self'"
                >
                    <template v-if="activeItemsSeq != row.item.seq">
                        <b-button
                            :disabled="
                                activeItemsSeq != null ||
                                !tableSlotConfig.actionConfig.edit.authority
                            "
                            @click="
                                setactiveItemsSeq(row.item.seq);
                                tempOldItemAction(true, row.item);
                            "
                            >編輯</b-button
                        >
                        <b-button
                            :disabled="
                                activeItemsSeq != null ||
                                !tableSlotConfig.actionConfig.del.authority
                            "
                            variant="danger"
                            @click="
                                toggleDelModal(
                                    true,
                                    row.item,
                                    tableSlotConfig.actionConfig.del
                                )
                            "
                            style="margin-left: 10px"
                            >刪除</b-button
                        >
                    </template>
                    <template v-else-if="activeItemsSeq == row.item.seq">
                        <b-button
                            @click="
                                modAction(
                                    row.item,
                                    row.index,
                                    tableSlotConfig.actionConfig.edit.location
                                )
                            "
                            >完成編輯</b-button
                        >
                        <b-button
                            variant="light"
                            @click="
                                setactiveItemsSeq(null);
                                tempOldItemAction(false, row.item);
                            "
                            style="margin-left: 10px"
                            >取消</b-button
                        >
                    </template>
                </template>
                <template v-else>
                    <b-button
                        :disabled="!tableSlotConfig.actionConfig.edit.authority"
                        @click="
                            modAction(
                                row.item,
                                row.index,
                                tableSlotConfig.actionConfig.edit.location
                            )
                        "
                        >編輯</b-button
                    >
                    <b-button
                        variant="danger"
                        :disabled="!tableSlotConfig.actionConfig.del.authority"
                        @click="
                            toggleDelModal(
                                true,
                                row.item,
                                tableSlotConfig.actionConfig.del
                            )
                        "
                        style="margin-left: 10px"
                        >刪除</b-button
                    >
                </template>
            </template>
        </b-table>

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
                        @click.prevent="toggleDelModal(false, null, null)"
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
import { mapGetters, mapActions } from "vuex";
import modal from "@/components/modal.vue";
export default {
    name: "commonTable",
    data() {
        return {
            tempThisOldItem: {},
            editActionModalShow: false,
            editActionItems: {
                seq: null,
                Data: "",
                which: "",
            },
            delItem: {},
            delModalShow: false,
        };
    },
    mounted: function () {
        console.log(this.tableSlotConfig);
    },
    components: {
        modal,
    },
    computed: {
        ...mapGetters({
            tableDetail: "commontable/get_tableDetail",
            tableSlotConfig: "commontable/get_tableSlotConfig",
            tableInWhichTabIndex: "commontable/get_tableInWhichTabIndex",
            activeItemsSeq: "commontable/get_activeItemsSeq",
            DEFAULT_commonModalConfig: "usemodal/get_DEFAULT_commonModalConfig",
        }),
    },
    watch: {
        tableInWhichTabIndex: {
            handler(value) {
                this.$nextTick(() => {
                    //等渲染完畢才執行
                    if (this.tableDetail.items.length != 0) {
                        if (value === 0) {
                            //表格scroll移至最左
                            this.$refs.commonTable.$el.scrollLeft = 0;
                        } else {
                            //表格scroll移至最右
                            this.$refs.commonTable.$el.scrollLeft = document.getElementById(
                                "commonTable"
                            ).scrollWidth;
                        }
                    }
                });
            },
        },
    },
    methods: {
        ...mapActions({
            settableResponse: "commontable/set_tableResponse",
            setactiveItemsSeq: "commontable/set_activeItemsSeq",
            setcommonModalConfig: "usemodal/set_commonModalConfig",
            togglecommonModal: "usemodal/toggle_commonModal",
        }),
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
                vm.tableDetail.items.filter(function (element) {
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
            if (status)
                setTimeout(() => {
                    this.$nextTick(() => this.$refs.editlongdata.focus());
                }, 0);
        },

        toggleDelModal(status, item, config) {
            let vm = this;
            if (status) {
                let commonModalConfig = JSON.parse(
                    JSON.stringify(vm.DEFAULT_commonModalConfig)
                );
                commonModalConfig.hideModalHeader = true;
                commonModalConfig.hideModalHeaderClose = true;
                vm.setcommonModalConfig(commonModalConfig);
                vm.delItem["data"] = {};
                config.delfield.map((element) => {
                    vm.delItem["data"][element] = item[element];
                });
                vm.delItem["location"] = config.location;
            }
            console.log(vm.delItem);
            vm.delModalShow = status;
            vm.togglecommonModal(status);
        },

        download(filename, thispath, location) {
            let vm = this;
            console.log(filename);
            console.log(location);
            vm.settableResponse({
                function: location,
                params: { data: filename, data2: thispath },
            });
        },

        modAction(data, index, location) {
            let vm = this;
            console.log(data);
            console.log(index);
            console.log(location);
            // if (editconfig.hasOwnProperty("goback")) {
            vm.settableResponse({
                function: location,
                params: { data: data, data2: index },
            });
            // }
        },

        delAction() {
            let vm = this;
            console.log(vm.delItem);
            vm.settableResponse({
                function: vm.delItem.location,
                params: {
                    data: vm.delItem.data,
                },
            });
        },

        removeHeaderFields(key) {
            let vm = this;
            console.log(key);
            vm.settableResponse({
                function: "removeHeaderFields",
                params: { data: key },
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
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hide {
    display: none;
}
.downloadfilebtn {
    position: absolute;
    top: 20px;
    cursor: pointer;
    right: -10px;
    width: 21.328px;
    height: 21.328px;
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
