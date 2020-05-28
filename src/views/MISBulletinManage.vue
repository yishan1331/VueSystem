<template>
    <div class="MISBulletinManage container">
        <commonQuery v-if="tabIndex != 0" />
        <b-card no-body>
            <b-tabs card v-model="tabIndex">
                <b-tab title="上傳" active>
                    <b-form>
                        <b-row class="my-4">
                            <b-col sm="2">
                                <label for="input-default">類別:</label>
                            </b-col>
                            <b-col sm="5">
                                <b-form-select
                                    id="input-category"
                                    v-model="form.category"
                                    :options="categoryoptions"
                                    style="display:inline-block"
                                ></b-form-select>
                            </b-col>
                        </b-row>
                        <b-row class="my-4">
                            <b-col sm="2">
                                <label for="input-default">公告標題:</label>
                            </b-col>
                            <b-col sm="5">
                                <b-form-input
                                    class="input-title"
                                    v-model="form.title"
                                    type="text"
                                    v-bind:class="{ formtitlewrong: form.formtitlewrong }"
                                ></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row class="my-4">
                            <b-col sm="2">
                                <label for="textarea-large">公告內容:</label>
                            </b-col>
                            <b-col sm="10">
                                <b-form-textarea
                                    id="textarea-default"
                                    size="lg"
                                    no-resize
                                    rows="8"
                                    v-model="form.content"
                                    :class="{ formcontentwrong: form.formcontentwrong }"
                                >
                                    <br />
                                </b-form-textarea>
                            </b-col>
                        </b-row>

                        <b-row class="my-4">
                            <b-col sm="2">
                                <label for="textarea-large">
                                    附件:
                                    <br />(小於1000000KB)
                                    <br />(只接受PDF檔、圖片檔)
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
                                    accept="image/*, .pdf"
                                ></b-form-file>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col lg="12" class="pb-2">
                                <div class="text-center">
                                    <b-button
                                        type="submit"
                                        variant="primary"
                                        @click.prevent="onSubmit()"
                                    >上傳</b-button>
                                </div>
                            </b-col>
                        </b-row>
                    </b-form>
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
            </b-tabs>
        </b-card>
        <alertModal />
        <!-- 公告刪除modal -->
        <b-modal
            centered
            v-model="delBulletinModalShow"
            hide-header
            hide-header-close
            no-close-on-backdrop
            no-close-on-esc
        >
            <template v-slot:default>
                <div class="d-block text-center">
                    <h3>確定要刪除此公告嗎？</h3>
                </div>
            </template>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="delBulletinModalShow = !delBulletinModalShow"
                    >Close</b-button>
                    <b-button
                        variant="success"
                        size="sm"
                        class="float-right"
                        style="margin-right:10px"
                        @click.prevent="onDelete()"
                    >確定刪除</b-button>
                </div>
            </template>
        </b-modal>
        <!-- 公告修改modal -->
        <b-modal
            centered
            v-model="modBulletinModalShow"
            size="xl"
            no-close-on-backdrop
            no-close-on-esc
        >
            <template v-slot:modal-header>
                <h5>公告修改</h5>
            </template>
            <template v-slot:default>
                <b-form>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="input-default">類別:</label>
                        </b-col>
                        <b-col sm="5">
                            <b-form-select
                                id="input-category"
                                v-model="modmodalcontent.category"
                                :options="categoryoptions"
                                style="display:inline-block"
                            ></b-form-select>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="input-default">公告標題:</label>
                        </b-col>
                        <b-col sm="5">
                            <b-form-input
                                class="input-title"
                                v-model="modmodalcontent.title"
                                type="text"
                                v-bind:class="{ formtitlewrong: modmodalcontent.formtitlewrong }"
                            ></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="textarea-large">公告內容:</label>
                        </b-col>
                        <b-col sm="10">
                            <b-form-textarea
                                id="textarea-default"
                                size="lg"
                                no-resize
                                rows="8"
                                v-model="modmodalcontent.content"
                                v-bind:class="{ formcontentwrong: modmodalcontent.formcontentwrong }"
                            ></b-form-textarea>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="textarea-large">是否顯示:</label>
                        </b-col>
                        <b-col sm="10">
                            <b-form-checkbox v-model="modmodalcontent.showhide" switch>顯示</b-form-checkbox>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="textarea-large">原附件:</label>
                        </b-col>
                        <b-col sm="10">
                            <!-- <a :href="item" v-for="(item, key,index) in modmodalcontent.boardannex"
                target="_blank"
                            :key="index">{{key}}</a>-->
                            <p v-if="Object.keys(modmodalcontent.boardannex).length === 0">無</p>
                            <div
                                v-else
                                v-for="(item, key,index) in modmodalcontent.boardannex"
                                :key="index"
                                style="display:inline-block;position: relative;margin-right:15px;margin-bottom:10px"
                            >
                                <b-button
                                    pill
                                    variant="outline-secondary"
                                    target="_blank"
                                    @click.prevent="previewfile(item)"
                                >{{key}}</b-button>
                                <div class="deletefilebtn" @click.prevent="deletefile(key,item)"></div>
                            </div>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="textarea-large">
                                附件:
                                <br />(小於1000000KB)
                                <br />(只接受PDF檔、圖檔)
                            </label>
                        </b-col>
                        <b-col sm="10">
                            <b-form-file
                                v-model="modmodalcontent.files"
                                multiple
                                class="mb-2"
                                type="file"
                                ref="file"
                                :file-name-formatter="formatNames"
                                @change="fileChange"
                                accept="image/*, .pdf"
                            ></b-form-file>
                        </b-col>
                    </b-row>
                </b-form>
            </template>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right"
                        @click.prevent="onModifyClose()"
                    >Close</b-button>
                    <b-button
                        variant="success"
                        size="sm"
                        class="float-right"
                        style="margin-right:10px"
                        @click.prevent="onModify()"
                    >修改</b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import axios from "axios";
