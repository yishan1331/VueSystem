<template>
  <div class="commonQuery container">
    <div>
      <label>類別:</label>
      <b-form-select
        v-model="inputData.selected"
        :options="inputData.options"
        @change="onChange($event)"
      ></b-form-select>
    </div>
    <div v-if="selected != ''">
      <label>{{selected}}:</label>
      <b-form-input class="input-title" v-model="inputtext" type="text"></b-form-input>
    </div>
    <div style="margin-top:10px">
      <label>時間:</label>
      <datepicker :date="startTime" :option="startoption"></datepicker>~
      <datepicker :date="endTime" :option="endoption" :limit="endoption.limit"></datepicker>
      <b-button variant="primary" @click="QueryData">查詢</b-button>
    </div>
    <b-form-checkbox v-model="settingtime" style="display:inline-block;margin-right:10px">不指定時間</b-form-checkbox>
    <br />
  </div>
</template>

<script>
import axios from "axios";
import datepicker from "vue-datepicker/vue-datepicker-es6.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "commonQuery",
  data() {
    return {
      startTime: {
        time: ""
      },
      endTime: {
        time: ""
      },
      startoption: {
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
          "December"
        ],
        format: "YYYY-MM-DD",
        placeholder: "",
        inputStyle: {
          display: "inline-block",
          padding: "6px",
          "line-height": "22px",
          "font-size": "16px",
          border: "2px solid #fff",
          "box-shadow": "0 1px 3px 0 rgba(0, 0, 0, 0.2)",
          "border-radius": "2px",
          color: "#5F5F5F",
          width: "110px"
        },
        color: {
          header: "#ccc",
          headerText: "#f00"
        },
        overlayOpacity: 0.5, // 0.5 as default
        dismissible: true // as true as default
      },
      endoption: {
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
          "December"
        ],
        format: "YYYY-MM-DD",
        placeholder: "",
        inputStyle: {
          display: "inline-block",
          padding: "6px",
          "line-height": "22px",
          "font-size": "16px",
          border: "2px solid #fff",
          "box-shadow": "0 1px 3px 0 rgba(0, 0, 0, 0.2)",
          "border-radius": "2px",
          color: "#5F5F5F",
          width: "110px"
        },
        color: {
          header: "#ccc",
          headerText: "#f00"
        },
        overlayOpacity: 0.5, // 0.5 as default
        dismissible: true, // as true as default
        limit: [
          {
            type: "fromto",
            from: "1995-01-01",
            to: "9999-01-01"
          }
        ]
      },
      inputtext: "",
      selected: "",
      selectedCH: {
        depID: "部門編號",
        depName: "部門名稱",
        uID: "帳號",
        uName: "姓名"
      },
      settingtime: true
    };
  },
  created: function() {
    this.DateFormat("Default");
  },
  components: {
    datepicker
  },
  computed: {
    ...mapGetters({
      axiosResult: "commonaxios/get_axiosResult",
      queryResponse: "commonquery/get_queryResponse",
      receivequeryAgain: "commonquery/receive_queryAgain",
      inputData: "commonquery/get_inputData",
      phpfunction: "commonquery/get_phpfunction"
    })
  },
  watch: {
    "startTime.time": {
      handler(value) {
        var vm = this;
        if (
          Date.parse(vm.endTime.time).valueOf() < Date.parse(value).valueOf()
        ) {
          vm.endTime.time = "";
          vm.endoption.placeholder = "";
        }
        vm.endoption.limit[0].from = value;
        vm.endoption.limit[0].to = "";
      }
      // deep: true
    },
    receivequeryAgain: {
      handler() {
        this.QueryData();
      }
    }
  },
  methods: {
    ...mapActions({
      axiosAction: "commonaxios/axiosAction",
      setalertMsg: "alertmodal/set_alertMsg",
      settimeoutalertModal: "alertmodal/settimeout_alertModal",
      setqueryResponse: "commonquery/set_queryResponse",
      changetableBusy: "commonquery/change_tableBusy"
    }),
    onChange(event) {
      if (typeof this.selectedCH[event] != "undefined") {
        this.selected = this.selectedCH[event];
      } else {
        this.selected = "";
      }
      this.inputtext = "";
    },
    //查詢API
    QueryDataFunction() {
      var vm = this;
      var params = {};
      var start_time = vm.startTime.time;
      var end_time = vm.endTime.time;
      var category = vm.inputData.selected;
      console.log(vm.inputData.selected);
      console.log(category);
      params["category"] = category;
      if (vm.selected != "") {
        if (vm.inputtext == "") {
          vm.setalertMsg("尚未輸入條件");
          vm.settimeoutalertModal();
          return;
        }
        params["categoryparameter"] = vm.inputtext.trim();
      }
      params["methods"] = "GET";
      params["whichFunction"] = vm.phpfunction;
      //預設今天
      params["start_time"] = start_time;
      params["end_time"] = end_time + " 23:59:59";
      params["settingtime"] = vm.settingtime;
      params["table"] = vm.inputData.table;
      console.log(params);
      vm.axiosAction(params).then(() => {
        var result = vm.axiosResult;
        console.log(result);
        vm.changetableBusy();
        if (result["Response"] == "ok") {
          result["QueryTableData"] = result["QueryTableData"].sort(function(
            a,
            b
          ) {
            return a.lastUpdateTime < b.lastUpdateTime ? 1 : -1;
          });
          if (result["QueryTableData"].length == 0) {
            if (vm.queryResponse == "查無資料") {
              vm.setalertMsg("查無資料");
              vm.settimeoutalertModal();
            }
            vm.setqueryResponse("查無資料");
          } else {
            vm.setqueryResponse(result["QueryTableData"]);
          }
        } else {
          vm.setalertMsg(result["Response"]);
          vm.settimeoutalertModal();
        }
      });
    },
    //時間格式化
    DateFormat(Default) {
      var vm = this;
      var now = new Date();
      if (Default === "Default") {
        var todayDate_start =
          now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
        var todayDate_end =
          now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
        vm.startoption.placeholder = todayDate_start;
        vm.startTime.time = todayDate_start;
        vm.endoption.placeholder = todayDate_end;
        vm.endTime.time = todayDate_end;
      } else {
        vm.reset([
          "startTime",
          "endTime",
          "selected",
          "inputtext",
          "settingtime"
        ]);
        vm.changetableBusy();
        vm.QueryDataFunction();
      }
    },
    //查詢按鈕
    QueryData() {
      var vm = this;
      if (!vm.settingtime) {
        if (vm.startTime.time == "" || vm.endTime.time == "") {
          if (vm.queryResponse == "時間尚未選擇") {
            vm.setalertMsg("時間尚未選擇");
            vm.settimeoutalertModal();
          }
          vm.setqueryResponse("時間尚未選擇");
          return;
        }
      }
      vm.DateFormat(vm.selected);
    },
    //data reset
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
.card-title {
  font-size: 25px;
}
.input-title {
  width: 200px !important;
  display: inline-block;
  margin-top: 5px;
}
</style>