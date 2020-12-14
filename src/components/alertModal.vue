<template>
    <div class="alertModal">
        <b-modal
            v-model="alertModalShow"
            hide-header
            hide-footer
            hide-header-close
            no-close-on-backdrop
            no-close-on-esc
            id="alertModal"
        >
            <template v-slot:default>
                <template v-if="alertProgressModalShow">
                    <h4>進度：</h4>
                    <b-progress
                        :max="100"
                        variant="success"
                        height="1.5rem"
                        show-progress
                        animated
                    >
                        <b-progress-bar :value="alertProgressValue">
                            <p
                                style="
                                    margin: 0;
                                    font-size: 1.2rem;
                                    font-weight: bolder;
                                "
                            >
                                {{ alertProgressValue }}%
                            </p>
                        </b-progress-bar>
                    </b-progress>
                </template>
                <template v-else>
                    <div
                        class="text-center"
                        v-if="typeof alertMsg === 'string'"
                    >
                        <b-spinner
                            v-if="alertMsg === '請稍候....'"
                            style="width: 1.5rem; height: 1.5rem"
                            label="Spinner"
                            type="grow"
                        ></b-spinner>
                        <h4
                            :class="{
                                'inline-block': alertMsg === '請稍候....',
                            }"
                        >
                            {{ alertMsg }}
                        </h4>
                    </div>
                    <h4
                        v-else
                        style="text-align: center !important"
                        v-for="(item, index) in alertMsg"
                        :key="index"
                    >
                        {{ item }}
                    </h4>
                </template>
            </template>
        </b-modal>
        <b-modal
            v-model="setTimeOutAlertModalShow"
            hide-header
            hide-footer
            hide-header-close
            no-close-on-backdrop
            no-close-on-esc
            id="setTimeOutAlertModal"
        >
            <template v-slot:default>
                <h4
                    v-if="typeof setTimeOutAlertMsg === 'string'"
                    style="text-align: center !important"
                >
                    {{ setTimeOutAlertMsg }}
                </h4>
                <h4
                    v-else
                    style="text-align: center !important"
                    v-for="(item, index) in setTimeOutAlertMsg"
                    :key="index"
                >
                    {{ item }}
                </h4>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "alertModal",
    data() {
        return {};
    },
    watch: {
        alertModalShow: {
            handler(value) {
                console.log("=================");
                console.log(value);
                console.log("=================");
            },
        },
    },
    computed: {
        ...mapGetters({
            alertModalShow: "alertmodal/get_alertModalShow",
            setTimeOutAlertModalShow: "alertmodal/get_setTimeOutalertModalShow",
            alertMsg: "alertmodal/get_alertMsg",
            setTimeOutAlertMsg: "alertmodal/get_setTimeOutAlertMsg",
            alertProgressValue: "alertmodal/get_alertProgressValue",
            alertProgressModalShow: "alertmodal/get_alertMsgProgressShow",
        }),
    },
};
</script>

<style>
.modal-backdrop {
    opacity: 0.2 !important;
}
.inline-block {
    display: inline-block !important;
    margin-left: 0.5rem;
}
</style>
