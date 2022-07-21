/* SmtpJS.com - v3.0.0 */
// var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };
// export default Email;

/* Yishan@10282020 使用python api發送email */
import axios from "axios";
const https = require("https");
//https://github.com/axios/axios/issues/535
const api = axios.create({
    baseURL: "https://yishan-paas.herokuapp.com/"
})

var Email = {
    send: function (a) {
        console.log("========send========");
        console.log(new Date());
        console.log(a);
        return new Promise(function (resolve, reject) {
            var t = JSON.stringify(a);
            Email.ajaxPost("api/PaaS/1.0/email/todoListSendEmails?uid=@YS@PaaS", a, function (e) { resolve(e) }, function (e) { reject(e) })
        })
    },
    async ajaxPost(url, data, resolve, reject) {
        console.log("========ajaxPost========");
        console.log(new Date());
        await api
            .post(url, data, {
                httpsAgent: new require("https").Agent({
                    rejectUnauthorized: false
                })
            })
            .then(
                function (response) {
                    console.log(response);
                    resolve(response.data);
                }.bind(this)
            )
            .catch(function (err) {
                console.log(err);
                reject(err)
            });
    },
    ajax: function (e, n) {
        console.log("========ajax========");
        console.log(new Date());
        var t = Email.createCORSRequest("GET", e);
        t.onload = function () {
            var e = t.responseText;
            null != n && n(e)
        },
            t.send()
    },
    createCORSRequest: function (e, n) {
        console.log("========createCORSRequest========");
        console.log(new Date());
        var t = new XMLHttpRequest;
        console.log(t);
        console.log("withCredentials" in t);
        console.log(typeof XDomainRequest);
        return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t
    },
};
export default Email;