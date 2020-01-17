const state = {
    alertModalShow : false,
    alertModalShowTime : 900,
    alertMsg :"",
    alertMsgProgressValue:0,
    alertMsgProgressShow:false
}
const getters = {
    get_alertModalShow: state =>  {
        return state.alertModalShow
    },
    get_alertMsg: state =>  {
        return state.alertMsg
    },
    get_alertMsgProgressValue: state =>  {
        return state.alertMsgProgressValue
    },
    get_alertMsgProgressShow: state =>  {
        return state.alertMsgProgressShow
    },
}
const actions = {
    show_alertModal(context) {
        context.commit('SHOW_ALERTMODAL');
    },
    hide_alertModal(context) {
        context.commit('HIDE_ALERTMODAL');
    },
    settimeout_alertModal(context,time) {
        if(typeof(time) === "undefined"){
            time = state.alertModalShowTime;
        }
        context.commit('SETTIMEOUT_ALERTMODAL',time);
    },
    set_alertMsg(context,msg) {
        context.commit('SET_ALERTMSG',msg);
    },
    set_alertMsgProgressValue(context) {
        context.commit('SET_ALERTMSGPROGRESSVALUE');
    },
    show_alertMsgProgress(context) {
        context.commit('SHOW_ALERTMSGPROGRESS');
    },
}
const mutations = {
    SHOW_ALERTMODAL(state) {
        state.alertModalShow = true;
    },
    HIDE_ALERTMODAL(state) {
        state.alertModalShow = false;
    },
    SETTIMEOUT_ALERTMODAL(state,time) {
        state.alertModalShow = true;
        this.timer = setTimeout(() => {
            state.alertModalShow = false;
        }, time)
    },
    SET_ALERTMSG(state, msg) {
        state.alertMsg = msg;
    },
    SET_ALERTMSGPROGRESSVALUE(state) {
        for(var i =1;i<6;i++){
            (function(i) {
                setTimeout(function() {
                    state.alertMsgProgressValue = i*20;
                }, (i + 1) * 500);
            })(i)
        }
        setTimeout(function() {
            state.alertModalShow = false;
            state.alertMsgProgressShow = false;
            state.alertMsgProgressValue = 0;
        },3900)
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