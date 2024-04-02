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
  summary: `Trata-se de ação de obrigação de fazer c/c danos morais movida por Fernanda Malta da
  Silva em face da empresa Madeira Madeira Comércio Eletrônico S/A, na qual a autora alega
  ter adquirido um guarda-roupa casal que não foi entregue no prazo estipulado, apesar de
  diversos agendamentos e reclamações. A autora narra que, devido à não entrega do produto,
  teve que armazenar suas roupas de forma improvisada, o que lhe causou transtornos e
  constrangimentos, além de já ter efetuado o pagamento da segunda parcela do produto sem poder usufruir do mesmo.
  A petição inicial enfatiza a responsabilidade do fornecedor em
  cumprir com suas obrigações e evitar abusos contra os consumidores, invocando o Código
  Civil, nos artigos 186 e 927, e o Código de Defesa do Consumidor, especialmente o artigo 6º,
  para fundamentar os pedidos de indenização por danos morais e a entrega do guarda-roupa.
  Na tentativa de alcançar sua pretensão, a parte autora traz à demanda as seguintes provas:
  MENCIONAR PROVAS.
  A presente Contestação visa, portanto, refutar os argumentos apresentados pela parte
  autora, trazendo à tona a realidade dos fatos. Será demonstrado que as alegações da autora
  quanto aos danos morais e à responsabilidade civil da empresa ré necessitam de uma análise
  criteriosa sob a ótica da legislação aplicável, considerando os princípios que regem as
  relações de consumo, a existência de esforços para solucionar o impasse e a
  proporcionalidade das indenizações pleiteadas.
  É a breve síntese do necessário.`,

  args: 'Tutela antecipada para a entregar o Guarda-Roupa, Dano Moral em face do atraso, inversão do onus dda prova.',

  preliminary: `Falta de Interesse Processual`,

  complaintArgs: `Responsabilidade do fornecedor em
  cumprir com suas obrigações e evitar abusos contra os consumidores, invocando o Código
  Civil, nos artigos 186 e 927, e o Código de Defesa do Consumidor, especialmente o artigo 6º,
  para fundamentar os pedidos de indenização por danos morais e a entrega do guarda-roupa.`,

  requests: `a) Sejam concedidos os benefícios da  JUSTIÇA   GRATUITA, nos
  termos do artigo 98 do CPC, sendo certo que a autora não possui
  condições financeiras de arcar com despesas processuais e demais
  cominações de lei sem prejuízo do seu próprio sustento e dos seus
  dependentes, conforme declaração anexa;
  b) A Citação do réu, para que, querendo, ofereça resposta no prazo
  legal, sob pena de sujeitar-se aos efeitos da revelia;
  c) Reconhecimento da relação de consumo e inversão do ônus da
  prova, nos termos do art. 6º, VIII e 42, § único do Código de Defesa
  de Consumidor;
  d) Condenação da parte ré a pagar os danos morais no montante
  justo não inferior a R$20.000,00 (vinte mil reais);
  e) Requer que seja concedida a Tutela de Urgência para determinar
  que a empresa Ré entregue o GUARDA-ROUPA CASAL 6 PORTAS
  6 GAVETAS STILLUS TCIL MOVEIS referente ao número de pedido
  #24795166, valor de R$ 1.929,00 (mil novecentos e vinte nove reais)
  no prazo máximo de 5 (cinco) dias sob pena de multa fixada por
  V.Exelência.
  f) REQUER seja o réu condenado a título de indenização pelo tempo
  útil perdido da autora, a pagar a quantia de R$ 5.000,00 (cinco mil
  reais) pois, assim se sentirá compensado pelo tempo dispensado e
  perdid 
  g) A procedência da presente ação confirmando a tutela de urgência,
  e   ainda   em   caso   de   recurso,   e   requer   que   seja   condenado   ao
  pagamento das custas e honorários advocatícios no percentual de
  20% sobre o valor da causa devidamente corrigido e com incidência
  de juros legais.`,
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