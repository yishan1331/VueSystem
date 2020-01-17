<template>
  <div class="modal">
    <b-modal centered v-model="commonModalShow" no-close-on-backdrop no-close-on-esc>
      <template v-slot:modal-header>
        <slot name="modalheader"></slot>
      </template>
      <template v-slot:default>
        <slot></slot>
      </template>
      <template v-slot:modal-footer>
        <slot name="modalfooter"></slot>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "modal",
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      commonModalShow: "usemodal/get_commonModalShow",
    })
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.inputdiv label {
  float: left;
  margin-right: 5px;
  margin-top: 5px;
  font-size: 16px;
}
.inputdiv div {
  overflow: hidden;
  margin-bottom: 20px;
}
.inputdiv input {
  width: 100%;
  display: block;
}
.wrongpwd {
  background-color: #fee;
  border-color: #e99;
}
h5,
h6 {
  margin: 0 auto !important; 
}
textarea {
  border: 1px solid black;
  width: 280px;
  height: 120px;
  resize: none;
}
</style>
