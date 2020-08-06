const state = {
    partitionStatus: {
        status: false
    }
};
const getters = {
    //getpartitionStatus
    get_getpartitionStatus: state => {
        return state.partitionStatus.status;
    }
};
const actions = {
    //partitionstatus
    change_setPartitionStatus(context, status) {
        context.commit("CHANGE_SETPARTITIONSTATUS", status);
    }
};
const mutations = {
    //partitionstatus
    CHANGE_SETPARTITIONSTATUS(state, status) {
        console.log("CHANGE_SETPARTITIONSTATUS");
        state.partitionStatus.status = status;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
