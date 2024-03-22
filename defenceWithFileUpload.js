const io = require("socket.io-client");
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');
require("dotenv").config();

// Curl example: curl -X POST -H "Authorization: Bearer <YOUR_TOKEN>" -F "file=@/home/username/documents/peticao.pdf" -F "pdfType=complaint" http://localhost:3030/ai/summarizePdf
// curl -X POST -H "Authorization: Bearer ZjA3ZjliYzI4MmNhMDBjNjY2OTQ0ZTYyMDMyYjljYWE6YzM0MGZlNGVlNzRjMDJlMDhhZjkwNDU4NjRjOTk5ZmFiZTkxMDdjZWVjOTQ1OTJkM2I3ZjU2MDc4ZTdkYmM4Yg==" -F "file=@/Users/barsmike/workspace/personal/juridico/juridico-integration-sample/peticao.pdf" -F "pdfType=complaint" http://localhost:3030/ai/summarizePdf

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const websocketServerUrl = process.env.WEBSOCKET_SERVER_URL; // example: 'wss://server.juridico.ai'
const restServerUrl = process.env.REST_SERVER_URL; // example: 'https://server.juridico.ai'

// the channel to connect to
const channel = "defence";
const pdfType = "complaint"; // internal name for the Complaint (or "Petição Inicial") pdf

// base64 encode the clientId and clientSecret to generate the token to connect to the server
const token = Buffer.from(clientId + ":" + clientSecret).toString("base64");
console.log("token", token);

async function updateParamsWithPdf(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('pdfType', pdfType);

  try {
    // POST with multipart/form-data
    const response = await axios.post(`${restServerUrl}/ai/summarizePdf`, form, {
      headers: {
        // ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    const result = response.data;
    console.log('Summary result:', result);

    return result;
  } catch (error) {
    console.error('Error updating params with PDF summary:', error);
  }
}

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
// fields of a "defence" message (Contestação)
const manualInputParams = {
  authorProofs: `
    1. Pedido de Justiça Gratuita
    2. Citação do réu para oferecer resposta
    3. Reconhecimento da relação de consumo e inversão do ônus da prova
    4. Condenação da parte ré a pagar danos morais
    5. Concessão de Tutela de Urgência para entrega do guarda-roupa
    6. Pedido de indenização pelo tempo útil perdido
    7. Procedência da ação e condenação ao pagamento das custas e honorários advocatícios
  `,
  theses: `
    1. **Ausência de Responsabilidade pelo Fato do Produto ou Serviço (Art. 14, § 3º, do CDC)**: Argumentar que a empresa não pode ser responsabilizada pelos danos alegados, pois o atraso na entrega pode ter sido causado por fatores externos, como problemas logísticos ou greves, que fogem ao controle da empresa. Isso se enquadra nas excludentes de responsabilidade previstas no Código de Defesa do Consumidor.

    2. **Inexistência de Dano Moral (Art. 186 e Art. 927 do Código Civil)**: Defender que o simples atraso na entrega de um produto, sem evidências de prejuízos concretos à autora que ultrapassem meros aborrecimentos, não configura dano moral indenizável, conforme jurisprudência consolidada.

    3. **Contestação da Verossimilhança das Alegações para Inversão do Ônus da Prova (Art. 6º, VIII, do CDC)**: Argumentar contra a inversão do ônus da prova, demonstrando que as alegações da autora não são suficientemente verossímeis para justificar tal medida, e que a empresa possui evidências que contestam as alegações da autora.

    4. **Proporcionalidade e Razoabilidade do Valor Indenizatório (Art. 944 do Código Civil)**: Caso seja reconhecida alguma responsabilidade, argumentar que o valor solicitado para indenização por danos morais é desproporcional e não razoável, solicitando a redução do montante para um valor que esteja em consonância com os princípios da proporcionalidade e razoabilidade, e com precedentes judiciais para casos semelhantes.

    5. **Questionamento sobre a Concessão da Justiça Gratuita (Lei 1.060/50 e Art. 5º, LXXIV, da CF/88)**: Contestar o pedido de justiça gratuita apresentado pela autora, requerendo que seja demonstrada efetiva necessidade, uma vez que a concessão indevida poderia caracterizar litigância de má-fé, conforme previsto na legislação.
  `,
  preliminary: 'Falta de interessse processual',
};

const emitEvent = async () => {
  const result = await updateParamsWithPdf(`${__dirname}/peticao.pdf`);
  console.log('updateParamsWithPdfSummary result', result);
  console.log('These are the only fields the user will have to input manually', manualInputParams);
  const params = {
    ...result,
    ...manualInputParams,
  };
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