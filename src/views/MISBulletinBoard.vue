<template>
    <div class="MISBulletinBoard container">
        <commonQuery />
        <br />
        <div style="width:100%;min-height:260px" v-if="boardtitle || items.length != 0">
            <div class="card text-center">
                <div class="card-header" style="font-size:20px">公告內容</div>
                <div class="card-body" style="min-height:260px">
                    <h5 class="card-title">{{ boardtitle }}</h5>
                    <pre
                        v-if="boardcontentPREUP != ''"
                        v-html="boardcontentPREUP.content"
                        :style="[Object.keys(boardcontentPREUP).length !=1 ? checkContentStyle(boardcontentPREUP):{}]"
                        style="font-size:1rem;text-align:left !important"
                    ></pre>
                    <!-- :style condition https://stackoverflow.com/questions/48455909/condition-in-v-bindstyle-vuejs -->
                    <p
                        v-for="(item,index) in boardcontentUP.content"
                        v-html="item"
                        :key="index"
                        class="card-text"
                        :style="[Object.keys(boardcontentUP).length !=1 ? checkContentStyle(boardcontentUP):{}]"
                        :class="{ textleft: item.length> 110 }"
                    ></p>
                    <b-table
                        responsive
                        outlined
                        hover
                        head-row-variant="primary"
                        :fields="contenfields"
                        :items="contentitems"
                        v-if="contentitems.length != 0"
                        style="text-align:left"
                    ></b-table>
                    <p
                        v-for="(item,index) in boardcontentDOWN.content"
                        v-html="item"
                        :key="index+'_'"
                        class="card-text"
                        :style="[Object.keys(boardcontentDOWN).length !=1 ? checkContentStyle(boardcontentDOWN):{}]"
                        :class="{ textleft: item.length> 110 }"
                    >{{index}}</p>
                    <pre
                        v-if="boardcontentPREDOWN != ''"
                        v-html="boardcontentPREDOWN.content"
                        :style="[Object.keys(boardcontentPREDOWN).length !=1 ? checkContentStyle(boardcontentPREDOWN):{}]"
                        style="font-size:1rem;text-align:left !important"
                    ></pre>
                </div>
                <div class="card-footer text-muted">
                    <div v-show="Object.keys(boardannex).length > 0">
                        <span>附件:</span>
                        <div
                            v-for="(item, key,index) in boardannex"
                            :key="index"
                            style="display:inline-block;position: relative;margin-right:15px;margin-bottom:10px"
                        >
                            <b-button
                                pill
                                variant="outline-info"
                                target="_blank"
                                @click.prevent="previewfile(item)"
                            >{{key}}</b-button>
                            <div
                                class="downloadfilebtn"
                                @click="onDownload(item,key)"
                                target="_blank"
                            >
                                <font-awesome-icon :icon="['fas', 'download']" size="lg" />
                            </div>
                        </div>
                    </div>
                    <small class="mt-2">發佈日期: {{boardtime}}</small>
                </div>
            </div>
        </div>
        <br />
        <b-table
            sticky-header="430px"
            responsive
            hover
            :busy="tableBusy"
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
    name: "MISBulletinBoard",
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
            contenfields:[],
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
        };
    },
    created: function () {
        this.SetCommonQueryData();
        this.LatestBulletinDataQuery();
        // this.setLatestBulletin({
        //     category: "system",
        //     showhide: 1,
        //     seq: 14,
        //     lastUpdateTime: "2020-08-07 14:40:34",
        //     title: "test",
        //     filename: "",
        //     content:
        //         '{"wordUp":{"color":"red","content":"Hello aaa<br/>789","size":"30px"},"wordPreDown":{"content":"sfsdfs \\n adkl;adkas;d \\n hjhfjkhkj   hjklhadjkasd    ioueoiqhf","color":"blue"}}',
        //     creatorID: "2493",
        //     createTime: "2020-08-07 14:40:34",
        // });
        // this.setLatestBulletin({
        //     category: "system",
        //     showhide: 1,
        //     seq: 13,
        //     lastUpdateTime: "2020-08-10 11:56:46",
        //     title: "2020/07_金智洋重要系統IP對照表",
        //     filename: "重要系統IP對照表.pdf",
        //     content: {
        //         table: [
        //             {
        //                 System: "IoT/PDM",
        //                 Note:
        //                     "22、3687只開放金智洋網段連入維護使用，80、443、8443為網頁服務對所有人開放",
        //                 Location: "OFCO2",
        //                 "External IP": "211.20.223.148",
        //                 Port: "#NOTE",
        //                 "Internal IP": "172.16.2.55",
        //             },
        //             {
        //                 System: "KingMakerSQL",
        //                 Note: "",
        //                 Location: "OFCO2",
        //                 "External IP": "NA",
        //                 Port: "",
        //                 "Internal IP": "172.16.2.57",
        //             },
        //             {
        //                 _rowVariant: "info",
        //                 System: "IoT MES網頁",
        //                 Note: "",
        //                 Location: "Sapido",
        //                 "External IP": "NA",
        //                 Port: "",
        //                 "Internal IP": "192.168.39.75",
        //             },
        //             {
        //                 _rowVariant: "info",
        //                 System: "IoT 開發區",
        //                 Note: "",
        //                 Location: "Sapido",
        //                 "External IP": "211.22.242.15",
        //                 Port: "8080,8888",
        //                 "Internal IP": "192.168.39.71",
        //             },
        //             {
        //                 _rowVariant: "info",
        //                 System: "IoT 測試區",
        //                 Note: "",
        //                 Location: "OFCO2",
        //                 "External IP": "NA",
        //                 Port: "",
        //                 "Internal IP": "192.168.88.248",
        //             },
        //             {
        //                 _rowVariant: "info",
        //                 System: "PDM 開發區",
        //                 Note: "",
        //                 Location: "Sapido",
        //                 "External IP": "211.22.242.18",
        //                 Port: "",
        //                 "Internal IP": "192.168.39.73",
        //             },
        //             {
        //                 System: "KingMaker正式區",
        //                 Note:
        //                     "http://192.168.88.27/servlet/jform?file=KingMaker.dat&locale=TW 內部 http://211.22.242.16/servlet/jform?file=KingMaker.dat&locale=TW 外部",
        //                 Location: "Sapido",
        //                 "External IP": "211.22.242.16",
        //                 Port: "80",
        //                 "Internal IP": "192.168.88.27",
        //             },
        //             {
        //                 System: "KingMaker開發區(QueenMaker)",
        //                 Note:
        //                     "http://192.168.88.27/servlet/jform?file=QueenMaker.dat&locale=TW 內部 http://211.22.242.16/servlet/jform?file=QueenMaker.dat&locale=TW 外部",
        //                 Location: "Sapido",
        //                 "External IP": "211.22.242.16",
        //                 Port: "80",
        //                 "Internal IP": "192.168.88.27",
        //             },
        //             {
        //                 System: "MIS公告區",
        //                 Note: "",
        //                 Location: "Sapido",
        //                 "External IP": "NA",
        //                 Port: "8888",
        //                 "Internal IP": "192.168.39.75",
        //             },
        //             {
        //                 System: "RedMine",
        //                 Note: "https://211.22.242.16/",
        //                 Location: "Sapido",
        //                 "External IP": "211.22.242.16",
        //                 Port: "443",
        //                 "Internal IP": "192.168.88.66",
        //             },
        //         ],
        //         wordDown: { content: "附上相關附件" },
        //     },
        //     creatorID: "",
        //     createTime: "2020-08-10 11:17:51",
        // });
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
            commonModalDetail: "usemodal/get_commonModalDetail",
        }),
    },
    watch: {
        queryResponse: {
            handler() {
                var vm = this;
                vm.reset([]);
                // vm.changetableBusy();
                if (
                    vm.queryResponse == "查無資料" ||
                    vm.queryResponse == "時間尚未選擇"
                ) {
                    vm.setalertMsg(vm.queryResponse);
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
                            var thisfilename = vm.queryResponse[i][
                                "filename"
                            ].split(",");
                            itemsobj["annex"] = thisfilename;
                        }
                        itemsarray.push(itemsobj);
                    }
                }
                vm.items = itemsarray;
                vm.totalRows = itemsarray.length;
            },
        },
    },
    methods: {
        ...mapActions({
            axiosAction: "commonaxios/axiosAction",
            setalertMsg: "alertmodal/set_alertMsg",
            togglealertModal: "alertmodal/toggle_alertModal",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            changetableBusy: "commonquery/change_tableBusy",
            setqueryResponse: "commonquery/set_queryResponse",
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
        //查詢最新五筆
        LatestBulletinDataQuery() {
            var vm = this;
            vm.setalertMsg("請稍候...");
            vm.togglealertModal(true);
            vm.changetableBusy();
            var params = {};
            params["methods"] = "POST";
            params["whichFunction"] = "CommonSqlSyntaxQuery";
            params["table"] = "misBulletin";
            params["purpose"] = "query";
            params["where"] = {};
            params["where"]["showhide"] = 1;
            params["orderby"] = ["desc", "lastUpdateTime"];
            params["limit"] = ["0", "5"];
            params["symbols"] = {};
            params["symbols"]["showhide"] = "equal";
            vm.axiosAction(params)
                .then(() => {
                    var result = vm.axiosResult;
                    vm.togglealertModal(false);
                    if (result["Response"] == "ok") {
                        if (result["QueryTableData"].length == 0) {
                            vm.setalertMsg("查無資料");
                            vm.settimeoutalertModal();
                        } else {
                            var itemsarray = [];
                            vm.setLatestBulletin(result["QueryTableData"][0]);
                            for (
                                var i = 0;
                                i < result["QueryTableData"].length;
                                i++
                            ) {
                                var itemsobj = {};
                                itemsobj["category"] =
                                    vm.categorytoCH[
                                        result["QueryTableData"][i]["category"]
                                    ];
                                itemsobj["title"] =
                                    result["QueryTableData"][i]["title"];
                                itemsobj["releasedate"] =
                                    result["QueryTableData"][i][
                                        "lastUpdateTime"
                                    ];
                                itemsobj["content"] =
                                    result["QueryTableData"][i]["content"];
                                if (
                                    result["QueryTableData"][i]["filename"] !=
                                    ""
                                ) {
                                    var thisfilename = result["QueryTableData"][
                                        i
                                    ]["filename"].split(",");
                                    itemsobj["annex"] = thisfilename;
                                }
                                itemsarray.push(itemsobj);
                            }
                            vm.items = itemsarray;
                            vm.totalRows = itemsarray.length;
                        }
                    } else {
                        vm.setalertMsg(result["Response"]);
                        vm.settimeoutalertModal();
                    }
                    vm.changetableBusy();
                })
                .catch(function (err) {
                    console.log(err);
                    vm.setalertMsg(err);
                    vm.settimeoutalertModal();
                });
        },
        //表格點擊
        onRowClicked(items) {
            var vm = this;
            vm.reset(["items","totalRows","currentPage"]);
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
            });
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
                if (parsecontent.hasOwnProperty("table"))
                    vm.contenfields = parsecontent.table.fields;
                    vm.contentitems = parsecontent.table.items;
                if (parsecontent.hasOwnProperty("wordUp")) {
                    if (!Array.isArray(parsecontent.wordUp.content))
                        parsecontent.wordUp.content = parsecontent.wordUp.content.split(
                            "<br/>"
                        );
                    vm.boardcontentUP = parsecontent.wordUp;
                }
                if (parsecontent.hasOwnProperty("wordDown")) {
                    if (!Array.isArray(parsecontent.wordDown.content))
                        parsecontent.wordDown.content = parsecontent.wordDown.content.split(
                            "<br/>"
                        );
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