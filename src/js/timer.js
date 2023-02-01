export function timer(acess_number, identificador, ) {
    if(identificador == 0){
        const timer = async ()=>{
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
            }, 60000);
        };timer()
    }
}