<template>
    <div class="Storage container">
        <h4>Sapido Storage Status</h4>
        <b-button pill class="ml-2" variant="success">新增</b-button>
        <commonQuery v-if="tabIndex != 1" />
        <b-card no-body>
            <b-tabs card v-model="tabIndex">
                <b-tab title="查詢" active>
                    <h5 class="card-title" v-if="items.length == 0">選擇查詢條件</h5>
                    <b-table
                        sticky-header="550px"
                        responsive
                        hover
                        :busy="tableBusy"
                        :items="items"
                        :fields="fields"
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
                </b-tab>
                <b-tab title="新增">
                    <systemForm />
                </b-tab>
                <b-tab title="修改">
                    <h5 class="card-title" v-if="items.length == 0">選擇查詢條件</h5>
                    <b-table
                        sticky-header="550px"
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
                </b-tab>
                <b-tab title="刪除">
                    <h5 class="card-title" v-if="items.length == 0">選擇查詢條件</h5>
                    <b-table
                        sticky-header="550px"
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
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
import axios from "axios";
import systemForm from "@/components/systemForm.vue";
import commonQuery from "@/components/commonQuery.vue";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "Storage",
    data() {
        return {};
    },
    created: function () {},
    mounted: function () {},
    components: {
        commonQuery,
        systemForm,
    },
    computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.custom-select {
    width: 200px !important;
}
#input-title {
    width: 200px !important;
}
.formtitlewrong,
.formcontentwrong {
    border: 1px solid red;
}
h5 {
    margin: 0 auto;
}
/*關閉圖示*/
.close {
    position: absolute;
    left: -10px;
    top: -15px;
    width: 25px;
    height: 25px;
    background: silver;
    border-radius: 25px;
    box-shadow: 2px 2px 5px 0px black;
    cursor: pointer;
}
.close:hover {
    background: red;
}
.close:before {
    position: absolute;
    content: "";
    width: 15px;
    height: 5px;
    background: white;
    transform: rotate(45deg);
    top: 10px;
    left: 5px;
}
.close:after {
    content: "";
    position: absolute;
    width: 15px;
    height: 5px;
    background: white;
    transform: rotate(-45deg);
    top: 10px;
    left: 5px;
}
</style>
