<template>
  <div class="PageNotFound">
    <h1>Not Found</h1>
    <h3>3秒後回到首頁</h3>
  </div>
</template>

<script>
export default {
  name: "PageNotFound",
  data() {
    return {};
  },
  mounted: function() {
    console.log(this.$router);
    setTimeout(function() {
      this.$router.push("/index");
    }, 3000);
  }
};
</script>