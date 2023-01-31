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
        $('#botaoSolicitaPos').prop('disabled', false);;
        let ID = $(this).data('id')
        window.localStorage.setItem('numberPos', ID)

    });

    $("#formTransporteFinal").submit(function (event) {
        event.preventDefault()
        let valor = $('#selectTransporteFinal').val()
        let acess_number = window.localStorage.getItem('numberPos')
        let valors =  document.querySelector('#solicitar-update-'+acess_number)
        $('#botaoSolicitaPos').attr('disabled','disabled');
        umovFinalizar(valors.value, valor)
    })

    //ABRE MODAL DE SOLICITAÇÃO DE TRANSPORTE
    $('body').on('click', '#solicitarTransporte', function(evento){
        //ABRE MODAL
        $('#modalTransporte').modal('show')
        $('#botaoSolicitarTransportes').prop('disabled', false);;
        let ID = $(this).data('id')
        window.localStorage.setItem('number', ID)
        console.log(ID)        
    })


    $("#formTransporte").submit(function (event) {
        event.preventDefault()
        let valor = $('#selecioneTransporte').val()
        let acess_number = window.localStorage.getItem('number')
        console.log(valor)
        console.log(acess_number)
        let valors =  document.querySelector('#solicitar-update-'+acess_number)
        $('#botaoSolicitarTransportes').attr('disabled','disabled');
     
        umov(valors.value, valor)
    })

    $("#formRealizarExame").submit(function(event){
        event.preventDefault()
        $('#agendarSolicitarAtendimento').attr('disabled', 'disabled')
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
            $('#agendarSolicitarAtendimento').prop('disabled', false);
            $('#modalSalaRealizarExame').modal('hide')
            console.log('teste')
            socket.emit('cardRender', 'foi')
            setTimeout(async () => {
                $('#modalAtendimentoSucesso').modal('hide')
            }, 900);
        })
        .catch(function (error) {
            $('#modalAlgoErrado').modal('show')
            console.log(error);
        });
    })
}

export default solicitacoes