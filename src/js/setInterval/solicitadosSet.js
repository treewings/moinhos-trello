import socket from "../websocket.js";
import { url } from "../url.js";
import { usuarioLogado } from "../funcoes/usuario.js";
import { token } from "../url.js";

const config = {
    headers: { Authorization: `Bearer ${token()}` }
};
//VERICIFA SE EXISTE UM NOVO SOLICITADO
const solicitadosSet = async ()=>{
    const buscarDados = setInterval(() => {
        axios.get(url()+'/api/moinhos/diferenca', config)
        .then((val)=>{
            val.data.solicitados.forEach((val)=>{
                solicitadosVal.push(val)
            })
            if(val.data.solicitados != ''){
                socket.emit('cardRender', 'foi')
            }
        }).catch((error)=>{
            clearInterval(buscarDados)
            solicitadosSet()
        })
    }, 120000);
}

export default solicitadosSet