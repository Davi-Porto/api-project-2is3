// document.body.addEventListener('click', (e)=>{
//     let newItem = {
//         nome: "test-item",
//         valor: 66.96,
//         foto: "data:image/jpeg;base64,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"
//     }
//     fetch('https://profrodolfo.com.br/api/put/', {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(newItem)
//         })
//     .then(res=> res.json())
//     .then((data)=> {
//         console.log(data);
//     });
// });

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
});

deleteBtn.addEventListener('click', (e)=>{
    removeProduct(deleteModal.querySelector('#idToDelete').value);
});

// addModal.addEventListener('show.bs.modal', (e)=>{
//     let img = e.target.querySelector("#imgToAdd");
//     let src = e.target.querySelector("#srcToAdd");
//     let nm = e.target.querySelector("#nmToAdd");
//     let vl = e.target.querySelector("#vlToAdd");
// });

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
        if(linkValidation(e.target.value)){
            img.src=e.target.value;
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
        valor: vl.value.replace(/\D+/, ''),
        foto: linkValidation(src.value)?src.value:"",
    }
    addProduct(product);
});

updateForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    let id = e.target.querySelector("#idToUpdate");
    let img = e.target.querySelector("#imgToUpdate");
    let src = e.target.querySelector("#srcToUpdate");
    let nm = e.target.querySelector("#nmToUpdate");
    let vl = e.target.querySelector("#vlToUpdate");
    product={
        id: id.value.replace(/\D+/, ''),
        nome: nm.value,
        valor: vl.value.replace(/\D+/, ''),
        foto: (linkValidation(src.value))?src.value:"",
    }
    changeProduct(product);
    bootstrap.Modal.getOrCreateInstance(updateModal).hide();
});
