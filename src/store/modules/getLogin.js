const state = {
    loginAccount: null,
    loginUsername: null,
    loginStatus: false,
    loginAccessList: null,
    pageAccess: {
        misbulletinboard: { "status": false }, //MIS公告區
        misbulletinmanage: { "status": false }, //MIS公告管理
        department: { "status": false }, //系統管理-部門
        account: { "status": false }, //系統管理-帳號
        structure: { "status": false }, //系統架構-架構圖
        todolist: { "status": false, "remark": null }, //報告-待辦事項
    },
    pageAccessCH: {
        misbulletinboard: "MIS公告區",
        misbulletinmanage: "MIS公告管理",
        department: "部門",
        account: "帳號",
        structure: "架構圖",
        todolist: "待辦事項",
    },
};
const getters = {
    get_loginData: state => {
        var loginData = {};
        loginData.account = state.loginAccount;
        loginData.username = state.loginUsername;
        loginData.status = state.loginStatus;
        loginData.accesslist = state.loginAccessList;
        return loginData;
    },
    get_pageAccess: state => {
        console.log(state.pageAccess);
        return state.pageAccess;
    },
    get_pageAccessCH: state => {
        console.log(state.pageAccessCH);
        return state.pageAccessCH;
    }
};
const actions = {
    change_loginData(context, obj) {
        context.commit("CHANGE_LOGINDATA", obj);
    },
    change_pageAccess(context, obj) {
        context.commit("CHANGE_PAGEACCESS", obj);
    }
};
const mutations = {
    CHANGE_LOGINDATA(state, obj) {
        state.loginAccount = obj.account;
        state.loginStatus = obj.status;
        state.loginUsername = obj.username;
        state.loginAccessList = obj.accesslist;
    },
    CHANGE_PAGEACCESS(state, obj) {
        state.pageAccess = obj
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
