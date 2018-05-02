var _this = this;
var chats = document.getElementById("chats");
chats.className = "Chats";
var messages = document.getElementById("messages");
var refresh = document.getElementById("refresh");
refresh.className = "RefreshButton";
refresh.addEventListener("click", function (e) { return _this.refreshConversations(); });
var apiPath = "http://teamnet-qna.azurewebsites.net/";
setInterval(function () {
    return fetch(apiPath + "/api/agent/GetAgentById/1", {
        method: "get",
        headers: new Headers({
            "Content-Type": "application/json",
            "cache": "no-cache",
            "Access-Control-Allow-Origin": "*"
        }),
        mode: "cors"
    })
        .then(function (response) { return response.text(); })
        .then(function (text) {
        var conversationId = text.replace(/"/g, '');
        console.log("conversationId", conversationId);
        if (conversationId.length != 0 && conversationId != 'None') {
            createIframe(conversationId);
        }
    });
}, 5 * 1000);
var sendToBot = function (id, conversationId) {
    var iframe = document.getElementById(id).contentWindow;
    console.log("iframe", id);
    iframe.postMessage({ conversationId: conversationId }, window.location.origin);
};
var createIframe = function (conversationId) {
    var id = "botchat_" + conversationId;
    var iframe = document.createElement('iframe');
    iframe.id = id;
    iframe.src = 'botchat?s=ACoV0zRWgbA.cwA.0rQ.chN4-_IaZaggp77g0II0z8HSqpmVU7a8I9h2V9mfY9Y';
    iframe.width = "320";
    iframe.height = "500";
    iframe.onload = function (event) {
        sendToBot(id, conversationId);
    };
    var close = document.createElement("input");
    close.type = "button";
    close.value = "Close";
    close.addEventListener('click', function () {
        closeChat(close);
    });
    close.className = "CloseButton";
    var chatContener = document.createElement("div");
    chatContener.appendChild(iframe);
    chatContener.appendChild(close);
    chatContener.className = "ChatContener";
    chats.appendChild(chatContener);
    return id;
};
function closeChat(param) {
    var test = param.parentNode;
    while (test.firstChild) {
        test.removeChild(test.firstChild);
    }
}
function refreshConversations() {
    chats.innerHTML = "";
    fetch(apiPath + "/api/agent/RefreshAgent/1", {
        method: "post",
        headers: new Headers({
            "Content-Type": "application/json",
            "cache": "no-cache",
            "Access-Control-Allow-Origin": "*"
        }),
        mode: "cors"
    })
        .then(function (response) { return response.json(); })
        .then(function (datas) {
        console.log("datas", datas);
        if (datas !== '{}') {
            var clients = JSON.parse(datas);
            console.log("count connexions and wainting connexions : ", clients.length);
            clients.forEach(function (client) {
                // console.log("conversationId", client);
                createIframe(JSON.stringify(client));
            });
        }
    });
}
// function Disconnect(conversationId) {
// var data = new FormData();
// data.append("json", JSON.stringify(conversationId));
// fetch(apiPath + "/api/agent/DisconnectConversations/",
//     {
//         method: "POST",
//         body: conversationId
//     })
//     .then(function (res) { return res.json(); })
//     .then(function (data) { alert(JSON.stringify(data)) })
//     fetch(apiPath + "/api/agent/DisconnectConversations", {
//   method: 'post',
//   headers: {
//     'Accept': 'application/json, text/plain, */*',
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({id: conversationId})
// }).then(res=>res.json())
//   .then(res => console.log(res));
// fetch(apiPath + "/api/messages/")
//         .then(response => response.text())
//         .then(text => {
//             console.log("conversationId", text);
//         })
// }
// var disconnect = document.createElement("input");
//     disconnect.type = "button";
//     disconnect.value = "Disconnect";
//     disconnect.addEventListener('click', function () {
//         Disconnect(conversationId);
//     });
//     disconnect.className = "DisconnectButton";
// chatContener.appendChild(disconnect);
