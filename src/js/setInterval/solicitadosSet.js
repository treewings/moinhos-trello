import socket from "../websocket.js";
import { url } from "../url.js";
import { usuarioLogado } from "../funcoes/usuario.js";
//VERICIFA SE EXISTE UM NOVO SOLICITADO
const solicitadosSet = async ()=>{
    const buscarDados = setInterval(() => {
        axios.get(url()+'/api/moinhos/diferenca')
        .then((val)=>{
            val.data.solicitados.forEach((val)=>{
                solicitadosVal.push(val)
            })
            if(val.data.solicitados != ''){
                socket.emit('cardRender', 'foi')
            }
        }).catch((error)=>{
            clearInterval(buscarDados)
            busca()
        })
    }, 30000);
}

export default solicitadosSet