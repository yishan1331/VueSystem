<template>
    <div class="login">
        <form class="form-signin">
            <div class="text-center">
                <img
                    src="../assets/yishan_logo1.png"
                    alt="yishan"
                    class="yishanimg"
                />
            </div>
            <div style="margin-top: 10px">
                <div class="inputdiv">
                    <label>帳號:</label>
                    <div>
                        <input
                            type="text"
                            id="account"
                            class="form-control"
                            required
                            autofocus
                            v-model="user.uID"
                        />
                    </div>
                </div>
                <div class="inputdiv">
                    <label>密碼:</label>
                    <div>
                        <input
                            type="password"
                            id="password"
                            class="form-control"
                            required
                            v-model="user.pwd"
                        />
                    </div>
                </div>
            </div>
            <div>
                <button
                    class="btn btn-lg btn-secondary btn-block loginbtn"
                    id="login"
                    @click.prevent="checkUser"
                >
                    登入
                </button>
            </div>
        </form>
        <alertModal />
    </div>
</template>

<script>
import axios from "axios";
import alertModal from "@/components/alertModal.vue";
import { mapGetters, mapActions } from "vuex";
import { childRouter } from "@/router/childRouter";
export default {
    name: "login",
    data() {
        return {
            user: {
                uID: "",
                pwd: "",
            },
        };
    },
    components: {
        alertModal,
    },
    computed: {
        ...mapGetters({
            axiosResult: "commonaxios/get_axiosResult",
        }),
    },
    methods: {
        ...mapActions({
            axiosGetAction: "commonaxios/axiosGetAction",
            setTimeOutAlertMsg: "alertmodal/set_setTimeOutAlertMsg",
            settimeoutalertModal: "alertmodal/settimeout_alertModal",
            togglealertModal: "alertmodal/toggle_alertModal",
            change_loginData: "getlogin/change_loginData",
            change_pageAccess: "getlogin/change_pageAccess",
            changeloginCusID: "getlogin/change_loginCusID",
        }),
        checkUser(e) {
            var vm = this;
            if (vm.user.uID === "") {
                vm.setTimeOutAlertMsg("帳號尚未輸入");
                vm.settimeoutalertModal();
                return;
            }
            let apiparams = {};
            apiparams["url"] = "api/YS/1.0/my/CommonUse/Interval/user";
            apiparams["urlparams"] = {
                attr: "uID",
                valueStart: vm.user.uID,
                valueEnd: vm.user.uID,
            };
            let anyerror = false;
            console.log(apiparams);
            vm.togglealertModal(true);
            vm.axiosGetAction(apiparams)
                .then(() => {
                    vm.togglealertModal(false);
                    var result = vm.axiosResult;
                    console.log(result);
                    if (result.status != 200) {
                        anyerror = true;
                        vm.setTimeOutAlertMsg(result.data);
                        return;
                    }
                    if (result.data["Response"] === "ok") {
                        if (result.data["QueryTableData"].length == 0) {
                            anyerror = true;
                            vm.setTimeOutAlertMsg("無此帳號");
                            return;
                        }
                        if (
                            result.data["QueryTableData"][0].pwd != vm.user.pwd
                        ) {
                            anyerror = true;
                            vm.setTimeOutAlertMsg("帳號或密碼錯誤");
                            return;
                        }
                        vm.setTimeOutAlertMsg("登入成功");

                        var obj = {};
                        obj.account = vm.user.uID;
                        obj.status = true;
                        obj.username = result.data["QueryTableData"][0].uName;
                        obj.accesslist = JSON.parse(
                            result.data["QueryTableData"][0].accessList
                        );
                        var access = JSON.parse(
                            result.data["QueryTableData"][0].accessList
                        );
                        let trueList = [];
                        console.log(access);
                        Object.entries(access).forEach((element) => {
                            if (element[1]["authority"]) {
                                if (element[1].hasOwnProperty("children")) {
                                    Object.keys(element[1].children).map(
                                        (item) => {
                                            if (
                                                element[1].children[item]
                                                    .authority
                                            ) {
                                                trueList.push(
                                                    element[0] + "/" + item
                                                );
                                            }
                                        }
                                    );
                                } else {
                                    trueList.push(element[0]);
                                }
                            }
                        });
                        console.log(trueList);
                        trueList.push("home");
                        childRouter[0].children =
                            childRouter[0].children.filter((item) =>
                                trueList.includes(item.path)
                            );
                        vm.change_loginData(obj);
                        vm.change_pageAccess(obj.accesslist);
                        console.log(childRouter);
                        vm.$router.addRoutes(childRouter);
                        vm.change_loginData(obj);
                        console.log(vm.$router);
                        setTimeout(function () {
                            vm.$router.push("/index");
                        }, 500);
                    } else {
                        anyerror = true;
                        vm.setTimeOutAlertMsg(result.data["Response"]);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    anyerror = true;
                    vm.setTimeOutAlertMsg(err);
                })
                .finally(() => {
                    console.log("done");
                    if (anyerror) vm.settimeoutalertModal();
                });
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* body {
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: white;
} */
input:focus {
    outline: none;
}
.form-signin {
    max-width: 600px;
    margin-top: 13rem !important;
    margin: 0 auto;
}
.form-control {
    position: relative;
    height: auto;
    box-sizing: border-box;
    padding: 10px;
    border-bottom: 1px solid black;
    border-top: 0px;
    border-left: 0px;
    border-right: 0px;
    border-radius: 0px;
    box-shadow: none;
}
.form-control:focus {
    box-shadow: none;
    z-index: 2;
}
.form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
.inputdiv {
    margin: 0 auto;
    max-width: 330px;
    padding: 20px;
}
.inputdiv label {
    float: left;
    margin-right: 5px;
    margin-top: 5px;
    font-size: 20px;
}
.inputdiv div {
    overflow: hidden;
    margin-bottom: 20px;
}
.inputdiv input {
    width: 100%;
    display: block;
}
.loginbtn {
    width: 100px;
    margin: 0 auto;
}
.yishanimg {
    max-width: 100%;
    margin-bottom: 10px;
}
</style>
