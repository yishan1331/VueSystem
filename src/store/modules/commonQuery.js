const state = {
  queryResponse: null,
  tableBusy: false,
  queryAgain: false,
  inputData: {
    options: [],
    selected: "",
    inputtext: "",
    table: "",
  },
  phpfunction: ""
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
    var inputData = {};
    inputData.options = state.inputData.options;
    inputData.selected = state.inputData.selected;
    inputData.inputtext = state.inputData.inputtext;
    inputData.table = state.inputData.table;
    return inputData;
  },
  get_phpfunction: state => {
    return state.phpfunction;
  }
};
const actions = {
  set_queryResponse(context, data) {
    context.commit("SET_QUERYRESPONSE", data);
  },
  change_tableBusy(context) {
    context.commit("CHANGE_TABLEBUSY");
  },
  do_queryAgain(context) {
    context.commit("DO_QUERYAGAIN");
  },
  set_inputData(context, obj) {
    context.commit("SET_INPUTDATA", obj);
  },
  set_phpfunction(context, data) {
    context.commit("SET_PHPFUNCTION", data);
  }
};
const mutations = {
  SET_QUERYRESPONSE(state, data) {
    state.queryResponse = data;
  },
  CHANGE_TABLEBUSY(state) {
    state.tableBusy = !state.tableBusy;
  },
  DO_QUERYAGAIN(state) {
    state.queryAgain = !state.queryAgain;
  },
  SET_INPUTDATA(state, obj) {
    state.inputData.options = obj.options;
    state.inputData.selected = obj.selected;
    state.inputData.inputtext = obj.inputtext;
    state.inputData.table = obj.table;
  },
  SET_PHPFUNCTION(state, data) {
    state.phpfunction = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
