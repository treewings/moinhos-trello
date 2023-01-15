import { url } from "./url.js";
import socket from "./websocket.js";



export class Trelo {

    treloRodar() {
        var columnGrids = [];
        var dragContainer = document.querySelector('.drag-container');
        var itemContainers = [].slice.call(document.querySelectorAll('.board-column-content'));
        var boardGrid;

        // Init the column grids so we can drag those items around.
        itemContainers.forEach(function (container) {
            var grid = new Muuri(container, {
                items: '.board-item',
                ...( container.id == 'finalizados' || container.id == 'posExame' ? {
                    dragEnabled: false
                } : {
                    dragEnabled: true
                }),
                dragSort: function () {
                    return columnGrids;
                },
                // dragEndPredicate: {
                //     distance: 100,
                //     delay: 100,
                //   },
                dragStartPredicate: function (item, e) {
                    // Start moving the item after the item has been dragged for one second.
                    if (e.deltaTime > 100) {
                        return true;
                    }              
                },
                // dragSortPredicate: function (item, e) {
                //     if (e.deltaTime < 10) return false;
                //     return item
                //   },
                dragContainer: dragContainer,
                dragAutoScroll: {
                    targets: (item) => {
                        return [
                            {
                                element: window,
                                priority: 0
                            },
                            {
                                element: item.getGrid().getElement().parentNode,
                                priority: 1
                            },
                        ];
                    }
                },
            }).on('send', function (item) {
                grid.on('dragEnd', function (x, event) {
                    let y = url()
                    //EVENTO DE PASSAGEM DO CARD DE SOLICITADOS PARA AGENDADOS
                    if (item.fromGrid._element.id == 'Solicitados' && item.toGrid._element.id == 'Agendados' ) {
                        // DEFINE SE A COLUNA VAI ESTAR TRAVADA OU NÃO
                        // item.toGrid._settings.dragEnabled = false
                        //ABRE A MODAL
                        $('#modalAgendar').modal('show')
                        //FECHA MODAL
                        $('body').on('click', '.muuri', function(event){
                            item.toGrid.send(item.item, item.fromGrid, 0, {
                                layoutReceiver: "instant",
                            });
                            window.location.reload()
                        })
                        $('body').on('click', '#fecharAgendamento', function(event){
                            item.toGrid.send(item.item, item.fromGrid, 0, {
                                layoutReceiver: "instant",
                            });
                            window.location.reload()
                        })
                        //PEGA A DATA E HORA ATUAL
                        function dataAtualFormatada() {
                            var data = new Date(),
                            dia = data.getDate().toString().padStart(2, '0'),
                            mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
                            ano = data.getFullYear();
                            return ano + "-" + mes + "-" + dia;
                        }
                        function horaAtualFormatada() {
                            let datahora = new Date().toString()
                            let dataEhora = datahora.split(" ")
                            let horaNformatada = dataEhora[4].split(":")
                            return horaNformatada[0]+":"+horaNformatada[1]
                        }
                        //ATRIBUI O VALOR DA DATA ATUAL NA MODAL
                        document.querySelector("[name='data']").value = dataAtualFormatada();
                        document.querySelector("[name='hora']").value = horaAtualFormatada();
                        //EVENDO DO FOMULÁRIO
                        $("form").submit(function (event) {
                            event.preventDefault()
                            $('#modalAgendar').modal('hide')
                            //DEFINE A VARIAVEL DE ENVIO DOS DADOS
                            let continuar = 'sim';
                            //PARA O EVENTO DE ARRASTAR CASSO OS DADOS SEJAM INVÁLIDOS
                            if (form.hora.value == null || form.hora.value == '' || form.hora.value == undefined) {
                                item.toGrid.send(item.item, item.fromGrid, 0, {
                                    layoutReceiver: "instant",
                                });
                                continuar = 'nao';
                                $('#modalHoraValida').modal('toggle')
                            }if (form.data.value == null || form.data.value == '' || form.data.value == undefined) {
                                item.toGrid.send(item.item, item.fromGrid, 0, {
                                    layoutReceiver: "instant",
                                });
                                continuar = 'nao';
                                $('#modalHoraValida').modal('toggle')
                            }
                            //DEFINE AS VARIAVEIS DE DATA E HORA INPUTADAS
                            let hr = form.hora.value
                            let dt = form.data.value
                            //FORMATA DATA
                            let fomataData = dt.split("-")
                            dt = fomataData[2]+'/'+fomataData[1]+'/'+fomataData[0]
                            //VERIFICA SE É UMA HORA VÁLIDA
                            let validaHorario = hr.split(":")
                            if (+validaHorario[0] > 23) {
                                item.toGrid.send(item.item, item.fromGrid, 0, {
                                    layoutReceiver: "instant",
                                });
                                continuar = 'nao';
                                $('#modalHoraValida').modal('toggle')
                            }if (+validaHorario[1] > 59) {
                                item.toGrid.send(item.item, item.fromGrid, 0, {
                                    layoutReceiver: "instant",
                                });
                                continuar = 'nao';
                                $('#modalHoraValida').modal('toggle')
                            }
                            //VERIFICA SE A HORA INPUTADA NÃO É MENOR QUE A ATUAL
                            let horaAtual = horaAtualFormatada().split()
                            let horaInputada = hr.split()
                            if (horaInputada[0] < horaAtual[0]) {
                                item.toGrid.send(item.item, item.fromGrid, 0, {
                                    layoutReceiver: "instant",
                                });
                                continuar = 'nao';
                                $('#modalHoraValida').modal('toggle')
                            }if (horaInputada[0] = horaAtual[0] && horaInputada[1] < horaAtual[1]) {
                                item.toGrid.send(item.item, item.fromGrid, 0, {
                                    layoutReceiver: "instant",
                                });
                                continuar = 'nao';
                                $('#modalHoraValida').modal('toggle')
                            }
                            //VERIFICA SE A DATA INPUTADA NÃO É MANOR QUE A ATUAL
                            var dtVenc = dt;
                            function retornaData(data){
                                if(!data){
                                    return data;	
                                }
                                let split = data.split('/');
                                return new Date( split[1] + "/" +split[0]+"/"+split[2] + " 23:59:59");
                            }
                            var dataCurrente = new Date();
                            if(retornaData(dtVenc).getTime() < dataCurrente.getTime()){
                                item.toGrid.send(item.item, item.fromGrid, 0, {
                                    layoutReceiver: "instant",
                                });
                                continuar = 'nao';
                                $('#modalDataValida').modal('toggle')
                            }
                            //FORMATA OS VALORES DAS VARIAVEIS PARA SEREM USADOS
                            let dataHoraAgendamento = dt + ' ' + hr;
                            //VERIFICA SE PODE CONTINUAR
                            if (continuar == 'sim') {
                                // PEGA O VALOR DO ACESS_NUMBER
                                let ID = item.item._element.getAttribute('data-id');
                                //DEFINE A VARIAVEL QUE RECEBERÁ OS DADOS DO JSON
                                let val = '';
                                $(document).ready(() => {
                                    //PEGA O JSON DO CARD E ENVIA A REQUISIÇÃO DE ALTERAÇÃO
                                    let update = document.querySelector("#solicitar-update-"+ID);
                                    let valor = update.value;
                                    val = JSON.parse(valor);
                                    let imagem = 'cadeira-de-rodas-preto.png'
                                    axios.post(y+'/api/moinhos/agendar', {
                                        acess_number: ID,
                                        dados: val,
                                        codigo_setor_exame: val.codigo_setor_exame,
                                        data_agendamento: dt,
                                        hora_agendamento: hr,
                                        imagem_cadeira: imagem
                                    })
                                    //SE UPDATE REALIZADO COM SUCESSO, FAÇA
                                    .then(function (response) {
                                        //ATRIBUI OS VALORES DOS COUNT's
                                        let SolicitadosCount = document.getElementById("SolicitadosCount");
                                        let AgendadosCount = document.getElementById("AgendadosCount");
                                        $("#SolicitadosCount").text((+SolicitadosCount.innerText.replace(/\s/g, '')) - 1)
                                        $("#AgendadosCount").text((+AgendadosCount.innerText.replace(/\s/g, '')) + 1)

                                        //ATRIBUI O DADOS DE SOLICITAÇÃO DE TRANSPORTE
                                        $('#agendamento-'+ID).addClass('text-primary');
                                        let agendamento = document.getElementById("agendamento-"+ID)
                                        agendamento.innerHTML = 'Adendado para '+dataHoraAgendamento

                                        //ATRIBUI O VALOR DE AGENDADO PARA O BOTAO DE CANCELAMENTO
                                        document.getElementById("agendado-"+ID).value = 'agendado'

                                        //ATRIBUI O ICONE DE TRANSPORTE
                                        let icone = document.getElementById("img_icone-"+ID)
                                        icone.innerHTML = `<img style="height: 13px; margin-right: 5px; margin-left: 4px;" src="assets/images/Icones/cadeira-de-rodas.png">`

                                        //ABRE MODAL DE SUCESSO
                                        $('#modalAgendadoSucesso').modal('show')
                                        setTimeout(() => {
                                            socket.send('foi');    
                                        }, 1000);
                                        
                                    })
                                    .catch(function (error) {
                                        $('#modalAlgoErrado').modal('show')
                                        console.log(error);
                                    });
                                })
                            }
                        });
                    }
                    //EVENTO DE PASSAGEM DO CARD DE AGENDADOS PARA ATENDIMENTO
                    if (item.fromGrid._element.id == 'Agendados' && item.toGrid._element.id ==  'Atendimento') {
                        // DEFINE SE A COLUNA VAI ESTAR TRAVADA OU NÃO
                        // item.toGrid._settings.dragEnabled = false

                        //PEGA O VALOR DO ACESS_NUMBER
                        let ID = item.item._element.getAttribute('data-id');
                        let tagNumeroTarefa = document.querySelector("#numero_tarefa-" + ID);
                        let numeroTarefa = tagNumeroTarefa.value
                        let statusTarefa = document.querySelector("#status_tarefa-" + ID);
                        let status = statusTarefa.value
                        if(status != '50' && status != '70'){
                            $('#modalTransporteSolicitado').modal('show')
                            item.toGrid.send(item.item, item.fromGrid, 0, {
                                layoutReceiver: "instant",
                            });
                            // window.location.reload()
                            return
                        }
                        let val = '';
                        $(document).ready(() => {
                            //PEGA O JSON DO CARD E ENVIA A REQUISIÇÃO DE ALTERAÇÃO
                            let update = document.querySelector("#solicitar-update-" + ID);
                            let valor = update.value;
                            val = JSON.parse(valor);
                            axios.post(y+'/api/moinhos/atendimento', {
                                acess_number: ID,
                                codigo_setor_exame: val.codigo_setor_exame
                            })
                            .then(function (response) {
                                //ATRIBUI OS VALORES DOS COUNT's
                                let SolicitadosCount = document.getElementById("AgendadosCount");
                                let AgendadosCount = document.getElementById("AtendimentoCount");

                                $("#SolicitadosCount").text((+SolicitadosCount.innerText.replace(/\s/g, '')) - 1)
                                $("#AgendadosCount").text((+AgendadosCount.innerText.replace(/\s/g, '')) + 1)
                                setTimeout(() => {
                                    socket.send('foi');    
                                }, 1000);
                            })
                            .catch(function (error) {
                                $('#modalAlgoErrado').modal('show')
                                console.log(error);
                            });
                        })
                    }
                    //EVENTO DE PASSAGEM DO CARD DE ATENDIMENTO PARA POSEXAME
                    if (item.fromGrid._element.id == 'Atendimento' && item.toGrid._element.id == 'posExame') {
                        // DEFINE SE A COLUNA VAI ESTAR TRAVADA OU NÃO
                        // item.toGrid._settings.dragEnabled = false

                        //PEGA O VALOR DO ACESS_NUMBER
                        let ID = item.item._element.getAttribute('data-id');
                        let val = '';
                        $(document).ready(() => {
                            //PEGA O JSON DO CARD E ENVIA A REQUISIÇÃO DE ALTERAÇÃO
                            let update = document.querySelector("#solicitar-update-" + ID);
                            let valor = update.value;
                            val = JSON.parse(valor);
                            axios.post(y+'/api/moinhos/posexame',{ acess_number: ID })
                            .then(function (response) {
                                setTimeout(() => {
                                    socket.send('foi');    
                                }, 1000);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });


                        })
                    }
                    //EVENTO DE PASSAGEM DO CARD DE POSEXAME PARA FINALIZADOS
                    if (item.fromGrid._element.id == 'posExame' && item.toGrid._element.id == 'finalizados') {
                        // DEFINE SE A COLUNA VAI ESTAR TRAVADA OU NÃO
                        // item.toGrid._settings.dragEnabled = false

                        //PEGA O VALOR DO ACESS_NUMBER
                        let ID = item.item._element.getAttribute('data-id');
                        let val = '';
                        $(document).ready(() => {
                            //PEGA O JSON DO CARD E ENVIA A REQUISIÇÃO DE ALTERAÇÃO
                            let update = document.querySelector("#solicitar-update-" + ID);
                            let valor = update.value;
                            val = JSON.parse(valor);
                            axios.post(y+'/api/moinhos/finalizar', {
                                acess_number: ID,
                                dados: val
                            })
                                .then(function (response) {
                                    //ATRIBUI OS VALORES DOS COUNT's
                                    let SolicitadosCount = document.getElementById("PosExameCount");
                                    let AgendadosCount = document.getElementById("FinalizadosCount");

                                    $("#SolicitadosCount").text((+SolicitadosCount.innerText.replace(/\s/g, '')) - 1)
                                    $("#AgendadosCount").text((+AgendadosCount.innerText.replace(/\s/g, '')) + 1)
                                    setTimeout(() => {
                                        socket.send('foi');    
                                    }, 1000);
                                })
                                .catch(function (error) {
                                    console.error(error);
                                });


                        })
                    }
                    //EVENTO DE PASSAGEM DO CARD DE AGENDADOS PARA SOLICITADOS
                    if(item.fromGrid._element.id == 'Agendados' && item.toGrid._element.id == 'Solicitados'){
                        $('#modalMovimentacaoInvalida').modal('show')
                        item.toGrid.send(item.item, item.fromGrid, 0, {
                            layoutReceiver: "instant",
                        });
                        window.location.reload()
                    }
                })
            })
                .on('dragInit', function (item) {
                    item.getElement().style.width = item.getWidth() + 'px';
                    item.getElement().style.height = item.getHeight() + 'px';
                })
                .on('dragReleaseEnd', function (item) {
                    // item._migrate._container = true
                    item.getElement().style.width = '';
                    item.getElement().style.height = '';
                    item.getGrid().refreshItems([item]);
                })
                .on('layoutStart', function (item, matriz) {
    
                })
                .on('move', function (data) {
                });
            
            grid.refreshItems().layout()
            columnGrids.push(grid);
        });

        // Init board grid so we can drag those columns around.
        boardGrid = new Muuri('.board', {
            dragEnabled: false,
            dragHandle: '.board-column-header'
        });
    }
}

// export default columnGrids