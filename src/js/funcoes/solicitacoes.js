import { umovFinalizar } from "../solicitarTransporteFinal.js";
import { umov } from "../solicitarTransporte.js";
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
        $("#formTransporteFinal").submit(function (event) {
            event.preventDefault()
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
        $("#formTransporte").submit(function (event) {
            event.preventDefault()
            umov(valor.value, formTransporte.sala.value)
            
        })
    })
}

export default solicitacoes