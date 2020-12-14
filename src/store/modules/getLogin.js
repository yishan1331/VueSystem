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
        bulletin: {
            authority: false,
            children: {
                board: { "authority": false },
                manage: { "authority": false },
            }
        },
        management: {
            authority: false,
            children: {
                department: { "authority": false },
                account: { "authority": false },
            }
        },
        architecture: {
            authority: false,
            children: {
                structure: { "authority": false },
                server: { "authority": false },
                storage: { "authority": false },
            }
        },
        report: {
            authority: false,
            children: {
                todolist: {
                    "authority": false,
                    remark: {
                        commonQueryCondition: {
                            main: null
                        }
                    }
                },
                weeklyreport: {
                    "authority": false,
                    remark: {
                        commonQueryCondition: {
                            main: null
                        }
                    }
                },
                meetingminutes: {
                    "authority": false,
                    remark: {
                        commonQueryCondition: {
                            main: [],
                            secondary: null
                        },
                        dataHandleAuthority: []
                    },
                },
                sop: {
                    "authority": false,
                    remark: {
                        commonQueryCondition: {
                            main: null,
                            secondary: null
                        },
                        dataHandleAuthority: []
                    },
                },
            }

        },
        tool: {
            authority: false,
            children: {
                fileupdownload: { "authority": false }
            }
        },
    },
    DEFAULT_pageAccess: {
        bulletin: {
            authority: false,
            children: {
                board: { "authority": false },
                manage: { "authority": false },
            }
        },
        management: {
            authority: false,
            children: {
                department: { "authority": false },
                account: { "authority": false },
            }
        },
        architecture: {
            authority: false,
            children: {
                structure: { "authority": false },
                server: { "authority": false },
                storage: { "authority": false },
            }
        },
        report: {
            authority: false,
            children: {
                todolist: {
                    "authority": false,
                    remark: {
                        commonQueryCondition: {
                            main: null
                        }
                    }
                },
                weeklyreport: {
                    "authority": false,
                    remark: {
                        commonQueryCondition: {
                            main: null
                        }
                    }
                },
                meetingminutes: {
                    "authority": false,
                    remark: {
                        commonQueryCondition: {
                            main: [],
                            secondary: null
                        },
                        dataHandleAuthority: []
                    },
                },
                sop: {
                    "authority": false,
                    remark: {
                        commonQueryCondition: {
                            main: null,
                            secondary: null
                        },
                        dataHandleAuthority: []
                    },
                },
            }
        },
        tool: {
            authority: false,
            children: {
                fileupdownload: { "authority": false }
            }
        },
    },
    pageAccessConfig: {
        bulletin: {
            label: "系統公告",
            children: {
                board: { label: "公告區", },
                manage: { label: "公告管理", },
            }
        },
        management: {
            label: "系統管理",
            children: {
                department: { label: "部門", },
                account: { label: "帳號", },
            }
        },
        architecture: {
            label: "系統架構",
            children: {
                structure: { label: "架構圖", },
                server: { label: "伺服器狀態", },
                storage: { label: "儲存設備狀態", },
            }
        },
        report: {
            label: "報告",
            children: {
                todolist: {
                    label: "待辦事項",
                    remark: {
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
                },
                weeklyreport: {
                    label: "週報表",
                    remark: {
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
                },
                meetingminutes: {
                    label: "會議記錄",
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
                },
                sop: {
                    label: "SOP文件",
                    remark: {
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
                },
            }
        },
        tool: {
            label: "工具",
            children: {
                fileupdownload: { label: "暫時檔案上傳下載" }
            }
        }
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
