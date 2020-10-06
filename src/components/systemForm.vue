<template>
    <div class="systemForm">
        <b-form>
            <b-row
                v-for="(item1, key1) in vforData"
                :key="key1"
                :class="{ 'my-4': key1 != 'button' }"
            >
                <template v-if="key1 != 'button' && key1 != 'textclass'">
                    <b-col sm="2">
                        <label for="input-default">{{ item1[1] }}:</label>
                    </b-col>
                    <b-col sm="10">
                        <b-form-input
                            v-if="item1[0] == 'readonly'"
                            type="text"
                            v-model="form[key1]"
                            readonly
                            :class="{
                                wronginput: form.formcontentwrong,
                                'input-text': vforData['textclass'],
                            }"
                            @keypress.enter.prevent
                        ></b-form-input>
                        <b-form-input
                            v-else-if="item1[0] == 'text'"
                            type="text"
                            v-model="form[key1]"
                            :class="{
                                wronginput: form.formcontentwrong,
                                'input-text': vforData['textclass'],
                            }"
                            @keypress.enter.prevent
                        ></b-form-input>
                        <b-form-textarea
                            v-else-if="item1[0] == 'textarea'"
                            v-model="form[key1]"
                            rows="4"
                            max-rows="12"
                        ></b-form-textarea>
                        <div
                            v-else-if="item1[0] == 'accesscheckbox'"
                            v-for="(item2, key2) in pageAccessConfig"
                            :key="key2"
                            :class="{
                                haveremark: !form[key1][key2].hasOwnProperty(
                                    'remark'
                                ),
                            }"
                        >
                            <b-form-checkbox
                                v-model="form[key1][key2]['authority']"
                                style="margin-right: 10px"
                                class="haveremark"
                                @change="
                                    accesscheckboxClick(
                                        $event,
                                        form[key1][key2]
                                    )
                                "
                            >
                                {{ pageAccessCH[key2] }}
                            </b-form-checkbox>
                            <template
                                v-if="form[key1][key2].hasOwnProperty('remark')"
                            >
                                <div
                                    v-for="(item3, key3) in Object.keys(
                                        item2.remark.commonQueryCondition
                                    )"
                                    :key="key3"
                                    class="haveremark"
                                    style="
                                        margin-right: 10px;
                                        height: 28px !important;
                                    "
                                >
                                    <v-select
                                        label="text"
                                        v-model="
                                            form[key1][key2].remark
                                                .commonQueryCondition[item3]
                                        "
                                        :reduce="(options) => options.value"
                                        :options="
                                            item2.remark.commonQueryCondition[
                                                item3
                                            ].options
                                        "
                                        style="
                                            min-width: 150px !important;
                                            height: 28px !important;
                                        "
                                        :multiple="
                                            item2.remark.commonQueryCondition[
                                                item3
                                            ].multiple
                                        "
                                        :placeholder="
                                            item2.remark.commonQueryCondition[
                                                item3
                                            ].placeholder
                                        "
                                        :searchable="false"
                                        :close-on-select="
                                            !item2.remark.commonQueryCondition[
                                                item3
                                            ].multiple
                                        "
                                    ></v-select>
                                </div>
                                <template
                                    v-if="
                                        form[key1][key2].remark.hasOwnProperty(
                                            'dataHandleAuthority'
                                        )
                                    "
                                    )
                                >
                                    <v-select
                                        label="text"
                                        v-model="
                                            form[key1][key2].remark
                                                .dataHandleAuthority
                                        "
                                        :reduce="(options) => options.value"
                                        :options="
                                            item2.remark.dataHandleAuthority
                                                .options
                                        "
                                        style="
                                            min-width: 150px !important;
                                            height: 28px !important;
                                        "
                                        :multiple="
                                            item2.remark.dataHandleAuthority
                                                .multiple
                                        "
                                        :placeholder="
                                            item2.remark.dataHandleAuthority
                                                .placeholder
                                        "
                                        :searchable="false"
                                        :close-on-select="
                                            !item2.remark.dataHandleAuthority
                                                .multiple
                                        "
                                        class="haveremark"
                                    ></v-select>
                                </template>
                            </template>
                        </div>
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
                        <b-form-input
                            v-else-if="item1[0] == 'number'"
                            type="number"
                            v-model="form[key1]"
                            min="0"
                            step="20"
                        ></b-form-input>
                    </b-col>
                </template>
                <template v-else-if="key1 == 'button'">
                    <b-col lg="12" class="pb-2">
                        <div class="text-center">
                            <b-button
                                type="submit"
                                variant="primary"
                                @click.prevent="submit()"
                                >{{ item1[1] }}</b-button
                            >
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
            pageAccessConfig: "getlogin/get_pageAccessConfig",
            DEFAULT_pageAccess: "getlogin/get_DEFAULT_pageAccess",
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
            var pageAccessobj = JSON.parse(
                JSON.stringify(vm.DEFAULT_pageAccess)
            );
            console.log(pageAccessobj);
            var formdata = JSON.parse(JSON.stringify(vm.vforData));
            console.log(formdata);
            var formdataitem = {};
            // var formdatastyle = {};
            for (var i = 0; i < Object.keys(formdata).length; i++) {
                if (Object.values(formdata)[i].length == 2) {
                    if (Object.values(formdata)[i][0] == "accesscheckbox") {
                        if (Object.keys(formdata)[i] === "accessList") {
                            formdataitem[
                                Object.keys(formdata)[i]
                            ] = pageAccessobj;
                        }
                    } else if (
                        Object.values(formdata)[i][0] == "checkbox_switch"
                    ) {
                        formdataitem[Object.keys(formdata)[i]] = false;
                    } else if (Object.values(formdata)[i][0] == "number") {
                        formdataitem[Object.keys(formdata)[i]] = 0;
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
            console.log(event);
            console.log(vm.form.accessList);
            var selectOptionsObj = JSON.parse(JSON.stringify(vm.selectOptions));
            console.log(selectOptionsObj);
            const selectOptionsList = selectOptionsObj
                .map((item) => Object.values(item))
                .filter(function (item, index) {
                    console.log(item);
                    return item[1] == event;
                });
            console.log(selectOptionsList);
            vm.form.accessList = selectOptionsList[0][2];
            console.log(vm.form.accessList);
        },

        accesscheckboxClick(event, item) {
            console.log(event);
            console.log(item);
            if (!event) {
                if (item.hasOwnProperty("remark")) {
                    if (
                        typeof item.remark.commonQueryCondition.main ===
                        "object"
                    ) {
                        item.remark.commonQueryCondition.main = [];
                    } else {
                        item.remark.commonQueryCondition.main = null;
                    }
                    if (
                        item.remark.commonQueryCondition.hasOwnProperty(
                            "secondary"
                        )
                    ) {
                        if (
                            typeof item.remark.commonQueryCondition
                                .secondary === "object"
                        ) {
                            item.remark.commonQueryCondition.secondary = [];
                        } else {
                            item.remark.commonQueryCondition.secondary = null;
                        }
                    }
                    if (item.remark.hasOwnProperty("dataHandleAuthority"))
                        item.remark.dataHandleAuthority = [];
                }
            } else {
                if (item.hasOwnProperty("remark")) {
                    if (item.remark.hasOwnProperty("dataHandleAuthority"))
                        item.remark.dataHandleAuthority = ["query"];
                }
            }
            console.log(item);
        },

        submit() {
            // event.preventDefault();
            // event.stopPropagation();
            var vm = this;
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
.haveremark {
    display: inline-block;
    margin-top: 5px;
}
</style>
