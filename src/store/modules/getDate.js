const state = {
    now: "",
    nowFormat: "",
    thisweekday: []
};
const getters = {
    get_Date: state => {
        var Date = {};
        Date.now = state.now;
        Date.nowFormat = state.nowFormat;
        Date.thisweekday = state.thisweekday;
        return Date;
    },
};
const actions = {
    set_Date(context, obj) {
        context.commit("SET_DATE", obj);
    }
};
const mutations = {
    SET_DATE(state, obj) {
        state.now = obj.now;
        state.nowFormat = obj.nowFormat;
        state.thisweekday = obj.thisweekday;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
