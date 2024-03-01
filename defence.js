const io = require("socket.io-client");
require("dotenv").config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const serverUrl = process.env.SERVER_URL; // example: 'wss://backend.juridico.ai'

// the channel to connect to
const channel = "defence";

// base64 encode the clientId and clientSecret to generate the token to connect to the server
const token = Buffer.from(clientId + ":" + clientSecret).toString("base64");
console.log("token", token);
const newSocket = io(serverUrl, {
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
const params = {
  type: 'Ação de Obrigação de Fazer c/c Danos Morais',
  value: 'R$ 25.000,00',
  court: 'Juizado Especial Cível da Comarca de Barra do Piraí',
  facts: 'A petição inicial apresentada pelo advogado José Nilton da Silva Junior em nome de sua cliente, Fernanda Malta da Silva, trata de uma ação de obrigação de fazer c/c danos morais em face da empresa Madeira Madeira Comércio Eletrônico S/A. A autora alega que realizou a compra de um guarda-roupa casal 6 portas 6 gavetas Stillus Tcil Móveis no valor de R$ 1.929,00, porém a empresa ré não entregou o produto no prazo estipulado. Além disso, a autora alega ter perdido um tempo útil considerável em busca de solução para o problema, tendo que abrir diversos protocolos e realizar diversos contatos telefônicos, todos sem sucesso.',
  args: `
    1. Positivação do tempo como bem jurídico relevante, com base nos artigos 186 e 927 do Código Civil e no Código de Defesa do Consumidor. O autor argumenta que o tempo é um bem inerente a todos os seres humanos, único, insubstituível e inalienável, e que a má prestação de um serviço pode causar lesão que vai além do simples aborrecimento do cotidiano, configurando dano moral.
    2. Agressão inequívoca à livre disposição e uso do tempo livre, em favor do interesse econômico ou da mera conveniência negocial de um terceiro, com base nos princípios básicos do consumidor. O autor argumenta que as exigências da contemporaneidade têm confrontado situações de agressão ao tempo livre das pessoas, em detrimento de interesses econômicos, o que configura uma violação do direito à paz e à tranquilidade.
    3. Responsabilidade do fornecedor, com base no Código de Defesa do Consumidor. O autor argumenta que a má prestação de um serviço, que resulta na perda do tempo útil do consumidor, configura uma violação dos direitos básicos do consumidor, exigindo a responsabilização do fornecedor.
  `,
  authorProofs: `
    1. Pedido de Justiça Gratuita
    2. Citação do réu para oferecer resposta
    3. Reconhecimento da relação de consumo e inversão do ônus da prova
    4. Condenação da parte ré a pagar danos morais
    5. Concessão de Tutela de Urgência para entrega do guarda-roupa
    6. Pedido de indenização pelo tempo útil perdido
    7. Procedência da ação e condenação ao pagamento das custas e honorários advocatícios
  `,
  requests: `
    a) Concessão dos benefícios da justiça gratuita
    b) Citação do réu para oferecer resposta
    c) Reconhecimento da relação de consumo e inversão do ônus da prova
    d) Condenação da parte ré a pagar danos morais no montante justo não inferior a R$20.000,00
    e) Concessão da Tutela de Urgência para determinar que a empresa Ré entregue o GUARDA-ROUPA CASAL 6 PORTAS 6 GAVETAS STILLUS TCIL MOVEIS
    f) Condenação do réu a pagar indenização pelo tempo útil perdido da autora no valor de R$5.000,00
    g) Procedência da ação e condenação ao pagamento das custas e honorários advocatícios no percentual de 20% sobre o valor da causa.
  `,
  theses: `
    1. **Ausência de Responsabilidade pelo Fato do Produto ou Serviço (Art. 14, § 3º, do CDC)**: Argumentar que a empresa não pode ser responsabilizada pelos danos alegados, pois o atraso na entrega pode ter sido causado por fatores externos, como problemas logísticos ou greves, que fogem ao controle da empresa. Isso se enquadra nas excludentes de responsabilidade previstas no Código de Defesa do Consumidor.

    2. **Inexistência de Dano Moral (Art. 186 e Art. 927 do Código Civil)**: Defender que o simples atraso na entrega de um produto, sem evidências de prejuízos concretos à autora que ultrapassem meros aborrecimentos, não configura dano moral indenizável, conforme jurisprudência consolidada.

    3. **Contestação da Verossimilhança das Alegações para Inversão do Ônus da Prova (Art. 6º, VIII, do CDC)**: Argumentar contra a inversão do ônus da prova, demonstrando que as alegações da autora não são suficientemente verossímeis para justificar tal medida, e que a empresa possui evidências que contestam as alegações da autora.

    4. **Proporcionalidade e Razoabilidade do Valor Indenizatório (Art. 944 do Código Civil)**: Caso seja reconhecida alguma responsabilidade, argumentar que o valor solicitado para indenização por danos morais é desproporcional e não razoável, solicitando a redução do montante para um valor que esteja em consonância com os princípios da proporcionalidade e razoabilidade, e com precedentes judiciais para casos semelhantes.

    5. **Questionamento sobre a Concessão da Justiça Gratuita (Lei 1.060/50 e Art. 5º, LXXIV, da CF/88)**: Contestar o pedido de justiça gratuita apresentado pela autora, requerendo que seja demonstrada efetiva necessidade, uma vez que a concessão indevida poderia caracterizar litigância de má-fé, conforme previsto na legislação.
  `,
  proofs: `Conversas do Whatsapp, Conversas por email, documentação da empresa`,
  preliminary: 'Falta de interessse processual',
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