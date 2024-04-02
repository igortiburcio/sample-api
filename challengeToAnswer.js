const io = require("socket.io-client");
require("dotenv").config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const websocketServerUrl = process.env.WEBSOCKET_SERVER_URL; // example: 'wss://server.juridico.ai'

// the channel to connect to
const channel = "challenge-to-answer";

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



// fields of a "challenge to answer" message (Réplica)
const params = {
  summary: `O processo refere-se a uma ação de indenização por danos materiais e morais movida pelo autor contra
  o réu após um acidente de trânsito. O autor alega que foi atingido na traseira de seu veículo pelo réu, que
  teria agido com negligência. O autor tentou resolver a situação de forma amigável, sem sucesso, e agora busca
  reparação judicial. O réu contesta as alegações do autor, argumentando que a responsabilidade civil pode ser
  excluída em casos de culpa exclusiva da vítima ou de terceiros e questionando a existência de um nexo causal
  direto entre sua conduta e os danos alegados. O réu também destaca a possibilidade de redução proporcional da
  indenização em caso de culpa concorrente da vítima e a necessidade de moderação na quantificação dos danos morais.`,

  args: `Já a contestação elaborada pelo réu refuta os argumentos do autor, destacando a possibilidade
  de exclusão da responsabilidade civil do réu em casos de culpa exclusiva da vítima ou de terceiro,
  conforme o artigo 927 do Código Civil. Além disso, questiona a existência de um nexo causal direto
  entre a conduta do réu e os danos alegados pelo autor, ressaltando a necessidade de uma análise criteriosa
  das provas apresentadas. Também argumenta sobre a redução proporcional da indenização em caso de culpa
  concorrente da vítima e a limitação da indenização aos danos efetivamente comprovados.
  Por fim, destaca a necessidade de moderação na quantificação dos danos morais para evitar enriquecimento
  sem causa. O réu requer a improcedência dos pedidos do autor, bem como a produção de provas adicionais e a
  análise crítica das provas apresentadas pelo autor.`,

  complaintArgs: `A petição inicial apresenta a ação de indenização por danos materiais e morais movida pelo
  autor contra o réu, alegando negligência deste em um acidente de trânsito. O autor fundamenta sua demanda
  nos artigos 186 e 927 do Código Civil, argumentando que o réu violou direitos e causou danos materiais e
  morais. São mencionadas diversas provas apresentadas, como boletim de ocorrência, laudo pericial e registros médicos.`,

  requests: `1. Condenação do réu ao pagamento de indenização por danos materiais, correspondentes aos prejuízos sofridos pelo autor com o conserto do veículo, bem como quaisquer outros gastos diretamente relacionados ao acidente.
  2. Condenação do réu ao pagamento de indenização por danos morais, em virtude dos transtornos, dores e sofrimentos físicos e psicológicos experimentados pelo autor em decorrência do acidente.
  3. Condenação do réu ao pagamento de indenização por danos estéticos, se aplicável, considerando as lesões permanentes ou marcas resultantes do acidente.
  4. Citação do réu para, querendo, contestar a presente ação, sob pena de revelia e confissão quanto à matéria de fato.
  5. Condenação do réu ao pagamento dos honorários advocatícios, fixados em percentual a ser determinado por este juízo, sobre o valor da condenação.
  6. Produção de todas as provas em direito admitidas, especialmente a documental, testemunhal, pericial e depoimento pessoal do réu, para comprovação do alegado.`,
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