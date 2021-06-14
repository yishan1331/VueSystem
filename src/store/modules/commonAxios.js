import axios from "axios";
import { mergeWith, cloneDeep } from "lodash";

const https = require("https");
//https://github.com/axios/axios/issues/535
const api = axios.create({
    baseURL: "https://yishan-paas.herokuapp.com/"
})
const api_uid = { uid: "@YS@PaaS" }
const config = {
    params: {}
};
config.params["httpsAgent"] = new require("https").Agent({
    rejectUnauthorized: false
});

function customizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
}

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
            .post("/php/modules.php", params)
            .then(
                function (response) {
                    const result = response.data;
                    context.commit("AXIOSACTION", result);
                }.bind(this)
            )
            .catch(function (err) {
                console.log(err);
            });
    },
    async axiosGetAction(context, params) {
        console.log("axiosGetAction");
        let thisconfig = cloneDeep(config);
        if (params.hasOwnProperty("urlparams")) {
            mergeWith(
                thisconfig.params,
                params.urlparams,
                customizer
            );
        }
        mergeWith(
            thisconfig.params,
            api_uid,
            customizer
        );
        console.log(thisconfig);
        await api
            .get(params.url, thisconfig)
            .then(
                function (response) {
                    console.log(response);
                    const result = { "status": response.status, "data": response.data };
                    context.commit("AXIOSACTION", result);
                }.bind(this)
            )
            .catch(function (err) {
                console.log(err);
                console.log(err.response);
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                if (err.response.status === 404) {
                    state.axiosResult = { "status": err.response.status, "data": err.response.statusText };
                }
            });
    },
    async axiosPostAction(context, params) {
        console.log("axiosPostAction");
        let thisconfig = cloneDeep(config);
        if (params.hasOwnProperty("urlparams")) {
            mergeWith(
                thisconfig.params,
                params.urlparams,
                customizer
            );
        }
        mergeWith(
            thisconfig.params,
            api_uid,
            customizer
        );
        console.log(thisconfig);
        await api
            .post(params.url, params.postdata, thisconfig)
            .then(
                function (response) {
                    console.log(response);
                    const result = { "status": response.status, "data": response.data };
                    context.commit("AXIOSACTION", result);
                }.bind(this)
            )
            .catch(function (err) {
                console.log(err);
                if (err.response.status === 404) {
                    state.axiosResult = { "status": err.response.status, "data": err.response.statusText };
                }
            });
    },
    async axiosPatchAction(context, params) {
        console.log("axiosPatchAction");
        let thisconfig = cloneDeep(config);
        if (params.hasOwnProperty("urlparams")) {
            mergeWith(
                thisconfig.params,
                params.urlparams,
                customizer
            );
        }
        mergeWith(
            thisconfig.params,
            api_uid,
            customizer
        );
        console.log(thisconfig);
        await api
            .patch(params.url, params.postdata, thisconfig)
            .then(
                function (response) {
                    console.log(response);
                    const result = { "status": response.status, "data": response.data };
                    context.commit("AXIOSACTION", result);
                }.bind(this)
            )
            .catch(function (err) {
                console.log(err);
                if (err.response.status === 404) {
                    state.axiosResult = { "status": err.response.status, "data": err.response.statusText };
                }
            });
    },
    async axiosDeleteAction(context, params) {
        console.log("axiosDeleteAction");
        let thisconfig = cloneDeep(config);
        if (params.hasOwnProperty("urlparams")) {
            mergeWith(
                thisconfig.params,
                params.urlparams,
                customizer
            );
        }
        mergeWith(
            thisconfig.params,
            api_uid,
            customizer
        );
        //delete method需將postdata整合進config裡
        thisconfig["data"] = params.postdata;
        console.log(thisconfig);
        await api
            .delete(params.url, thisconfig)
            .then(
                function (response) {
                    console.log(response);
                    const result = { "status": response.status, "data": response.data };
                    context.commit("AXIOSACTION", result);
                }.bind(this)
            )
            .catch(function (err) {
                console.log(err);
                if (err.response.status === 404) {
                    state.axiosResult = { "status": err.response.status, "data": err.response.statusText };
                }
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
