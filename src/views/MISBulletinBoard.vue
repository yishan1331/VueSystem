<template>
  <div class="MISBulletinBoard container">
    <commonQuery />
    <br />
    <div style="width:100%" v-if="boardtitle || items.length != 0">
      <div class="card text-center">
        <div class="card-header" style="font-size:20px">公告內容</div>
        <div class="card-body">
          <h5 class="card-title">{{ boardtitle }}</h5>
          <p
            class="card-text"
            v-html="boardcontent"
            :class="{ textleft: textleft }"
          ></p>
          <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
        </div>
        <div class="card-footer text-muted">
          <div v-show="Object.keys(boardannex).length > 0">
            <span>附件:</span>
            <b-button
              pill
              variant="outline-secondary"
              v-for="(item, key,index) in boardannex"
              target="_blank"
              :key="index"
              @click="onDownload(item,key)"
              style="margin-right:15px"
            >{{key}}</b-button>
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
    <alertModal />
    <font-awesome-icon :icon="['fas', 'fa-download']" size="lg" />
  </div>
</template>

<script>
import axios from "axios";
import commonQuery from "@/components/commonQuery.vue";
import alertModal from "@/components/alertModal.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "MISBulletinBoard",
  data() {
    return {
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
        }
      ],
      items: [],
      boardtitle: "",
      boardcontent: "",
      boardannex: {},
      boardtime: "",
      textleft: false
    };
  },
  created: function() {
    this.SetCommonQueryData();
    this.LatestBulletinDataQuery();
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
        vm.reset();
        // vm.changetableBusy();
        if (
          vm.queryResponse == "查無資料" ||
          vm.queryResponse == "時間尚未選擇"
        ) {
          vm.setalertMsg(vm.queryResponse);
          vm.settimeoutalertModal();
          return;
        }
        var setNewBulletin = false;
        var categorytoCH = {};
        categorytoCH = {
          network: "網路",
          PC: "個人電腦",
          system: "系統"
        };
        var itemsarray = [];
        for (var i = 0; i < vm.queryResponse.length; i++) {
          var itemsobj = {};
          if (vm.queryResponse[i]["showhide"] == 1) {
            itemsobj["category"] =
              categorytoCH[vm.queryResponse[i]["category"]];
            itemsobj["title"] = vm.queryResponse[i]["title"];
            itemsobj["releasedate"] = vm.queryResponse[i]["lastUpdateTime"];
            itemsobj["content"] = vm.queryResponse[i]["content"];
            if (vm.queryResponse[i]["filename"] != "") {
              var thisfilename = vm.queryResponse[i]["filename"].split(",");
              itemsobj["annex"] = thisfilename;
            }
            itemsarray.push(itemsobj);

            if (!setNewBulletin) {
              //push到最新公告區
              vm.boardtitle = vm.queryResponse[i]["title"];
              if(vm.queryResponse[i]["content"].length > 110){
                vm.textleft = true;
              }else{
                vm.textleft = false;
              }
              vm.boardcontent = vm.queryResponse[i]["content"];
              vm.boardtime = vm.queryResponse[i]["lastUpdateTime"];
              if (thisfilename)
                for (var j = 0; j < thisfilename.length; j++) {
                  vm.boardannex[thisfilename[j]] =
                    "./misbulletinfiles/" + thisfilename[j];
                }
              setNewBulletin = true;
            }
          }
        }
        vm.items = itemsarray;
      }
    }
  },
  methods: {
    ...mapActions({
      axiosAction: "commonaxios/axiosAction",
      setalertMsg: "alertmodal/set_alertMsg",
      settimeoutalertModal: "alertmodal/settimeout_alertModal",
      changetableBusy: "commonquery/change_tableBusy",
      setqueryResponse: "commonquery/set_queryResponse",
      setinputData: "commonquery/set_inputData",
      setphpfunction: "commonquery/set_phpfunction"
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
      obj.inputtext = "";
      vm.setinputData(obj);
      vm.setphpfunction("BulletinDataQuery");
    },
    //查詢最新一筆
    LatestBulletinDataQuery() {
      var vm = this;
      vm.changetableBusy();
      var params = {};
      params["methods"] = "POST";
      params["whichFunction"] = "LatestBulletinDataQuery";
      vm.axiosAction(params).then(() => {
        var result = vm.axiosResult;
        if (result["Response"] == "ok") {
          if (result["QueryTableData"].length == 0) {
            vm.setalertMsg("查無資料");
            vm.settimeoutalertModal();
          } else {
            vm.boardtitle = result["QueryTableData"][0]["title"];
            if (result["QueryTableData"][0]["content"].length > 110) {
              vm.textleft = true;
            }else{
              vm.textleft = false;
            }
            vm.boardcontent = result["QueryTableData"][0]["content"];
            vm.boardtime = result["QueryTableData"][0]["lastUpdateTime"];
            if (result["QueryTableData"][0]["filename"] != "") {
              var thisfilename = result["QueryTableData"][0]["filename"].split(
                ","
              );
              for (var j = 0; j < thisfilename.length; j++) {
                vm.boardannex[thisfilename[j]] =
                  "./misbulletinfiles/" + thisfilename[j];
              }
            }
          }
        } else {
          vm.setalertMsg(result["Response"]);
          vm.settimeoutalertModal();
        }
        vm.changetableBusy();
      });
    },
    //表格點擊
    onRowClicked(items) {
      var vm = this;
      vm.boardannex = {};
      vm.boardtitle = items.title;
      if(items.content.length > 110){
        vm.textleft = true;
      }else{
        vm.textleft = false;
      }
      vm.boardcontent = items.content;
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
        responseType: "blob"
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", filename);
        document.body.appendChild(fileLink);

        fileLink.click();
      });
    },
    //data reset
    reset(keep) {
      var def = this.$options.data();
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
.card-title {
  font-size: 25px;
}
.textleft {
  text-align: left;
  text-indent:35px
}
</style>