const state = {
    loginAccount: null,
    loginUsername: null,
    loginStatus: false,
    loginAccessList: null,
    depDetail: {
        selectOptions: [
            { text: '雲端AI(智慧)平台部', value: '1003' },
            { text: '系統研發部', value: '1002' },
            { text: '資訊通訊部', value: '1001' },
            { text: '全選', value: 'ALL' },
        ],
        config: {
            1001: "資訊通訊部",
            1002: "系統研發部",
            1003: "雲端AI(智慧)平台部",
        },
    },
    pageAccess: {
        misbulletinboard: { "authority": false }, //MIS公告區
        misbulletinmanage: { "authority": false }, //MIS公告管理
        department: { "authority": false }, //系統管理-部門
        account: { "authority": false }, //系統管理-帳號
        structure: { "authority": false }, //系統架構-架構圖
        server: { "authority": false }, //系統架構-伺服器狀態
        storage: { "authority": false }, //系統架構-儲存設備狀態
        todolist: {
            "authority": false,
            "remark": {
                commonQueryCondition: {
                    main: null,
                }
            }
        }, //報告-待辦事項
        weeklyreport: {
            "authority": false,
            "remark": {
                commonQueryCondition: {
                    main: null,
                }
            }
        }, //報告-週報表
        meetingminutes: {
            "authority": false,
            remark: {
                commonQueryCondition: {
                    main: null,
                    secondary: null,
                },
                dataHandleAuthority: null,
            }, //報告-會議記錄
        }
    },
    // DEFAULT_pageAccess: {
    //     bulletin: {
    //         label: "系統公告",
    //         children: {
    //             board: { "authority": false },
    //             manage: { "authority": false },
    //         }
    //     },
    //     management: {
    //         label: "系統管理",
    //         children: {
    //             department: { "authority": false },
    //             account: { "authority": false },
    //         }
    //     },
    //     architecture: {
    //         label: "系統架構",
    //         children: {
    //             structure: { "authority": false },
    //             server: { "authority": false },
    //             storage: { "authority": false },
    //         }
    //     },
    //     report: {
    //         label: "報告",
    //         children: {
    //             todolist: {
    //                 "authority": false,
    //                 remark: {
    //                     commonQueryCondition: {
    //                         main: null
    //                     }
    //                 }
    //             },
    //             weeklyreport: {
    //                 "authority": false,
    //                 remark: {
    //                     commonQueryCondition: {
    //                         main: null
    //                     }
    //                 }
    //             },
    //             meetingminutes: {
    //                 "authority": false,
    //                 remark: {
    //                     commonQueryCondition: {
    //                         main: [],
    //                         secondary: null
    //                     },
    //                     dataHandleAuthority: []
    //                 },
    //             },
    //         }
    //     },
    // },
    DEFAULT_pageAccess: {
        misbulletinboard: { "authority": false }, //MIS公告區
        misbulletinmanage: { "authority": false }, //MIS公告管理
        department: { "authority": false }, //系統管理-部門
        account: { "authority": false }, //系統管理-帳號
        structure: { "authority": false }, //系統架構-架構圖
        server: { "authority": false }, //系統架構-伺服器狀態
        storage: { "authority": false }, //系統架構-儲存設備狀態
        todolist: {
            "authority": false,
            "remark": {
                commonQueryCondition: {
                    main: null,
                }
            }
        }, //報告-待辦事項
        weeklyreport: {
            "authority": false,
            "remark": {
                commonQueryCondition: {
                    main: null,
                }
            }
        }, //報告-週報表
        meetingminutes: {
            "authority": false,
            remark: {
                commonQueryCondition: {
                    main: [],
                    secondary: null,
                },
                dataHandleAuthority: [],
            }, //報告-會議記錄
        }
    },
    pageAccessConfig: {
        misbulletinboard: { "authority": false }, //MIS公告區
        misbulletinmanage: { "authority": false }, //MIS公告管理
        department: { "authority": false }, //系統管理-部門
        account: { "authority": false }, //系統管理-帳號
        structure: { "authority": false }, //系統架構-架構圖
        server: { "authority": false }, //系統架構-伺服器狀態
        storage: { "authority": false }, //系統架構-儲存設備狀態
        todolist: {
            "authority": false,
            "remark": {
                commonQueryCondition: {
                    main: {
                        "options": [
                            { text: '雲端AI(智慧)平台部', value: '1003' },
                            { text: '系統研發部', value: '1002' },
                            { text: '資訊通訊部', value: '1001' },
                            { text: '全選', value: 'ALL' },
                        ],
                        multiple: false,
                        "placeholder": "選擇查詢部門條件",
                    }
                }
            }
        }, //報告-待辦事項
        weeklyreport: {
            "authority": false,
            "remark": {
                commonQueryCondition: {
                    main: {
                        "options": [
                            { text: '雲端AI(智慧)平台部', value: '1003' },
                            { text: '系統研發部', value: '1002' },
                            { text: '資訊通訊部', value: '1001' },
                            { text: '全選', value: 'ALL' },
                        ],
                        multiple: false,
                        "placeholder": "選擇查詢部門條件",
                    }
                }
            }
        }, //報告-週報表
        meetingminutes: {
            "authority": false,
            remark: {
                commonQueryCondition: {
                    main: {
                        "options": [
                            { text: '雲端AI(智慧)平台部', value: '1003' },
                            { text: '系統研發部', value: '1002' },
                            { text: '資訊通訊部', value: '1001' },
                            { text: '共用', value: 'common' },
                        ],
                        multiple: true,
                        "placeholder": "選擇查詢條件",
                    },
                    secondary: {
                        "options": [
                            { text: '員工', value: 'employee', },
                            { text: '主管', value: 'supervisor' },
                        ],
                        multiple: false,
                        "placeholder": "選擇職位階級",
                    },
                },
                dataHandleAuthority: {
                    "options": [
                        { text: '查詢', value: 'query' },
                        { text: '修改', value: 'modify' },
                        { text: '刪除', value: 'delete' },
                        { text: '新增', value: 'add' },
                    ],
                    multiple: true,
                    "placeholder": "選擇可執行權限",
                },
            },
        }//報告-會議記錄
    },
    // pageAccessConfig: {
    //     bulletin: {
    //         label: "系統公告",
    //         children: {
    //             board: { label: "公告區", },
    //             manage: { label: "公告管理", },
    //         }
    //     },
    //     management: {
    //         label: "系統管理",
    //         children: {
    //             department: { label: "部門", },
    //             account: { label: "帳號", },
    //         }
    //     },
    //     architecture: {
    //         label: "系統架構",
    //         children: {
    //             structure: { label: "架構圖", },
    //             server: { label: "伺服器狀態", },
    //             storage: { label: "儲存設備狀態", },
    //         }
    //     },
    //     report: {
    //         label: "報告",
    //         children: {
    //             todolist: {
    //                 label: "待辦事項",
    //                 remark: {
    //                     commonQueryCondition: {
    //                         main: {
    //                             "options": [
    //                                 { text: '雲端AI(智慧)平台部', value: '1003' },
    //                                 { text: '系統研發部', value: '1002' },
    //                                 { text: '資訊通訊部', value: '1001' },
    //                                 { text: '全選', value: 'ALL' },
    //                             ],
    //                             multiple: false,
    //                             "placeholder": "選擇查詢部門條件",
    //                         }
    //                     }
    //                 }
    //             },
    //             weeklyreport: {
    //                 label: "週報表",
    //                 remark: {
    //                     commonQueryCondition: {
    //                         main: {
    //                             "options": [
    //                                 { text: '雲端AI(智慧)平台部', value: '1003' },
    //                                 { text: '系統研發部', value: '1002' },
    //                                 { text: '資訊通訊部', value: '1001' },
    //                                 { text: '全選', value: 'ALL' },
    //                             ],
    //                             multiple: false,
    //                             "placeholder": "選擇查詢部門條件",
    //                         }
    //                     }
    //                 }
    //             },
    //             meetingminutes: {
    //                 label: "會議記錄",
    //                 remark: {
    //                     commonQueryCondition: {
    //                         main: {
    //                             "options": [
    //                                 { text: '雲端AI(智慧)平台部', value: '1003' },
    //                                 { text: '系統研發部', value: '1002' },
    //                                 { text: '資訊通訊部', value: '1001' },
    //                                 { text: '共用', value: 'common' },
    //                             ],
    //                             multiple: true,
    //                             "placeholder": "選擇查詢條件",
    //                         },
    //                         secondary: {
    //                             "options": [
    //                                 { text: '員工', value: 'employee', },
    //                                 { text: '主管', value: 'supervisor' },
    //                             ],
    //                             multiple: false,
    //                             "placeholder": "選擇職位階級",
    //                         },
    //                     },
    //                     dataHandleAuthority: {
    //                         "options": [
    //                             { text: '查詢', value: 'query' },
    //                             { text: '修改', value: 'modify' },
    //                             { text: '刪除', value: 'delete' },
    //                             { text: '新增', value: 'add' },
    //                         ],
    //                         multiple: true,
    //                         "placeholder": "選擇可執行權限",
    //                     },
    //                 },
    //             },
    //         }
    //     },
    // },
    pageAccessCH: {
        misbulletinboard: "MIS公告區",
        misbulletinmanage: "MIS公告管理",
        department: "部門",
        account: "帳號",
        structure: "架構圖",
        server: "伺服器狀態",
        storage: "儲存設備狀態",
        todolist: "待辦事項",
        weeklyreport: "工作週報",
        meetingminutes: "會議記錄",
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
    get_DEFAULT_pageAccess: state => {
        return state.DEFAULT_pageAccess;
    },
    get_pageAccessConfig: state => {
        return state.pageAccessConfig;
    },
    get_pageAccessCH: state => {
        console.log(state.pageAccessCH);
        return state.pageAccessCH;
    },
    get_depDetail: state => {
        return state.depDetail;
    },
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
