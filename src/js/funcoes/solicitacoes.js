import { umovFinalizar } from "../solicitarTransporteFinal.js";
import { umov } from "../solicitarTransporte.js";
import { url } from "../url.js";
import socket from "../websocket.js";
import { usuarioLogado } from "./usuario.js";
import { token } from "../url.js";
const config = {
    headers: { Authorization: `Bearer ${token()}` }
};
var y  =  url()
const solicitacoes = ()=>{
    //ABRE MODAL DE SOLICITAÇÃO DE TRANSPORTE FINAL
    $('body').on('click', '#solicitarTransporteFinal', function(evento){
        //ABRE MODAL
        $('#modalTransporteFinal').modal('show')
        let ID = $(this).data('id')
        let valor =  document.querySelector('#solicitar-update-'+ID)
        let codigo_ui =  document.querySelector('#codigo_ui-'+ID)
        let unidade_internacao =  document.querySelector('#unidade_internacao-'+ID)

        // addOptionTransporteFinal(unidade_internacao.value, codigo_ui.value+'_'+unidade_internacao.value)
        // function addOptionTransporteFinal(key, valor){
        //     let option = new Option(key, valor, true, true)
        //     let transporteFinal = document.getElementById("selectTransporteFinal")
        //     transporteFinal.add(option)
        // }
        let botao = $(".botaoTransporteFinal")
        let form =  document.getElementById("formTransporteFinal")
        $("#formTransporteFinal").submit(function (event) {
            event.preventDefault()
            if (form.checkValidity()) {
                botao.attr('disabled', 'disabled');
            }
            umovFinalizar(valor.value, formTransporteFinal.sala.value)
        })
    });

    $('body').on('click', '#fecharTransporteFinal', function(event){
        window.location.reload()
    })

    //ABRE MODAL DE SOLICITAÇÃO DE TRANSPORTE
    $('body').on('click', '#solicitarTransporte', function(evento){
        //ABRE MODAL
        $('#modalTransporte').modal('show')
        let ID = $(this).data('id')
        let valor =  document.querySelector('#solicitar-update-'+ID)
        let botao = $(".botaoTransporteinicial")
        let form = document.getElementById("formTransporte")
        $("#formTransporte").submit(function (event) {
            event.preventDefault()
            if (form.checkValidity()) {
                botao.attr('disabled', 'disabled');
            }
            umov(valor.value, formTransporte.sala.value)
        })
    })

    $("#formRealizarExame").submit(function(event){
        event.preventDefault()
        //PEGA O JSON DO CARD E ENVIA A REQUISIÇÃO DE ALTERAÇÃO
        let ID = formRealizarExame.valorIdRealizarExame.value
        let update = document.querySelector("#solicitar-update-" + ID);
        let valor = update.value;
        let val = JSON.parse(valor);
            let sala = formRealizarExame.sala.value
            let salaEnvio = sala.split('_')
        axios.post(y+'/api/moinhos/atendimento', {
            acess_number: ID,
            codigo_setor_exame: val.codigo_setor_exame,
            cod_sala : salaEnvio[0],
            sala : salaEnvio[1],
            user: usuarioLogado()
        }, config)
        .then(function (response) {
            $('#modalAtendimentoSucesso').modal('show')
            console.log('teste')
            // //ATRIBUI OS VALORES DOS COUNT's
            // let SolicitadosCount = document.getElementById("AgendadosCount");
            // let AgendadosCount = document.getElementById("AtendimentoCount");
            // $("#SolicitadosCount").text((+SolicitadosCount.innerText.replace(/\s/g, '')) - 1)
            // $("#AgendadosCount").text((+AgendadosCount.innerText.replace(/\s/g, '')) + 1)
            socket.emit('cardRender', 'foi')
        })
        .catch(function (error) {
            $('#modalAlgoErrado').modal('show')
            console.log(error);
        });
    })
}

export default solicitacoes