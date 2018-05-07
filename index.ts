const chats = document.getElementById("chats");
chats.className = "Chats";
const messages = document.getElementById("messages");
const refresh = document.getElementById("refresh");
refresh.className = "RefreshButton";
refresh.addEventListener("click", (e: Event) => this.refreshConversations());


// const apiPath = "http://teamnet-qna.azurewebsites.net";
//const agentPath = "http://teamnet-agent.azurewebsites.net";
const apiPath = "https://06e2c2aa.ngrok.io";

setInterval(() =>
    fetch(apiPath + "/api/agent/GetAgentById/1", {
        method: "get",
        headers: new Headers({
            "Content-Type": "application/json",
            "cache": "no-cache",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        }),
        mode: "cors"
    })
        .then(response => response.text())
        .then(text => {
            const conversationId = text.replace(/"/g, '');
            console.log("conversationId", conversationId);
            if (conversationId.length != 0 && conversationId != 'None') {
                createIframe(conversationId);
            }
        })
    , 5 * 1000);




const sendToBot = (id: string, conversationId: string) => {
    const iframe = (document.getElementById(id) as HTMLIFrameElement).contentWindow;
    console.log("iframe", id);
    iframe.postMessage({ conversationId }, window.location.origin);
}

const createIframe = (conversationId: string) => {
    const id = `botchat_${conversationId}`;
    const iframe = <HTMLIFrameElement>document.createElement('iframe');
    iframe.id = id;
    iframe.src = 'botchat?s=ACoV0zRWgbA.cwA.0rQ.chN4-_IaZaggp77g0II0z8HSqpmVU7a8I9h2V9mfY9Y';
    iframe.width = "320";
    iframe.height = "500";
    iframe.onload = (event: Event) => {
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
}

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
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        }),
        mode: "cors"
    })
        .then(response => response.json())
        .then(datas => {
            console.log("datas", datas);
            
            if (datas !== '{}') {
                let clients = JSON.parse(datas);
                console.log("count connexions and wainting connexions : ", clients.length);
                clients.forEach((client) => {
                   // console.log("conversationId", client);
                    createIframe(JSON.stringify(client));
                })
            }                   
        })
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



