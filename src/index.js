import {
    Trelo
} from "./js/Trelo.js";
import {
    cardsTrelo
} from "./js/cardsTrelo.js";
import columnGrids from "./js/Trelo.js";
import { addEvent } from "./js/cardsTrelo.js";
import { umov } from "./js/solicitarTransporte.js";
import { url } from "./js/url.js";


function acesso(){
    const urlParams = new URLSearchParams(window.location.search);
    const setor = urlParams.get('setor');
  
      return {setor}
  }

function rodar(){
    
const trelo = new Trelo()
let x  = ''
let y = url()
acesso().setor ? x = (axios.post(y+'/api/moinhos/consulta', {codigo_setor_exame: acesso().setor}) )
: x = (axios.get(y+'/api/moinhos'))

    x
    .then(function(response) {
        $('#modalLoading').modal('hide')
        Object.entries(response.data.solicitados).forEach(([key, val]) => {
            //ICONE DE URGENCIA
            let urgente = ''
            if (val.tipo_atendimento == 'U') {
                urgente = `<em class="icon ni ni-plus-medi-fill text-danger"></em>`
            }
            //FORMATA O NOME DO PACIENTE
            let nome = val.paciente
            let nomeSeparado = nome.split(" ")
            let nomePaciente = nomeSeparado[0]+' '+nomeSeparado[1]
            //DEFINE A COR DO CARD
            let corClassificacao = '';
            if (val.cor_classificacao == null) {corClassificacao = 'f9f3f3';}
            if (val.cor_classificacao == 'AMARELO') {corClassificacao = 'f6f5cc';}
            if (val.cor_classificacao == 'LARANJA') {corClassificacao = 'ffe090';}
            if (val.cor_classificacao == 'VERMELHO') {corClassificacao = 'f5cbc1';}
            //DEFINE OS ICONES NO CABEÇALHO DO CARD
            let isolamento = '';
            if(val.isolamento != 'Sim') {isolamento = '';}
            if(val.isolamento == 'Sim') {isolamento = '<em class="icon ni ni-alert-fill text-danger"></em>';}
            let motivoExame = '';
            if(val.motivo_exame != 'URGENTE') {motivoExame = '';}
            if(val.motivo_exame == 'URGENTE') {motivoExame = '<em class="icon ni ni-alert-circle-fill text-danger"></em>';}
            //FORMATA A DATA E HORA
            let dataHora = '';
            let formartarHoraData = val.hora_pedido.split(" ")
            let formartarData = formartarHoraData[0].split("-")
            let formatarHora = formartarHoraData[1].split(":")
            dataHora = formartarData[0]+'/'+formartarData[1]+'/'+formartarData[2]+' '+formatarHora[0]+':'+formatarHora[1]

            $('#Solicitados').append(`
            <div class="board-item m-0 mt-2 border rounded movercard" data-id="${val.acess_number}">
                <div class="board-item-content p-0">
                    <div class="kanban-item-title p-1 rounded-2" style="background: #`+corClassificacao+`; width: 279.84px">
                        <div class="d-flex align-items-center">
                            <h6 class="" style="margin-bottom: 3px;">
                                `+urgente+`
                            </h6>
                            <h6 class="ml-1 title">`+nomePaciente+`</h6>
                        </div>
                        <h6 class="d-flex" style="margin-bottom: 3px;">`+motivoExame+isolamento+`</h6>
                    </div>
                    <div class="p-2">
                        <div class="kanban-item-text" style="font-size: 12px;">
                            <div class="d-flex pb-0 justify-content-between">  
                                <div class="d-flex pb-0">
                                    <div class="pe-2 mb-0 d-flex align-items-center">At. ${val.atendimento}</div>
                                    <div class="mb-0 d-flex align-items-center">AN. ${val.acess_number}</div>
                                </div>
                                <a class="rounded-3 d-flex px-1 pb-0 text-dark align-items-center" style="background-color: #ecebeb; cursor: pointer; display:flex; align-items: cente;">
                                    <div style="font-size: 13px;" class="m-0 d-flex align-items-center"  id="img_icone-${val.acess_number}">

                                    </div>
                                    <div id="counter">00:00</div>
                                </a>
                            </div>
                            <div>
                                <p class="mb-0">${val.descricao_exame}</p>
                                <p style="display: none;" id="hora-agendamento-${val.acess_number}"></p>
                                <input type="hidden" id="solicitar-update-${val.acess_number}" value='${JSON.stringify(val)}' >
                                <input type="hidden" id="numero_tarefa-${val.acess_number}" value='${val.numero_tarefa}'>
                                <input type="hidden" id="solicitado-${val.acess_number}" value='solicitado'>
                                <input type="hidden" id="agendado-${val.acess_number}" value='' >
                                <input type="hidden" id="atendimento-${val.acess_number}" value='' >
                                <input type="hidden" id="posexame-${val.acess_number}" value='' >
                                <input type="hidden" id="atendimento-${val.acess_number}" value="${val.atendimento}" >
                                <input type="hidden" id="tipo_atendimento-${val.acess_number}" value="${val.tipo_atendimento}" >
                                <input type="hidden" id="prontuario-${val.acess_number}" value="${val.prontuario}" >
                                <input type="hidden" id="paciente-${val.acess_number}" value="${val.paciente}" >
                                <input type="hidden" id="data_dasc-${val.acess_number}" value="${val.data_nasc}" >
                                <input type="hidden" id="nome_mae-${val.acess_number}" value="${val.nome_mae}" >
                                <input type="hidden" id="prestador-${val.acess_number}" value="${val.prestador}" >
                                <input type="hidden" id="codigo_ui-${val.acess_number}" value="${val.codigo_ui}" >
                                <input type="hidden" id="unidade_internacao-${val.acess_number}" value="${val.unidade_unternacao}" >
                                <input type="hidden" id="codigo_leito-${val.acess_number}" value="${val.codigo_leito}" >
                                <input type="hidden" id="leito-${val.acess_number}" value="${val.leito}" >
                                <input type="hidden" id="codigo_setor-${val.acess_number}" value="${val.codigo_setor}" >
                                <input type="hidden" id="setor-${val.acess_number}" value="${val.setor}" >
                                <input type="hidden" id="codigo_prescricao-${val.acess_number}" value="${val.codigo_prescricao}" >
                                <input type="hidden" id="codigo_item_prescrito-${val.acess_number}" value="${val.codigo_item_prescrito}" >
                                <input type="hidden" id="descricao_item_prescrito-${val.acess_number}" value="${val.descricao_item_prescrito}" >
                                <input type="hidden" id="observacao_item-${val.acess_number}" value="${val.observacao_item}" >
                                <input type="hidden" id="justificativa_item-${val.acess_number}" value="${val.justificativa_item}" >
                                <input type="hidden" id="sn_cancelado-${val.acess_number}" value="${val.sn_cancelado}" >
                                <input type="hidden" id="pedido_exame-${val.acess_number}" value="${val.pedido_exame}" >
                                <input type="hidden" id="data_pedido-${val.acess_number}" value="${val.data_pedido}" >
                                <input type="hidden" id="hora_pedido-${val.acess_number}" value="${val.hora_pedido}" >
                                <input type="hidden" id="codigo_setor_exame-${val.acess_number}" value="${val.codigo_setor_exame}" >
                                <input type="hidden" id="setor_exame-${val.acess_number}" value="${val.setor_exame}" >
                                <input type="hidden" id="codigo_Exame-${val.acess_number}" value="${val.codigo_exame}" >
                                <input type="hidden" id="descricao_exame-${val.acess_number}" value="${val.descricao_exame}" >
                                <input type="hidden" id="motivo_exame-${val.acess_number}" value="${val.motivo_exame}" >
                                <input type="hidden" id="acess_number-${val.acess_number}" value="${val.acess_number}" >
                                <input type="hidden" id="sn_realizado-${val.acess_number}" value="${val.sn_realizado}" >
                                <input type="hidden" id="data_realizado-${val.acess_number}" value="${val.data_realizado}" >
                                <input type="hidden" id="veiculo-${val.acess_number}" value="${val.veiculo}" >
                                <input type="hidden" id="uso_o2-${val.acess_number}" value="${val.uso_o2}" >
                                <input type="hidden" id="vent_mec-${val.acess_number}" value="${val.vent_mec}" >
                                <input type="hidden" id="isolamento-${val.acess_number}" value="${val.isolamento}" >
                                <input type="hidden" id="tipo_isolamento-${val.acess_number}" value="${val.tipo_isolamento}" >
                                <input type="hidden" id="acomp_enf-${val.acess_number}" value="${val.acomp_enf}" >
                                <input type="hidden" id="acomp_familiar-${val.acess_number}" value="${val.acomp_familiar}" >
                                <input type="hidden" id="cor_classificacao-${val.acess_number}" value="${val.cor_classificacao}" >
                                <input type="hidden" id="tipo_risco-${val.acess_number}" value="${val.tipo_risco}" >
                                <input type="hidden" id="sala-${val.acess_number}" value="${val.sala}" >
                            </div>
                            <div class="d-flex justify-content-between">
                                <p class="m-0" id="agendamento-${val.acess_number}">Solicitado em `+dataHora+`</p>
                                <div class="aparecer" data-id="${val.acess_number}">
                                    <a style="background: transparent;" class="border-0 p-0 btn btn-icon btn-light" data-bs-toggle="modal" data-bs-target="#modalForm">•••</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `)
        });
        Object.entries(response.data.agendados).forEach(([key, val]) => {
            //ICONE DE URGENCIA
            let urgente = ''
            if (val.tipo_atendimento == 'U') {
                urgente = `<em class="icon ni ni-plus-medi-fill text-danger"></em>`
            }
            //FORMATA O NOME DO PACIENTE
            let nome = val.paciente
            let nomeSeparado = nome.split(" ")
            let nomePaciente = nomeSeparado[0]+' '+nomeSeparado[1]
            //DEFINE A COR DO CARD
            let corClassificacao = '';
            if (val.cor_classificacao == null) {corClassificacao = 'f9f3f3';}
            if (val.cor_classificacao == 'AMARELO') {corClassificacao = 'f6f5cc';}
            if (val.cor_classificacao == 'LARANJA') {corClassificacao = 'ffe090';}
            if (val.cor_classificacao == 'VERMELHO') {corClassificacao = 'f5cbc1';}
            //DEFINE OS ICONES NO CABEÇALHO DO CARD
            let isolamento = '';
            if(val.isolamento != 'Sim') {isolamento = '';}
            if(val.isolamento == 'Sim') {isolamento = '<em class="icon ni ni-alert-fill text-danger"></em>';}
            let motivoExame = '';
            if(val.motivo_exame != 'URGENTE') {motivoExame = '';}
            if(val.motivo_exame == 'URGENTE') {motivoExame = '<em class="icon ni ni-alert-circle-fill text-danger"></em>';}
            //FORMATA A DATA E HORA
            let dataHora = '';
            let formartarHoraData = val.hora_pedido.split(" ")
            let formartarData = formartarHoraData[0].split("-")
            let formatarHora = formartarHoraData[1].split(":")
            dataHora = formartarData[0]+'/'+formartarData[1]+'/'+formartarData[2]+' '+formatarHora[0]+':'+formatarHora[1]

            $('#Agendados').append(`
            <div class="board-item m-0  mt-2 border rounded"  data-id="${val.acess_number}">
                <div class="board-item-content p-0">
                    <div class="kanban-item-title p-1 rounded-2" style="background: #`+corClassificacao+`; width: 279.84px">
                        <div class="d-flex align-items-center text-danger">
                            <h6 class="" style="margin-bottom: 3px;">
                                `+urgente+`
                            </h6>
                            <h6 class="ml-1 title">`+nomePaciente+`</h6>
                        </div>
                        <h6 class="d-flex" style="margin-bottom: 3px;">`+motivoExame+isolamento+`</h6>
                    </div>
                    <div class="p-2">
                    <div class="kanban-item-text" style="font-size: 12px;">
                        <div class="d-flex pb-0 justify-content-between">  
                            <div class="d-flex pb-0">
                                <div class="pe-2 mb-0 d-flex align-items-center">At. ${val.atendimento}</div>
                                <div class="mb-0 d-flex align-items-center">AN. ${val.acess_number}</div>
                            </div>
                            <a class="rounded-3 d-flex px-1 text-dark align-items-center" id="solicitarTransporte" data-id="${val.acess_number}" style="background-color: #ecebeb; cursor: pointer; display:flex; align-items: cente; padding-top: 1px; padding-bottom: 1px;">
                                <div style="font-size: 13px;" class="m-0 d-flex align-items-center" id="img_icone-${val.acess_number}">
                                    <img style="height: 13px; margin-right: 5px; margin-left: 4px;" src="assets/images/Icones/${val.imagem_cadeira}">
                                </div>
                                <div class="">00:00</div>
                            </a>
                        </div>
                        <div>
                            <p class="mb-0">${val.descricao_exame}</p>
                            <input type="hidden" id="solicitar-update-${val.acess_number}" value='${JSON.stringify(val)}'>
                            <input type="hidden" id="numero_tarefa-${val.acess_number}" value='${val.numero_tarefa}'>
                            <input type="hidden" id="status_tarefa-${val.acess_number}" value='${val.status_tarefa}'>
                            <input type="hidden" id="solicitado-${val.acess_number}" value='solicitado'>
                            <input type="hidden" id="agendado-${val.acess_number}" value='agendado'>
                            <input type="hidden" id="atendimento-${val.acess_number}" value=''>
                            <input type="hidden" id="posexame-${val.acess_number}" value=''>
                            <input type="hidden" id="atendimento-${val.acess_number}" value="${val.atendimento}">
                            <input type="hidden" id="tipo_atendimento-${val.acess_number}" value="${val.tipo_atendimento}">
                            <input type="hidden" id="prontuario-${val.acess_number}" value="${val.prontuario}">
                            <input type="hidden" id="paciente-${val.acess_number}" value="${val.paciente}">
                            <input type="hidden" id="data_dasc-${val.acess_number}" value="${val.data_nasc}">
                            <input type="hidden" id="nome_mae-${val.acess_number}" value="${val.nome_mae}">
                            <input type="hidden" id="prestador-${val.acess_number}" value="${val.prestador}">
                            <input type="hidden" id="codigo_ui-${val.acess_number}" value="${val.codigo_ui}">
                            <input type="hidden" id="unidade_internacao-${val.acess_number}" value="${val.unidade_unternacao}">
                            <input type="hidden" id="codigo_leito-${val.acess_number}" value="${val.codigo_leito}">
                            <input type="hidden" id="leito-${val.acess_number}" value="${val.leito}">
                            <input type="hidden" id="codigo_setor-${val.acess_number}" value="${val.codigo_setor}">
                            <input type="hidden" id="setor-${val.acess_number}" value="${val.setor}">
                            <input type="hidden" id="codigo_prescricao-${val.acess_number}" value="${val.codigo_prescricao}">
                            <input type="hidden" id="codigo_item_prescrito-${val.acess_number}" value="${val.codigo_item_prescrito}">
                            <input type="hidden" id="descricao_item_prescrito-${val.acess_number}" value="${val.descricao_item_prescrito}">
                            <input type="hidden" id="observacao_item-${val.acess_number}" value="${val.observacao_item}">
                            <input type="hidden" id="justificativa_item-${val.acess_number}" value="${val.justificativa_item}">
                            <input type="hidden" id="sn_cancelado-${val.acess_number}" value="${val.sn_cancelado}">
                            <input type="hidden" id="pedido_exame-${val.acess_number}" value="${val.pedido_exame}">
                            <input type="hidden" id="data_pedido-${val.acess_number}" value="${val.data_pedido}">
                            <input type="hidden" id="hora_pedido-${val.acess_number}" value="${val.hora_pedido}">
                            <input type="hidden" id="codigo_setor_exame-${val.acess_number}" value="${val.codigo_setor_exame}">
                            <input type="hidden" id="setor_exame-${val.acess_number}" value="${val.setor_exame}">
                            <input type="hidden" id="codigo_Exame-${val.acess_number}" value="${val.codigo_exame}">
                            <input type="hidden" id="descricao_exame-${val.acess_number}" value="${val.descricao_exame}">
                            <input type="hidden" id="motivo_exame-${val.acess_number}" value="${val.motivo_exame}">
                            <input type="hidden" id="acess_number-${val.acess_number}" value="${val.acess_number}">
                            <input type="hidden" id="sn_realizado-${val.acess_number}" value="${val.sn_realizado}">
                            <input type="hidden" id="data_realizado-${val.acess_number}" value="${val.data_realizado}">
                            <input type="hidden" id="veiculo-${val.acess_number}" value="${val.veiculo}">
                            <input type="hidden" id="uso_o2-${val.acess_number}" value="${val.uso_o2}">
                            <input type="hidden" id="vent_mec-${val.acess_number}" value="${val.vent_mec}">
                            <input type="hidden" id="isolamento-${val.acess_number}" value="${val.isolamento}">
                            <input type="hidden" id="tipo_isolamento-${val.acess_number}" value="${val.tipo_isolamento}">
                            <input type="hidden" id="acomp_enf-${val.acess_number}" value="${val.acomp_enf}">
                            <input type="hidden" id="acomp_familiar-${val.acess_number}" value="${val.acomp_familiar}">
                            <input type="hidden" id="cor_classificacao-${val.acess_number}" value="${val.cor_classificacao}">
                            <input type="hidden" id="tipo_risco-${val.acess_number}" value="${val.tipo_risco}">
                            <input type="hidden" id="sala-${val.acess_number}" value="${val.sala}" >
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="m-0 text-primary" id="agendamento-${val.acess_number}">Agendado para ${val.data_movimentacao}</p>
                            <div class="aparecer" data-id="${val.acess_number}">
                                <a style="background: transparent;" class="border-0 p-0 btn btn-icon btn-light" data-bs-toggle="modal" data-bs-target="#modalForm">•••</a>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            `)
        });
        Object.entries(response.data.atendimento).forEach(([key, val]) => {
            //ICONE DE URGENCIA
            let urgente = ''
            if (val.tipo_atendimento == 'U') {
                urgente = `<em class="icon ni ni-plus-medi-fill text-danger"></em>`
            }
            //FORMATA O NOME DO PACIENTE
            let nome = val.paciente
            let nomeSeparado = nome.split(" ")
            let nomePaciente = nomeSeparado[0]+' '+nomeSeparado[1]
            //DEFINE A COR DO CARD
            let corClassificacao = '';
            if (val.cor_classificacao == null) {corClassificacao = 'f9f3f3';}
            if (val.cor_classificacao == 'AMARELO') {corClassificacao = 'f6f5cc';}
            if (val.cor_classificacao == 'LARANJA') {corClassificacao = 'ffe090';}
            if (val.cor_classificacao == 'VERMELHO') {corClassificacao = 'f5cbc1';}
            //DEFINE OS ICONES NO CABEÇALHO DO CARD
            let isolamento = '';
            if(val.isolamento != 'Sim') {isolamento = '';}
            if(val.isolamento == 'Sim') {isolamento = '<em class="icon ni ni-alert-fill text-danger"></em>';}
            let motivoExame = '';
            if(val.motivo_exame != 'URGENTE') {motivoExame = '';}
            if(val.motivo_exame == 'URGENTE') {motivoExame = '<em class="icon ni ni-alert-circle-fill text-danger"></em>';}
            //FORMATA A DATA E HORA
            let dataHora = '';
            let formartarHoraData = val.hora_pedido.split(" ")
            let formartarData = formartarHoraData[0].split("-")
            let formatarHora = formartarHoraData[1].split(":")
            dataHora = formartarData[0]+'/'+formartarData[1]+'/'+formartarData[2]+' '+formatarHora[0]+':'+formatarHora[1]

            $('#Atendimento').append(`
            <div class="board-item m-0 mt-2 border rounded movercard" data-id="${val.acess_number}">
                <div class="board-item-content p-0">
                    <div class="kanban-item-title p-1 rounded-2" style="background: #`+corClassificacao+`; width: 279.84px">
                        <div class="d-flex align-items-center text-danger">
                            <h6 class="" style="margin-bottom: 3px;">
                                `+urgente+`
                            </h6>
                            <h6 class="ml-1 title">`+nomePaciente+`</h6>
                        </div>
                        <h6 class="d-flex" style="margin-bottom: 3px;">`+motivoExame+isolamento+`</h6>
                    </div>
                    <div class="p-2">
                        <div class="kanban-item-text" style="font-size: 12px;">
                            <div class="d-flex pb-0 justify-content-between">  
                                <div class="d-flex pb-0">
                                    <div class="pe-2 mb-0 d-flex align-items-center">At. ${val.atendimento}</div>
                                    <div class="mb-0 d-flex align-items-center">AN. ${val.acess_number}</div>
                                </div>
                                <a class="rounded-3 d-flex px-1 pb-0 text-dark align-items-center" style="background-color: #ecebeb; cursor: pointer; display:flex; align-items: cente;">
                                    <div style="font-size: 13px;" class="m-0 d-flex align-items-center"  id="img_icone-${val.acess_number}">
                                        <em class="icon ni ni-activity-round-fill"></em>
                                    </div>
                                    <div class="">00:00</div>
                                </a>
                            </div>
                            <div>
                                <p class="mb-0">${val.descricao_exame}</p>
                                <input type="hidden" id="solicitar-update-${val.acess_number}" value='${JSON.stringify(val)}' >
                                <input type="hidden" id="numero_tarefa-${val.acess_number}" value='${val.numero_tarefa}'>
                                <input type="hidden" id="solicitado-${val.acess_number}" value='solicitado' >
                                <input type="hidden" id="agendado-${val.acess_number}" value='agendado' >
                                <input type="hidden" id="atendimento-${val.acess_number}" value='atendimento' >
                                <input type="hidden" id="posexame-${val.acess_number}" value='' >
                                <input type="hidden" id="atendimento-${val.acess_number}" value="${val.atendimento}" >
                                <input type="hidden" id="tipo_atendimento-${val.acess_number}" value="${val.tipo_atendimento}" >
                                <input type="hidden" id="prontuario-${val.acess_number}" value="${val.prontuario}" >
                                <input type="hidden" id="paciente-${val.acess_number}" value="${val.paciente}" >
                                <input type="hidden" id="data_dasc-${val.acess_number}" value="${val.data_nasc}" >
                                <input type="hidden" id="nome_mae-${val.acess_number}" value="${val.nome_mae}" >
                                <input type="hidden" id="prestador-${val.acess_number}" value="${val.prestador}" >
                                <input type="hidden" id="codigo_ui-${val.acess_number}" value="${val.codigo_ui}" >
                                <input type="hidden" id="unidade_internacao-${val.acess_number}" value="${val.unidade_unternacao}" >
                                <input type="hidden" id="codigo_leito-${val.acess_number}" value="${val.codigo_leito}" >
                                <input type="hidden" id="leito-${val.acess_number}" value="${val.leito}" >
                                <input type="hidden" id="codigo_setor-${val.acess_number}" value="${val.codigo_setor}" >
                                <input type="hidden" id="setor-${val.acess_number}" value="${val.setor}" >
                                <input type="hidden" id="codigo_prescricao-${val.acess_number}" value="${val.codigo_prescricao}" >
                                <input type="hidden" id="codigo_item_prescrito-${val.acess_number}" value="${val.codigo_item_prescrito}" >
                                <input type="hidden" id="descricao_item_prescrito-${val.acess_number}" value="${val.descricao_item_prescrito}" >
                                <input type="hidden" id="observacao_item-${val.acess_number}" value="${val.observacao_item}" >
                                <input type="hidden" id="justificativa_item-${val.acess_number}" value="${val.justificativa_item}" >
                                <input type="hidden" id="sn_cancelado-${val.acess_number}" value="${val.sn_cancelado}" >
                                <input type="hidden" id="pedido_exame-${val.acess_number}" value="${val.pedido_exame}" >
                                <input type="hidden" id="data_pedido-${val.acess_number}" value="${val.data_pedido}" >
                                <input type="hidden" id="hora_pedido-${val.acess_number}" value="${val.hora_pedido}" >
                                <input type="hidden" id="codigo_setor_exame-${val.acess_number}" value="${val.codigo_setor_exame}" >
                                <input type="hidden" id="setor_exame-${val.acess_number}" value="${val.setor_exame}" >
                                <input type="hidden" id="codigo_Exame-${val.acess_number}" value="${val.codigo_exame}" >
                                <input type="hidden" id="descricao_exame-${val.acess_number}" value="${val.descricao_exame}" >
                                <input type="hidden" id="motivo_exame-${val.acess_number}" value="${val.motivo_exame}" >
                                <input type="hidden" id="acess_number-${val.acess_number}" value="${val.acess_number}" >
                                <input type="hidden" id="sn_realizado-${val.acess_number}" value="${val.sn_realizado}" >
                                <input type="hidden" id="data_realizado-${val.acess_number}" value="${val.data_realizado}" >
                                <input type="hidden" id="veiculo-${val.acess_number}" value="${val.veiculo}" >
                                <input type="hidden" id="uso_o2-${val.acess_number}" value="${val.uso_o2}" >
                                <input type="hidden" id="vent_mec-${val.acess_number}" value="${val.vent_mec}" >
                                <input type="hidden" id="isolamento-${val.acess_number}" value="${val.isolamento}" >
                                <input type="hidden" id="tipo_isolamento-${val.acess_number}" value="${val.tipo_isolamento}" >
                                <input type="hidden" id="acomp_enf-${val.acess_number}" value="${val.acomp_enf}" >
                                <input type="hidden" id="acomp_familiar-${val.acess_number}" value="${val.acomp_familiar}" >
                                <input type="hidden" id="cor_classificacao-${val.acess_number}" value="${val.cor_classificacao}" >
                                <input type="hidden" id="tipo_risco-${val.acess_number}" value="${val.tipo_risco}" >
                                <input type="hidden" id="sala-${val.acess_number}" value="${val.sala}" >

                            </div>
                            <div class="d-flex justify-content-between">
                                <p class="m-0 text-success"  id="agendamento-${val.acess_number}">Em atendimento ${val.data_movimentacao}</p>
                                <div class="aparecer" data-id="${val.acess_number}">
                                    <a style="background: transparent;" class="border-0 p-0 btn btn-icon btn-light" data-bs-toggle="modal" data-bs-target="#modalForm">•••</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `)
        });
        Object.entries(response.data.pos_exame).forEach(([key, val]) => {
            //ICONE DE URGENCIA
            let urgente = ''
            if (val.tipo_atendimento == 'U') {
                urgente = `<em class="icon ni ni-plus-medi-fill text-danger"></em>`
            }
            //FORMATA O NOME DO PACIENTE
            let nome = val.paciente
            let nomeSeparado = nome.split(" ")
            let nomePaciente = nomeSeparado[0]+' '+nomeSeparado[1]
            //DEFINE A COR DO CARD
            let corClassificacao = '';
            if (val.cor_classificacao == null) {corClassificacao = 'f9f3f3';}
            if (val.cor_classificacao == 'AMARELO') {corClassificacao = 'f6f5cc';}
            if (val.cor_classificacao == 'LARANJA') {corClassificacao = 'ffe090';}
            if (val.cor_classificacao == 'VERMELHO') {corClassificacao = 'f5cbc1';}
            //DEFINE OS ICONES NO CABEÇALHO DO CARD
            let isolamento = '';
            if(val.isolamento != 'Sim') {isolamento = '';}
            if(val.isolamento == 'Sim') {isolamento = '<em class="icon ni ni-alert-fill text-danger"></em>';}
            let motivoExame = '';
            if(val.motivo_exame != 'URGENTE') {motivoExame = '';}
            if(val.motivo_exame == 'URGENTE') {motivoExame = '<em class="icon ni ni-alert-circle-fill text-danger"></em>';}
            //FORMATA A DATA E HORA
            let dataHora = '';
            let formartarHoraData = val.hora_pedido.split(" ")
            let formartarData = formartarHoraData[0].split("-")
            let formatarHora = formartarHoraData[1].split(":")
            dataHora = formartarData[0]+'/'+formartarData[1]+'/'+formartarData[2]+' '+formatarHora[0]+':'+formatarHora[1]
            //IMAGEM DE TRANSPORTE DE PACIENTE
            if (val.imagem_cadeira == null || val.imagem_cadeira == undefined) {
                val.imagem_cadeira = 'cadeira-de-rodas-preto.png'
            }

            $('#posExame').append(`
            <div class="board-item m-0  mt-2 border rounded"  data-id="${val.acess_number}">
                <div class="board-item-content p-0">
                    <div class="kanban-item-title p-1 rounded-2" style="background: #`+corClassificacao+`; width: 279.84px">
                        <div class="d-flex align-items-center text-danger">
                            <h6 class="" style="margin-bottom: 3px;">
                                `+urgente+`
                            </h6>
                            <h6 class="ml-1 title">`+nomePaciente+`</h6>
                        </div>
                        <h6 class="d-flex" style="margin-bottom: 3px;">`+motivoExame+isolamento+`</h6>
                    </div>
                    <div class="p-2">
                    <div class="kanban-item-text" style="font-size: 12px;">
                        <div class="d-flex pb-0 justify-content-between">  
                            <div class="d-flex pb-0">
                                <div class="pe-2 mb-0 d-flex align-items-center">At. ${val.atendimento}</div>
                                <div class="mb-0 d-flex align-items-center">AN. ${val.acess_number}</div>
                            </div>
                            <a class="rounded-3 d-flex px-1 text-dark align-items-center" id="solicitarTransporteFinalizar" data-id="${val.acess_number}" style="background-color: #ecebeb; cursor: pointer; display:flex; align-items: cente; padding-top: 1px; padding-bottom: 1px;">
                                <div style="font-size: 13px;" class="m-0 d-flex align-items-center" id="img_icone-${val.acess_number}">
                                    <img style="height: 13px; margin-right: 5px; margin-left: 4px;" src="assets/images/Icones/${val.imagem_cadeira}">
                                </div>
                                <div class="">00:00</div>
                            </a>
                        </div>
                        <div>
                            <p class="mb-0">${val.descricao_exame}</p>
                            <input type="hidden" id="solicitar-update-${val.acess_number}" value='${JSON.stringify(val)}'>
                            <input type="hidden" id="numero_tarefa-${val.acess_number}" value='${val.numero_tarefa}'>
                            <input type="hidden" id="imagem_cadeira-${val.acess_number}" value='${val.imagem_cadeira}'>
                            <input type="hidden" id="solicitado-${val.acess_number}" value='solicitado'>
                            <input type="hidden" id="agendado-${val.acess_number}" value='agendado'>
                            <input type="hidden" id="atendimento-${val.acess_number}" value='atendimento'>
                            <input type="hidden" id="posexame-${val.acess_number}" value='posexame'>
                            <input type="hidden" id="atendimento-${val.acess_number}" value="${val.atendimento}">
                            <input type="hidden" id="tipo_atendimento-${val.acess_number}" value="${val.tipo_atendimento}">
                            <input type="hidden" id="prontuario-${val.acess_number}" value="${val.prontuario}">
                            <input type="hidden" id="paciente-${val.acess_number}" value="${val.paciente}">
                            <input type="hidden" id="data_dasc-${val.acess_number}" value="${val.data_nasc}">
                            <input type="hidden" id="nome_mae-${val.acess_number}" value="${val.nome_mae}">
                            <input type="hidden" id="prestador-${val.acess_number}" value="${val.prestador}">
                            <input type="hidden" id="codigo_ui-${val.acess_number}" value="${val.codigo_ui}">
                            <input type="hidden" id="unidade_internacao-${val.acess_number}" value="${val.unidade_unternacao}">
                            <input type="hidden" id="codigo_leito-${val.acess_number}" value="${val.codigo_leito}">
                            <input type="hidden" id="leito-${val.acess_number}" value="${val.leito}">
                            <input type="hidden" id="codigo_setor-${val.acess_number}" value="${val.codigo_setor}">
                            <input type="hidden" id="setor-${val.acess_number}" value="${val.setor}">
                            <input type="hidden" id="codigo_prescricao-${val.acess_number}" value="${val.codigo_prescricao}">
                            <input type="hidden" id="codigo_item_prescrito-${val.acess_number}" value="${val.codigo_item_prescrito}">
                            <input type="hidden" id="descricao_item_prescrito-${val.acess_number}" value="${val.descricao_item_prescrito}">
                            <input type="hidden" id="observacao_item-${val.acess_number}" value="${val.observacao_item}">
                            <input type="hidden" id="justificativa_item-${val.acess_number}" value="${val.justificativa_item}">
                            <input type="hidden" id="sn_cancelado-${val.acess_number}" value="${val.sn_cancelado}">
                            <input type="hidden" id="pedido_exame-${val.acess_number}" value="${val.pedido_exame}">
                            <input type="hidden" id="data_pedido-${val.acess_number}" value="${val.data_pedido}">
                            <input type="hidden" id="hora_pedido-${val.acess_number}" value="${val.hora_pedido}">
                            <input type="hidden" id="codigo_setor_exame-${val.acess_number}" value="${val.codigo_setor_exame}">
                            <input type="hidden" id="setor_exame-${val.acess_number}" value="${val.setor_exame}">
                            <input type="hidden" id="codigo_Exame-${val.acess_number}" value="${val.codigo_exame}">
                            <input type="hidden" id="descricao_exame-${val.acess_number}" value="${val.descricao_exame}">
                            <input type="hidden" id="motivo_exame-${val.acess_number}" value="${val.motivo_exame}">
                            <input type="hidden" id="acess_number-${val.acess_number}" value="${val.acess_number}">
                            <input type="hidden" id="sn_realizado-${val.acess_number}" value="${val.sn_realizado}">
                            <input type="hidden" id="data_realizado-${val.acess_number}" value="${val.data_realizado}">
                            <input type="hidden" id="veiculo-${val.acess_number}" value="${val.veiculo}">
                            <input type="hidden" id="uso_o2-${val.acess_number}" value="${val.uso_o2}">
                            <input type="hidden" id="vent_mec-${val.acess_number}" value="${val.vent_mec}">
                            <input type="hidden" id="isolamento-${val.acess_number}" value="${val.isolamento}">
                            <input type="hidden" id="tipo_isolamento-${val.acess_number}" value="${val.tipo_isolamento}">
                            <input type="hidden" id="acomp_enf-${val.acess_number}" value="${val.acomp_enf}">
                            <input type="hidden" id="acomp_familiar-${val.acess_number}" value="${val.acomp_familiar}">
                            <input type="hidden" id="cor_classificacao-${val.acess_number}" value="${val.cor_classificacao}">
                            <input type="hidden" id="tipo_risco-${val.acess_number}" value="${val.tipo_risco}">
                            <input type="hidden" id="sala-${val.acess_number}" value="${val.sala}" >
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="m-0 text-warning" id="agendamento-${val.acess_number}">Saiu de atendimento ${val.data_movimentacao}</p>
                            <div class="aparecer" data-id="${val.acess_number}">
                                <a style="background: transparent;" class="border-0 p-0 btn btn-icon btn-light" data-bs-toggle="modal" data-bs-target="#modalForm">•••</a>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            `)
        });
        Object.entries(response.data.finalizados).forEach(([key, val]) => {
            //ICONE DE URGENCIA
            let urgente = ''
            if (val.tipo_atendimento == 'U') {
                urgente = `<em class="icon ni ni-plus-medi-fill text-danger"></em>`
            }
            //FORMATA O NOME DO PACIENTE
            let nome = val.paciente
            let nomeSeparado = nome.split(" ")
            let nomePaciente = nomeSeparado[0]+' '+nomeSeparado[1]
            //DEFINE A COR DO CARD
            let corClassificacao = '';
            if (val.cor_classificacao == null) {corClassificacao = 'f9f3f3';}
            if (val.cor_classificacao == 'AMARELO') {corClassificacao = 'f6f5cc';}
            if (val.cor_classificacao == 'LARANJA') {corClassificacao = 'ffe090';}
            if (val.cor_classificacao == 'VERMELHO') {corClassificacao = 'f5cbc1';}
            //DEFINE OS ICONES NO CABEÇALHO DO CARD
            let isolamento = '';
            if(val.isolamento != 'Sim') {isolamento = '';}
            if(val.isolamento == 'Sim') {isolamento = '<em class="icon ni ni-alert-fill text-danger"></em>';}
            let motivoExame = '';
            if(val.motivo_exame != 'URGENTE') {motivoExame = '';}
            if(val.motivo_exame == 'URGENTE') {motivoExame = '<em class="icon ni ni-alert-circle-fill text-danger"></em>';}
            //FORMATA A DATA E HORA
            let dataHora = '';
            let formartarHoraData = val.hora_pedido.split(" ")
            let formartarData = formartarHoraData[0].split("-")
            let formatarHora = formartarHoraData[1].split(":")
            dataHora = formartarData[0]+'/'+formartarData[1]+'/'+formartarData[2]+' '+formatarHora[0]+':'+formatarHora[1]

            $('#finalizados').append(`
            <div class="board-item m-0 mt-2 border rounded movercard" data-id="${val.acess_number}">
                <div class="board-item-content p-0">
                    <div class="kanban-item-title p-1 rounded-2" style="background: #`+corClassificacao+`; width: 279.84px">
                        <div class="d-flex align-items-center">
                            <h6 class="" style="margin-bottom: 3px;">
                                `+urgente+`
                            </h6>
                            <h6 class="ml-1 title">`+nomePaciente+`</h6>
                        </div>
                        <h6 class="d-flex" style="margin-bottom: 3px;">`+motivoExame+isolamento+`</h6>
                    </div>
                    <div class="p-2">
                        <div class="kanban-item-text" style="font-size: 12px;">
                            <div class="d-flex pb-0 justify-content-between">  
                                <div class="d-flex pb-0">
                                    <div class="pe-2 mb-0 d-flex align-items-center">At. ${val.atendimento}</div>
                                    <div class="mb-0 d-flex align-items-center">AN. ${val.acess_number}</div>
                                </div>
                                <a class="rounded-3 d-flex px-1 text-dark align-items-center" id="solicitarTransporteFinal" data-id="${val.acess_number}" style="background-color: #ecebeb; cursor: pointer; display:flex; align-items: cente; padding-top: 1px; padding-bottom: 1px;">
                                    <div style="font-size: 13px;" class="m-0 d-flex align-items-center" id="img_icone-${val.acess_number}">
                                        <img style="height: 13px; margin-right: 5px; margin-left: 4px;" src="assets/images/Icones/${val.imagem_cadeira}">
                                    </div>
                                <div class="">00:00</div>
                            </a>
                            </div>
                            <div>
                                <p class="mb-0">${val.descricao_exame}</p>
                                <p style="display: none;" id="hora-agendamento-${val.acess_number}"></p>
                                <input type="hidden" id="solicitar-update-${val.acess_number}" value='${JSON.stringify(val)}' >
                                <input type="hidden" id="numero_tarefa-${val.acess_number}" value='${val.numero_tarefa}'>
                                <input type="hidden" id="solicitado-${val.acess_number}" value='solicitado'>
                                <input type="hidden" id="agendado-${val.acess_number}" value='' >
                                <input type="hidden" id="atendimento-${val.acess_number}" value='' >
                                <input type="hidden" id="posexame-${val.acess_number}" value='' >
                                <input type="hidden" id="atendimento-${val.acess_number}" value="${val.atendimento}" >
                                <input type="hidden" id="tipo_atendimento-${val.acess_number}" value="${val.tipo_atendimento}" >
                                <input type="hidden" id="prontuario-${val.acess_number}" value="${val.prontuario}" >
                                <input type="hidden" id="paciente-${val.acess_number}" value="${val.paciente}" >
                                <input type="hidden" id="data_dasc-${val.acess_number}" value="${val.data_nasc}" >
                                <input type="hidden" id="nome_mae-${val.acess_number}" value="${val.nome_mae}" >
                                <input type="hidden" id="prestador-${val.acess_number}" value="${val.prestador}" >
                                <input type="hidden" id="codigo_ui-${val.acess_number}" value="${val.codigo_ui}" >
                                <input type="hidden" id="unidade_internacao-${val.acess_number}" value="${val.unidade_unternacao}" >
                                <input type="hidden" id="codigo_leito-${val.acess_number}" value="${val.codigo_leito}" >
                                <input type="hidden" id="leito-${val.acess_number}" value="${val.leito}" >
                                <input type="hidden" id="codigo_setor-${val.acess_number}" value="${val.codigo_setor}" >
                                <input type="hidden" id="setor-${val.acess_number}" value="${val.setor}" >
                                <input type="hidden" id="codigo_prescricao-${val.acess_number}" value="${val.codigo_prescricao}" >
                                <input type="hidden" id="codigo_item_prescrito-${val.acess_number}" value="${val.codigo_item_prescrito}" >
                                <input type="hidden" id="descricao_item_prescrito-${val.acess_number}" value="${val.descricao_item_prescrito}" >
                                <input type="hidden" id="observacao_item-${val.acess_number}" value="${val.observacao_item}" >
                                <input type="hidden" id="justificativa_item-${val.acess_number}" value="${val.justificativa_item}" >
                                <input type="hidden" id="sn_cancelado-${val.acess_number}" value="${val.sn_cancelado}" >
                                <input type="hidden" id="pedido_exame-${val.acess_number}" value="${val.pedido_exame}" >
                                <input type="hidden" id="data_pedido-${val.acess_number}" value="${val.data_pedido}" >
                                <input type="hidden" id="hora_pedido-${val.acess_number}" value="${val.hora_pedido}" >
                                <input type="hidden" id="codigo_setor_exame-${val.acess_number}" value="${val.codigo_setor_exame}" >
                                <input type="hidden" id="setor_exame-${val.acess_number}" value="${val.setor_exame}" >
                                <input type="hidden" id="codigo_Exame-${val.acess_number}" value="${val.codigo_exame}" >
                                <input type="hidden" id="descricao_exame-${val.acess_number}" value="${val.descricao_exame}" >
                                <input type="hidden" id="motivo_exame-${val.acess_number}" value="${val.motivo_exame}" >
                                <input type="hidden" id="acess_number-${val.acess_number}" value="${val.acess_number}" >
                                <input type="hidden" id="sn_realizado-${val.acess_number}" value="${val.sn_realizado}" >
                                <input type="hidden" id="data_realizado-${val.acess_number}" value="${val.data_realizado}" >
                                <input type="hidden" id="veiculo-${val.acess_number}" value="${val.veiculo}" >
                                <input type="hidden" id="uso_o2-${val.acess_number}" value="${val.uso_o2}" >
                                <input type="hidden" id="vent_mec-${val.acess_number}" value="${val.vent_mec}" >
                                <input type="hidden" id="isolamento-${val.acess_number}" value="${val.isolamento}" >
                                <input type="hidden" id="tipo_isolamento-${val.acess_number}" value="${val.tipo_isolamento}" >
                                <input type="hidden" id="acomp_enf-${val.acess_number}" value="${val.acomp_enf}" >
                                <input type="hidden" id="acomp_familiar-${val.acess_number}" value="${val.acomp_familiar}" >
                                <input type="hidden" id="cor_classificacao-${val.acess_number}" value="${val.cor_classificacao}" >
                                <input type="hidden" id="tipo_risco-${val.acess_number}" value="${val.tipo_risco}" >
                                <input type="hidden" id="sala-${val.acess_number}" value="${val.sala}" >
                            </div>
                            <div class="d-flex justify-content-between">
                                <p class="m-0" id="agendamento-${val.acess_number}">Solicitado em ${val.data_movimentacao}</p>
                                <div class="aparecer" data-id="${val.acess_number}">
                                    <a style="background: transparent;" class="border-0 p-0 btn btn-icon btn-light" data-bs-toggle="modal" data-bs-target="#modalForm">•••</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `)
        });

        $("#SolicitadosCount").text(`${response.data.count.total_solicitatos}`)
        $("#AgendadosCount").text(`${response.data.count.total_agendados}`)
        $("#AtendimentoCount").text(`${response.data.count.total_atendimento}`)
        $("#PosExameCount").text(`${response.data.count.total_pos_exame}`)
        $("#FinalizadosCount").text(`${response.data.count.total_finalizados}`)

        //ABRE MODAL DE SOLICITAÇÃO DE TRANSPORTE
        $('body').on('click', '#solicitarTransporte', function(evento){
            //ABRE MODAL
            $('#modalTransporte').modal('show')
            let ID = $(this).data('id')
            let valor =  document.querySelector('#solicitar-update-'+ID)
            $("#formTransporte").submit(function (event) {
                event.preventDefault()
                umov(valor.value, formTransporte.sala.value)
                
            })
        })
        //ABRE MODAL DE SOLICITAÇÃO DE TRANSPORTE FINAL
        $('body').on('click', '#solicitarTransporteFinal', function(evento){
            //ABRE MODAL
            $('#modalTransporteFinal').modal('show')
            let ID = $(this).data('id')
            let valor =  document.querySelector('#solicitar-update-'+ID)
            $("#formTransporteFinal").submit(function (event) {
                event.preventDefault()
                umov(valor.value, formTransporte.sala.value)
                
            })
        })
        // //SOLICITAÇÃO DE TRANSPORTE DE FINALIZAÇÃO DE EXAME
        // $('body').on('click', '#solicitarTransporteFinalizar', function(evento){
        //     let ID = $(this).data('id')
        //     let valor =  document.querySelector('#solicitar-update-'+ID)
        //     umovFinalizar(valor)
        // })

        //MONTA SESSAO DO FILTRO DE SETOR DE EXAMES
        let selectSetorExame = response.data.filtro
        Object.entries(selectSetorExame).forEach(function(key, valor){
            addOptionSetorExame(key, valor)
        });function addOptionSetorExame(key, valor){
            let option = new Option(key[1],  key[0])
            let select = document.getElementById("selectSetorExame")
            select.add(option)
        }
        trelo.treloRodar();

        //VERIFICA SE VAI ATUALIZAR A PAGINA DE ACORDO COM OS CARDS
        var configuracaoDeRequisicao = {
            headers: {
                'Retry-After': 3000
            } 
        }
        const checaCardsAgendados = async ()=>{
            let agendado = response.data.count.total_agendados
            let atendimento = response.data.count.total_atendimento
            let posexame = response.data.count.total_pos_exame
            let finalizado = response.data.count.total_finalizados
            const buscarDados = setInterval(() => {
                axios.post(y+'/api/moinhos/atualiza/agendado', {
                    atendimento: atendimento,
                    finalizado: finalizado,
                    posexame: posexame,
                    agendado: agendado,
                    ...(acesso().setor ? {codigo_setor_exame: acesso().setor} : null)
                }, configuracaoDeRequisicao).then(()=>{
                    clearInterval(buscarDados)
                    checaCardsAgendados()
                }).catch(function(error) {
                    clearInterval(buscarDados)
                    if(error.response.status == 429){
                        return checaCardsAgendados()
                    }
                    window.location.reload()
                })            
            }, 3000);
        };checaCardsAgendados()

        //VERIFICA STATUS DA TAREFA
        const checaImagem = async ()=>{
            const buscarDados = setInterval(() => {
                Object.entries(response.data.umovCheca).forEach(([key, val]) => {
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
                            console.log(xmlDaTarefa)
                            if(statusTarefa == '30' && val.status_tarefa != '30' && tarefa != '30'){
                                
                                axios.post(y+'/api/moinhos/agendar/tarefa/'+acessNumber, {
                                    numero_tarefa: numeroTarefa,
                                    imagem_cadeira: 'cadeira-de-rodas-amarelo.png',
                                    status_tarefa: statusTarefa,
                                    origem: origem,
                                    sala: sala,
                                    cod_sala: cod_sala
                                })
                                .then(function (response) {
                                    window.location.reload()
                                })
                            }
                            // SE O STATUS DA TAREFA FOR EM CAMPOR E EXISTIR A TAG AGENTE
                            if (statusTarefa == '40' && (agenteTarefa != '' && agenteTarefa != null && agenteTarefa != undefined) && tarefa != '40') {
                                console.log(agenteTarefa)
                                axios.post(y+'/api/moinhos/agendar/tarefa/'+acessNumber, {
                                    numero_tarefa: numeroTarefa,
                                    imagem_cadeira: 'cadeira-de-rodas-azul.png',
                                    status_tarefa: statusTarefa,
                                    origem: origem,
                                    sala: sala,
                                    cod_sala: cod_sala
                                })
                                .then(function (response) {
                                    window.location.reload()
                                    // console.log(xmlDaTarefa)
                                })
                            }
                            // SE O STATUS DA TAREFA FOR IGUAL A FINALIZADO
                            if(statusTarefa == '50' && val.status_tarefa != '50' && tarefa != '50'){
                                axios.post(y+'/api/moinhos/agendar/tarefa/'+acessNumber, {
                                    numero_tarefa: numeroTarefa,
                                    imagem_cadeira: 'cadeira-de-rodas-verde.png',
                                    status_tarefa: statusTarefa,
                                    origem: origem,
                                    sala: sala,
                                    cod_sala: cod_sala
                                })
                                .then(function (response) {
                                    window.location.reload()
                                    // console.log(xmlDaTarefa)
                                })
                            }
                            //SE O STATUS DA TAREFA FOR IGUAL A CANCELADA
                            if(statusTarefa == '70' && val.status_tarefa != '70' && tarefa != '70'){
                                
                                axios.post(y+'/api/moinhos/agendar/tarefa/'+acessNumber, {
                                    numero_tarefa: numeroTarefa,
                                    imagem_cadeira: 'cadeira-de-rodas-preto.png',
                                    status_tarefa: statusTarefa,
                                    origem: origem,
                                    sala: sala,
                                    cod_sala: cod_sala
                                })
                                .then(function (response) {
                                    window.location.reload()
                                    // console.log(xmlDaTarefa)
                                })
                            }

                            checaImagem()
                        })
                    
                });
            }, 3000);
        };checaImagem()

        //VERICIFA SE EXISTE UM NOVO SOLICITADO
        const busca = async ()=>{
            let solicitadosVal = []
            const buscarDados = setInterval(() => {
                axios.get(y+'/api/moinhos/diferenca')
                .then((val)=>{
                    val.data.solicitados.forEach((val)=>{
                        solicitadosVal.push(val)
                    })
                    if(val.data.solicitados != ''){
                        addEvent(solicitadosVal, columnGrids[0])
                        clearInterval(buscarDados)
                        solicitadosVal = []
                        busca()
                    }
                }).catch((error)=>{
                    clearInterval(buscarDados)
                    solicitadosVal = []
                    busca()
                })
            }, 3000);
        }
        busca()
    })
    .catch(function(error) {
        // handle error
        window.location.reload()
    })
}

rodar()

