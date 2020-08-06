<template>
    <div class="systemForm">
        <b-form>
            <b-row
                v-for="(item1,key1) in vforData"
                :key="key1"
                :class="{'my-4': key1 != 'button'}"
            >
                <template v-if="key1 != 'button'">
                    <b-col sm="2">
                        <label for="input-default">{{item1[1]}}:</label>
                    </b-col>
                    <b-col sm="5">
                        <b-form-input
                            v-if="item1[0] == 'readonly'"
                            class="input-text"
                            type="text"
                            v-model="form[key1]"
                            readonly
                            :class="{ wronginput: form.formcontentwrong }"
                        ></b-form-input>
                        <b-form-input
                            v-else-if="item1[0] == 'text'"
                            class="input-text"
                            type="text"
                            v-model="form[key1]"
                            :class="{ wronginput: form.formcontentwrong }"
                        ></b-form-input>
                        <!-- :style="styleObject" -->
                        <b-form-checkbox
                            v-else-if="item1[0] == 'accesscheckbox'"
                            v-for="(item2,key2) in pageAccess"
                            v-model="form[key1][key2]"
                            :key="key2"
                            style="display:inline-block;margin-right:10px"
                        >{{pageAccessCH[key2]}}</b-form-checkbox>
                        <b-form-select
                            v-else-if="item1[0] == 'depselect'"
                            v-model="form.noumenonID"
                            :options="selectOptions"
                            @change="depselectChange($event)"
                        ></b-form-select>
                    </b-col>
                </template>
                <template v-else>
                    <b-col lg="12" class="pb-2">
                        <div class="text-center">
                            <b-button
                                type="submit"
                                variant="primary"
                                @click.prevent="submit()"
                            >{{item1[1]}}</b-button>
                        </div>
                    </b-col>
                </template>
            </b-row>
        </b-form>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    name: "systemForm",
    data() {
        return {
            form: {},
            // style: {},
            pageAccessCH: {
                misbulletinboard: "MIS公告區",
                misbulletinmanage: "MIS公告管理",
                department: "部門",
                account: "帳號",
            },
        };
    },
    created: function () {
        this.createFormData();
    },
    computed: {
        ...mapGetters({
            vforData: "systemform/get_vforData",
            selectOptions: "systemform/get_selectOptions",
            pageAccess: "getlogin/get_pageAccess",
            systemFormResponse: "systemform/get_systemFormResponse",
        }),
        // styleObject() {
        //   console.log(this.style);
        //   return this.style ? { border: "1px solid red" } : {};
        // }
    },
    watch: {
        systemFormResponse: {
            handler(value) {
                var vm = this;
                vm.reset();
                vm.createFormData();
            },
        },
    },
    methods: {
        ...mapActions({
            setcompletedData: "systemform/set_completedData",
        }),
        createFormData() {
            var vm = this;
            var pageAccessobj = JSON.parse(JSON.stringify(vm.pageAccess));

            var formdata = JSON.parse(JSON.stringify(vm.vforData));
            var formdataitem = {};
            // var formdatastyle = {};
            for (var i = 0; i < Object.keys(formdata).length; i++) {
                if (Object.values(formdata)[i].length == 2) {
                    if (Object.values(formdata)[i][0] == "text") {
                        formdataitem[Object.keys(formdata)[i]] = "";
                        // formdatastyle[Object.keys(formdata)[i]] = false;
                    } else if (
                        Object.values(formdata)[i][0] == "accesscheckbox"
                    ) {
                        if (Object.keys(formdata)[i] === "accessList") {
                            Object.keys(pageAccessobj).forEach(function (key) {
                                pageAccessobj[key] = false;
                            });
                            formdataitem[
                                Object.keys(formdata)[i]
                            ] = pageAccessobj;
                        }
                    } else if (Object.values(formdata)[i][0] == "depselect") {
                        formdataitem[Object.keys(formdata)[i]] = "";
                        // formdatastyle[Object.keys(formdata)[i]] = false;
                    }
                } else if (Object.values(formdata)[i].length == 3) {
                    if (Object.values(formdata)[i][0] == "accesscheckbox") {
                        if (Object.keys(formdata)[i] === "accessList") {
                            if (Object.values(formdata)[i][2] === "ALL") {
                                Object.keys(pageAccessobj).forEach(function (
                                    key
                                ) {
                                    pageAccessobj[key] = true;
                                });
                                formdataitem[
                                    Object.keys(formdata)[i]
                                ] = pageAccessobj;
                            } else {
                                formdataitem[
                                    Object.keys(formdata)[i]
                                ] = Object.values(formdata)[i][2];
                            }
                        }
                    } else {
                        formdataitem[Object.keys(formdata)[i]] = Object.values(
                            formdata
                        )[i][2];
                    }
                }
            }
            vm.form = formdataitem;
            // vm.style = formdatastyle;
        },
        depselectChange(event) {
            var vm = this;
            var selectOptionsObj = JSON.parse(JSON.stringify(vm.selectOptions));
            const selectOptionsList = selectOptionsObj
                .map((item) => Object.values(item))
                .filter(function (item, index) {
                    return item[1] == event;
                });
            vm.form.accessList = selectOptionsList[0][2];
        },
        submit() {
            var vm = this;
            // if (vm.vforData.button[0] == "Add") {
            vm.setcompletedData(vm.form);
            // }
        },
        //資料reset
        reset() {
            var def = this.$options.data();
            Object.assign(this.$data, def);
            //https://codepen.io/karimcossutti/pen/ObXyKq
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.custom-select {
    width: 200px !important;
}
.input-text {
    width: 200px !important;
}
.wronginput {
    border: 1px solid red;
}
</style>
