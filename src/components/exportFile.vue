<template>
    <div class="export"></div>
</template>

<script>
import jsPDF from "jspdf"; // export pdf
import "jspdf-autotable";
// import "../../js/font/msjh.js"; //微軟正黑體.ttf
import { mapGetters, mapActions } from "vuex";
export default {
    name: "export",
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            thisautoTable: "exportfile/get_autoTable",
            exportModalShow: "exportfile/get_exportModalShow",
        }),
    },
    watch: {
        thisautoTable: {
            handler() {
                var vm = this;
                console.log(vm.thisautoTable);
                if (vm.thisautoTable.exportfiletype == "PDF") {
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
            setalertMsg: "alertmodal/set_alertMsg",
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
                //加載新的字體
                jsPDF.API.events.push(["addFonts", callAddFont]);
                const doc = new jsPDF("p", "pt");
                //jsPDF中文亂碼解決辦法，加入自定義字形檔ttf
                doc.setFont("msjh", "normal");
                //抓取頁面高＆寬
                const pageHeight =
                    doc.internal.pageSize.height ||
                    doc.internal.pageSize.getHeight();
                const pageWidth =
                    doc.internal.pageSize.width ||
                    doc.internal.pageSize.getWidth();
                console.log(pageHeight);
                console.log(pageWidth);
                //報表title text置中
                doc.text(vm.thisautoTable.text[0], pageWidth / 2, 30, "center");
                //報表時間 text靠右
                doc.setFontSize(10);
                doc.text(vm.thisautoTable.text[1], pageWidth - 10, 30, "right");

                doc.autoTable({
                    theme: vm.thisautoTable.theme,
                    body: vm.thisautoTable.body,
                    showHead: "firstPage", //只顯示第一頁的Head
                    columns: vm.thisautoTable.columns,
                    //jsPDF-autoTable 表格內容中文亂碼解決辦法 https://github.com/simonbengtsson/jsPDF-AutoTable/blob/master/examples/examples.js
                    columnStyles: vm.thisautoTable.columnStyles,
                    //表格標題中文亂碼解決辦法
                    headStyles: vm.thisautoTable.headStyles,
                });
                doc.save(vm.thisautoTable.exportfilename + ".pdf");
                vm.togglealertModal(false);
            } catch (e) {
                console.log(e);
                vm.setalertMsg("中文字體尚未加載完成，請稍後再匯出PDF");
                vm.settimeoutalertModal(1200);
                return;
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
