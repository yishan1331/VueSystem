<template>
    <div class="BulletinBoard container">
        <b-row class="mb-3">
            <b-col sm="3">
                <h4>公告區</h4>
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
                <b-col sm="12">
                    <commonQuery />
                </b-col>
            </b-row>
        </b-collapse>

        <div
            id="board"
            style="width: 100%; min-height: 260px"
            v-if="boardtitle || items.length != 0"
        >
            <div class="card text-center">
                <div class="card-header" style="font-size: 20px">公告內容</div>
                <div class="card-body" style="min-height: 260px">
                    <h5 class="card-title">{{ boardtitle }}</h5>
                    <pre
                        v-if="boardcontentPREUP != ''"
                        v-html="boardcontentPREUP.content"
                        :style="[
                            Object.keys(boardcontentPREUP).length != 1
                                ? checkContentStyle(boardcontentPREUP)
                                : {},
                        ]"
                        style="font-size: 1rem; text-align: left !important"
                    ></pre>
                    <!-- :style condition https://stackoverflow.com/questions/48455909/condition-in-v-bindstyle-vuejs -->
                    <p
                        v-for="(item, index) in boardcontentUP.content"
                        v-html="item"
                        :key="index"
                        class="card-text"
                        :style="[
                            Object.keys(boardcontentUP).length != 1
                                ? checkContentStyle(boardcontentUP)
                                : {},
                        ]"
                        :class="{ textleft: item.length > 110 }"
                    ></p>
                    <b-table
                        responsive
                        outlined
                        hover
                        head-row-variant="primary"
                        :fields="contenfields"
                        :items="contentitems"
                        v-if="contentitems.length != 0"
                        style="text-align: left"
                    ></b-table>
                    <p
                        v-for="(item, index) in boardcontentDOWN.content"
                        v-html="item"
                        :key="index + '_'"
                        class="card-text"
                        :style="[
                            Object.keys(boardcontentDOWN).length != 1
                                ? checkContentStyle(boardcontentDOWN)
                                : {},
                        ]"
                        :class="{ textleft: item.length > 110 }"
                    >
                        {{ index }}
                    </p>
                    <pre
                        v-if="boardcontentPREDOWN != ''"
                        v-html="boardcontentPREDOWN.content"
                        :style="[
                            Object.keys(boardcontentPREDOWN).length != 1
                                ? checkContentStyle(boardcontentPREDOWN)
                                : {},
                        ]"
                        style="font-size: 1rem; text-align: left !important"
                    ></pre>
                </div>
                <div class="card-footer text-muted">
                    <div v-show="Object.keys(boardannex).length > 0">
                        <span>附件:</span>
                        <div
                            v-for="(item, key, index) in boardannex"
                            :key="index"
                            style="
                                display: inline-block;
                                position: relative;
                                margin-right: 15px;
                                margin-bottom: 10px;
                            "
                        >
                            <b-button
                                pill
                                variant="outline-info"
                                target="_blank"
                                @click.prevent="previewfile(item)"
                                >{{ key }}</b-button
                            >
                            <div
                                class="downloadfilebtn"
                                @click="onDownload(item, key)"
                                target="_blank"
                            >
                                <font-awesome-icon
                                    :icon="['fas', 'download']"
                                    size="lg"
                                />
                            </div>
                        </div>
                    </div>
                    <small class="mt-2">發佈日期: {{ boardtime }}</small>
                </div>
            </div>
        </div>
        <br />
        <b-table
            sticky-header="430px"
            responsive
            hover
            :items="items"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
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
        <b-row class="justify-content-md-center" v-if="items.length != 0">
            <b-col cols="12" md="4">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="fill"
                    size="sm"
                ></b-pagination>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from "axios";
