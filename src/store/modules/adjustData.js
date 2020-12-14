const state = {
    data: null,
};
const getters = {
    get_contentData: state => {
        return state.data;
    }
};
const actions = {
    adjust_ContentData(context, obj) {
        context.commit("ADJUST_CONTENTDATA", obj);
    },
};
const mutations = {
    ADJUST_CONTENTDATA(state, obj) {
        console.log(obj.status);
        console.log(obj.content);
        state.data = replaceContentData(obj.content, obj.status);
        console.log(state.data);
    },
};

function replaceContentData(content, status) {
    if (status) {
        return (
            content // .replace(/\r\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
                .replace(/\r\n/g, "<br/>")
                // .replace(/\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
                .replace(/\n/g, "<br/>")
                .replace(/\s/g, "&nbsp;")
        );
    } else {
        return content
            .replace(/<br\s*[\/]?>/g, "\n")
            .replace(/&nbsp;/g, " ");
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

