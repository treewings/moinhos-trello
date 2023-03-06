const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const axios = require('axios');
const { json } = require('express');
const url = require('url');

app.use(express.static('src'))
app.use(express.static('assets'))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var clientes = [];
io.on('connection', (socket) => {
    console.log('conectado ...')    
    socket.on('cardRender', (msg) => {
      io.emit('cardRender', msg);
    });

    socket.on('tarefaUmov', (msg) => {
      io.emit('tarefaUmov', msg);
    });

    socket.on('chat', (msg) => {
      io.emit('chat', msg);
    });

    socket.on('rodar', async (msg) => {
      const dados = await axios.get('http://192.168.11.12:8008/api/moinhos', msg.config)  
      io.emit('rodar', {dadosReal: dados.data});
    });


    socket.on('evento-filtro', async(data) => {
      const filtro = await axios.post('http://192.168.11.12:8008/api/moinhos/consulta', data.filtro, data.config)
      const clienteAtual = io.sockets.sockets.get(socket.id)
      clienteAtual.request.headers.referer = data.url
      socket.join(socket.id);
      io.to(socket.id).emit('evento-filtro', {dadosFiltro: filtro.data});
      // io.emit('evento-filtro', {dadosFiltro: filtro.data, codFiltro: data.filtro});
    });

    socket.on('filtro-todos', async (data) => {

      var filtrosRespostas = []
      var filtros
      for (const [id, client] of io.sockets.sockets) {

        const urls = client.request.headers.referer;
        const queryObject = url.parse(urls, true).query;
        const user = queryObject.setor || queryObject.sala;
        if(queryObject.setor){
          let cod_tumografiaComputadorizada
        let cod_raioX
        let cod_ecografiaGeral
        let cod_ressonanciaMagnetica
        let cod_centroDaMulher
        let cod_radiologiaPedriatrica
        let cod_igEcografiaGeral
        
        let CodigosSetorURL = user.split(',')
          CodigosSetorURL.forEach(function(CodigoSetor){
              if(CodigoSetor == 19){
                  cod_tumografiaComputadorizada = CodigoSetor
              }if(CodigoSetor == 20){
                  cod_raioX = CodigoSetor
              }if(CodigoSetor == 23){
                  cod_ecografiaGeral = CodigoSetor
              }if(CodigoSetor == 24){
                  cod_ressonanciaMagnetica = CodigoSetor
              }if(CodigoSetor == 26){
                  cod_centroDaMulher = CodigoSetor
              }if(CodigoSetor == 30){
                  cod_radiologiaPedriatrica = CodigoSetor
              }if(CodigoSetor == 34){
                  cod_igEcografiaGeral = CodigoSetor
              }
          })
          filtros = {
              ...( cod_tumografiaComputadorizada == 19 ? {cod_tumografiaComputadorizada: cod_tumografiaComputadorizada} : null ),
              ...( cod_raioX == 20 ? {cod_raioX: cod_raioX} : null ),
              ...( cod_ecografiaGeral == 23 ? {cod_ecografiaGeral: cod_ecografiaGeral} : null ),
              ...( cod_ressonanciaMagnetica == 24 ? {cod_ressonanciaMagnetica: cod_ressonanciaMagnetica} : null ),
              ...( cod_centroDaMulher == 26 ? {cod_centroDaMulher: cod_centroDaMulher} : null ),
              ...( cod_radiologiaPedriatrica == 30 ? {cod_radiologiaPedriatrica: cod_radiologiaPedriatrica} : null ),
              ...( cod_igEcografiaGeral == 34 ? {cod_igEcografiaGeral: cod_igEcografiaGeral} : null )
          }
        
        
           
        }

        if(queryObject.sala){
          filtros = {cod_sala: queryObject.sala}
         }

        if (filtrosRespostas[JSON.stringify(filtros)]) {
          // se a resposta já existe, apenas envie para o cliente
          client.emit('filtro-todos', { dadosFiltroTotal: filtrosRespostas[JSON.stringify(filtros)] });
        } else {
          // se a resposta ainda não existe, faça a requisição
          const resposta = await axios.post('http://192.168.11.12:8008/api/moinhos/consulta', filtros, data.config);
          // armazene a resposta para esse filtro
          filtrosRespostas[JSON.stringify(filtros)] = resposta.data;
          // envie a resposta para o cliente
          client.emit('filtro-todos', { dadosFiltroTotal: resposta.data });
        }
        
        
      }


    })


  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});