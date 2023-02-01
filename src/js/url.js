export function url(){
    return 'http://164.152.41.164:5000' //AMBIENTE DE TESTES
    //return 'http://144.22.147.249:5000'  //AMBIENTE DE PRODUÇÃO 
}

export function token(){
    const urlParams = new URLSearchParams(window.location.search);

    return urlParams.get('token')
}