export function url(){
    // return 'http://144.22.147.249:8000' //AMBIENTE DE PRODUÇÃO
    return 'http://144.22.147.249:5000'  //AMBIENTE DE TESTES
}

export function token(){
    const urlParams = new URLSearchParams(window.location.search);

    return urlParams.get('token')
}