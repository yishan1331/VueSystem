const state = {
    autoTable: {
        theme: "grid",
        body: null,
        columns: [],
        columnStyles: {},
        headStyles: {},
        exportfilename: "",
        exportfiletype: "PDF",
        text:[],
    },
    ttfStatus: true
}
const getters = {
    get_autoTable: state => {
        console.log("~~~~~~~~~");
        return state.autoTable
    },
    get_ttfStatus: state => {
        return state.ttfStatus
    }
}
const actions = {
    set_autoTable(context, obj) {
        context.commit('SET_AUTOTABLE', obj);
    },
    set_ttfStatus(context, status) {
        context.commit('SET_TTFSTATUS', status);
    }
}
const mutations = {
    SET_AUTOTABLE(state, obj) {
        state.autoTable = Object.assign({}, state.autoTable, obj);
        console.log(state.autoTable);
    },
    SET_TTFSTATUS(state, status) {
        if (status) {
            state.ttfStatus = true;
        } else {
            state.ttfStatus = false;
        }
        console.log(state.ttfStatus);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}