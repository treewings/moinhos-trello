export function cardsTrelo(val){
    //DEFINE A COR DO CARD
    let corClassificacao = '';
    if (val.cor_classificacao == null) {corClassificacao = 'f9f3f3';}
    if (val.cor_classificacao == 'AMARELO') {corClassificacao = 'f6f5cc';}
    if (val.cor_classificacao == 'LARANJA') {corClassificacao = 'ffe090';}
    if (val.cor_classificacao == 'VERMELHO') {corClassificacao = 'f5cbc1';}
    //DEFINE OS ICONES NO CABEÇALHO DO CARD
    let isolamento = '';
    if(val.isolamento != 'Sim') {isolamento = '';}
    if(val.isolamento == 'Sim') {isolamento = '<em class="icon ni ni-alert-fill"></em>';}
    let motivoExame = '';
    if(val.motivo_exame != 'URGENTE') {motivoExame = '';}
    if(val.motivo_exame == 'URGENTE') {motivoExame = '<em class="icon ni ni-alert-circle-fill"></em>';}
    //FORMATA A DATA E HORA
    let dataHora = '';
    let formartarHoraData = val.hora_pedido.split(" ")
    let formartarData = formartarHoraData[0].split("-")
    let formatarHora = formartarHoraData[1].split(":")
    dataHora = formartarData[0]+'/'+formartarData[1]+'/'+formartarData[2]+' '+formatarHora[0]+':'+formatarHora[1]
    
    return `
    <div id="${val.acess_number}" class="board-item m-0 mt-2 border rounded movercard" data-id="${val.acess_number}">
        <div class="board-item-content p-0">
            <div class="kanban-item-title p-2 rounded-2" style="background: #`+corClassificacao+`; width: 279.84px">
                <h6 class="title">${val.paciente}</h6>
                <h6 class="d-flex">`+motivoExame+isolamento+`</h6>
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
                        <input type="hidden" id="solicitado-${val.acess_number}" value='solicitado' >
                        <input type="hidden" id="agendado-${val.acess_number}" value='' >
                        <input type="hidden" id="atendimento-${val.acess_number}" value='' >
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
    `   
}

function generateBoard(index) {
    var itemElem = document.createElement('div');
    itemElem.innerHTML = cardsTrelo(index)
    
      return itemElem.children[0];
    }
    
    export function addEvent(val, colum) {
      let divs = []
      val.forEach((v)=>{
            var item = generateBoard(v);
            divs.push(item)
    })
    colum.add([...divs]);
}