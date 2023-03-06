export function url(){
    // return 'http://144.22.147.249:8000' //AMBIENTE DE TESTES
    return 'http://192.168.11.12:8008'  //AMBIENTE DE PRODUÇÃO 
}

export function token(){
    const urlParams = new URLSearchParams(window.location.search);

    return urlParams.get('token')
}