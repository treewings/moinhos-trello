import treloRodar from "./js/treloRodar.js";
import filtro from "./js/filtros/filtro.js";
import solicitacoes from "./js/funcoes/solicitacoes.js";
import { url } from "./js/url.js";
import socket from "./js/websocket.js";
import solicitadosSet from "./js/setInterval/solicitadosSet.js";
import { usuarioLogado } from "./js/funcoes/usuario.js";
import { token } from "./js/url.js";
import chat from "./js/funcoes/chat.js";

var x  = ''
var y = url()

socket.on('cardRender', function(msg) {
    rodar()
    console.log('deu bom')
 });

socket.on('tarefaUmov', function(dados) {
   var imagem = document.getElementById('image'+dados.number)
   imagem.src = 'images/Icones/'+dados.imagem_cadeira
   $('#nome-sala-'+dados.number).text(dados.sala)
    console.log(dados)
});

function acesso(){
    const urlParams = new URLSearchParams(window.location.search);
    var filtro = []
    if(urlParams.get('setor')){
        let SetorURL = urlParams.get('setor')
        let cod_tumografiaComputadorizada = ''
        let cod_raioX = ''
        let cod_ecografiaGeral = ''
        let cod_ressonanciaMagnetica = ''
        let cod_centroDaMulher = ''
        let cod_radiologiaPedriatrica = ''
        let cod_igEcografiaGeral = ''

        let CodigosSetorURL = SetorURL.split(',')
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
        filtro = {
            ...( cod_tumografiaComputadorizada == 19 ? {cod_tumografiaComputadorizada: cod_tumografiaComputadorizada} : null ),
            ...( cod_raioX == 20 ? {cod_raioX: cod_raioX} : null ),
            ...( cod_ecografiaGeral == 23 ? {cod_ecografiaGeral: cod_ecografiaGeral} : null ),
            ...( cod_ressonanciaMagnetica == 24 ? {cod_ressonanciaMagnetica: cod_ressonanciaMagnetica} : null ),
            ...( cod_centroDaMulher == 26 ? {cod_centroDaMulher: cod_centroDaMulher} : null ),
            ...( cod_radiologiaPedriatrica == 30 ? {cod_radiologiaPedriatrica: cod_radiologiaPedriatrica} : null ),
            ...( cod_igEcografiaGeral == 34 ? {cod_igEcografiaGeral: cod_igEcografiaGeral} : null )
        }
    }
    if(urlParams.get('sala')){
        filtro = {cod_sala: urlParams.get('sala')}
    }
    return {filtro}
}

const config = {
    headers: { Authorization: `Bearer ${token()}` }
};

