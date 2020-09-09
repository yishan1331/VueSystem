const state = {
    alertModalShow: false,
    setTimeOutAlertModalShow: false,
    alertModalShowTime: 900,
    alertMsg: "請稍候....",
    setTimeOutAlertMsg: "",
    alertMsgProgressValue: 0,
    alertMsgProgressShow: false
}
const getters = {
    get_alertModalShow: state => {
        return state.alertModalShow
    },
    get_setTimeOutalertModalShow: state => {
        return state.setTimeOutAlertModalShow
    },
    get_alertMsg: state => {
        return state.alertMsg
    },
    get_setTimeOutAlertMsg: state => {
        return state.setTimeOutAlertMsg
    },
    get_alertMsgProgressValue: state => {
        return state.alertMsgProgressValue
    },
    get_alertMsgProgressShow: state => {
        return state.alertMsgProgressShow
    },
}
const actions = {
    toggle_alertModal(context, status) {
        console.log("---------------");
        context.commit('TOGGLE_ALERTMODAL', status);
    },
    settimeout_alertModal(context, time) {
        if (typeof (time) === "undefined") {
            time = state.alertModalShowTime;
        }
        context.commit('SETTIMEOUT_ALERTMODAL', time);
    },
    set_alertMsg(context, msg) {
        context.commit('SET_ALERTMSG', msg);
    },
    set_setTimeOutAlertMsg(context, msg) {
        context.commit('SET_SETTIMEOUTALERTMSG', msg);
    },
    set_alertMsgProgressValue(context) {
        context.commit('SET_ALERTMSGPROGRESSVALUE');
    },
    show_alertMsgProgress(context) {
        context.commit('SHOW_ALERTMSGPROGRESS');
    },
}
const mutations = {
    TOGGLE_ALERTMODAL(state, status) {
        if (status) {
            state.alertModalShow = true;
        } else {
            state.alertModalShow = false;
        }
        console.log(state.alertModalShow);
    },
    SETTIMEOUT_ALERTMODAL(state, time) {
        state.setTimeOutAlertModalShow = true;
        this.timer = setTimeout(() => {
            state.setTimeOutAlertModalShow = false;
        }, time)
    },
    SET_ALERTMSG(state, msg) {
        state.alertMsg = msg;
    },
    SET_SETTIMEOUTALERTMSG(state, msg) {
        state.setTimeOutAlertMsg = msg;
    },
    SET_ALERTMSGPROGRESSVALUE(state) {
        for (var i = 1; i < 6; i++) {
            (function (i) {
                setTimeout(function () {
                    state.alertMsgProgressValue = i * 20;
                }, (i + 1) * 500);
            })(i)
        }
        setTimeout(function () {
            state.alertModalShow = false;
            state.alertMsgProgressShow = false;
            state.alertMsgProgressValue = 0;
        }, 3900)
    },
    SHOW_ALERTMSGPROGRESS(state) {
        state.alertMsgProgressShow = true;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}