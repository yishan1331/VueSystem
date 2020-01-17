const state = {
  commonModal: {
    ModalShow: false
  }
};
const getters = {
  //commonmodal
  get_commonModalShow: state => {
    return state.commonModal.ModalShow;
  }
};
const actions = {
  //commonmodal
  toggle_commonModalShow(context) {
    context.commit("TOGGLE_COMMONMODAL");
  }
};
const mutations = {
  //commonmodal
  TOGGLE_COMMONMODAL(state) {
    console.log("TOGGLE_COMMONMODAL");
    state.commonModal.ModalShow = !state.commonModal.ModalShow;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
