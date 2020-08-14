<template>
    <div class="MISBulletinManage container">
        <commonQuery v-if="tabIndex != 0" />
        <b-card no-body>
            <b-tabs card v-model="tabIndex">
                <b-tab title="上傳" active>
                    <b-form @submit="uploadFormSubmit" v-if="tabIndex == 0">
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
                            <b-col
                                sm="5"
                                :class="{ 'form-group--error': $v.form.title.value.$error }"
                            >
                                <b-form-input
                                    v-model.trim="$v.form.title.$model.value"
                                    class="input-title"
                                    type="text"
                                ></b-form-input>
                                <template
                                    v-if="check_required($v.form.title.value.required,$v.form.title.$model)"
                                >
                                    <div class="error">Is required</div>
                                </template>
                            </b-col>
                        </b-row>
                        <b-row class="my-4">
                            <b-col sm="2">
                                <label for="textarea-large">公告內容:</label>
                                <b-form-checkbox
                                    v-model="formcontentusetable"
                                    style="margin-bottom:5px"
                                    v-b-tooltip="{ trigger:'hover',title: usetableTooltipExample, html:true, placement: 'right', variant: 'info'}"
                                >自定義文字格式或使用表格(若兩者都勾選以此優先)</b-form-checkbox>
                                <b-form-checkbox
                                    v-model="formcontentusepre"
                                    v-b-tooltip="{ trigger:'hover',title: usepreTooltipExample, html:true, placement: 'bottom', variant: 'info'}"
                                >自定義格式內容(&lt;pre&gt;)</b-form-checkbox>
                            </b-col>
                            <b-col
                                sm="10"
                                :class="{ 'form-group--error': seterrorclass($v.form.content.value,tabIndex)}"
                            >
                                <b-form-textarea
                                    id="textarea-default"
                                    size="lg"
                                    no-resize
                                    rows="8"
                                    v-model.trim="$v.form.content.$model.value"
                                >
                                    <br />
                                </b-form-textarea>
                                <template
                                    v-if="check_required($v.form.content.value.required,$v.form.content.$model)"
                                >
                                    <div class="error">Is required</div>
                                </template>
                                <template v-else-if="formcontentusetable">
                                    <div
                                        class="jsonerror"
                                        v-if="check_jsonvalid($v.form.content.value.jsonvalidator,$v.form.content.$model)"
                                    >不是正確的JSON格式，字串須加雙引號，陣列要以[ ]包起來，物件要以{ }包起來</div>
                                </template>
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
                                        @click="$v.form.$touch"
                                    >上傳</b-button>
                                    <!-- @click.prevent="onSubmit()" -->
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
        <!-- 公告刪除modal -->
        <b-modal
            centered
            v-model="delBulletinModalShow"
            hide-header
            hide-header-close
            no-close-on-backdrop
            no-close-on-esc
            v-if="tabIndex == 2"
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
            hide-footer
            v-if="tabIndex == 1"
        >
            <template v-slot:modal-header>
                <h5>公告修改</h5>
            </template>
            <template v-slot:default>
                <b-form @submit="modifyFormSubmit">
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
                        <b-col
                            sm="5"
                            :class="{ 'form-group--error': $v.modmodalcontent.title.value.$error }"
                        >
                            <b-form-input
                                class="input-title"
                                v-model.trim="$v.modmodalcontent.title.$model.value"
                                type="text"
                            ></b-form-input>
                            <template
                                v-if="check_required($v.modmodalcontent.title.value.required,$v.modmodalcontent.title.$model)"
                            >
                                <div class="error">Is required</div>
                            </template>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="textarea-large">公告內容:</label>
                            <b-form-checkbox
                                v-model="modmodalcontentusetable"
                                v-b-tooltip="{ trigger:'hover',title: usetableTooltipExample, html:true, placement: 'right', variant: 'info'}"
                            >自定義文字格式或使用表格(若兩者都勾選以此優先)</b-form-checkbox>
                            <b-form-checkbox
                                v-model="modmodalcontentusepre"
                                v-b-tooltip="{ trigger:'hover',title: usepreTooltipExample, html:true, placement: 'bottom', variant: 'info'}"
                            >自定義格式內容(&lt;pre&gt;)</b-form-checkbox>
                        </b-col>
                        <b-col
                            sm="10"
                            :class="{ 'form-group--error': seterrorclass($v.modmodalcontent.content.value,tabIndex)}"
                        >
                            <b-form-textarea
                                id="textarea-default"
                                size="lg"
                                no-resize
                                rows="8"
                                v-model="$v.modmodalcontent.content.$model.value"
                            ></b-form-textarea>
                            <template
                                v-if="check_required($v.modmodalcontent.content.value.required,$v.modmodalcontent.content.$model)"
                            >
                                <div class="error">Is required</div>
                            </template>
                            <template v-else-if="modmodalcontentusetable">
                                <div
                                    class="jsonerror"
                                    v-if="check_jsonvalid($v.modmodalcontent.content.value.jsonvalidator,$v.modmodalcontent.content.$model)"
                                >不是正確的JSON格式，字串須加雙引號，陣列要以[ ]包起來，物件要以{ }包起來</div>
                            </template>
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
                    <b-row>
                        <b-col lg="12" class="pb-2">
                            <div class="w-100">
                                <b-button
                                    variant="light"
                                    size="sm"
                                    class="float-right"
                                    @click.prevent="onModifyClose()"
                                >Close</b-button>
                            </div>
                            <div class="text-right">
                                <b-button
                                    type="submit"
                                    variant="success"
                                    size="sm"
                                    class="float-right"
                                    @click="$v.modmodalcontent.$touch"
                                    style="margin-right:5px"
                                >修改</b-button>
                                <!-- @click.prevent="onModify()" -->
                            </div>
                        </b-col>
                    </b-row>
                </b-form>
            </template>
        </b-modal>
    </div>
