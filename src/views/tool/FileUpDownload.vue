<template>
    <div class="FileUpDownload container">
        <b-row class="mb-4">
            <b-col sm="9">
                <h4>暫時檔案之上傳下載</h4>
                <p class="subtitle">
                    點選表格欄位可選擇欲下載檔案之列表，並可建立期限性帳號密碼提供下載
                </p>
                <p class="subtitle">
                    上傳的檔案若無建立期限性帳號密碼或帳號密碼已過期，將在每週日定時清除
                </p>
            </b-col>
            <b-col sm="3" class="text-right">
                <b-button
                    pill
                    @click="
                        reset(['items']);
                        addModalShow = true;
                    "
                    variant="success"
                    >上傳檔案</b-button
                >
            </b-col>
        </b-row>

        <h5 v-if="items.length == 0">查無檔案</h5>
        <b-table
            ref="FileUpDownloadTable"
            id="FileUpDownloadTable"
            sticky-header="550px"
            responsive
            hover
            :items="items"
            :fields="fields"
            head-variant="light"
            v-if="items.length != 0"
            selectable
            select-mode="multi"
            @row-selected="onRowSelected"
            selected-variant="info"
            class="mt-2"
        >
            <!-- <template v-slot:cell(delete)="row">
                <template v-if="activeItemsSeq != row.index">
                    <b-button
                        :disabled="activeItemsSeq != null"
                        variant="danger"
                        @click="
                            reset(['items']);
                            toggleDelModal(true, row.item.filename);
                        "
                        style="margin-left: 10px"
                        >刪除</b-button
                    >
                </template>
            </template> -->
        </b-table>

        <template v-if="selected.length != 0">
            <div class="clearfix">
                <b-button size="sm" @click="selectAllRows">全選</b-button>
                <b-button
                    class="ml-2"
                    size="sm"
                    variant="danger"
                    @click="clearSelected"
                    >取消全選</b-button
                >
                <b-button
                    class="float-right"
                    variant="warning"
                    @click="createDownloadFileIdPwd"
                    >產生帳密供下載檔案</b-button
                >
            </div>
        </template>

        <template v-if="show_createIdPwd && createIdPwd.Id != null">
            <label>帳號</label>
            <div>
                <p class="copyitem">{{ createIdPwd.Id }}</p>
            </div>
            <label>密碼</label>
            <div>
                <p class="copyitem">{{ createIdPwd.Pwd }}</p>
            </div>
            <label>有效期限</label>
            <p>一天</p>
            <label>檔案列表</label>
            <p>{{ createIdPwd.FileList }}</p>
            <label>下載網址</label>
            <p>{{ createIdPwd.url }}</p>
        </template>

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
                <h5>上傳檔案</h5>
            </template>
            <template v-slot:default>
                <b-row class="my-4">
                    <b-col sm="2">
                        <label for="textarea-large">
                            檔案:
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
                                @click.prevent="addModalShow = false"
                                >Close</b-button
                            >
                        </div>
                    </b-col>
                </b-row>
            </template>
            <template v-slot:modal-footer></template>
        </b-modal>

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
import Clipboard from "clipboard";
import modal from "@/components/modal.vue";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "FileUpDownload",
    data() {
        return {
            delModalShow: false,
            addModalShow: false,
            form: {
                filename: [],
                files: [],
            },
            fields: [
                {
                    key: "filename",
                    label: "檔案列表",
                    sortable: false,
                },
                // { key: "delete", label: "刪除", sortable: false },
            ],
            items: [],
            activeItemsSeq: null,
            delItem: { filename: null },
            selected: [],
            show_createIdPwd: false,
            createIdPwd: {
                Id: null,
                Pwd: null,
                FileList: [],
                url: "https://211.22.242.17:9999",
            },
        };
    },
    created: function () {},
    mounted: function () {
        this.queryFileList();
    },
    components: {
        modal,
    },
    computed: {
        ...mapGetters({
            axiosResult: "commonaxios/get_axiosResult",
            pageAccess: "getlogin/get_pageAccess",
            loginData: "getlogin/get_loginData",
            depDetail: "getlogin/get_depDetail",
            pageAccessConfig: "getlogin/get_pageAccessConfig",
            queryResponse: "commonquery/get_queryResponse",
            DEFAULT_inputData: "commonquery/get_DEFAULT_inputData",
            DEFAULT_apiParams: "commonquery/get_DEFAULT_apiParams",
            getDate: "getdate/get_Date",
            DEFAULT_commonModalConfig: "usemodal/get_DEFAULT_commonModalConfig",
            tableResponse: "commontable/get_tableResponse",
        }),
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

        queryFileList() {
            var vm = this;
            vm.items = [];
            vm.togglealertModal(true);
            let anyerror = false;
            var params = {};
            params["methods"] = "GET";
            params["whichFunction"] = "FileList";
            vm.axiosAction(params)
                .then(() => {
                    var result = vm.axiosResult;
                    console.log(result);
                    if (result["Response"] == "ok") {
                        result["FileList"].map((element) => {
                            vm.items.push({
                                filename: element,
                            });
                        });
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
                    if (anyerror) vm.settimeoutalertModal();
                    vm.togglealertModal(false);
                });
        },

        toggleDelModal(status, filename) {
            let vm = this;
            if (status) {
                let commonModalConfig = JSON.parse(
                    JSON.stringify(vm.DEFAULT_commonModalConfig)
                );
                commonModalConfig.hideModalHeader = true;
                commonModalConfig.hideModalHeaderClose = true;
                vm.setcommonModalConfig(commonModalConfig);
                vm.delItem.filename = filename;
            } else {
                vm.delItem.filename = null;
            }
            vm.delModalShow = status;
            vm.togglecommonModal(status);
        },

        //上傳
        addAction() {
            let vm = this;
            console.log("call api");
            console.log(vm.form);

            if (this.form.files.length == 0) {
                vm.setTimeOutAlertMsg("必須上傳檔案");
                vm.settimeoutalertModal();
                return;
            }
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
            formData.append("filename", vm.form.filename);

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
                .post("/php/views/tool/tempFileAdd.php", formData, config)
                .then(
                    function (response) {
                        console.log(response);
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
                        vm.reset([]);
                    }.bind(this)
                )
                .catch(function (err) {
                    console.log(err);
                    vm.setTimeOutAlertMsg(err);
                    vm.settimeoutalertModal();
                })
                .finally(() => {
                    console.log("done");
                    vm.alertProgressModal(false);
                    vm.queryFileList();
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
        //         "sapidoSystem",
        //         "sapidoSystem",
        //         "statusbar=no,scrollbars=yes,status=yes,resizable=yes"
        //     );
        // },

        //刪除
        delAction() {
            let vm = this;
            console.log(vm.delItem.filename);
            vm.togglealertModal(true);
            let apiparams = {};
            apiparams["methods"] = "NOAPI";
            apiparams["whichFunction"] = "DeleteFile";
            apiparams["filename"] = vm.delItem.filename;
            console.log(apiparams);
            vm.axiosAction(apiparams)
                .then(() => {
                    var result = vm.axiosResult;
                    console.log(result);
                    vm.setTimeOutAlertMsg(result[0]);
                    vm.settimeoutalertModal();
                })
                .catch(function (err) {
                    console.log(err);
                })
                .finally(() => {
                    vm.togglealertModal(false);
                    vm.toggleDelModal(false, null);
                    vm.reset([]);
                    vm.queryFileList();
                });
        },

        onRowSelected(items) {
            console.log(items);
            this.selected = items;
        },
        selectAllRows() {
            this.$refs.FileUpDownloadTable.selectAllRows();
        },
        clearSelected() {
            this.$refs.FileUpDownloadTable.clearSelected();
        },

        createDownloadFileIdPwd() {
            let vm = this;
            vm.togglealertModal(true);
            let anyerror = false;
            var params = {};
            console.log(vm.selected);
            let this_selected = [];
            vm.selected.map((element) => {
                this_selected.push(element.filename);
            });
            console.log(this_selected);
            params["methods"] = "POST";
            params["whichFunction"] = "CreateDownloadFileIdPwd";
            params["data"] = this_selected;
            console.log(params);
            vm.axiosAction(params)
                .then(() => {
                    var result = vm.axiosResult;
                    console.log(result);
                    if (result["Response"] == "ok") {
                        vm.createIdPwd.Id = result["ID"];
                        vm.createIdPwd.Pwd = result["PWD"];
                        vm.createIdPwd.FileList = result["DownloadList"];
                        vm.show_createIdPwd = true;
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
                    if (anyerror) {
                        vm.settimeoutalertModal();
                    } else {
                        setTimeout(() => {
                            vm.setcopybtn();
                        }, 0);
                    }
                    vm.togglealertModal(false);
                    vm.reset(["createIdPwd", "items", "show_createIdPwd"]);
                    vm.clearSelected();
                });
        },

        setcopybtn() {
            //https://codepen.io/wilbo/pen/xRVLOj?editors=1111
            //
            // al pre tags on the page
            // const pres = document.getElementsByTagName("pre");
            const copyitems = document.getElementsByClassName("copyitem");
            // //
            console.log(copyitems);
            // // reformat html of pre tags
            if (copyitems !== null) {
                console.log("~~~~~~~~~~~~~");
                console.log(copyitems[0]);
                console.log(copyitems[1]);
                for (let i = 0; i < copyitems.length; i++) {
                    console.log(copyitems[i]);
                    let node = document.createElement("div");
                    let textnode = document.createTextNode("copy");
                    node.className = "copy";
                    // node.style.cssText = "display:none";
                    node.appendChild(textnode);
                    copyitems[i].parentElement.classList.add("copyitem_parent");
                    copyitems[i].parentElement.appendChild(node);
                }
            }
            console.log(document.getElementsByClassName("copy"));
            // create clipboard for every copy element
            const clipboard = new Clipboard(".copy", {
                target: (trigger) => {
                    console.log(trigger.previousElementSibling);
                    return trigger.previousElementSibling;
                },
            });
            console.log(clipboard);
            //
            // do stuff when copy is clicked
            clipboard.on("success", (event) => {
                console.log(event);
                event.trigger.textContent = "copied!";
                setTimeout(() => {
                    event.clearSelection();
                    event.trigger.textContent = "copy";
                }, 2000);
            });
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
.subtitle {
    color: #6c757d;
    margin: 0;
}
.copyitem_parent {
    position: relative;
}
::v-deep .copy {
    position: absolute;
    top: -0.7em;
    left: -0.7em;
    color: #bbb;
    font-size: 0.8em;
    padding: 0 0.5em;
    background: #f5f2f0;
    background: hsla(0, 0%, 87.8%, 0.2);
    box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.2);
    border-radius: 0.5em;
    cursor: pointer;
}
::v-deep .copy:hover {
    color: rgb(79, 79, 252);
}
</style>

