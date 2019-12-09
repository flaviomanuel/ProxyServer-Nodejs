const socks5 = require("../dist/socks5"),
  server = socks5.createServer({
    authenticate: function(username, password, socket, callback) {
      // verificar nome de usuário / senha
      if (username !== "foo" || password !== "bar") {
        // responder com falha de autenticação (pode haver algum erro)
        console.log("Usuario não autorizado querendo entrar");

        return setImmediate(callback, new Error("invalid credentials"));
      }

      // retornar autenticação bem sucedida
      return setImmediate(callback);
    }
  });

// começar a escutar!
server.listen(1080);

//handshake - O primeiro evento dispara e
//ocorre quando uma nova negociação de proxy do cliente SOCKS5 ocorre
server.on("handshake", function() {
  console.log();
  console.log("------------------------------------------------------------");
  console.log("Novo cliente conectado");
});

// Quando a autenticação é bem-sucedida
server.on("authenticate", function(username) {
  console.log("Usuario %s autenticado com sucesso!", username);
});

// Quando a autenticação falha
server.on("authenticateError", function(username, err) {
  console.log("usuario %s falha ao autenticar", username);
  console.log(err);
});

// Quando uma solicitação chega para um destino remoto
server.on("proxyConnect", function(info, destination) {
  console.log("conectado em um servidor remoto em %s:%d", info.host, info.port);

  destination.on("data", function(data) {
    console.log(data.length);
  });
});

//este evento é emitido sempre que uma conexão remota retorna dados
server.on("proxyData", function(data) {
  console.log(data.length);
});

// Quando ocorre um erro ao conectar-se ao destino remoto
server.on("proxyError", function(err) {
  console.error("incapaz de conectar ao servidor remoto");
  console.error(err);
});

// Quando uma conexão proxy termina
server.on("proxyEnd", function(response, args) {
  console.log("socket closed with code %d", response);
  console.log(args);
  console.log();
});
