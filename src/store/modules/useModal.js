const state = {
    commonModal: {
        ModalShow: false,
        HideModalFooter: false
    }
};
const getters = {
    //commonmodal
    get_commonModalDetail: state => {
        var commonModalDetail = {};
        commonModalDetail.ModalShow = state.commonModal.ModalShow;
        commonModalDetail.HideModalFooter = state.commonModal.HideModalFooter;
        return commonModalDetail;
    }
};
const actions = {
    //commonmodal
    toggle_commonModal(context) {
        context.commit("TOGGLE_COMMONMODAL");
    },
    set_commonModalFooter(context) {
        context.commit("SET_COMMONMODALFOOTER");
    }
};
const mutations = {
    //commonmodal
    TOGGLE_COMMONMODAL(state) {
        console.log("TOGGLE_COMMONMODAL");
        state.commonModal.ModalShow = !state.commonModal.ModalShow;
    },
    SET_COMMONMODALFOOTER(state) {
        console.log("SET_COMMONMODALFOOTER");
        state.commonModal.HideModalFooter = !state.commonModal.HideModalFooter;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
