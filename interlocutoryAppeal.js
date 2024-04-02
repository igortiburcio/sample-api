const io = require("socket.io-client");
require("dotenv").config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const websocketServerUrl = process.env.WEBSOCKET_SERVER_URL; // example: 'wss://server.juridico.ai'

// the channel to connect to
const channel = "interlocutory-appeal";

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
  summary: `Alega-se a falta de interesse processual da autora por não esgotar as vias administrativas antes da ação judicial, conforme previsto no CDC.
  A defesa destaca os esforços da empresa para solucionar o impasse e argumenta que eventual atraso na entrega pode se enquadrar como caso fortuito ou força maior.
  Ademais, ressalta-se a necessidade de comprovação concreta de dano moral, a aplicação dos princípios da proporcionalidade e razoabilidade na fixação de indenizações
  e a observância da boa-fé objetiva nas relações contratuais. Requer-se a improcedência dos pedidos da autora, além do ressarcimento das custas processuais e honorários
  advocatícios.`,

  judgeLegalBasis: `O autor solicita o benefício da Justiça Gratuita alegando insuficiência financeira para arcar com as despesas do processo.
  Porém, após análise dos documentos e circunstâncias, não há elementos que comprovem essa condição.
  Indícios como movimentações bancárias e padrão de vida contradizem a hipossuficiência alegada.
  A concessão desse benefício requer prova concreta de incapacidade financeira, não apenas alegação.
  Portanto, o pedido é indeferido, e o autor deve pagar as custas processuais e honorários advocatícios em 15 dias, sob pena de cancelamento da distribuição do processo.`,

  representation: 'Autor',
  // optional args: '',
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