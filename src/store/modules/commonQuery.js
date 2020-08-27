const state = {
    queryResponse: null,
    tableBusy: false,
    queryAgain: false,
    inputData: {
        options: [],
        selected: "",
        inputtext: "",
    },
    apiParams: {
        table: "",
        attr: "",
        timeattr: "",
        intervaltime: {},
    },
    isInit: true,
    depDetail: null,
};
const getters = {
    get_queryResponse: state => {
        return state.queryResponse;
    },
    get_tableBusy: state => {
        return state.tableBusy;
    },
    receive_queryAgain: state => {
        return state.queryAgain;
    },
    get_inputData: state => {
        return state.inputData;
    },
    get_apiParams: state => {
        return state.apiParams;
    },
    get_isInit: state => {
        return state.isInit;
    },
    get_depDetail: state => {
        return state.depDetail;
    },
};
const actions = {
    set_queryResponse(context, data) {
        context.commit("SET_QUERYRESPONSE", data);
    },
    change_tableBusy(context) {
        context.commit("CHANGE_TABLEBUSY");
    },
    do_queryAgain(context) {
        console.log("###########");
        context.commit("DO_QUERYAGAIN");
    },
    set_inputData(context, obj) {
        context.commit("SET_INPUTDATA", obj);
    },
    set_apiParams(context, obj) {
        context.commit("SET_APIPARAMS", obj);
    },
    set_isInit(context, status) {
        context.commit("SET_ISINIT", status);
    },
    set_depDetail(context, data) {
        context.commit("SET_DEPDETAIL", data);
    },
};
const mutations = {
    SET_QUERYRESPONSE(state, data) {
        state.queryResponse = data;
    },
    CHANGE_TABLEBUSY(state) {
        state.tableBusy = !state.tableBusy;
    },
    DO_QUERYAGAIN(state) {
        console.log("###########");
        state.queryAgain = !state.queryAgain;
        console.log(state.queryAgain);
    },
    SET_INPUTDATA(state, obj) {
        state.inputData = obj;
    },
    SET_APIPARAMS(state, obj) {
        state.apiParams = obj;
    },
    SET_ISINIT(state, status) {
        state.isInit = status;
        console.log(state.isInit);
    },
    SET_DEPDETAIL(state, data) {
        state.depDetail = data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