export default function rodar(){
    acesso().filtro != '' ? x = (axios.post(y+'/api/moinhos/consulta', acesso().filtro, config) ) : x = (axios.get(y+'/api/moinhos', config))
    x.then(function(response) {
        $('#modalLoading').modal('hide')
        $('#Solicitados').empty();
        //DEFINE O CARD DA COLUNA DE SOLICITADOS
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
            if (val.cor_classificacao == null || val.cor_classificacao == 'VERDE') {corClassificacao = 'f9f3f3';}
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
            //HTML DO CARD DE SOLICITADOS
            $('#Solicitados').append(`
            <div class="board-item m-0 mb-2 border rounded movercard" data-id="${val.acess_number}" id="${val.acess_number}" >
                <div class="board-item-content p-0" style="min-height: 128px;">
                    <div class="kanban-item-title p-1 rounded-2" style="background: #`+corClassificacao+`; width: 100%; height: 40px;">
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
                                <a class="rounded-3 d-flex px-1 pb-0 text-dark align-items-center" style="background-color: #ecebeb; cursor: pointer; display:flex; align-items: cente; font-size:smaller">
                                    <div style="font-size: 13px;" class="m-0 d-flex align-items-center"  id="img_icone-${val.acess_number}">
            
                                    </div>
                                    <div class="">${val.data_diferenca}</div>
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
                                <input type="hidden" id="finalizado-${val.acess_number}" value='' >
                                <input type="hidden" id="atendimento-${val.acess_number}" value="${val.atendimento}" >
                                <input type="hidden" id="tipo_atendimento-${val.acess_number}" value="${val.tipo_atendimento}" >
                                <input type="hidden" id="prontuario-${val.acess_number}" value="${val.prontuario}" >
                                <input type="hidden" id="paciente-${val.acess_number}" value="${val.paciente}" >
                                <input type="hidden" id="data_dasc-${val.acess_number}" value="${val.data_nasc}" >
                                <input type="hidden" id="nome_mae-${val.acess_number}" value="${val.nome_mae}" >
                                <input type="hidden" id="prestador-${val.acess_number}" value="${val.prestador}" >
                                <input type="hidden" id="codigo_ui-${val.acess_number}" value="${val.codigo_ui}" >
                                <input type="hidden" id="unidade_internacao-${val.acess_number}" value="${val.unidade_internacao}" >
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
                                <input type="hidden" id="observacao-${val.acess_number}" value="${val.observacao}" >
                                <input type="hidden" id="observacao_select-${val.acess_number}" value="${val.observacao_select}" >
                            </div>
                            <div class="d-flex justify-content-between">
                                <p class="m-0 text-dark" id="agendamento-${val.acess_number}">Solicitado em `+dataHora+`</p>
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
        $('#Agendados').empty();
        //DEFINE O CARD DA COLUNA DE AGENDADOS
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
            if (val.cor_classificacao == null || val.cor_classificacao == 'VERDE') {corClassificacao = 'f9f3f3';}
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
            //CONSIÇÃO CARD AGENDADOS
            let condicao = val.numero_tarefa == null ? 'solicitarTransporte' : ''
            //NOME DA SALA
            let descricaoSala = ''
            if (val.sala == null) {
                descricaoSala = ''
            }else{
                descricaoSala = val.sala
            }
            //HTML DO CARD DE AGENDADOS
            $('#Agendados').append(`
            <div class="board-item m-0  mb-2 border rounded"  data-id="${val.acess_number}" id="${val.acess_number}">
                <div class="board-item-content p-0" style="min-height: 128px;">
                    <div class="kanban-item-title p-1 rounded-2" style="background: #`+corClassificacao+`; width: 100%; height: 40px;">
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
                            <a class="rounded-3 d-flex px-1 text-dark align-items-center" id="`+condicao+`" data-id="${val.acess_number}" style="background-color: #ecebeb; cursor: pointer; display:flex; align-items: cente; padding-top: 1px; padding-bottom: 1px; font-size:smaller">
                                <div style="font-size: 13px;" class="m-0 d-flex align-items-center" id="img_icone-${val.acess_number}">
                                    <img style="height: 13px; margin-right: 5px; margin-left: 4px;" id="image${val.acess_number}" src="images/Icones/${val.imagem_cadeira}">
                                </div>
                                <div class="">${val.data_diferenca}</div>
                            </a>
                        </div>
                        <div>
                            <p class="mb-0">${val.descricao_exame}</p>
                            <p class="mb-0" id="nome-sala-${val.acess_number}">`+descricaoSala+`</p>
                            <input type="hidden" id="solicitar-update-${val.acess_number}" value='${JSON.stringify(val)}'>
                            <input type="hidden" id="numero_tarefa-${val.acess_number}" value='${val.numero_tarefa}'>
                            <input type="hidden" id="status_tarefa-${val.acess_number}" value='${val.status_tarefa}'>
                            <input type="hidden" id="solicitado-${val.acess_number}" value='solicitado'>
                            <input type="hidden" id="agendado-${val.acess_number}" value='agendado'>
                            <input type="hidden" id="atendimento-${val.acess_number}" value=''>
                            <input type="hidden" id="posexame-${val.acess_number}" value=''>
                            <input type="hidden" id="finalizado-${val.acess_number}" value=''>
                            <input type="hidden" id="atendimento-${val.acess_number}" value="${val.atendimento}">
                            <input type="hidden" id="tipo_atendimento-${val.acess_number}" value="${val.tipo_atendimento}">
                            <input type="hidden" id="prontuario-${val.acess_number}" value="${val.prontuario}">
                            <input type="hidden" id="paciente-${val.acess_number}" value="${val.paciente}">
                            <input type="hidden" id="data_dasc-${val.acess_number}" value="${val.data_nasc}">
                            <input type="hidden" id="nome_mae-${val.acess_number}" value="${val.nome_mae}">
                            <input type="hidden" id="prestador-${val.acess_number}" value="${val.prestador}">
                            <input type="hidden" id="codigo_ui-${val.acess_number}" value="${val.codigo_ui}">
                            <input type="hidden" id="unidade_internacao-${val.acess_number}" value="${val.unidade_internacao}">
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
                            <input type="hidden" id="observacao-${val.acess_number}" value="${val.observacao}" >
                            <input type="hidden" id="observacao_select-${val.acess_number}" value="${val.observacao_select}" >
                            <input type="hidden" id="motivo_umov-${val.acess_number}" value="${val.motivo_umov}" >
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="m-0 text-primary" id="agendamento-${val.acess_number}">Agendado para ${val.data_agendamento} ${val.hora_agendamento}</p>
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
        $('#Atendimento').empty();
        //
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
            if (val.cor_classificacao == null || val.cor_classificacao == 'VERDE') {corClassificacao = 'f9f3f3';}
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
            //NOME DA SALA
            let descricaoSala = ''
            if (val.sala == null) {
                descricaoSala = ''
            }else{
                descricaoSala = val.sala
            }

            $('#Atendimento').append(`
            <div class="board-item m-0 mb-2 border rounded movercard" data-id="${val.acess_number}">
                <div class="board-item-content p-0" style="min-height: 128px;">
                    <div class="kanban-item-title p-1 rounded-2" style="background: #`+corClassificacao+`; width: 100%; height: 40px;">
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
                                <a class="rounded-3 d-flex px-1 pb-0 text-dark align-items-center" style="background-color: #ecebeb; cursor: pointer; display:flex; align-items: cente; font-size:smaller">
                                    <div style="font-size: 13px;" class="m-0 d-flex align-items-center"  id="img_icone-${val.acess_number}">
                                        <em class="icon ni ni-activity-round-fill"></em>
                                    </div>
                                    <div class="">${val.data_diferenca}</div>
                                </a>
                            </div>
                            <div>
                                <p class="mb-0">${val.descricao_exame}</p>
                                <p class="mb-0">`+descricaoSala+`</p>
                                <input type="hidden" id="solicitar-update-${val.acess_number}" value='${JSON.stringify(val)}' >
                                <input type="hidden" id="numero_tarefa-${val.acess_number}" value='${val.numero_tarefa}'>
                                <input type="hidden" id="solicitado-${val.acess_number}" value='solicitado' >
                                <input type="hidden" id="agendado-${val.acess_number}" value='agendado' >
                                <input type="hidden" id="atendimento-${val.acess_number}" value='atendimento' >
                                <input type="hidden" id="posexame-${val.acess_number}" value='' >
                                <input type="hidden" id="finalizado-${val.acess_number}" value='' >
                                <input type="hidden" id="atendimento-${val.acess_number}" value="${val.atendimento}" >
                                <input type="hidden" id="tipo_atendimento-${val.acess_number}" value="${val.tipo_atendimento}" >
                                <input type="hidden" id="prontuario-${val.acess_number}" value="${val.prontuario}" >
                                <input type="hidden" id="paciente-${val.acess_number}" value="${val.paciente}" >
                                <input type="hidden" id="data_dasc-${val.acess_number}" value="${val.data_nasc}" >
                                <input type="hidden" id="nome_mae-${val.acess_number}" value="${val.nome_mae}" >
                                <input type="hidden" id="prestador-${val.acess_number}" value="${val.prestador}" >
                                <input type="hidden" id="codigo_ui-${val.acess_number}" value="${val.codigo_ui}" >
                                <input type="hidden" id="unidade_internacao-${val.acess_number}" value="${val.unidade_internacao}" >
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
                                <input type="hidden" id="observacao-${val.acess_number}" value="${val.observacao}" >
                                <input type="hidden" id="observacao_select-${val.acess_number}" value="${val.observacao_select}" >
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
        $('#posExame').empty();
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
            if (val.cor_classificacao == null || val.cor_classificacao == 'VERDE') {corClassificacao = 'f9f3f3';}
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
            //CONSIÇÃO CARD AGENDADOS
            let condicao = val.numero_tarefa == null ? 'solicitarTransporteFinal' : ''
            //NOME DA SALA
            let descricaoSala = ''
            if (val.sala == null) {
                descricaoSala = ''
            }else{
                descricaoSala = val.sala
            }

            $('#posExame').append(`
            <div class="board-item m-0  mb-2 border rounded"  data-id="${val.acess_number}" id="${val.acess_number}">
                <div class="board-item-content p-0" style="min-height: 128px;">
                    <div class="kanban-item-title p-1 rounded-2" style="background: #`+corClassificacao+`; width: 100%; height: 40px;">
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
                            <a class="rounded-3 d-flex px-1 text-dark align-items-center" id="`+condicao+`" data-id="${val.acess_number}" style="background-color: #ecebeb; cursor: pointer; display:flex; align-items: cente; padding-top: 1px; padding-bottom: 1px; font-size:smaller">
                                    <div style="font-size: 13px;" class="m-0 d-flex align-items-center" id="img_icone-${val.acess_number}">
                                        <img style="height: 13px; margin-right: 5px; margin-left: 4px;" id="image${val.acess_number}" src="images/Icones/${val.imagem_cadeira}">
                                    </div>
                                <div class="">${val.data_diferenca}</div>
                            </a>
                        </div>
                        <div>
                            <p class="mb-0">${val.descricao_exame}</p>
                            <p class="mb-0">`+descricaoSala+`</p>
                            <input type="hidden" id="solicitar-update-${val.acess_number}" value='${JSON.stringify(val)}'>
                            <input type="hidden" id="numero_tarefa-${val.acess_number}" value='${val.numero_tarefa}'>
                            <input type="hidden" id="imagem_cadeira-${val.acess_number}" value='${val.imagem_cadeira}'>
                            <input type="hidden" id="solicitado-${val.acess_number}" value='solicitado'>
                            <input type="hidden" id="agendado-${val.acess_number}" value='agendado'>
                            <input type="hidden" id="atendimento-${val.acess_number}" value='atendimento'>
                            <input type="hidden" id="posexame-${val.acess_number}" value='posexame'>
                            <input type="hidden" id="finalizado-${val.acess_number}" value=''>
                            <input type="hidden" id="atendimento-${val.acess_number}" value="${val.atendimento}">
                            <input type="hidden" id="tipo_atendimento-${val.acess_number}" value="${val.tipo_atendimento}">
                            <input type="hidden" id="prontuario-${val.acess_number}" value="${val.prontuario}">
                            <input type="hidden" id="paciente-${val.acess_number}" value="${val.paciente}">
                            <input type="hidden" id="data_dasc-${val.acess_number}" value="${val.data_nasc}">
                            <input type="hidden" id="nome_mae-${val.acess_number}" value="${val.nome_mae}">
                            <input type="hidden" id="prestador-${val.acess_number}" value="${val.prestador}">
                            <input type="hidden" id="codigo_ui-${val.acess_number}" value="${val.codigo_ui}">
                            <input type="hidden" id="unidade_internacao-${val.acess_number}" value="${val.unidade_internacao}">
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
                            <input type="hidden" id="observacao-${val.acess_number}" value="${val.observacao}" >
                            <input type="hidden" id="observacao_select-${val.acess_number}" value="${val.observacao_select}" >
                            <input type="hidden" id="motivo_umov-${val.acess_number}" value="${val.motivo_umov}" >
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
        $('#finalizados').empty();
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
            if (val.cor_classificacao == null || val.cor_classificacao == 'VERDE') {corClassificacao = 'f9f3f3';}
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
            <div class="board-item m-0 mb-2 border rounded movercard" data-id="${val.acess_number}">
                <div class="board-item-content p-0" style="min-height: 128px;">
                    <div class="kanban-item-title p-1 rounded-2" style="background: #`+corClassificacao+`; width: 100%; height: 40px;">
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
                            </a>
                            </div>
                            <div>
                                <p class="mb-0">${val.descricao_exame}</p>
                                <p style="display: none;" id="hora-agendamento-${val.acess_number}"></p>
                                <input type="hidden" id="solicitar-update-${val.acess_number}" value='${JSON.stringify(val)}' >
                                <input type="hidden" id="numero_tarefa-${val.acess_number}" value='${val.numero_tarefa}'>
                                <input type="hidden" id="solicitado-${val.acess_number}" value='solicitado'>
                                <input type="hidden" id="agendado-${val.acess_number}" value='agendado' >
                                <input type="hidden" id="atendimento-${val.acess_number}" value='atendimento' >
                                <input type="hidden" id="posexame-${val.acess_number}" value='posexame' >
                                <input type="hidden" id="finalizado-${val.acess_number}" value='finalizado' >
                                <input type="hidden" id="atendimento-${val.acess_number}" value="${val.atendimento}" >
                                <input type="hidden" id="tipo_atendimento-${val.acess_number}" value="${val.tipo_atendimento}" >
                                <input type="hidden" id="prontuario-${val.acess_number}" value="${val.prontuario}" >
                                <input type="hidden" id="paciente-${val.acess_number}" value="${val.paciente}" >
                                <input type="hidden" id="data_dasc-${val.acess_number}" value="${val.data_nasc}" >
                                <input type="hidden" id="nome_mae-${val.acess_number}" value="${val.nome_mae}" >
                                <input type="hidden" id="prestador-${val.acess_number}" value="${val.prestador}" >
                                <input type="hidden" id="codigo_ui-${val.acess_number}" value="${val.codigo_ui}" >
                                <input type="hidden" id="unidade_internacao-${val.acess_number}" value="${val.unidade_internacao}" >
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
                                <input type="hidden" id="observacao-${val.acess_number}" value="${val.observacao}" >
                                <input type="hidden" id="observacao_select-${val.acess_number}" value="${val.observacao_select}" >
                            </div>
                            <div class="d-flex justify-content-between">
                                <p class="m-0 text-dark" id="agendamento-${val.acess_number}">Finalizado em em ${val.data_movimentacao}</p>
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

        treloRodar()
        
    })
    .catch(function(error) {
        // handle error
        if(error.response.data.status == 'Token invalido.'){
            $('#modalLoading').modal('hide')
            $('#modalAlgoToken').modal('show')
            return
        }
        if(error.response.data.status == 'Token expirado'){
            $('#modalLoading').modal('hide')
            $('#modalAlgoTokenExpirado').modal('show')
            return
        }
        if(error.response.data.status == 'Token não existe.'){
            $('#modalLoading').modal('hide')
            $('#modalAlgoTokenSem').modal('show')
            return
        }
        window.location.reload()
    })
}

// AGENDADOS COMEÇA AQUI A CHECAGEM DAS SOLICITACÕES

const firstRequest = async () => {
    // Faz a primeira requisição e retorna o status
    const response = await axios.get(url()+'/api/moinhos/checaumov/agendados', config);
    return response.data.umovCheca;
  };
  
  const secondRequest = async (statusFromFirstRequest) => {
    var timerId;
    if(statusFromFirstRequest != null){
        statusFromFirstRequest.forEach( async (val)=>{

            console.log(val)
            const response = await axios.get(`https://api.umov.me/CenterWeb/api/26347e33d181559023ab7b32150ca3bfbc572e/schedule/${val.numero_tarefa}.xml`);
            let xmlDaTarefa = document.createElement('div')
            xmlDaTarefa.innerHTML = response.data
            let statusTarefa = xmlDaTarefa.getElementsByTagName('schedule')[0].getElementsByTagName('situation')[0].getElementsByTagName('id')[0].innerText
            let realizou = xmlDaTarefa.getElementsByTagName('schedule')[0].getElementsByTagName('customFields')[0].getElementsByTagName('retro__realizou')[0].innerText
            let motivo = xmlDaTarefa.getElementsByTagName('schedule')[0].getElementsByTagName('customFields')[0].getElementsByTagName('retro__motivo__realizacao')[0].innerText
            if (statusTarefa === val.status_tarefa) {
    
              console.log("O status da primeira requisição é igual ao status da segunda requisição");
              clearTimeout(timerId);
              timerId = setTimeout(() => {
                run()
              }, 10000);
              
            } else {
    
                console.log("O status da primeira requisição é diferente do status da segunda requisição");
                if(statusTarefa == 50){
                    if(realizou == 'sim'){
                        axios.post(y+'/api/moinhos/atendimento', {
                            acess_number: val.acess_number,
                            origem: 'agendado',
                            user: usuarioLogado()
                        }, config)
                        .then(function (response) {
            
                            console.log('enviou direto pra atendimentos')
                            socket.emit('cardRender', 'foi');
                            if(statusFromFirstRequest.length == 1){
                                clearTimeout(timerId);
                                timerId = setTimeout(() => {
                                  run()
                                }, 10000);
                            }
                        })
                    }else{
                        if(motivo == 'cad_mot_pac_saiu_so' || motivo == 'cad_mot_unidade_fez'){
                            axios.post(y+'/api/moinhos/atendimento', {
                                acess_number: val.acess_number,
                                origem: 'agendado',
                                user: usuarioLogado()
                            }, config)
                            .then(function (response) {
                
                                console.log('enviou direto pra atendimento pq saiu só')
                                socket.emit('cardRender', 'foi');
                                if(statusFromFirstRequest.length == 1){
                                    clearTimeout(timerId);
                                    timerId = setTimeout(() => {
                                      run()
                                    }, 10000);
                                }
                            })
                        }else{
                            axios.post(y+'/api/moinhos/checaumov/limpar-dados-agendados', {
                                acess_number: val.acess_number,
                                motivo: motivo
                            }, config)
                            .then(function (response) {
                
                                console.log('limpou dados')
                                socket.emit('cardRender', 'foi');
                                if(statusFromFirstRequest.length == 1){
                                    clearTimeout(timerId);
                                    timerId = setTimeout(() => {
                                      run()
                                    }, 10000);
                                }
                            })
                        }
                    }
                    
                    return    
                }

                if(statusTarefa == 70){

                    axios.post(y+'/api/moinhos/checaumov/limpar-dados-agendados', {
                        acess_number: val.acess_number,
                        motivo: motivo
                    }, config)
                    .then(function (response) {
        
                        console.log('limpou dados 70')
                        socket.emit('cardRender', 'foi');
                        if(statusFromFirstRequest.length == 1){
                            clearTimeout(timerId);
                            timerId = setTimeout(() => {
                              run()
                            }, 10000);
                        }
                    })

                    return
                }
               
                axios.post(url()+'/api/moinhos/agendar/tarefa/'+val.acess_number, {
                    numero_tarefa: val.numero_tarefa,
                    imagem_cadeira: 'cadeira-de-rodas-azul.png',
                    status_tarefa: statusTarefa,
                    origem: 'agendado',
                }, config).then(function (response) {
                    socket.emit('tarefaUmov', {number: val.acess_number,  imagem_cadeira: 'cadeira-de-rodas-azul.png'});
                    if(statusFromFirstRequest.length == 1){
                        clearTimeout(timerId);
                        timerId = setTimeout(() => {
                          run()
                        }, 10000);
                    }
                    return
                    // console.log(xmlDaTarefa)
                })
    
            }
        })
    }else{
        console.log("procurando dados ...");
              clearTimeout(timerId);
              timerId = setTimeout(() => {
                run()
              }, 10000);
    }
    
  };
  
  const run = async () => {
    const statusFromFirstRequestPos = await firstRequest();
    await secondRequest(statusFromFirstRequestPos);
  };
  
  run();
  
  
// POS EXAME COMEÇA AQUI A CHECAGEM DAS SOLICITACÕES
  const firstRequestPos = async () => {
    // Faz a primeira requisição e retorna o status
    const response = await axios.get(url()+'/api/moinhos/checaumov/posexame', config);
    return response.data.umovCheca;
  };
  
  const secondRequestPos = async (statusFromFirstRequest) => {
    var timerId;
    if(statusFromFirstRequest != null){
        statusFromFirstRequest.forEach( async (val)=>{

            console.log(val)
            const response = await axios.get(`https://api.umov.me/CenterWeb/api/26347e33d181559023ab7b32150ca3bfbc572e/schedule/${val.numero_tarefa}.xml`);
            let xmlDaTarefa = document.createElement('div')
            xmlDaTarefa.innerHTML = response.data
            let statusTarefa = xmlDaTarefa.getElementsByTagName('schedule')[0].getElementsByTagName('situation')[0].getElementsByTagName('id')[0].innerText
            let realizou = xmlDaTarefa.getElementsByTagName('schedule')[0].getElementsByTagName('customFields')[0].getElementsByTagName('retro__realizou')[0].innerText
            let motivo = xmlDaTarefa.getElementsByTagName('schedule')[0].getElementsByTagName('customFields')[0].getElementsByTagName('retro__motivo__realizacao')[0].innerText
            if (statusTarefa === val.status_tarefa) {
    
              console.log("O status da primeira requisição é igual ao status da segunda requisição pos");
              clearTimeout(timerId);
              timerId = setTimeout(() => {
                runPos()
              }, 10000);
              
            } else {
    
                console.log("O status da primeira requisição é diferente do status da segunda requisição pos");
                if(statusTarefa == 50){
                    if(realizou == 'sim'){
                        axios.post(y+'/api/moinhos/finalizar', {
                            acess_number: val.acess_number,
                            origem: 'posexame',
                            user: usuarioLogado()
                        }, config)
                        .then(function (response) {
            
                            console.log('enviou direto pra atendimentos')
                            socket.emit('cardRender', 'foi');
                            if(statusFromFirstRequest.length == 1){
                                clearTimeout(timerId);
                                timerId = setTimeout(() => {
                                  runPos()
                                }, 10000);
                            }
                        })
                    }else{
                        if(motivo == 'cad_mot_pac_saiu_so' || motivo == 'cad_mot_unidade_fez'){
                            axios.post(y+'/api/moinhos/finalizar', {
                                acess_number: val.acess_number,
                                origem: 'posexame',
                                user: usuarioLogado()
                            }, config)
                            .then(function (response) {
                
                                console.log('enviou direto pra atendimento pq saiu só pos')
                                socket.emit('cardRender', 'foi');
                                if(statusFromFirstRequest.length == 1){
                                    clearTimeout(timerId);
                                    timerId = setTimeout(() => {
                                      runPos()
                                    }, 10000);
                                }
                            })
                        }else{
                            axios.post(y+'/api/moinhos/checaumov/limpar-dados-posexame', {
                                acess_number: val.acess_number,
                                motivo: motivo
                            }, config)
                            .then(function (response) {
                
                                console.log('limpou dados')
                                socket.emit('cardRender', 'foi');
                                if(statusFromFirstRequest.length == 1){
                                    clearTimeout(timerId);
                                    timerId = setTimeout(() => {
                                      runPos()
                                    }, 10000);
                                }
                            })
                        }
                    }
                    
                    return    
                }

                if(statusTarefa == 70){

                    axios.post(y+'/api/moinhos/checaumov/limpar-dados-posexame', {
                        acess_number: val.acess_number,
                        motivo: motivo
                    }, config)
                    .then(function (response) {
        
                        console.log('limpou dados 70 pos')
                        socket.emit('cardRender', 'foi');
                        if(statusFromFirstRequest.length == 1){
                            clearTimeout(timerId);
                            timerId = setTimeout(() => {
                              runPos()
                            }, 10000);
                        }
                    })

                    return
                }
               
                axios.post(url()+'/api/moinhos/agendar/tarefa/'+val.acess_number, {
                    numero_tarefa: val.numero_tarefa,
                    imagem_cadeira: 'cadeira-de-rodas-azul.png',
                    status_tarefa: statusTarefa,
                    origem: 'posexame',
                }, config).then(function (response) {
                    socket.emit('tarefaUmov', {number: val.acess_number,  imagem_cadeira: 'cadeira-de-rodas-azul.png'});
                    if(statusFromFirstRequest.length == 1){
                        clearTimeout(timerId);
                        timerId = setTimeout(() => {
                          runPos()
                        }, 10000);
                    }
                    return
                    // console.log(xmlDaTarefa)
                })
    
            }
        })
    }else{
        console.log("procurando dados em posexame ...");
              clearTimeout(timerId);
              timerId = setTimeout(() => {
                runPos()
              }, 10000);
    }
    
  };
  
  const runPos = async () => {
    const statusFromFirstRequest = await firstRequestPos();
    await secondRequestPos(statusFromFirstRequest);
  };
  
  runPos();          
 
solicitacoes()
rodar()
// chat()
