import axios from "axios";

const state = {
  axiosResult: null
};
const getters = {
  get_axiosResult: state => {
    return state.axiosResult;
  }
};
const actions = {
  async axiosAction(context, params) {
    await axios
      .post("/static/php/modules.php", params)
      .then(
        function(response) {
          const result = response.data;
          context.commit("AXIOSACTION", result);
        }.bind(this)
      )
      .catch(function(err) {
        console.log(err);
      });
  },
};
const mutations = {
  AXIOSACTION(state, result) {
    state.axiosResult = result;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
