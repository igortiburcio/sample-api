const io = require("socket.io-client");
require("dotenv").config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const websocketServerUrl = process.env.WEBSOCKET_SERVER_URL; // example: 'wss://server.juridico.ai'

// the channel to connect to
const channel = "employment-complaint";

// base64 encode the clientId and clientSecret to generate the token to connect to the server
const token = Buffer.from(clientId + ":" + clientSecret).toString("base64");
console.log("token", token);
const newSocket = io(websocketServerUrl, {
  query: {
    token: token,
  },
});

newSocket.on("connect", () => {
  console.log("Socket.IO connected");
});

newSocket.on("disconnect", () => {
  console.log("Socket.IO disconnected");
});

newSocket.on("connect_error", (err) => {
  console.error(err);
  console.log(`connection error due to ${err.message}`);
});

// string that will be appending the stream results
let finalResponse = "";
newSocket.on(channel, (data) => {
  console.log("Incoming data:", data);
  if (data.error) {
    console.log("Error:", data.error);
  }
  if (data.text) {
    finalResponse += data.text;
  }
  if (data.finished) {
    console.log("Final response:", finalResponse);
  }
});


// fields of a "complaint" message (Petição inicial)
const params = {
  type: "Ação de Trabalhista",
  value: "R$ 20.000,00",
  court: "1ª Vara do Trabalho da Comarca de São Paulo",
  facts: "O autor foi demitido injustamente por causa de boatos espúrios.",
  theses: "É devida reintegração ao cargo.",
  proofs: "Testemunha do Fato",
  preliminary: "Da necessidade de concessão do benefício de Justiça Gratuita",
};

const emitEvent = () => {
  console.log("socket", newSocket);
  if (newSocket.connected) {
    console.log("Socket is connected, emitting the event");
    // triggers the event
    newSocket.emit(channel, params);
  } else {
    console.log("Socket is not connected yet, waiting a bit to emit the event");
    setTimeout(() => {
      emitEvent();
    }, 1000);
  }
}

setTimeout(() => {
  emitEvent();
}, 2000);