const state = {
    queryResponse: null,
    thisQueryTimeInterval: null,
    tableBusy: false,
    queryAgain: false,
    inputData: {
        label: "條件",
        options: [],
        selected: "",
        conversiontable: {}, //中英對照表
        usetime: true,
        childcondition: "input",
        secondcondition: [false],
        second_selected: "",
    },
    //建立defaul inputData不改變此state
    DEFAULT_inputData: {
        label: "條件",
        options: [],
        selected: "",
        conversiontable: {},
        usetime: true,
        childcondition: "input",
        secondcondition: [false],
        second_selected: "",
    },
    apiParams: {
        type: "normal", //預設為抓CommonSqlSyntaxQuery多條件查詢api
        normal: {
            table: "",
            attr: "",
            timeattr: "lastUpdateTime",
            intervaltime: {},
        },
        join: {},
        customized: {},
    },
    //建立defaul apiParams不改變此state
    DEFAULT_apiParams: {
        type: "normal", //預設為抓CommonSqlSyntaxQuery多條件查詢api
        normal: {
            table: "",
            attr: "",
            timeattr: "lastUpdateTime",
            intervaltime: {},
        },
        join: {},
        customized: {},
    },
    isInit: true,
    conditionOptions: [],
};
const getters = {
    get_queryResponse: state => {
        return state.queryResponse;
    },
    get_thisQueryTimeInterval: state => {
        return state.thisQueryTimeInterval;
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
    get_DEFAULT_inputData: state => {
        return state.DEFAULT_inputData;
    },
    get_apiParams: state => {
        return state.apiParams;
    },
    get_DEFAULT_apiParams: state => {
        return state.DEFAULT_apiParams;
    },
    get_isInit: state => {
        return state.isInit;
    },
    get_conditionOptions: state => {
        return state.conditionOptions;
    },
};
const actions = {
    set_queryResponse(context, data) {
        context.commit("SET_QUERYRESPONSE", data);
    },
    set_thisQueryTimeInterval(context, data) {
        context.commit("SET_THISQUERYTIMEINTERVAL", data);
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
    set_conditionOptions(context, data) {
        context.commit("SET_CONDITIONOPTIONS", data);
    },
};
const mutations = {
    SET_QUERYRESPONSE(state, data) {
        state.queryResponse = data;
    },
    SET_THISQUERYTIMEINTERVAL(state, data) {
        state.thisQueryTimeInterval = data;
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
    SET_CONDITIONOPTIONS(state, data) {
        state.conditionOptions = data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
