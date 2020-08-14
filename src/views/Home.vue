<template>
    <div class="home">
        <h1>this is home</h1>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    name: "home",
    data() {
        return {};
    },
    components: {
    },
    computed: {
        ...mapGetters({
        }),
    },
    created: function () {},
    methods: {
        ...mapActions({
        }),
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
