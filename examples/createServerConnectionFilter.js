const dns = require("dns"),
  socks5 = require("../dist/socks5"),
  //Cria o bloqueio do ip(não sei como isso funciona)
  server = socks5.createServer({
    connectionFilter: function(port, address, socket, callback) {
      return dns.reverse(address, function(err, hostnames) {
        if (!hostnames.length || !/amazonaws/.test(hostnames[0])) {
          console.log("Not allowing connection to %s:%s", address, port);
          console.log("informações" + port, address, hostnames);
          return callback(
            new Error("conexão com o endereço de destino negada")
          );
        }

        //criando arquivo em .txt como a data, horario, ip e porta
        var fs = require("fs");
        now = new Date();

        fs.writeFile(
          "log.txt",
          "Hoje é " +
            now.getDate() +
            "/" +
            now.getMonth() +
            "/" +
            now.getFullYear() +
            "  " +
            "Horario: " +
            now.getHours() +
            ":" +
            now.getMinutes() +
            ":" +
            now.getSeconds() +
            "  " +
            "ip:" +
            address +
            "  port:" +
            port,
          function(erro) {
            if (erro) {
              throw erro;
            }
            console.log("Arquivo salvo");
          }
        );
      });
    }
  });

//Estabele o filtro da conexão
server.on("connectionFilter", function(port, address, err) {
  console.log("conexão para %s:%s foi negada!", address, port);
  console.error(err);
});

server.on("handshake", function(socket) {
  console.log();
  console.log("------------------------------------------------------------");
  console.log(
    "novo cliente socks5 em %s:%d",
    socket.remoteAddress,
    socket.remotePort
  );
});

// Quando uma solicitação chega para um destino remoto
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

// Quando ocorre um erro ao conectar-se ao destino remoto
server.on("proxyError", function(err) {
  console.error("incapaz de conectar no servidor remoto");
  console.error(err);
});

// Exibe quando o servidor fechar a conexão
server.on("proxyEnd", function(response, args) {
  console.log("socket fechado com codigo %d", response);
  console.log(args);
  console.log();
});

// Começar o servidor na porta 1080
server.listen(1080);
