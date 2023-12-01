const add = document.getElementById("btnAdd");
const deleteBtn = document.getElementById('deleteBtn');
const deleteModal = document.getElementById('deleteConfirm');
const updateModal = document.getElementById('updateModal');
const addModal = document.getElementById('addModal');
const updateForm = document.getElementById('updateForm');
const addForm = document.getElementById('addForm');
let activeCardEdit=undefined;

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
            body: JSON.stringify(product)
        })
    .then(res=> res.json())
    .then((data)=> {
        if(data.success){
            stts.success = true;
            stts.msg="Produto criado com sucesso! (Atualizando...)";
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

deleteBtn.addEventListener('click', (e)=>{
    removeProduct(deleteModal.querySelector('#idToDelete').value);
});

addModal.addEventListener('show.bs.modal', (e)=>{
    let nm = e.target.querySelector("#nmToAdd");
    let vl = e.target.querySelector("#vlToAdd");
    let src = e.target.querySelector("#srcToAdd");
    let img = e.target.querySelector("#imgToAdd");
    src.value="";
    nm.value="";
    vl.value="";
    src.addEventListener('input', (e)=>{
        if(linkValidation(src.value)){
            img.src=src.value;
        }else{
            img.src="assets/no-photo.png";
        }
    });
});

updateModal.addEventListener('show.bs.modal', (e)=>{
    let id = e.target.querySelector("#idToUpdate");
    let img = e.target.querySelector("#imgToUpdate");
    let src = e.target.querySelector("#srcToUpdate");
    let nm = e.target.querySelector("#nmToUpdate");
    let vl = e.target.querySelector("#vlToUpdate");
    let cardActive = activeCardEdit;
    id.value=cardActive.value;
    img.src=cardActive.querySelector(".card-img-top").src;
    src.value=cardActive.querySelector(".card-img-top").src;
    nm.value=cardActive.querySelector(".card-text>span:nth-child(1)>span").innerHTML;
    vl.value=parseFloat(cardActive.querySelector(".card-text>span:nth-child(2)>span").innerHTML.replace(/[R\$\s\.]+/g,'').replace(",", "."))
    src.addEventListener('input', (e)=>{
        if(linkValidation(src.value)){
            img.src=src.value;
        }else{
            img.src="assets/no-photo.png";
        }
    });
});

addForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    let id = e.target.querySelector("#idToAdd");
    let img = e.target.querySelector("#imgToAdd");
    let src = e.target.querySelector("#srcToAdd");
    let nm = e.target.querySelector("#nmToAdd");
    let vl = e.target.querySelector("#vlToAdd");
    product={
        nome: nm.value,
        valor: parseFloat(vl.value),
        foto: (linkValidation(src.value)==true)?src.value:"",
    }
    addProduct(product);
    bootstrap.Modal.getOrCreateInstance(addModal).hide();
});

updateForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    let id = e.target.querySelector("#idToUpdate");
    let src = e.target.querySelector("#srcToUpdate");
    let nm = e.target.querySelector("#nmToUpdate");
    let vl = e.target.querySelector("#vlToUpdate");
    product={
        id: id.value.replace(/\D+/, ''),
        nome: nm.value,
        valor: parseFloat(vl.value),
        foto: (linkValidation(src.value)==true)?src.value:"",
    }
    changeProduct(product);
    bootstrap.Modal.getOrCreateInstance(updateModal).hide();
});