import alertModal from "@/components/alertModal.vue";
import commonQuery from "@/components/commonQuery.vue";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "MISBulletinManage",
    data() {
        return {
            tabIndex: 0,
            form: {
                title: "",
                content: "",
                category: "system",
                filename: [],
                files: "",
                formtitlewrong: false,
                formcontentwrong: false
            },
            fields: [
                {
                    key: "category",
                    label: "類別",
                    sortable: true
                },
                {
                    key: "title",
                    label: "標題",
                    sortable: true
                },
                {
                    key: "releasedate",
                    label: "發布日期",
                    sortable: true
                },
                {
                    key: "showhide",
                    label: "顯示/隱藏",
                    sortable: true
                }
            ],
            items: [],
            categoryoptions: [
                { value: "system", text: "系統" },
                { value: "PC", text: "個人電腦" },
                { value: "network", text: "網路" }
            ],
            RowClickedIndex: "",
            modmodalcontent: {
                seq: "",
                category: "",
                title: "",
                content: "",
                showhide: "",
                boardannex: {},
                files: "",
                filename: [],
                formtitlewrong: false,
                formcontentwrong: false
            },
            modBulletinModalShow: false,
            delmodalcontent: {
                seq: "",
                filename: []
            },
            delBulletinModalShow: false
        };
    },
    created: function() {
        this.SetCommonQueryData();
    },
    components: {
        alertModal,
        commonQuery
    },
    computed: {
        ...mapGetters({
            axiosResult: "commonaxios/get_axiosResult",
            loginData: "getlogin/get_loginData",
            queryResponse: "commonquery/get_queryResponse",
            tableBusy: "commonquery/get_tableBusy"
        })
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
                    vm.setalertMsg(vm.queryResponse);
                    vm.settimeoutalertModal();
                    return;
                }
                var itemsarray = [];
                var categorytoCH = {};
                categorytoCH = {
                    network: "網路",
                    PC: "個人電腦",
                    system: "系統"
                };
                for (var i = 0; i < vm.queryResponse.length; i++) {
                    var itemsobj = {};
                    itemsobj["seq"] = vm.queryResponse[i]["seq"];
                    itemsobj["category"] =
                        categorytoCH[vm.queryResponse[i]["category"]];
                    itemsobj["title"] = vm.queryResponse[i]["title"];
                    itemsobj["releasedate"] =
                        vm.queryResponse[i]["lastUpdateTime"];
                    itemsobj["content"] = vm.queryResponse[i]["content"];
                    if (vm.queryResponse[i]["showhide"] == 1) {
                        itemsobj["showhide"] = true;
                    } else {
                        itemsobj["showhide"] = false;
                    }
                    itemsobj["creatorID"] = vm.queryResponse[i]["creatorID"];
                    if (vm.queryResponse[i]["filename"] != "") {
                        var thisfilename = vm.queryResponse[i][
                            "filename"
                        ].split(",");
                        itemsobj["annex"] = thisfilename;
                    }
                    itemsarray.push(itemsobj);
                }
                if (itemsarray.length != 0) {
                    vm.items = itemsarray;
                }
            }
        },
        tabIndex: {
            handler() {
                this.reset(["tabIndex"]);
                // this.setalertMsg("選擇查詢條件");
                // this.settimeoutalertModal();
            }
        }
    },
    methods: {
        ...mapActions({
            setalertMsg: "alertmodal/set_alertMsg",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            queryAgain: "commonquery/do_queryAgain",
            setinputData: "commonquery/set_inputData",
        }),
        SetCommonQueryData() {
            var vm = this;
            var obj = {};
            var misbulletinqueryselected = "ALL";
            var misbulletinqueryoptions = [
                { value: "system", text: "系統" },
                { value: "PC", text: "個人電腦" },
                { value: "network", text: "網路" },
                { value: "ALL", text: "全選" }
            ];
            obj.options = misbulletinqueryoptions;
            obj.selected = misbulletinqueryselected;
            obj.table = "misBulletin";
            obj.inputtext = "";
            vm.setinputData(obj);
        },
        //公告上傳
        onSubmit() {
            var vm = this;
            vm.form.formtitlewrong = false;
            vm.form.formcontentwrong = false;
            if (vm.form.title.length == 0) {
                vm.form.formtitlewrong = true;
                vm.setalertMsg("公告標題尚未輸入");
                vm.settimeoutalertModal();
                return;
            }
            vm.form.formtitlewrong = false;
            if (vm.form.content.length == 0) {
                vm.form.formcontentwrong = true;
                vm.setalertMsg("公告內容尚未輸入");
                vm.settimeoutalertModal();
                return;
            }
            vm.form.formcontentwrong = false;
            console.log(vm.form.content);
            vm.form.content = vm.form.content
                // .replace(/\r\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
                .replace(/\r\n/g, "<br/>")
                // .replace(/\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
                .replace(/\n/g, "<br/>")
                .replace(/\s/g, "&nbsp;");
            console.log(vm.form.content);
            let formData = new FormData();
            for (var i = 0; i < this.form.files.length; i++) {
                let file = this.form.files[i];
                formData.append("fileToUpload[" + i + "]", file);
            }
            formData.append("title", vm.form.title);
            formData.append("content", vm.form.content);
            formData.append("category", vm.form.category);
            formData.append("filename", vm.form.filename);
            formData.append("account", vm.loginData.account);
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            const instance = axios.create({
                withCredentials: true
            });
            instance
                .post(
                    "/static/php/views/misbulletin/misBulletinAdd.php",
                    formData,
                    config
                )
                .then(
                    function(response) {
                        const result = response.data;
                        vm.setalertMsg(result);
                        var altertime = 0;
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
                .catch(function(err) {
                    console.log(err);
                });
        },
        //檔名格式化
        formatNames(files) {
            var vm = this;
            for (var i = 0; i < files.length; i++) {
                if (vm.tabIndex == 0) {
                    vm.form.filename.push(files[i].name);
                } else {
                    vm.modmodalcontent.filename.push(files[i].name);
                }
            }
            if (files.length > 3) {
                return `${files.length} files selected`;
            } else {
                if (vm.tabIndex == 0) {
                    return `${vm.form.filename}`;
                } else {
                    return `${vm.modmodalcontent.filename}`;
                }
            }
        },
        fileChange() {
            if (this.tabIndex == 0) {
                this.form.filename.length = 0;
            } else {
                this.modmodalcontent.filename.length = 0;
            }
        },
        //表格點擊
        onRowClicked(items, index, event) {
            var vm = this;
            var categorytoEN = {};
            categorytoEN = {
                網路: "network",
                個人電腦: "PC",
                系統: "system"
            };
            if (vm.tabIndex == 1) {
                vm.RowClickedIndex = index;
                vm.modmodalcontent.seq = items.seq;
                vm.modmodalcontent.title = items.title;
                vm.modmodalcontent.category = categorytoEN[items.category];
                items.content = items.content
                    .replace(/<br\s*[\/]?>/g, "\n")
                    .replace(/&nbsp;/g, "");
                vm.modmodalcontent.content = items.content;
                vm.modmodalcontent.showhide = items.showhide;
                if (typeof items.annex != "undefined") {
                    for (var i = 0; i < items.annex.length; i++) {
                        vm.modmodalcontent.boardannex[items.annex[i]] =
                            "./misbulletinfiles/" + items.annex[i];
                    }
                }
                vm.modBulletinModalShow = true;
            } else {
                vm.delmodalcontent.seq = items.seq;
                if (typeof items.annex != "undefined") {
                    vm.delmodalcontent.filename = items.annex;
                } else {
                    vm.delmodalcontent.filename = "";
                }
                vm.delBulletinModalShow = true;
            }
        },
        //檔案預覽開啟頁面
        previewfile(filepath) {
            window.open(
                filepath,
                "sapidoSystem",
                "sapidoSystem",
                "statusbar=no,scrollbars=yes,status=yes,resizable=yes"
            );
        },
        //公告修改
        onModify() {
            var vm = this;
            if (Object.keys(vm.modmodalcontent.boardannex).length != 0) {
                if (
                    vm.modmodalcontent.filename.length >
                    Object.keys(vm.modmodalcontent.boardannex).length
                ) {
                    vm.setalertMsg("上傳附件數量大於原附件數量");
                    vm.settimeoutalertModal(1500);
                    vm.modmodalcontent.files = "";
                    vm.modmodalcontent.filename.length = 0;
                    return;
                }
                for (var i = 0; i < vm.modmodalcontent.filename.length; i++) {
                    if (
                        Object.keys(vm.modmodalcontent.boardannex).indexOf(
                            vm.modmodalcontent.filename[i]
                        ) == -1
                    ) {
                        vm.setalertMsg(
                            "上傳附件檔名:" +
                                vm.modmodalcontent.filename[i] +
                                "應與原附件名稱相同"
                        );
                        vm.settimeoutalertModal(1500);
                        vm.modmodalcontent.files = "";
                        vm.modmodalcontent.filename.length = 0;
                        return;
                    }
                }
            }
            vm.modmodalcontent.formtitlewrong = false;
            vm.modmodalcontent.formcontentwrong = false;
            if (vm.modmodalcontent.title.length == 0) {
                vm.modmodalcontent.formtitlewrong = true;
                vm.setalertMsg("公告標題尚未輸入");
                vm.settimeoutalertModal();
                return;
            }
            vm.modmodalcontent.formtitlewrong = false;
            if (vm.modmodalcontent.content.length == 0) {
                vm.modmodalcontent.formcontentwrong = true;
                vm.setalertMsg("公告內容尚未輸入");
                vm.settimeoutalertModal();
                return;
            }
            vm.modmodalcontent.formcontentwrong = false;
            vm.modmodalcontent.content = vm.modmodalcontent.content
                // .replace(/\r\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
                // .replace(/\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
                .replace(/\r\n/g, "<br/>")
                .replace(/\n/g, "<br/>")
                .replace(/\s/g, "&nbsp;");
            let formData = new FormData();
            for (var i = 0; i < this.modmodalcontent.files.length; i++) {
                let file = this.modmodalcontent.files[i];
                formData.append("fileToUpload[" + i + "]", file);
            }
            console.log(Object.keys(vm.modmodalcontent.boardannex));
            formData.append("deletefile", "");
            formData.append("seq", vm.modmodalcontent.seq);
            formData.append("title", vm.modmodalcontent.title);
            formData.append("content", vm.modmodalcontent.content);
            formData.append("category", vm.modmodalcontent.category);
            if (Object.keys(vm.modmodalcontent.boardannex).length == 0) {
                formData.append("filename", vm.modmodalcontent.filename);
            } else {
                formData.append(
                    "filename",
                    Object.keys(vm.modmodalcontent.boardannex)
                );
            }
            formData.append("showhide", vm.modmodalcontent.showhide);
            formData.append("account", vm.loginData.account);
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            const instance = axios.create({
                withCredentials: true
            });
            instance
                .post(
                    "/static/php/views/misbulletin/misBulletinMod.php",
                    formData,
                    config
                )
                .then(
                    function(response) {
                        const result = response.data;
                        vm.setalertMsg(result);
                        var altertime = 0;
                        if (result.length == 1) {
                            altertime = 1000;
                        } else if (result.length < 4) {
                            altertime = 1500;
                        } else {
                            altertime = 2500;
                        }
                        vm.settimeoutalertModal(altertime);
                        vm.modmodalcontent = this.$options.data().modmodalcontent;
                        vm.modBulletinModalShow = false;
                        vm.queryAgain();
                    }.bind(this)
                )
                .catch(function(err) {
                    console.log(err);
                });
        },
        //公告修改close
        onModifyClose() {
            var vm = this;
            vm.modmodalcontent = this.$options.data().modmodalcontent;
            vm.modBulletinModalShow = !vm.modBulletinModalShow;
        },
        //修改畫面刪除檔案
        deletefile(filename, filepath) {
            var vm = this;
            var oldfilelist = Object.keys(vm.modmodalcontent.boardannex);
            oldfilelist.splice(oldfilelist.indexOf(filename), 1);
            var newfilestr = oldfilelist.join(",");
            let formData = new FormData();
            formData.append("seq", vm.modmodalcontent.seq);
            formData.append("deletefile", filename);
            formData.append("remainfile", newfilestr);
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            const instance = axios.create({
                withCredentials: true
            });
            instance
                .post(
                    "/static/php/views/misbulletin/misBulletinMod.php",
                    formData,
                    config
                )
                .then(
                    function(response) {
                        const result = response.data;
                        var oldfileobj = vm.modmodalcontent.boardannex;
                        delete oldfileobj[filename];
                        this.$data.modmodalcontent.boardannex = Object.assign(
                            {},
                            oldfileobj
                        );
                        //remove vm.items裡的vm.items
                        var thisrowindex = vm.RowClickedIndex;
                        var thisrowitems = vm.items;
                        thisrowitems[thisrowindex].annex.splice(
                            thisrowitems[thisrowindex].annex.indexOf(vm.items),
                            1
                        );
                        vm.setalertMsg(result);
                        vm.settimeoutalertModal(1000);
                    }.bind(this)
                )
                .catch(function(err) {
                    console.log(err);
                });
        },
        //刪除畫面刪除檔案
        onDelete() {
            var vm = this;
            let params = {};
            params["filename"] = vm.delmodalcontent.filename;
            params["seq"] = vm.delmodalcontent.seq;
            axios
                .post(
                    "/static/php/views/misbulletin/misBulletinDel.php",
                    params
                )
                .then(
                    function(response) {
                        const result = response.data;
                        vm.setalertMsg(result);
                        vm.settimeoutalertModal(1000);
                        vm.delBulletinModalShow = false;
                        vm.queryAgain();
                    }.bind(this)
                )
                .catch(function(err) {
                    console.log(err);
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
.input-title {
    width: 200px !important;
}
.formtitlewrong,
.formcontentwrong {
    border: 1px solid red;
}
h5 {
    margin: 0 auto;
}
/*刪除圖示*/
.deletefilebtn {
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
</style>

