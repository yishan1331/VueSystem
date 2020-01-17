<template>
  <div class="home">
    <h1>this is home</h1>
  </div>
</template>

<script>
import modal from "@/components/modal.vue";
import alertModal from "@/components/alertModal.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "home",
  data() {
    return {};
  },
  components: {
    modal,
    alertModal
  },
  computed: {
    ...mapGetters({
      alertModalShow: "alertmodal/get_alertModalShow",
      partitionStatus: "home/get_getpartitionStatus",
      loginData: "getlogin/get_loginData",
      axiosResult: "commonaxios/get_axiosResult"
    })
  },
  created: function() {},
  methods: {
    ...mapActions({
      axiosAction: "commonaxios/axiosAction",
      setalertMsg: "alertmodal/set_alertMsg",
      settimeoutalertModal: "alertmodal/settimeout_alertModal",
      showalertModal: "alertmodal/show_alertModal",
      showalertMsgProgress: "alertmodal/show_alertMsgProgress",
      setalertMsgProgressValue: "alertmodal/set_alertMsgProgressValue",
      togglecommonModalShow: "usemodal/toggle_commonModalShow",
      changesetPartitionStatus: "home/change_setPartitionStatus"
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.photo {
  width: 147px;
  height: 90px;
  display: block;
  margin: auto;
}
.card-body {
  margin: 0 auto;
  padding: 10px;
}
</style>
