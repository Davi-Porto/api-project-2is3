window.addEventListener('DOMContentLoaded', (e)=>{
    localStorage.removeItem('lastStart');
    localStorage.removeItem('lastEnd');
    refreshContent();
});

seeMore.addEventListener('click', (e)=>{
    e.preventDefault();
    refreshContent();
});

refresh.addEventListener('click', (e)=>{
    clearContent();
    refreshContent();
    searchInput.value="";
});

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
            img.src="assets/no-photo.jpg";
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
            img.src="assets/no-photo.jpg";
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

searchInput.addEventListener('focus', async function(){
    const tooltip = new bootstrap.Tooltip(this, {
        placement: 'bottom',
        trigger: 'manual',
        title: '.',
        offset: [0, 15]
    });
    var hideBefore=false;
    this.addEventListener('focusout', (e)=>{
        tooltip.hide();
        hideBefore=true;
    });
    this.setAttribute('readonly','');
    await Sleep(200);
    this.removeAttribute('readonly');
    if(!hideBefore){
        tooltip.show();
        tooltip.tip.querySelector('.tooltip-inner').innerHTML=tratandoSearch(this.value);
        this.addEventListener('input', (e)=>{
            e.preventDefault();
            if(this.value!=""){
                let searchComplete=tratandoSearch(this.value, 's');
                if(tooltip.tip){
                    tooltip.tip.querySelector('.tooltip-inner').innerHTML=searchComplete;
                }
            }else{
                refresh.dispatchEvent(new Event('click'));
            }
        });
    }
});