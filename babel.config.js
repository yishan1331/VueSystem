const removeConsolePlugin = []
//生產環境移除console.log
//npm install babel-plugin-transform-remove-console --save-dev
//https://forum.vuejs.org/t/remove-console-logs-from-production-buils/39327
//https://segmentfault.com/a/1190000019099641
if (process.env.NODE_ENV === 'production') {
    removeConsolePlugin.push("transform-remove-console")
}
module.exports = {
    plugins: removeConsolePlugin,
    presets: [
        '@vue/cli-plugin-babel/preset'
    ]
}
