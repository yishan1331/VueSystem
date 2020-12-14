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
                        <b-form-input
                            v-else-if="item1[0] == 'email'"
                            type="email"
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
                            v-for="(item2, key2, index2) in pageAccessConfig"
                            :key="index2"
                            class="mt-1"
                        >
                            <b-row>
                                <b-col sm="1">
                                    <b-form-checkbox
                                        class="mt-1 fatherCB"
                                        v-model="form[key1][key2]['authority']"
                                        @change="
                                            accessCBFatherClick(
                                                $event,
                                                form[key1][key2]
                                            )
                                        "
                                        button
                                        button-variant="outline-secondary"
                                    >
                                        {{ item2.label }}
                                    </b-form-checkbox>
                                </b-col>
                                <b-col sm="11">
                                    <template
                                        v-if="item2.hasOwnProperty('children')"
                                    >
                                        <div
                                            v-for="(item3, key3) in Object.keys(
                                                item2.children
                                            )"
                                            :key="key3"
                                            style="
                                                display: inline-block;
                                                vertical-align: top;
                                            "
                                        >
                                            <b-form-checkbox
                                                class="ml-4 mt-2"
                                                style="
                                                    display: inline-block;
                                                    vertical-align: top;
                                                "
                                                v-model="
                                                    form[key1][key2].children[
                                                        item3
                                                    ]['authority']
                                                "
                                                @change="
                                                    accessCBChildrenClick(
                                                        $event,
                                                        form[key1][key2],
                                                        item3
                                                    )
                                                "
                                            >
                                                {{
                                                    item2.children[item3].label
                                                }}
                                            </b-form-checkbox>
                                            <template
                                                v-if="
                                                    item2.children[
                                                        item3
                                                    ].hasOwnProperty('remark')
                                                "
                                            >
                                                <div
                                                    v-for="(item4,
                                                    key4) in Object.keys(
                                                        item2.children[item3]
                                                            .remark
                                                            .commonQueryCondition
                                                    )"
                                                    :key="key4"
                                                    class="haveremark"
                                                    style="
                                                        margin-right: 10px;
                                                        height: 28px !important;
                                                    "
                                                >
                                                    <v-select
                                                        label="text"
                                                        v-model="
                                                            form[key1][key2]
                                                                .children[item3]
                                                                .remark
                                                                .commonQueryCondition[
                                                                item4
                                                            ]
                                                        "
                                                        :reduce="
                                                            (options) =>
                                                                options.value
                                                        "
                                                        :options="
                                                            item2.children[
                                                                item3
                                                            ].remark
                                                                .commonQueryCondition[
                                                                item4
                                                            ].options
                                                        "
                                                        style="
                                                            min-width: 150px !important;
                                                            height: 28px !important;
                                                        "
                                                        :multiple="
                                                            item2.children[
                                                                item3
                                                            ].remark
                                                                .commonQueryCondition[
                                                                item4
                                                            ].multiple
                                                        "
                                                        :placeholder="
                                                            item2.children[
                                                                item3
                                                            ].remark
                                                                .commonQueryCondition[
                                                                item4
                                                            ].placeholder
                                                        "
                                                        :searchable="false"
                                                        :close-on-select="
                                                            !item2.children[
                                                                item3
                                                            ].remark
                                                                .commonQueryCondition[
                                                                item4
                                                            ].multiple
                                                        "
                                                    ></v-select>
                                                </div>
                                                <template
                                                    v-if="
                                                        item2.children[
                                                            item3
                                                        ].remark.hasOwnProperty(
                                                            'dataHandleAuthority'
                                                        )
                                                    "
                                                    )
                                                >
                                                    <v-select
                                                        label="text"
                                                        v-model="
                                                            form[key1][key2]
                                                                .children[item3]
                                                                .remark
                                                                .dataHandleAuthority
                                                        "
                                                        :reduce="
                                                            (options) =>
                                                                options.value
                                                        "
                                                        :options="
                                                            item2.children[
                                                                item3
                                                            ].remark
                                                                .dataHandleAuthority
                                                                .options
                                                        "
                                                        style="
                                                            min-width: 150px !important;
                                                            height: 28px !important;
                                                        "
                                                        :multiple="
                                                            item2.children[
                                                                item3
                                                            ].remark
                                                                .dataHandleAuthority
                                                                .multiple
                                                        "
                                                        :placeholder="
                                                            item2.children[
                                                                item3
                                                            ].remark
                                                                .dataHandleAuthority
                                                                .placeholder
                                                        "
                                                        :searchable="false"
                                                        :close-on-select="
                                                            !item2.children[
                                                                item3
                                                            ].remark
                                                                .dataHandleAuthority
                                                                .multiple
                                                        "
                                                        class="haveremark"
                                                    ></v-select>
                                                </template>
                                            </template>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <template
                                            v-if="
                                                item2.hasOwnProperty('remark')
                                            "
                                        >
                                            <div
                                                v-for="(item3,
                                                key3) in Object.keys(
                                                    item2.remark
                                                        .commonQueryCondition
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
                                                        form[key1][key2][item2]
                                                            .remark
                                                            .commonQueryCondition[
                                                            item3
                                                        ]
                                                    "
                                                    :reduce="
                                                        (options) =>
                                                            options.value
                                                    "
                                                    :options="
                                                        item2.remark
                                                            .commonQueryCondition[
                                                            item3
                                                        ].options
                                                    "
                                                    style="
                                                        min-width: 150px !important;
                                                        height: 28px !important;
                                                    "
                                                    :multiple="
                                                        item2.remark
                                                            .commonQueryCondition[
                                                            item3
                                                        ].multiple
                                                    "
                                                    :placeholder="
                                                        item2.remark
                                                            .commonQueryCondition[
                                                            item3
                                                        ].placeholder
                                                    "
                                                    :searchable="false"
                                                    :close-on-select="
                                                        !item2.remark
                                                            .commonQueryCondition[
                                                            item3
                                                        ].multiple
                                                    "
                                                ></v-select>
                                            </div>
                                            <template
                                                v-if="
                                                    item2.remark.hasOwnProperty(
                                                        'dataHandleAuthority'
                                                    )
                                                "
                                                )
                                            >
                                                <v-select
                                                    label="text"
                                                    v-model="
                                                        form[key1][key2][item2]
                                                            .remark
                                                            .dataHandleAuthority
                                                    "
                                                    :reduce="
                                                        (options) =>
                                                            options.value
                                                    "
                                                    :options="
                                                        item2.remark
                                                            .dataHandleAuthority
                                                            .options
                                                    "
                                                    style="
                                                        min-width: 150px !important;
                                                        height: 28px !important;
                                                    "
                                                    :multiple="
                                                        item2.remark
                                                            .dataHandleAuthority
                                                            .multiple
                                                    "
                                                    :placeholder="
                                                        item2.remark
                                                            .dataHandleAuthority
                                                            .placeholder
                                                    "
                                                    :searchable="false"
                                                    :close-on-select="
                                                        !item2.remark
                                                            .dataHandleAuthority
                                                            .multiple
                                                    "
                                                    class="haveremark"
                                                ></v-select>
                                            </template>
                                        </template>
                                    </template>
                                </b-col>
                            </b-row>
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
import { mergeWith } from "lodash";
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
        customizer(objValue, srcValue) {
            if (_.isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        },
        createFormData() {
            var vm = this;
            var pageAccessobj = JSON.parse(
                JSON.stringify(vm.DEFAULT_pageAccess)
            );
            console.log(pageAccessobj);
            var formdata = JSON.parse(JSON.stringify(vm.vforData));
            console.log(formdata);
            var formdataitem = {};

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
                            mergeWith(
                                pageAccessobj,
                                Object.values(formdata)[i][2],
                                vm.customizer
                            );
                            formdataitem[
                                Object.keys(formdata)[i]
                            ] = pageAccessobj;
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
                    return item[1] == event;
                });
            console.log(selectOptionsList);

            mergeWith(
                vm.form.accessList,
                selectOptionsList[0][2],
                vm.customizer
            );
            console.log(vm.form.accessList);
        },

        accessCBFatherClick(event, item) {
            console.log(event);
            console.log(item);
            let vm = this;
            if (item.hasOwnProperty("children")) {
                Object.keys(item.children).map((element) => {
                    item.children[element].authority = event;
                    vm.getThisAccessItem(event, item.children[element]);
                });
            } else {
                item.authority = event;
                vm.getThisAccessItem(event, item);
            }
        },

        accessCBChildrenClick(event, fatheritem, thisitem) {
            let vm = this;
            if (fatheritem.hasOwnProperty("children")) {
                //若打勾則將爸爸打勾
                if (event) {
                    fatheritem.authority = true;
                } else {
                    Object.keys(fatheritem.children).map((element) => {
                        if (fatheritem.children[element].authority) {
                        }
                    });
                    this.$nextTick(() => {
                        const trueList = Object.keys(fatheritem.children)
                            .map((item) => fatheritem.children[item])
                            .filter(function (item, index) {
                                console.log(item.authority);
                                if (item.authority) {
                                    return item.authority;
                                }
                            });
                        console.log(trueList);
                        if (trueList.length === 0) fatheritem.authority = false;
                    });
                }
                vm.getThisAccessItem(event, fatheritem.children[thisitem]);
            }
        },

        getThisAccessItem(event, item) {
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
    margin-left: 5px;
}
</style>
