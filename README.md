## juridico-integration-sample

Este projeto tem por objetivo exemplificar como seriam possíveis implementações utilizando a [API de Websockets da Juridico AI](https://server.juridico.ai/docs/)

### Instalação

1. Entre em contato com a Juridico AI para conseguir seu acesso `a API através de um **client ID** e um **client Secret**
2. Crie um arquivo `.env` baseado no arquivo [.env.sample](.env.sample) (ou rode no terminal algo similar a `$ cp .env.sample .env`).
3. atualize as variáveis no arquivo `.env` CLIENT_ID, CLIENT_SECRET e WEBSOCKET_SERVER_URL de acordo com suas credenciais e o servidor que deseja conectar-se.
4. Rode `$ npm install`

### Exemplo de requisição do chat

Para rodar o exemplo de como seria uma requisição de chat da Jurídico AI, basta executar o seguinte comando:

- `$ npm start` ou apenas `node index.js`

Este comando executara o código que está contido no arquivo [index.js](index.js)

### Exemplo de requisição da Petição inicial

Para rodar o exemplo de como seria uma requisição de petição inicial da Jurídico AI, basta executar o seguinte comando:

- `$ npm run complaint` ou apenas `node complaint.js`
- `$ npm run complaint-automation` ou apenas `node complaintWithFormAutomation.js`

Este comando executara o código que está contido no arquivo [complaint.js](complaint.js)

### Exemplo de requisição da Contestação

Para rodar o exemplo de como seria uma requisição de contestação da Jurídico AI, basta executar o seguinte comando:

- `$ npm run defence` ou apenas `node defence.js`
- `$ npm run defence-upload` ou apenas `node defenceWithFileUpload.js`

Este comando executara o código que está contido no arquivo [defence.js](defence.js)