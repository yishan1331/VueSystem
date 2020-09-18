const state = {
    commonmodalShow: false,
    commonModalConfig: {
        hideModalFooter: false,
        hideModalHeader: false,
        hideModalHeaderClose: false,
        centered: true,
        scrollable: true,
        modalClassFull: false,
        size: "md",//'sm', 'md' (default), 'lg', or 'xl'
    },
    //建立defaul commonModalConfig不改變此state
    DEFAULT_commonModalConfig: {
        hideModalFooter: false,
        hideModalHeader: false,
        hideModalHeaderClose: false,
        centered: true,
        scrollable: true,
        modalClassFull: false, //是否使用滿版class
        size: "md",//'sm', 'md' (default), 'lg', or 'xl'
    }
};
const getters = {
    //commonmodal
    get_commonModalShow: state => {
        return state.commonmodalShow;
    },
    get_commonModalConfig: state => {
        return state.commonModalConfig;
    },
    get_DEFAULT_commonModalConfig: state => {
        return state.DEFAULT_commonModalConfig;
    }
};
const actions = {
    //commonmodal
    toggle_commonModal(context, status) {
        context.commit("TOGGLE_COMMONMODAL", status);
    },
    set_commonModalConfig(context, obj) {
        context.commit("SET_COMMONMODALCONFIG", obj);
    },
};
const mutations = {
    //commonmodal
    TOGGLE_COMMONMODAL(state, status) {
        console.log("TOGGLE_COMMONMODAL");
        if (status) {
            state.commonmodalShow = true;
        } else {
            state.commonmodalShow = false;
        }
        console.log(state.commonmodalShow);
    },
    SET_COMMONMODALCONFIG(state, obj) {
        state.commonModalConfig = obj;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
