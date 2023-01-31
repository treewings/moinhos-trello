import socket from "../websocket.js";
import rodar from "../../index.js";
import { usuarioLogado } from "./usuario.js";
import { url } from "../url.js";
import { token } from "../url.js";

const config = {
    headers: { Authorization: `Bearer ${token()}` }
};
 //PEGA A DATA E HORA ATUAL
 function dataAtualFormatada() {
    var data = new Date(),
    dia = data.getDate().toString().padStart(2, '0'),
    mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
    ano = data.getFullYear();
    return ano + "-" + mes + "-" + dia;
}
function dataAtualPadrao() {
    var data = new Date(),
    dia = data.getDate().toString().padStart(2, '0'),
    mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
    ano = data.getFullYear();
    return dia+'/'+mes+'/'+ano;
}
function horaAtualFormatada() {
    let datahora = new Date().toString()
    let dataEhora = datahora.split(" ")
    let horaNformatada = dataEhora[4].split(":")
    return horaNformatada[0]+":"+horaNformatada[1]
}




export default function modalAgendar(item, grid){
    document.getElementById('modalAgendar').style.zIndex = '999'
    document.getElementById('modalAgendar').style.display = 'flex'
    document.getElementById('modalAgendar').innerHTML = `

            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <div>
                            <h5 class="modal-title">Agendar horário de exame</h5>
                            <small>Informe a data e a hora que o exame será realizado.</small>
                        </div>
                        <a id="fecharModalAgendar">
                            <em class="icon ni ni-cross"></em>
                        </a>
                    </div>
                    <div class="modal-body">
                        <form name="form" id="agendarHorario" class="form-validate is-alter">
                            <div class="form-group d-flex flex-column">
                                <div class="col-lg-12 col-sm-12 m-0">
                                    <div class="form-group">
                                        <div class="form-control-wrap">
                                            <label class="form-label m-0" for="outlined-normal">Data de Realização</label>
                                            <input type="date" name="data" class="form-control form-control form-control js-mask-data" id="outlined-normal js-mask-data" >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group d-flex flex-column">
                                <div class="col-lg-12 col-sm-12 m-0">
                                    <div class="form-group">
                                        <div class="form-control-wrap">
                                            <label class="form-label m-0" for="outlined-normal">Hora de Realização</label>
                                            <input type="time" name="hora" class="form-control form-control form-control js-mask-hora" id="outlined-normal js-mask-hora"  placeholder="12:00">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-dim btn-outline-primary" id="marcar-horario">Agendar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

    `

    document.getElementById('fecharModalAgendar').addEventListener('click', ()=>{
        document.getElementById('modalAgendar').style.zIndex = '-1'
        document.getElementById('modalAgendar').style.display = 'none'
        document.getElementById('modalAgendar').innerHTML = ''
        rodar()
    })

  //ATRIBUI O VALOR DA DATA ATUAL NA MODAL
  document.querySelector("[name='data']").value = dataAtualFormatada();
  document.querySelector("[name='hora']").value = horaAtualFormatada();

  console.log(item.item._element.id)
  
 

     //EVENDO DO FOMULÁRIO
     $("#agendarHorario").submit(function (event) {
        event.preventDefault()
        // document.getElementById('modalAgendar').innerHTML = ''
    //     socket.emit('cardRender', 'foi')
    //    console.log('foi')

       let continuar = 'sim';
       //PARA O EVENTO DE ARRASTAR CASSO OS DADOS SEJAM INVÁLIDOS
       if (form.hora.value == null || form.hora.value == '' || form.hora.value == undefined) {
           continuar = 'nao';
           $('#modalHoraValida').modal('toggle')
       }if (form.data.value == null || form.data.value == '' || form.data.value == undefined) {
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
           continuar = 'nao';
           $('#modalHoraValida').modal('toggle')
       }if (+validaHorario[1] > 59) {
           continuar = 'nao';
           $('#modalHoraValida').modal('toggle')
       }
       //VERIFICA SE A HORA INPUTADA NÃO É MENOR QUE A ATUAL
       let horaAtual = horaAtualFormatada().split()
       let horaInputada = hr.split()
       if (horaInputada[0] < horaAtual[0] && dt <= dataAtualPadrao()) {
           continuar = 'nao';
           $('#modalHoraValida').modal('toggle')
       }if ((horaInputada[0] = horaAtual[0] && horaInputada[1] < horaAtual[1]) && dt <= dataAtualPadrao()) {
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
           continuar = 'nao';
           $('#modalDataValida').modal('toggle')
       }
       //FORMATA OS VALORES DAS VARIAVEIS PARA SEREM USADOS
       let dataHoraAgendamento = dt + ' ' + hr;
       //VERIFICA SE PODE CONTINUAR
       if (continuar == 'sim') {
            $('#marcar-horario').attr('disabled','disabled');
       
           // PEGA O VALOR DO ACESS_NUMBER
           let ID = item.item._element.getAttribute('data-id');
           //DEFINE A VARIAVEL QUE RECEBERÁ OS DADOS DO JSON
           let val = '';
               //PEGA O JSON DO CARD E ENVIA A REQUISIÇÃO DE ALTERAÇÃO
               let update = document.querySelector("#solicitar-update-"+ID);
               let valor = update.value;
               val = JSON.parse(valor);
               let imagem = 'cadeira-de-rodas-preto.png'
               axios.post(url()+'/api/moinhos/agendar', {
                   acess_number: ID,
                   dados: val,
                   codigo_setor_exame: val.codigo_setor_exame,
                   data_agendamento: dt,
                   hora_agendamento: hr,
                   imagem_cadeira: imagem,
                   user: usuarioLogado()
               }, config)
               //SE UPDATE REALIZADO COM SUCESSO, FAÇA
               .then(function (response) {
                   //ABRE MODAL DE SUCESSO
                   $('#modalAgendadoSucesso').modal('show')
                    document.getElementById('modalAgendar').style.zIndex = '-1'
                    document.getElementById('modalAgendar').style.display = 'none'
                    document.getElementById('modalAgendar').innerHTML = ''
                    socket.emit('cardRender', 'foi');
                    setTimeout(async () => {
                        $('#modalAgendadoSucesso').modal('hide')
                    }, 900);
               })
               .catch(function (error) {
                   $('#modalAlgoErrado').modal('show')
                   console.log(error);
               });
       }
    });
}