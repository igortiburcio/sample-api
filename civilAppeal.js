const io = require("socket.io-client");
require("dotenv").config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const websocketServerUrl = process.env.WEBSOCKET_SERVER_URL; // example: 'wss://server.juridico.ai'

// the channel to connect to
const channel = "civil-appeal";

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



// fields of a "civil appeal" message (Apelação)
const params = {
  summary:`Trata-se de ação de cobrança de honorário advocatícios movida por Carlos Américo em
  face do Condomínio do Edifício Carlos.
  A inicial de fls. 3/11 veio instruída com os documentos de fls. 12/54.
  Contestação de fls. 123/128 com os documentos de fls 129/148.
  Réplica juntada em fls. 150.
  Decisão de fls. 176 declarou saneado o processo.
  É o relatório, decido.` ,

  judgeLegalBasis: `Trata-se de ação de cobrança de honorários, a qual o autor requer a condenação do réu
  ao pagamento de honorários advocatícios no valor de R$23.076,02 (vinte e três mil,
  setecentos e seis reais e dois centavos).
  A lide deve ser resolvida à luz da Lei 8906/94.`,
  
  representation: 'Autor',
  args: '',
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