const state = {
    alertModalShow: false,
    setTimeOutAlertModalShow: false,
    alertModalShowTime: 900,
    alertMsg: "請稍候....",
    setTimeOutAlertMsg: "",
    alertProgressValue: 0,
    alertProgressModalShow: false
}
const getters = {
    get_alertModalShow: state => {
        console.log("******************");
        console.log(state.alertModalShow);
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
    get_alertProgressValue: state => {
        return state.alertProgressValue
    },
    get_alertMsgProgressShow: state => {
        return state.alertProgressModalShow
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
    set_alertMsgProgressValue(context, value) {
        context.commit('SET_ALERTMSGPROGRESSVALUE', value);
    },
    toggle_alertProgressModal(context, status) {
        context.commit('TOGGLE_ALERTPROGRESSMODAL', status);
    },
}
const mutations = {
    TOGGLE_ALERTMODAL(state, status) {
        if (status) {
            state.alertModalShow = true;
        } else {
            state.alertModalShow = false;
            console.log(this.timer);
            // if (state.setTimeOutAlertModalShow){

            // }else{
            //     state.alertModalShow = false;
            // }
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
    SET_ALERTMSGPROGRESSVALUE(state, value) {
        state.alertProgressValue = value;
        // for (var i = 1; i < 6; i++) {
        //     (function (i) {
        //         setTimeout(function () {
        //             state.alertMsgProgressValue = i * 20;
        //         }, (i + 1) * 500);
        //     })(i)
        // }
        // setTimeout(function () {
        //     state.alertModalShow = false;
        //     state.alertMsgProgressShow = false;
        //     state.alertMsgProgressValue = 0;
        // }, 3900)
    },
    TOGGLE_ALERTPROGRESSMODAL(state, status) {
        if (status) {
            state.alertProgressModalShow = true;
            state.alertModalShow = true;
        } else {
            state.alertModalShow = false;
            state.alertProgressModalShow = false;
            state.alertProgressValue = 0;
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}