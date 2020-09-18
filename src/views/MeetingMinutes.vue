<template>
    <div class="MeetingMinutes container">
        <commonQuery v-if="tabIndex != 0" />
        <b-card no-body>
            <b-tabs card v-model="tabIndex">
                <b-tab title="上傳" active>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="input-default">會議日期:</label>
                        </b-col>
                        <b-col sm="5">
                            <datepicker :date="form.date" :option="datepickerOptions"></datepicker>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="input-default">會議標題:</label>
                        </b-col>
                        <b-col sm="10">
                            <b-form-input v-model.trim="form.title" type="text"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="my-4">
                        <b-col sm="2">
                            <label for="textarea-large">
                                附件:
                                <br />(小於10MB)
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
                                accept="image/*, .pdf, .zip"
                            ></b-form-file>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col lg="12" class="pb-2">
                            <div class="text-center">
                                <b-button
                                    type="submit"
                                    variant="primary"
                                    @click.prevent="uploadFormSubmit()"
                                >上傳</b-button>
                            </div>
                        </b-col>
                    </b-row>
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
                                <br />(小於10MB)
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
                                accept="image/*, .pdf, .zip"
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
        {{getDate}}
        <br />
        <br />
        <br />
        {{depStaffRelation}}
    </div>
</template>

<script>
import axios from "axios";
import datepicker from "vue-datepicker/vue-datepicker-es6.vue";
import commonQuery from "@/components/commonQuery.vue";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "MeetingMinutes",
    data() {
        return {
            now: "",
            nowFormat: "",
            thisweekday: [],
            tabIndex: 0,
            form: {
                date: { time: "" },
                title: "",
                filename: [],
                files: [],
            },
            //upload form是否使用table checkbox
            formcontentusetable: false,
            //upload form是否使用pre checkbox
            formcontentusepre: false,
            fields: [
                {
                    key: "depID",
                    label: "部門",
                    sortable: true,
                },
                {
                    key: "title",
                    label: "會議標題",
                    sortable: true,
                },
                {
                    key: "date",
                    label: "會議日期",
                    sortable: true,
                },
                {
                    key: "filename",
                    label: "檔案列表",
                    sortable: true,
                },
            ],
            items: [],
            datepickerOptions: {
                type: "day",
                week: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                month: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
                format: "YYYY-MM-DD",
                placeholder: "",
                inputStyle: {
                    display: "inline-block",
                    padding: "5px",
                    "line-height": "22px",
                    "font-size": "16px",
                    "text-align": "center",
                    border: "2px solid #fff",
                    "box-shadow": "0 1px 3px 0 rgba(0, 0, 0, 0.2)",
                    "border-radius": "2px",
                    color: "#5F5F5F",
                    width: "150px",
                },
                color: {
                    header: "#ccc",
                    headerText: "#f00",
                },
                overlayOpacity: 0.5, // 0.5 as default
                dismissible: true, // as true as default
            },
            depConfig: {
                1001: "資訊通訊部",
                1002: "系統研發部",
                1003: "雲端AI(智慧)平台部",
            },
            depStaffRelation: {},
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
    created: function () {
        let vm = this;
        vm.now = vm.getDate.now;
        vm.nowFormat = vm.getDate.nowFormat;
        vm.thisweekday = vm.getDate.thisweekday;
        vm.form.date.time = vm.getDate.nowFormat;
        vm.SetCommonQueryData();
        vm.getBelongDepStaff();
    },
    mounted: function () {},
    components: {
        datepicker,
        commonQuery,
    },
    computed: {
        ...mapGetters({
            axiosResult: "commonaxios/get_axiosResult",
            loginData: "getlogin/get_loginData",
            queryResponse: "commonquery/get_queryResponse",
            DEFAULT_inputData: "commonquery/get_DEFAULT_inputData",
            DEFAULT_apiParams: "commonquery/get_DEFAULT_apiParams",
            tableBusy: "commonquery/get_tableBusy",
            getDate: "getdate/get_Date",
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
                    vm.setTimeOutAlertMsg(vm.queryResponse);
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
                // this.setTimeOutAlertMsg("選擇查詢條件");
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
            axiosAction: "commonaxios/axiosAction",
            setTimeOutAlertMsg: "alertmodal/set_setTimeOutAlertMsg",
            togglealertModal: "alertmodal/toggle_alertModal",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            queryAgain: "commonquery/do_queryAgain",
            setinputData: "commonquery/set_inputData",
            setapiParams: "commonquery/set_apiParams",
        }),
        SetCommonQueryData() {
            var vm = this;
            var meetingminutesqueryselected = "ALL";
            var meetingminutesqueryoptions = [
                { text: "雲端AI(智慧)平台部", value: "1003" },
                { text: "系統研發部", value: "1002" },
                { text: "資訊通訊部", value: "1001" },
                { text: "全選", value: "ALL" },
            ];
            let obj = JSON.parse(JSON.stringify(vm.DEFAULT_inputData));
            obj.options = meetingminutesqueryoptions;
            obj.selected = meetingminutesqueryselected;
            vm.setinputData(obj);

            let commonApiParams = JSON.parse(
                JSON.stringify(vm.DEFAULT_apiParams)
            );
            commonApiParams.normal.table = "meetingMinutes";
            commonApiParams.normal.attr = "depID";
            commonApiParams.normal.timeattr = "date";
            commonApiParams.normal.intervaltime = {
                date: [
                    [
                        vm.thisweekday[0] + " 00:00:00",
                        vm.thisweekday[1] + " 23:59:59",
                    ],
                ],
            };
            vm.setapiParams(commonApiParams);
        },
        getBelongDepStaff() {
            let vm = this;
            var params = {};
            params["methods"] = "POST";
            params["whichFunction"] = "CommonSqlSyntaxQuery_";
            let thiswhere = Object.keys(vm.depConfig);
            let thissymbols = ["equal", "equal", "equal"];
            params["condition"] = {
                condition_1: {
                    table: "user",
                    fields: ["uID", "uName", "noumenonID", "noumenonType"],
                    where: { noumenonID: thiswhere },
                    orderby: ["desc", "lastUpdateTime"],
                    limit: ["ALL"],
                    symbols: { noumenonID: thissymbols },
                },
            };
            console.log(params);
            console.log(JSON.stringify(params["condition"]));
            let anyerror = false;

            let temp = [
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2587,
                    uName: "王亦薇",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2596,
                    uName: "林建忠",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2593,
                    uName: "黃均珮",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2583,
                    uName: "詹竣傑",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2584,
                    uName: "龔承德",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1003,
                    uID: 2493,
                    uName: "蔡宜珊",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2586,
                    uName: "蔡令仕",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1001,
                    uID: 2594,
                    uName: "韓仁智",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1001,
                    uID: 2580,
                    uName: "劉哲良",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1003,
                    uID: 2521,
                    uName: "洪誌宏",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1003,
                    uID: 2522,
                    uName: "吳俊輝",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1003,
                    uID: 2581,
                    uName: "曾冠力",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2406,
                    uName: "吳炯德",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1001,
                    uID: 2475,
                    uName: "王嘉帷",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1001,
                    uID: 2494,
                    uName: "蔡靜宜",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1001,
                    uID: 2500,
                    uName: "張書瑋",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2510,
                    uName: "吳宗穎",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1001,
                    uID: 2534,
                    uName: "羅寶明",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2547,
                    uName: "吳文瑞",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1001,
                    uID: 2549,
                    uName: "劉騏輔",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2554,
                    uName: "龍姿伃",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2559,
                    uName: "蔡蕙如",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2560,
                    uName: "高秀蘋",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2565,
                    uName: "李芳伶",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2574,
                    uName: "黃國龍",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2577,
                    uName: "劉景裕",
                },
                {
                    noumenonType: "dep",
                    noumenonID: 1002,
                    uID: 2588,
                    uName: "林孟萱",
                },
            ];

            let itemsobj = {};
            temp.forEach((element) => {
                itemsobj[element.uID] = String(element.noumenonID);
            });
            vm.depStaffRelation = itemsobj;
            // vm.axiosAction(params)
            //     .then(() => {
            //         var result = vm.axiosResult;
            //         console.log(result);
            //         console.log(JSON.stringify(result["QueryTableData"]));
            //         if (result["Response"] == "ok") {
            //             if (result["QueryTableData"].length == 0) {
            //                 vm.setTimeOutAlertMsg("查無資料");
            //                 anyerror = true;
            //             } else {
            //                 let itemsobj = {};
            //                 result["QueryTableData"].forEach((element) => {
            //                     itemsobj[element.uID] = String(
            //                         element.noumenonID
            //                     );
            //                 });
            //                 vm.depStaffRelation = itemsobj;
            //             }
            //         } else {
            //             vm.setTimeOutAlertMsg(result["Response"]);
            //             anyerror = true;
            //         }
            //     })
            //     .catch(function (err) {
            //         console.log(err);
            //         vm.setTimeOutAlertMsg(err);
            //         anyerror = true;
            //     })
            //     .finally(() => {
            //         console.log("done");
            //         if (anyerror) vm.settimeoutalertModal();
            //     });
        },
        //公告上傳
        uploadFormSubmit() {
            let vm = this;
            console.log("call api");
            let formData = new FormData();
            console.log(this.form.files);
            for (var i = 0; i < this.form.files.length; i++) {
                let file = this.form.files[i];
                console.log(file);
                //檢察檔案大小是否大於10MB(1024*1024*10)，若大於就不傳到後端
                if (file.size > 1024 * 1024 * 10) {
                    vm.setTimeOutAlertMsg("檔名:" + file.name + "檔案太大");
                    vm.settimeoutalertModal(1200);
                    return;
                }
                formData.append("fileToUpload[" + i + "]", file);
            }

            formData.append("title", vm.form.title);
            formData.append("date", vm.form.date.time);
            formData.append("filename", vm.form.filename);
            formData.append("depID", vm.depStaffRelation[vm.loginData.account]);
            formData.append("account", vm.loginData.account);

            vm.togglealertModal(true);
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
                    "/php/views/meetingminutes/meetingMinutesAdd.php",
                    formData,
                    config
                )
                .then(
                    function (response) {
                        const result = response.data;
                        vm.setTimeOutAlertMsg(result);
                        // var altertime = 0;
                        // if (result.length == 1) {
                        //     altertime = 1200;
                        // } else if (result.length < 4) {
                        //     altertime = 1500;
                        // } else {
                        //     altertime = 2500;
                        // }
                        // vm.settimeoutalertModal(altertime);
                        // vm.formReset();
                    }.bind(this)
                )
                .catch(function (err) {
                    console.log(err);
                    console.log(err.response.status);
                    if (err.response.status === 413) {
                        vm.setTimeOutAlertMsg(
                            "Error 413: Request entity too large，檔案太大"
                        );
                    } else {
                        vm.setTimeOutAlertMsg(err);
                    }
                    vm.settimeoutalertModal();
                })
                .finally(() => {
                    console.log("done");
                    setTimeout(() => {
                        vm.togglealertModal(false);
                    }, 1200);
                });
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
                    vm.setTimeOutAlertMsg("上傳附件數量大於原附件數量");
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
                        vm.setTimeOutAlertMsg(
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
                    //檢察檔案大小是否大於10MB(1024*1024*10)，若大於就不傳到後端
                    if (file.size > 1024 * 1024 * 10) {
                        vm.setTimeOutAlertMsg("檔名:" + file.name + "檔案太大");
                        vm.settimeoutalertModal(1200);
                        return;
                    }
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
                            console.log(result);
                            vm.setTimeOutAlertMsg(result);
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
                        }.bind(this)
                    )
                    .catch(function (err) {
                        console.log(err);
                        console.log(err.response.status);
                        if (err.response.status === 413) {
                            vm.setTimeOutAlertMsg(
                                "Error 413: Request entity too large，檔案太大"
                            );
                        } else {
                            vm.setTimeOutAlertMsg(err);
                        }
                        vm.settimeoutalertModal();
                    })
                    .finally(() => {
                        console.log("done");
                        setTimeout(() => {
                            vm.queryAgain();
                        }, 1200);
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
                        vm.setTimeOutAlertMsg(result);
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
                        vm.setTimeOutAlertMsg(result);
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
                            vm.setTimeOutAlertMsg(
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
                            vm.setTimeOutAlertMsg(
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
                                    vm.setTimeOutAlertMsg(
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
                            vm.setTimeOutAlertMsg(
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
                            vm.setTimeOutAlertMsg([
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
                    vm.setTimeOutAlertMsg([
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

