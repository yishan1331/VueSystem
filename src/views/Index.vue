  <template>
  <div class="index">
    <nav
      class="navbar navbar-expand-lg navbar-light fixed-top"
      style="background-color:#7C93B6;position:relative"
    >
      <div>
        <router-link :to="'home'">
          <img class="navbar-brand" src="../assets/sapidoLOGOw.png" width="170px" />
        </router-link>
      </div>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" v-show="pageAccess.misbulletinboard" :to="'misbulletinboard'">MIS公告區</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" v-show="pageAccess.misbulletinmanage" :to="'misbulletinmanage'">MIS公告管理</router-link>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown"
              role="button"
              v-show="pageAccess.department || pageAccess.account"
            >系統管理</a>
            <div class="dropdown-menu">
              <router-link class="nav-link" v-show="pageAccess.department" :to="'department'">部門</router-link>
              <router-link class="nav-link" v-show="pageAccess.account" :to="'account'">帳號</router-link>
            </div>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <div class="username">
            <p v-if="loginData.username === null" class="account">HI, xxxx</p>
            <p v-else class="account">HI, {{ loginData.username }}</p>
          </div>
          <a class="changepwd" style="float:right" @click.prevent="togglecommonModalShow()">更改密碼</a>
          <a class="logout" style="float:right" @click.prevent="logout">登出</a>
        </form>
      </div>
    </nav>
    <router-view style="position:absolute;margin-top:10px"></router-view>
    <modal>
      <template v-slot:modalheader>
        <h5>更改密碼</h5>
      </template>
      <template v-slot:default>
        <div class="inputdiv">
          <label>舊密碼:</label>
          <div>
            <input
              type="password"
              id="change_oldpwd"
              class="form-control"
              style="background-color:white"
              v-model="ChangePwdmodal.old_pwd"
              v-bind:class="{ wrongoldpwd: ChangePwdmodal.wrongStatus.oldisWrong }"
            />
          </div>
        </div>
        <div class="inputdiv">
          <label>新密碼:</label>
          <div>
            <input
              type="password"
              id="change_newpwd"
              class="form-control"
              v-model="ChangePwdmodal.change_newpwd"
              v-bind:class="{ wrongnewpwd1: ChangePwdmodal.wrongStatus.new1isWrong}"
            />
          </div>
        </div>
        <div class="inputdiv">
          <label>再次輸入新密碼:</label>
          <div>
            <input
              type="password"
              id="change_newpwd2"
              class="form-control"
              v-model="ChangePwdmodal.change_newpwd2"
              v-bind:class="{ wrongnewpwd2: ChangePwdmodal.wrongStatus.new2isWrong}"
            />
          </div>
        </div>
      </template>
      <template v-slot:modalfooter>
        <div class="w-100">
          <b-button
            variant="light"
            size="sm"
            class="float-right"
            @click.prevent="reset(),togglecommonModalShow()"
          >Close</b-button>
          <b-button
            variant="success"
            size="sm"
            class="float-right"
            style="margin-right:10px"
            @click.prevent="changepwd"
          >更改密碼</b-button>
        </div>
      </template>
    </modal>
    <alertModal />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import modal from "@/components/modal.vue";
