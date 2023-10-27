const content = document.getElementById("content-load");
const seeMore = document.getElementById("seeMore");
const refresh = document.getElementById("btnRefresh");
const add = document.getElementById("btnAdd");
const deleteBtn = document.getElementById('deleteBtn');
const deleteModal = document.getElementById('deleteConfirm');
const updateModal = document.getElementById('updateModal');
const addModal = document.getElementById('addModal');
const updateForm = document.getElementById('updateForm');
const addForm = document.getElementById('addForm');
let activeCardEdit=undefined;
var cards=[];

const Sleep = t => new Promise(res => setTimeout(res, t));

function refreshContent(){
    let products;
    var start=(localStorage.getItem("lastStart")==null) ? 0 : parseInt(localStorage.getItem("lastStart")) + 8;
    var end=(localStorage.getItem("lastEnd")==null) ? 7 : parseInt(localStorage.getItem("lastEnd")) + 8;
    localStorage.setItem("lastStart", start);
    localStorage.setItem("lastEnd", end);
    fetch('https://profrodolfo.com.br/api/listar/').then(data=>{ return data.json() }).then(data=>{
        products = data;
        if(products){
            return {
                products: products,
                first: start,
                last: end,
            }
        }
    }).then(res => {
        res.products.forEach((v, i)=>{
            if(i>=res.first&&i<=res.last){
                addCard(v, res);
            }
        });
    });
}


function addCard(v, res){
    cardLoading().then(async (load) => {
        let card = document.querySelector('#card > .col').cloneNode(true);
        card.querySelector(".card").value=v.id;
        if(linkValidation(v.foto)){
            card.querySelector(".card-img-top").src=v.foto;
        }
        card.querySelector(".card-text>span:nth-child(1)").title=v.nome;
        card.querySelector(".card-text>span:nth-child(1)>span").innerHTML=v.nome;
        card.querySelector(".card-text>span:nth-child(2)").title='R$ '+(v.valor.replace('.', ','));
        card.querySelector(".card-text>span:nth-child(2)>span").innerHTML='R$ '+convertBR(v.valor);
        endList(res, card);
        await Sleep(500);
        content.removeChild(load);
        content.appendChild(card);
    });
}


function endList(res, card, op){
    if(res&&res.first!=0){
        let rect = content.querySelector('.col:nth-child('+(res.first+1)+')').getBoundingClientRect();
        window.scroll({
            top: rect.top,
            left: 0,
            behavior: "smooth"
        });
    }
    if(op==true){
        seeMore.hidden=true;
    }else if(op==false){
        seeMore.hidden=false;
    }else{
        if(res.products[res.products.length-1].id===card.querySelector('.card').value){
            endList(undefined, undefined, true);
        }
    }
}

async function cardLoading(){
    let load = document.querySelector('#loading > .col').cloneNode(true);
    content.appendChild(load);
    await Sleep(10);
    return load;
}

function clearContent(){
    while(content.lastChild){
        content.removeChild(content.lastChild);
    }
    localStorage.removeItem("lastStart");
    localStorage.removeItem("lastEnd");
    endList(undefined, undefined, false);
}

function removeProduct(id){
    stts={
        success: false,
        msg: "Algum erro ocorreu com a operação, atualize e tente novamante!"
    }
    if(id){
        listByID(id).then(data=>{
            if(data!=null && data.id==id){
                fetch('https://profrodolfo.com.br/api/delete/'+id).then(res=>res.json()).then(stat=>{
                    if(stat.success){
                        stts.success = true;
                        stts.msg="Produto removido com sucesso! (Atualizando...)";
                    }else{
                        stts.msg=stat.message;
                    }
                    let msg = statusMsg(stts);
                    msg.addEventListener('hide.bs.toast', (e)=>{
                        clearContent();
                        refreshContent();
                    });
                });
            }else{
                stts.msg = "Parece que o produto que esta tentando excluir não existe...<br>Atualize a lista.";
                statusMsg(stts);
            }
        });
    }
}

function showDeleteModal(e){
    let cardDelete = e.parentNode.parentNode;
    deleteModal.querySelector("#imgToDelete").src=cardDelete.querySelector("img").src;
    deleteModal.querySelector("#idToDelete").value=cardDelete.value;
    deleteModal.querySelector("#nmToDelete").value=cardDelete.querySelector(".card-text>span:nth-child(1)>span").innerHTML;
    deleteModal.querySelector("#vlToDelete").value=cardDelete.querySelector(".card-text>span:nth-child(2)>span").innerHTML;
}

function linkValidation(url='') {
    let gab = /^(https?\:\/\/[A-z0-9\-]+[\.A-z0-9]+\/\S*)|(data\:image\/(png|jpg|jpeg|webp|gif|bmp)\;base64\,\S+)$/;
    if (gab.test(url)) {
        return true;
    } else {
        return false;
    }
}

function convertBR(texto=''){
    if(!/^\d+\.|\,\d{2}$/.test(texto)){
        texto+='00';
    }
    let cdu = texto.replace(/\.|\,/g, '').split('').reverse();
    let decimal = ","+cdu[1]+cdu[0];
    cdu.shift();
    cdu.shift();
    cdu=cdu.join('').split(/(\d{3})/);
    let strRet=[];
    cdu.forEach(v=>{
        if(v!=""){
            strRet.push(v.split('').reverse().join(''));
        }
    });
    return strRet.reverse().join(".")+decimal;
}

function listByID(id){
    if(id){
        if(typeof(id)=='number'){
            id=String(id);
        }
        if(typeof(id)=='string'){
            return fetch('https://profrodolfo.com.br/api/listar/'+id).then(res=>res.json()).then(data=>{ return (data[0].id!=0)?data[0]:null });
        }
    }
    return null;
}

function statusMsg(stts){
    if(typeof(stts)=='object'&&stts.success!=undefined&&stts.msg!=""){
        let toast = document.getElementById('toastNotification').cloneNode(true);
        toast.id="";
        if(stts.success){
            toast.classList.add('text-bg-success');
        }else{
            toast.classList.add('text-bg-danger');
        }
        toast.querySelector('.toast-body').innerHTML=stts.msg;
        bootstrap.Toast.getOrCreateInstance(toast).show();
        document.querySelector('main').appendChild(toast);
        toast.addEventListener('hidden.bs.toast', ()=>{
            toast.parentNode.removeChild(toast);
        });
        return toast;
    }
}

function changeActiveCard(e){
    activeCardEdit=e;
}

function changeProduct(product){
    let stts={
        success: false,
        msg: "Erro ao editar o produto, atualize e tente novamente!"
    }
    fetch('https://profrodolfo.com.br/api/update/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
    .then(res=> res.json())
    .then((data)=> {
        if(data.success){
            stts.success = true;
            stts.msg="Produto alterado com sucesso! (Atualizando...)";
        }else{
            stts.msg=stat.message;
        }
        let msg = statusMsg(stts);
        msg.addEventListener('hide.bs.toast', (e)=>{
            clearContent();
            refreshContent();
        });
    });
}

function addProduct(product){
    let stts={
        success: false,
        msg: "Erro ao criar o produto, atualize e tente novamente!"
    }
    fetch('https://profrodolfo.com.br/api/put/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoProduto)
        })
    .then(res=> res.json())
    .then((data)=> {
        if(data.success){
            stts.success = true;
            stts.msg="Produto alterado com sucesso! (Atualizando...)";
        }else{
            stts.msg=stat.message;
        }
        let msg = statusMsg(stts);
        msg.addEventListener('hide.bs.toast', (e)=>{
            clearContent();
            refreshContent();
        });
    });
}