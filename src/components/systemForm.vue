<template>
    <div class="systemForm">
        <b-form>
            <b-row v-for="(item1,key1) in vforData" :key="key1" :class="{'my-4': key1 != 'button'}">
                <template v-if="key1 != 'button' && key1 != 'textclass'">
                    <b-col sm="2">
                        <label for="input-default">{{item1[1]}}:</label>
                    </b-col>
                    <b-col sm="10">
                        <b-form-input
                            v-if="item1[0] == 'readonly'"
                            type="text"
                            v-model="form[key1]"
                            readonly
                            :class="{wronginput:form.formcontentwrong, 'input-text':vforData['textclass']}"
                            @keypress.enter.prevent
                        ></b-form-input>
                        <b-form-input
                            v-else-if="item1[0] == 'text'"
                            type="text"
                            v-model="form[key1]"
                            :class="{wronginput:form.formcontentwrong, 'input-text':vforData['textclass']}"
                            @keypress.enter.prevent
                        ></b-form-input>
                        <b-form-textarea
                            v-else-if="item1[0] == 'textarea'"
                            v-model="form[key1]"
                            rows="4"
                            max-rows="12"
                        ></b-form-textarea>
                        <!-- :style="styleObject" -->
                        <b-form-checkbox
                            v-else-if="item1[0] == 'accesscheckbox'"
                            v-for="(item2,key2) in pageAccess"
                            v-model="form[key1][key2]['status']"
                            :key="key2"
                            style="display:inline-block;margin-right:10px"
                        >
                            {{pageAccessCH[key2]}}
                            <b-form-select
                                v-if="key2 == 'todolist' || key2 == 'weeklyreport'"
                                v-model="form[key1][key2]['remark']"
                                :options="[{'text':'雲端AI(智慧)平台部','value':'1003'},{'text':'系統研發部','value':'1002'},{'text':'資訊通訊部','value':'1001'},{'text':'ALL','value':'ALL'}]"
                                size="sm"
                                style="width: 100px !important;height:28px !important"
                            >
                                <template v-slot:first>
                                    <b-form-select-option :value="null" disabled>------</b-form-select-option>
                                </template>
                            </b-form-select>
                        </b-form-checkbox>
                        <b-form-checkbox
                            switch
                            size="lg"
                            v-else-if="item1[0] == 'checkbox_switch'"
                            v-model="form[key1]"
                            :class="{ wronginput: form.formcontentwrong }"
                        ></b-form-checkbox>
                        <b-form-select
                            v-else-if="item1[0] == 'depselect'"
                            v-model="form.noumenonID"
                            :options="selectOptions"
                            @change="depselectChange($event)"
                        ></b-form-select>
                        <b-form-select
                            v-else-if="item1[0] == 'select'"
                            v-model="form[key1]"
                            :options="selectOptions"
                        ></b-form-select>
                    </b-col>
                </template>
                <template v-else-if="key1 == 'button'">
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
            pageAccessCH: "getlogin/get_pageAccessCH",
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
            console.log(pageAccessobj);
            var formdata = JSON.parse(JSON.stringify(vm.vforData));
            console.log(formdata);
            var formdataitem = {};
            // var formdatastyle = {};
            for (var i = 0; i < Object.keys(formdata).length; i++) {
                if (Object.values(formdata)[i].length == 2) {
                    if (Object.values(formdata)[i][0] == "accesscheckbox") {
                        if (Object.keys(formdata)[i] === "accessList") {
                            Object.keys(pageAccessobj).forEach(function (key) {
                                console.log(key);
                                if (
                                    key == "todolist" ||
                                    key == "weeklyreport"
                                ) {
                                    pageAccessobj[key]["status"] = false;
                                    pageAccessobj[key]["remark"] = null;
                                } else {
                                    pageAccessobj[key]["status"] = false;
                                }
                            });
                            formdataitem[
                                Object.keys(formdata)[i]
                            ] = pageAccessobj;
                        }
                    } else if (
                        Object.values(formdata)[i][0] == "checkbox_switch"
                    ) {
                        formdataitem[Object.keys(formdata)[i]] = false;
                    } else {
                        formdataitem[Object.keys(formdata)[i]] = "";
                    }
                } else if (Object.values(formdata)[i].length == 3) {
                    if (Object.values(formdata)[i][0] == "accesscheckbox") {
                        if (Object.keys(formdata)[i] === "accessList") {
                            // if (Object.values(formdata)[i][2] === "ALL") {
                            //     Object.keys(pageAccessobj).forEach(function (
                            //         key
                            //     ) {
                            //         if (key == "todolist") {
                            //             pageAccessobj[key]["status"] = true;
                            //             pageAccessobj[key]["remark"] = "ALL";
                            //         } else {
                            //             pageAccessobj[key]["status"] = true;
                            //         }
                            //         pageAccessobj[key] = true;
                            //     });
                            //     formdataitem[
                            //         Object.keys(formdata)[i]
                            //     ] = pageAccessobj;
                            // } else {
                            formdataitem[
                                Object.keys(formdata)[i]
                            ] = Object.values(formdata)[i][2];
                            // }
                        }
                    } else {
                        formdataitem[Object.keys(formdata)[i]] = Object.values(
                            formdata
                        )[i][2];
                    }
                }
            }
            vm.form = formdataitem;
            console.log(vm.form);
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
            // event.preventDefault();
            // event.stopPropagation();
            var vm = this;
            if (vm.form.hasOwnProperty("accessList")) {
                if (!vm.form.accessList.todolist.status)
                    vm.form.accessList.todolist.remark = null;
                if (!vm.form.accessList.weeklyreport.status)
                    vm.form.accessList.weeklyreport.remark = null;
            }
            console.log(vm.form);
            vm.setcompletedData(vm.form);
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
