const filtro = (setor, sala)=>{
    let selectSetorExame = setor
    Object.entries(selectSetorExame).forEach(function(key, valor){
        addOptionSetorExame(key, valor)
    });
    
    function addOptionSetorExame(key, valor){
        let option = new Option(key[1],  key[0])
        let select = document.getElementById("selectSetorExame")
        select.add(option)
    }

    
    if(sala != ''){
        Object.entries(sala).forEach(function(key, valor){
            addOptionSala(key, valor)
        });
        
        function addOptionSala(key, valor){
            let option = new Option(key[1],  key[0])
            let select = document.getElementById("filtroSala")
            select.add(option)
        }
    }
}


export default filtro