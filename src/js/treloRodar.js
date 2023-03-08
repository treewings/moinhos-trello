import { url } from "./url.js";
import socket from "./websocket.js";
import { usuarioLogado } from "./funcoes/usuario.js";
import { token } from "./url.js";
import modalAgendar from "./funcoes/modalAgendar.js";
const config = {
    headers: { Authorization: `Bearer ${token()}` }
};

const treloRodar = ()=> {
        var dragContainer = document.querySelector('.drag-container');
        var itemContainers = [].slice.call(document.querySelectorAll('.board-column-content'));
        var columnGrids = [];
        var boardGrid;
        itemContainers.forEach(function (container) {
            var grid = new Muuri(container, {
                items: '.board-item',
                ...( container.id == 'finalizados' ? {
                    dragEnabled: false
                } : {
                    dragEnabled: true
                }),
                dragSort: function () {
                    return columnGrids;
                },
                dragStartPredicate: function (item, e) {
                    if (e.deltaTime > 100) {
                        return true;
                    }              
                },
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
                    let y = url()
                    //EVENTO DE PASSAGEM DO CARD DE SOLICITADOS PARA AGENDADOS
                    if (item.fromGrid._element.id == 'Solicitados' && item.toGrid._element.id == 'Agendados' ) {
              
                        modalAgendar(item, grid)
            
                    }
                    //EVENTO DE PASSAGEM DO CARD DE AGENDADOS PARA ATENDIMENTO
                    if (item.fromGrid._element.id == 'Agendados' && item.toGrid._element.id ==  'Atendimento') {
                        // console.log('testeaqui')
                        // DEFINE SE A COLUNA VAI ESTAR TRAVADA OU NÃO
                        // item.toGrid._settings.dragEnabled = false
                        //PEGA O VALOR DO ACESS_NUMBER
                        let ID = item.item._element.getAttribute('data-id');
                        let tagNumeroTarefa = document.querySelector("#numero_tarefa-" + ID);
                        let numeroTarefa = tagNumeroTarefa.value
                        let statusTarefa = document.querySelector("#status_tarefa-" + ID);
                        let status = statusTarefa.value
                        if(numeroTarefa != 'null'){
                            if(status == '40' || status == '30'){
                                $('#modalTransporteSolicitado').modal('show')
                                window.location.reload()
                            }
                        }
                        if(numeroTarefa == 'null'){
                            $('#modalSalaRealizarExame').modal('show')
                            document.querySelector("[name='valorIdRealizarExame']").value = ID;
                        }
                       
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
                            axios.post(y+'/api/moinhos/posexame',{
                                acess_number: ID,
                                user: usuarioLogado()
                            }, config)
                            .then(function (response) {
                                // window.location.reload()
                                socket.emit('cardRender', 'foi');
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
                                user: usuarioLogado()
                            }, config)
                            .then(function (response) {
                                //ATRIBUI OS VALORES DOS COUNT's
                                let SolicitadosCount = document.getElementById("PosExameCount");
                                let AgendadosCount = document.getElementById("FinalizadosCount");
                                $("#SolicitadosCount").text((+SolicitadosCount.innerText.replace(/\s/g, '')) - 1)
                                $("#AgendadosCount").text((+AgendadosCount.innerText.replace(/\s/g, '')) + 1)
                                // window.location.reload()
                                socket.emit('cardRender', 'foi');
                            })
                            .catch(function (error) {
                                console.error(error);
                            });
                        })
                    }
                    //EVENTO DE PASSAGEM DO CARD DE AGENDADOS PARA SOLICITADOS
                    if(item.fromGrid._element.id == 'Agendados' && item.toGrid._element.id == 'Solicitados'){
                        $('#modalMovimentacaoInvalida').modal('show')
                      
                        window.location.reload()
                    }
                    //EVENTO DE PASSAGEM DO CARD DE ATENDIMENTO PARA AGENDADOS
                    if(item.fromGrid._element.id == 'Atendimento' && item.toGrid._element.id == 'Agendados'){
                        $('#modalMovimentacaoInvalida').modal('show')
                     
                        window.location.reload()
                    }
                    //EVENTO DE PASSAGEM DO CARD DE POSEXAME PARA ATENDIMENTO
                    if(item.fromGrid._element.id == 'posExame' && item.toGrid._element.id == 'Atendimento'){
                        $('#modalMovimentacaoInvalida').modal('show')
                    
                        window.location.reload()
                    }
               
                })
                .on('dragInit', function (item) {
                    item.getElement().style.width = item.getWidth() + 'px';
                    item.getElement().style.height = item.getHeight() + 'px';
                })
                .on('dragReleaseEnd', function (item) {
                    item.getElement().style.width = '';
                    item.getElement().style.height = '';
                    item.getGrid().refreshItems([item]);
                })
                .on('layoutStart', function (item) {
                    // boardGrid.refreshItems().layout();
                })

            grid.refreshItems().layout()
            columnGrids.push(grid);
        });

        boardGrid = new Muuri('.board', {
            dragEnabled: false,
            dragHandle: '.board-column-header'
        });
    }
 export default treloRodar