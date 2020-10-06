<template>
    <div class="export">
        <!-- exportStart : {{exportStart}} | exportEnd : {{exportEnd}} | exportCost : {{exportCost}} -->
    </div>
</template>

<script>
import jsPDF from "jspdf"; // export pdf
import "jspdf-autotable";
// import "../../js/font/msjh.js"; //微軟正黑體.ttf
import { mapGetters, mapActions } from "vuex";
export default {
    name: "export",
    data() {
        return {
            isInit:true,
            //測試匯出PDF時間
            exportStart: "",
            exportEnd: "",
            exportCost: "",
            exportStatus:false
        };
    },
    computed: {
        ...mapGetters({
            thisautoTable: "exportfile/get_autoTable",
            exportModalShow: "exportfile/get_exportModalShow",
            autoTableStatus: "exportfile/get_autoTableStatus",
        }),
    },
    watch: {
        thisautoTable: {
            handler() {
                var vm = this;
                console.log(vm.thisautoTable);
                if (vm.thisautoTable.exportfiletype == "PDF") {
                    if (!vm.exportStatus){
                        vm.exportStart = new Date();
                    }
                    vm.exportStatus = true;
                    vm.exportPDF();
                } else {
                    vm.exportCSV();
                }
            },
        },
    },
    mounted: function () {
        this.createScriptMSJHcdn();
    },
    methods: {
        ...mapActions({
            setttfStatus: "exportfile/set_ttfStatus",
            seterrorFormat: "exportfile/set_errorFormat",
            setTimeOutAlertMsg: "alertmodal/set_setTimeOutAlertMsg",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            togglealertModal: "alertmodal/toggle_alertModal",
        }),
        createScriptMSJHcdn() {
            let vm = this;
            let scriptTag = document.createElement("script");
            // scriptTag.setAttribute("type", "module");
            scriptTag.src = "./font/msjh.js";
            document.getElementsByClassName("export")[0].appendChild(scriptTag);
            setTimeout(function () {
                vm.setttfStatus(false);
            }, 8000);
        },
        //匯出pdf檔
        exportPDF() {
            let vm = this;
            try {
                if (vm.isInit){
                    //只有此頁一載入才加載新的字體，否則會有問題
                    jsPDF.API.events.push(["addFonts", callAddFont]);
                    vm.isInit = false;
                }
                const doc = new jsPDF("p", "pt");
                //jsPDF中文亂碼解決辦法，加入自定義字形檔ttf
                doc.setFont("msjh", "normal");
                console.log(doc);
                //抓取頁面高＆寬
                const pageHeight =
                    doc.internal.pageSize.height ||
                    doc.internal.pageSize.getHeight();
                const pageWidth =
                    doc.internal.pageSize.width ||
                    doc.internal.pageSize.getWidth();
                console.log(pageHeight);
                console.log(pageWidth);

                //先將舊errorFormat的清空
                vm.seterrorFormat([]);
                //報表title text置中
                doc.text(vm.thisautoTable.text[0], pageWidth / 2, 30, "center");
                //報表時間 text靠右
                doc.setFontSize(10);
                doc.text(vm.thisautoTable.text[1], pageWidth - 10, 30, "right");

                let checkFormat = doc.autoTable({
                    theme: vm.thisautoTable.theme,
                    body: vm.thisautoTable.body,
                    showHead: "firstPage", //只顯示第一頁的Head
                    columns: vm.thisautoTable.columns,
                    //jsPDF-autoTable 表格內容中文亂碼解決辦法 https://github.com/simonbengtsson/jsPDF-AutoTable/blob/master/examples/examples.js
                    columnStyles: vm.thisautoTable.columnStyles,
                    //表格標題中文亂碼解決辦法
                    headStyles: vm.thisautoTable.headStyles,
                    //autoTable default margin
                    margin: 40,
                });
                console.log(checkFormat);
                //若回傳的型態為陣列表示格式會有問題，需要回來整理
                if (Array.isArray(checkFormat)) {
                    vm.seterrorFormat(checkFormat);
                } else {
                    if (vm.autoTableStatus) {
                        doc.save(vm.thisautoTable.exportfilename + ".pdf");
                        vm.exportStatus = false;
                        vm.togglealertModal(false);
                    }
                }
            } catch (e) {
                console.log(e);
                vm.setTimeOutAlertMsg("中文字體尚未加載完成，請稍後再匯出PDF");
                vm.settimeoutalertModal(1200);
                vm.togglealertModal(false);
                return;
            } finally {
                vm.exportEnd = new Date();
                vm.exportCost = Number(vm.exportEnd) - Number(vm.exportStart);
            }
        },
        //匯出csv檔
        exportCSV() {
            let vm = this;
            const csvContent = vm.thisautoTable.body
                .map((row) => row.join(","))
                .join("\n");
            const link = document.createElement("a");
            link.setAttribute(
                "href",
                "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent)
            );
            link.style = "visibility:hidden";
            link.download = vm.thisautoTable.exportfilename + ".csv";
            // link.setAttribute("download", `${outputName}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    },
};
</script>

<style>
</style>
