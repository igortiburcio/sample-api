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
const channel = "challenge-to-answer";
const pdfOneType = "defence"; // internal name for the Defence pdf
const pdfTwoType = "challengeComplaint"

// base64 encode the clientId and clientSecret to generate the token to connect to the server
const token = Buffer.from(clientId + ":" + clientSecret).toString("base64");
console.log("token", token);

async function updateParamsWithPdf(filePath, pdfType) {
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

const emitEvent = async () => {
  const defenceResult = await updateParamsWithPdf(`${__dirname}/peças/contestacao.pdf`, pdfOneType);
  const complaintResult = await updateParamsWithPdf(`${__dirname}/peças/inicial.pdf`, pdfTwoType);

  console.log('updateParamsWithPdfSummary result', defenceResult, complaintResult);
  console.log('These are the only fields the user will have to input manually', manualInputParams);

  const params = {
    ...defenceResult,
    ...complaintResult,
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