<template>
    <div class="Structure">
        <b-button @click="img = !img">切換</b-button>
        <div>
            <img v-if="img" src="../../assets/structure1.jpg" />
            <img v-else src="../../assets/structure2.jpg" />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    name: "Structure",
    data() {
        return {
            img: true,
        };
    },
    components: {},
    computed: {
        ...mapGetters({}),
    },
    created: function () {},
    methods: {
        ...mapActions({}),
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img{
    display: block;
    margin: 0 auto;
}
</style>
