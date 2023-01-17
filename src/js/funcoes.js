import { url } from "./url.js"
import socket from "./websocket.js"
$(document).ready(()=>{
    var y = url()
    $('#modalLoading').modal('show')
    $("body").on("click", '.aparecer', function(event){
        let ID = $(this).data('id');
        let nome = document.querySelector("#paciente-"+ID);
        let dtnascimento = document.querySelector("#data_dasc-"+ID);
        let dtpedido = document.querySelector("#data_pedido-"+ID);
        let hrpedido = document.querySelector("#hora_pedido-"+ID);
        let origem = document.querySelector("#setor-"+ID);
        let tipoisolamento = document.querySelector("#tipo_isolamento-"+ID);
        let acessionnumber = document.querySelector("#acess_number-"+ID);
        let leito = document.querySelector("#leito-"+ID);
        let exame = document.querySelector("#descricao_exame-"+ID);
        let prestador = document.querySelector("#prestador-"+ID);
        let selorsolic = document.querySelector("#setor-"+ID);
        // let sala = document.querySelector("#leito-"+ID);
        let solicitado = document.querySelector("#solicitado-"+ID);
        let agendado = document.querySelector("#agendado-"+ID);
        let atendimento = document.querySelector("#atendimento-"+ID);
        let posexame = document.querySelector("#posexame-"+ID);
        let finalizado = document.querySelector("#finalizado-"+ID);
        let sala = document.querySelector("#sala-"+ID);
        let observacaoitem = document.querySelector("#observacao_item-"+ID);
        let justificativaitem = document.querySelector("#justificativa_item-"+ID);
        let obsercacao = document.querySelector("#observacao-"+ID);

        let valueNome = nome.value == '' || nome.value == 'null' || nome.value == undefined ? '' : nome.value;
        let valueDtNascimento = dtnascimento.value == '' || dtnascimento.value == null || dtnascimento.value == undefined ? '' : dtnascimento.value;
        let valueDtHrPedido = hrpedido.value == '' || hrpedido.value == 'null' || hrpedido.value == undefined ? '' : hrpedido.value;
        let valueOrigem = origem.value == '' || origem.value == 'null' || origem.value == undefined ? '' : origem.value;
        let valueTipoIsolamento = tipoisolamento.value == '' || tipoisolamento.value == 'null' || tipoisolamento.value == undefined ? '' : tipoisolamento.value;
        let valueAcessionNumber = acessionnumber.value == '' || acessionnumber.value == 'null' || acessionnumber.value == undefined ? '' : acessionnumber.value;
        let valueLeito = leito.value == '' || leito.value == 'null' || leito.value == undefined ? '' : leito.value;
        let valueExame = exame.value == '' || exame.value == 'null' || exame.value == undefined ? '' : exame.value;
        let valuePrestador = prestador.value == '' || prestador.value == 'null' || prestador.value == undefined ? '' : prestador.value;
        let valueSetorSolicitante = selorsolic.value == '' || 'null' || undefined ? '' : selorsolic.value;
        let valueSala = sala.value == '' || sala.value == 'null' || sala.value == 'undefined' ? '' : sala.value;
        let valueSolicitado = sala.value == '' || sala.value == 'null' || sala.value == undefined ? '' : sala.value;
        let valueAgendado = agendado.value == '' || agendado.value == 'null' || agendado.value == undefined ? '' : agendado.value;
        let valueAtendimento = atendimento.value == '' || atendimento.value == 'null' || atendimento.value == undefined ? '' : atendimento.value;
        let valuePosExame = posexame.value == '' || posexame.value == 'null' || posexame.value == undefined ? '' : posexame.value;
        let valueFinalizado = finalizado.value == '' || finalizado.value == 'null' || finalizado.value == undefined ? '' : finalizado.value;
        let valueObservacaoItem = observacaoitem.value == '' || observacaoitem.value == 'null' || observacaoitem.value == undefined ? '' : observacaoitem.value;
        let valueJustificativaItem = justificativaitem.value == '' || justificativaitem.value == 'null' || justificativaitem.value == undefined ? '' : justificativaitem.value;
        let valueObservacao = obsercacao.value == '' || obsercacao.value == 'null' || obsercacao.value == undefined ? '' : obsercacao.value;

        let origemtextArea =  ''
        if (valueAgendado == 'agendado') {
            origemtextArea = 'agendado'
        }if (valueAtendimento == 'atendimento') {
            origemtextArea = 'atendimento'
        }if (valuePosExame == 'posexame') {
            origemtextArea = 'posexame'
        }if (valueFinalizado == 'finalizado') {
            origemtextArea = 'finalizado'
        }


        let botaoCancelar = ``
        let textAreaObservacao = ``
        if(valueAgendado == 'agendado' && valueAtendimento == ''){
            botaoCancelar = `
                <div class="col-lg-12 col-sm-12 mt-3">
                    <a id="cancelarAgendamentoExame" class="btn btn-dim btn-light mt-2" data-id="`+ID+`">Cancelar horário agendado</a>
                </div>
            `

            
        }
        textAreaObservacao = `
                <div class="col-sm-12">
                    <div class="form-group">
                        <label class="form-label" for="default-textarea">Observações</label>
                        <div class="form-control-wrap">
                            <textarea class="form-control no-resize" id="default-textarea-`+valueAcessionNumber+`">`+valueObservacao+`</textarea>
                        </div>
                    </div>
                    <div class="form-group mb-0 mt-1 d-flex flex-row-reverse">
                        <button type="submit" data-origem="`+origemtextArea+`" data-id="`+valueAcessionNumber+`" id="salvarObservacaoPreview" class="btn btn-sm btn-dim btn-outline-primary">Salvar Observações</button>
                    </div>
                </div>
            `
        if(valueAtendimento == 'atendimento' && valuePosExame == ''){
            botaoCancelar = `
                <div class="col-lg-12 col-sm-12 mt-3">
                    <a id="cancelarAtendimentoExame" class="btn btn-dim btn-light mt-2" data-id="`+ID+`">Cancelar realização do exame</a>
                </div>
            `
        }

        var element = document.getElementById('js-modal-dados-preview');
        element.innerHTML = `
            <div class="col-lg-12 col-sm-12 mb-3">
                <div class="form-group">
                    <div class="form-control-wrap">
                        <label class="form-label m-0" for="outlined-normal">Nome</label>
                        <input type="text" class="form-control form-control form-control" disabled value=" `+valueNome+`" id="outlined-normal">
                    </div>
                </div>
            </div>
            <div class="col-lg-12 col-sm-12 mb-3 d-flex justify-content-between">
                <div class="form-group col-sm-5 m-0">
                    <div class="form-control-wrap">
                        <label class="form-label m-0" for="outlined-normal">Data de Nascimento</label>
                        <input type="text" class="form-control form-control form-control-outlined" disabled value=" `+valueDtNascimento+`" id="outlined-normal">
                    </div>
                </div>
                <div class="form-group col-sm-6 m-0">
                    <div class="form-group">
                        <div class="form-control-wrap">
                            <label class="form-label m-0" for="outlined-normal">Exame</label>
                            <input type="text" class="form-control form-control form-control-outlined" disabled value=" `+valueExame+`" id="outlined-normal">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-12 col-sm-12 mb-3 d-flex justify-content-between">
                <div class="form-group col-sm-5 m-0">
                    <div class="form-control-wrap">
                        <label class="form-label m-0" for="outlined-normal">Data e Hora do pedido</label>
                        <input type="text" class="form-control form-control form-control-outlined" disabled value=" `+valueDtHrPedido+`" id="outlined-normal">
                    </div>
                </div>
                <div class="form-group col-sm-6 m-0">
                    <div class="form-control-wrap">
                        <label class="form-label m-0" for="outlined-normal">Access Number</label>
                        <input type="text" class="form-control form-control form-control-outlined" disabled value=" `+valueAcessionNumber+`" id="outlined-normal">
                    </div>
                </div>
            </div>
            <div class="col-lg-12 col-sm-12 mb-3 d-flex justify-content-between">
                <div class="form-group col-sm-5 m-0">
                    <div class="form-control-wrap">
                        <label class="form-label m-0" for="outlined-normal">Origem</label>
                        <input type="text" class="form-control form-control form-control-outlined" disabled value=" `+valueOrigem+`" id="outlined-normal">
                    </div>
                </div>
                <div class="form-group col-sm-6 m-0">
                    <div class="form-control-wrap">
                        <label class="form-label m-0" for="outlined-normal">Leito</label>
                        <input type="text" class="form-control form-control form-control-outlined" disabled value=" `+valueLeito+`" id="outlined-normal">
                    </div>
                </div>
            </div>
            <div class="col-lg-12 col-sm-12 mb-3">
                <div class="form-control-wrap">
                    <label class="form-label m-0" for="outlined-normal">Tipo de Isolamento</label>
                    <input type="text" class="form-control form-control form-control-outlined" disabled value=" `+valueTipoIsolamento+`" id="outlined-normal">
                </div>
            </div>
            <div class="col-lg-12 col-sm-12 mb-3">
                <div class="form-group">
                    <div class="form-control-wrap">
                        <label class="form-label m-0" for="outlined-normal">Prestador</label>
                        <input type="text" class="form-control form-control form-control-outlined" disabled value=" `+valuePrestador+`" id="outlined-normal">
                    </div>
                </div>
            </div>
            <div class="col-lg-12 col-sm-12 mb-3">
                <div class="form-group">
                    <div class="form-control-wrap">
                        <label class="form-label m-0" for="outlined-normal">Setor Solicitante</label>
                        <input type="text" class="form-control form-control form-control-outlined" disabled value=" `+valueSetorSolicitante+`" id="outlined-normal">
                    </div>
                </div>
            </div>
            <div class="col-lg-12 col-sm-12 mb-3">
                <div class="form-group">
                    <div class="form-control-wrap">
                        <label class="form-label m-0" for="outlined-normal">Observação do Item</label>
                        <input type="text" class="form-control form-control form-control-outlined" disabled value=" `+valueObservacaoItem+`" id="outlined-normal">
                    </div>
                </div>
            </div>
            <div class="col-lg-12 col-sm-12 mb-3">
                <div class="form-group">
                    <div class="form-control-wrap">
                        <label class="form-label m-0" for="outlined-normal">Justificativa do Item</label>
                        <input type="text" class="form-control form-control form-control-outlined" disabled value=" `+valueJustificativaItem+`" id="outlined-normal">
                    </div>
                </div>
            </div>
            <div class="col-lg-12 col-sm-12 mb-3">
                <div class="form-group">
                    <div class="form-control-wrap">
                        <label class="form-label m-0" for="outlined-normal">Sala de Exame</label>
                        <input type="text" class="form-control form-control form-control-outlined" disabled value=" `+valueSala+`" id="outlined-normal">
                    </div>
                </div>
            </div>
            `+textAreaObservacao+`
            `+botaoCancelar+`
        `;
    })    
    $('body').on('click', '#cancelarAgendamentoExame', function(evento){
        //PEGA O VALOR DO ACESS_NUMBER
        let ID = $(this).data('id');
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
            })
            swalWithBootstrapButtons.fire({
            title: 'Cancelar Agendamento?',
            text: "Ao cancelar esse agendamento ele voltará para a coluna de solicitados.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            reverseButtons: true
            }).then((result) => {
            if (result.isConfirmed) {
                let numerotarefa = document.querySelector("#numero_tarefa-" + ID);
                var tarefa = numerotarefa.value
                
                if(tarefa != 'null'){
                    var config = {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    };
                    console.log(tarefa)
                    let corpo ='<schedule><situation><id>70</id></situation></schedule>';	
                    axios.post(`https://api.umov.me/CenterWeb/api/26347e33d181559023ab7b32150ca3bfbc572e/schedule/`+tarefa+`.xml`, {
                        data: corpo
                    }, config).then(function (response) {
                        console.log(response)
                    })
                }


                let val = '';
                $(document).ready(() => {
                    //PEGA O JSON DO CARD E ENVIA A REQUISIÇÃO DE ALTERAÇÃO
                    let update = document.querySelector("#solicitar-update-" + ID);
                    let valor = update.value;
                    val = JSON.parse(valor);
                    axios.post(y+'/api/moinhos/cancelar', {
                        acess_number: ID,
                        identificacao: 1,
                        codigo_setor_exame:  val.codigo_setor_exame,
                        data: val.hora_pedidoX,
                        dados: val
                    }).then(function (response) {
                        //ABRE MODAL DE SUCESSO
                        $('#modalForm').modal('hide')
                        //ABRE MODAL DE SUCESSO
                        $('#modalAgendadoCancelado').modal('show')
                        setTimeout(async () => {
                            $('#modalAgendadoCancelado').modal('hide')
                            socket.emit('cardRender', 'foi');
                        }, 900);
                    })
                    .catch(function (error) {
                        $('#modalAlgoErrado').modal('show')
                        console.error(error);
                    });
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire(
                'Ação Cancelada',
                'O agendamento não foi cancelado!',
                'error'
                )
            }
        })
    })
    $('body').on('click', '#cancelarAtendimentoExame', function(evento){
        //PEGA O VALOR DO ACESS_NUMBER
        let ID = $(this).data('id');
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
            })
            swalWithBootstrapButtons.fire({
            title: 'Cancelar Atendimento?',
            text: "Ao cancelar esse atendimento ele voltará para a coluna de solicitados.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            reverseButtons: true
            }).then((result) => {
            if (result.isConfirmed) {
                let val = '';
                $(document).ready(() => {
                    //PEGA O JSON DO CARD E ENVIA A REQUISIÇÃO DE ALTERAÇÃO
                    let update = document.querySelector("#solicitar-update-" + ID);
                    let valor = update.value;
                    val = JSON.parse(valor);
                    axios.post(y+'/api/moinhos/cancelar', {
                        acess_number: ID,
                        identificacao: 2,
                        codigo_setor_exame:  val.codigo_setor_exame,
                        data: val.hora_pedidoX,
                        dados: val
                    })
                    //SE UPDATE REALIZADO COM SUCESSO, FAÇA
                    .then(function (response) {
                        //ABRE MODAL DE SUCESSO
                        $('#modalForm').modal('hide')
                        //ABRE MODAL DE SUCESSO
                        $('#modalAtendimentoCancelado').modal('show')
                        socket.emit('cardRender', 'foi')
                    })
                    .catch(function (error) {
                        $('#modalAlgoErrado').modal('show')
                        console.error(error);
                    });
                })
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                'Ação Cancelada',
                'O atendimento não foi cancelado!',
                'error'
                )
            }
        })
    })


    $('body').on('click', '#salvarObservacaoPreview', function(event) {
        event.preventDefault()
        let ID = $(this).data("id")
        console.log(ID)
        let origem = $(this).data("origem")
        console.log(origem)

        let observacao = document.getElementById('default-textarea-'+ID)
        let valueObservacao = observacao.value
        axios.post(y+'/api/moinhos/observacao/'+ID, {
            origem: origem,
            observacao:  valueObservacao
        })
        .then(function (response) {
            socket.emit('cardRender', 'foi')
            // console.log(xmlDaTarefa)
        })
        
    })
})