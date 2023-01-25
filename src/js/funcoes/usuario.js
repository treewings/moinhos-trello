export function usuarioLogado(){
    const urlParams = new URLSearchParams(window.location.search);
    const usuario =  urlParams.get('user')
    return usuario
}