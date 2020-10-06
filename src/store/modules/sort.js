const state = {
    config: {
        asc: { greater: 1, less: -1 },
        desc: { greater: -1, less: 1 },
    }
};
const getters = {
};
const actions = {
    set_thisSortData(context, obj) {
        context.commit("SET_THISSORTDATA", obj);
    },
};
const mutations = {
    SET_THISSORTDATA(state, obj) {
        console.log(obj.data);
        obj.data = obj.data.sort(dataSorted(obj.sortKey));
        console.log(obj.data);
    },
};
function dataSorted(sortKey) {
    return function innerSort(a, b) {
        let i = 0;
        while (i < sortKey.length) {
            if (i == sortKey.length) return -1;
            if (a[sortKey[i][0]] > b[sortKey[i][0]])
                return state.config[sortKey[i][1]]["greater"];
            if (a[sortKey[i][0]] < b[sortKey[i][0]])
                return state.config[sortKey[i][1]]["less"];
            i++;
        }
    };
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
