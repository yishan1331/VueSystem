const state = {
  loginAccount: null,
  loginUsername: null,
  loginStatus: false,
  loginAccessList: null,
  PageAccess: {
    misbulletinboard: false,
    misbulletinmanage: false,
    department: false,
    account: false
  }
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
    var pageAccess = {};
    pageAccess.misbulletinboard = state.PageAccess.misbulletinboard;
    pageAccess.misbulletinmanage = state.PageAccess.misbulletinmanage;
    pageAccess.department = state.PageAccess.department;
    pageAccess.account = state.PageAccess.account;
    return pageAccess;
  }
};
const actions = {
  change_loginData(context, obj) {
    context.commit("CHANGE_LOGINDATA", obj);
  },
  change_pageAccess(context, obj) {
    context.commit("CHANGE_PAGEACCESS", obj);
  },
};
const mutations = {
  CHANGE_LOGINDATA(state, obj) {
    state.loginAccount = obj.account;
    state.loginStatus = obj.status;
    state.loginUsername = obj.username;
    state.loginAccessList = obj.accesslist;
  },
  CHANGE_PAGEACCESS(state, obj) {
    state.PageAccess.misbulletinboard = obj.misbulletinboard;
    state.PageAccess.misbulletinmanage = obj.misbulletinmanage;
    state.PageAccess.department = obj.department;
    state.PageAccess.account = obj.account;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
