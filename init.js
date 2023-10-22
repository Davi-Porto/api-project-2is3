function show_modal(op1, id){
    let ret=false;
    if(op==0){ // Modal de edição do produto
        if(id&&id!=""){

            ret=true;
        }else{
            console.log('ID inválido');
        }
    }else if(op==1){ // Modal de inserção do produto
        if(id&&id!=""){

            ret=true;
        }else{
            console.log('ID inválido');
        }
        ret=true;
    }
    return ret;
}

// 123, teste