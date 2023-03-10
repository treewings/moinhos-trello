import { url } from "./url.js"
export function umov(val, destino){
    var y = url()
    let dados = JSON.parse(val)
    let destinoJunto = destino.split('_')
    var nome_destino = destinoJunto[1]
    let Destino = destinoJunto[0]
    let mnt_smt_cod = ''
    if (dados.veiculo == 'CAMA') {
        mnt_smt_cod = 'atv_trp_cama'
    }if (dados.veiculo == 'CADEIRA') {
        mnt_smt_cod = 'atv_trp_cadeira'
    }if (dados.veiculo == 'BERCO') {
        mnt_smt_cod = 'atv_trp_berco'
    }if (dados.veiculo == 'INCUBADORA') {
        mnt_smt_cod = 'atv_trp_incubadora'
    }if (dados.veiculo == 'MACA') {
        mnt_smt_cod = 'atv_trp_maca'
    }
    if(dados.acom_familiar == null || dados.acom_familiar == undefined){
        dados.acom_familiar = ''
    }
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
    let mnt_smt_nomeA = `TRP - Transporte de Paciente com `+dados.veiculo+` DESTINO: `+nome_destino+` Pac: `+dados.paciente+`.`
    let corpo = `
    <schedule>
    <image>
            <id>6278447</id>
            <description>normal</description>
            <mediaType>1</mediaType>
            <publicUrl>https://louvre.umov.me/media/show/6278447?1591042617427</publicUrl>
            <status>2</status>
        </image>
        <serviceLocal>
            <alternativeIdentifier>`+Destino+`</alternativeIdentifier>
        </serviceLocal>
        <team>
            <alternativeIdentifier>eqp_transporte</alternativeIdentifier>
        </team>
        <activitiesOrigin>4</activitiesOrigin>
        <teamExecution >1</teamExecution >
        <date>`+dataAtualFormatada()+`</date>
        <hour>`+horaAtualFormatada()+`</hour>
        <activityRelationship>
            <activity>
                <alternativeIdentifier>`+mnt_smt_cod+`</alternativeIdentifier>
            </activity>
            <activity>
                <alternativeIdentifier>atv_trp_aceitar</alternativeIdentifier>
            </activity>
            <activity>
                <alternativeIdentifier>atv_trp_iniciar</alternativeIdentifier>
            </activity>
        </activityRelationship>
        <observation>`+mnt_smt_nomeA+`</observation>
        <priority>2</priority>
        <customFields>
            <uni.ds_unid_destino>`+nome_destino+`</uni.ds_unid_destino>
            <uni.ds.unid_local_destino></uni.ds.unid_local_destino>
            <uni.cd_unid_destino>`+Destino+`</uni.cd_unid_destino>
            <uni.cd.unid_local_destino></uni.cd.unid_local_destino>
            <pac.cd_paciente>`+dados.prontuario+`</pac.cd_paciente>
            <pac.nm_paciente>`+dados.paciente+`</pac.nm_paciente>
            <pac.sn_vip></pac.sn_vip>
            <con.cd_convenio></con.cd_convenio>
            <con.nm_convenio></con.nm_convenio>
            <usr.cd_login></usr.cd_login>
            <tarefa.desc>teste</tarefa.desc>
            <pac.cd_atendimento>`+dados.atendimento+`</pac.cd_atendimento>
            <pac.dt_nascimento>`+dados.data_nasc+`</pac.dt_nascimento>
            <tarefa.classif>`+dados.isolamento+`</tarefa.classif>
            <cmp.nm_solic>`+dados.tipo_isolamento+`</cmp.nm_solic>
            <tsk_o2>`+dados.uso_o2+`</tsk_o2>
            <tsk_checkout></tsk_checkout>
            <tsk_carrinho></tsk_carrinho>
            <tsk_higienizado></tsk_higienizado>
            <tsk_completo></tsk_completo>
            <tsk_ramal>7070</tsk_ramal>
            <tsk_nm_classificacao></tsk_nm_classificacao>
            <tsk_cd_classificacao></tsk_cd_classificacao>
            <tsk_enfermeiro>`+dados.acom_enf+`</tsk_enfermeiro>
            <tsk_familiar>`+dados.acom_familiar+`</tsk_familiar>
            <tsk_prioridade>2</tsk_prioridade>
            <cad_solic_concatenados></cad_solic_concatenados>
            <tsk.ventilacao>`+dados.vent_mec+`</tsk.ventilacao>
            <tsk.isolamento>`+dados.uso_o2+`</tsk.isolamento>
            <tsk.motivo_urgente></tsk.motivo_urgente>
            <tsk.tipo_isolamento>`+dados.tipo_isolamento+`</tsk.tipo_isolamento>
            <cmp_transporte_equipamento></cmp_transporte_equipamento>
            <cd_leito>`+dados.codigo_leito+`</cd_leito>
            <nm_leito>`+dados.leito+`</nm_leito>
            <tsk.o2_litros></tsk.o2_litros>
        </customFields>
    </schedule>
    `
    let url_data = "https://api.umov.me/CenterWeb/api/26347e33d181559023ab7b32150ca3bfbc572e/schedule.xml";             
    var config = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    };
    console.log(corpo)
    axios.post(url_data, {
        data: corpo
    }, config).then((val)=>{
        let xmlDeCriacao = document.createElement('div')
        xmlDeCriacao.innerHTML = val.data
        let numeroTarefa = xmlDeCriacao.children[0].children[1].innerText
        console.log(numeroTarefa)
        let linkXmlTarefa = 'https://api.umov.me/CenterWeb/api/26347e33d181559023ab7b32150ca3bfbc572e/schedule/'+numeroTarefa+'.xml'
        axios.get(linkXmlTarefa).then((val)=>{
            let xmlDaTarefa = document.createElement('div')
            xmlDaTarefa.innerHTML = val.data
            // console.log(xmlDaTarefa)
            let atividadesUm = xmlDaTarefa.children[0].children[15].children[0].innerHTML
            // let atividadesDois = xmlDaTarefa.children[0].children[21].children[0].children[0].id
            // let atividadesTres = xmlDaTarefa.children[0].children[21].children[0].children[0].children[0].id
            console.log(atividadesUm)
            // console.log(atividadesDois)
            // console.log(atividadesTres)
            axios.post(y+'/api/moinhos/agendar/tarefa/'+dados.acess_number, {
                numero_tarefa: numeroTarefa,
                imagem_cadeira: 'cadeira-de-rodas-amarelo.png',
                sala: nome_destino,
                cod_sala: Destino,
                origem: 'agendado'
            })
            .then(function (response) {
                $('#modalTransporte').modal('hide')
                window.location.reload()
            })
            .catch(function (error) {
                $('#modalTransporte').modal('hide')
                $('#modalAlgoErrado').modal('show')
                console.log(error);
            });
            // /api/moinhos/agendar/tarefa/{acess_number}
        })
    }).catch(function(error) {
        $('#modalTransporte').modal('hide')
        $('#modalAlgoErrado').modal('show')
        console.log(error);
    }) 
}

