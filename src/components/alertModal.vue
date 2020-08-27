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
                <h4
                    v-if="typeof(alertMsg) === 'string'"
                    style="text-align:center !important"
                >{{ alertMsg }}</h4>
                <h4
                    v-else
                    style="text-align:center !important"
                    v-for="(item,index) in alertMsg"
                    :key="index"
                >{{ item }}</h4>
                <b-progress
                    v-if="alertMsgProgressShow"
                    :value="alertMsgProgressValue"
                    :max="100"
                    variant="success"
                    show-progress
                    animated
                ></b-progress>
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
    computed: {
        ...mapGetters({
            alertModalShow: "alertmodal/get_alertModalShow",
            alertMsg: "alertmodal/get_alertMsg",
            alertMsgProgressValue: "alertmodal/get_alertMsgProgressValue",
            alertMsgProgressShow: "alertmodal/get_alertMsgProgressShow",
        }),
    },
};
</script>

<style>
.modal-backdrop {
    opacity: 0.2 !important;
}
</style>
