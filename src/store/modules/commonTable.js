const state = {
    tableDetail: {
        items: [],
        fields: [],
        which: null,
        children:{}
    },
    tableSlotConfig: {
        slotConfig: {},
        actionConfig: {}
    },
    tableResponse: null,
    tableInWhichTab: {
        index: 0,
        which: null
    },
    activeItemsSeq: null,
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
    get_tableInWhichTab: state => {
        console.log("#########");
        return state.tableInWhichTab;
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
    set_tableInWhichTab(context, obj) {
        console.log("$$$$$$$$$$");
        context.commit("SET_TABLEINWHICHTAB", obj);
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
    SET_TABLEINWHICHTAB(state, obj) {
        state.tableInWhichTab = obj;
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
