const state = {
    autoTable: {
        theme: "grid",
        body: null,
        columns: [],
        columnStyles: {},
        headStyles: {},
        exportfilename: "",
        exportfiletype: "PDF",
        text: [],
    },
    ttfStatus: true,
    errorFormat: [],
    autoTableStatus:false,//true為正式匯出，false為測試格式
}
const getters = {
    get_autoTable: state => {
        console.log("~~~~~~~~~");
        return state.autoTable
    },
    get_ttfStatus: state => {
        return state.ttfStatus
    },
    get_errorFormat: state => {
        return state.errorFormat
    },
    get_autoTableStatus: state => {
        return state.autoTableStatus
    },
}
const actions = {
    set_autoTable(context, obj) {
        context.commit('SET_AUTOTABLE', obj);
    },
    set_ttfStatus(context, status) {
        context.commit('SET_TTFSTATUS', status);
    },
    set_errorFormat(context, data) {
        context.commit('SET_ERRORFORMAT', data);
    },
    set_autoTableStatus(context, status) {
        context.commit('SET_AUTOTABLESTATUS', status);
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
    },
    SET_ERRORFORMAT(state, data) {
        state.errorFormat = data;
    },
    SET_AUTOTABLESTATUS(state, status) {
        if (status){
            state.autoTableStatus = true;
        }else{
            state.autoTableStatus = false;
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}