import commonQuery from "@/components/commonQuery.vue";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "BulletinBoard",
    data() {
        return {
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
            ],
            items: [],
            contenfields: [],
            contentitems: [],
            boardtitle: "",
            boardcontentUP: "",
            boardcontentDOWN: "",
            boardcontentPREUP: "",
            boardcontentPREDOWN: "",
            boardannex: {},
            boardtime: "",
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            categorytoCH: {
                network: "網路",
                PC: "個人電腦",
                system: "系統",
            },
            collapseVisible: false,

            test_data: [
                {
                    category: "system",
                    title: "2021年3月13號(六)因擴廠作業需求，將進行斷電施工，系統關機通知",
                    releasedate: "2021-03-12 18:27:42",
                    content:
                        "因配合產線施工工程，2021年1月9號(六)早上06-00至晚上06-00需進行斷電，這段時間內系統將無法使用，請各位同仁在1月8號(五)下班前將電腦關機並拔除插頭，造成不便敬請見諒。",
                    filename: "",
                },
                {
                    category: "system",
                    title: "2021年1月30號(六)因擴廠作業需求，將進行斷電施工，系統關機通知",
                    releasedate: "2021-01-29 18:01:41",
                    content:
                        "因配合產線施工工程，2021年1月３０號(六)早上09-00至晚上18-00需進行斷電施工，這段時間內系統將無法使用，請各位同仁在1月29號(五)下班前將電腦關機並拔除插頭，造成不便敬請見諒。",
                    filename: "",
                },
                {
                    category: "system",
                    title: "防火牆異動作業",
                    releasedate: "2020-09-29 18:03:32",
                    content:
                        "9/23(三)配合防火牆異動作業12-30~13-00，造成不便請多包涵!",
                    filename: "",
                },
                {
                    category: "PC",
                    title: "請各位小心釣魚網站",
                    releasedate: "2020-01-16 10:21:56",
                    content:
                        "公司內部同仁遇到有網站偽裝成防毒軟體 發送訊息警示您中毒了請立即更新防毒軟體 當心按下去有可能就中病毒或被駭客入侵 請各位同仁多加注意",
                    filename: "",
                },
                {
                    category: "network",
                    title: "Google Play Store騙錢軟體",
                    releasedate: "2020-01-20 15:03:13",
                    content:
                        "現行App提供免費試用期，俟用戶滿意才需要付款，若不喜歡就需取消訂閱。普通情況下，大部份用戶是把測試版移除，即使未終止訂閱開發商也不會再收取費用。但安全廠商Sophos去年發現有24款AndroidApp，它們都只是QR讀取器、指南針或計算機等簡單功能，但若用戶在免費期（例如3天）截止前沒有主動終止訂閱，就會被索取1年100到240美元的高額費用，光是移除測試版是沒有用的。因此安全廠商Sophos將此類App稱為騙錢軟體（fleeceware）。",
                    filename: "",
                },
            ],
        };
    },
    created: function () {
        this.SetCommonQueryData();
        this.LatestBulletinDataQuery();
    },
    mounted: function () {
        this.totalRows = this.items.length;
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
            DEFAULT_inputData: "commonquery/get_DEFAULT_inputData",
            DEFAULT_apiParams: "commonquery/get_DEFAULT_apiParams",
        }),
    },
    watch: {
        queryResponse: {
            handler() {
                var vm = this;
                vm.reset([]);
                if (
                    vm.queryResponse == "查無資料" ||
                    vm.queryResponse == "時間尚未選擇"
                ) {
                    vm.setTimeOutAlertMsg(vm.queryResponse);
                    vm.settimeoutalertModal();
                    return;
                }
                var itemsarray = [];
                for (var i = 0; i < vm.queryResponse.length; i++) {
                    vm.setLatestBulletin(vm.queryResponse[0]);
                    var itemsobj = {};
                    if (vm.queryResponse[i]["showhide"] == 1) {
                        itemsobj["category"] =
                            vm.categorytoCH[vm.queryResponse[i]["category"]];
                        itemsobj["title"] = vm.queryResponse[i]["title"];
                        itemsobj["releasedate"] =
                            vm.queryResponse[i]["lastUpdateTime"];
                        itemsobj["content"] = vm.queryResponse[i]["content"];
                        if (vm.queryResponse[i]["filename"] != "") {
                            var thisfilename =
                                vm.queryResponse[i]["filename"].split(",");
                            itemsobj["annex"] = thisfilename;
                        }
                        itemsarray.push(itemsobj);
                    }
                }
                vm.items = itemsarray;
                vm.totalRows = itemsarray.length;
                vm.collapseVisible = false;
            },
        },
    },
    methods: {
        ...mapActions({
            axiosPostAction: "commonaxios/axiosPostAction",
            setTimeOutAlertMsg: "alertmodal/set_setTimeOutAlertMsg",
            togglealertModal: "alertmodal/toggle_alertModal",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            changetableBusy: "commonquery/change_tableBusy",
            setqueryResponse: "commonquery/set_queryResponse",
            setinputData: "commonquery/set_inputData",
            setapiParams: "commonquery/set_apiParams",
        }),
        SetCommonQueryData() {
            var vm = this;
            var misbulletinqueryselected = "ALL";
            var misbulletinqueryoptions = [
                { value: "system", text: "系統" },
                { value: "PC", text: "個人電腦" },
                { value: "network", text: "網路" },
                { value: "ALL", text: "全選" },
            ];
            let obj = JSON.parse(JSON.stringify(vm.DEFAULT_inputData));
            obj.options = misbulletinqueryoptions;
            obj.selected = misbulletinqueryselected;
            vm.setinputData(obj);

            let commonApiParams = JSON.parse(
                JSON.stringify(vm.DEFAULT_apiParams)
            );
            commonApiParams.normal.table = "misBulletin";
            commonApiParams.normal.attr = "category";
            vm.setapiParams(commonApiParams);
        },

        //查詢最新五筆
        LatestBulletinDataQuery() {
            var vm = this;
            let params = {};
            params["url"] = "api/YS/2.0/my/CommonUse/SqlSyntax";
            params["urlparams"] = {
                getSqlSyntax: "yes",
            };
            let post_data = {
                condition_1: {
                    fields: "",
                    table: "misBulletin",
                    orderby: ["desc", "lastUpdateTime"],
                    limit: [0, 5],
                    where: { showhide: [1] },
                    symbols: { showhide: ["equal"] },
                    intervaltime: "",
                    union: "",
                    subquery: "",
                },
            };
            params["postdata"] = post_data;
            let anyerror = false;
            vm.togglealertModal(true);
            vm.axiosPostAction(params)
                .then(() => {
                    var result = vm.axiosResult;
                    console.log(result);
                    vm.togglealertModal(false);
                    if (result.status != 200) {
                        vm.setTimeOutAlertMsg(result.data);
                        return;
                    }
                    if (result.data["Response"] === "ok") {
                        if (result.data["QueryTableData"].length == 0) {
                            vm.setTimeOutAlertMsg("查無資料");
                        } else {
                            var itemsarray = [];
                            vm.setLatestBulletin(result.data["QueryTableData"][0]);
                            for (
                                var i = 0;
                                i < result.data["QueryTableData"].length;
                                i++
                            ) {
                                var itemsobj = {};
                                itemsobj["category"] =
                                    vm.categorytoCH[
                                        result.data["QueryTableData"][i]["category"]
                                    ];
                                itemsobj["title"] =
                                    result.data["QueryTableData"][i]["title"];
                                itemsobj["releasedate"] =
                                    result.data["QueryTableData"][i][
                                        "lastUpdateTime"
                                    ];
                                itemsobj["content"] =
                                    result.data["QueryTableData"][i]["content"];
                                if (
                                    result.data["QueryTableData"][i]["filename"] !=
                                    ""
                                ) {
                                    var thisfilename =
                                        result.data["QueryTableData"][i][
                                            "filename"
                                        ].split(",");
                                    itemsobj["annex"] = thisfilename;
                                }
                                itemsarray.push(itemsobj);
                            }
                            vm.items = itemsarray;
                            vm.totalRows = itemsarray.length;
                        }
                    } else {
                        vm.setTimeOutAlertMsg(result.data["Response"]);
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
                });
        },

        //表格點擊
        onRowClicked(items) {
            var vm = this;
            vm.reset(["items", "totalRows", "currentPage"]);
            console.log(items);
            vm.boardtitle = items.title;
            vm.setLatestBulletinContent(items);
            vm.boardtime = items.releasedate;
            if (typeof items.annex != "undefined") {
                for (var i = 0; i < items.annex.length; i++) {
                    vm.boardannex[items.annex[i]] =
                        "./misbulletinfiles/" + items.annex[i];
                }
            }
            //畫面scroll移至最上方
            window.scrollTo(0, 0);
            // window.scrollTo({
            //     top: 0,
            //     left: 0,
            //     behavior: "smooth",
            // });
        },

        //附件下載
        onDownload(path, filename) {
            axios({
                url: path,
                method: "GET",
                responseType: "blob",
            }).then((response) => {
                var fileURL = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                var fileLink = document.createElement("a");
                fileLink.href = fileURL;
                fileLink.setAttribute("download", filename);
                document.body.appendChild(fileLink);
                fileLink.click();
                document.body.removeChild(fileLink);
            });
        },

        //檔案預覽開啟頁面
        previewfile(filepath) {
            window.open(
                filepath,
                "vueSystem",
                "vueSystem",
                "statusbar=no,scrollbars=yes,status=yes,resizable=yes"
            );
        },

        //push到最新公告區
        setLatestBulletin(data) {
            console.log(data);
            console.log(JSON.stringify(data));
            var vm = this;
            vm.boardtitle = data["title"];
            vm.setLatestBulletinContent(data);
            vm.boardtime = data["lastUpdateTime"];
            if (data["filename"] != "") {
                var thisfilename = data["filename"].split(",");
                for (var j = 0; j < thisfilename.length; j++) {
                    vm.boardannex[thisfilename[j]] =
                        "./misbulletinfiles/" + thisfilename[j];
                }
            }
        },

        //data reset
        reset(keep) {
            var def = this.$options.data();
            for (var i = 0; i < keep.length; i++) {
                def[keep[i]] = this[keep[i]];
            }
            Object.assign(this.$data, def);
            //https://codepen.io/karimcossutti/pen/ObXyKq
        },

        setLatestBulletinContent(items) {
            let vm = this;
            console.log(items.content);
            if (vm.checkIsJsonData(items.content)) {
                let parsecontent = items.content;
                if (
                    Object.prototype.toString.call(items.content) !=
                    "[object Object]"
                )
                    parsecontent = JSON.parse(parsecontent);
                console.log(parsecontent);
                if (parsecontent.hasOwnProperty("table")) {
                    vm.contenfields = parsecontent.table.fields;
                    vm.contentitems = parsecontent.table.items;
                }
                if (parsecontent.hasOwnProperty("wordUp")) {
                    if (!Array.isArray(parsecontent.wordUp.content))
                        parsecontent.wordUp.content =
                            parsecontent.wordUp.content.split("<br/>");
                    vm.boardcontentUP = parsecontent.wordUp;
                }
                if (parsecontent.hasOwnProperty("wordDown")) {
                    if (!Array.isArray(parsecontent.wordDown.content))
                        parsecontent.wordDown.content =
                            parsecontent.wordDown.content.split("<br/>");
                    vm.boardcontentDOWN = parsecontent.wordDown;
                }
                if (parsecontent.hasOwnProperty("wordPreUp"))
                    vm.boardcontentPREUP = parsecontent.wordPreUp.content;
                if (parsecontent.hasOwnProperty("wordPreDown"))
                    vm.boardcontentPREDOWN = parsecontent.wordPreDown.content;
            } else {
                let temp = {};
                temp["content"] = items.content.split("<br/>");
                vm.boardcontentUP = temp;
            }
        },

        checkIsJsonData(jsonData) {
            let status = true;
            console.log(jsonData);
            console.log(Object.prototype.toString.call(jsonData));
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

        checkContentStyle(style) {
            let temp = {};
            console.log(style);
            Object.entries(style).forEach((element) => {
                if (element[0] === "align") temp["text-align"] = element[1];
                if (element[0] === "color") temp["color"] = element[1];
                if (element[0] === "size") temp["font-size"] = element[1];
            });
            return temp;
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.custom-select {
    width: 200px !important;
}
.card-title {
    font-size: 25px;
}
.textleft {
    text-align: left;
    text-indent: 35px;
}
.downloadfilebtn {
    position: absolute;
    top: 20px;
    cursor: pointer;
    right: -10px;
    width: 21.328px;
    height: 21.328px;
}
.downloadfilebtn:hover {
    background: #d0d0d0;
}
</style>