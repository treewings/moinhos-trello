

import socket from "../websocket.js";
import { token } from "../url.js";
import { acesso } from "../../index.js";

const config = {
    headers: { Authorization: `Bearer ${token()}` }
};

//ADICIONA O FILTRO POR SETOR DE EXAME


$(document).ready(function() {

    const selectSetorExame = $('#selectSetorExame');
    const selectSalaExame = $('#selectSalaExame');
    
    let changeEventTriggeredByUser = true;

   
    selectSetorExame.select2({
        
    })
    .on('change', (event) => {

    if (changeEventTriggeredByUser) {
        // Atualiza o valor do selectSalaExame diretamente
        selectSalaExame.val('1');
        
        // Chama o trigger('change') para atualizar o outro select
        changeEventTriggeredByUser = false;
        selectSalaExame.trigger('change');
        changeEventTriggeredByUser = true;
    } else {
        changeEventTriggeredByUser = true;
    }

      var listaSetor  
      const selecions = selectSetorExame.select2('data')
      .map((element) => element.id);        
      listaSetor = selecions.join(',')
      let elemento = window.location.href.split('&')[0]+'&'+window.location.href.split('&')[1] + '&setor='+listaSetor
      history.pushState({}, null, elemento);
      if(acesso().filtro != ''){
          console.log(acesso().filtro)  
          socket.emit('evento-filtro', {filtro: acesso().filtro, config: config, url: window.location.href})
          return
      }
  
      socket.emit('rodar', {config: config})
    });



    
    selectSalaExame.select2({
        
    })
    .on('change', (event) => {

    if (changeEventTriggeredByUser) {
        // Atualiza o valor do selectSetorExame diretamente
        selectSetorExame.val('1');
        
        // Chama o trigger('change') para atualizar o outro select
        changeEventTriggeredByUser = false;
        selectSetorExame.trigger('change');
        changeEventTriggeredByUser = true;
    } else {
        changeEventTriggeredByUser = true;
    }

    var elemento
    const selecionsSala = selectSalaExame.select2('data')[0].id; 
    if(selecionsSala == '1'){
        elemento = window.location.href.split('&sala')[0]
        history.pushState({}, null, elemento);
    }else{
        elemento = window.location.href.split('&')[0]+'&'+window.location.href.split('&')[1] + '&sala='+selecionsSala
        history.pushState({}, null, elemento);
        if(acesso().filtro != ''){
            socket.emit('evento-filtro', {filtro: acesso().filtro, config: config, url: window.location.href})
            return
        }
    
        socket.emit('rodar', {config: config})
    }
  })



  });


const urlParams = new URLSearchParams(window.location.search);

//ADICIONA OS ITENS SELECIONADOS NOS CARDS
let TodosSetores = urlParams.get('setor')
let selectTodosSetores =  TodosSetores ? TodosSetores.split(',') : []
selectTodosSetores.forEach(function(setor){
    if(setor == '19'){
    var select = document.getElementById('selectSetorExame');
    var text = select.options[0]
    text.setAttribute('selected', '')
    }
    if(setor == '20'){
        var select = document.getElementById('selectSetorExame');
        var text = select.options[1]
        text.setAttribute('selected', '')
    }
    if(setor == '23'){
        var select = document.getElementById('selectSetorExame');
        var text = select.options[2]
        text.setAttribute('selected', '')
    }
    if(setor == '24'){
        var select = document.getElementById('selectSetorExame');
        var text = select.options[3]
        text.setAttribute('selected', '')
    }
    if(setor == '26'){
        var select = document.getElementById('selectSetorExame');
        var text = select.options[4]
        text.setAttribute('selected', '')
    }if(setor == '30'){
        var select = document.getElementById('selectSetorExame');
        var text = select.options[5]
        text.setAttribute('selected', '')
    }if(setor == '34'){
        var select = document.getElementById('selectSetorExame');
        var text = select.options[6]
        text.setAttribute('selected', '')
    }
})

let salaURL = urlParams.get('sala')
//ADICIONA OS ITENS SELECIONADOS NOS CARDS
console.log(salaURL)
if(urlParams.get('sala') == '1'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[0]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-169'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[1]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-170'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[2]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-168'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[3]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-61'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[4]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-130'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[5]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-46'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[6]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-60'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[7]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-7'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[8]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-8'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[9]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-121'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[10]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-20'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[11]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-9'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[12]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-6'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[13]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-45'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[14]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-118'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[15]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-38'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[16]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-19'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[17]
    text.setAttribute('selected', '')
}if(urlParams.get('sala') == '999-44'){
    var select = document.getElementById('selectSalaExame');
    var text = select.options[18]
    text.setAttribute('selected', '')
}

