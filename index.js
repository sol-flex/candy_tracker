var socket
var websocketurl

async function openConnection() {
    try{
        if (!window.WebSocket) {
            //Check if browser support WS
            alert("Your browser does not support the WebSocket API!");
        } 
        else {
            websocketurl = document.getElementById("url").value;
            var connstatus = document.getElementById("connectionstatus");
            var infodiv = document.getElementById("info");
            connstatus.innerHTML = "Connecting...";
            infodiv.innerHTML += "<p>Connecting to: " + websocketurl + "</p>";
            //Initialize websocket
            socket = new WebSocket(websocketurl);

            socket.onopen = function() {
                connstatus.innerHTML = "Connected!";
                infodiv.innerHTML += "<p>Connected to: " + websocketurl + "</p>";
            };
            socket.onclose = function() {
                connstatus.innerHTML = "Disconnected!";
                infodiv.innerHTML += "<p>Disconnected from: " + websocketurl + "</p>";
            };
            //message received
            socket.onmessage = function(message) {
                try{
                data = JSON.parse(message.data);
                infodiv.innerHTML += "<p>New token: <a href ='https://explorer.solana.com/tx/" + data.params.result.value.signature + "' target='_blank'>"+ data.params.result.value.signature+"</a></p>";
                console.log(data)
                console.log(data.params.result.value.signature)
              }catch(error){
                console.log(error)
              }
            };
            socket.onerror = function(error) {
                console.log(error)
            };
        }
    }catch(error){
        console.log(error)
    }
}

async function init() {
    if (socket) {
        var message = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "logsSubscribe",
            "params": [
                {
                "mentions": [ "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ" ]
                },
                {
                "commitment": "finalized"
                }
            ]
        })
        socket.send(message);
        document.getElementById("info").innerHTML += "<p>Start listening</p>";
        console.log("start listening")
    }
}

async function closeConnection() {
    if (socket) {
        console.log("close")
        socket.close()      
    }
}

async function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}