import alertModal from "@/components/alertModal.vue";
export default {
  name: "index",
  data() {
    return {
      ChangePwdmodal: {
        old_pwd: "",
        change_newpwd: "",
        change_newpwd2: "",
        wrongStatus: {
          oldisWrong: false,
          new1isWrong: false,
          new2isWrong: false
        }
      },
    };
  },
  computed: {
    ...mapGetters({
      axiosResult: "commonaxios/get_axiosResult",
      loginData: "getlogin/get_loginData",
      pageAccess: "getlogin/get_pageAccess"
    })
  },
  components: {
    modal,
    alertModal
  },
  methods: {
    ...mapActions({
      axiosAction: "commonaxios/axiosAction",
      change_loginData: "getlogin/change_loginData",
      togglecommonModalShow: "usemodal/toggle_commonModalShow",
      setalertMsg: "alertmodal/set_alertMsg",
      settimeoutalertModal: "alertmodal/settimeout_alertModal"
    }),
    logout() {
      var vm = this;
      var obj = {};
      obj.account = null;
      obj.status = false;
      obj.username = null;
      obj.accesslist = null;
      vm.change_loginData(obj);
      vm.$router.push("/");
    },
    changepwd() {
      var vm = this;
      vm.ChangePwdmodal.wrongStatus = vm.$options.data().ChangePwdmodal.wrongStatus;
      vm.ChangePwdmodal.old_pwd = vm.ChangePwdmodal.old_pwd.trim();
      vm.ChangePwdmodal.change_newpwd = vm.ChangePwdmodal.change_newpwd.trim();
      vm.ChangePwdmodal.change_newpwd2 = vm.ChangePwdmodal.change_newpwd2.trim();
      if(vm.ChangePwdmodal.old_pwd === "" || vm.ChangePwdmodal.change_newpwd === "" || vm.ChangePwdmodal.change_newpwd2 === ""){
        vm.setalertMsg("不能為空");
        vm.settimeoutalertModal();
        return;
      }
      if (vm.ChangePwdmodal.old_pwd === vm.ChangePwdmodal.change_newpwd) {
        vm.setalertMsg("新密碼不能與舊密碼相同");
        vm.settimeoutalertModal();
        vm.ChangePwdmodal.change_newpwd = "";
        vm.ChangePwdmodal.wrongStatus.oldisWrong = true;
        vm.ChangePwdmodal.wrongStatus.new1isWrong = true;
        return;
      }
      vm.ChangePwdmodal.wrongStatus = vm.$options.data().ChangePwdmodal.wrongStatus;
      if (vm.ChangePwdmodal.change_newpwd != vm.ChangePwdmodal.change_newpwd2) {
        vm.setalertMsg("兩次密碼輸入不相符");
        vm.settimeoutalertModal();
        vm.ChangePwdmodal.change_newpwd = "";
        vm.ChangePwdmodal.change_newpwd2 = "";
        vm.ChangePwdmodal.wrongStatus.new1isWrong = true;
        vm.ChangePwdmodal.wrongStatus.new2isWrong = true;
        return;
      }
      vm.ChangePwdmodal.wrongStatus = vm.$options.data().ChangePwdmodal.wrongStatus;
      var params = {};
      params["methods"] = "GET";
      params["whichFunction"] = "Login";
      params["uID"] = vm.loginData.account;
      vm.axiosAction(params).then(() => {
        var result = vm.axiosResult;
        if (result["Response"] != "ok") {
          vm.setalertMsg(result["Response"]);
          vm.settimeoutalertModal();
        } else {
          if (vm.ChangePwdmodal.old_pwd === result["QueryTableData"][0].pwd) {
            params = {};
            params["methods"] = "POST";
            params["whichFunction"] = "ChangePwd";
            params["uID"] = result["QueryTableData"][0].uID;
            params["noumenonType"] = result["QueryTableData"][0].noumenonType;
            params["uInfo"] = result["QueryTableData"][0].uInfo;
            params["accessList"] = JSON.parse(
              result["QueryTableData"][0].accessList
            );
            params["uName"] = result["QueryTableData"][0].uName;
            params["pwd"] = vm.ChangePwdmodal.change_newpwd;
            params["noumenonID"] = result["QueryTableData"][0].noumenonID;
            params["creatorID"] = result["QueryTableData"][0].creatorID;
            vm.axiosAction(params).then(() => {
              var result = vm.axiosResult;
              if (result["Response"] != "ok") {
                vm.setalertMsg(result["Response"]);
                vm.settimeoutalertModal();
              } else {
                vm.setalertMsg("修改成功請重新登入");
                vm.settimeoutalertModal();
                var obj = {};
                obj.account = null;
                obj.status = false;
                obj.username = null;
                obj.accesslist = null;
                vm.change_loginData(obj);
                vm.reset();
                vm.togglecommonModalShow();
                setTimeout(function() {
                  vm.$router.push("/");
                }, 900);
              }
            });
          } else {
            vm.ChangePwdmodal.old_pwd = "";
            vm.ChangePwdmodal.wrongStatus.oldisWrong = true;
            vm.setalertMsg("舊密碼不符合");
            vm.settimeoutalertModal();
          }
        }
      });
    },
    //資料reset
    reset() {
      var def = this.$options.data();
      Object.assign(this.$data, def);
      //https://codepen.io/karimcossutti/pen/ObXyKq
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-item .nav-link {
  color: #eefbf0;
  font-size: 20px;
}
.username {
  height: 24px;
}
.form-inline a,
.form-inline p {
  color: #eefbf0;
  margin-left: 15px;
}
.dropdown-menu {
  margin: 0;
  margin-top: 0px;
  background-color: #9DAEC8;
  width: 125px !important;
  min-width: 127px !important;
}

.dropdown:hover > .dropdown-menu {
  display: block;
}

.dropleft:hover > .dropdown-menu {
  display: block;
  margin-right: 0px;
}
.dropdown-item {
  padding-left: 10px;
  width: 125px !important;
}
.dropdown-item:hover {
  background-color: #ffffff;
}
.wrongoldpwd,
.wrongnewpwd1,
.wrongnewpwd2 {
  border: 1px solid red;
}
h5 {
  margin: 0 auto;
}
</style>

