const io = require("socket.io-client");
require("dotenv").config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const websocketServerUrl = process.env.WEBSOCKET_SERVER_URL; // example: 'wss://server.juridico.ai'

// the channel to connect to
const channel = "grounds-of-appeal";

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



// fields of a " groundsOfAppeal" message (Apelação)
const params = {
  // Resumo do Processo até a Sentença
  summary: `O requerente, sob o pseudônimo de André Silva, solicitou benefício previdenciário de aposentadoria por tempo de contribuição, alegando ter exercido atividades em circunstâncias especiais em diversos períodos de sua carreira. Após a obtenção de assistência judiciária gratuita, a apresentação de documentos pertinentes e a realização de trâmites administrativos, o processo foi temporariamente suspenso até a resolução definitiva de uma questão legal em um tribunal superior. Após a retomada do processo, André Silva fez suas considerações, e o processo foi submetido a novas diligências, incluindo a apresentação de documentação adicional, antes de ser encaminhado para julgamento.
  Na fundamentação da sentença, foi realizada uma análise detalhada do tempo de trabalho sob condições especiais, considerando a legislação previdenciária vigente em diferentes períodos. Destacou-se o reconhecimento do tempo especial de André Silva como técnico em laboratório químico em um determinado período, devido à exposição regular a substâncias químicas nocivas. Além disso, foi discutido o direito à aposentadoria por tempo de contribuição a partir de uma data específica, sujeito à aplicação do fator previdenciário devido à pontuação total.
  A sentença, parcialmente favorável ao requerente, determinou ao órgão previdenciário a inclusão e contagem dos períodos de trabalho especial de André Silva, bem como a concessão da aposentadoria por tempo de contribuição a partir da data estabelecida, juntamente com o pagamento das parcelas vencidas com as devidas correções monetárias. Além disso, foi estabelecida a obrigação do órgão de arcar com os honorários advocatícios e a isenção de custas. Em caso de recurso, os autos deveriam ser encaminhados ao tribunal de instância superior competente.
  Em resumo, o processo envolveu uma análise minuciosa dos períodos de trabalho em condições especiais de André Silva, resultando na concessão parcial do benefício previdenciário e na imposição de medidas a serem adotadas pelo órgão previdenciário. A fundamentação da sentença se baseou em interpretações da legislação previdenciária aplicável a cada período de trabalho e nos critérios para concessão do benefício.`,

  // Resumo breve dos argumentos do juiz na Sentença.
  args: `Na decisão proferida pelo magistrado, a justificativa legal se embasa no pleito do requerente, visando à obtenção de aposentadoria por tempo de contribuição a partir de 15/09/2018, com a inclusão e contagem de períodos laborados em condições especiais. O requerente alega ter desempenhado atividades que colocaram em risco sua saúde devido à exposição a agentes prejudiciais, passíveis de serem considerados como tempo especial para fins previdenciários.
  O juiz analisa a normativa previdenciária em vigor, a qual permite a consideração do tempo de serviço especial para períodos nos quais o segurado esteve exposto de maneira habitual e contínua a condições nocivas à sua saúde. São citadas as diretrizes específicas para o reconhecimento do tempo especial em distintos momentos, incluindo a exigência de laudos técnicos a partir de determinadas datas e a relevância do Perfil Profissiográfico Previdenciário (PPP) como prova indispensável.
  No caso específico, o magistrado analisa os intervalos nos quais o requerente atuou como Operador de Máquinas Pesadas, reconhecendo a exposição habitual e contínua a ruídos superiores a 85 dB, caracterizando o tempo especial. Com base nessa análise, o juiz determina ao órgão previdenciário a inclusão e contagem desses períodos como tempo de serviço especial, assim como a concessão da aposentadoria por tempo de contribuição a partir de 15/09/2018.
  Ademais, o juiz menciona a obrigatoriedade de cálculo do benefício conforme a Lei 10.666/2003, com a aplicação do fator previdenciário, devido à pontuação total do requerente ser inferior a 90 pontos. Por fim, são estabelecidas as medidas para a execução da sentença, incluindo o pagamento das parcelas vencidas, corrigidas monetariamente e acrescidas de juros de mora, assim como a fixação dos honorários advocatícios.
  Em síntese, a justificativa legal adotada pelo magistrado na decisão se fundamenta na análise minuciosa dos períodos laborados pelo requerente, na legislação previdenciária em vigor e nas diretrizes específicas para o reconhecimento do tempo especial, resultando na concessão da aposentadoria por tempo de contribuição ao requerente.`,

  // Argumentos da Apelação
  appealingArgs: `Na petição de recurso de apelação apresentada pelo Instituto Nacional do Seguro Social (INSS), o procurador federal encarregado fundamenta seus argumentos em diversos pontos da legislação previdenciária e constitucional. Primeiramente, destaca-se a necessidade de pré-questionamento de dispositivos legais específicos, como a Lei Complementar nº 123/2014 e artigos da Constituição Federal de 1998 e do Decreto nº 4.762/2003.
  Além disso, o INSS argumenta que a comprovação da especialidade das atividades realizadas pelo segurado é uma responsabilidade sua, devendo ser realizada mediante formulários emitidos pelos empregadores, como o Documento Técnico de Condições Ambientais do Trabalho (DTCAT). O procurador enfatiza a importância da similaridade do ambiente de trabalho e da apresentação de provas documentais consistentes para a caracterização do tempo de serviço especial.
  Outro ponto abordado na argumentação é a questão da habitualidade e permanência das condições insalubres no trabalho, ressaltando que a exposição a agentes nocivos deve ser real e prejudicial à saúde do trabalhador para ser considerada especial. O procurador argumenta que a intermitência na prestação de serviços, como intermitente, pode prejudicar o requisito da habitualidade e permanência, essenciais para a caracterização da atividade como especial.
  Por fim, o INSS destaca a importância do preenchimento preciso do DTCAT, que deve conter informações atualizadas e ser emitido pelo empregador. O procurador também ressalta a necessidade de prova material pré-constituída para a caracterização do tempo especial, reforçando a importância da documentação adequada e do cumprimento dos requisitos legais para a concessão de aposentadoria especial.
  Em resumo, a fundamentação jurídica utilizada pelo Recorrente na apelação se baseia na legislação previdenciária e constitucional, enfatizando a necessidade de prova documental robusta, do correto preenchimento do DTCAT e da comprovação da habitualidade e permanência das condições insalubres no trabalho para a caracterização do tempo de serviço especial.`,

  // Razões que levaram o apelante á Apelar.
  reasonToAppeal: `A apelação apresentada pelo INSS surge em decorrência do pedido do autor da ação, João Silva, que buscava o reconhecimento de períodos de trabalho como agricultor autônomo como tempo especial para fins previdenciários. No entanto, o INSS contestou essa alegação, argumentando que a simples inclusão da atividade de agricultor em sua carteira de trabalho não é suficiente para caracterizar o trabalho como especial. O órgão previdenciário destacou a necessidade de documentos específicos, como o SB 45/DSS 8050, para comprovar as condições especiais de trabalho, como a exposição a pesticidas e outras substâncias nocivas.
  Além disso, o INSS argumentou que a eventualidade da prestação de serviços como autônomo impossibilita a habitualidade e permanência necessárias para caracterizar a atividade como especial. A jurisprudência citada no documento também enfatiza a importância da demonstração efetiva da exposição a agentes nocivos que afetem a saúde do trabalhador para a caracterização do tempo de serviço como especial.
  O INSS solicitou que a sentença inicial fosse reformada e que o pedido do autor fosse julgado improcedente, com a condenação do autor ao pagamento das custas do processo e da verba honorária. Além disso, foram feitos requerimentos finais, como a observância da prescrição quinquenal, a intimação do autor para fornecer a autodeclaração exigida pelas normas previdenciárias, a determinação dos honorários advocatícios e a declaração de isenção de custas.
  Diante desses argumentos e da contestação do INSS, a apelação foi interposta com base na necessidade de comprovação da exposição efetiva e habitual a agentes nocivos, conforme a legislação previdenciária vigente. A discussão central envolve a caracterização do tempo de serviço como especial e a exigência de laudos técnicos para embasar essa caracterização.`,

  // Motivos pelos quais a sentença deve ser rebatida (OPCIONAL)
  defendSentenceArgs: '',
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