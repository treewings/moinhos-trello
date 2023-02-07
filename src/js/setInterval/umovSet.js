import socket from "../websocket.js";
import { url } from "../url.js";
//VERIFICA STATUS DA TAREFA
 const umovSet = (tarefas)=>{
    const buscarDados = setInterval(() => {
            
            Object.entries(tarefas || {}).forEach(([key, val]) => {
                let numeroTarefa = val.numero_tarefa
                let acessNumber = val.acess_number
                
                let posexame = document.querySelector("#posexame-"+acessNumber);
                let agendado = document.querySelector("#agendado-"+acessNumber);
                var origem = ''
                if (agendado.value  ==  'agendado' && posexame.value  ==  '') {
                    origem = 'agendado'
                }if (agendado.value  == 'agendado' && posexame.value  ==  'posexame') {
                    origem = 'posexame'
                }
                var cod_sala = val.cod_sala
                var sala = val.sala
                var tarefa = val.status_tarefa

                let linkXmlConsultaImagem = 'https://api.umov.me/CenterWeb/api/26347e33d181559023ab7b32150ca3bfbc572e/schedule/'+numeroTarefa+'.xml'
                axios.get(linkXmlConsultaImagem).then((val)=>{

                    clearInterval(buscarDados)

                    let xmlDaTarefa = document.createElement('div')
                    xmlDaTarefa.innerHTML = val.data

                    let statusTarefa = xmlDaTarefa.getElementsByTagName('schedule')[0].getElementsByTagName('situation')[0].getElementsByTagName('id')[0].innerText
                    let agenteTarefa = xmlDaTarefa.getElementsByTagName('schedule')[0].getElementsByTagName('executionstarttime')[0]
                    console.log(agenteTarefa)

                    if(statusTarefa == '30' && tarefa != '30'){
                        
                        axios.post(url()+'/api/moinhos/agendar/tarefa/'+acessNumber, {
                            numero_tarefa: numeroTarefa,
                            imagem_cadeira: 'cadeira-de-rodas-amarelo.png',
                            status_tarefa: statusTarefa,
                            origem: origem,
                            sala: sala,
                            cod_sala: cod_sala
                        })
                        .then(function (response) {
                            // window.location.reload()
                            socket.emit('tarefaUmov', 'foi');
                        })
                    }

                    // SE O STATUS DA TAREFA FOR EM CAMPOR E EXISTIR A TAG AGENTE
                    if (statusTarefa == '40' && (agenteTarefa != '' && agenteTarefa != null && agenteTarefa != undefined) && tarefa != '40') {
                        console.log('ta aqui em 40')
                        axios.post(url()+'/api/moinhos/agendar/tarefa/'+acessNumber, {
                            numero_tarefa: numeroTarefa,
                            imagem_cadeira: 'cadeira-de-rodas-azul.png',
                            status_tarefa: statusTarefa,
                            origem: origem,
                            sala: sala,
                            cod_sala: cod_sala
                        })
                        .then(function (response) {
                            socket.emit('tarefaUmov', 'foi');
                            // console.log(xmlDaTarefa)
                        })
                    }
                    // SE O STATUS DA TAREFA FOR IGUAL A FINALIZADO
                    if(statusTarefa == '50' && tarefa != '50'){
                            axios.post(url()+'/api/moinhos/atendimento', {
                                acess_number: acessNumber,
                                origem: origem,
                            })
                            .then(function (response) {
                                socket.emit('tarefaUmov', 'foi');
                                // console.log(xmlDaTarefa)
                            })
                    }
                    //SE O STATUS DA TAREFA FOR IGUAL A CANCELADA
                    if(statusTarefa == '70' && tarefa != '70'){
                        
                        axios.post(url()+'/api/moinhos/agendar/tarefa/'+acessNumber, {
                            numero_tarefa: numeroTarefa,
                            imagem_cadeira: 'cadeira-de-rodas-preto.png',
                            status_tarefa: statusTarefa,
                            origem: origem,
                            sala: sala,
                            cod_sala: cod_sala
                        })
                        .then(function (response) {
                            socket.emit('tarefaUmov', 'foi');
                            // console.log(xmlDaTarefa)
                        })
                    }

                    umovSet()
                })
            
            });
        
        
    }, 3000);
}; 


export default umovSet