const socks5 = require("../dist/socks5"),
  server = socks5.createServer();

// Começar o servidor na porta 1080
server.listen(1080);

//handshake - O primeiro evento dispara e
//ocorre quando uma nova negociação de proxy do cliente SOCKS5 ocorre
server.on("handshake", function(socket) {
  console.log();
  console.log("------------------------------------------------------------");
  console.log(
    "Novo cliente Socks5 de %s:%d",
    socket.remoteAddress,
    socket.remotePort
  );
});

//Após o handshake e a autenticação opcional, esse evento
//é emitido após a conexão bem-sucedida com o destino remoto
server.on("proxyConnect", function(info, destination) {
  console.log("conectado no servidor remoto em %s:%d", info.host, info.port);

  destination.on("data", function(data) {
    console.log(data.length);
  });
});
//este evento é emitido sempre que uma conexão remota retorna dados
server.on("proxyData", function(data) {
  console.log(data.length);
});

// exibe mensagem de erro quando não conectar
server.on("proxyError", function(err) {
  console.error("incapaz de conectar nesse servidor remoto");
  console.error(err);
});

// Exibe quando o servidor fechar a conexão
server.on("proxyEnd", function(response, args) {
  console.log("socket fechado com codigo %d", response);
  console.log(args);
  console.log();
});