</template>

<script>
import axios from "axios";
import commonQuery from "@/components/commonQuery.vue";
import { validationMixin } from "vuelidate"; // 表單驗證
import { required, minLength, between } from "vuelidate/lib/validators";
import { mapGetters, mapActions } from "vuex";
//設置json validator
const jsonvalidator = (jsonData) => {
    let status = true;
    try {
        JSON.parse(jsonData);
    } catch (e) {
        //console.log('Error data', e);
        status = false;
    }
    console.log(status);
    return status;
};
export default {
    name: "MISBulletinManage",
    data() {
        return {
            tabIndex: 0,
            form: {
                title: {
                    key: "title",
                    value: "",
                    invalid: false,
                },
                content: {
                    key: "content",
                    value: "",
                    invalid: false,
                },
                category: "system",
                filename: [],
                files: [],
            },
            //upload form是否使用table checkbox
            formcontentusetable: false,
            //upload form是否使用pre checkbox
            formcontentusepre: false,
            fields: [
                {
                    key: "category",
                    label: "類別",
                    sortable: true,
                },
                {
                    key: "title",
                    label: "標題",
                    sortable: true,
                },
                {
                    key: "releasedate",
                    label: "發布日期",
                    sortable: true,
                },
                {
                    key: "showhide",
                    label: "顯示/隱藏",
                    sortable: true,
                },
            ],
            items: [],
            categoryoptions: [
                { value: "system", text: "系統" },
                { value: "PC", text: "個人電腦" },
                { value: "network", text: "網路" },
            ],
            RowClickedIndex: "",
            modmodalcontent: {
                seq: "",
                category: "",
                title: {
                    key: "title",
                    value: "",
                    invalid: false,
                },
                content: {
                    key: "content",
                    value: "",
                    invalid: false,
                },
                showhide: "",
                boardannex: {},
                files: "",
                filename: [],
            },
            //mod form是否使用talbe checkbox
            modmodalcontentusetable: false,
            //mod form是否使用pre checkbox
            modmodalcontentusepre: false,
            modBulletinModalShow: false,
            delmodalcontent: {
                seq: "",
                filename: [],
            },
            delBulletinModalShow: false,
        };
    },
    // 表單驗證引入
    mixins: [validationMixin],
    //驗證欄位參數
    validations() {
        let setvalid = {
            form: {
                title: {
                    value: {
                        required,
                    },
                },
                content: {
                    value: {
                        required,
                        jsonvalidator,
                    },
                },
            },
            modmodalcontent: {
                title: {
                    value: {
                        required,
                    },
                },
                content: {
                    value: {
                        required,
                        jsonvalidator,
                    },
                },
            },
        };
        console.log(setvalid);
        console.log(this.tabIndex);
        if (this.tabIndex == 0) {
            // delete setvalid.modmodalcontent;
            console.log(setvalid);
            if (!this.formcontentusetable) {
                delete setvalid.form.content.value.jsonvalidator;
                return setvalid;
            }
            return setvalid;
        } else if (this.tabIndex == 1) {
            console.log(setvalid);
            // delete setvalid.form;
            if (!this.modmodalcontentusetable) {
                delete setvalid.modmodalcontent.content.value.jsonvalidator;
                return setvalid;
            }
            return setvalid;
        } else {
            return {};
        }
    },
    created: function () {
        this.SetCommonQueryData();
    },
    components: {
        commonQuery,
    },
    computed: {
        ...mapGetters({
            axiosResult: "commonaxios/get_axiosResult",
            loginData: "getlogin/get_loginData",
            queryResponse: "commonquery/get_queryResponse",
            tableBusy: "commonquery/get_tableBusy",
        }),
    },
    watch: {
        queryResponse: {
            handler() {
                var vm = this;
                vm.reset(["tabIndex"]);
                vm.formReset();
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
                    system: "系統",
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
            },
        },
        tabIndex: {
            handler() {
                this.reset(["tabIndex"]);
                this.formReset();
                // this.setalertMsg("選擇查詢條件");
                // this.settimeoutalertModal();
            },
        },
        formcontentusetable: {
            handler() {
                console.log(this.formcontentusetable);
                console.log(this.form.content);
                if (this.formcontentusetable) {
                    this.form.content["jsonvalid"] = false;
                } else {
                    delete this.form.content.jsonvalid;
                }
                console.log(this.form.content);
            },
        },
        modmodalcontentusetable: {
            handler() {
                console.log(this.modmodalcontentusetable);
                console.log(this.modmodalcontent.content);
                if (this.modmodalcontentusetable) {
                    this.modmodalcontent.content["jsonvalid"] = false;
                } else {
                    delete this.modmodalcontent.content.jsonvalid;
                }
                console.log(this.modmodalcontent.content);
            },
        },
    },
    methods: {
        ...mapActions({
            setalertMsg: "alertmodal/set_alertMsg",
            togglealertModal: "alertmodal/toggle_alertModal",
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
                { value: "ALL", text: "全選" },
            ];
            obj.options = misbulletinqueryoptions;
            obj.selected = misbulletinqueryselected;
            obj.table = "misBulletin";
            obj.inputtext = "";
            vm.setinputData(obj);
        },
        //公告上傳
        uploadFormSubmit(evt) {
            evt.preventDefault();
            let checkvalid = ["title", "content"];
            let vm = this;
            let status = true;
            console.log(checkvalid);
            checkvalid.forEach((element) => {
                console.log(element);
                console.log(vm.form[element]);
                if (!vm.form[element].invalid) {
                    status = false;
                } else {
                    if (
                        element === "content" &&
                        vm.form["content"].hasOwnProperty("jsonvalid")
                    ) {
                        if (!vm.form["content"].jsonvalid) status = false;
                    }
                }
            });
            console.log(status);
            if (status) {
                console.log("call api");
                let thiscontent;
                thiscontent = vm.adjustContentData(vm.form.content);
                if (!thiscontent) return;
                console.log(thiscontent);
                console.log(typeof thiscontent);
                console.log(thiscontent);
                let formData = new FormData();
                formData.append("content", thiscontent);
                vm.setalertMsg("請稍候...");
                vm.togglealertModal(true);
                for (var i = 0; i < this.form.files.length; i++) {
                    let file = this.form.files[i];
                    formData.append("fileToUpload[" + i + "]", file);
                }
                formData.append("title", vm.form.title.value);
                formData.append("category", vm.form.category);
                formData.append("filename", vm.form.filename);
                formData.append("account", vm.loginData.account);
                let config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                };
                const instance = axios.create({
                    withCredentials: true,
                });
                instance
                    .post(
                        "/php/views/misbulletin/misBulletinAdd.php",
                        formData,
                        config
                    )
                    .then(
                        function (response) {
                            vm.togglealertModal(false);
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
                            vm.formReset();
                        }.bind(this)
                    )
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        },
        //set表單驗證error class
        seterrorclass(val, tabindex) {
            if (!val.$error) return val.$error;
            if (!val.required) return val.$error;
            if (tabindex == 0 && this.formcontentusetable) return val.$error;
            if (tabindex == 1 && this.modmodalcontentusetable)
                return val.$error;
            return false;
        },
        //檢查資料欄位->是否有值＆JSON格式合法
        check_required(required, model) {
            model.invalid = required;
            return !required;
        },
        check_jsonvalid(jsonvalid, model) {
            console.log(jsonvalid);
            console.log(model);
            model.jsonvalid = jsonvalid;
            return !jsonvalid;
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
                系統: "system",
            };
            if (vm.tabIndex == 1) {
                console.log(items);
                console.log(JSON.stringify(items));
                console.log(index);
                console.log(event);
                vm.modmodalcontentusetable = false;
                vm.modmodalcontentusepre = false;
                vm.RowClickedIndex = index;
                vm.modmodalcontent.seq = items.seq;
                vm.modmodalcontent.title.value = items.title;
                vm.modmodalcontent.category = categorytoEN[items.category];
                if (vm.checkIsJsonData(items.content)) {
                    let parsecontent = items.content;
                    if (
                        Object.prototype.toString.call(items.content) !=
                        "[object Object]"
                    )
                        parsecontent = JSON.parse(parsecontent);
                    console.log(parsecontent);
                    if (parsecontent.hasOwnProperty("wordPreUp")) {
                        if (typeof parsecontent.wordPreUp.content != "string") {
                            vm.modmodalcontentusepre = true;
                            parsecontent = parsecontent.wordPreUp.content.content.replace(
                                /<br\s*[\/]?>/g,
                                "\n"
                            );
                        }
                    }
                    if (!vm.modmodalcontentusepre)
                        vm.modmodalcontentusetable = true;
                    if (vm.modmodalcontentusepre) {
                        console.log(parsecontent);
                        vm.modmodalcontent.content.value = parsecontent;
                    } else {
                        if (parsecontent.hasOwnProperty("wordUp"))
                            parsecontent.wordUp.content = parsecontent.wordUp.content
                                .replace(/<br\s*[\/]?>/g, "\n")
                                .replace(/&nbsp;/g, "");
                        if (parsecontent.hasOwnProperty("wordDown"))
                            parsecontent.wordDown.content = parsecontent.wordDown.content
                                .replace(/<br\s*[\/]?>/g, "\n")
                                .replace(/&nbsp;/g, "");

                        console.log(parsecontent);
                        vm.modmodalcontent.content.value = JSON.stringify(
                            parsecontent
                        );
                    }
                } else {
                    items.content = items.content
                        .replace(/<br\s*[\/]?>/g, "\n")
                        .replace(/&nbsp;/g, "");
                    vm.modmodalcontent.content.value = items.content;
                }
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
        modifyFormSubmit(evt) {
            evt.preventDefault();
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
            let checkvalid = ["title", "content"];
            let status = true;
            console.log(checkvalid);
            checkvalid.forEach((element) => {
                console.log(element);
                console.log(vm.modmodalcontent[element]);
                if (!vm.modmodalcontent[element].invalid) {
                    status = false;
                } else {
                    if (
                        element === "content" &&
                        vm.modmodalcontent["content"].hasOwnProperty(
                            "jsonvalid"
                        )
                    ) {
                        if (!vm.modmodalcontent["content"].jsonvalid)
                            status = false;
                    }
                }
            });
            console.log(status);
            if (status) {
                let thiscontent;
                thiscontent = vm.adjustContentData(vm.modmodalcontent.content);
                if (!thiscontent) return;
                console.log(thiscontent);
                let formData = new FormData();
                for (var i = 0; i < this.modmodalcontent.files.length; i++) {
                    let file = this.modmodalcontent.files[i];
                    formData.append("fileToUpload[" + i + "]", file);
                }
                console.log(Object.keys(vm.modmodalcontent.boardannex));
                formData.append("deletefile", "");
                formData.append("seq", vm.modmodalcontent.seq);
                formData.append("title", vm.modmodalcontent.title.value);
                formData.append("content", thiscontent);
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
                        "Content-Type": "multipart/form-data",
                    },
                };
                const instance = axios.create({
                    withCredentials: true,
                });
                instance
                    .post(
                        "/php/views/misbulletin/misBulletinMod.php",
                        formData,
                        config
                    )
                    .then(
                        function (response) {
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
                    .catch(function (err) {
                        console.log(err);
                    });
            }
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
                    "Content-Type": "multipart/form-data",
                },
            };
            const instance = axios.create({
                withCredentials: true,
            });
            instance
                .post(
                    "/php/views/misbulletin/misBulletinMod.php",
                    formData,
                    config
                )
                .then(
                    function (response) {
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
                .catch(function (err) {
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
                .post("/php/views/misbulletin/misBulletinDel.php", params)
                .then(
                    function (response) {
                        const result = response.data;
                        vm.setalertMsg(result);
                        vm.settimeoutalertModal(1000);
                        vm.delBulletinModalShow = false;
                        vm.queryAgain();
                    }.bind(this)
                )
                .catch(function (err) {
                    console.log(err);
                });
        },
        //validation表單reset
        formReset() {
            let vm = this;
            //reset valid_data
            vm.form = {
                title: {
                    key: "title",
                    value: "",
                    invalid: false,
                },

                content: {
                    key: "content",
                    value: "",
                    invalid: false,
                },
                category: "system",
                filename: [],
                files: [],
            };
            vm.modmodalcontent = {
                seq: "",
                category: "",
                title: {
                    key: "title",
                    value: "",
                    invalid: false,
                },
                content: {
                    key: "content",
                    value: "",
                    invalid: false,
                },
                showhide: "",
                boardannex: {},
                files: "",
                filename: [],
            };
            vm.formcontentusetable = false;
            vm.formcontentusepre = false;
            vm.modmodalcontentusetable = false;
            vm.modmodalcontentusepre = false;
            vm.$nextTick(() => {
                vm.$v.$reset();
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
        adjustContentData(content) {
            let status = false;
            let thiscontent;
            let vm = this;
            let wordtype = ["wordUp", "wordDown", "wordPreUp", "wordPreDown"];
            //有勾選『自定義文字格式或使用表格』checkbox
            if (content.hasOwnProperty("jsonvalid")) {
                let parsecontentvalue = JSON.parse(content.value);
                console.log(parsecontentvalue);
                if (parsecontentvalue.hasOwnProperty("table")) {
                    status = true;
                    let tablekey = ["fields", "items"];
                    //檢查key是否有fields,items
                    for (let i = 0; i < tablekey.length; i++) {
                        if (
                            !parsecontentvalue.table.hasOwnProperty(tablekey[i])
                        ) {
                            vm.setalertMsg(
                                "公告內容若要使用表格顯示，table的value物件必須有key必需有fields、items兩個key"
                            );
                            vm.settimeoutalertModal(1200);
                            return;
                        }
                        console.log(
                            Array.isArray(parsecontentvalue.table[tablekey[i]])
                        );
                        if (
                            !Array.isArray(parsecontentvalue.table[tablekey[i]])
                        ) {
                            vm.setalertMsg(
                                "key:table -> " + tablekey[i] + "必須為陣列"
                            );
                            vm.settimeoutalertModal(1500);
                            return false;
                        }
                        parsecontentvalue.table[tablekey[i]].forEach(
                            (element) => {
                                if (
                                    Object.prototype.toString.call(element) !=
                                        "[object Object]" ||
                                    Object.keys(element) == 0
                                ) {
                                    vm.setalertMsg(
                                        "key->table的的陣列內容必須為物件且不為空物件"
                                    );
                                    vm.settimeoutalertModal(1500);
                                    return false;
                                }
                            }
                        );
                    }
                }
                for (let i = 0; i < wordtype.length; i++) {
                    if (parsecontentvalue.hasOwnProperty(wordtype[i])) {
                        console.log(wordtype[i]);
                        console.log(parsecontentvalue[wordtype[i]]);
                        status = true;
                        console.log(
                            Object.prototype.toString.call(
                                parsecontentvalue[wordtype[i]]
                            )
                        );
                        console.log(
                            Object.keys(parsecontentvalue[wordtype[i]])
                        );
                        if (
                            Object.prototype.toString.call(
                                parsecontentvalue[wordtype[i]]
                            ) != "[object Object]" ||
                            Object.keys(parsecontentvalue[wordtype[i]]) == 0
                        ) {
                            console.log(parsecontentvalue[wordtype[i]]);
                            vm.setalertMsg(
                                "key->" +
                                    wordtype[i] +
                                    "的value必須為物件且不為空物件"
                            );
                            vm.settimeoutalertModal(1500);
                            return false;
                        }
                        console.log(
                            parsecontentvalue[wordtype[i]].hasOwnProperty(
                                "content"
                            )
                        );
                        if (
                            !parsecontentvalue[wordtype[i]].hasOwnProperty(
                                "content"
                            ) ||
                            typeof parsecontentvalue[wordtype[i]]["content"] !=
                                "string"
                        ) {
                            vm.setalertMsg([
                                "key->" +
                                    wordtype[i] +
                                    "的value物件缺少key:content",
                                "且必須為字串",
                            ]);
                            vm.settimeoutalertModal(1500);
                            return false;
                        }
                        if (
                            wordtype[i] != "wordPreUp" &&
                            wordtype[i] != "wordPreDown"
                        ) {
                            parsecontentvalue[wordtype[i]][
                                "content"
                            ] = vm.replaceContentData(
                                parsecontentvalue[wordtype[i]]["content"]
                            );
                        }
                    }
                }
                if (!status) {
                    vm.setalertMsg([
                        "key:至少要有下列其中一個",
                        '["wordUp", "wordDown", "wordPreUp", "wordPreDown"]',
                    ]);
                    vm.settimeoutalertModal(1500);
                    return false;
                }
                console.log(parsecontentvalue);
                console.log(JSON.stringify(parsecontentvalue));
                thiscontent = JSON.stringify(parsecontentvalue);
            } else {
                let tempObj = {};
                thiscontent = content.value;
                //有勾選『自定義格式內容』checkbox
                if (vm.modmodalcontentusepre || vm.formcontentusepre) {
                    tempObj["wordPreUp"] = {
                        content: {
                            content: thiscontent.replace(/\n/g, "<br/>"),
                        },
                    };
                    thiscontent = JSON.stringify(tempObj);
                } else {
                    thiscontent = vm.replaceContentData(thiscontent);
                }
                console.log(thiscontent);
            }
            return thiscontent;
        },
        //content value 資料處理
        replaceContentData(content) {
            console.log(content);
            return (
                content // .replace(/\r\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
                    .replace(/\r\n/g, "<br/>")
                    // .replace(/\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
                    .replace(/\n/g, "<br/>")
                    .replace(/\s/g, "&nbsp;")
            );
        },
        //Tooltip的使用範例
        usetableTooltipExample() {
            return `<p>以物件傳入key為<span style="color:black;font-weight:bold;font-size:large">table</span>、<span style="color:black;font-weight:bold;font-size:large">wordUp</span>、<span style="color:black;font-weight:bold;font-size:large">wordDown</span>、<span style="color:black;font-weight:bold;font-size:large">wordPreUp</span>、<span style="color:black;font-weight:bold;font-size:large">wordPreDown</span>(選填)</p>
            <p>key若為其他，系統則不做判斷顯示，順序為wordPreUp，wordUp，wordDown，wordPreDown</p>
            <div style="border:1px solid #ccc;padding:5px;border-radius:10px;margin-bottom:5px">
            <p style="font-size:larger;font-weight:bold;text-decoration:underline">key : table的value為物件且必須有fields、items兩個key</p>
            <ul style="padding-left:20px;margin-bottom:0">
            <li><span style="font-size:large;font-weight:bold;text-decoration:underline">fields</span>為表格的表頭，以陣列包物件格式傳入</li>
            <ol style="padding-left:20px;margin-bottom:0">
            <li>每一筆物件就是一個表頭，物件順序跟顯示順序有關係</li>
            <li>物件的key有：key(須以items內每一筆資料的key相同，必填)、label(顯示的名稱，選填)、sortable(是否排序true/false，選填)</li>
            <li>格式若錯誤系統無法顯示</li>
            <li>example:[{"key":"category","label": "類別","sortable": true},{"key":"title","label": "標題","sortable": false}]</li>
            </ol>
            <li><span style="font-size:large;font-weight:bold;text-decoration:underline">items</span>為表格的資料內容，以陣列包物件格式傳入</li>
            <ol style="padding-left:20px;margin-bottom:0">
            <li>每一筆物件就是一列資料</li>
            <li>各物件內的key都要相同</li>
            <li>若要指定列的顏色</li>
            <ul style="padding-left:20px">
            <li>使用參數key : "_rowVariant"</li>
            <li>value : primary,secondary,success,warning,danger,info,light,dark</li>
            </ul>
            <li>若要指定資料格的顏色</li>
            <ul style="padding-left:20px">
            <li>使用參數key : "_cellVariants"</li>
            <li>格式為{"表頭":"color"}，color -> primary,secondary,success,warning,danger,info,light,dark</li>
            </ul>
            <li>格式若錯誤系統無法顯示</li>
            <li>example:{ "category": "值", "title": "值" ,"_rowVariant":"info", "_cellVariants":"danger"}</li>
            </ol>
            </ul>
            </div>
            <div style="border:1px solid #ccc;padding:5px;border-radius:10px">
            <p style="font-size:larger;font-weight:bold;text-decoration:underline">key : wordUp、wordDown的value以物件傳入</p>
            <ol style="padding-left:20px;margin-bottom:0">
            <li>wordUp代表在表格上方的文字、wordDown代表表格下方的文字</li>
            <li>物件格式為{"content":"文字內容(必填，若要換行輸入\\n換行符號)","color":"文字顏色","size":"文字大小","align":"文字位置(left,center,right)"}</li>
            <li>以上參數須符合css才能正常顯示，content為必填，其他參數為選填</li>
            </ol>
            </div>
            <div style="border:1px solid #ccc;padding:5px;border-radius:10px">
            <p style="font-size:larger;font-weight:bold;text-decoration:underline">key : wordPreUp、wordPreDown的value以物件傳入</p>
            <ol style="padding-left:20px;margin-bottom:0">
            <li>wordPreUp代表在表格上方的文字、wordPreDown代表在表格下方的文字</li>
            <li>物件格式為{"content":"文字內容(必填，若要換行輸入\\n換行符號)","color":"文字顏色","size":"文字大小"}</li>
            <li>資料內容將以html的&lt;pre&gt;標籤顯示</li>
            </ol>
            </div>`;
        },
        usepreTooltipExample() {
            return `<p>直接輸入文字內容，公告區顯示時的空格換行與格式會與輸入時一致</p>
            <p>資料內容將以html的&lt;pre&gt;標籤顯示</p>
            `;
        },
        //檢查是否為JSON Data
        checkIsJsonData(jsonData) {
            let status = true;
            if (Object.prototype.toString.call(jsonData) != "[object Object]") {
                try {
                    JSON.parse(jsonData);
                } catch (e) {
                    //console.log('Error data', e);
                    status = false;
                }
            }
            console.log(status);
            return status;
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="../../public/css/vuelidateYS.css"></style>
<style scoped>
.custom-select {
    width: 200px !important;
}
.input-title {
    width: 200px !important;
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
::v-deep .tooltip-inner {
    max-width: 500px !important;
    text-align: left !important;
}
::v-deep .tooltip-inner p {
    margin-bottom: 5px !important;
}
</style>

