const state = {
  vforData: {},
  selectOptions: [],
  completedData: {},
  systemFormResponse: false
};
const getters = {
  get_vforData: state => {
    return state.vforData;
  },
  get_selectOptions: state => {
    return state.selectOptions;
  },
  get_completedData: state => {
    return state.completedData;
  },
  get_systemFormResponse: state => {
    return state.systemFormResponse;
  }
};
const actions = {
  set_vforData(context, data) {
    context.commit("SET_VFORDATA", data);
  },
  set_selectOptions(context, data) {
    context.commit("SET_SELECTOPTIONS", data);
  },
  set_completedData(context, data) {
    context.commit("SET_COMPLETEDDATA", data);
  },
  set_systemFormResponse(context) {
    context.commit("SET_SYSTEMFORMRESPONSE");
  }
};
const mutations = {
  SET_VFORDATA(state, data) {
    state.vforData = data;
  },
  SET_SELECTOPTIONS(state, data) {
    state.selectOptions = data;
  },
  SET_COMPLETEDDATA(state, data) {
    state.completedData = data;
  },
  SET_SYSTEMFORMRESPONSE(state) {
    state.systemFormResponse = !state.systemFormResponse;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