export function umovFinalizar(val, destino){
    var y = url()
    let dados = JSON.parse(val)
    let destinoJunto = destino.split('_')
    let nome_destino = destinoJunto[1]
    let Destino = destinoJunto[0]
    let mnt_smt_cod = ''
    if (dados.veiculo == 'CAMA') {
        mnt_smt_cod = 'atv_trp_cama'
    }if (dados.veiculo == 'CADEIRA') {
        mnt_smt_cod = 'atv_trp_cadeira'
    }if (dados.veiculo == 'BERCO') {
        mnt_smt_cod = 'atv_trp_berco'
    }if (dados.veiculo == 'INCUBADORA') {
        mnt_smt_cod = 'atv_trp_incubadora'
    }if (dados.veiculo == 'MACA') {
        mnt_smt_cod = 'atv_trp_maca'
    }
    if(dados.acom_familiar == null || dados.acom_familiar == undefined){
        dados.acom_familiar = ''
    }
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
    let mnt_smt_nomeA = `TRP - Transporte de Paciente com `+dados.veiculo+` DESTINO: `+nome_destino+` Pac: `+dados.paciente+`.`
    let corpo = `
    <schedule>
    <image>
            <id>6278447</id>
            <description>normal</description>
            <mediaType>1</mediaType>
            <publicUrl>https://louvre.umov.me/media/show/6278447?1591042617427</publicUrl>
            <status>2</status>
        </image>
        <serviceLocal>
            <alternativeIdentifier>`+Destino+`</alternativeIdentifier>
        </serviceLocal>
        <team>
            <alternativeIdentifier>eqp_transporte</alternativeIdentifier>
        </team>
        <activitiesOrigin>4</activitiesOrigin>
        <teamExecution >1</teamExecution >
        <date>`+dataAtualFormatada()+`</date>
        <hour>`+horaAtualFormatada()+`</hour>
        <activityRelationship>
            <activity>
                <alternativeIdentifier>`+mnt_smt_cod+`</alternativeIdentifier>
            </activity>
            <activity>
                <alternativeIdentifier>atv_trp_aceitar</alternativeIdentifier>
            </activity>
            <activity>
                <alternativeIdentifier>atv_trp_iniciar</alternativeIdentifier>
            </activity>
        </activityRelationship>
        <observation>`+mnt_smt_nomeA+`</observation>
        <priority>2</priority>
        <customFields>
            <uni.ds_unid_destino>`+nome_destino+`</uni.ds_unid_destino>
            <uni.ds.unid_local_destino></uni.ds.unid_local_destino>
            <uni.cd_unid_destino>`+Destino+`</uni.cd_unid_destino>
            <uni.cd.unid_local_destino></uni.cd.unid_local_destino>
            <pac.cd_paciente>`+dados.prontuario+`</pac.cd_paciente>
            <pac.nm_paciente>`+dados.paciente+`</pac.nm_paciente>
            <pac.sn_vip></pac.sn_vip>
            <con.cd_convenio></con.cd_convenio>
            <con.nm_convenio></con.nm_convenio>
            <usr.cd_login></usr.cd_login>
            <tarefa.desc>teste</tarefa.desc>
            <pac.cd_atendimento>`+dados.atendimento+`</pac.cd_atendimento>
            <pac.dt_nascimento>`+dados.data_nasc+`</pac.dt_nascimento>
            <tarefa.classif>`+dados.isolamento+`</tarefa.classif>
            <cmp.nm_solic>`+dados.tipo_isolamento+`</cmp.nm_solic>
            <tsk_o2>`+dados.uso_o2+`</tsk_o2>
            <tsk_checkout></tsk_checkout>
            <tsk_carrinho></tsk_carrinho>
            <tsk_higienizado></tsk_higienizado>
            <tsk_completo></tsk_completo>
            <tsk_ramal>7070</tsk_ramal>
            <tsk_nm_classificacao></tsk_nm_classificacao>
            <tsk_cd_classificacao></tsk_cd_classificacao>
            <tsk_enfermeiro>`+dados.acom_enf+`</tsk_enfermeiro>
            <tsk_familiar>`+dados.acom_familiar+`</tsk_familiar>
            <tsk_prioridade>2</tsk_prioridade>
            <cad_solic_concatenados></cad_solic_concatenados>
            <tsk.ventilacao>`+dados.vent_mec+`</tsk.ventilacao>
            <tsk.isolamento>`+dados.uso_o2+`</tsk.isolamento>
            <tsk.motivo_urgente></tsk.motivo_urgente>
            <tsk.tipo_isolamento>`+dados.tipo_isolamento+`</tsk.tipo_isolamento>
            <cmp_transporte_equipamento></cmp_transporte_equipamento>
            <cd_leito>`+dados.cod_sala+`</cd_leito>
            <nm_leito>`+dados.sala+`</nm_leito>
            <tsk.o2_litros></tsk.o2_litros>
        </customFields>
    </schedule>
    `
    let url_data = "https://api.umov.me/CenterWeb/api/26347e33d181559023ab7b32150ca3bfbc572e/schedule.xml";             
    var config = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    };
    console.log(corpo)
    axios.post(url_data, {
        data: corpo
    }, config).then((val)=>{
        let xmlDeCriacao = document.createElement('div')
        xmlDeCriacao.innerHTML = val.data
        let numeroTarefa = xmlDeCriacao.children[0].children[1].innerText
        console.log(numeroTarefa)
        let linkXmlTarefa = 'https://api.umov.me/CenterWeb/api/26347e33d181559023ab7b32150ca3bfbc572e/schedule/'+numeroTarefa+'.xml'
        axios.get(linkXmlTarefa).then((val)=>{
            let xmlDaTarefa = document.createElement('div')
            xmlDaTarefa.innerHTML = val.data
            // console.log(xmlDaTarefa)
            let atividadesUm   = xmlDaTarefa.children[0].children[15].children[0].innerHTML
            // let atividadesDois = xmlDaTarefa.children[0].children[21].children[0].children[0].id
            // let atividadesTres = xmlDaTarefa.children[0].children[21].children[0].children[0].children[0].id
            console.log(atividadesUm)
            // console.log(atividadesDois)
            // console.log(atividadesTres)
            axios.post(y+'/api/moinhos/agendar/tarefa/'+dados.acess_number, {
                numero_tarefa: numeroTarefa,
                imagem_cadeira: 'cadeira-de-rodas-amarelo.png'
            })
            .then(function (response) {
                $('#modalTransporte').modal('hide')
                //VERIFICA SE VAI ATUALIZAR A PAGINA DE ACORDO COM OS CARDS
                var configuracaoDeRequisicao = {
                    headers: {
                        'Retry-After': 3000
                    } 
                }
                const checaImagem = async ()=>{
                    const buscarDados = setInterval(() => {
                        let linkXmlConsultaImagem = 'https://api.umov.me/CenterWeb/api/26347e33d181559023ab7b32150ca3bfbc572e/schedule/'+numeroTarefa+'.xml'
                        axios.get(linkXmlConsultaImagem).then((val)=>{
                            let xmlDaTarefa = document.createElement('div')
                            xmlDaTarefa.innerHTML = val.data
                            let StatusTarefa   = xmlDaTarefa.children[0].children[15].children[0].innerText
                            console.log(StatusTarefa)
                            if(StatusTarefa != '50' && StatusTarefa != '70'){
                                clearInterval(buscarDados)
                                checaImagem()
                            }
                        })
                    }, 3000);
                };checaImagem()
            })
            .catch(function (error) {
                $('#modalTransporte').modal('hide')
                $('#modalAlgoErrado').modal('show')
                console.log(error);
            });
            // /api/moinhos/agendar/tarefa/{acess_number}
        })
    }).catch(function(error) {
        $('#modalTransporte').modal('hide')
        $('#modalAlgoErrado').modal('show')
        console.log(error);
    }) 
}