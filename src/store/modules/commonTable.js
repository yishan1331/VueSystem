const state = {
    tableDetail: {
        items: [],
        fields: [],
    },
    tableSlotConfig: {
        slotConfig: {},
        actionConfig: {
            edit: { "type": "", "model": "" }, //self,modal
            del: { "type": "", "model": "" }, //self,modal
        }
    },
    tableResponse: null,
    tableInWhichTabIndex: 0,
    activeItemsSeq:null,
};
const getters = {
    get_tableDetail: state => {
        return state.tableDetail;
    },
    get_tableSlotConfig: state => {
        return state.tableSlotConfig;
    },
    get_tableResponse: state => {
        return state.tableResponse;
    },
    get_tableInWhichTabIndex: state => {
        console.log("#########");
        return state.tableInWhichTabIndex;
    },
    get_activeItemsSeq: state => {
        return state.activeItemsSeq;
    },
};
const actions = {
    set_tableDetail(context, obj) {
        context.commit("SET_TABLEDETAIL", obj);
    },
    set_tableSlotConfig(context, obj) {
        context.commit("SET_TABLESLOTCONFIG", obj);
    },
    set_tableResponse(context, data) {
        context.commit("SET_TABLERESPONSE", data);
    },
    set_tableInWhichTabIndex(context, data) {
        console.log("$$$$$$$$$$");
        context.commit("SET_TABLEINWHICHTABINDEX", data);
    },
    set_activeItemsSeq(context, data) {
        context.commit("SET_ACTIVEITEMSEQ", data);
    },
};
const mutations = {
    SET_TABLEDETAIL(state, obj) {
        state.tableDetail = obj;
    },
    SET_TABLESLOTCONFIG(state, obj) {
        state.tableSlotConfig = obj;
    },
    SET_TABLERESPONSE(state, data) {
        state.tableResponse = data;
    },
    SET_TABLEINWHICHTABINDEX(state, data) {
        state.tableInWhichTabIndex = data;
        console.log("%%%%%%%%%%");
    },
    SET_ACTIVEITEMSEQ(state, data) {
        state.activeItemsSeq = data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
